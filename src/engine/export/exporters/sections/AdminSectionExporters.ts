/**
 * Admin Section Exporters
 * ProductShowcase, AboutSection, ContactSection
 * Mobile-first responsive layouts with media queries
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, blockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
} from "../../shared/responsiveGridHelper";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

// ============================================================================
// Shared: button hover CSS generator for admin sections
// ============================================================================

function generateAdminButtonHoverCSS(
  scope: string,
  classPrefix: string,
  props: {
    buttonHoverEffect: string;
    buttonHoverIntensity: number;
    buttonHoverOverlay: string;
    buttonHoverIconName: string;
  },
  theme?: ThemeTokens,
): string {
  const {
    buttonHoverEffect,
    buttonHoverIntensity,
    buttonHoverOverlay,
    buttonHoverIconName,
  } = props;

  const primaryColor = theme?.colors?.primary || "#6366f1";
  const primaryText = theme?.colors?.primaryText || "#ffffff";
  let css = "";

  if (buttonHoverEffect !== "none") {
    const primaryResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: primaryColor,
      buttonTextColor: primaryText,
      variant: "solid",
    });
    const outlineResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: primaryColor,
      buttonTextColor: primaryColor,
      variant: "outline",
    });

    if (primaryResult.base) {
      css += `${scope} .${classPrefix}--primary { ${primaryResult.base} }`;
    }
    if (outlineResult.base) {
      css += `${scope} .${classPrefix}--secondary { ${outlineResult.base} }`;
    }
    css += `${scope} .${classPrefix}--primary:hover { ${primaryResult.hover} }`;
    css += `${scope} .${classPrefix}--secondary:hover { ${outlineResult.hover} }`;
    css += getButtonHoverKeyframes();
  }

  if (buttonHoverOverlay && buttonHoverOverlay !== "none") {
    css += generateButtonOverlayCSS(`${scope} .${classPrefix}--primary`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor,
      iconName: buttonHoverIconName,
      textColor: primaryText,
    });
    css += generateButtonOverlayCSS(`${scope} .${classPrefix}--secondary`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor,
      iconName: buttonHoverIconName,
      textColor: primaryColor,
    });
  }

  return css;
}

const BTN_HOVER_BASE = "position: relative; overflow: hidden; transition: all 0.2s ease;";

// ============================================================================
// ProductShowcase
// ============================================================================

export function exportProductShowcase(
  block: Block,
  _depth: number,
  _basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    subtitle,
    products = [],
    variant = "alternating",
    bg,
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = (block as any).props;

  const bgStyle = bg ? `background-color: ${escapeHtml(bg)};` : "background-color: var(--sg-bg);";
  const scope = `[data-block-id="${block.id}"]`;

  // Hover CSS
  const hoverCss = generateAdminButtonHoverCSS(scope, "sg-showcase__btn", {
    buttonHoverEffect,
    buttonHoverIntensity,
    buttonHoverOverlay,
    buttonHoverIconName,
  }, theme);

  // Header
  const subtitleHtml = subtitle
    ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">${escapeHtml(subtitle)}</span>`
    : "";
  const titleHtml = title
    ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>`
    : "";
  const headerHtml =
    title || subtitle
      ? `<div data-block-group="Conteúdo" style="text-align: center; margin-bottom: 3rem;">${subtitleHtml}${titleHtml}</div>`
      : "";

  const stylePreamble = hoverCss ? `<style>${hoverCss}</style>` : "";

  if (variant === "grid") {
    const gridId = generateScopedId(block.id || "", "product-grid");
    const responsiveConfig = resolveResponsiveColumns(
      Math.min(products.length, 3),
      1,
      2,
      Math.min(products.length, 3),
    );
    const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(gridId, responsiveConfig, "2rem");

    const cardsHtml = products
      .map((p: any) => {
        const imgHtml = p.image
          ? `<div style="width: 100%; height: 200px; background-image: url(${escapeHtml(p.image)}); background-size: cover; background-position: center;"></div>`
          : "";
        const badgeHtml = p.badge
          ? `<span style="display: inline-block; padding: 0.125rem 0.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 9999px; font-size: 0.7rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(p.badge)}</span>`
          : "";
        const iconHtml = p.icon ? `<span style="margin-right: 0.5rem;">${escapeHtml(p.icon)}</span>` : "";
        const btnHtml = p.primaryButton
          ? `<a href="${escapeHtml(p.primaryButton.href || "#")}" class="sg-showcase__btn sg-showcase__btn--primary" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500; font-size: 0.875rem; ${BTN_HOVER_BASE}">${escapeHtml(p.primaryButton.text)}</a>`
          : "";
        return `<div style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius, 0.75rem); overflow: hidden; box-shadow: var(--sg-card-shadow);">${imgHtml}<div style="padding: 1.5rem;">${badgeHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${iconHtml}${escapeHtml(p.name)}</h3><p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(p.description)}</p>${btnHtml}</div></div>`;
      })
      .join("");

    return `${stylePreamble}<style>${mediaQueries}</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div data-block-group="Layout" id="${gridId}" style="${inlineStyles}">${cardsHtml}</div></div></section>`;
  }

  // alternating / stacked
  const scopeId = generateScopedId(block.id || "", "product-showcase");
  const productsHtml = products
    .map((p: any, index: number) => {
      const isReversed = variant === "alternating" && index % 2 === 1;

      const imgHtml = p.image
        ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width: 100%; border-radius: var(--sg-card-radius, 0.75rem); object-fit: cover;" />`
        : `<div style="width: 100%; height: 300px; background-color: var(--sg-surface); border-radius: var(--sg-card-radius, 0.75rem); display: flex; align-items: center; justify-content: center; font-size: 4rem;">${escapeHtml(p.icon || "📦")}</div>`;

      const badgeHtml = p.badge
        ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 9999px; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.75rem;">${escapeHtml(p.badge)}</span>`
        : "";
      const iconHtml = p.icon ? `<span style="margin-right: 0.5rem;">${escapeHtml(p.icon)}</span>` : "";

      const featuresHtml =
        p.features && p.features.length > 0
          ? `<ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">${p.features.map((f: string) => `<li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span style="color: #10b981; font-weight: 700;">✓</span>${escapeHtml(f)}</li>`).join("")}</ul>`
          : "";

      const primaryBtnHtml = p.primaryButton
        ? `<a href="${escapeHtml(p.primaryButton.href || "#")}" class="sg-showcase__btn sg-showcase__btn--primary" style="display: inline-block; padding: 0.625rem 1.25rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500; ${BTN_HOVER_BASE}">${escapeHtml(p.primaryButton.text)}</a>`
        : "";
      const secondaryBtnHtml = p.secondaryButton
        ? `<a href="${escapeHtml(p.secondaryButton.href || "#")}" class="sg-showcase__btn sg-showcase__btn--secondary" style="display: inline-block; padding: 0.625rem 1.25rem; background-color: transparent; color: var(--sg-primary); border: 1px solid var(--sg-primary); border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500; ${BTN_HOVER_BASE}">${escapeHtml(p.secondaryButton.text)}</a>`
        : "";
      const buttonsHtml =
        primaryBtnHtml || secondaryBtnHtml
          ? `<div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">${primaryBtnHtml}${secondaryBtnHtml}</div>`
          : "";

      const itemId = `${scopeId}-item-${index}`;

      return `<style>
  #${itemId} { flex-direction: column; }
  @media (min-width: 768px) { #${itemId} { flex-direction: ${isReversed ? "row-reverse" : "row"}; } }
</style><div id="${itemId}" style="display: flex; gap: 3rem; align-items: center;"><div style="flex: 1 1 50%;">${imgHtml}</div><div style="flex: 1 1 50%;">${badgeHtml}<h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">${iconHtml}${escapeHtml(p.name)}</h3><p style="color: var(--sg-muted-text); margin-bottom: 1rem; line-height: 1.7;">${escapeHtml(p.longDescription || p.description)}</p>${featuresHtml}${buttonsHtml}</div></div>`;
    })
    .join("");

  return `${stylePreamble}<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div data-block-group="Layout" style="display: flex; flex-direction: column; gap: 4rem;">${productsHtml}</div></div></section>`;
}

// ============================================================================
// AboutSection
// ============================================================================

export function exportAboutSection(
  block: Block,
  _depth: number,
  _basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    subtitle,
    description,
    secondaryDescription,
    image,
    achievements = [],
    primaryButton,
    variant = "image-left",
    bg,
    stats = [],
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = (block as any).props;

  const bgStyle = bg ? `background-color: ${escapeHtml(bg)};` : "background-color: var(--sg-bg);";
  const isCentered = variant === "centered";
  const isReversed = variant === "image-right";
  const scope = `[data-block-id="${block.id}"]`;

  // Hover CSS
  const hoverCss = generateAdminButtonHoverCSS(scope, "sg-about__btn", {
    buttonHoverEffect,
    buttonHoverIntensity,
    buttonHoverOverlay,
    buttonHoverIconName,
  }, theme);

  const subtitleHtml = subtitle
    ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">${escapeHtml(subtitle)}</span>`
    : "";
  const titleHtml = title
    ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 1rem;">${escapeHtml(title)}</h2>`
    : "";
  const descHtml = description
    ? `<p style="color: var(--sg-muted-text); line-height: 1.7; margin-bottom: 1rem;">${escapeHtml(description)}</p>`
    : "";
  const secondaryDescHtml = secondaryDescription
    ? `<p style="color: var(--sg-muted-text); line-height: 1.7; margin-bottom: 1.5rem;">${escapeHtml(secondaryDescription)}</p>`
    : "";
  const achievementsHtml =
    achievements.length > 0
      ? `<ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">${achievements.map((a: any) => `<li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span style="color: #10b981; font-weight: 700;">✓</span>${escapeHtml(a.text)}</li>`).join("")}</ul>`
      : "";
  const buttonHtml = primaryButton
    ? `<a href="${escapeHtml(primaryButton.href || "#")}" class="sg-about__btn sg-about__btn--primary" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500; ${BTN_HOVER_BASE}">${escapeHtml(primaryButton.text)}</a>`
    : "";

  const stylePreamble = hoverCss ? `<style>${hoverCss}</style>` : "";

  if (isCentered) {
    const imgHtml = image
      ? `<div data-block-group="Mídia" style="margin: 2rem 0;"><img src="${escapeHtml(image)}" alt="${escapeHtml(title || "About")}" style="width: 100%; border-radius: var(--sg-card-radius, 0.75rem); object-fit: cover;" /></div>`
      : "";
    return `${stylePreamble}<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem; text-align: center;">${subtitleHtml}${titleHtml}${imgHtml}${descHtml}${secondaryDescHtml}${achievementsHtml}${buttonHtml}</div></section>`;
  }

  // image-left / image-right
  const scopeId = generateScopedId(block.id || "", "about");
  const imgHtml = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title || "About")}" style="width: 100%; border-radius: var(--sg-card-radius, 0.75rem); object-fit: cover;" />`
    : `<div style="width: 100%; height: 400px; background-color: var(--sg-surface); border-radius: var(--sg-card-radius, 0.75rem); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--sg-muted-text);">Imagem</div>`;

  const statsHtml =
    stats.length > 0
      ? `<div style="display: flex; gap: 0.5rem; margin-top: 1rem;">${stats.map((s: any) => `<div style="background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); padding: 0.75rem 1rem; border-radius: var(--sg-card-radius, 0.75rem); text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 80px;"><div style="font-size: 1.5rem; font-weight: 700;">${escapeHtml(s.value)}</div><div style="font-size: 0.7rem; opacity: 0.9;">${escapeHtml(s.label)}</div></div>`).join("")}</div>`
      : "";

  return `${stylePreamble}<style>
  #${scopeId} { flex-direction: column; }
  @media (min-width: 768px) { #${scopeId} { flex-direction: ${isReversed ? "row-reverse" : "row"}; } }
</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div id="${scopeId}" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; gap: 3rem; align-items: center;"><div data-block-group="Mídia" style="flex: 1 1 50%; position: relative;">${imgHtml}${statsHtml}</div><div data-block-group="Conteúdo" style="flex: 1 1 50%;">${subtitleHtml}${titleHtml}${descHtml}${secondaryDescHtml}${achievementsHtml}${buttonHtml}</div></div></section>`;
}

// ============================================================================
// ContactSection
// ============================================================================

const CONTACT_ICON_SVG: Record<string, string> = {
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  "map-pin": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
};

function getContactIconSvg(icon: string): string {
  return CONTACT_ICON_SVG[icon] || CONTACT_ICON_SVG.mail;
}

export function exportContactSection(
  block: Block,
  _depth: number,
  _basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    subtitle,
    description,
    contactInfo = [],
    formTitle,
    formFields = [],
    submitText = "Enviar",
    variant = "split",
    bg,
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = (block as any).props;

  const bgStyle = bg ? `background-color: ${escapeHtml(bg)};` : "background-color: var(--sg-bg);";
  const isFormOnly = variant === "form-only";
  const isStacked = variant === "stacked";
  const scope = `[data-block-id="${block.id}"]`;

  // Hover CSS — submit button uses --primary class
  const hoverCss = generateAdminButtonHoverCSS(scope, "sg-contact__btn", {
    buttonHoverEffect,
    buttonHoverIntensity,
    buttonHoverOverlay,
    buttonHoverIconName,
  }, theme);

  const subtitleHtml = subtitle
    ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">${escapeHtml(subtitle)}</span>`
    : "";
  const titleHtml = title
    ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>`
    : "";
  const descHtml = description
    ? `<p style="color: var(--sg-muted-text);">${escapeHtml(description)}</p>`
    : "";
  const headerHtml =
    title || subtitle
      ? `<div data-block-group="Conteúdo" style="text-align: center; margin-bottom: 3rem;">${subtitleHtml}${titleHtml}${descHtml}</div>`
      : "";

  // Form HTML
  const fieldsHtml = formFields
    .map((field: any) => {
      const labelHtml = field.label
        ? `<label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--sg-text);">${escapeHtml(field.label)}${field.required ? '<span style="color: #ef4444;"> *</span>' : ""}</label>`
        : "";
      const inputStyle = `width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--sg-border); border-radius: var(--sg-button-radius, 0.5rem); font-size: 0.875rem; background-color: var(--sg-bg); color: var(--sg-text); box-sizing: border-box;`;
      const inputHtml =
        field.type === "textarea"
          ? `<textarea name="${escapeHtml(field.name)}" placeholder="${escapeHtml(field.placeholder || "")}" rows="4" style="${inputStyle} resize: vertical;"${field.required ? " required" : ""}></textarea>`
          : `<input type="${escapeHtml(field.type || "text")}" name="${escapeHtml(field.name)}" placeholder="${escapeHtml(field.placeholder || "")}" style="${inputStyle}"${field.required ? " required" : ""} />`;
      return `<div style="margin-bottom: 1rem;">${labelHtml}${inputHtml}</div>`;
    })
    .join("");

  const submitBtnStyle = `width: 100%; padding: 0.75rem 1.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border: none; border-radius: var(--sg-button-radius, 0.5rem); font-weight: 500; cursor: pointer; font-size: 1rem; ${BTN_HOVER_BASE}`;

  const formHtml = `<div data-block-group="Formulário" style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius, 0.75rem); padding: 2rem; box-shadow: var(--sg-card-shadow);">${formTitle ? `<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">${escapeHtml(formTitle)}</h3>` : ""}<form>${fieldsHtml}<button type="submit" class="sg-contact__btn sg-contact__btn--primary" style="${submitBtnStyle}">${escapeHtml(submitText)}</button></form></div>`;

  const stylePreamble = hoverCss ? `<style>${hoverCss}</style>` : "";

  if (isFormOnly) {
    return `${stylePreamble}<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 600px; margin: 0 auto; padding: 0 1rem;">${headerHtml}${formHtml}</div></section>`;
  }

  // Contact info cards
  const contactCardsHtml = contactInfo
    .map((info: any) => {
      const iconSvg = getContactIconSvg(info.icon || "mail");
      return `<div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; background-color: var(--sg-surface); border-radius: var(--sg-card-radius, 0.75rem); box-shadow: var(--sg-card-shadow);"><div style="width: 2.5rem; height: 2.5rem; background-color: var(--sg-primary); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: var(--sg-primary-text, #fff); flex-shrink: 0;">${iconSvg}</div><div><div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${escapeHtml(info.label)}</div><div style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(info.value)}</div></div></div>`;
    })
    .join("");

  const scopeId = generateScopedId(block.id || "", "contact");

  if (isStacked) {
    return `${stylePreamble}<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}${contactInfo.length > 0 ? `<div data-block-group="Info" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem;">${contactCardsHtml}</div>` : ""}${formHtml}</div></section>`;
  }

  // split layout
  return `${stylePreamble}<style>
  #${scopeId} { flex-direction: column; }
  @media (min-width: 768px) { #${scopeId} { flex-direction: row; } }
</style><section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; ${bgStyle}"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${scopeId}" style="display: flex; gap: 3rem;">${contactInfo.length > 0 ? `<div data-block-group="Info" style="flex: 1 1 40%; display: flex; flex-direction: column; gap: 1rem;">${contactCardsHtml}</div>` : ""}<div style="flex: 1 1 60%;">${formHtml}</div></div></div></section>`;
}
