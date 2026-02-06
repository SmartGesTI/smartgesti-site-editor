/**
 * Block Selector
 * Lista blocos da estrutura de forma hierárquica
 */

import React, { useMemo } from 'react'
import { Block } from '../engine'
import { componentRegistry } from '../engine'
import { Trash2, ChevronRight } from 'lucide-react'
import { cn } from '../utils/cn'

interface BlockSelectorProps {
  structure: Block[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onDeleteBlock: (blockId: string) => void
}

/**
 * Obtém nome amigável do tipo de bloco
 */
function getBlockTypeName(type: Block['type']): string {
  const definition = componentRegistry.get(type)
  return definition?.name || type
}

/**
 * Obtém preview do bloco (texto ou propriedade relevante)
 */
function getBlockPreview(block: Block): string {
  const props = block.props as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any -- dynamic access for preview

  switch (block.type) {
    case 'heading':
      return props.text || 'Heading'
    case 'text':
      return props.text ? String(props.text).substring(0, 30) + (String(props.text).length > 30 ? '...' : '') : 'Text'
    case 'button':
      return props.text || 'Button'
    case 'link':
      return props.text || 'Link'
    case 'image':
      return props.alt || props.src ? 'Image' : 'Image'
    case 'container':
    case 'stack':
    case 'grid':
    case 'box':
      return `${getBlockTypeName(block.type)} (${Array.isArray(props.children) ? props.children.length : 0} children)`
    case 'section':
      return props.id ? `Section: ${props.id}` : 'Section'
    case 'card':
      return 'Card'
    case 'divider':
      return 'Divider'
    default:
      return getBlockTypeName(block.type)
  }
}

/**
 * Renderiza um bloco e seus children recursivamente
 */
function renderBlockTree(
  block: Block,
  depth: number,
  selectedBlockId: string | null,
  onSelectBlock: (blockId: string) => void,
  onDeleteBlock: (blockId: string) => void
): React.ReactNode {
  // Verificar se o bloco é válido
  if (!block || typeof block !== 'object' || !block.id || !block.type) {
    return null
  }

  const isSelected = block.id === selectedBlockId
  const props = block.props as Record<string, any>
  const hasChildren = props && typeof props === 'object' && props.children && Array.isArray(props.children) && props.children.length > 0

  return (
    <div key={block.id}>
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer group',
          'hover:scale-[1.01] active:scale-[0.99]',
          isSelected
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
            : 'bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
          depth > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelectBlock(block.id)}
      >
        {/* Indentação visual */}
        {depth > 0 && (
          <div className="flex-shrink-0 w-4 flex items-center justify-center">
            <ChevronRight className="w-3 h-3 opacity-50" />
          </div>
        )}

        {/* Badge de tipo */}
        <div
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded text-xs font-semibold flex items-center justify-center',
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          )}
          title={getBlockTypeName(block.type)}
        >
          {block.type.substring(0, 2).toUpperCase()}
        </div>

        {/* Nome e preview */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{getBlockTypeName(block.type)}</div>
          <div
            className={cn(
              'text-xs truncate',
              isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {getBlockPreview(block)}
          </div>
        </div>

        {/* Botão deletar */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDeleteBlock(block.id)
          }}
          className={cn(
            'p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100',
            'hover:bg-white/30 dark:hover:bg-gray-700/50',
            'hover:scale-110 active:scale-95',
            isSelected
              ? 'text-white hover:bg-white/40'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
          title="Deletar bloco"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Renderizar children recursivamente */}
      {hasChildren && (
        <div className="mt-1">
          {props.children
            .filter((child: Block) => child && child.id && child.type) // Filtrar children inválidos
            .map((child: Block) =>
              renderBlockTree(child, depth + 1, selectedBlockId, onSelectBlock, onDeleteBlock)
            )}
        </div>
      )}
    </div>
  )
}

export const BlockSelector = React.memo(function BlockSelector({
  structure,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
}: BlockSelectorProps) {
  // Filtrar estrutura inválida ANTES de usar
  const validStructure = useMemo(() => {
    if (!structure || !Array.isArray(structure)) return []
    return structure.filter((b) => b && typeof b === 'object' && b.id && b.type)
  }, [structure])

  // Contar total de blocos (incluindo children) - usando useMemo para evitar recálculos
  const totalBlocks = useMemo(() => {
    const count = (blocks: Block[]): number => {
      if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return 0
      
      let total = 0
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        
        // Verificar se o bloco é válido ANTES de acessar qualquer propriedade
        if (!block || typeof block !== 'object' || !block.id || !block.type) {
          continue
        }
        
        total++ // Contar o bloco atual
        
        // Verificar props de forma segura - SEMPRE dentro de try-catch
        try {
          if (!block.props) {
            continue
          }
          
          const props = block.props
          if (props && typeof props === 'object' && !Array.isArray(props)) {
            const children = (props as Record<string, any>).children
            if (children && Array.isArray(children) && children.length > 0) {
              // Filtrar children inválidos antes de contar recursivamente
              const validChildren = children.filter(
                (child: unknown) => child && typeof child === 'object' && (child as Block).id && (child as Block).type
              )
              if (validChildren.length > 0) {
                total += count(validChildren)
              }
            }
          }
        } catch (error) {
          // Se houver erro ao acessar props, apenas continuar
          continue
        }
      }
      return total
    }
    
    return count(validStructure)
  }, [validStructure])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Blocos</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {totalBlocks} {totalBlocks === 1 ? 'bloco' : 'blocos'}
        </p>
      </div>

      {/* Lista de blocos */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {!validStructure || validStructure.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-8">
            Nenhum bloco adicionado ainda
          </div>
        ) : (
          validStructure.map((block) =>
            renderBlockTree(block, 0, selectedBlockId, onSelectBlock, onDeleteBlock)
          )
        )}
      </div>
    </div>
  )
});
