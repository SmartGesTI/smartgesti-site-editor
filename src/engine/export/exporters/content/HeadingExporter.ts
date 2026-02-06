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
  const props = block.props as Record<string, any>;
  const { level, text, align = "left", color } = props;

  const style = [
    `text-align: ${align}`,
    color ? `color: ${color}` : "color: var(--sg-text, #1f2937)",
  ]
    .filter(Boolean)
    .join("; ");

  return `<h${level} ${dataBlockIdAttr(block.id)} style="${style}">${escapeHtml(text)}</h${level}>`;
}
