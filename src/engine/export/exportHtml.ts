/**
 * HTML Exporter
 * Exporta SiteDocumentV2 para HTML estático
 */

import { SiteDocumentV2, SitePage, Block } from "../schema/siteDocument";
import { generateThemeCSSVariables, ThemeTokens } from "../schema/themeTokens";
import { sanitizeHtml } from "./sanitizeHtml";
import { hashDocument } from "../../utils/documentHash";
import { htmlExportRegistry, initializeExporters } from "./exporters";

/**
 * Cache de HTML com limite LRU (Last Recently Used)
 * Limite de 50 entradas para evitar memory leak
 */
const htmlCache = new Map<string, { html: string; timestamp: number }>();
const MAX_CACHE_SIZE = 50;

/**
 * Limpa entradas antigas do cache quando excede o limite
 */
function cleanCache() {
  if (htmlCache.size <= MAX_CACHE_SIZE) return;

  // Ordenar por timestamp e remover os mais antigos
  const entries = Array.from(htmlCache.entries()).sort(
    (a, b) => a[1].timestamp - b[1].timestamp,
  );

  const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
  toRemove.forEach(([key]) => htmlCache.delete(key));
}

// Inicializar exporters com referência à função de renderização
let exportersInitialized = false;

/**
 * Renderiza um bloco diretamente para HTML (sem React)
 * Usa registry pattern para despachar para exporters modulares
 */
function blockToHtmlDirect(
  block: Block,
  depth: number = 0,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  // Inicializar exporters na primeira execução
  if (!exportersInitialized) {
    initializeExporters(blockToHtmlDirect);
    exportersInitialized = true;
  }

  // Buscar exporter no registry
  const exporter = htmlExportRegistry.get(block.type);

  if (!exporter) {
    // Fallback para blocos desconhecidos
    return `<div data-block-id="${block.id}" style="color: red; padding: 1rem; border: 2px dashed red;">Bloco desconhecido: ${block.type}</div>`;
  }

  // Executar exporter
  return exporter(block, depth, basePath, theme);
}

/**
 * Escapa HTML para prevenir XSS
 * NOTA: Esta função foi mantida aqui por compatibilidade, mas está duplicada
 * em shared/htmlHelpers.ts onde é usada pelos exporters
 */
function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// CÓDIGO ANTIGO REMOVIDO - Agora usamos Registry Pattern
// ============================================================================
// Todo o switch gigante de blockToHtmlDirect foi refatorado para exporters
// modulares em /exporters/. Mantido apenas as linhas abaixo para referência
// do que foi removido:
//
// - ~1200 linhas de código de switch/case
// - 40+ casos de tipos de blocos
// - Lógica de renderização HTML inline
//
// Agora distribuído em:
// - /exporters/layout/*.ts (Container, Stack, Grid, Box, Section)
// - /exporters/content/*.ts (Heading, Text, Image, Button, Link, etc)
// - /exporters/sections/*.ts (Hero, Navbar, Footer, Marketing sections)
// - /exporters/forms/*.ts (Form, Input, Textarea, FormSelect)
// ============================================================================


export interface ExportPageToHtmlOptions {
  /** Página de referência para layout (navbar + footer). Quando a página atual não é a home, inclui navbar e footer desta página. */
  layoutFromPage?: SitePage;
}

/**
 * Exporta uma página para HTML (com cache)
 * @param basePath - Base path para links (ex.: /site ou /site/escola/:slug)
 * @param options - layoutFromPage: quando informado e diferente da página atual, inclui navbar (primeiro bloco navbar) e footer (último bloco) da página de referência
 */
export function exportPageToHtml(
  page: SitePage,
  document: SiteDocumentV2,
  useCache: boolean = true,
  basePath?: string,
  options?: ExportPageToHtmlOptions,
): string {
  const layoutFromPage = options?.layoutFromPage;
  const docHash = hashDocument(document);
  const layoutId = layoutFromPage?.id ?? "";
  const cacheKey = `${docHash}-${page.id}-${basePath ?? ""}-${layoutId}`;

  // Verificar cache
  if (useCache && htmlCache.has(cacheKey)) {
    const cached = htmlCache.get(cacheKey)!;
    cached.timestamp = Date.now();
    return cached.html;
  }

  // Gerar HTML
  const themeCSS = generateThemeCSSVariables(document.theme);
  let bodyHtml = page.structure
    .map((block) => blockToHtmlDirect(block, 0, basePath, document.theme))
    .join("");

  // Layout compartilhado: em páginas não-home, incluir navbar e footer da página de referência (ex.: home)
  if (
    layoutFromPage &&
    layoutFromPage.id !== page.id &&
    layoutFromPage.structure?.length
  ) {
    const layoutStructure = layoutFromPage.structure;
    const navbarBlock = layoutStructure.find((b) => b.type === "navbar");
    const navbarHtml = navbarBlock
      ? blockToHtmlDirect(navbarBlock, 0, basePath, document.theme)
      : "";
    const footerBlock =
      layoutStructure.length > 1
        ? layoutStructure[layoutStructure.length - 1]
        : null;
    const footerHtml =
      footerBlock && footerBlock.type !== "navbar"
        ? blockToHtmlDirect(footerBlock, 0, basePath, document.theme)
        : "";
    bodyHtml = navbarHtml + bodyHtml + footerHtml;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.name)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: var(--sg-font-body, system-ui, -apple-system, sans-serif);
      line-height: 1.6;
      color: var(--sg-text, #1f2937);
    }
    ${themeCSS}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

  // Armazenar no cache
  if (useCache) {
    htmlCache.set(cacheKey, { html, timestamp: Date.now() });
    cleanCache();
  }

  return html;
}

/**
 * Exporta apenas um bloco para HTML (para atualização parcial)
 */
export function exportBlockToHtml(
  block: Block,
  basePath?: string,
  theme?: ThemeTokens
): string {
  return blockToHtmlDirect(block, 0, basePath, theme);
}

/**
 * Limpa o cache de HTML
 */
export function clearHtmlCache(): void {
  htmlCache.clear();
}

/**
 * Exporta documento completo para HTML (sanitizado)
 */
export function exportDocumentToHtml(
  document: SiteDocumentV2,
  pageId?: string,
): string {
  const page = pageId
    ? document.pages.find((p) => p.id === pageId)
    : document.pages[0];

  if (!page) {
    throw new Error("Page not found");
  }

  const html = exportPageToHtml(page, document);
  return sanitizeHtml(html);
}

/**
 * Gera manifest de assets (imagens, fontes, etc)
 */
export function generateAssetsManifest(
  document: SiteDocumentV2,
): Array<{ type: string; url: string }> {
  const assets: Array<{ type: string; url: string }> = [];

  function extractAssetsFromBlock(block: Block) {
    if (block.type === "image") {
      const src = (block as any).props.src;
      if (src) {
        assets.push({ type: "image", url: src });
      }
    }

    // Recursivamente extrair de children
    const children = (block as any).props?.children || [];
    children.forEach(extractAssetsFromBlock);
  }

  document.pages.forEach((page) => {
    page.structure.forEach(extractAssetsFromBlock);
  });

  return assets;
}
