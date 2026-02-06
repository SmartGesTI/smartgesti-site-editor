/**
 * Navbar Sync - Sincronização automática de links do navbar
 * Sistema que mantém os links do navbar atualizados com as páginas do documento
 */

import { Block, NavbarBlock, SiteDocumentV2, SitePage } from "@/engine/schema/siteDocument";
import { Patch } from "@/engine/patch/types";
import { PatchBuilder } from "@/engine/patch/PatchBuilder";
import { logger } from "./logger";

/**
 * Informação sobre um bloco navbar encontrado
 */
interface NavbarBlockInfo {
  block: NavbarBlock;
  pageId: string;
  blockId: string;
}

/**
 * Link do navbar
 */
interface NavbarLink {
  text: string;
  href: string;
}

/**
 * Busca recursiva por blocos navbar na estrutura
 */
function findNavbarBlocksInStructure(
  structure: Block[],
  pageId: string,
  navbars: NavbarBlockInfo[] = []
): NavbarBlockInfo[] {
  for (const block of structure) {
    // Se é um navbar, adiciona à lista
    if (block.type === "navbar") {
      navbars.push({
        block: block as NavbarBlock,
        pageId,
        blockId: block.id,
      });
    }

    // Busca recursiva em children
    const props = block.props as Record<string, any>;
    if (props?.children && Array.isArray(props.children)) {
      findNavbarBlocksInStructure(props.children, pageId, navbars);
    }

    // Busca em slots de card
    if (block.type === "card") {
      if (props?.header && Array.isArray(props.header)) {
        findNavbarBlocksInStructure(props.header, pageId, navbars);
      }
      if (props?.content && Array.isArray(props.content)) {
        findNavbarBlocksInStructure(props.content, pageId, navbars);
      }
      if (props?.footer && Array.isArray(props.footer)) {
        findNavbarBlocksInStructure(props.footer, pageId, navbars);
      }
    }

    // Busca em children de section/container/box/stack/grid
    if (["section", "container", "box", "stack", "grid"].includes(block.type)) {
      if (props?.children && Array.isArray(props.children)) {
        findNavbarBlocksInStructure(props.children, pageId, navbars);
      }
    }
  }

  return navbars;
}

/**
 * Encontra todos os blocos navbar em todas as páginas do documento
 */
export function findNavbarBlocks(document: SiteDocumentV2): NavbarBlockInfo[] {
  const navbars: NavbarBlockInfo[] = [];

  for (const page of document.pages) {
    findNavbarBlocksInStructure(page.structure, page.id, navbars);
  }

  return navbars;
}

/**
 * Gera array de links do navbar a partir das páginas do documento
 */
export function generateNavbarLinks(pages: SitePage[]): NavbarLink[] {
  return pages.map((page) => ({
    text: page.name,
    href: page.slug === "home" ? "/" : `/p/${page.slug}`,
  }));
}

/**
 * Verifica se um bloco navbar deve ter sincronização automática
 */
function shouldAutoSync(navbarBlock: NavbarBlock): boolean {
  const props = navbarBlock.props as Record<string, any>;
  // Se _autoSync foi explicitamente setado como false, respeitar
  if (props._autoSync === false) {
    return false;
  }
  // Por padrão, sincronizar (undefined ou true)
  return true;
}

/**
 * Sincroniza os links de todos os navbars com as páginas do documento
 * Retorna array de patches para aplicar
 */
export function syncNavbarLinks(document: SiteDocumentV2): Patch {
  const patches: Patch = [];

  // Gera links a partir das páginas
  const links = generateNavbarLinks(document.pages);

  // Encontra todos os navbars
  const navbars = findNavbarBlocks(document);

  // Para cada navbar, cria patch de atualização
  for (const navbarInfo of navbars) {
    // Verifica se deve sincronizar
    if (!shouldAutoSync(navbarInfo.block)) {
      continue;
    }

    try {
      // Cria patch para atualizar a propriedade links
      const patch = PatchBuilder.updateBlockProp(
        document,
        navbarInfo.pageId,
        navbarInfo.blockId,
        "links",
        links
      );

      patches.push(...patch);
    } catch (error) {
      logger.warn(
        `Failed to sync navbar ${navbarInfo.blockId} in page ${navbarInfo.pageId}:`,
        error
      );
    }
  }

  return patches;
}
