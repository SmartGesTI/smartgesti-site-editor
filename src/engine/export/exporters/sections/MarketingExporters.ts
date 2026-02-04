/**
 * Marketing Sections Exporters
 * Feature, FeatureGrid, Pricing, Testimonials, FAQ, CTA, Stats, Logo Cloud, etc.
 * Mobile-first responsive grids with media queries
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, blockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import { resolveResponsiveColumns, generateResponsiveGridStyles } from "../../shared/responsiveGridHelper";
import {
  generateButtonHoverStyles,
  getButtonHoverKeyframes,
  getShineEffectCSS,
  type ButtonHoverEffect,
} from "../../../shared/hoverEffects";

export function exportFeature(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { icon, title, description } = (block as any).props;
  const iconHtml = icon
    ? `<div style="width: 3rem; height: 3rem; background-color: var(--sg-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #fff;">[★]</div>`
    : "";
  return `<div ${dataBlockIdAttr(block.id)} style="padding: 1.5rem; text-align: center;">${iconHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3><p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(description)}</p></div>`;
}

export function exportFeatureGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    title,
    subtitle,
    columns = 3,
    variant = "default",
    features = [],
  } = (block as any).props;

  // Responsive grid: 1 col (mobile) → 2 cols (tablet) → N cols (desktop)
  const gridId = generateScopedId(block.id || "", "feature-grid");
  const responsiveConfig = resolveResponsiveColumns(columns, 1, 2, columns);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(gridId, responsiveConfig, "2rem");

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

  return `<style>${mediaQueries}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${gridId}" style="${inlineStyles}">${featuresHtml}</div></div></section>`;
}

export function exportCta(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    description: ctaDesc,
    primaryButton,
    secondaryButton,
    variant = "centered",
    // Button hover effects
    buttonHoverEffect = "scale",
    buttonHoverIntensity = 50,
  } = (block as any).props;

  // Responsive buttons: column (mobile) → row (desktop)
  const ctaId = generateScopedId(block.id || "", "cta-actions");
  const scope = `[data-block-id="${block.id}"]`;

  const isGradient = variant === "gradient";
  const primaryColor = theme?.colors?.primary || "#3b82f6";
  const primaryText = theme?.colors?.primaryText || "#ffffff";

  // Button colors depend on gradient variant
  const primaryBtnBg = isGradient ? "#fff" : primaryColor;
  const primaryBtnText = isGradient ? primaryColor : primaryText;
  const secondaryBtnBg = "transparent";
  const secondaryBtnText = isGradient ? "#fff" : primaryColor;
  const secondaryBtnBorder = isGradient ? "#fff" : primaryColor;

  let buttonsCss = `
    @media (max-width: 640px) {
      #${ctaId} {
        flex-direction: column !important;
        width: 100%;
      }
      #${ctaId} a {
        width: 100% !important;
        text-align: center;
      }
    }
  `;

  // Generate hover CSS
  if (buttonHoverEffect !== "none") {
    // Primary button hover
    const primaryHoverResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: primaryBtnBg,
      buttonTextColor: primaryBtnText,
      variant: "solid",
    });

    // Secondary button hover
    const secondaryHoverResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: secondaryBtnBorder,
      buttonTextColor: secondaryBtnText,
      variant: "outline",
    });

    // Base styles if needed
    if (primaryHoverResult.base) {
      buttonsCss += `
        ${scope} .sg-cta__btn--primary {
          ${primaryHoverResult.base}
        }
      `;
    }

    if (secondaryHoverResult.base) {
      buttonsCss += `
        ${scope} .sg-cta__btn--secondary {
          ${secondaryHoverResult.base}
        }
      `;
    }

    // Hover styles
    buttonsCss += `
      ${scope} .sg-cta__btn--primary:hover {
        ${primaryHoverResult.hover}
      }
      ${scope} .sg-cta__btn--secondary:hover {
        ${secondaryHoverResult.hover}
      }
    `;

    // Add keyframes for pulse animation
    buttonsCss += getButtonHoverKeyframes();

    // Add shine effect CSS
    buttonsCss += getShineEffectCSS(`${scope} .sg-cta__btn--primary`);
    buttonsCss += getShineEffectCSS(`${scope} .sg-cta__btn--secondary`);
  }

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

  const primaryBtnStyle = `padding: 0.75rem 1.5rem; background-color: ${primaryBtnBg}; color: ${primaryBtnText}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500; display: inline-block; transition: all 0.2s ease; position: relative; overflow: hidden;`;
  const secondaryBtnStyle = `padding: 0.75rem 1.5rem; background-color: ${secondaryBtnBg}; color: ${secondaryBtnText}; border: 2px solid ${secondaryBtnBorder}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500; display: inline-block; transition: all 0.2s ease; position: relative; overflow: hidden;`;

  const primaryBtnHtml = primaryButton
    ? `<a href="${escapeHtml(ctaPrimaryHref)}"${linkTargetAttr(ctaPrimaryHref, basePath)} class="sg-cta__btn sg-cta__btn--primary" style="${primaryBtnStyle}">${escapeHtml(primaryButton.text)}</a>`
    : "";
  const secondaryBtnHtml = secondaryButton
    ? `<a href="${escapeHtml(ctaSecondaryHref)}"${linkTargetAttr(ctaSecondaryHref, basePath)} class="sg-cta__btn sg-cta__btn--secondary" style="${secondaryBtnStyle}">${escapeHtml(secondaryButton.text)}</a>`
    : "";
  return `<style>${buttonsCss}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle} text-align: center;"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;"><h2 style="font-size: var(--sg-heading-h2); margin-bottom: 1rem; color: ${textColor};">${escapeHtml(title)}</h2>${ctaDesc ? `<p style="font-size: 1.125rem; margin-bottom: 2rem; color: ${mutedColor};">${escapeHtml(ctaDesc)}</p>` : ""}<div id="${ctaId}" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">${primaryBtnHtml}${secondaryBtnHtml}</div></div></section>`;
}

export function exportPricingCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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
  return `<div ${dataBlockIdAttr(block.id)} style="background-color: var(--sg-bg); border-radius: 0.75rem; padding: 2rem; box-shadow: ${highlighted ? "var(--sg-shadow-strong)" : "var(--sg-card-shadow)"}; border: ${highlighted ? "2px solid var(--sg-primary)" : "1px solid var(--sg-border)"}; position: relative;">${badgeHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(name)}</h3>${desc ? `<p style="color: var(--sg-muted-text); margin-bottom: 1rem;">${escapeHtml(desc)}</p>` : ""}<div style="margin-bottom: 1.5rem;"><span style="font-size: 2.5rem; font-weight: 700;">${escapeHtml(price)}</span>${period ? `<span style="color: var(--sg-muted-text);">${escapeHtml(period)}</span>` : ""}</div><ul style="list-style: none; padding: 0; margin-bottom: 1.5rem;">${featuresHtml}</ul>${buttonText ? `<button style="width: 100%; padding: 0.625rem 1.25rem; ${buttonStyle} border-radius: var(--sg-button-radius); font-weight: 500; cursor: pointer;">${escapeHtml(buttonText)}</button>` : ""}</div>`;
}

export function exportPricing(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { title, subtitle, plans = [] } = (block as any).props;

  // Responsive grid: 1 col (mobile) → 2 cols (tablet) → N cols (desktop, max 4)
  const gridId = generateScopedId(block.id || "", "pricing-grid");
  const maxCols = Math.min(plans.length, 4);
  const responsiveConfig = resolveResponsiveColumns({ lg: maxCols }, 1, 2, maxCols);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(gridId, responsiveConfig, "2rem", "align-items: start;");

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportPricing requires renderChild function");
  }

  const plansHtml = plans
    .map((p: any) =>
      renderChild(
        { id: `${block.id}-plan`, type: "pricingCard", props: p } as Block,
        depth + 1,
        basePath,
        theme,
      ),
    )
    .join("");

  return `<style>${mediaQueries}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${gridId}" style="${inlineStyles}">${plansHtml}</div></div></section>`;
}

export function exportTestimonial(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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
  return `<div ${dataBlockIdAttr(block.id)} style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius); padding: 2rem;">${ratingHtml}<blockquote style="font-size: 1rem; margin-bottom: 1.5rem; font-style: italic;">"${escapeHtml(quote)}"</blockquote><div style="display: flex; align-items: center; gap: 1rem;">${avatarHtml}<div><div style="font-weight: 600;">${escapeHtml(authorName)}</div>${authorRole || authorCompany ? `<div style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(authorRole || "")}${authorRole && authorCompany ? ", " : ""}${escapeHtml(authorCompany || "")}</div>` : ""}</div></div></div>`;
}

export function exportTestimonialGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    title,
    subtitle,
    columns = 3,
    testimonials = [],
  } = (block as any).props;

  // Responsive grid: 1 col (mobile) → 2 cols (tablet) → N cols (desktop)
  const gridId = generateScopedId(block.id || "", "testimonial-grid");
  const responsiveConfig = resolveResponsiveColumns(columns, 1, 2, columns);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(gridId, responsiveConfig, "2rem");

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportTestimonialGrid requires renderChild function");
  }

  const testimonialsHtml = testimonials
    .map((t: any) =>
      renderChild(
        { id: `${block.id}-t`, type: "testimonial", props: t } as Block,
        depth + 1,
        basePath,
        theme,
      ),
    )
    .join("");

  return `<style>${mediaQueries}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${gridId}" style="${inlineStyles}">${testimonialsHtml}</div></div></section>`;
}

export function exportFaqItem(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { question, answer } = (block as any).props;
  return `<details ${dataBlockIdAttr(block.id)} style="border-bottom: 1px solid var(--sg-border); padding: 1rem 0;"><summary style="font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">${escapeHtml(question)}<span>+</span></summary><p style="margin-top: 1rem; color: var(--sg-muted-text);">${escapeHtml(answer)}</p></details>`;
}

export function exportFaq(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { title, subtitle, items = [] } = (block as any).props;

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportFaq requires renderChild function");
  }

  const itemsHtml = items
    .map((i: any) =>
      renderChild(
        { id: `${block.id}-faq`, type: "faqItem", props: i } as Block,
        depth + 1,
        basePath,
        theme,
      ),
    )
    .join("");

  return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div>${itemsHtml}</div></div></section>`;
}

export function exportStats(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { title, subtitle, items = [] } = (block as any).props;

  // Responsive grid: 1 col (mobile) → 2 cols (tablet) → N cols (desktop)
  const gridId = generateScopedId(block.id || "", "stats-grid");
  const responsiveConfig = resolveResponsiveColumns({ lg: items.length }, 1, 2, items.length);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(gridId, responsiveConfig, "2rem", "text-align: center;");

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

  return `<style>${mediaQueries}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${gridId}" style="${inlineStyles}">${itemsHtml}</div></div></section>`;
}

export function exportStatItem(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { value, label, prefix, suffix } = (block as any).props;
  return `<div ${dataBlockIdAttr(block.id)} style="text-align: center;"><div style="font-size: 2.5rem; font-weight: 700; color: var(--sg-primary);">${escapeHtml(prefix || "")}${escapeHtml(value)}${escapeHtml(suffix || "")}</div><div style="color: var(--sg-muted-text);">${escapeHtml(label)}</div></div>`;
}

export function exportLogoCloud(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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

  return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 2rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">${titleHtml}<div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap;">${logosHtml}</div></div></section>`;
}

export function exportSocialLinks(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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

  return `<div ${dataBlockIdAttr(block.id)} style="display: flex; gap: 1rem; align-items: center;">${linksHtml}</div>`;
}
