/**
 * Divider Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportDivider(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { color = "#e5e7eb", thickness = "1px" } = (block as any).props;

  return `<hr ${dataBlockIdAttr(block.id)} style="border: none; border-top: ${thickness} solid ${color}; margin: 1rem 0;" />`;
}
