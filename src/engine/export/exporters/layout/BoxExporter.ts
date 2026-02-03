/**
 * Box Block Exporter
 * Responsive padding: increases from mobile to desktop
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import { generatePaddingMediaQueries } from "../../shared/responsiveGridHelper";

export function exportBox(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    bg,
    border,
    radius,
    shadow,
    padding = "1rem",
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportBox requires renderChild function");
  }

  const boxId = generateScopedId(block.id || "", "box");

  // Responsive padding (se aplicável)
  const paddingValue = typeof padding === "string" ? padding : "1rem";
  const hasResponsivePadding = paddingValue === "1rem" || paddingValue === "0.5rem";

  // Padding responsivo: cresce progressivamente
  const smPadding = paddingValue;
  const mdPadding = hasResponsivePadding ? (paddingValue === "1rem" ? "1.5rem" : "1rem") : paddingValue;
  const lgPadding = hasResponsivePadding ? (paddingValue === "1rem" ? "2rem" : "1.5rem") : paddingValue;

  const mediaQueries = hasResponsivePadding
    ? generatePaddingMediaQueries(boxId, smPadding, mdPadding, lgPadding)
    : "";

  const style = [
    bg ? `background-color: ${bg}` : "",
    border ? `border: ${border}` : "",
    radius ? `border-radius: ${radius}` : "",
    shadow ? `box-shadow: ${shadow}` : "",
    padding ? `padding: ${smPadding}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return hasResponsivePadding
    ? `<style>${mediaQueries}</style><div id="${boxId}" ${dataBlockIdAttr(block.id)} style="${style}">${childrenHtml}</div>`
    : `<div ${dataBlockIdAttr(block.id)} style="${style}">${childrenHtml}</div>`;
}
