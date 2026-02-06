/**
 * Block Utilities
 * Funções utilitárias para manipulação de blocos
 */

import { Block, SiteDocument } from '../engine'

/**
 * Encontra um bloco na estrutura recursivamente
 */
export function findBlockInStructure(blocks: Block[], blockId: string): Block | null {
  if (!blocks || !Array.isArray(blocks)) return null

  for (const block of blocks) {
    if (!block || typeof block !== 'object' || !block.id) continue

    if (block.id === blockId) return block

    const props = block.props as Record<string, any>
    
    // Verificar children
    if (props?.children && Array.isArray(props.children)) {
      const found = findBlockInStructure(props.children, blockId)
      if (found) return found
    }
    
    // Verificar slots do Card
    if (block.type === 'card') {
      if (props?.header && Array.isArray(props.header)) {
        const found = findBlockInStructure(props.header, blockId)
        if (found) return found
      }
      if (props?.content && Array.isArray(props.content)) {
        const found = findBlockInStructure(props.content, blockId)
        if (found) return found
      }
      if (props?.footer && Array.isArray(props.footer)) {
        const found = findBlockInStructure(props.footer, blockId)
        if (found) return found
      }
    }
  }
  
  return null
}

/**
 * Limpa a estrutura de blocos inválidos
 */
export function cleanDocumentStructure(doc: SiteDocument): SiteDocument {
  const cleanBlocks = (blocks: Block[]): Block[] => {
    if (!blocks || !Array.isArray(blocks)) return []

    return blocks
      .filter((block) => block && typeof block === 'object' && block.id && block.type)
      .map((block) => {
        const props = block.props as Record<string, any>
        if (props && typeof props === 'object' && !Array.isArray(props)) {
          const children = props.children
          if (children && Array.isArray(children)) {
            return {
              ...block,
              props: {
                ...props,
                children: cleanBlocks(children),
              },
            }
          }
        }
        return block
      })
  }

  return {
    ...doc,
    pages: doc.pages.map((page) => ({
      ...page,
      structure: cleanBlocks(page.structure || []),
    })),
  }
}

/**
 * Conta total de blocos na estrutura (incluindo filhos)
 */
export function countBlocks(blocks: Block[]): number {
  if (!blocks || !Array.isArray(blocks)) return 0

  let total = 0
  for (const block of blocks) {
    if (!block || typeof block !== 'object' || !block.id || !block.type) continue

    total++

    const props = block.props as Record<string, any>
    if (props?.children && Array.isArray(props.children)) {
      total += countBlocks(props.children)
    }
  }
  return total
}

/**
 * Obtém nome amigável do tipo de bloco
 */
export function getBlockTypeName(type: Block['type']): string {
  const names: Record<string, string> = {
    container: 'Container',
    stack: 'Stack',
    grid: 'Grid',
    box: 'Box',
    heading: 'Título',
    text: 'Texto',
    image: 'Imagem',
    button: 'Botão',
    link: 'Link',
    divider: 'Divisor',
    card: 'Card',
    section: 'Seção',
  }
  return names[type] || type
}

/**
 * Obtém preview do conteúdo de um bloco
 */
export function getBlockPreview(block: Block): string {
  const props = block.props as Record<string, any>

  switch (block.type) {
    case 'heading':
      return props.text || 'Título'
    case 'text':
      return props.text?.substring(0, 30) + (props.text?.length > 30 ? '...' : '') || 'Texto'
    case 'button':
      return props.text || 'Botão'
    case 'link':
      return props.text || 'Link'
    case 'image':
      return 'Imagem'
    case 'container':
    case 'stack':
    case 'grid':
    case 'box':
      return `${getBlockTypeName(block.type)} (${props.children?.length || 0})`
    case 'section':
      return props.id ? `Seção: ${props.id}` : 'Seção'
    case 'card':
      return 'Card'
    case 'divider':
      return 'Divisor'
    default: {
      const blockType = (block as Block).type
      return getBlockTypeName(blockType)
    }
  }
}
