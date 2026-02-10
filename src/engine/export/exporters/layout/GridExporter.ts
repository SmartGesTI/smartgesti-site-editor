/**
 * Grid Block Exporter
 * Sistema responsivo mobile-first com media queries
 * Suporte a colTemplate para templates customizados (ex: "1fr 320px")
 * Suporte a maxWidth e padding para espaçamento
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateGridId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
  BREAKPOINTS,
} from "../../shared/responsiveGridHelper";

export function exportGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { cols = 3, colTemplate, gap = "1rem", maxWidth, padding, paddingTop, children = [] } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportGrid requires renderChild function");
  }

  // Gerar ID único para este grid
  const gridId = generateGridId(block.id || "");

  // Renderizar filhos
  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  // Wrapper styles for maxWidth + padding
  const wrapperParts: string[] = [];
  if (maxWidth) {
    wrapperParts.push(`max-width: ${maxWidth}`);
    wrapperParts.push("margin-left: auto");
    wrapperParts.push("margin-right: auto");
  }
  if (padding) {
    wrapperParts.push(`padding-left: ${padding}`);
    wrapperParts.push(`padding-right: ${padding}`);
  }
  if (paddingTop) {
    wrapperParts.push(`padding-top: ${paddingTop}`);
  }
  const hasWrapper = wrapperParts.length > 0;
  const wrapperStyle = wrapperParts.join("; ");

  // Se colTemplate está definido, usar template customizado com responsive
  if (colTemplate) {
    const inlineStyles = `display: grid; gap: ${gap};`;
    const mediaQueries = `
    /* Base: Mobile 1 coluna */
    #${gridId} {
      grid-template-columns: 1fr;
    }

    /* Desktop: template customizado */
    @media (min-width: ${BREAKPOINTS.md}) {
      #${gridId} {
        grid-template-columns: ${colTemplate};
      }
    }
  `.trim();

    const gridHtml = `<div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
    const wrappedHtml = hasWrapper
      ? `<div style="${wrapperStyle}">${gridHtml}</div>`
      : gridHtml;

    return `<style>${mediaQueries}</style>${wrappedHtml}`;
  }

  // Comportamento padrão: resolver configuração responsiva
  const responsiveConfig = resolveResponsiveColumns(cols, 1, 2, typeof cols === "number" ? cols : 3);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    gap,
  );

  const gridHtml = `<div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
  const wrappedHtml = hasWrapper
    ? `<div style="${wrapperStyle}">${gridHtml}</div>`
    : gridHtml;

  return `<style>${mediaQueries}</style>${wrappedHtml}`;
}
