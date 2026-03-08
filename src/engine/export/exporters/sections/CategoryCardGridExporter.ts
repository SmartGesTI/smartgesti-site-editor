/**
 * CategoryCardGrid Exporter
 * Grid de categorias com imagem de fundo — HTML export
 */

import { Block } from "../../../schema/siteDocument";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
} from "../../shared/responsiveGridHelper";

export function exportCategoryCardGrid(
  block: Block,
  _depth: number,
  _basePath?: string,
): string {
  const { title, subtitle, columns = 4, categories = [] } = (block as any).props;

  const gridId = generateScopedId(block.id || "", "category-grid");
  const responsiveConfig = resolveResponsiveColumns(columns, 1, 2, columns);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    "1.5rem",
  );

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  const cardsHtml = categories
    .map((cat: any) => {
      const iconHtml = cat.icon
        ? `<div style="font-size: 3rem; margin-bottom: 1rem;">${escapeHtml(cat.icon)}</div>`
        : "";
      const imgHtml = cat.image
        ? `<div style="height: 120px; background-image: url(${escapeHtml(cat.image)}); background-size: cover; background-position: center; border-radius: var(--sg-card-radius) var(--sg-card-radius) 0 0; margin: -2rem -1.5rem 1rem;"></div>`
        : "";
      const countHtml = cat.count != null
        ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(String(cat.count))} cursos</p>`
        : "";

      return `<a href="${escapeHtml(cat.href || "#")}" style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius); padding: 2rem 1.5rem; text-align: center; text-decoration: none; color: inherit; display: block; overflow: hidden;">${imgHtml}${iconHtml}<h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">${escapeHtml(cat.title || cat.name || "")}</h3>${countHtml}</a>`;
    })
    .join("");

  return `<style>${mediaQueries}</style><section ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div id="${gridId}" style="${inlineStyles}">${cardsHtml}</div></div></section>`;
}
