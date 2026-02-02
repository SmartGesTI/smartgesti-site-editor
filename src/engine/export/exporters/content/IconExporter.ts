/**
 * Icon Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportIcon(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { name: _iconName, size = "md", color } = (block as any).props;

  const sizeMap: Record<string, string> = {
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  };

  const iconSize = sizeMap[size] || sizeMap.md;

  return `<span ${dataBlockIdAttr(block.id)} style="display: inline-flex; width: ${iconSize}; height: ${iconSize}; color: ${color || "currentColor"};">[★]</span>`;
}
