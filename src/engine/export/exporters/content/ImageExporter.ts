/**
 * Image Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { PLACEHOLDER_IMAGE_URL } from "../../../presets/heroVariations";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportImage(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    src,
    alt = "",
    width,
    height,
    objectFit = "cover",
  } = (block as any).props;

  const imgSrc = src || PLACEHOLDER_IMAGE_URL;

  const style = [
    width ? `width: ${width}` : "width: 100%",
    height ? `height: ${height}` : "height: auto",
    `object-fit: ${objectFit}`,
  ]
    .filter(Boolean)
    .join("; ");

  const onError = `this.onerror=null;this.src='${escapeHtml(PLACEHOLDER_IMAGE_URL)}';`;

  return `<img ${dataBlockIdAttr(block.id)} src="${escapeHtml(imgSrc)}" alt="${escapeHtml(alt)}" style="${style}" onerror="${onError}" />`;
}
