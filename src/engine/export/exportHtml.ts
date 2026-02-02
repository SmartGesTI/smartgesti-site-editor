/**
 * HTML Exporter
 * Exporta SiteDocumentV2 para HTML estático
 */

import { SiteDocumentV2, SitePage, Block } from "../schema/siteDocument";
import { generateThemeCSSVariables, ThemeTokens } from "../schema/themeTokens";
import { PLACEHOLDER_IMAGE_URL } from "../presets/heroVariations";
import { sanitizeHtml } from "./sanitizeHtml";
import { hashDocument } from "../../utils/documentHash";
import {
  resolveNavbarStyles,
  resolveHeroButtonStyles,
  mergeStyles,
  applyOpacityToColor,
} from "./styleResolver";

/**
 * Cache de HTML com limite LRU (Last Recently Used)
 * Limite de 50 entradas para evitar memory leak
 */
const htmlCache = new Map<string, { html: string; timestamp: number }>();
const MAX_CACHE_SIZE = 50;

/**
 * Limpa entradas antigas do cache quando excede o limite
 */
function cleanCache() {
  if (htmlCache.size <= MAX_CACHE_SIZE) return;

  // Ordenar por timestamp e remover os mais antigos
  const entries = Array.from(htmlCache.entries()).sort(
    (a, b) => a[1].timestamp - b[1].timestamp,
  );

  const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
  toRemove.forEach(([key]) => htmlCache.delete(key));
}

/**
 * Reescreve href para o basePath do site (ex.: /site ou /site/escola/:slug)
 */
function resolveHref(href: string, basePath?: string): string {
  if (!basePath || !href.startsWith("/site")) return href;
  return basePath + href.slice(5); // '/site' -> basePath, resto igual
}

/**
 * Verifica se o href é link interno do site (navega para outra página do site).
 * Âncoras (#courses, #contact) não são consideradas link interno (scroll na mesma página).
 */
function isInternalSiteLink(href: string, basePath?: string): boolean {
  if (!href || href === "#") return false;
  if (href.startsWith("#")) return false; // âncora na mesma página
  if (href.startsWith("/site")) return true;
  if (basePath && href.startsWith(basePath)) return true;
  return false;
}

/**
 * Retorna target="_top" para links internos do site (navega na janela principal);
 * para âncoras ou links externos retorna vazio.
 */
function linkTargetAttr(href: string, basePath?: string): string {
  const resolved =
    basePath && href.startsWith("/site") ? resolveHref(href, basePath) : href;
  return isInternalSiteLink(resolved, basePath) ? ' target="_top"' : "";
}

/**
 * Renderiza um bloco diretamente para HTML (sem React)
 */
function blockToHtmlDirect(
  block: Block,
  depth: number = 0,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const dataBlockId = `data-block-id="${escapeHtml(block.id)}"`;

  switch (block.type) {
    case "container": {
      const {
        maxWidth = "1200px",
        padding = "1rem",
        children = [],
      } = (block as any).props;
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      return `<div ${dataBlockId} style="max-width: ${maxWidth}; padding: ${padding}; margin: 0 auto;">${childrenHtml}</div>`;
    }
    case "stack": {
      const {
        direction = "col",
        gap = "1rem",
        align = "stretch",
        justify = "start",
        wrap = false,
        children = [],
      } = (block as any).props;
      const flexDirection = direction === "row" ? "row" : "column";
      const alignItems =
        align === "start"
          ? "flex-start"
          : align === "end"
            ? "flex-end"
            : align === "center"
              ? "center"
              : "stretch";
      const justifyContent =
        justify === "start"
          ? "flex-start"
          : justify === "end"
            ? "flex-end"
            : justify === "center"
              ? "center"
              : justify === "space-between"
                ? "space-between"
                : "space-around";
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      return `<div ${dataBlockId} style="display: flex; flex-direction: ${flexDirection}; gap: ${gap}; align-items: ${alignItems}; justify-content: ${justifyContent}; flex-wrap: ${wrap ? "wrap" : "nowrap"};">${childrenHtml}</div>`;
    }
    case "grid": {
      const { cols = 3, gap = "1rem", children = [] } = (block as any).props;
      const gridCols =
        typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 3;
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      return `<div ${dataBlockId} style="display: grid; grid-template-columns: repeat(${gridCols}, 1fr); gap: ${gap};">${childrenHtml}</div>`;
    }
    case "box": {
      const {
        bg,
        border,
        radius,
        shadow,
        padding = "1rem",
        children = [],
      } = (block as any).props;
      const style = [
        bg ? `background-color: ${bg}` : "",
        border ? `border: ${border}` : "",
        radius ? `border-radius: ${radius}` : "",
        shadow ? `box-shadow: ${shadow}` : "",
        padding ? `padding: ${padding}` : "",
      ]
        .filter(Boolean)
        .join("; ");
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      return `<div ${dataBlockId} style="${style}">${childrenHtml}</div>`;
    }
    case "heading": {
      const { level, text, align = "left", color } = (block as any).props;
      const style = [
        `text-align: ${align}`,
        color ? `color: ${color}` : "color: var(--sg-text, #1f2937)",
      ]
        .filter(Boolean)
        .join("; ");
      return `<h${level} ${dataBlockId} style="${style}">${escapeHtml(text)}</h${level}>`;
    }
    case "text": {
      const { text, align = "left", color, size = "md" } = (block as any).props;
      const fontSizeMap: Record<string, string> = {
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
      };
      const style = [
        `text-align: ${align}`,
        color ? `color: ${color}` : "color: var(--sg-text, #1f2937)",
        `font-size: ${fontSizeMap[size]}`,
      ]
        .filter(Boolean)
        .join("; ");
      return `<p ${dataBlockId} style="${style}">${escapeHtml(text)}</p>`;
    }
    case "image": {
      const {
        src,
        alt = "",
        width,
        height,
        objectFit = "cover",
      } = (block as any).props;
      const imgSrc = src || PLACEHOLDER_IMAGE_URL;
      const style = [
        width ? `width: ${width}` : "width: 100%",
        height ? `height: ${height}` : "height: auto",
        `object-fit: ${objectFit}`,
      ]
        .filter(Boolean)
        .join("; ");
      const onError = `this.onerror=null;this.src='${escapeHtml(PLACEHOLDER_IMAGE_URL)}';`;
      return `<img ${dataBlockId} src="${escapeHtml(imgSrc)}" alt="${escapeHtml(alt)}" style="${style}" onerror="${onError}" />`;
    }
    case "button": {
      const {
        text,
        href,
        variant = "primary",
        size = "md",
      } = (block as any).props;
      const padding =
        size === "sm"
          ? "0.5rem 1rem"
          : size === "lg"
            ? "0.75rem 1.5rem"
            : "0.625rem 1.25rem";
      const fontSize =
        size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem";

      const variantStyles: Record<string, string> = {
        primary:
          "background-color: var(--sg-primary, #3b82f6); color: var(--sg-primary-text, #ffffff);",
        secondary:
          "background-color: var(--sg-secondary, #6b7280); color: #ffffff;",
        outline:
          "background-color: transparent; color: var(--sg-primary, #3b82f6); border: 1px solid var(--sg-primary, #3b82f6);",
        ghost:
          "background-color: transparent; color: var(--sg-primary, #3b82f6);",
      };

      const style = [
        `padding: ${padding}`,
        "border-radius: var(--sg-radius, 0.5rem)",
        "border: none",
        "cursor: pointer",
        `font-size: ${fontSize}`,
        "font-weight: 500",
        "transition: all 0.2s",
        variantStyles[variant],
      ]
        .filter(Boolean)
        .join("; ");

      if (href) {
        const resolvedHref = resolveHref(href, basePath);
        const targetAttr = linkTargetAttr(resolvedHref, basePath);
        return `<a ${dataBlockId} href="${escapeHtml(resolvedHref)}"${targetAttr} style="${style}">${escapeHtml(text)}</a>`;
      }
      return `<button ${dataBlockId} style="${style}">${escapeHtml(text)}</button>`;
    }
    case "link": {
      const { text, href } = (block as any).props;
      const resolvedHref = resolveHref(href, basePath);
      const targetAttr =
        linkTargetAttr(resolvedHref, basePath) || ' target="_self"';
      return `<a ${dataBlockId} href="${escapeHtml(resolvedHref)}"${targetAttr} style="color: var(--sg-primary, #3b82f6); text-decoration: underline;">${escapeHtml(text)}</a>`;
    }
    case "divider": {
      const { color = "#e5e7eb", thickness = "1px" } = (block as any).props;
      return `<hr ${dataBlockId} style="border: none; border-top: ${thickness} solid ${color}; margin: 1rem 0;" />`;
    }
    case "card": {
      const {
        header = [],
        content = [],
        footer = [],
        padding = "1rem",
        bg,
        border,
        radius,
        shadow,
      } = (block as any).props;
      const style = [
        bg
          ? `background-color: ${bg}`
          : "background-color: var(--sg-surface, #f9fafb)",
        border
          ? `border: ${border}`
          : "border: 1px solid var(--sg-border, #e5e7eb)",
        radius
          ? `border-radius: ${radius}`
          : "border-radius: var(--sg-radius, 0.5rem)",
        shadow
          ? `box-shadow: ${shadow}`
          : "box-shadow: var(--sg-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))",
        `padding: ${padding}`,
        "display: flex",
        "flex-direction: column",
        "gap: 0.5rem",
      ]
        .filter(Boolean)
        .join("; ");
      const headerHtml =
        header.length > 0
          ? `<div>${header.map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme)).join("")}</div>`
          : "";
      const contentHtml =
        content.length > 0
          ? `<div>${content.map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme)).join("")}</div>`
          : "";
      const footerHtml =
        footer.length > 0
          ? `<div>${footer.map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme)).join("")}</div>`
          : "";
      return `<div ${dataBlockId} style="${style}">${headerHtml}${contentHtml}${footerHtml}</div>`;
    }
    case "section": {
      const { id, bg, padding = "2rem", children = [] } = (block as any).props;
      const style = [
        bg
          ? `background-color: ${bg}`
          : "background-color: var(--sg-bg, #ffffff)",
        `padding: ${padding}`,
      ]
        .filter(Boolean)
        .join("; ");
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      const idAttr = id ? `id="${escapeHtml(id)}"` : "";
      return `<section ${dataBlockId} ${idAttr} style="${style}">${childrenHtml}</section>`;
    }

    // ========== NOVOS BLOCOS ==========

    case "spacer": {
      const { height = "2rem" } = (block as any).props;
      return `<div ${dataBlockId} style="height: ${height};"></div>`;
    }

    case "badge": {
      const { text, variant = "default", size = "md" } = (block as any).props;
      const variantColors: Record<string, { bg: string; text: string }> = {
        default: {
          bg: "var(--sg-surface2, #f3f4f6)",
          text: "var(--sg-text, #1f2937)",
        },
        primary: { bg: "var(--sg-primary, #3b82f6)", text: "#fff" },
        secondary: { bg: "var(--sg-secondary, #6b7280)", text: "#fff" },
        success: { bg: "var(--sg-success, #10b981)", text: "#fff" },
        warning: { bg: "var(--sg-warning, #f59e0b)", text: "#fff" },
        danger: { bg: "var(--sg-danger, #ef4444)", text: "#fff" },
      };
      const sizeStyles: Record<string, string> = {
        sm: "padding: 0.125rem 0.5rem; font-size: 0.625rem;",
        md: "padding: 0.25rem 0.75rem; font-size: 0.75rem;",
        lg: "padding: 0.375rem 1rem; font-size: 0.875rem;",
      };
      const colors = variantColors[variant] || variantColors.default;
      return `<span ${dataBlockId} style="display: inline-block; background-color: ${colors.bg}; color: ${colors.text}; border-radius: 9999px; font-weight: 500; ${sizeStyles[size] || sizeStyles.md}">${escapeHtml(text)}</span>`;
    }

    case "icon": {
      const { name: _iconName, size = "md", color } = (block as any).props;
      const sizeMap: Record<string, string> = {
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      };
      const iconSize = sizeMap[size] || sizeMap.md;
      return `<span ${dataBlockId} style="display: inline-flex; width: ${iconSize}; height: ${iconSize}; color: ${color || "currentColor"};">[\u2605]</span>`;
    }

    case "avatar": {
      const { src, name, size = "md" } = (block as any).props;
      const sizeMap: Record<string, string> = {
        sm: "2rem",
        md: "2.5rem",
        lg: "3rem",
        xl: "4rem",
      };
      const avatarSize = sizeMap[size] || sizeMap.md;
      const initials = name
        ? name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";
      if (src) {
        return `<img ${dataBlockId} src="${escapeHtml(src)}" alt="${escapeHtml(name || "Avatar")}" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; object-fit: cover;" />`;
      }
      return `<div ${dataBlockId} style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; background-color: var(--sg-primary, #3b82f6); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: calc(${avatarSize} / 2.5);">${initials}</div>`;
    }

    case "video": {
      const {
        src,
        poster,
        controls = true,
        aspectRatio = "16:9",
      } = (block as any).props;
      const ratioMap: Record<string, string> = {
        "16:9": "56.25%",
        "4:3": "75%",
        "1:1": "100%",
        "9:16": "177.78%",
      };
      const isYouTube =
        src?.includes("youtube.com") || src?.includes("youtu.be");
      const isVimeo = src?.includes("vimeo.com");
      if (isYouTube || isVimeo) {
        let embedUrl = src;
        if (isYouTube) {
          const videoId = src.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/,
          )?.[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (isVimeo) {
          const videoId = src.match(/vimeo\.com\/([\d]+)/)?.[1];
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
        return `<div ${dataBlockId} style="position: relative; padding-bottom: ${ratioMap[aspectRatio]}; height: 0; overflow: hidden;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>`;
      }
      return `<video ${dataBlockId} src="${escapeHtml(src)}" ${poster ? `poster="${escapeHtml(poster)}"` : ""} ${controls ? "controls" : ""} style="width: 100%; border-radius: var(--sg-radius, 0.5rem);"></video>`;
    }

    case "hero": {
      const {
        variation,
        variant = "centered",
        title,
        subtitle,
        description,
        primaryButton,
        secondaryButton,
        badge,
        align = "center",
        minHeight = "80vh",
        image,
        overlay,
        overlayColor,
        background,
      } = (block as any).props;

      // Resolver estilos dos botões com base na paleta
      const buttonStyles = resolveHeroButtonStyles(theme, block.id);

      const heroImage = image || PLACEHOLDER_IMAGE_URL;
      const isImageBg = variant === "image-bg" && heroImage;
      const isOverlay = isImageBg && overlay;
      const isSplit = variation === "hero-split" || variant === "split";
      const isParallax = variation === "hero-parallax";
      const isOverlayVariant = variation === "hero-overlay";
      const textColor = isOverlay ? "#fff" : "var(--sg-text)";
      const mutedColor = isOverlay
        ? "rgba(255,255,255,0.85)"
        : "var(--sg-muted-text)";

      const sectionClasses = [
        "sg-hero",
        variation ? `sg-hero--${String(variation).replace("hero-", "")}` : "",
        isSplit ? "sg-hero--split" : "",
        isParallax ? "sg-hero--parallax" : "",
        isOverlayVariant ? "sg-hero--overlay" : "",
      ]
        .filter(Boolean)
        .join(" ");

      let bgStyle = "background-color: var(--sg-bg, #fff);";
      if (isImageBg) {
        bgStyle = `background-image: url(${escapeHtml(heroImage)}); background-size: cover; background-position: center;`;
        if (isParallax) bgStyle += " background-attachment: fixed;";
      }

      // Overlay: custom overlayColor ou fallback
      const overlayStyle = overlayColor
        ? `position: absolute; inset: 0; background: ${overlayColor}; z-index: 0;`
        : "position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%); z-index: 0;";
      const overlayHtml = isOverlay
        ? `<div class="sg-hero__overlay" style="${overlayStyle}"></div>`
        : "";

      // Badge moderno
      const primaryColor = theme?.colors?.primary || "#3b82f6";
      const badgeHtml = badge
        ? `<span class="sg-hero__badge" style="display: inline-block; padding: 0.5rem 1.25rem; background: ${primaryColor}15; color: ${primaryColor}; border-radius: 999px; font-size: 0.875rem; font-weight: 600; margin-bottom: 1.5rem; border: 1px solid ${primaryColor}30;">${escapeHtml(badge)}</span>`
        : "";

      // Título grande e impactante
      const titleHtml = title
        ? `<h1 class="sg-hero__title" style="color: ${textColor}; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.25rem; letter-spacing: -0.02em;">${escapeHtml(title)}</h1>`
        : "";

      // Subtítulo elegante
      const subtitleHtml = subtitle
        ? `<h2 class="sg-hero__subtitle" style="color: ${mutedColor}; font-size: clamp(1.25rem, 2.5vw, 1.875rem); font-weight: 600; line-height: 1.3; margin-bottom: 1rem;">${escapeHtml(subtitle)}</h2>`
        : "";

      // Descrição com melhor legibilidade
      const descHtml = description
        ? `<p class="sg-hero__description" style="max-width: 650px; margin: ${align === "center" ? "0 auto 2.5rem" : "0 0 2.5rem"}; color: ${mutedColor}; font-size: 1.125rem; line-height: 1.7; opacity: 0.9;">${escapeHtml(description)}</p>`
        : "";

      const primaryHref = primaryButton
        ? resolveHref(primaryButton.href || "#", basePath)
        : "#";
      const secondaryHref = secondaryButton
        ? resolveHref(secondaryButton.href || "#", basePath)
        : "#";
      const primaryBtnHtml = primaryButton
        ? `<a href="${escapeHtml(primaryHref)}"${linkTargetAttr(primaryHref, basePath)} class="sg-hero__btn sg-hero__btn--primary" style="${buttonStyles.primary}">${escapeHtml(primaryButton.text)}</a>`
        : "";
      const secondaryBtnHtml = secondaryButton
        ? `<a href="${escapeHtml(secondaryHref)}"${linkTargetAttr(secondaryHref, basePath)} class="sg-hero__btn sg-hero__btn--secondary" style="${buttonStyles.secondary}">${escapeHtml(secondaryButton.text)}</a>`
        : "";

      // Botões com espaçamento moderno
      const buttonsHtml =
        primaryButton || secondaryButton
          ? `<div class="sg-hero__actions" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: ${align === "center" ? "center" : "flex-start"}; margin-top: 0.5rem;">${primaryBtnHtml}${secondaryBtnHtml}</div>`
          : "";

      const contentBlock = `${badgeHtml}${titleHtml}${subtitleHtml}${descHtml}${buttonsHtml}`;

      // Inject dynamic CSS styles (hover effects) if present
      const styleBlock = buttonStyles.css
        ? `<style>${buttonStyles.css}</style>`
        : "";

      const imgFallback = `this.onerror=null;this.src='${escapeHtml(PLACEHOLDER_IMAGE_URL)}';`;
      if (isSplit && heroImage) {
        const splitContentStyle = `text-align: ${align}; position: relative; z-index: 1;${background ? ` background: ${background};` : ""}`;
        const innerHtml = `<div class="sg-hero__split-inner" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1200px; width: 100%; padding: 0 2rem;"><div class="sg-hero__split-content" style="${splitContentStyle}">${contentBlock}</div><div class="sg-hero__split-image" style="position: relative;"><img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title || "")}" class="sg-hero__img" style="width: 100%; height: auto; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" onerror="${imgFallback}" /></div></div>`;
        return `<section ${dataBlockId} class="${sectionClasses}" style="min-height: ${minHeight}; padding: 8rem 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${innerHtml}</section>`;
      }

      const wrapHtml = `<div style="max-width: 900px; padding: 0 2rem; text-align: ${align}; position: relative; z-index: 1;">${contentBlock}</div>`;
      return `<section ${dataBlockId} class="${sectionClasses}" style="min-height: ${minHeight}; padding: 8rem 2rem; display: flex; align-items: center; justify-content: center; ${bgStyle} position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${wrapHtml}</section>`;
    }

    case "feature": {
      const { icon, title, description } = (block as any).props;
      const iconHtml = icon
        ? `<div style="width: 3rem; height: 3rem; background-color: var(--sg-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #fff;">[★]</div>`
        : "";
      return `<div ${dataBlockId} style="padding: 1.5rem; text-align: center;">${iconHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3><p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(description)}</p></div>`;
    }

    case "featureGrid": {
      const {
        title,
        subtitle,
        columns = 3,
        variant = "default",
        features = [],
      } = (block as any).props;
      const isImageCards = variant === "image-cards";
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const featuresHtml = features
        .map((f: any) => {
          const imgBlock =
            isImageCards && f.image
              ? `<div style="width: 100%; height: 200px; background-image: url(${escapeHtml(f.image)}); background-size: cover; background-position: center;"></div>`
              : "";
          const iconBlock =
            !isImageCards && f.icon
              ? `<div style="width: 3rem; height: 3rem; background-color: var(--sg-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: #fff;">[★]</div>`
              : "";
          const linkBlock = f.link
            ? `<a href="${escapeHtml(f.link.href || "#")}" style="display: inline-block; margin-top: 0.75rem; color: var(--sg-primary); font-weight: 500; text-decoration: none; border: 1px solid var(--sg-primary); padding: 0.5rem 1rem; border-radius: var(--sg-button-radius);">${escapeHtml(f.link.text)}</a>`
            : "";
          const innerPadding = isImageCards && f.image ? "1.5rem" : "2rem";
          return `<div style="background-color: var(--sg-bg); border-radius: 0.75rem; padding: ${isImageCards && f.image ? 0 : "2rem"}; box-shadow: var(--sg-card-shadow); overflow: hidden;">${imgBlock}<div style="padding: ${innerPadding};">${iconBlock}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(f.title)}</h3><p style="color: var(--sg-muted-text);">${escapeHtml(f.description)}</p>${linkBlock}</div></div>`;
        })
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${featuresHtml}</div></div></section>`;
    }

    case "pricingCard": {
      const {
        name,
        price,
        period,
        description: desc,
        features = [],
        buttonText,
        highlighted,
        badge: pBadge,
      } = (block as any).props;
      const badgeHtml = pBadge
        ? `<span style="position: absolute; top: -0.75rem; right: 1rem; background-color: var(--sg-primary); color: #fff; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">${escapeHtml(pBadge)}</span>`
        : "";
      const featuresHtml = features
        .map(
          (f: string) =>
            `<li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--sg-success);">\u2713</span>${escapeHtml(f)}</li>`,
        )
        .join("");
      const buttonStyle = highlighted
        ? "background-color: var(--sg-primary); color: var(--sg-primary-text); border: none;"
        : "background-color: transparent; color: var(--sg-primary); border: 1px solid var(--sg-primary);";
      return `<div ${dataBlockId} style="background-color: var(--sg-bg); border-radius: 0.75rem; padding: 2rem; box-shadow: ${highlighted ? "var(--sg-shadow-strong)" : "var(--sg-card-shadow)"}; border: ${highlighted ? "2px solid var(--sg-primary)" : "1px solid var(--sg-border)"}; position: relative;">${badgeHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(name)}</h3>${desc ? `<p style="color: var(--sg-muted-text); margin-bottom: 1rem;">${escapeHtml(desc)}</p>` : ""}<div style="margin-bottom: 1.5rem;"><span style="font-size: 2.5rem; font-weight: 700;">${escapeHtml(price)}</span>${period ? `<span style="color: var(--sg-muted-text);">${escapeHtml(period)}</span>` : ""}</div><ul style="list-style: none; padding: 0; margin-bottom: 1.5rem;">${featuresHtml}</ul>${buttonText ? `<button style="width: 100%; padding: 0.625rem 1.25rem; ${buttonStyle} border-radius: var(--sg-button-radius); font-weight: 500; cursor: pointer;">${escapeHtml(buttonText)}</button>` : ""}</div>`;
    }

    case "pricing": {
      const { title, subtitle, plans = [] } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const plansHtml = plans
        .map((p: any) =>
          blockToHtmlDirect(
            { id: `${block.id}-plan`, type: "pricingCard", props: p } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${plans.length}, 1fr); gap: 2rem; align-items: start;">${plansHtml}</div></div></section>`;
    }

    case "testimonial": {
      const {
        quote,
        authorName,
        authorRole,
        authorCompany,
        authorAvatar,
        rating,
      } = (block as any).props;
      const ratingHtml = rating
        ? `<div style="margin-bottom: 1rem; color: #fbbf24;">${"\u2605".repeat(rating)}</div>`
        : "";
      const avatarHtml = authorAvatar
        ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 3rem; height: 3rem; border-radius: 50%; object-fit: cover;" />`
        : `<div style="width: 3rem; height: 3rem; border-radius: 50%; background-color: var(--sg-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">${
            authorName
              ? authorName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?"
          }</div>`;
      return `<div ${dataBlockId} style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius); padding: 2rem;">${ratingHtml}<blockquote style="font-size: 1rem; margin-bottom: 1.5rem; font-style: italic;">"${escapeHtml(quote)}"</blockquote><div style="display: flex; align-items: center; gap: 1rem;">${avatarHtml}<div><div style="font-weight: 600;">${escapeHtml(authorName)}</div>${authorRole || authorCompany ? `<div style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(authorRole || "")}${authorRole && authorCompany ? ", " : ""}${escapeHtml(authorCompany || "")}</div>` : ""}</div></div></div>`;
    }

    case "testimonialGrid": {
      const {
        title,
        subtitle,
        columns = 3,
        testimonials = [],
      } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const testimonialsHtml = testimonials
        .map((t: any) =>
          blockToHtmlDirect(
            { id: `${block.id}-t`, type: "testimonial", props: t } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${testimonialsHtml}</div></div></section>`;
    }

    case "faqItem": {
      const { question, answer } = (block as any).props;
      return `<details ${dataBlockId} style="border-bottom: 1px solid var(--sg-border); padding: 1rem 0;"><summary style="font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">${escapeHtml(question)}<span>+</span></summary><p style="margin-top: 1rem; color: var(--sg-muted-text);">${escapeHtml(answer)}</p></details>`;
    }

    case "faq": {
      const { title, subtitle, items = [] } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const itemsHtml = items
        .map((i: any) =>
          blockToHtmlDirect(
            { id: `${block.id}-faq`, type: "faqItem", props: i } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div>${itemsHtml}</div></div></section>`;
    }

    case "cta": {
      const {
        title,
        description: ctaDesc,
        primaryButton,
        secondaryButton,
        variant = "centered",
      } = (block as any).props;
      const isGradient = variant === "gradient";
      const bgStyle = isGradient
        ? "background: linear-gradient(135deg, var(--sg-primary), var(--sg-accent));"
        : "background-color: var(--sg-surface);";
      const textColor = isGradient ? "#fff" : "var(--sg-text)";
      const mutedColor = isGradient
        ? "rgba(255,255,255,0.9)"
        : "var(--sg-muted-text)";
      const ctaPrimaryHref = primaryButton
        ? resolveHref(primaryButton.href || "#", basePath)
        : "#";
      const ctaSecondaryHref = secondaryButton
        ? resolveHref(secondaryButton.href || "#", basePath)
        : "#";
      const primaryBtnHtml = primaryButton
        ? `<a href="${escapeHtml(ctaPrimaryHref)}"${linkTargetAttr(ctaPrimaryHref, basePath)} style="padding: 0.75rem 1.5rem; background-color: ${isGradient ? "#fff" : "var(--sg-primary)"}; color: ${isGradient ? "var(--sg-primary)" : "var(--sg-primary-text)"}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500;">${escapeHtml(primaryButton.text)}</a>`
        : "";
      const secondaryBtnHtml = secondaryButton
        ? `<a href="${escapeHtml(ctaSecondaryHref)}"${linkTargetAttr(ctaSecondaryHref, basePath)} style="padding: 0.75rem 1.5rem; background-color: transparent; color: ${isGradient ? "#fff" : "var(--sg-primary)"}; border: 1px solid ${isGradient ? "#fff" : "var(--sg-primary)"}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500;">${escapeHtml(secondaryButton.text)}</a>`
        : "";
      return `<section ${dataBlockId} style="padding: 4rem 0; ${bgStyle} text-align: center;"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;"><h2 style="font-size: var(--sg-heading-h2); margin-bottom: 1rem; color: ${textColor};">${escapeHtml(title)}</h2>${ctaDesc ? `<p style="font-size: 1.125rem; margin-bottom: 2rem; color: ${mutedColor};">${escapeHtml(ctaDesc)}</p>` : ""}<div style="display: flex; gap: 1rem; justify-content: center;">${primaryBtnHtml}${secondaryBtnHtml}</div></div></section>`;
    }

    case "stats": {
      const { title, subtitle, items = [] } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const itemsHtml = items
        .map(
          (i: any) =>
            `<div style="text-align: center;"><div style="font-size: 3rem; font-weight: 700; color: var(--sg-primary);">${escapeHtml(i.prefix || "")}${escapeHtml(i.value)}${escapeHtml(i.suffix || "")}</div><div style="color: var(--sg-muted-text);">${escapeHtml(i.label)}</div></div>`,
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${items.length}, 1fr); gap: 2rem; text-align: center;">${itemsHtml}</div></div></section>`;
    }

    case "statItem": {
      const { value, label, prefix, suffix } = (block as any).props;
      return `<div ${dataBlockId} style="text-align: center;"><div style="font-size: 2.5rem; font-weight: 700; color: var(--sg-primary);">${escapeHtml(prefix || "")}${escapeHtml(value)}${escapeHtml(suffix || "")}</div><div style="color: var(--sg-muted-text);">${escapeHtml(label)}</div></div>`;
    }

    case "logoCloud": {
      const { title, logos = [], grayscale } = (block as any).props;
      const titleHtml = title
        ? `<p style="color: var(--sg-muted-text); margin-bottom: 2rem;">${escapeHtml(title)}</p>`
        : "";
      const logosHtml = logos
        .map(
          (l: any) =>
            `<img src="${escapeHtml(l.src)}" alt="${escapeHtml(l.alt)}" style="height: 2rem; object-fit: contain; ${grayscale ? "filter: grayscale(100%); opacity: 0.6;" : ""}" />`,
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 2rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">${titleHtml}<div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap;">${logosHtml}</div></div></section>`;
    }

    case "navbar": {
      const {
        variation = "navbar-classic",
        logo,
        logoText,
        links = [],
        ctaButton,
        sticky,
        transparent = false,
        floating = false,
        layout,
      } = (block as any).props;

      // Use Style Resolver to get complete inline styles
      const resolvedStyles = resolveNavbarStyles(
        (block as any).props,
        block.id || "",
        theme,
      );

      const variationClass =
        variation === "navbar-centered"
          ? "sg-navbar--centered"
          : variation === "navbar-minimal"
            ? "sg-navbar--minimal"
            : variation === "navbar-glass"
              ? "sg-navbar--glass"
              : "sg-navbar--classic";

      // Determine effective layout
      const effectiveLayout =
        layout || (variation === "navbar-centered" ? "centered" : "expanded");
      const isCentered = effectiveLayout === "centered";
      const isCompact = effectiveLayout === "compact";

      const navClasses = [
        "sg-navbar",
        variationClass,
        sticky ? "sg-navbar--sticky" : "",
        floating ? "sg-navbar--floating" : "",
        isCompact ? "sg-navbar--compact" : "",
      ]
        .filter(Boolean)
        .join(" ");

      // Build nav style from resolved styles + layout modifiers
      // Note: floating mode already includes position: fixed in resolvedStyles.nav
      const stickyStyle =
        sticky && !floating ? "position: sticky; top: 0; z-index: 100" : "";
      const baseStyle =
        !transparent && !floating ? "border-bottom: 1px solid #e5e7eb" : "";
      const paddingStyle = "";

      // Navbar flutuante: mesma largura do conteúdo principal
      const floatingCompactStyle = floating
        ? "max-width: 1200px; width: calc(100% - 4rem); left: 50%; transform: translateX(-50%);"
        : "";

      // Merge all nav styles (resolvedStyles.nav contains bg, opacity, position for floating, border-radius, shadow)
      const navStyle = mergeStyles(
        resolvedStyles.nav,
        paddingStyle,
        baseStyle,
        stickyStyle,
        floatingCompactStyle,
      );

      const logoUrl = typeof logo === "string" ? logo : (logo?.src ?? "");
      const logoAlt =
        typeof logo === "string"
          ? logoText || "Logo"
          : (logo?.alt ?? logoText ?? "Logo");
      let logoHref = typeof logo === "object" && logo?.href ? logo.href : "";
      if (logoHref === "/" || logoHref === "") logoHref = basePath ?? "/site";

      // Brand with resolved styles
      let logoHtml =
        logoUrl || logoAlt
          ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(logoAlt)}" style="height: 5rem; object-fit: contain;" class="sg-navbar__brand-img" />`
          : logoText
            ? `<span class="sg-navbar__brand-text" style="${resolvedStyles.brandText}">${escapeHtml(logoText)}</span>`
            : "";
      if (logoHref && logoHtml) {
        const resolvedLogoHref = resolveHref(logoHref, basePath);
        const logoTargetAttr = linkTargetAttr(resolvedLogoHref, basePath);
        logoHtml = `<a href="${escapeHtml(resolvedLogoHref)}"${logoTargetAttr} class="sg-navbar__brand-link" style="display: flex; align-items: center;">${logoHtml}</a>`;
      }

      // Detectar se é mega menu (tem descrições nos submenus)
      const isMegaMenu = variation === "navbar-mega";
      const hasDropdowns = links.some(
        (l: any) => l.submenu && l.submenu.length > 0,
      );

      // Extrair cores da navbar para usar nos dropdowns
      const navbarBg = (block as any).props.bg || "#ffffff";
      const navbarOpacity = (block as any).props.opacity || 100;

      // Aplicar opacidade diretamente na cor do background (não no container)
      // Isso evita que o texto fique transparente
      const dropdownOpacity =
        navbarOpacity >= 90 ? navbarOpacity : Math.min(navbarOpacity + 10, 100);
      const dropdownBgWithOpacity = applyOpacityToColor(
        navbarBg,
        dropdownOpacity,
      );

      // Usar linkColor da paleta se disponível, caso contrário fallback para text
      const linkColor =
        (block as any).props.linkColor ||
        theme?.colors?.linkColor ||
        theme?.colors?.text ||
        "#1f2937";

      // Links with resolved styles (complete inline styling) + dropdowns
      const linksHtml = links
        .map((l: any) => {
          const resolved = resolveHref(l.href || "#", basePath);
          const targetAttr = linkTargetAttr(resolved, basePath);

          // Link sem submenu
          if (!l.submenu || l.submenu.length === 0) {
            return `<a href="${escapeHtml(resolved)}"${targetAttr} class="sg-navbar__link" style="${resolvedStyles.link}">${escapeHtml(l.text)}</a>`;
          }

          // Link com submenu (dropdown)
          const chevronIcon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="margin-left: 4px; transition: transform 0.2s;"><path d="M6 8L2 4h8z"/></svg>`;

          const submenuItems = l.submenu
            .map((item: any) => {
              const itemResolved = resolveHref(item.href || "#", basePath);
              const itemTargetAttr = linkTargetAttr(itemResolved, basePath);

              if (isMegaMenu && item.description) {
                return `<a href="${escapeHtml(itemResolved)}"${itemTargetAttr} class="sg-navbar__dropdown-item sg-navbar__dropdown-item--mega" style="display: block; padding: 0.875rem 1rem; text-decoration: none; color: ${linkColor}; transition: background-color 0.2s; border-radius: 0.375rem;">
                <strong style="display: block; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(item.text)}</strong>
                <span style="display: block; font-size: 0.875rem; opacity: 0.7;">${escapeHtml(item.description)}</span>
              </a>`;
              }

              return `<a href="${escapeHtml(itemResolved)}"${itemTargetAttr} class="sg-navbar__dropdown-item" style="display: block; padding: 0.625rem 1rem; text-decoration: none; color: ${linkColor}; transition: background-color 0.2s; white-space: nowrap;">${escapeHtml(item.text)}</a>`;
            })
            .join("");

          const dropdownClasses = isMegaMenu
            ? "sg-navbar__dropdown sg-navbar__dropdown--mega"
            : "sg-navbar__dropdown";
          const dropdownStyle = isMegaMenu
            ? `position: absolute; top: 100%; left: 0; background-color: ${dropdownBgWithOpacity}; border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); padding: 1rem; margin-top: 0.5rem; min-width: 280px; visibility: hidden; transition: opacity 0.2s, visibility 0.2s, transform 0.2s; transform: translateY(-10px); z-index: 1000; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.5rem;`
            : `position: absolute; top: 100%; left: 0; background-color: ${dropdownBgWithOpacity}; border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); padding: 0.5rem; margin-top: 0.5rem; min-width: 200px; visibility: hidden; transition: opacity 0.2s, visibility 0.2s, transform 0.2s; transform: translateY(-10px); z-index: 1000;`;

          return `<div class="sg-navbar__link-wrapper" style="position: relative;">
            <a href="${escapeHtml(resolved)}" class="sg-navbar__link sg-navbar__link--has-dropdown" style="${resolvedStyles.link} cursor: pointer;">${escapeHtml(l.text)}${chevronIcon}</a>
            <div class="${dropdownClasses}" style="${dropdownStyle}">${submenuItems}</div>
          </div>`;
        })
        .join("");

      // CTA Button with resolved styles (complete inline styling)
      const ctaResolved = ctaButton
        ? resolveHref(ctaButton.href || "#", basePath)
        : "#";
      const ctaTargetAttr = ctaButton
        ? linkTargetAttr(ctaResolved, basePath)
        : "";
      const ctaBtnHtml = ctaButton
        ? `<a href="${escapeHtml(ctaResolved)}"${ctaTargetAttr} class="sg-navbar__btn" style="${resolvedStyles.button}">${escapeHtml(ctaButton.text)}</a>`
        : "";

      const containerStyle = isCentered
        ? `max-width: 1200px; margin: 0 auto; padding: 0 ${isCompact ? "0.5rem" : "1rem"}; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: ${isCompact ? "1rem" : "1.5rem"};`
        : `max-width: 1200px; margin: 0 auto; padding: 0 ${isCompact ? "0.5rem" : "1rem"}; display: flex; justify-content: space-between; align-items: center; gap: ${isCompact ? "1rem" : "1.5rem"};`;
      const menuStyle = `display: flex; align-items: center; gap: ${isCompact ? "1rem" : "1.5rem"}; flex-wrap: wrap;${isCentered ? " justify-self: center;" : ""}`;
      const brandWrapStyle = isCentered
        ? "flex-shrink: 0; justify-self: start;"
        : "flex-shrink: 0;";

      const menuHtml = `<div class="sg-navbar__menu" style="${menuStyle}">${linksHtml}${!isCentered ? ctaBtnHtml : ""}</div>`;
      const actionsHtml =
        isCentered && ctaButton
          ? `<div class="sg-navbar__actions" style="flex-shrink: 0; justify-self: end;">${ctaBtnHtml}</div>`
          : "";
      const containerHtml = `<div class="sg-navbar__container" style="${containerStyle}"><div class="sg-navbar__brand" style="${brandWrapStyle}">${logoHtml}</div>${menuHtml}${actionsHtml}</div>`;

      // CSS para dropdowns
      const dropdownCss = hasDropdowns
        ? `
        /* Dropdown hover activation */
        ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__link-wrapper:hover .sg-navbar__dropdown {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }

        /* Chevron rotation on hover */
        ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__link-wrapper:hover .sg-navbar__link--has-dropdown svg {
          transform: rotate(180deg);
        }

        /* Dropdown item hover */
        ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__dropdown-item:hover {
          background-color: ${theme?.colors?.primary || "#3b82f6"}10 !important;
        }

        /* Mega menu item hover */
        ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__dropdown-item--mega:hover {
          background-color: ${theme?.colors?.primary || "#3b82f6"}08 !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__dropdown {
            position: static !important;
            opacity: ${dropdownOpacity / 100} !important;
            visibility: visible !important;
            transform: none !important;
            box-shadow: none !important;
            margin-top: 0.5rem !important;
          }
        }
      `
        : "";

      // Inject dynamic CSS styles (hover effects + dropdowns) if present
      const combinedCss = [resolvedStyles.css, dropdownCss]
        .filter(Boolean)
        .join("\n");
      const styleBlock = combinedCss ? `<style>${combinedCss}</style>` : "";

      return `<nav ${dataBlockId} class="${escapeHtml(navClasses)}" data-variation="${escapeHtml(variation)}" style="${navStyle}">${styleBlock}${containerHtml}</nav>`;
    }

    case "form": {
      const {
        action,
        method = "post",
        children = [],
        submitText = "Enviar",
      } = (block as any).props;
      const childrenHtml = children
        .map((c: Block) => blockToHtmlDirect(c, depth + 1, basePath, theme))
        .join("");
      return `<form ${dataBlockId} action="${escapeHtml(action || "")}" method="${method}" style="display: flex; flex-direction: column; gap: 1rem;">${childrenHtml}<button type="submit" style="padding: 0.625rem 1.25rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius); border: none; font-weight: 500; cursor: pointer;">${escapeHtml(submitText)}</button></form>`;
    }

    case "input": {
      const {
        name,
        label,
        placeholder,
        type = "text",
        required,
      } = (block as any).props;
      const labelHtml = label
        ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
        : "";
      return `<div ${dataBlockId}>${labelHtml}<input name="${escapeHtml(name)}" type="${type}" placeholder="${escapeHtml(placeholder || "")}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);" /></div>`;
    }

    case "textarea": {
      const {
        name,
        label,
        placeholder,
        rows = 4,
        required,
      } = (block as any).props;
      const labelHtml = label
        ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
        : "";
      return `<div ${dataBlockId}>${labelHtml}<textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder || "")}" rows="${rows}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff); resize: vertical;"></textarea></div>`;
    }

    case "formSelect": {
      const {
        name,
        label,
        placeholder,
        options = [],
        required,
      } = (block as any).props;
      const labelHtml = label
        ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
        : "";
      const optionsHtml =
        (placeholder
          ? `<option value="">${escapeHtml(placeholder)}</option>`
          : "") +
        options
          .map(
            (o: any) =>
              `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`,
          )
          .join("");
      return `<div ${dataBlockId}>${labelHtml}<select name="${escapeHtml(name)}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);">${optionsHtml}</select></div>`;
    }

    case "socialLinks": {
      const {
        links = [],
        size = "md",
        variant = "default",
      } = (block as any).props;
      const sizeMap: Record<string, string> = {
        sm: "1.25rem",
        md: "1.5rem",
        lg: "2rem",
      };
      const iconSize = sizeMap[size] || sizeMap.md;
      const linksHtml = links
        .map(
          (l: any) =>
            `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; width: ${variant === "filled" ? `calc(${iconSize} + 0.75rem)` : iconSize}; height: ${variant === "filled" ? `calc(${iconSize} + 0.75rem)` : iconSize}; background-color: ${variant === "filled" ? "var(--sg-surface)" : "transparent"}; border-radius: ${variant === "filled" ? "50%" : "0"}; color: var(--sg-muted-text); text-decoration: none;">[${escapeHtml(l.platform)}]</a>`,
        )
        .join("");
      return `<div ${dataBlockId} style="display: flex; gap: 1rem; align-items: center;">${linksHtml}</div>`;
    }

    case "footer": {
      const {
        logo,
        description,
        columns = [],
        social = [],
        copyright,
        variant = "simple",
      } = (block as any).props;

      const logoUrl = typeof logo === "string" ? logo : (logo?.src ?? "");
      const logoAlt = typeof logo === "string" ? "Logo" : (logo?.alt ?? "Logo");

      const socialIcons: Record<string, string> = {
        facebook:
          "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
        twitter:
          "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
        instagram:
          "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
        linkedin:
          "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
        youtube:
          "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
        github:
          "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
      };

      const isMultiColumn = variant === "multi-column" && columns.length > 0;

      const socialHtml = social
        .map(
          (item: any) =>
            `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" style="color: var(--sg-muted-text, #64748b); text-decoration: none;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${socialIcons[item.platform] || socialIcons.github}"/></svg></a>`,
        )
        .join("");

      const logoHtml = logoUrl
        ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(logoAlt)}" style="height: 2.5rem; object-fit: contain; margin-bottom: 1rem;" />`
        : "";

      const descHtml = description
        ? `<p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1rem;">${escapeHtml(description)}</p>`
        : "";

      const socialContainerHtml =
        social.length > 0
          ? `<div style="display: flex; gap: 0.75rem;">${socialHtml}</div>`
          : "";

      let contentHtml = "";
      if (isMultiColumn) {
        const columnsHtml = columns
          .map((col: any) => {
            const linksHtml = (col.links || [])
              .map(
                (link: any) =>
                  `<li><a href="${escapeHtml(link.href)}" style="color: var(--sg-muted-text, #64748b); text-decoration: none; font-size: 0.875rem;">${escapeHtml(link.text)}</a></li>`,
              )
              .join("");
            return `<div><h4 style="font-weight: 600; margin-bottom: 1rem; color: var(--sg-text, #0f172a);">${escapeHtml(col.title)}</h4><ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">${linksHtml}</ul></div>`;
          })
          .join("");

        contentHtml = `<div style="display: grid; grid-template-columns: 2fr repeat(${columns.length}, 1fr); gap: 2rem; margin-bottom: 2rem;"><div>${logoHtml}${descHtml}${socialContainerHtml}</div>${columnsHtml}</div>`;
      } else {
        contentHtml = `<div style="text-align: center; margin-bottom: 1.5rem;">${logoHtml}${descHtml ? `<p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; max-width: 400px; margin: 0 auto 1rem;">${escapeHtml(description || "")}</p>` : ""}${social.length > 0 ? `<div style="display: flex; justify-content: center; gap: 1rem;">${socialHtml}</div>` : ""}</div>`;
      }

      const copyrightHtml = copyright
        ? `<div style="border-top: 1px solid var(--sg-border, #e5e7eb); padding-top: 1.5rem; text-align: center;"><p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; margin: 0;">${escapeHtml(copyright)}</p></div>`
        : "";

      return `<footer ${dataBlockId} style="background-color: var(--sg-surface, #f8fafc); border-top: 1px solid var(--sg-border, #e5e7eb); padding: 3rem 0 1.5rem;"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${contentHtml}${copyrightHtml}</div></footer>`;
    }

    case "countdown": {
      const {
        title,
        description,
        showPlaceholders = true,
        buttonText,
        buttonHref,
        variant = "default",
        badgeText,
        bg,
      } = (block as any).props;
      const isBanner = variant === "banner";
      const sectionStyle = `padding: 4rem 2rem; background-color: ${bg || "var(--sg-primary)"}; color: #fff;`;
      const badgeCircle =
        isBanner && badgeText
          ? `<div style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; text-align: center; padding: 1rem; font-weight: 600; font-size: 0.875rem;">${escapeHtml(badgeText)}</div>`
          : "";
      const placeholdersHtml = showPlaceholders
        ? `<div style="display: flex; gap: 1rem; margin-bottom: 1rem;">${["Days", "Hours", "Minutes", "Seconds"].map((label) => `<div style="text-align: center;"><div style="font-size: 1.75rem; font-weight: 700;">00</div><div style="font-size: 0.75rem; opacity: 0.9;">${label}</div></div>`).join("")}</div>`
        : "";
      const btnHtml = buttonText
        ? `<a href="${escapeHtml(buttonHref || "#")}" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #fff; color: var(--sg-primary); font-weight: 600; border-radius: var(--sg-button-radius); text-decoration: none;">${escapeHtml(buttonText)}</a>`
        : "";
      const inner = `<div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">${badgeCircle}<div style="flex: 1; min-width: 200px;">${title ? `<h2 style="margin-bottom: 0.5rem; font-size: 1.5rem;">${escapeHtml(title)}</h2>` : ""}${description ? `<p style="opacity: 0.9; margin-bottom: 1rem;">${escapeHtml(description)}</p>` : ""}${placeholdersHtml}${btnHtml}</div></div>`;
      return `<section ${dataBlockId} class="sg-countdown" style="${sectionStyle}" data-variant="${escapeHtml(variant)}">${inner}</section>`;
    }

    case "carousel": {
      const { slides = [] } = (block as any).props;
      const slide = slides[0];
      if (!slide)
        return `<section ${dataBlockId} class="sg-carousel"></section>`;
      const slideImg = slide.image
        ? `<div style="min-height: 300px; background-image: url(${escapeHtml(slide.image)}); background-size: cover; background-position: center;"></div>`
        : "";
      const primaryBtn = slide.primaryButton
        ? `<a href="${escapeHtml(slide.primaryButton.href || "#")}" style="padding: 0.75rem 1.5rem; background-color: #fff; color: var(--sg-primary); border-radius: var(--sg-button-radius); font-weight: 500; text-decoration: none;">${escapeHtml(slide.primaryButton.text)}</a>`
        : "";
      const secondaryBtn = slide.secondaryButton
        ? `<a href="${escapeHtml(slide.secondaryButton.href || "#")}" style="padding: 0.75rem 1.5rem; border: 2px solid #fff; color: #fff; border-radius: var(--sg-button-radius); font-weight: 500; text-decoration: none;">${escapeHtml(slide.secondaryButton.text)}</a>`
        : "";
      const slideContent = `<div style="padding: 2rem; color: #fff;">${slide.title ? `<h2 style="margin-bottom: 1rem;">${escapeHtml(slide.title)}</h2>` : ""}${slide.description ? `<p style="margin-bottom: 1.5rem; opacity: 0.9;">${escapeHtml(slide.description)}</p>` : ""}<div style="display: flex; gap: 1rem; flex-wrap: wrap;">${primaryBtn}${secondaryBtn}</div></div>`;
      const slideHtml = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; background-color: var(--sg-primary); border-radius: var(--sg-card-radius); overflow: hidden;">${slideImg}${slideContent}</div>`;
      return `<section ${dataBlockId} class="sg-carousel" style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${slideHtml}</div></section>`;
    }

    case "blogCard": {
      const { image, date, category, title, excerpt, linkText, linkHref } = (
        block as any
      ).props;
      const imgHtml = image
        ? `<div style="height: 200px; background-image: url(${escapeHtml(image)}); background-size: cover; background-position: center;"></div>`
        : "";
      const metaHtml =
        date || category
          ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${[date, category].filter(Boolean).join(" / ")}</p>`
          : "";
      const linkHtml = linkText
        ? `<a href="${escapeHtml(linkHref || "#")}" style="color: var(--sg-primary); font-weight: 500; text-decoration: none;">${escapeHtml(linkText)}</a>`
        : "";
      return `<article ${dataBlockId} class="sg-blog-card" style="background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);">${imgHtml}<div style="padding: 1.5rem;">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1rem;">${escapeHtml(excerpt)}</p>` : ""}${linkHtml}</div></article>`;
    }

    case "blogCardGrid": {
      const { title, subtitle, columns = 3, cards = [] } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const cardsHtml = cards
        .map((c: any, i: number) =>
          blockToHtmlDirect(
            {
              id: `${block.id}-card-${i}`,
              type: "blogCard",
              props: c,
            } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${cardsHtml}</div></div></section>`;
    }

    case "teamCard": {
      const { avatar, name, role } = (block as any).props;
      const avatarHtml = avatar
        ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; display: block;" />`
        : `<div style="width: 120px; height: 120px; border-radius: 50%; background-color: var(--sg-primary); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; font-weight: 600;">${name ? name.charAt(0) : "?"}</div>`;
      return `<div ${dataBlockId} class="sg-team-card" style="text-align: center;">${avatarHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(name)}</h3>${role ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(role)}</p>` : ""}</div>`;
    }

    case "teamGrid": {
      const {
        title,
        subtitle,
        columns = 4,
        members = [],
      } = (block as any).props;
      const headerHtml =
        title || subtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
          : "";
      const membersHtml = members
        .map((m: any, i: number) =>
          blockToHtmlDirect(
            {
              id: `${block.id}-member-${i}`,
              type: "teamCard",
              props: m,
            } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${membersHtml}</div></div></section>`;
    }

    case "courseCardGrid": {
      const {
        title: courseTitle,
        subtitle: courseSubtitle,
        columns: courseCols = 3,
        cards = [],
      } = (block as any).props;
      const courseHeaderHtml =
        courseTitle || courseSubtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${courseTitle ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(courseTitle)}</h2>` : ""}${courseSubtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(courseSubtitle)}</p>` : ""}</div>`
          : "";
      const courseCardsHtml = cards
        .map((card: any) => {
          const imgHtml = card.image
            ? `<div style="height: 180px; background-image: url(${escapeHtml(card.image)}); background-size: cover; background-position: center;"></div>`
            : "";
          const priceInner = card.period
            ? ' <span style="font-size: 0.875rem; font-weight: 400; color: var(--sg-muted-text);">/ ' +
              escapeHtml(card.period) +
              "</span>"
            : "";
          const priceHtml =
            card.price != null
              ? `<p style="font-size: 1rem; font-weight: 600; color: var(--sg-primary); margin-bottom: 0.5rem;">${escapeHtml(String(card.price))}${priceInner}</p>`
              : "";
          const ratingHtml =
            card.rating != null && card.rating > 0
              ? `<div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem;">${[1, 2, 3, 4, 5].map((star) => `<span style="color: ${star <= card.rating ? "var(--sg-warning, #f59e0b)" : "var(--sg-border)"}">★</span>`).join("")}</div>`
              : "";
          const metaHtml =
            card.meta && card.meta.length
              ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 1rem;">${escapeHtml(card.meta.join(" · "))}</p>`
              : "";
          const btnHtml = card.buttonText
            ? `<a href="${escapeHtml(card.buttonHref || "#")}"${linkTargetAttr(card.buttonHref || "#", basePath)} style="display: inline-block; padding: 0.5rem 1rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius); font-size: 0.875rem; font-weight: 500; text-decoration: none;">${escapeHtml(card.buttonText)}</a>`
            : "";
          return `<article class="sg-course-card" style="background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);">${imgHtml}<div style="padding: 1.25rem;"><h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(card.title)}</h3>${priceHtml}${ratingHtml}${metaHtml}${btnHtml}</div></article>`;
        })
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${courseHeaderHtml}<div class="sg-course-card-grid" style="display: grid; grid-template-columns: repeat(${courseCols}, 1fr); gap: 2rem;">${courseCardsHtml}</div></div></section>`;
    }

    case "categoryCardGrid": {
      const {
        title: catTitle,
        subtitle: catSubtitle,
        columns: catCols = 4,
        categories = [],
      } = (block as any).props;
      const catHeaderHtml =
        catTitle || catSubtitle
          ? `<div style="text-align: center; margin-bottom: 3rem;">${catTitle ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(catTitle)}</h2>` : ""}${catSubtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(catSubtitle)}</p>` : ""}</div>`
          : "";
      const catCardsHtml = categories
        .map(
          (cat: any) =>
            `<a href="${escapeHtml(cat.href || "#")}"${linkTargetAttr(cat.href || "#", basePath)} class="sg-category-card" style="display: block; position: relative; min-height: 200px; border-radius: var(--sg-card-radius); overflow: hidden; background-image: url(${escapeHtml(cat.image)}); background-size: cover; background-position: center; text-decoration: none;"><div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%); display: flex; align-items: flex-end; justify-content: center; padding: 1.5rem;"><span style="color: #fff; font-size: 1.125rem; font-weight: 600;">${escapeHtml(cat.title)}</span></div></a>`,
        )
        .join("");
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${catHeaderHtml}<div class="sg-category-card-grid" style="display: grid; grid-template-columns: repeat(${catCols}, 1fr); gap: 1.5rem;">${catCardsHtml}</div></div></section>`;
    }

    default:
      console.warn(`[exportHtml] Unknown block type: ${(block as any).type}`);
      return `<div ${dataBlockId} style="padding: 1rem; background: #fee2e2; color: #dc2626; border-radius: 0.5rem;">Bloco desconhecido: ${escapeHtml((block as any).type)}</div>`;
  }
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text: string): string {
  if (!text) return "";
  // Sempre usar fallback para evitar problemas com document
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface ExportPageToHtmlOptions {
  /** Página de referência para layout (navbar + footer). Quando a página atual não é a home, inclui navbar e footer desta página. */
  layoutFromPage?: SitePage;
}

/**
 * Exporta uma página para HTML (com cache)
 * @param basePath - Base path para links (ex.: /site ou /site/escola/:slug)
 * @param options - layoutFromPage: quando informado e diferente da página atual, inclui navbar (primeiro bloco navbar) e footer (último bloco) da página de referência
 */
export function exportPageToHtml(
  page: SitePage,
  document: SiteDocumentV2,
  useCache: boolean = true,
  basePath?: string,
  options?: ExportPageToHtmlOptions,
): string {
  const layoutFromPage = options?.layoutFromPage;
  const docHash = hashDocument(document);
  const layoutId = layoutFromPage?.id ?? "";
  const cacheKey = `${docHash}-${page.id}-${basePath ?? ""}-${layoutId}`;

  // Verificar cache
  if (useCache && htmlCache.has(cacheKey)) {
    const cached = htmlCache.get(cacheKey)!;
    cached.timestamp = Date.now();
    return cached.html;
  }

  // Gerar HTML
  const themeCSS = generateThemeCSSVariables(document.theme);
  let bodyHtml = page.structure
    .map((block) => blockToHtmlDirect(block, 0, basePath, document.theme))
    .join("");

  // Layout compartilhado: em páginas não-home, incluir navbar e footer da página de referência (ex.: home)
  if (
    layoutFromPage &&
    layoutFromPage.id !== page.id &&
    layoutFromPage.structure?.length
  ) {
    const layoutStructure = layoutFromPage.structure;
    const navbarBlock = layoutStructure.find((b) => b.type === "navbar");
    const navbarHtml = navbarBlock
      ? blockToHtmlDirect(navbarBlock, 0, basePath, document.theme)
      : "";
    const footerBlock =
      layoutStructure.length > 1
        ? layoutStructure[layoutStructure.length - 1]
        : null;
    const footerHtml =
      footerBlock && footerBlock.type !== "navbar"
        ? blockToHtmlDirect(footerBlock, 0, basePath, document.theme)
        : "";
    bodyHtml = navbarHtml + bodyHtml + footerHtml;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.name)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: var(--sg-font-body, system-ui, -apple-system, sans-serif);
      line-height: 1.6;
      color: var(--sg-text, #1f2937);
    }
    ${themeCSS}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

  // Armazenar no cache
  if (useCache) {
    htmlCache.set(cacheKey, { html, timestamp: Date.now() });
    cleanCache();
  }

  return html;
}

/**
 * Exporta apenas um bloco para HTML (para atualização parcial)
 */
export function exportBlockToHtml(block: Block): string {
  return blockToHtmlDirect(block);
}

/**
 * Limpa o cache de HTML
 */
export function clearHtmlCache(): void {
  htmlCache.clear();
}

/**
 * Exporta documento completo para HTML (sanitizado)
 */
export function exportDocumentToHtml(
  document: SiteDocumentV2,
  pageId?: string,
): string {
  const page = pageId
    ? document.pages.find((p) => p.id === pageId)
    : document.pages[0];

  if (!page) {
    throw new Error("Page not found");
  }

  const html = exportPageToHtml(page, document);
  return sanitizeHtml(html);
}

/**
 * Gera manifest de assets (imagens, fontes, etc)
 */
export function generateAssetsManifest(
  document: SiteDocumentV2,
): Array<{ type: string; url: string }> {
  const assets: Array<{ type: string; url: string }> = [];

  function extractAssetsFromBlock(block: Block) {
    if (block.type === "image") {
      const src = (block as any).props.src;
      if (src) {
        assets.push({ type: "image", url: src });
      }
    }

    // Recursivamente extrair de children
    const children = (block as any).props?.children || [];
    children.forEach(extractAssetsFromBlock);
  }

  document.pages.forEach((page) => {
    page.structure.forEach(extractAssetsFromBlock);
  });

  return assets;
}
