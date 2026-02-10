/**
 * Grid Block Exporter
 * Sistema responsivo mobile-first com media queries
 * Suporte a colTemplate para templates customizados (ex: "1fr 320px")
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
  const { cols = 3, colTemplate, gap = "1rem", children = [] } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportGrid requires renderChild function");
  }

  // Gerar ID único para este grid
  const gridId = generateGridId(block.id || "");

  // Renderizar filhos
  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

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

    return `<style>${mediaQueries}</style><div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
  }

  // Comportamento padrão: resolver configuração responsiva
  const responsiveConfig = resolveResponsiveColumns(cols, 1, 2, typeof cols === "number" ? cols : 3);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    gap,
  );

  return `<style>${mediaQueries}</style><div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
}
