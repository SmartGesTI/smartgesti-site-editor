/**
 * Navbar Renderer
 * Renderiza barra de navegação com variações (simples, moderno, glass)
 */

import React from "react";
import { NavbarBlock } from "../../../schema/siteDocument";
import {
  resolveNavbarStyles,
  styleStringToReactStyle,
} from "../../../export/styleResolver";

export function renderNavbar(block: any): React.ReactNode {
  const navbarBlock = block as NavbarBlock;
  const {
    variation = "navbar-moderno",
    logo,
    logoText,
    links = [],
    ctaButton,
    sticky,
    layout,
    floating = false,
    logoHeight = 70,
    borderPosition = "none",
    borderWidth = 1,
    borderColor = "#e5e7eb",
  } = navbarBlock.props;

  // Use Style Resolver
  // Pass block.id for unique CSS scoping
  const resolvedStyles = resolveNavbarStyles(navbarBlock.props, navbarBlock.id);

  // Convert inline strings to React style objects
  const navStyle = styleStringToReactStyle(resolvedStyles.nav);
  const linkStyle = styleStringToReactStyle(resolvedStyles.link);
  const buttonStyle = styleStringToReactStyle(resolvedStyles.button);
  const brandTextStyle = styleStringToReactStyle(resolvedStyles.brandText);
  const dropdownStyle = styleStringToReactStyle(resolvedStyles.dropdown);
  const dropdownItemStyle = styleStringToReactStyle(resolvedStyles.dropdownItem);

  // Dynamic CSS for hover
  const hoverCss = resolvedStyles.css ? (
    <style>{resolvedStyles.css}</style>
  ) : null;

  const logoUrl = typeof logo === "string" ? logo : (logo?.src ?? "");
  const logoAlt =
    typeof logo === "string"
      ? logoText || "Logo"
      : (logo?.alt ?? logoText ?? "Logo");
  const logoHref =
    typeof logo === "object" && logo?.href != null ? logo.href : "";

  // Classe CSS baseada na variação
  const variationClassMap: Record<string, string> = {
    "navbar-simples": "sg-navbar--simples",
    "navbar-moderno": "sg-navbar--moderno",
    "navbar-glass": "sg-navbar--glass",
    "navbar-elegante": "sg-navbar--elegante",
    "navbar-pill": "sg-navbar--pill",
  };
  const variationClass = variationClassMap[variation] || "sg-navbar--moderno";

  // Determine layout (use custom layout or fallback)
  const effectiveLayout = layout || "expanded";
  const isCentered = effectiveLayout === "centered";
  const isCompact = layout === "compact";

  const navClassName = [
    "sg-navbar",
    variationClass,
    floating ? "sg-navbar--floating" : "",
    isCompact ? "sg-navbar--compact" : "",
    sticky ? "sg-navbar--sticky" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const brandContent = logoUrl ? (
    <img
      src={logoUrl}
      alt={logoAlt}
      className="sg-navbar__brand-img"
      style={{ height: `${logoHeight}px`, maxHeight: `${logoHeight}px`, objectFit: "contain" }}
    />
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "100px",
        backgroundColor: "#e5e7eb",
        border: "2px solid #d1d5db",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#6b7280",
      }}
    >
      Logo
    </div>
  );

  const brandEl = logoHref ? (
    <a
      href={logoHref}
      className="sg-navbar__brand-link"
      style={{ display: "flex", alignItems: "center" }}
    >
      {brandContent}
    </a>
  ) : (
    <div
      className="sg-navbar__brand-link"
      style={{ display: "flex", alignItems: "center" }}
    >
      {brandContent}
    </div>
  );

  // Borda baseada na posição selecionada
  const getBorderStyle = (): React.CSSProperties => {
    if (borderPosition === "none") return {};
    const borderValue = `${borderWidth}px solid ${borderColor}`;
    switch (borderPosition) {
      case "all":
        return { border: borderValue };
      case "top":
        return { borderTop: borderValue };
      case "bottom":
        return { borderBottom: borderValue };
      case "left":
        return { borderLeft: borderValue };
      case "right":
        return { borderRight: borderValue };
      default:
        return {};
    }
  };
  const borderStyle = getBorderStyle();

  // Container style baseado no layout
  // Nota: isCompact apenas reduz tamanhos, não altera o layout base
  const containerStyle: React.CSSProperties = isCentered
    ? {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isCompact ? "0 1rem" : "0 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: isCompact ? "1rem" : "1.5rem",
      }
    : {
        // Expandido (padrão): logo no canto esquerdo, links no direito
        width: "100%",
        maxWidth: "100%",
        padding: floating ? "0 2rem" : (isCompact ? "0 1rem" : "0 1.5rem"),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isCompact ? "1.5rem" : "2rem",
      };

  const menuStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: isCompact ? "1rem" : "1.5rem",
    flexWrap: "wrap",
    ...(isCentered ? { justifySelf: "center" as const } : {}),
  };

  const buttonVariantClass =
    navbarBlock.props.buttonVariant === "outline"
      ? "sg-navbar__btn--outline"
      : navbarBlock.props.buttonVariant === "ghost"
        ? "sg-navbar__btn--ghost"
        : "sg-navbar__btn--solid";

  return (
    <nav
      key={block.id}
      className={navClassName}
      data-variation={variation}
      data-block-id={block.id}
      style={{ ...navStyle, ...borderStyle }}
    >
      {hoverCss}
      <div className="sg-navbar__container" style={containerStyle}>
        {/* Layout padrão: logo | links + cta */}
        <div className="sg-navbar__brand" data-block-group="Logo e Marca" style={{ flexShrink: 0 }}>
          {brandEl}
        </div>
        <div className="sg-navbar__menu" data-block-group="Links" style={menuStyle}>
          {links.map((link: any, index: number) => {
            if (link.dropdown && Array.isArray(link.dropdown)) {
              return (
                <div key={index} className="sg-navbar__dropdown-wrapper">
                  <button
                    className="sg-navbar__link sg-navbar__link--has-dropdown"
                    style={linkStyle}
                  >
                    {link.text}
                  </button>
                  <div className="sg-navbar-dropdown" style={dropdownStyle}>
                    {link.dropdown.map((item: any, itemIndex: number) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        className="sg-navbar-dropdown__item"
                        style={dropdownItemStyle}
                      >
                        {item.text}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a key={index} href={link.href} className="sg-navbar__link" style={linkStyle}>
                {link.text}
              </a>
            );
          })}
          {ctaButton && (
            <a
              href={ctaButton.href || "#"}
              className={`sg-navbar__btn ${buttonVariantClass}`}
              data-block-group="Botao CTA"
              style={buttonStyle}
            >
              {ctaButton.text}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
