/**
 * Navbar Renderer
 * Renderiza barra de navegação com variações (classic, minimal, mega)
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
    variation = "navbar-classic",
    logo,
    logoText,
    links = [],
    ctaButton,
    sticky,
    layout,
    floating = false,
  } = navbarBlock.props;

  // Use Style Resolver
  // Pass block.id for unique CSS scoping
  const resolvedStyles = resolveNavbarStyles(navbarBlock.props, navbarBlock.id);

  // Convert inline strings to React style objects
  const navStyle = styleStringToReactStyle(resolvedStyles.nav);
  const linkStyle = styleStringToReactStyle(resolvedStyles.link);
  const buttonStyle = styleStringToReactStyle(resolvedStyles.button);
  const brandTextStyle = styleStringToReactStyle(resolvedStyles.brandText);

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

  const variationClass =
    variation === "navbar-minimal"
      ? "sg-navbar--minimal"
      : "sg-navbar--classic";

  // Determine layout (use custom layout or fallback)
  const effectiveLayout = layout || "expanded";
  const isCentered = false; // logic removed
  const isCompact = effectiveLayout === "compact";

  const layoutClass = floating
    ? "sg-navbar--floating"
    : isCompact
      ? "sg-navbar--compact"
      : "";

  const navClassName = [
    "sg-navbar",
    variationClass,
    layoutClass,
    sticky ? "sg-navbar--sticky" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const brandContent = logoUrl ? (
    <img
      src={logoUrl}
      alt={logoAlt}
      className="sg-navbar__brand-img"
      style={{ height: "2rem", objectFit: "contain" }}
    />
  ) : (
    <span className="sg-navbar__brand-text" style={brandTextStyle}>
      {logoText || "Logo"}
    </span>
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

  const containerStyle: React.CSSProperties = isCentered
    ? {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isCompact ? "0 0.5rem" : "0 1rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: isCompact ? "1rem" : "1.5rem",
      }
    : {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isCompact ? "0 0.5rem" : "0 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isCompact ? "1rem" : "1.5rem",
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
      style={navStyle}
    >
      {hoverCss}
      <div className="sg-navbar__container" style={containerStyle}>
        <div className="sg-navbar__brand" style={{ flexShrink: 0 }}>
          {brandEl}
        </div>
        <div className="sg-navbar__menu" style={menuStyle}>
          {links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.href}
              className="sg-navbar__link"
              style={linkStyle}
            >
              {link.text}
            </a>
          ))}
          {ctaButton && (
            <a
              href={ctaButton.href || "#"}
              className={`sg-navbar__btn ${buttonVariantClass}`}
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
