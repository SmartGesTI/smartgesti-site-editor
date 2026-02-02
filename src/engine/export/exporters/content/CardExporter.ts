/**
 * Card Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

export function exportCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    header = [],
    content = [],
    footer = [],
    padding = "1rem",
    bg,
    border,
    radius,
    shadow,
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportCard requires renderChild function");
  }

  const style = [
    bg
      ? `background-color: ${bg}`
      : "background-color: var(--sg-surface, #f9fafb)",
    border
      ? `border: ${border}`
      : "border: 1px solid var(--sg-border, #e5e7eb)",
    radius
      ? `border-radius: ${radius}`
      : "border-radius: var(--sg-radius, 0.5rem)",
    shadow
      ? `box-shadow: ${shadow}`
      : "box-shadow: var(--sg-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))",
    `padding: ${padding}`,
    "display: flex",
    "flex-direction: column",
    "gap: 0.5rem",
  ]
    .filter(Boolean)
    .join("; ");

  const headerHtml =
    header.length > 0
      ? `<div>${header.map((c: Block) => renderChild(c, depth + 1, basePath, theme)).join("")}</div>`
      : "";

  const contentHtml =
    content.length > 0
      ? `<div>${content.map((c: Block) => renderChild(c, depth + 1, basePath, theme)).join("")}</div>`
      : "";

  const footerHtml =
    footer.length > 0
      ? `<div>${footer.map((c: Block) => renderChild(c, depth + 1, basePath, theme)).join("")}</div>`
      : "";

  return `<div ${dataBlockIdAttr(block.id)} style="${style}">${headerHtml}${contentHtml}${footerHtml}</div>`;
}
