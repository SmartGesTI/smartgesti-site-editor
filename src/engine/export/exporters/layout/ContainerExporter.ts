/**
 * Container Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportContainer(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    maxWidth = "1200px",
    padding = "1rem",
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportContainer requires renderChild function");
  }

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<div ${dataBlockIdAttr(block.id)} style="max-width: ${maxWidth}; padding: ${padding}; margin: 0 auto;">${childrenHtml}</div>`;
}
