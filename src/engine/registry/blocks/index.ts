/**
 * Block Definitions
 * Registra todas as definições de blocos de forma modular
 *
 * Estrutura:
 * - layout/: Blocos de layout (container, stack, grid, box, spacer)
 * - content/: Blocos de conteúdo (heading, text, image, button, link, etc.)
 * - composition/: Blocos de composição (card, section)
 * - sections/: Seções completas (hero, navbar, footer, features, pricing, etc.)
 * - forms/: Blocos de formulário (form, input, textarea, select)
 */

// Importar todos os módulos (auto-registro ao importar)
import "./layout";
import "./content";
import "./composition";
import "./sections";
import "./forms";

// Re-exportar o registry e tipos para compatibilidade
export { componentRegistry } from "../registry";
export type { BlockDefinition } from "../types";
