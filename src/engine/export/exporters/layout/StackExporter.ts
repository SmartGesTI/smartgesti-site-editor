/**
 * Stack Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

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
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportStack requires renderChild function");
  }

  const flexDirection = direction === "row" ? "row" : "column";
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

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<div ${dataBlockIdAttr(block.id)} style="display: flex; flex-direction: ${flexDirection}; gap: ${gap}; align-items: ${alignItems}; justify-content: ${justifyContent}; flex-wrap: ${wrap ? "wrap" : "nowrap"};">${childrenHtml}</div>`;
}
