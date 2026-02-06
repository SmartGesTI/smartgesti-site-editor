/**
 * Text Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportText(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const props = block.props as Record<string, any>;
  const { text, align = "left", color, size = "md" } = props;

  const fontSizeMap: Record<string, string> = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  };

  const style = [
    `text-align: ${align}`,
    color ? `color: ${color}` : "color: var(--sg-text, #1f2937)",
    `font-size: ${fontSizeMap[size]}`,
  ]
    .filter(Boolean)
    .join("; ");

  return `<p ${dataBlockIdAttr(block.id)} style="${style}">${escapeHtml(text)}</p>`;
}
