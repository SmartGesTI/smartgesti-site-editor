/**
 * Blog Post Exporters
 * BlogPostCard, BlogPostGrid, BlogPostDetail
 * Mobile-first responsive layouts for blog plugin blocks
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
} from "../../shared/responsiveGridHelper";
import { resolveWidgetShadow } from "../../../shared/widgetStyles";
import {
  generateLinkHoverStyles,
  generateButtonHoverStyles,
  type ButtonHoverEffect,
} from "../../../shared/hoverEffects";

// ---------------------------------------------------------------------------
// Helper Functions for Card Customization
// ---------------------------------------------------------------------------

/**
 * Resolve card shadow CSS value
 */
function resolveCardShadow(shadow: string): string {
  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  };
  return shadowMap[shadow] || shadowMap.md;
}

/**
 * Generate card hover effect CSS
 */
function generateCardHoverCSS(
  cardId: string,
  hoverEffect: string,
  shadow: string,
): string {
  if (hoverEffect === "none") return "";

  let hoverStyles = "";
  switch (hoverEffect) {
    case "lift":
      hoverStyles = "transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);";
      break;
    case "scale":
      hoverStyles = "transform: scale(1.02);";
      break;
    case "glow":
      hoverStyles = "box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);";
      break;
    default:
      return "";
  }

  return `
    #${cardId} { transition: all 0.3s ease; }
    #${cardId}:hover { ${hoverStyles} }
  `;
}

/**
 * Generate image hover effect CSS
 */
function generateImageHoverCSS(
  cardId: string,
  imageId: string,
  effect: string,
): string {
  if (effect === "none") return "";

  let imageStyles = "";
  switch (effect) {
    case "zoom":
      imageStyles = "transform: scale(1.1);";
      break;
    case "brightness":
      imageStyles = "filter: brightness(1.1);";
      break;
    default:
      return "";
  }

  return `
    #${imageId} { transition: transform 0.3s ease, filter 0.3s ease; }
    #${cardId}:hover #${imageId} { ${imageStyles} }
  `;
}

/**
 * Generate CTA (link or button) styles and hover CSS
 */
function generateCTAStyles(config: {
  cardId: string;
  ctaId: string;
  ctaVariation: string;
  linkColor: string;
  linkHoverColor: string;
  linkHoverEffect: string;
  buttonVariant: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  buttonSize: string;
  buttonHoverEffect: string;
  buttonHoverIntensity: number;
  buttonHoverOverlay: string;
}): { inlineStyles: string; hoverCSS: string } {
  const {
    cardId,
    ctaId,
    ctaVariation,
    linkColor,
    linkHoverColor,
    linkHoverEffect,
    buttonVariant,
    buttonColor,
    buttonTextColor,
    buttonRadius,
    buttonSize,
    buttonHoverEffect,
    buttonHoverIntensity,
  } = config;

  // Link variation
  if (ctaVariation === "link") {
    const inlineStyles = `color: ${linkColor}; font-weight: 600; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.2s ease; position: relative;`;

    // Generate link hover styles using shared utility
    const linkHoverResult = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: 50,
      hoverColor: linkHoverColor,
    });

    let hoverCSS = "";
    if (linkHoverResult.base) {
      hoverCSS += `#${ctaId} { ${linkHoverResult.base} }\n`;
    }
    hoverCSS += `#${ctaId}:hover { ${linkHoverResult.hover} }`;

    return { inlineStyles, hoverCSS };
  }

  // Button variation
  const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
    md: { padding: "0.625rem 1.5rem", fontSize: "0.9375rem" },
    lg: { padding: "0.75rem 2rem", fontSize: "1rem" },
  };
  const size = sizeStyles[buttonSize] || sizeStyles.md;

  const baseStyles = [
    `padding: ${size.padding}`,
    `font-size: ${size.fontSize}`,
    "font-weight: 600",
    "text-decoration: none",
    "display: inline-flex",
    "align-items: center",
    "justify-content: center",
    "gap: 0.5rem",
    `border-radius: ${buttonRadius}px`,
    "transition: all 0.2s ease",
    "cursor: pointer",
  ];

  // Variant-specific styles
  switch (buttonVariant) {
    case "outline":
      baseStyles.push(`background-color: transparent`, `border: 2px solid ${buttonColor}`, `color: ${buttonColor}`);
      break;
    case "ghost":
      baseStyles.push(`background-color: transparent`, `border: none`, `color: ${buttonColor}`);
      break;
    default: // solid
      baseStyles.push(`background-color: ${buttonColor}`, `border: 2px solid ${buttonColor}`, `color: ${buttonTextColor}`);
  }

  const inlineStyles = baseStyles.join("; ");

  // Hover effects
  let hoverCSS = "";
  if (buttonHoverEffect !== "none") {
    const hoverResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor,
      buttonTextColor: buttonVariant === "solid" ? buttonTextColor : buttonColor,
      variant: buttonVariant as "solid" | "outline" | "ghost",
    });

    if (hoverResult.base) {
      hoverCSS += `#${ctaId} { ${hoverResult.base} }\n`;
    }
    hoverCSS += `#${ctaId}:hover { ${hoverResult.hover} }`;
  }

  return { inlineStyles, hoverCSS };
}

// ---------------------------------------------------------------------------
// BlogPostCard
// ---------------------------------------------------------------------------

export function exportBlogPostCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    excerpt,
    image,
    date,
    category,
    authorName,
    authorAvatar,
    readingTime,
    linkHref,
    linkText = "Ler mais",
    variant = "default",
    showImage = true,
    showCategory = true,
    showDate = true,
    showAuthor = false,
    showReadingTime = false,
    // Card customization
    cardBorderRadius = "0.75rem",
    cardShadow = "md",
    cardHoverEffect = "lift",
    cardBorder = true,
    cardBorderColor = "#e5e7eb",
    cardBorderWidth = 1,
    // Image effects
    imageHoverEffect = "zoom",
    imageBorderRadius = "0.75rem",
    // CTA customization
    ctaVariation = "link",
    linkColor = "#2563eb",
    linkHoverColor = "#1d4ed8",
    linkHoverEffect = "underline",
    buttonVariant = "solid",
    buttonColor = "#2563eb",
    buttonTextColor = "#ffffff",
    buttonRadius = 8,
    buttonSize = "md",
    buttonHoverEffect = "darken",
    buttonHoverIntensity = 20,
    buttonHoverOverlay = "none",
  } = (block as any).props;

  // ---------- variant: horizontal ----------
  if (variant === "horizontal") {
    const cardId = `card-${block.id}`;
    const imageId = `img-${block.id}`;
    const ctaId = `cta-${block.id}`;

    const cardShadowValue = resolveCardShadow(cardShadow);
    const cardBorderStyle = cardBorder ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none";

    const cardHoverCSS = generateCardHoverCSS(cardId, cardHoverEffect, cardShadow);
    const imageHoverCSS = generateImageHoverCSS(cardId, imageId, imageHoverEffect);
    const ctaStyles = generateCTAStyles({
      cardId,
      ctaId,
      ctaVariation,
      linkColor,
      linkHoverColor,
      buttonVariant,
      buttonColor,
      buttonTextColor,
      buttonRadius,
      buttonSize,
      buttonHoverEffect,
      buttonHoverIntensity,
      buttonHoverOverlay,
    });

    const allHoverCSS = cardHoverCSS + imageHoverCSS + ctaStyles.hoverCSS;

    const imgHtml =
      showImage && image
        ? `<div style="width: 40%; min-width: 200px; overflow: hidden; flex-shrink: 0;"><img id="${imageId}" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="width: 100%; height: 100%; min-height: 200px; object-fit: cover; display: block;" /></div>`
        : "";

    const metaParts: string[] = [];
    if (showCategory && category) {
      metaParts.push(`<span style="font-size: 0.75rem; font-weight: 600; color: var(--sg-primary); text-transform: uppercase;">${escapeHtml(category)}</span>`);
    }
    if (showDate && date) metaParts.push(escapeHtml(date));
    if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));

    const metaHtml = metaParts.length
      ? `<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.75rem;">${metaParts.join(' <span>·</span> ')}</div>`
      : "";

    const authorHtml =
      showAuthor && authorName
        ? `<div style="display: flex; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 0.75rem;">${
            authorAvatar
              ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />`
              : ""
          }<span style="font-size: 0.875rem; color: var(--sg-muted-text);">${escapeHtml(authorName)}</span></div>`
        : "";

    const ctaHtml = linkText && linkHref
      ? `<a id="${ctaId}" href="${escapeHtml(linkHref)}" style="${ctaStyles.inlineStyles}">${escapeHtml(linkText)}${ctaVariation === "link" ? " →" : ""}</a>`
      : "";

    return `${allHoverCSS ? `<style>${allHoverCSS}</style>` : ""}<article id="${cardId}" ${dataBlockIdAttr(block.id)} class="sg-blog-post-card" style="display: flex; background-color: var(--sg-surface, #ffffff); border-radius: ${cardBorderRadius}; overflow: hidden; box-shadow: ${cardShadowValue}; border: ${cardBorderStyle};" data-variant="horizontal" data-block-group="Card">${imgHtml}<div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${linkHref ? `<a href="${escapeHtml(linkHref)}" style="color: inherit; text-decoration: none;">${escapeHtml(title)}</a>` : escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.9375rem; margin-bottom: 1rem;">${escapeHtml(excerpt)}</p>` : ""}<div style="margin-top: auto;">${ctaHtml}</div>${authorHtml}</div></article>`;
  }

  // ---------- variant: minimal ----------
  if (variant === "minimal") {
    const cardId = `card-${block.id}`;
    const ctaId = `cta-${block.id}`;

    const ctaStyles = generateCTAStyles({
      cardId,
      ctaId,
      ctaVariation,
      linkColor,
      linkHoverColor,
      buttonVariant,
      buttonColor,
      buttonTextColor,
      buttonRadius,
      buttonSize,
      buttonHoverEffect,
      buttonHoverIntensity,
      buttonHoverOverlay,
    });

    const metaParts: string[] = [];
    if (showCategory && category) {
      metaParts.push(`<span style="font-size: 0.75rem; font-weight: 600; color: var(--sg-primary); text-transform: uppercase;">${escapeHtml(category)}</span>`);
    }
    if (showDate && date) metaParts.push(escapeHtml(date));
    if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));

    const metaHtml = metaParts.length
      ? `<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${metaParts.join(' <span>·</span> ')}</div>`
      : "";

    const ctaHtml = linkText && linkHref
      ? `<a id="${ctaId}" href="${escapeHtml(linkHref)}" style="${ctaStyles.inlineStyles}">${escapeHtml(linkText)}${ctaVariation === "link" ? " →" : ""}</a>`
      : "";

    return `${ctaStyles.hoverCSS ? `<style>${ctaStyles.hoverCSS}</style>` : ""}<article id="${cardId}" ${dataBlockIdAttr(block.id)} class="sg-blog-post-card" style="padding: 1.25rem 0; border-bottom: 1px solid var(--sg-border, #e5e7eb);" data-variant="minimal" data-block-group="Card">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${linkHref ? `<a href="${escapeHtml(linkHref)}" style="color: inherit; text-decoration: none;">${escapeHtml(title)}</a>` : escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 0.75rem;">${escapeHtml(excerpt)}</p>` : ""}${ctaHtml}</article>`;
  }

  // ---------- variant: default ----------

  // Generate unique IDs for CSS selectors
  const cardId = `card-${block.id}`;
  const imageId = `img-${block.id}`;
  const ctaId = `cta-${block.id}`;

  // Resolve card shadow
  const cardShadowValue = resolveCardShadow(cardShadow);
  const cardBorderStyle = cardBorder ? "1px solid var(--sg-border, #e5e7eb)" : "none";

  // Generate hover CSS
  const cardHoverCSS = generateCardHoverCSS(cardId, cardHoverEffect, cardShadow);
  const imageHoverCSS = generateImageHoverCSS(cardId, imageId, imageHoverEffect);
  const ctaStyles = generateCTAStyles({
    cardId,
    ctaId,
    ctaVariation,
    linkColor,
    linkHoverColor,
    linkHoverEffect,
    buttonVariant,
    buttonColor,
    buttonTextColor,
    buttonRadius,
    buttonSize,
    buttonHoverEffect,
    buttonHoverIntensity,
    buttonHoverOverlay,
  });

  // Combine all hover CSS
  const allHoverCSS = cardHoverCSS + imageHoverCSS + ctaStyles.hoverCSS;

  // Image HTML with customization
  const imgHtml =
    showImage && image
      ? `<div style="height: 200px; overflow: hidden; border-radius: ${imageBorderRadius} ${imageBorderRadius} 0 0;"><img id="${imageId}" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" /></div>`
      : "";

  // Meta parts (category, date, reading time)
  const metaParts: string[] = [];
  if (showCategory && category) {
    metaParts.push(`<span style="font-size: 0.75rem; font-weight: 600; color: var(--sg-primary); text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(category)}</span>`);
  }
  if (showDate && date) metaParts.push(escapeHtml(date));
  if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));

  const metaHtml = metaParts.length
    ? `<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.75rem; flex-wrap: wrap;">${metaParts.join(' <span style="color: var(--sg-muted-text);">·</span> ')}</div>`
    : "";

  // Author HTML
  const authorHtml =
    showAuthor && authorName
      ? `<div style="display: flex; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--sg-border, #e5e7eb);">${
          authorAvatar
            ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />`
            : ""
        }<span style="font-size: 0.875rem; color: var(--sg-muted-text);">${escapeHtml(authorName)}</span></div>`
      : "";

  // CTA HTML (link or button)
  const ctaHtml = linkText && linkHref
    ? `<a id="${ctaId}" href="${escapeHtml(linkHref)}" style="${ctaStyles.inlineStyles}" data-block-group="Card">${escapeHtml(linkText)}${ctaVariation === "link" ? " →" : ""}</a>`
    : "";

  // Full card HTML (sem dataBlockIdAttr para que o clique selecione o parent blogPostGrid)
  return `${allHoverCSS ? `<style>${allHoverCSS}</style>` : ""}<article id="${cardId}" class="sg-blog-post-card" style="background-color: var(--sg-surface, #ffffff); border-radius: ${cardBorderRadius}; overflow: hidden; box-shadow: ${cardShadowValue}; border: ${cardBorderStyle}; display: flex; flex-direction: column;" data-variant="default" data-block-group="Card">${imgHtml}<div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">${metaHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.3;">${linkHref ? `<a href="${escapeHtml(linkHref)}" style="color: inherit; text-decoration: none;">${escapeHtml(title)}</a>` : escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; flex: 1;">${escapeHtml(excerpt)}</p>` : ""}<div style="margin-top: auto;">${ctaHtml}</div>${authorHtml}</div></article>`;
}

// ---------------------------------------------------------------------------
// BlogPostGrid
// ---------------------------------------------------------------------------

/**
 * Builds a pagination URL appending ?pagina=N (or &pagina=N if URL has params).
 * Page 1 returns base URL without param (cleaner URL).
 */
function buildPageUrl(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}pagina=${page}`;
}

/**
 * Generates an array of page numbers to display, with -1 for ellipsis.
 */
function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: number[] = [1];
  if (current > 3) pages.push(-1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(-1);
  if (pages[pages.length - 1] !== total) pages.push(total);
  return pages;
}

/**
 * Generates pagination HTML nav element.
 */
function generatePaginationHtml(
  currentPage: number,
  totalPages: number,
  paginationBaseUrl: string,
): string {
  if (totalPages <= 1) return "";

  const btnBase = "display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:var(--sg-card-radius, 0.5rem);text-decoration:none;font-size:0.875rem;";
  const borderNormal = "border:1px solid var(--sg-border, #e5e7eb);";
  const borderActive = "border:1px solid var(--sg-primary);";

  // Previous
  const prevHtml = currentPage > 1
    ? `<a href="${escapeHtml(buildPageUrl(paginationBaseUrl, currentPage - 1))}" style="${btnBase}${borderNormal}color:var(--sg-text);">&lsaquo;</a>`
    : `<span style="${btnBase}${borderNormal}color:var(--sg-muted-text);opacity:0.4;">&lsaquo;</span>`;

  // Page numbers
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const pagesHtml = pageNumbers.map((page, idx) => {
    if (page === -1) {
      return `<span style="${btnBase}color:var(--sg-muted-text);">&hellip;</span>`;
    }
    const isActive = page === currentPage;
    return `<a href="${escapeHtml(buildPageUrl(paginationBaseUrl, page))}" style="${btnBase}${isActive ? borderActive : borderNormal}background-color:${isActive ? "var(--sg-primary)" : "transparent"};color:${isActive ? "var(--sg-primary-text, #fff)" : "var(--sg-text)"};font-weight:${isActive ? "600" : "400"};">${page}</a>`;
  }).join("");

  // Next
  const nextHtml = currentPage < totalPages
    ? `<a href="${escapeHtml(buildPageUrl(paginationBaseUrl, currentPage + 1))}" style="${btnBase}${borderNormal}color:var(--sg-text);">&rsaquo;</a>`
    : `<span style="${btnBase}${borderNormal}color:var(--sg-muted-text);opacity:0.4;">&rsaquo;</span>`;

  return `<nav data-block-group="Paginação" style="display:flex;justify-content:center;align-items:center;gap:0.375rem;margin-top:2.5rem;">${prevHtml}${pagesHtml}${nextHtml}</nav>`;
}

/**
 * Generates the magazine hero card HTML (first post with image overlay).
 */
function generateMagazineHeroHtml(card: any): string {
  const imgHtml = card.image
    ? `<img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title || "")}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" />`
    : "";

  const categoryHtml = card.category
    ? `<span style="display:inline-block;padding:0.25rem 0.75rem;background-color:var(--sg-primary);color:var(--sg-primary-text, #fff);font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-radius:0.25rem;margin-bottom:0.75rem;">${escapeHtml(card.category)}</span>`
    : "";

  const excerptHtml = card.excerpt
    ? `<p style="font-size:1rem;line-height:1.5;color:rgba(255,255,255,0.85);margin-bottom:0.75rem;max-width:600px;">${escapeHtml(card.excerpt)}</p>`
    : "";

  const authorParts: string[] = [];
  if (card.authorAvatar) {
    authorParts.push(`<img src="${escapeHtml(card.authorAvatar)}" alt="${escapeHtml(card.authorName || "")}" style="width:1.75rem;height:1.75rem;border-radius:50%;object-fit:cover;" />`);
  }
  if (card.authorName) {
    authorParts.push(`<span style="font-weight:500;">${escapeHtml(card.authorName)}</span>`);
  }
  if (card.authorName && card.date) {
    authorParts.push(`<span>&middot;</span>`);
  }
  if (card.date) {
    authorParts.push(`<span>${escapeHtml(card.date)}</span>`);
  }
  const metaHtml = authorParts.length
    ? `<div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:rgba(255,255,255,0.8);">${authorParts.join("")}</div>`
    : "";

  return `<a href="${escapeHtml(card.linkHref || "#")}" data-block-group="Post em Destaque" style="display:block;position:relative;width:100%;min-height:420px;border-radius:var(--sg-card-radius, 0.75rem);overflow:hidden;margin-bottom:2.5rem;text-decoration:none;color:#fff;background-color:#1a1a2e;">${imgHtml}<div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%);"></div><div style="position:absolute;bottom:0;left:0;right:0;padding:2rem 2.5rem;">${categoryHtml}<h2 style="font-size:2rem;font-weight:700;line-height:1.2;margin-bottom:0.5rem;color:#fff;">${escapeHtml(card.title || "")}</h2>${excerptHtml}${metaHtml}</div></a>`;
}

export function exportBlogPostGrid(
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
    cards = [],
    variant = "default",
    showViewAll = false,
    viewAllText,
    viewAllHref,
    currentPage = 1,
    totalPages = 1,
    paginationBaseUrl = "#",
    // Card customization
    cardBorderRadius = "0.75rem",
    cardShadow = "md",
    cardHoverEffect = "lift",
    cardBorder = true,
    cardBorderColor = "#e5e7eb",
    cardBorderWidth = 1,
    // Image effects
    imageHoverEffect = "zoom",
    imageBorderRadius = "0.75rem",
    // CTA customization
    ctaVariation = "link",
    linkColor = "#2563eb",
    linkHoverColor = "#1d4ed8",
    linkHoverEffect = "underline",
    buttonVariant = "solid",
    buttonColor = "#2563eb",
    buttonTextColor = "#ffffff",
    buttonRadius = 8,
    buttonSize = "md",
    buttonHoverEffect = "darken",
    buttonHoverIntensity = 20,
    buttonHoverOverlay = "none",
  } = (block as any).props;

  const isMagazine = variant === "magazine";
  const heroCard = isMagazine && cards.length > 0 ? cards[0] : null;
  const gridCards: any[] = isMagazine ? cards.slice(1) : cards;

  // Responsive grid: 1 col (mobile) -> 2 cols (tablet) -> N cols (desktop)
  const gridId = generateScopedId(block.id || "", "blog-post-grid");
  const responsiveConfig = resolveResponsiveColumns(columns, 1, 2, columns);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    "2rem",
  );

  // Magazine hero
  const heroHtml = heroCard ? generateMagazineHeroHtml(heroCard) : "";

  // Header: magazine uses a different heading style
  let headerHtml = "";
  if (isMagazine) {
    if (gridCards.length > 0) {
      headerHtml = `<div data-block-group="Cabeçalho" style="margin-bottom:2rem;"><h3 style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--sg-text);margin-bottom:0.75rem;">Posts Recentes</h3><div style="height:2px;background-color:var(--sg-primary);width:3rem;"></div></div>`;
    }
  } else if (title || subtitle) {
    headerHtml = `<div data-block-group="Cabeçalho" style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`;
  }

  if (!renderChild) {
    throw new Error("exportBlogPostGrid requires renderChild function");
  }

  // Resolve card variant for rendering
  const resolveCardVariant = (index: number): string => {
    if (variant === "featured" && index === 0) return "horizontal";
    if (variant === "minimal") return "minimal";
    return "default";
  };

  let gridContentHtml = "";
  if (gridCards.length > 0) {
    gridContentHtml = gridCards
      .map((c: any, i: number) =>
        renderChild(
          {
            id: `${block.id}-card-${isMagazine ? i + 1 : i}`,
            type: "blogPostCard",
            props: {
              ...c,
              variant: resolveCardVariant(i),
              // Pass customization props from grid to card
              cardBorderRadius,
              cardShadow,
              cardHoverEffect,
              cardBorder,
              cardBorderColor,
              cardBorderWidth,
              imageHoverEffect,
              imageBorderRadius,
              ctaVariation,
              linkColor,
              linkHoverColor,
              linkHoverEffect,
              buttonVariant,
              buttonColor,
              buttonTextColor,
              buttonRadius,
              buttonSize,
              buttonHoverEffect,
              buttonHoverIntensity,
              buttonHoverOverlay,
            },
          } as Block,
          depth + 1,
          basePath,
          theme,
        ),
      )
      .join("");
  } else if (!heroCard) {
    gridContentHtml = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--sg-muted-text); border: 2px dashed var(--sg-border, #e5e7eb); border-radius: var(--sg-card-radius, 0.5rem);"><p style="font-size: 1rem; margin-bottom: 0.5rem;">Nenhum post encontrado</p><p style="font-size: 0.875rem;">Os posts aparecerão aqui quando forem publicados.</p></div>`;
  }

  const gridHtml = gridContentHtml
    ? `<div data-block-group="Layout" id="${gridId}" style="${inlineStyles}">${gridContentHtml}</div>`
    : "";

  const viewAllHtml =
    showViewAll && viewAllText
      ? `<div data-block-group="Rodapé" style="text-align: center; margin-top: 2.5rem;"><a href="${escapeHtml(viewAllHref || "#")}" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); font-weight: 600; border-radius: var(--sg-button-radius); text-decoration: none;">${escapeHtml(viewAllText)}</a></div>`
      : "";

  const paginationHtml = generatePaginationHtml(currentPage, totalPages, paginationBaseUrl);

  const sectionPadding = isMagazine ? "0" : "4rem 0";
  const innerStyle = isMagazine ? "" : "max-width: 1200px; margin: 0 auto; padding: 0 1rem;";

  return `<style>${mediaQueries}</style><section ${dataBlockIdAttr(block.id)} style="padding: ${sectionPadding}; background-color: var(--sg-bg);"><div style="${innerStyle}">${heroHtml}${headerHtml}${gridHtml}${viewAllHtml}${paginationHtml}</div></section>`;
}

// ---------------------------------------------------------------------------
// BlogPostDetail
// ---------------------------------------------------------------------------

export function exportBlogPostDetail(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    content,
    featuredImage,
    date,
    category,
    readingTime,
    tags = [],
    showFeaturedImage = true,
    showAuthor = true,
    authorVariant = "inline",
    showDate = true,
    showTags = true,
    showReadingTime = true,
    contentMaxWidth = "720px",
    authorName,
    authorAvatar,
    authorBio,
  } = (block as any).props;

  const displayName = escapeHtml(authorName || "Nome do Autor");
  const displayBio = authorBio ? escapeHtml(authorBio) : "";

  // Featured image banner
  const featuredImageHtml =
    showFeaturedImage && featuredImage
      ? `<div data-block-group="Mídia" style="width: 100%; margin: 0 auto 2.5rem auto; border-radius: var(--sg-card-radius); overflow: hidden;"><img src="${escapeHtml(featuredImage)}" alt="${escapeHtml(title || "")}" style="width: 100%; height: auto; max-height: 520px; object-fit: cover; display: block;" /></div>`
      : "";

  // Category badge
  const categoryHtml = category
    ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 999px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem;">${escapeHtml(category)}</span>`
    : "";

  // Meta line (date + reading time)
  const metaParts: string[] = [];
  if (showDate && date) metaParts.push(escapeHtml(date));
  if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));
  const metaHtml = metaParts.length
    ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1.5rem;">${metaParts.join(" &middot; ")}</p>`
    : "";

  // Title
  const titleHtml = `<h1 data-block-group="Conteúdo" style="font-size: var(--sg-heading-h1, 2.25rem); font-weight: 700; margin-bottom: 0.75rem; line-height: 1.2;">${escapeHtml(title)}</h1>`;

  // Content — trusted HTML from backend, not escaped
  const contentHtml = content
    ? `<div class="sg-blog-post-content" style="font-size: 1.0625rem; line-height: 1.75; color: var(--sg-text);">${content}</div>`
    : "";

  // Author avatar — real image or placeholder
  const avatarLargeHtml = authorAvatar
    ? `<img src="${escapeHtml(authorAvatar)}" alt="${displayName}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`
    : `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg, var(--sg-primary, #6366f1) 0%, #818cf8 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--sg-primary-text, #fff);font-size:1.5rem;font-weight:700;">${displayName.charAt(0).toUpperCase()}</div>`;
  const avatarSmallHtml = authorAvatar
    ? `<img src="${escapeHtml(authorAvatar)}" alt="${displayName}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`
    : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, var(--sg-primary, #6366f1) 0%, #818cf8 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--sg-primary-text, #fff);font-size:1.1rem;font-weight:700;">${displayName.charAt(0).toUpperCase()}</div>`;

  let authorHtml = "";
  if (showAuthor) {
    const bioHtml = displayBio ? `<p style="color:var(--sg-muted-text);font-size:0.875rem;margin:0.25rem 0 0;">${displayBio}</p>` : "";
    if (authorVariant === "card") {
      authorHtml = `<div data-block-group="Autor" style="display:flex;align-items:flex-start;gap:1rem;margin-top:3rem;padding:1.25rem;border-radius:var(--sg-card-radius, 0.75rem);background-color:var(--sg-surface, #f9fafb);">${avatarLargeHtml}<div><div style="font-size:0.75rem;color:var(--sg-muted-text);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.125rem;">Escrito por</div><div style="font-weight:600;font-size:1rem;">${displayName}</div>${bioHtml}</div></div>`;
    } else if (authorVariant === "minimal") {
      authorHtml = `<p data-block-group="Autor" style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--sg-border, #e5e7eb);color:var(--sg-muted-text);font-size:0.9375rem;">Escrito por <span style="font-weight:600;color:var(--sg-text);">${displayName}</span></p>`;
    } else {
      // inline (default)
      authorHtml = `<div data-block-group="Autor" style="display:flex;align-items:center;gap:0.75rem;margin-top:3rem;padding-top:2rem;border-top:1px solid var(--sg-border, #e5e7eb);">${avatarSmallHtml}<div><div style="font-size:0.75rem;color:var(--sg-muted-text);">Escrito por</div><div style="font-weight:600;font-size:0.9375rem;">${displayName}</div></div></div>`;
    }
  }

  // Tags
  const tagsHtml =
    showTags && tags.length > 0
      ? `<div data-block-group="Visibilidade" style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">${tags
          .map(
            (tag: string) =>
              `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-surface, #f3f4f6); color: var(--sg-text); border-radius: 999px; font-size: 0.75rem;">${escapeHtml(tag)}</span>`,
          )
          .join("")}</div>`
      : "";

  return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-post-detail" style="padding: 0; padding-bottom: 6rem;">${featuredImageHtml}<div style="max-width: ${escapeHtml(contentMaxWidth)}; margin: 0 auto; padding: 0 1rem;">${categoryHtml}${titleHtml}${metaHtml}${contentHtml}${authorHtml}${tagsHtml}</div></article>`;
}

// ---------------------------------------------------------------------------
// BlogCategoryFilter
// ---------------------------------------------------------------------------

export function exportBlogCategoryFilter(
  block: Block,
  _depth: number,
  _basePath?: string,
  _theme?: ThemeTokens,
): string {
  const {
    title,
    categories = [],
    variant = "chips",
    showCount = true,
    showAll = true,
    allLabel = "Todas",
    activeCategory,
    filterUrl = "#",
    borderRadius = "0.75rem",
    shadow = "none",
    linkColor: linkColorProp,
  } = (block as any).props;

  const linkColor = linkColorProp || "var(--sg-text)";
  const widgetId = `widget-cat-${block.id || ""}`;
  const boxShadow = resolveWidgetShadow(shadow);
  const shadowStyle = boxShadow !== "none" ? `box-shadow:${boxShadow};` : "";

  const buildHref = (slug?: string) => {
    if (!slug) return escapeHtml(filterUrl);
    return escapeHtml(`${filterUrl}?categoria=${slug}`);
  };

  // Hover CSS
  const linkHoverColor = (block as any).props.linkHoverColor || "";
  const linkHoverEffect = (block as any).props.linkHoverEffect || "background";
  const linkHoverIntensity = (block as any).props.linkHoverIntensity ?? 50;

  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-cat-chip:not(.sg-cat-active), #${widgetId} .sg-cat-btn:not(.sg-cat-active), #${widgetId} .sg-cat-list-item { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-cat-chip, #${widgetId} .sg-cat-btn, #${widgetId} .sg-cat-list-item { transition: all 0.3s ease; }`;
    const hoverRule = `#${widgetId} .sg-cat-chip:hover:not(.sg-cat-active), #${widgetId} .sg-cat-btn:hover:not(.sg-cat-active), #${widgetId} .sg-cat-list-item:hover { ${styles.hover}; transition: all 0.3s ease; }`;
    hoverCSS = `<style>${baseRule}\n${hoverRule}</style>`;
  } else {
    hoverCSS = `<style>
      #${widgetId} .sg-cat-chip:hover { opacity:0.8; transform:translateY(-1px); }
      #${widgetId} .sg-cat-btn:hover { border-color:var(--sg-primary) !important; color:var(--sg-primary) !important; }
      #${widgetId} .sg-cat-list-item:hover { background-color:rgba(0,0,0,0.04); }
    </style>`;
  }

  let itemsHtml = "";

  if (variant === "chips") {
    const chipStyle = (isActive: boolean) => `display:inline-flex;align-items:center;gap:0.375rem;padding:0.375rem 0.875rem;border-radius:9999px;font-size:0.875rem;font-weight:500;text-decoration:none;background-color:${isActive ? "var(--sg-primary)" : "var(--sg-bg)"};color:${isActive ? "var(--sg-primary-text, #fff)" : linkColor};transition:all 0.2s ease;`;
    const allChip = showAll ? `<a href="${escapeHtml(filterUrl)}" class="sg-cat-chip" style="${chipStyle(!activeCategory)}">${escapeHtml(allLabel)}</a>` : "";
    const chips = categories.map((cat: any) => {
      const isActive = activeCategory === cat.slug;
      const countHtml = showCount && cat.count != null ? `<span style="font-size:0.75rem;opacity:0.7;">(${cat.count})</span>` : "";
      return `<a href="${buildHref(cat.slug)}" class="${isActive ? "sg-cat-active" : "sg-cat-chip"}" style="${chipStyle(isActive)}">${escapeHtml(cat.name)}${countHtml}</a>`;
    }).join("");
    itemsHtml = `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${allChip}${chips}</div>`;
  } else if (variant === "buttons") {
    const btnStyle = (isActive: boolean) => `display:inline-flex;align-items:center;gap:0.375rem;padding:0.5rem 1rem;border-radius:calc(${borderRadius} * 0.6);font-size:0.875rem;font-weight:500;text-decoration:none;border:1px solid ${isActive ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)"};background-color:${isActive ? "var(--sg-primary)" : "transparent"};color:${isActive ? "var(--sg-primary-text, #fff)" : linkColor};transition:all 0.2s ease;`;
    const allBtn = showAll ? `<a href="${escapeHtml(filterUrl)}" class="sg-cat-btn" style="${btnStyle(!activeCategory)}">${escapeHtml(allLabel)}</a>` : "";
    const btns = categories.map((cat: any) => {
      const isActive = activeCategory === cat.slug;
      const countHtml = showCount && cat.count != null ? `<span style="font-size:0.75rem;opacity:0.7;">(${cat.count})</span>` : "";
      return `<a href="${buildHref(cat.slug)}" class="${isActive ? "sg-cat-active" : "sg-cat-btn"}" style="${btnStyle(isActive)}">${escapeHtml(cat.name)}${countHtml}</a>`;
    }).join("");
    itemsHtml = `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${allBtn}${btns}</div>`;
  } else {
    const listStyle = (isActive: boolean) => `display:flex;align-items:center;justify-content:space-between;padding:0.625rem 0.75rem;border-radius:calc(${borderRadius} * 0.5);font-size:0.875rem;font-weight:${isActive ? "600" : "400"};text-decoration:none;background-color:${isActive ? "var(--sg-bg)" : "transparent"};color:${isActive ? "var(--sg-primary)" : linkColor};transition:all 0.2s ease;`;
    const allItem = showAll ? `<a href="${escapeHtml(filterUrl)}" class="sg-cat-list-item" style="${listStyle(!activeCategory)}">${escapeHtml(allLabel)}</a>` : "";
    const items = categories.map((cat: any) => {
      const isActive = activeCategory === cat.slug;
      const countHtml = showCount && cat.count != null ? `<span style="font-size:0.75rem;color:var(--sg-muted-text);background-color:var(--sg-bg);padding:0.125rem 0.5rem;border-radius:9999px;">${cat.count}</span>` : "";
      return `<a href="${buildHref(cat.slug)}" class="sg-cat-list-item" style="${listStyle(isActive)}">${escapeHtml(cat.name)}${countHtml}</a>`;
    }).join("");
    itemsHtml = `<div style="display:flex;flex-direction:column;gap:0.125rem;">${allItem}${items}</div>`;
  }

  const titleHtml = title
    ? `<div style="padding:1rem 1.25rem;border-bottom:1px solid var(--sg-border, #e5e7eb);"><h3 style="font-size:1rem;font-weight:600;margin:0;color:var(--sg-text);">${escapeHtml(title)}</h3></div>`
    : "";

  const contentPad = variant === "list" ? "padding:0.5rem 0.75rem;" : "padding:1rem 1.25rem;";

  return `${hoverCSS}<div id="${widgetId}" ${dataBlockIdAttr(block.id)} data-block-group="Conteúdo" style="background-color:var(--sg-surface, var(--sg-bg));border:1px solid var(--sg-border, #e5e7eb);border-radius:${borderRadius};${shadowStyle}overflow:hidden;">${titleHtml}<div style="${contentPad}">${itemsHtml}</div></div>`;
}

// ---------------------------------------------------------------------------
// BlogSearchBar
// ---------------------------------------------------------------------------

export function exportBlogSearchBar(
  block: Block,
  _depth: number,
  _basePath?: string,
  _theme?: ThemeTokens,
): string {
  const {
    placeholder = "Buscar posts...",
    variant = "simple",
    showIcon = true,
    searchUrl = "#",
    filterCategories = false,
    filterTags = false,
    filterDate = false,
    borderRadius = "0.75rem",
    shadow = "none",
  } = (block as any).props;

  const widgetId = `widget-search-${block.id || ""}`;
  const boxShadow = resolveWidgetShadow(shadow);
  const shadowStyle = boxShadow !== "none" ? `box-shadow:${boxShadow};` : "";
  const inputRadius = `calc(${borderRadius} * 0.6)`;

  const focusCSS = `<style>
    #${widgetId} input:focus, #${widgetId} select:focus {
      border-color: var(--sg-primary);
      box-shadow: 0 0 0 3px rgba(var(--sg-primary-rgb, 59, 130, 246), 0.15);
    }
  </style>`;

  const searchIconSvg = showIcon
    ? `<svg style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);width:1.25rem;height:1.25rem;color:var(--sg-muted-text);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" stroke-linecap="round"/></svg>`
    : "";

  const inputPadding = showIcon ? "padding-left:2.5rem;" : "";
  const isExpanded = variant === "expanded";
  const inputBorder = isExpanded ? "2px" : "1px";
  const inputFontSize = isExpanded ? "1.0625rem" : "0.875rem";
  const inputPadY = isExpanded ? "0.875rem" : "0.625rem";

  const inputStyle = `width:100%;${inputPadding}padding-right:1rem;padding-top:${inputPadY};padding-bottom:${inputPadY};font-size:${inputFontSize};border:${inputBorder} solid var(--sg-border, #e5e7eb);border-radius:${inputRadius};background-color:var(--sg-bg);color:var(--sg-text);outline:none;transition:border-color 0.2s, box-shadow 0.2s;`;
  const selectStyle = `padding:0.625rem 0.75rem;font-size:0.875rem;border:1px solid var(--sg-border, #e5e7eb);border-radius:${inputRadius};background-color:var(--sg-bg);color:var(--sg-text);transition:border-color 0.2s;`;

  const inputHtml = `<div style="position:relative;">${searchIconSvg}<input type="search" name="busca" placeholder="${escapeHtml(placeholder)}" style="${inputStyle}" /></div>`;

  let formContent = inputHtml;
  if (variant === "with-filters") {
    const filters: string[] = [];
    if (filterCategories) filters.push(`<select name="categoria" style="${selectStyle}"><option value="">Categoria</option></select>`);
    if (filterTags) filters.push(`<select name="tag" style="${selectStyle}"><option value="">Tag</option></select>`);
    if (filterDate) filters.push(`<select name="periodo" style="${selectStyle}"><option value="">Período</option></select>`);
    formContent = `${inputHtml}<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">${filters.join("")}</div>`;
  }

  return `${focusCSS}<div id="${widgetId}" ${dataBlockIdAttr(block.id)} data-block-group="Conteúdo" style="background-color:var(--sg-surface, var(--sg-bg));border:1px solid var(--sg-border, #e5e7eb);border-radius:${borderRadius};${shadowStyle}overflow:hidden;"><form action="${escapeHtml(searchUrl)}" method="get" style="padding:1.25rem;">${formContent}</form></div>`;
}

// ---------------------------------------------------------------------------
// BlogRecentPosts
// ---------------------------------------------------------------------------

export function exportBlogRecentPosts(
  block: Block,
  _depth: number,
  _basePath?: string,
  _theme?: ThemeTokens,
): string {
  const {
    title = "Posts Recentes",
    posts = [],
    count = 5,
    showThumbnail = true,
    showDate = true,
    showCategory = false,
    borderRadius = "0.75rem",
    shadow = "none",
    linkColor: linkColorProp,
  } = (block as any).props;

  // Limitar posts pela quantidade configurada
  const limitedPosts = posts.slice(0, count);

  const linkColor = linkColorProp || "var(--sg-text)";
  const widgetId = `widget-recent-${block.id || ""}`;
  const boxShadow = resolveWidgetShadow(shadow);
  const shadowStyle = boxShadow !== "none" ? `box-shadow:${boxShadow};` : "";

  const linkHoverColor = (block as any).props.linkHoverColor || "";
  const linkHoverEffect = (block as any).props.linkHoverEffect || "background";
  const linkHoverIntensity = (block as any).props.linkHoverIntensity ?? 50;

  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-recent-post { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-recent-post { transition: all 0.3s ease; }`;
    const hoverRule = `#${widgetId} .sg-recent-post:hover { ${styles.hover}; transition: all 0.3s ease; }
    #${widgetId} .sg-recent-post:hover .sg-recent-title { color: ${linkHoverColor}; }`;
    hoverCSS = `<style>${baseRule}\n${hoverRule}</style>`;
  } else {
    hoverCSS = `<style>
      #${widgetId} .sg-recent-post:hover { background-color:rgba(0,0,0,0.04); }
      #${widgetId} .sg-recent-post:hover .sg-recent-title { color:var(--sg-primary); }
    </style>`;
  }

  const titleHtml = title
    ? `<div style="padding:1rem 1.25rem;border-bottom:1px solid var(--sg-border, #e5e7eb);"><h3 style="font-size:1rem;font-weight:600;margin:0;color:var(--sg-text);">${escapeHtml(title)}</h3></div>`
    : "";

  let contentHtml = "";
  if (limitedPosts.length === 0) {
    contentHtml = `<p style="padding:1.5rem 1.25rem;color:var(--sg-muted-text);font-size:0.875rem;text-align:center;margin:0;">Nenhum post recente</p>`;
  } else {
    contentHtml = limitedPosts
      .map((post: any) => {
        const imgHtml =
          showThumbnail && post.image
            ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="width:64px;height:64px;object-fit:cover;border-radius:calc(${borderRadius} * 0.5);flex-shrink:0;" />`
            : "";

        const metaParts: string[] = [];
        if (showDate && post.date) metaParts.push(escapeHtml(post.date));
        if (showCategory && post.category) metaParts.push(`<span style="font-size:0.6875rem;color:var(--sg-primary);font-weight:600;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(post.category)}</span>`);
        const metaHtml = metaParts.length
          ? `<div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.25rem;font-size:0.75rem;color:var(--sg-muted-text);">${metaParts.join("")}</div>`
          : "";

        return `<a href="/site/p/blog/${escapeHtml(post.slug)}" class="sg-recent-post" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.25rem;text-decoration:none;color:inherit;transition:background-color 0.2s;">${imgHtml}<div style="flex:1;min-width:0;"><div class="sg-recent-title" style="font-size:0.875rem;font-weight:500;color:${linkColor};line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;transition:color 0.2s;">${escapeHtml(post.title)}</div>${metaHtml}</div></a>`;
      })
      .join("");
  }

  return `${hoverCSS}<div id="${widgetId}" ${dataBlockIdAttr(block.id)} data-block-group="Conteúdo" style="background-color:var(--sg-surface, var(--sg-bg));border-radius:${borderRadius};border:1px solid var(--sg-border, #e5e7eb);${shadowStyle}overflow:hidden;">${titleHtml}<div style="padding:0.5rem 0;">${contentHtml}</div></div>`;
}

// ---------------------------------------------------------------------------
// BlogTagCloud
// ---------------------------------------------------------------------------

export function exportBlogTagCloud(
  block: Block,
  _depth: number,
  _basePath?: string,
  _theme?: ThemeTokens,
): string {
  const {
    title = "Tags",
    tags = [],
    variant = "badges",
    borderRadius = "0.75rem",
    shadow = "none",
    linkColor: linkColorProp,
  } = (block as any).props;

  const linkColor = linkColorProp || "var(--sg-text)";
  const widgetId = `widget-tags-${block.id || ""}`;
  const boxShadow = resolveWidgetShadow(shadow);
  const shadowStyle = boxShadow !== "none" ? `box-shadow:${boxShadow};` : "";

  const linkHoverColor = (block as any).props.linkHoverColor || "";
  const linkHoverEffect = (block as any).props.linkHoverEffect || "background";
  const linkHoverIntensity = (block as any).props.linkHoverIntensity ?? 50;

  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-tag-badge, #${widgetId} .sg-tag-list-item { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-tag-badge, #${widgetId} .sg-tag-list-item { transition: all 0.3s ease; }`;
    const hoverRule = `#${widgetId} .sg-tag-badge:hover, #${widgetId} .sg-tag-list-item:hover { ${styles.hover}; transition: all 0.3s ease; }`;
    hoverCSS = `<style>${baseRule}\n${hoverRule}</style>`;
  } else {
    hoverCSS = `<style>
      #${widgetId} .sg-tag-badge:hover { opacity:0.8; transform:translateY(-1px); }
      #${widgetId} .sg-tag-list-item:hover { background-color:rgba(0,0,0,0.04); }
    </style>`;
  }

  const titleHtml = title
    ? `<div style="padding:1rem 1.25rem;border-bottom:1px solid var(--sg-border, #e5e7eb);"><h3 style="font-size:1rem;font-weight:600;margin:0;color:var(--sg-text);">${escapeHtml(title)}</h3></div>`
    : "";

  let contentHtml = "";
  if (tags.length === 0) {
    contentHtml = `<p style="color:var(--sg-muted-text);font-size:0.875rem;text-align:center;margin:0;">Nenhuma tag encontrada</p>`;
  } else if (variant === "badges") {
    const badgesHtml = tags
      .map(
        (tag: any) =>
          `<span class="sg-tag-badge" style="display:inline-flex;align-items:center;gap:0.375rem;padding:0.3rem 0.75rem;border-radius:9999px;font-size:0.8125rem;font-weight:500;background-color:var(--sg-bg);color:${linkColor};cursor:pointer;transition:all 0.2s ease;">${escapeHtml(tag.name)}<span style="font-size:0.6875rem;color:var(--sg-muted-text);opacity:0.7;">(${tag.count})</span></span>`,
      )
      .join("");
    contentHtml = `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${badgesHtml}</div>`;
  } else {
    const listHtml = tags
      .map(
        (tag: any) =>
          `<div class="sg-tag-list-item" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;border-radius:calc(${borderRadius} * 0.5);font-size:0.875rem;color:${linkColor};cursor:pointer;transition:background-color 0.2s;"><span>${escapeHtml(tag.name)}</span><span style="font-size:0.75rem;color:var(--sg-muted-text);background-color:var(--sg-bg);padding:0.125rem 0.5rem;border-radius:9999px;">${tag.count}</span></div>`,
      )
      .join("");
    contentHtml = `<div style="display:flex;flex-direction:column;gap:0.25rem;">${listHtml}</div>`;
  }

  return `${hoverCSS}<div id="${widgetId}" ${dataBlockIdAttr(block.id)} data-block-group="Conteúdo" style="background-color:var(--sg-surface, var(--sg-bg));border-radius:${borderRadius};border:1px solid var(--sg-border, #e5e7eb);${shadowStyle}overflow:hidden;">${titleHtml}<div style="padding:1rem 1.25rem;">${contentHtml}</div></div>`;
}
