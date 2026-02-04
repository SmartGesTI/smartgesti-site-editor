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
 * Landing Page CSS crítico para navbar e outros componentes
 * Incluído inline para garantir que sempre esteja disponível
 */
const landingPageCSS = `
/* Navbar engine (sg-navbar) - base e variações */
.sg-navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 4.5rem;
  color: var(--sg-text, #1f2937);
  position: relative;
  transition: all 0.2s ease;
  background-color: var(--navbar-bg, var(--sg-bg, #fff));
  border-radius: var(--navbar-border-radius, 0);
  box-shadow: var(--navbar-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.sg-navbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: var(--navbar-blur-opacity, 0);
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
  backdrop-filter: blur(var(--navbar-blur-amount, 0px));
  -webkit-backdrop-filter: blur(var(--navbar-blur-amount, 0px));
}

.sg-navbar--floating {
  margin: 1rem;
  max-width: calc(100% - 2rem);
  border-radius: var(--navbar-border-radius, 12px);
  box-shadow: var(--navbar-shadow, 0 10px 40px rgba(0, 0, 0, 0.15));
  border-bottom: none !important;
}

.sg-navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.sg-navbar__brand {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.sg-navbar__brand a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  text-decoration: none;
  color: var(--sg-primary, #3b82f6);
  font-weight: 700;
  font-size: 1.25rem;
}

.sg-navbar__brand img {
  object-fit: contain;
  object-position: left center;
}

.sg-navbar__brand-text {
  color: var(--sg-primary, #3b82f6);
  font-weight: 700;
  font-size: 1.25rem;
}

.sg-navbar__menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sg-navbar__link {
  color: var(--navbar-link-color, var(--sg-text, #1f2937));
  font-size: var(--navbar-link-size, 1rem);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.sg-navbar__link:hover {
  color: var(--navbar-link-hover-color, var(--sg-primary, #3b82f6));
}

.sg-navbar__btn {
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  border-radius: var(--navbar-btn-radius, 0.5rem);
}

.sg-navbar__btn--solid {
  background-color: var(--navbar-btn-bg, var(--sg-primary, #3b82f6));
  color: var(--navbar-btn-text, var(--sg-primary-text, #fff));
  border: none;
}

.sg-navbar__btn--solid:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.sg-navbar__btn--outline {
  background-color: transparent;
  color: var(--navbar-btn-bg, var(--sg-primary, #3b82f6));
  border: 2px solid var(--navbar-btn-bg, var(--sg-primary, #3b82f6));
}

.sg-navbar__btn--outline:hover {
  background-color: var(--navbar-btn-bg, var(--sg-primary, #3b82f6));
  color: var(--navbar-btn-text, var(--sg-primary-text, #fff));
}

.sg-navbar__btn--ghost {
  background-color: transparent;
  color: var(--navbar-btn-bg, var(--sg-primary, #3b82f6));
  border: none;
}

.sg-navbar__btn--ghost:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.sg-navbar--classic.sg-navbar--floating {
  padding: 1rem 0;
  border-bottom: 1px solid var(--sg-border, #e5e7eb);
}

.sg-navbar--centered.sg-navbar--floating {
  padding: 1rem 0;
  border-bottom: 1px solid var(--sg-border, #e5e7eb);
}

.sg-navbar--centered .sg-navbar__container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.sg-navbar--centered .sg-navbar__brand {
  justify-self: start;
}

.sg-navbar--centered .sg-navbar__menu {
  justify-self: center;
}

.sg-navbar--centered .sg-navbar__actions {
  justify-self: end;
}

/* Dropdown wrapper */
.sg-navbar__dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.sg-navbar__link--has-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  position: relative;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* Chevron-down icon (▼) */
.sg-navbar__link--has-dropdown::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.25rem;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  transition: transform 0.2s ease;
}

.sg-navbar__dropdown-wrapper:hover .sg-navbar__link--has-dropdown::after {
  transform: rotate(180deg);
}

/* Dropdown container */
.sg-navbar-dropdown {
  display: none;
  opacity: 0;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 0.5rem;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}

/* Frost layer do dropdown (igual ao navbar) */
.sg-navbar-dropdown::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: var(--navbar-blur-opacity, 0);
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  backdrop-filter: blur(var(--navbar-blur-amount, 0px));
  -webkit-backdrop-filter: blur(var(--navbar-blur-amount, 0px));
}

/* Dropdown items acima do frost layer */
.sg-navbar-dropdown > * {
  position: relative;
  z-index: 1;
}

/* Show dropdown on hover/focus with animation */
.sg-navbar__dropdown-wrapper:hover .sg-navbar-dropdown,
.sg-navbar__dropdown-wrapper:focus-within .sg-navbar-dropdown {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* Dropdown items */
.sg-navbar-dropdown__item {
  display: block;
  white-space: nowrap;
}

/* Mobile - dropdowns sempre visíveis no sidebar */
@media (max-width: 768px) {
  .sg-navbar-dropdown {
    position: static;
    display: block !important;
    opacity: 1 !important;
    transform: none !important;
    min-width: auto;
    padding-left: 1rem;
    background: transparent !important;
    box-shadow: none !important;
    margin-top: 0.25rem;
  }

  .sg-navbar__link--has-dropdown::after {
    content: none;
  }

  .sg-navbar-dropdown__item {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
  }
}
`;

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
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: var(--sg-font-body, system-ui, -apple-system, sans-serif);
      line-height: 1.6;
      color: var(--sg-text, #1f2937);
    }
    ${themeCSS}

    /* Landing Page Styles */
    ${landingPageCSS}
  </style>
  <script>
    // Smooth scroll para âncoras sem reload
    document.addEventListener('DOMContentLoaded', function() {
      // Interceptar cliques em links com âncoras
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');

          // Ignorar # vazio
          if (!href || href === '#') return;

          // Prevenir comportamento padrão (reload)
          e.preventDefault();

          // Encontrar o elemento alvo
          const targetId = href.substring(1); // Remove o #
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Scroll suave até o elemento
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Atualizar URL sem reload (para manter histórico de navegação)
            if (history.pushState) {
              history.pushState(null, '', href);
            }
          }
        });
      });
    });
  </script>
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
