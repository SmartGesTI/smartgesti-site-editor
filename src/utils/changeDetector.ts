/**
 * Change Detector
 * Detecta mudanças entre documentos para atualização parcial
 */

import { SiteDocumentV2, Block } from '../engine/schema/siteDocument'


/**
 * Compara dois blocos e retorna se são diferentes
 * Também retorna quais propriedades mudaram
 */
function blocksAreDifferent(block1: Block, block2: Block): { different: boolean; changedProps?: string[] } {
  // Comparação rápida primeiro
  if (JSON.stringify(block1) === JSON.stringify(block2)) {
    return { different: false }
  }

  // Detectar quais propriedades mudaram
  const props1 = block1.props as Record<string, any>
  const props2 = block2.props as Record<string, any>
  const changedProps: string[] = []

  // Verificar todas as propriedades
  const allProps = new Set([...Object.keys(props1 || {}), ...Object.keys(props2 || {})])
  for (const prop of allProps) {
    // Ignorar propriedades que são arrays de filhos - essas mudanças são detectadas nos filhos
    if (prop === 'children' || prop === 'header' || prop === 'content' || prop === 'footer') {
      // Comparar apenas se os arrays têm tamanhos diferentes ou IDs diferentes
      const oldChildren = props1[prop] || []
      const newChildren = props2[prop] || []
      
      if (Array.isArray(oldChildren) && Array.isArray(newChildren)) {
        // Se os arrays têm tamanhos diferentes, a mudança será detectada nos filhos
        if (oldChildren.length !== newChildren.length) {
          changedProps.push(prop)
        } else {
          // Verificar se os IDs dos filhos são os mesmos (ordem pode ter mudado)
          const oldIds = oldChildren.map((c: any) => c?.id).filter(Boolean).sort()
          const newIds = newChildren.map((c: any) => c?.id).filter(Boolean).sort()
          if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
            changedProps.push(prop)
          }
        }
      } else if (JSON.stringify(oldChildren) !== JSON.stringify(newChildren)) {
        changedProps.push(prop)
      }
    } else {
      // Para outras propriedades, comparar normalmente
      if (JSON.stringify(props1[prop]) !== JSON.stringify(props2[prop])) {
        changedProps.push(prop)
      }
    }
  }

  return { different: changedProps.length > 0, changedProps }
}

/**
 * Detecta quais blocos foram modificados entre dois documentos
 * @returns Array de objetos com blockId e changedProps
 */
export function detectChangedBlocks(
  oldDoc: SiteDocumentV2,
  newDoc: SiteDocumentV2
): Array<{ blockId: string; changedProps?: string[] }> {
  const changedBlocks: Array<{ blockId: string; changedProps?: string[] }> = []

  // Comparar páginas
  const oldPage = oldDoc.pages.find((p) => p.id === 'home') || oldDoc.pages[0]
  const newPage = newDoc.pages.find((p) => p.id === 'home') || newDoc.pages[0]

  if (!oldPage || !newPage) {
    return [] // Se não há páginas, não há mudanças
  }

  // Comparação rápida: se os IDs dos blocos raiz são os mesmos, não precisa verificar estrutura
  const oldRootIds = (oldPage.structure || []).map(b => b?.id).filter(Boolean).sort()
  const newRootIds = (newPage.structure || []).map(b => b?.id).filter(Boolean).sort()
  
  // Se ambos estão vazios, não há mudança estrutural
  if (oldRootIds.length === 0 && newRootIds.length === 0) {
    // Ambos vazios - não há estrutura para comparar, retornar vazio (sem mudanças)
    return []
  }
  
  if (JSON.stringify(oldRootIds) !== JSON.stringify(newRootIds)) {
    // Estrutura mudou (blocos adicionados/removidos na raiz)
    // Retornar mudança especial indicando mudança estrutural
    return [{ blockId: '__structural__', changedProps: ['children'] }]
  }

  // Comparar estrutura recursivamente
  const compareBlocks = (oldBlocks: Block[], newBlocks: Block[]): Array<{ blockId: string; changedProps?: string[] }> => {
    const localChangedBlocks: Array<{ blockId: string; changedProps?: string[] }> = []
    
    // Criar mapas de blocos por ID
    const oldBlocksMap = new Map<string, Block>()
    const newBlocksMap = new Map<string, Block>()

    const addToMap = (blocks: Block[], map: Map<string, Block>) => {
      for (const block of blocks) {
        if (!block || !block.id) continue
        map.set(block.id, block)
        const props = block.props as Record<string, any>
        if (props?.children && Array.isArray(props.children)) {
          addToMap(props.children as Block[], map)
        }
        if (block.type === 'card') {
          if (props.header && Array.isArray(props.header)) {
            addToMap(props.header as Block[], map)
          }
          if (props.content && Array.isArray(props.content)) {
            addToMap(props.content as Block[], map)
          }
          if (props.footer && Array.isArray(props.footer)) {
            addToMap(props.footer as Block[], map)
          }
        }
      }
    }

    addToMap(oldBlocks, oldBlocksMap)
    addToMap(newBlocks, newBlocksMap)

    // Verificar blocos que mudaram ou foram adicionados
    for (const [id, newBlock] of newBlocksMap) {
      const oldBlock = oldBlocksMap.get(id)
      if (!oldBlock) {
        // Novo bloco adicionado - mas não forçar recriação completa, apenas notar
        localChangedBlocks.push({ blockId: id })
      } else {
        const diff = blocksAreDifferent(oldBlock, newBlock)
        if (diff.different) {
          localChangedBlocks.push({ blockId: id, changedProps: diff.changedProps })
        }
      }
    }

    // Verificar blocos que foram removidos
    for (const [id] of oldBlocksMap) {
      if (!newBlocksMap.has(id)) {
        // Bloco foi removido - retornar vazio para forçar recriação completa
        return []
      }
    }

    return localChangedBlocks
  }

  const result = compareBlocks(oldPage.structure, newPage.structure)

  changedBlocks.push(...result)

  return changedBlocks
}

/**
 * Determina o tipo de mudança baseado no bloco e propriedade modificada
 */
export function getChangeType(_blockId: string, propName: string, blockType?: string): 'text' | 'layout' | 'visual' {
  // Mudanças visuais (cores, tema)
  const visualProps = ['color', 'bg', 'background', 'backgroundColor', 'primary', 'secondary', 'accent']
  if (visualProps.some((p) => propName.toLowerCase().includes(p))) {
    return 'visual'
  }

  // Mudanças de texto
  const textBlockTypes = ['heading', 'text', 'button', 'link']
  if (blockType && textBlockTypes.includes(blockType)) {
    if (propName === 'text' || propName === 'content') {
      return 'text'
    }
  }

  // Mudanças de layout (padrão)
  return 'layout'
}

/**
 * Verifica se apenas um bloco foi modificado
 */
export function isSingleBlockChange(changedBlocks: Array<{ blockId: string; changedProps?: string[] }>): boolean {
  return changedBlocks.length === 1
}

/**
 * Obtém IDs dos blocos modificados
 */
export function getChangedBlockIds(changedBlocks: Array<{ blockId: string; changedProps?: string[] }>): string[] {
  return changedBlocks.map((c) => c.blockId)
}

/**
 * Verifica se as mudanças são apenas visuais (cores, background, etc)
 */
export function isVisualChangeOnly(changedBlocks: Array<{ blockId: string; changedProps?: string[] }>): boolean {
  if (changedBlocks.length === 0) return false
  
  const visualProps = ['color', 'bg', 'background', 'backgroundColor', 'border', 'shadow', 'radius']
  
  for (const change of changedBlocks) {
    if (!change.changedProps) return false
    
    // Se todas as propriedades mudadas são visuais
    const allVisual = change.changedProps.every((prop) => 
      visualProps.some((vp) => prop.toLowerCase().includes(vp.toLowerCase()))
    )
    
    if (!allVisual) return false
  }
  
  return true
}
