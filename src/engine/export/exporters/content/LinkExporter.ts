/**
 * Link Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";
import {
  generateLinkHoverStyles,
  type LinkHoverEffect,
} from "../../../shared/hoverEffects";

export function exportLink(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    text,
    href,
    // Hover effects
    hoverEffect = "underline",
    hoverIntensity = 50,
    hoverColor,
  } = (block as any).props;

  // Get color from theme or use default
  const primaryColor = theme?.colors?.primary || "#3b82f6";
  const effectiveHoverColor = hoverColor || primaryColor;

  const resolvedHref = resolveHref(href, basePath);
  const targetAttr = linkTargetAttr(resolvedHref, basePath) || ' target="_self"';

  // Generate hover CSS
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  // Base styles for link
  const baseStyles = [
    `color: ${primaryColor}`,
    "text-decoration: none",
    "transition: all 0.3s ease",
    "display: inline-block",
    "background-repeat: no-repeat",
  ];

  if (hoverEffect !== "none") {
    const hoverResult = generateLinkHoverStyles({
      effect: hoverEffect as LinkHoverEffect,
      intensity: hoverIntensity,
      hoverColor: effectiveHoverColor,
    });

    // Add base styles from hover effect
    if (hoverResult.base) {
      hoverCss += `
        ${scope} .sg-link {
          ${hoverResult.base}
        }
      `;
    }

    // Hover styles
    hoverCss += `
      ${scope} .sg-link:hover {
        ${hoverResult.hover}
      }
    `;
  }

  const styleTag = hoverCss ? `<style>${hoverCss}</style>` : "";
  const style = baseStyles.join("; ");

  return `${styleTag}<a ${dataBlockIdAttr(block.id)} href="${escapeHtml(resolvedHref)}"${targetAttr} class="sg-link" style="${style}">${escapeHtml(text)}</a>`;
}
