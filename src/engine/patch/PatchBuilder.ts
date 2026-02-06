/**
 * Patch Builder
 * Helper para criar patches JSON Patch comuns
 */

import { Patch, PatchOperation } from './types'
import { SiteDocument, Block, SitePage } from '../schema/siteDocument'

/**
 * Encontra o caminho JSON de um bloco na estrutura
 */
function findBlockPath(
  structure: Block[],
  blockId: string,
  parentPath: string
): { path: string; block: Block; parentIndex: number } | null {
  for (let i = 0; i < structure.length; i++) {
    const block = structure[i]
    const currentPath = `${parentPath}/${i}`

    if (block.id === blockId) {
      return { path: currentPath, block, parentIndex: i }
    }

    // Verificar children recursivamente
    const props = block.props as Record<string, any>;
    if (props?.children && Array.isArray(props.children)) {
      const childPath = `${currentPath}/props/children`
      const found = findBlockPath(props.children as Block[], blockId, childPath)
      if (found) {
        return found
      }
    }

    // Verificar slots (para Card)
    if (block.type === 'card') {
      if (props.header && Array.isArray(props.header)) {
        const found = findBlockPath(props.header as Block[], blockId, `${currentPath}/props/header`)
        if (found) return found
      }
      if (props.content && Array.isArray(props.content)) {
        const found = findBlockPath(props.content as Block[], blockId, `${currentPath}/props/content`)
        if (found) return found
      }
      if (props.footer && Array.isArray(props.footer)) {
        const found = findBlockPath(props.footer as Block[], blockId, `${currentPath}/props/footer`)
        if (found) return found
      }
    }
  }

  return null
}

/**
 * Encontra o caminho de um bloco em uma página específica
 */
function findBlockPathInPage(
  document: SiteDocument,
  pageId: string,
  blockId: string
): { path: string; block: Block } | null {
  const page = document.pages.find((p) => p.id === pageId)
  if (!page) return null

  const pageIndex = document.pages.indexOf(page)
  const structurePath = `/pages/${pageIndex}/structure`
  const result = findBlockPath(page.structure, blockId, structurePath)
  if (!result) return null

  return { path: result.path, block: result.block }
}

/**
 * Patch Builder - Helper para criar patches comuns
 */
export class PatchBuilder {
  /**
   * Cria patch para atualizar uma propriedade de um bloco
   */
  static updateBlockProp(
    document: SiteDocument,
    pageId: string,
    blockId: string,
    propName: string,
    value: any
  ): Patch {
    const blockInfo = findBlockPathInPage(document, pageId, blockId)
    if (!blockInfo) {
      throw new Error(`Block ${blockId} not found in page ${pageId}`)
    }

    const propPath = `${blockInfo.path}/props/${propName}`
    return [{ op: 'replace', path: propPath, value }]
  }

  /**
   * Cria patch para atualizar múltiplas propriedades de um bloco
   */
  static updateBlockProps(
    document: SiteDocument,
    pageId: string,
    blockId: string,
    updates: Record<string, any>
  ): Patch {
    const patches: PatchOperation[] = []

    const blockInfo = findBlockPathInPage(document, pageId, blockId)
    if (!blockInfo) {
      throw new Error(`Block ${blockId} not found in page ${pageId}`)
    }

    // Verificar quais propriedades já existem
    const existingProps = blockInfo.block.props as Record<string, any>

    for (const [propName, value] of Object.entries(updates)) {
      const propPath = `${blockInfo.path}/props/${propName}`
      
      // Se a propriedade já existe, usar replace; caso contrário, usar add
      if (propName in existingProps) {
        patches.push({ op: 'replace', path: propPath, value })
      } else {
        patches.push({ op: 'add', path: propPath, value })
      }
    }

    return patches
  }

  /**
   * Cria patch para adicionar um bloco
   */
  static addBlock(
    document: SiteDocument,
    pageId: string,
    newBlock: Block,
    parentBlockId?: string,
    position?: number
  ): Patch {
    const page = document.pages.find((p) => p.id === pageId)
    if (!page) {
      throw new Error(`Page ${pageId} not found`)
    }

    // Se não especificar parent, adiciona na raiz da página
    if (!parentBlockId) {
      const targetIndex = position !== undefined ? position : page.structure.length
      const path = `/pages/${document.pages.indexOf(page)}/structure/${targetIndex}`
      return [{ op: 'add', path, value: newBlock }]
    }

    // Encontrar parent block
    const parentInfo = findBlockPathInPage(document, pageId, parentBlockId)
    if (!parentInfo) {
      throw new Error(`Parent block ${parentBlockId} not found`)
    }

    // Verificar se parent tem children
    const parentBlock = parentInfo.block
    const props = parentBlock.props as Record<string, any>

    if (!props.children || !Array.isArray(props.children)) {
      // Criar array de children primeiro
      const childrenPath = `${parentInfo.path}/props/children`
      const targetIndex = position !== undefined ? position : 0
      return [
        { op: 'add', path: childrenPath, value: [] },
        { op: 'add', path: `${childrenPath}/${targetIndex}`, value: newBlock },
      ]
    }

    // Adicionar ao array de children existente
    const childrenPath = `${parentInfo.path}/props/children`
    const targetIndex = position !== undefined ? position : props.children.length
    return [{ op: 'add', path: `${childrenPath}/${targetIndex}`, value: newBlock }]
  }

  /**
   * Cria patch para remover um bloco
   */
  static removeBlock(document: SiteDocument, pageId: string, blockId: string): Patch {
    const blockInfo = findBlockPathInPage(document, pageId, blockId)
    if (!blockInfo) {
      throw new Error(`Block ${blockId} not found in page ${pageId}`)
    }

    return [{ op: 'remove', path: blockInfo.path }]
  }

  /**
   * Cria patch para mover um bloco
   */
  static moveBlock(
    document: SiteDocument,
    pageId: string,
    blockId: string,
    newParentBlockId: string | null,
    newPosition: number
  ): Patch {
    const blockInfo = findBlockPathInPage(document, pageId, blockId)
    if (!blockInfo) {
      throw new Error(`Block ${blockId} not found in page ${pageId}`)
    }

    const page = document.pages.find((p) => p.id === pageId)!
    const pageIndex = document.pages.indexOf(page)

    // Se newParentBlockId é null, move para raiz da página
    if (newParentBlockId === null) {
      const newPath = `/pages/${pageIndex}/structure/${newPosition}`
      return [{ op: 'move', from: blockInfo.path, path: newPath }]
    }

    // Encontrar novo parent
    const newParentInfo = findBlockPathInPage(document, pageId, newParentBlockId)
    if (!newParentInfo) {
      throw new Error(`New parent block ${newParentBlockId} not found`)
    }

    const newParentProps = newParentInfo.block.props as Record<string, any>
    const childrenPath = `${newParentInfo.path}/props/children`

    // Se parent não tem children, criar array primeiro
    if (!newParentProps.children || !Array.isArray(newParentProps.children)) {
      return [
        { op: 'add', path: childrenPath, value: [] },
        { op: 'move', from: blockInfo.path, path: `${childrenPath}/${newPosition}` },
      ]
    }

    // Mover para children do novo parent
    const newPath = `${childrenPath}/${newPosition}`
    return [{ op: 'move', from: blockInfo.path, path: newPath }]
  }

  /**
   * Cria patch para atualizar tema
   */
  static updateTheme(_document: SiteDocument, themeUpdates: Partial<SiteDocument['theme']>): Patch {
    const patches: PatchOperation[] = []

    for (const [key, value] of Object.entries(themeUpdates)) {
      // Se for um objeto (como colors), atualizar propriedades individuais
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [subKey, subValue] of Object.entries(value)) {
          patches.push({ op: 'replace', path: `/theme/${key}/${subKey}`, value: subValue })
        }
      } else {
        patches.push({ op: 'replace', path: `/theme/${key}`, value })
      }
    }

    return patches
  }

  /**
   * Cria patch para atualizar propriedade do tema
   */
  static updateThemeProp(
    _document: SiteDocument,
    themePath: string,
    value: any
  ): Patch {
    return [{ op: 'replace', path: `/theme/${themePath}`, value }]
  }

  /**
   * Cria patch para adicionar uma nova página
   */
  static addPage(document: SiteDocument, newPage: SitePage): Patch {
    const position = document.pages.length
    return [{ op: 'add', path: `/pages/${position}`, value: newPage }]
  }

  /**
   * Cria patch para remover uma página
   */
  static removePage(document: SiteDocument, pageId: string): Patch {
    const pageIndex = document.pages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) {
      throw new Error(`Page ${pageId} not found`)
    }

    return [{ op: 'remove', path: `/pages/${pageIndex}` }]
  }

  /**
   * Cria patch para atualizar propriedades de uma página
   */
  static updatePage(
    document: SiteDocument,
    pageId: string,
    updates: Partial<Omit<SitePage, 'structure'>>
  ): Patch {
    const pageIndex = document.pages.findIndex((p) => p.id === pageId)
    if (pageIndex === -1) {
      throw new Error(`Page ${pageId} not found`)
    }

    const patches: PatchOperation[] = []

    for (const [key, value] of Object.entries(updates)) {
      patches.push({ op: 'replace', path: `/pages/${pageIndex}/${key}`, value })
    }

    return patches
  }

  /**
   * Combina múltiplos patches em um único patch
   */
  static combine(...patches: Patch[]): Patch {
    return patches.flat()
  }
}
