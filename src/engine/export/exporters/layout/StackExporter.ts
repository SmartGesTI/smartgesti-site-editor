/**
 * Stack Block Exporter
 * Responsive direction: column (mobile) → row (desktop) when direction="row"
 * Suporte a sticky positioning para sidebars
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import { generateFlexDirectionMediaQueries, BREAKPOINTS } from "../../shared/responsiveGridHelper";

export function exportStack(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    direction = "col",
    gap = "1rem",
    align = "stretch",
    justify = "start",
    wrap = false,
    sticky = false,
    stickyOffset = "80px",
    paddingBottom,
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportStack requires renderChild function");
  }

  const stackId = generateScopedId(block.id || "", "stack");

  // Mobile-first: se direction="row", começa column em mobile e vira row em desktop
  const isMobileFirst = direction === "row";
  const mobileDirection = isMobileFirst ? "column" : "column";
  const desktopDirection = direction === "row" ? "row" : "column";

  const alignItems =
    align === "start"
      ? "flex-start"
      : align === "end"
        ? "flex-end"
        : align === "center"
          ? "center"
          : "stretch";
  const justifyContent =
    justify === "start"
      ? "flex-start"
      : justify === "end"
        ? "flex-end"
        : justify === "center"
          ? "center"
          : justify === "space-between"
            ? "space-between"
            : "space-around";

  // Media queries for responsive direction
  let mediaQueries = isMobileFirst
    ? generateFlexDirectionMediaQueries(stackId, mobileDirection as any, desktopDirection as any)
    : "";

  // Sticky: add position sticky on desktop, disable on mobile
  const stickyInline = sticky
    ? ` position: sticky; top: ${stickyOffset}; align-self: flex-start;`
    : "";

  if (sticky) {
    mediaQueries += `
    @media (max-width: ${BREAKPOINTS.md}) {
      #${stackId} {
        position: static !important;
        align-self: stretch !important;
      }
    }`;
  }

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  const paddingBottomStyle = paddingBottom ? ` padding-bottom: ${paddingBottom};` : "";
  const inlineStyles = `display: flex; flex-direction: ${mobileDirection}; gap: ${gap}; align-items: ${alignItems}; justify-content: ${justifyContent}; flex-wrap: ${wrap ? "wrap" : "nowrap"};${stickyInline}${paddingBottomStyle}`;

  return mediaQueries
    ? `<style>${mediaQueries}</style><div id="${stackId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`
    : `<div ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
}
