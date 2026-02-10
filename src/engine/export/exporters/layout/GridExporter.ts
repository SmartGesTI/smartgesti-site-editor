/**
 * Grid Block Exporter
 * Full-width outer wrapper for background effects (color, image, gradient, overlay)
 * Inner grid constrained by maxWidth
 * Responsive: colTemplate collapses to 1fr on mobile
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateGridId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
  BREAKPOINTS,
} from "../../shared/responsiveGridHelper";

export function exportGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    cols = 2,
    colTemplate,
    gap = "2.5rem",
    maxWidth,
    padding,
    paddingTop,
    paddingBottom,
    contentPosition = "center",
    bg,
    bgImage,
    bgOverlay,
    bgOverlayColor = "rgba(0,0,0,0.5)",
    bgGradient,
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportGrid requires renderChild function");
  }

  const gridId = generateGridId(block.id || "");

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  // Inner grid styles
  const gridParts: string[] = [
    "display: grid",
    `gap: ${gap}`,
    "box-sizing: border-box",
    "width: 100%",
  ];

  if (maxWidth) {
    gridParts.push(`max-width: ${maxWidth}`);
    if (contentPosition === "left") {
      gridParts.push("margin-right: auto");
    } else if (contentPosition === "right") {
      gridParts.push("margin-left: auto");
    } else {
      gridParts.push("margin-left: auto");
      gridParts.push("margin-right: auto");
    }
  }
  if (padding) {
    gridParts.push(`padding-left: ${padding}`);
    gridParts.push(`padding-right: ${padding}`);
  }
  if (paddingTop) {
    gridParts.push(`padding-top: ${paddingTop}`);
  }
  if (paddingBottom) {
    gridParts.push(`padding-bottom: ${paddingBottom}`);
  }

  const gridInlineStyle = gridParts.join("; ");

  // Check if we need an outer wrapper
  const hasBgEffects = bg || bgImage || bgGradient;

  // Media queries for responsive columns
  let mediaQueries = "";
  if (colTemplate) {
    mediaQueries = `
    #${gridId} { grid-template-columns: 1fr; }
    @media (min-width: ${BREAKPOINTS.md}) {
      #${gridId} { grid-template-columns: ${colTemplate}; }
    }`.trim();
  } else {
    const responsiveConfig = resolveResponsiveColumns(cols, 1, 2, typeof cols === "number" ? cols : 2);
    const result = generateResponsiveGridStyles(gridId, responsiveConfig, gap);
    mediaQueries = result.mediaQueries;
  }

  const styleBlock = `<style>${mediaQueries}</style>`;
  const gridHtml = `<div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${gridInlineStyle}">${childrenHtml}</div>`;

  if (!hasBgEffects) {
    return `${styleBlock}${gridHtml}`;
  }

  // Full-width wrapper for background effects
  const wrapperParts: string[] = ["width: 100%", "position: relative"];
  if (bg) {
    wrapperParts.push(`background-color: ${bg}`);
  }
  if (bgImage) {
    wrapperParts.push(`background-image: url(${bgImage})`);
    wrapperParts.push("background-size: cover");
    wrapperParts.push("background-position: center");
    wrapperParts.push("background-repeat: no-repeat");
  }
  if (bgGradient && !bgImage) {
    wrapperParts.push(`background: ${bgGradient}`);
  }
  const wrapperStyle = wrapperParts.join("; ");

  // Overlay
  const overlayHtml = bgImage && bgOverlay
    ? `<div style="position:absolute;inset:0;background-color:${bgOverlayColor};z-index:0;"></div>`
    : "";

  // If overlay, grid needs z-index
  const gridZIndex = overlayHtml ? " position: relative; z-index: 1;" : "";

  return `${styleBlock}<div style="${wrapperStyle}">${overlayHtml}<div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${gridInlineStyle};${gridZIndex}">${childrenHtml}</div></div>`;
}
