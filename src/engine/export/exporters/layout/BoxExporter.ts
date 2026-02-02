/**
 * Box Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportBox(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
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

  const style = [
    bg ? `background-color: ${bg}` : "",
    border ? `border: ${border}` : "",
    radius ? `border-radius: ${radius}` : "",
    shadow ? `box-shadow: ${shadow}` : "",
    padding ? `padding: ${padding}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<div ${dataBlockIdAttr(block.id)} style="${style}">${childrenHtml}</div>`;
}
