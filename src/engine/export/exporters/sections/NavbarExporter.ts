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
    logoHeight = 70,
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
  // Changed from sticky to fixed to avoid navbar occupying space
  const stickyStyle =
    sticky && !floating ? "position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 1000" : "";
  const baseStyle =
    !transparent && !floating ? "border-bottom: 1px solid #e5e7eb" : "";
  const paddingStyle = "";

  // Navbar flutuante: centralizado com margin auto e próximo ao topo
  const floatingCompactStyle = floating
    ? "max-width: 1200px; width: calc(100% - 4rem); margin: 0.5rem auto 0; left: 0; right: 0;"
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
    logoUrl
      ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(logoAlt)}" style="height: ${logoHeight}px; max-height: ${logoHeight}px; object-fit: contain;" class="sg-navbar__brand-img" />`
      : `<div style="display: flex; align-items: center; justify-content: center; height: 40px; width: 100px; background-color: #e5e7eb; border: 2px solid #d1d5db; border-radius: 4px; font-size: 16px; font-weight: 600; color: #6b7280;">Logo</div>`;
  if (logoHref && logoHtml) {
    const resolvedLogoHref = resolveHref(logoHref, basePath);
    const logoTargetAttr = linkTargetAttr(resolvedLogoHref, basePath);
    logoHtml = `<a href="${escapeHtml(resolvedLogoHref)}"${logoTargetAttr} class="sg-navbar__brand-link" style="display: flex; align-items: center;">${logoHtml}</a>`;
  }

  // Extrair cores da navbar para usar no sidebar mobile
  const navbarBg = (block as any).props.bg || "#ffffff";
  const navbarOpacity = (block as any).props.opacity || 100;
  const sidebarBg = applyOpacityToColor(navbarBg, navbarOpacity);

  // Usar linkColor da paleta se disponível, caso contrário fallback para text
  const linkColor =
    (block as any).props.linkColor ||
    theme?.colors?.linkColor ||
    theme?.colors?.text ||
    "#1f2937";

  // Links with resolved styles (complete inline styling)
  const linksHtml = links
    .map((l: any) => {
      const resolved = resolveHref(l.href || "#", basePath);
      const targetAttr = linkTargetAttr(resolved, basePath);
      return `<a href="${escapeHtml(resolved)}"${targetAttr} class="sg-navbar__link" style="${resolvedStyles.link}">${escapeHtml(l.text)}</a>`;
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

  // Inject dynamic CSS styles (hover effects) if present
  const styleBlock = resolvedStyles.css ? `<style>${resolvedStyles.css}</style>` : "";

  // ========== MOBILE SIDEBAR COMPONENTS ==========

  // 1. Hamburger Button (visible only in mobile)
  const hamburgerHtml = `
    <button
      id="sg-navbar-hamburger-${block.id}"
      class="sg-navbar__hamburger"
      aria-label="Menu"
      aria-expanded="false"
      style="
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        z-index: 1002;
        position: relative;
        color: ${linkColor};
      "
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" class="sg-hamburger-line sg-hamburger-top" style="transition: transform 0.3s ease, opacity 0.3s ease;"/>
        <line x1="3" y1="12" x2="21" y2="12" class="sg-hamburger-line sg-hamburger-middle" style="transition: transform 0.3s ease, opacity 0.3s ease;"/>
        <line x1="3" y1="18" x2="21" y2="18" class="sg-hamburger-line sg-hamburger-bottom" style="transition: transform 0.3s ease, opacity 0.3s ease;"/>
      </svg>
    </button>
  `;

  // 2. Overlay (semi-transparent backdrop)
  const overlayHtml = `
    <div
      id="sg-navbar-overlay-${block.id}"
      class="sg-navbar__overlay"
      style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
      "
    ></div>
  `;

  // 3. Mobile links (stack vertical)
  const linksMobileHtml = links
    .map((l: any) => {
      const resolved = resolveHref(l.href || "#", basePath);
      const targetAttr = linkTargetAttr(resolved, basePath);
      return `
        <a
          href="${escapeHtml(resolved)}"${targetAttr}
          class="sg-navbar__link-mobile"
          style="
            display: block;
            padding: 1rem 0;
            color: ${linkColor};
            text-decoration: none;
            font-weight: 500;
            font-size: 1rem;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: color 0.2s;
          "
        >
          ${escapeHtml(l.text)}
        </a>
      `;
    })
    .join("");

  // 4. Sidebar container
  const sidebarHtml = `
    <div
      id="sg-navbar-sidebar-${block.id}"
      class="sg-navbar__sidebar"
      style="
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        max-width: 85vw;
        height: 100vh;
        background-color: ${sidebarBg};
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1001;
        overflow-y: auto;
        padding: 4.5rem 0 2rem;
      "
    >
      <button
        id="sg-navbar-close-${block.id}"
        class="sg-navbar__close"
        aria-label="Fechar menu"
        style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: ${linkColor};
          font-size: 2rem;
          line-height: 1;
        "
      >
        ×
      </button>

      <div class="sg-navbar__menu-mobile" style="
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 0 1.5rem;
      ">
        ${linksMobileHtml}
        ${
          ctaBtnHtml
            ? `<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.1);">${ctaBtnHtml}</div>`
            : ""
        }
      </div>
    </div>
  `;

  // 5. Mobile CSS
  const mobileCss = `
    /* ===== MOBILE SIDEBAR STYLES ===== */

    /* Hamburger visible only in mobile */
    @media (max-width: 768px) {
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__hamburger {
        display: block !important;
      }

      /* Desktop menu hidden in mobile */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__menu {
        display: none !important;
      }

      /* Navbar flutuante: ajuste responsivo mobile */
      ${block.id && floating ? `[data-block-id="${block.id}"]` : ".sg-navbar--floating"} {
        max-width: calc(100% - 2rem) !important;
        width: calc(100% - 2rem) !important;
        left: 0 !important;
        right: 0 !important;
        margin: 0.5rem auto 0 !important;
      }

      /* Hamburger animation to X */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__hamburger[aria-expanded="true"] .sg-hamburger-top {
        transform: translateY(6px) rotate(45deg);
      }

      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__hamburger[aria-expanded="true"] .sg-hamburger-middle {
        opacity: 0;
      }

      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} .sg-navbar__hamburger[aria-expanded="true"] .sg-hamburger-bottom {
        transform: translateY(-6px) rotate(-45deg);
      }

      /* Sidebar open state */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} ~ .sg-navbar__sidebar.is-open {
        right: 0 !important;
      }

      /* Overlay visible */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} ~ .sg-navbar__overlay.is-visible {
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* Link mobile hover/active */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} ~ .sg-navbar__sidebar .sg-navbar__link-mobile:active {
        color: ${theme?.colors?.primary || "#3b82f6"};
        background-color: ${theme?.colors?.primary || "#3b82f6"}10;
      }

      /* CTA button full width in sidebar */
      ${block.id ? `[data-block-id="${block.id}"]` : ".sg-navbar"} ~ .sg-navbar__sidebar .sg-navbar__btn {
        display: block;
        text-align: center;
        width: 100%;
      }
    }

    /* Desktop - hide mobile components */
    @media (min-width: 769px) {
      .sg-navbar__hamburger {
        display: none !important;
      }

      .sg-navbar__sidebar {
        display: none !important;
      }

      .sg-navbar__overlay {
        display: none !important;
      }
    }
  `;

  // 6. Mobile JavaScript
  const mobileScript = `
<script>
(function() {
  var navId = '${block.id}';
  var hamburger = document.getElementById('sg-navbar-hamburger-' + navId);
  var sidebar = document.getElementById('sg-navbar-sidebar-' + navId);
  var overlay = document.getElementById('sg-navbar-overlay-' + navId);
  var closeBtn = document.getElementById('sg-navbar-close-' + navId);

  var isOpen = false;

  function openSidebar() {
    isOpen = true;
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeSidebar() {
    isOpen = false;
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  function toggleSidebar() {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  hamburger.addEventListener('click', toggleSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeSidebar();
    }
  });

  sidebar.addEventListener('keydown', function(e) {
    var focusableElements = sidebar.querySelectorAll(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && isOpen) {
        closeSidebar();
      }
    }, 250);
  });
})();
</script>
  `;

  // Update containerHtml to include hamburger
  const containerHtmlWithMobile = `
    <div class="sg-navbar__container" style="${containerStyle}">
      <div class="sg-navbar__brand" style="${brandWrapStyle}">
        ${logoHtml}
      </div>
      ${menuHtml}
      ${actionsHtml}
      ${hamburgerHtml}
    </div>
  `;

  // Combine all CSS
  const allCss = [resolvedStyles.css, mobileCss]
    .filter(Boolean)
    .join("\n");
  const styleBlockFinal = allCss ? `<style>${allCss}</style>` : "";

  return `<nav ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} class="${escapeHtml(navClasses)}" data-variation="${escapeHtml(variation)}" style="${navStyle}">${styleBlockFinal}${containerHtmlWithMobile}</nav>${overlayHtml}${sidebarHtml}${mobileScript}`;
}
