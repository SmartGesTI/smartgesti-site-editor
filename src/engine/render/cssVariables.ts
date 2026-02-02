/**
 * CSS Variables Helpers for Block Customization
 * Generates CSS custom properties for dynamic styling
 */

import type { NavbarBlock } from "../schema/siteDocument";

/**
 * Shadow values mapping
 */
const shadowValues: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

/**
 * Font size values mapping
 */
const fontSizes: Record<string, string> = {
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
};

/**
 * Generates CSS variables object for navbar customization
 * These variables can be set as inline styles on the navbar element
 * and referenced in the CSS with var(--navbar-bg, fallback)
 */
export function getNavbarCSSVariables(block: NavbarBlock): Record<string, string> {
  const {
    bg = "#ffffff",
    opacity = 100,
    borderRadius = 0,
    shadow = "sm",
    linkColor = "#1f2937",
    linkHoverColor = "#3b82f6",
    linkFontSize = "md",
    buttonColor = "#3b82f6",
    buttonTextColor = "#ffffff",
    buttonBorderRadius = 8,
  } = block.props;

  return {
    "--navbar-bg": bg,
    "--navbar-opacity": String(opacity / 100),
    "--navbar-border-radius": `${borderRadius}px`,
    "--navbar-shadow": shadowValues[shadow] || shadowValues.sm,
    "--navbar-link-color": linkColor,
    "--navbar-link-hover-color": linkHoverColor,
    "--navbar-link-size": fontSizes[linkFontSize] || fontSizes.md,
    "--navbar-btn-bg": buttonColor,
    "--navbar-btn-text": buttonTextColor,
    "--navbar-btn-radius": `${buttonBorderRadius}px`,
  };
}
