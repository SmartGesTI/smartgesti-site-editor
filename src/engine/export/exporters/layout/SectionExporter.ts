/**
 * Section Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportSection(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { id, bg, padding = "2rem", children = [] } = (block as any).props;

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

  const idAttr = id ? `id="${escapeHtml(id)}"` : "";

  return `<section ${dataBlockIdAttr(block.id)} ${idAttr} style="${style}">${childrenHtml}</section>`;
}
