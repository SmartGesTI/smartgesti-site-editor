/**
 * Hero Section Exporter
 * Mobile-first responsive: split layout collapses to stack in mobile
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { PLACEHOLDER_IMAGE_URL } from "../../../presets/heroVariations";
import { dataBlockIdAttr, blockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

export function exportHero(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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
    // Button hover effects
    buttonHoverEffect = "scale",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
  } = (block as any).props;

  // Resolver estilos dos botões com base na paleta
  const buttonStyles = resolveHeroButtonStylesWithHover(theme, block.id, buttonHoverEffect, buttonHoverIntensity, buttonHoverOverlay);

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
    // Responsive split layout: stack in mobile, 2 columns in desktop
    const splitId = generateScopedId(block.id || "", "hero-split");
    const splitCss = `
      @media (max-width: 1023px) {
        #${splitId} {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
          padding: 0 1rem !important;
        }
        #${splitId} .sg-hero__split-image {
          order: -1;
        }
      }
    `;
    const splitContentStyle = `text-align: ${align}; position: relative; z-index: 1;${background ? ` background: ${background};` : ""}`;
    const innerHtml = `<style>${splitCss}</style><div id="${splitId}" class="sg-hero__split-inner" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1200px; width: 100%; padding: 0 2rem;"><div class="sg-hero__split-content" style="${splitContentStyle}">${contentBlock}</div><div class="sg-hero__split-image" style="position: relative;"><img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title || "")}" class="sg-hero__img" style="width: 100%; height: auto; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" onerror="${imgFallback}" /></div></div>`;
    return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; padding: 8rem 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${innerHtml}</section>`;
  }

  const wrapHtml = `<div style="max-width: 900px; padding: 0 2rem; text-align: ${align}; position: relative; z-index: 1;">${contentBlock}</div>`;
  return `<section ${dataBlockIdAttr(block.id)} class="${sectionClasses}" style="min-height: ${minHeight}; padding: 8rem 2rem; display: flex; align-items: center; justify-content: center; ${bgStyle} position: relative; overflow: hidden;" data-variation="${escapeHtml(variation || variant || "")}">${styleBlock}${overlayHtml}${wrapHtml}</section>`;
}

/**
 * Resolve hero button styles with configurable hover effects
 */
function resolveHeroButtonStylesWithHover(
  theme: ThemeTokens | undefined,
  blockId: string,
  hoverEffect: string,
  hoverIntensity: number,
  hoverOverlay: string = "none",
): { primary: string; secondary: string; css: string } {
  const primaryColor = theme?.colors?.primary || "#3b82f6";
  const primaryText = theme?.colors?.primaryText || "#ffffff";

  const primaryStyles = [
    `background-color: ${primaryColor}`,
    `color: ${primaryText}`,
    "padding: 0.875rem 2rem",
    "border-radius: 0.5rem",
    "font-weight: 600",
    "font-size: 1rem",
    "text-decoration: none",
    "display: inline-block",
    "transition: all 0.2s ease",
    "border: none",
    "position: relative",
    "overflow: hidden",
  ].join("; ");

  const secondaryStyles = [
    "background-color: transparent",
    `color: ${primaryColor}`,
    "padding: 0.875rem 2rem",
    "border-radius: 0.5rem",
    "font-weight: 600",
    "font-size: 1rem",
    "text-decoration: none",
    "display: inline-block",
    "transition: all 0.2s ease",
    `border: 2px solid ${primaryColor}`,
    "position: relative",
    "overflow: hidden",
  ].join("; ");

  const scope = blockId ? `[data-block-id="${blockId}"]` : "";
  let css = "";

  // Efeito principal
  if (hoverEffect !== "none") {
    // Primary button hover
    const primaryHoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: primaryColor,
      buttonTextColor: primaryText,
      variant: "solid",
    });

    // Secondary button hover
    const secondaryHoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: primaryColor,
      buttonTextColor: primaryColor,
      variant: "outline",
    });

    // Base styles if needed
    if (primaryHoverResult.base) {
      css += `
        ${scope} .sg-hero__btn--primary {
          ${primaryHoverResult.base}
        }
      `;
    }

    if (secondaryHoverResult.base) {
      css += `
        ${scope} .sg-hero__btn--secondary {
          ${secondaryHoverResult.base}
        }
      `;
    }

    // Hover styles
    css += `
      ${scope} .sg-hero__btn--primary:hover {
        ${primaryHoverResult.hover}
      }
      ${scope} .sg-hero__btn--secondary:hover {
        ${secondaryHoverResult.hover}
      }
    `;

    // Add keyframes for pulse animation
    css += getButtonHoverKeyframes();
  }

  // Efeito overlay (adicional)
  if (hoverOverlay && hoverOverlay !== "none") {
    css += generateButtonOverlayCSS(`${scope} .sg-hero__btn--primary`, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor,
    });
    css += generateButtonOverlayCSS(`${scope} .sg-hero__btn--secondary`, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor,
    });
  }

  return {
    primary: primaryStyles,
    secondary: secondaryStyles,
    css,
  };
}
