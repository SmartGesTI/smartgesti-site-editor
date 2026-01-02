/**
 * Block Palette
 * Paleta de blocos disponíveis para adicionar
 */

import { useMemo } from 'react'
import { BlockType, BlockDefinition } from '../engine'
import { componentRegistry } from '../engine'
import { cn } from '../utils/cn'

interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void
  selectedParentBlockId?: string | null
}

/**
 * Ícones simples para cada tipo de bloco
 */
function getBlockIcon(type: BlockType): string {
  const icons: Record<string, string> = {
    // Layout
    container: '📦',
    stack: '📚',
    grid: '⊞',
    box: '☐',
    section: '▦',
    spacer: '↕',
    
    // Conteúdo
    heading: 'H',
    text: 'T',
    image: '🖼️',
    video: '🎥',
    icon: '★',
    badge: '🎟️',
    avatar: '👤',
    socialLinks: '🌐',
    
    // Interativos
    button: '🔘',
    link: '🔗',
    divider: '─',
    card: '🃏',
    
    // Seções
    hero: '🏆',
    feature: '✨',
    featureGrid: '⭐',
    pricing: '💰',
    pricingCard: '💳',
    testimonial: '💬',
    testimonialGrid: '🗨️',
    faq: '❓',
    faqItem: '📝',
    cta: '📣',
    stats: '📊',
    statItem: '#',
    logoCloud: '🏂',
    navbar: '☰',
    
    // Formulários
    form: '📋',
    input: '✏️',
    textarea: '📑',
    formSelect: '👇',
  }
  return icons[type] || '•'
}

export function BlockPalette({
  onAddBlock,
  selectedParentBlockId,
}: BlockPaletteProps) {
  // Obter blocos agrupados por categoria
  const blocksByCategory = useMemo(() => {
    const categories: Record<string, BlockDefinition[]> = {
      layout: [],
      content: [],
      composition: [],
      sections: [],
      forms: [],
    }

    componentRegistry.getAll().forEach((def) => {
      if (categories[def.category]) {
        categories[def.category].push(def)
      }
    })

    return categories
  }, [])

  const handleAddBlock = (blockType: BlockType) => {
    onAddBlock(blockType, selectedParentBlockId || undefined)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Adicionar Bloco</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Clique para adicionar ao site
        </p>
      </div>

      {/* Lista de blocos por categoria */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Layout Blocks */}
        {blocksByCategory.layout.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Layout
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocksByCategory.layout.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddBlock(def.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20',
                    'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  )}
                  title={def.description}
                >
                  <div className="text-2xl">{getBlockIcon(def.type)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {def.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Blocks */}
        {blocksByCategory.content.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Conteúdo
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocksByCategory.content.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddBlock(def.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20',
                    'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  )}
                  title={def.description}
                >
                  <div className="text-2xl">{getBlockIcon(def.type)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {def.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composition Blocks */}
        {blocksByCategory.composition.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Composição
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocksByCategory.composition.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddBlock(def.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20',
                    'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  )}
                  title={def.description}
                >
                  <div className="text-2xl">{getBlockIcon(def.type)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {def.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sections Blocks */}
        {blocksByCategory.sections.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Seções
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocksByCategory.sections.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddBlock(def.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20',
                    'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  )}
                  title={def.description}
                >
                  <div className="text-2xl">{getBlockIcon(def.type)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {def.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forms Blocks */}
        {blocksByCategory.forms.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Formulários
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocksByCategory.forms.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddBlock(def.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    'hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20',
                    'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  )}
                  title={def.description}
                >
                  <div className="text-2xl">{getBlockIcon(def.type)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {def.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {Object.values(blocksByCategory).every((arr) => arr.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-8">
            Nenhum bloco disponível
          </div>
        )}
      </div>
    </div>
  )
}
