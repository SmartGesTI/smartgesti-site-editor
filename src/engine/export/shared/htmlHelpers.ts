/**
 * Utilitários compartilhados para geração de HTML
 */

/**
 * Escapa HTML para prevenir XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Reescreve href para o basePath do site (ex.: /site ou /site/escola/:slug)
 */
export function resolveHref(href: string, basePath?: string): string {
  if (!basePath || !href.startsWith("/site")) return href;
  return basePath + href.slice(5); // '/site' -> basePath, resto igual
}

/**
 * Verifica se o href é link interno do site (navega para outra página do site).
 * Âncoras (#courses, #contact) não são consideradas link interno (scroll na mesma página).
 */
export function isInternalSiteLink(href: string, basePath?: string): boolean {
  if (!href || href === "#") return false;
  if (href.startsWith("#")) return false; // âncora na mesma página
  if (href.startsWith("/site")) return true;
  if (basePath && href.startsWith(basePath)) return true;
  return false;
}

/**
 * Retorna target="_top" para links internos do site (navega na janela principal);
 * para âncoras ou links externos retorna vazio.
 */
export function linkTargetAttr(href: string, basePath?: string): string {
  const resolved =
    basePath && href.startsWith("/site") ? resolveHref(href, basePath) : href;
  return isInternalSiteLink(resolved, basePath) ? ' target="_top"' : "";
}

/**
 * Gera atributo data-block-id para rastreamento de blocos
 */
export function dataBlockIdAttr(blockId: string): string {
  return `data-block-id="${escapeHtml(blockId)}"`;
}
