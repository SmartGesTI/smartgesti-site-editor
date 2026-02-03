/**
 * Container Block Exporter
 * Responsive padding: increases from mobile to desktop
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateContainerId } from "../../shared/idGenerator";
import { generatePaddingMediaQueries, BREAKPOINTS } from "../../shared/responsiveGridHelper";

export function exportContainer(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    maxWidth = "1200px",
    padding = "1rem",
    children = [],
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportContainer requires renderChild function");
  }

  const containerId = generateContainerId(block.id || "");

  // Responsive padding: 1rem (mobile) → 1.5rem (tablet) → 2rem (desktop)
  const paddingValue = typeof padding === "string" ? padding : "1rem";
  const smPadding = paddingValue;
  const mdPadding = "1.5rem";
  const lgPadding = "2rem";

  const mediaQueries = generatePaddingMediaQueries(
    containerId,
    smPadding,
    mdPadding,
    lgPadding,
  );

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  const inlineStyles = `max-width: ${maxWidth}; padding: ${smPadding}; margin: 0 auto;`;

  return `<style>${mediaQueries}</style><div id="${containerId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
}
