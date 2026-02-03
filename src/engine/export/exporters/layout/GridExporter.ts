/**
 * Grid Block Exporter
 * Sistema responsivo mobile-first com media queries
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr } from "../../shared/htmlHelpers";
import { generateGridId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
} from "../../shared/responsiveGridHelper";

export function exportGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { cols = 3, gap = "1rem", children = [] } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportGrid requires renderChild function");
  }

  // Gerar ID único para este grid
  const gridId = generateGridId(block.id || "");

  // Resolver configuração responsiva
  // Se cols é número: converte para {sm: 1, md: 2, lg: cols}
  // Se cols é objeto: usa valores fornecidos com defaults
  const responsiveConfig = resolveResponsiveColumns(cols, 1, 2, typeof cols === "number" ? cols : 3);

  // Gerar estilos inline (base mobile) + media queries
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    gap,
  );

  // Renderizar filhos
  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  // Retornar: <style> com media queries + grid HTML
  return `<style>${mediaQueries}</style><div id="${gridId}" ${dataBlockIdAttr(block.id)} style="${inlineStyles}">${childrenHtml}</div>`;
}
