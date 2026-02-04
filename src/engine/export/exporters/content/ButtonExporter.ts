/**
 * Button Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

export function exportButton(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    text,
    href,
    variant = "primary",
    size = "md",
    // Hover effects (principal)
    hoverEffect = "darken",
    hoverIntensity = 50,
    // Hover overlay (adicional)
    hoverOverlay = "none",
    hoverIconName = "arrow-right",
  } = (block as any).props;

  const padding =
    size === "sm"
      ? "0.5rem 1rem"
      : size === "lg"
        ? "0.75rem 1.5rem"
        : "0.625rem 1.25rem";

  const fontSize =
    size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem";

  // Get button colors based on variant and theme
  const primaryColor = theme?.colors?.primary || "#3b82f6";
  const primaryText = theme?.colors?.primaryText || "#ffffff";
  const secondaryColor = theme?.colors?.secondary || "#6b7280";

  const variantColors: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: primaryColor, text: primaryText },
    secondary: { bg: secondaryColor, text: "#ffffff" },
    outline: { bg: "transparent", text: primaryColor, border: primaryColor },
    ghost: { bg: "transparent", text: primaryColor },
  };

  const colors = variantColors[variant] || variantColors.primary;

  const baseStyles = [
    `padding: ${padding}`,
    "border-radius: var(--sg-radius, 0.5rem)",
    "border: none",
    "cursor: pointer",
    `font-size: ${fontSize}`,
    "font-weight: 500",
    "transition: all 0.2s",
    "display: inline-block",
    "text-decoration: none",
    "position: relative",
    "overflow: hidden",
  ];

  if (variant === "outline") {
    baseStyles.push("background-color: transparent");
    baseStyles.push(`color: ${colors.text}`);
    baseStyles.push(`border: 2px solid ${colors.border}`);
  } else if (variant === "ghost") {
    baseStyles.push("background-color: transparent");
    baseStyles.push(`color: ${colors.text}`);
  } else {
    baseStyles.push(`background-color: ${colors.bg}`);
    baseStyles.push(`color: ${colors.text}`);
  }

  const style = baseStyles.join("; ");

  // Generate hover CSS
  // Nota: O seletor usa apenas [data-block-id] pois o próprio botão tem esse atributo
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  // Efeito principal
  if (hoverEffect !== "none") {
    const hoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: colors.bg === "transparent" ? primaryColor : colors.bg,
      buttonTextColor: colors.text,
      variant: variant === "outline" ? "outline" : variant === "ghost" ? "ghost" : "solid",
    });

    // Base styles if needed
    if (hoverResult.base) {
      hoverCss += `
        ${scope} {
          ${hoverResult.base}
        }
      `;
    }

    // Hover styles
    hoverCss += `
      ${scope}:hover {
        ${hoverResult.hover}
      }
    `;

    // Add keyframes for pulse animation
    hoverCss += getButtonHoverKeyframes();
  }

  // Efeito overlay (adicional)
  if (hoverOverlay && hoverOverlay !== "none") {
    hoverCss += generateButtonOverlayCSS(scope, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor,
      iconName: hoverIconName,
      textColor: colors.text,
    });
  }

  const styleTag = hoverCss ? `<style>${hoverCss}</style>` : "";

  if (href) {
    const resolvedHref = resolveHref(href, basePath);
    const targetAttr = linkTargetAttr(resolvedHref, basePath);
    return `${styleTag}<a ${dataBlockIdAttr(block.id)} href="${escapeHtml(resolvedHref)}"${targetAttr} class="sg-btn" style="${style}">${escapeHtml(text)}</a>`;
  }

  return `${styleTag}<button ${dataBlockIdAttr(block.id)} class="sg-btn" style="${style}">${escapeHtml(text)}</button>`;
}
