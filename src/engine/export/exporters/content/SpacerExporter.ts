/**
 * Spacer Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportSpacer(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { height = "2rem" } = (block as any).props;

  return `<div ${dataBlockIdAttr(block.id)} style="height: ${height};"></div>`;
}
