/**
 * Heading Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportHeading(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { level, text, align = "left", color } = (block as any).props;

  const style = [
    `text-align: ${align}`,
    color ? `color: ${color}` : "color: var(--sg-text, #1f2937)",
  ]
    .filter(Boolean)
    .join("; ");

  return `<h${level} ${dataBlockIdAttr(block.id)} style="${style}">${escapeHtml(text)}</h${level}>`;
}
