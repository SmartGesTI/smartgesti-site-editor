/**
 * Section Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, blockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportSection(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { bg, padding = "2rem", children = [] } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportSection requires renderChild function");
  }

  const style = [
    bg
      ? `background-color: ${bg}`
      : "background-color: var(--sg-bg, #ffffff)",
    `padding: ${padding}`,
  ]
    .filter(Boolean)
    .join("; ");

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<section ${blockIdAttr(block.id)} ${dataBlockIdAttr(block.id)} style="${style}">${childrenHtml}</section>`;
}
