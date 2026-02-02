/**
 * Navbar Section Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import {
  resolveNavbarStyles,
  mergeStyles,
  applyOpacityToColor,
} from "../../styleResolver";
import {
  dataBlockIdAttr,
  blockIdAttr,
  escapeHtml,
  resolveHref,
  linkTargetAttr,
} from "../../shared/htmlHelpers";

export function exportNavbar(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
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

  return `<nav ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${escapeHtml(navClasses)}" data-variation="${escapeHtml(variation)}" style="${navStyle}">${styleBlock}${containerHtml}</nav>`;
}
