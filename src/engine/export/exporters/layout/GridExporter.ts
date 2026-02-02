/**
 * Grid Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { cols = 3, gap = "1rem", children = [] } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportGrid requires renderChild function");
  }

  const gridCols =
    typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 3;

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<div ${dataBlockIdAttr(block.id)} style="display: grid; grid-template-columns: repeat(${gridCols}, 1fr); gap: ${gap};">${childrenHtml}</div>`;
}
