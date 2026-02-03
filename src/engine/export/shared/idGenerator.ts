/**
 * ID Generator
 * Gera IDs únicos e CSS-safe para uso em seletores CSS
 */

/**
 * Gera um ID CSS-safe único a partir de um blockId
 *
 * @param blockId - ID do bloco (pode conter caracteres inválidos para CSS)
 * @param prefix - Prefixo opcional para o ID (default: "sg")
 * @returns ID único sanitizado para uso em CSS
 *
 * @example
 * generateScopedId("hero-123", "grid") // → "sg-grid-hero-123"
 * generateScopedId("nav@bar#456", "navbar") // → "sg-navbar-nav-bar-456"
 */
export function generateScopedId(blockId: string, prefix: string = "sg"): string {
  if (!blockId) {
    // Se não há blockId, gera um ID único baseado em timestamp + random
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${random}`;
  }

  // Sanitizar blockId: remover caracteres inválidos para CSS
  // CSS IDs podem conter: [a-zA-Z0-9], hífens (-), underscores (_)
  // Não podem começar com número ou hífen seguido de número
  const sanitized = blockId
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Substituir inválidos por hífen
    .replace(/^(\d)/, "n$1") // Se começa com número, prefixar com 'n'
    .replace(/^-(\d)/, "-n$1") // Se começa com -número, adicionar 'n'
    .replace(/-+/g, "-") // Reduzir múltiplos hífens para um só
    .replace(/^-|-$/g, ""); // Remover hífens no início/fim

  return `${prefix}-${sanitized}`;
}

/**
 * Gera um ID único para um grid responsivo
 *
 * @param blockId - ID do bloco
 * @returns ID único no formato "sg-grid-{blockId}"
 *
 * @example
 * generateGridId("features-grid-abc") // → "sg-grid-features-grid-abc"
 */
export function generateGridId(blockId: string): string {
  return generateScopedId(blockId, "grid");
}

/**
 * Gera um ID único para uma navbar
 *
 * @param blockId - ID do bloco
 * @returns ID único no formato "sg-navbar-{blockId}"
 *
 * @example
 * generateNavbarId("navbar-main") // → "sg-navbar-navbar-main"
 */
export function generateNavbarId(blockId: string): string {
  return generateScopedId(blockId, "navbar");
}

/**
 * Gera um ID único para um container
 *
 * @param blockId - ID do bloco
 * @returns ID único no formato "sg-container-{blockId}"
 */
export function generateContainerId(blockId: string): string {
  return generateScopedId(blockId, "container");
}

/**
 * Valida se um ID é CSS-safe
 *
 * @param id - ID a ser validado
 * @returns true se o ID é válido para uso em CSS
 */
export function isValidCssId(id: string): boolean {
  // ID CSS deve:
  // - Não ser vazio
  // - Não começar com número (exceto se precedido por prefixo)
  // - Conter apenas [a-zA-Z0-9-_]
  const cssIdPattern = /^[a-zA-Z_-][a-zA-Z0-9_-]*$/;
  return cssIdPattern.test(id);
}
