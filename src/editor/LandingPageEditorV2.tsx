/**
 * Landing Page Editor V2 - Refatorado
 * Editor de landing pages usando engine V2
 */

import { useState } from 'react'
import { BlockSelector } from './BlockSelector'
import { BlockPropertyEditor } from './BlockPropertyEditor'
import { BlockPalette } from './BlockPalette'
import { AIAgentPanel } from './AIAgentPanel'
import { PreviewV2 } from '../engine'
import { PaletteSelector } from './PaletteSelector'
import { Save, Eye, Undo, Redo, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'
import { useEditorState } from '../hooks/useEditorState'
import { SiteDocumentV2, PatchBuilder } from '../engine'
import type { Patch } from '../engine/patch/types'
import type { SiteDocumentV2 as AIDocumentV2 } from '../shared/schema'

/** JSON Patch Operation (RFC 6902) - tipo local para interface com API */
interface APIPatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: any
  from?: string
}

// ============================================================================
// Types
// ============================================================================

interface LandingPageEditorV2Props {
  initialData?: SiteDocumentV2
  onSave?: (data: SiteDocumentV2) => Promise<void>
  onPublish?: (data: SiteDocumentV2) => Promise<void>
  /** URL do endpoint de geração de sites por IA */
  aiEndpoint?: string
  /** Token de autenticação para o endpoint de IA */
  aiAuthToken?: string
}

// ============================================================================
// Component
// ============================================================================

export function LandingPageEditorV2({
  initialData,
  onSave,
  onPublish,
  aiEndpoint,
  aiAuthToken,
}: LandingPageEditorV2Props) {
  // Hook de estado do editor
  const {
    document,
    currentPage,
    selectedBlockId,
    selectedBlock,
    history,
    setSelectedBlockId,
    handleUndo,
    handleRedo,
    handleAddBlock,
    handleDeleteBlock,
    handleUpdateBlock,
    applyChange,
    resetToTemplate,
    isPaletteSelected,
    loadDocument,
  } = useEditorState({ initialData })

  // Estado local da UI
  const [showPalette, setShowPalette] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIAgent, setShowAIAgent] = useState(false)

  // Handlers de save/publish
  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave(document)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!onPublish) return
    setIsSaving(true)
    try {
      await onPublish(document)
    } catch (error) {
      console.error('Error publishing:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handler para atualizar paleta de cores
  const handlePaletteChange = (palette: any) => {
    const patch = PatchBuilder.updateTheme(document, {
      colors: {
        ...document.theme.colors,
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        bg: palette.background,
        surface: palette.surface || document.theme.colors.surface,
        text: palette.text || document.theme.colors.text,
      },
    })
    applyChange(patch, 'Update color palette')
  }

  // Função para converter documento do Editor para formato da API de IA
  const convertToAIDocument = (doc: SiteDocumentV2, page: any): AIDocumentV2 => {
    return {
      meta: {
        title: page?.name || doc.pages?.[0]?.name || 'Site',
        description: '',
        language: 'pt-BR',
      },
      theme: {
        colors: {
          primary: doc.theme.colors.primary,
          secondary: doc.theme.colors.secondary,
          accent: doc.theme.colors.accent,
          background: doc.theme.colors.bg,
          surface: doc.theme.colors.surface,
          text: doc.theme.colors.text,
          textMuted: doc.theme.colors.mutedText,
          border: doc.theme.colors.border,
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        typography: {
          fontFamily: doc.theme.typography?.fontFamily?.body || 'Inter, system-ui, sans-serif',
          fontFamilyHeading: doc.theme.typography?.fontFamily?.heading || 'Inter, system-ui, sans-serif',
          baseFontSize: doc.theme.typography?.baseSize || '16px',
          lineHeight: 1.6,
          headingLineHeight: 1.2,
        },
        spacing: {
          unit: '0.25rem',
          scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
        },
        effects: {
          borderRadius: '0.5rem',
          shadow: '0 1px 3px rgba(0,0,0,0.1)',
          shadowLg: '0 10px 15px rgba(0,0,0,0.1)',
          transition: '0.2s ease',
        },
      },
      structure: page?.structure || [],
    }
  }

  // Handler para quando IA gera um novo site
  const handleAIGenerate = (aiDocument: AIDocumentV2) => {
    // Converter documento da IA para o formato do Editor
    const editorDocument: SiteDocumentV2 = {
      schemaVersion: 2,
      theme: {
        colors: {
          bg: aiDocument.theme.colors.background,
          surface: aiDocument.theme.colors.surface,
          border: aiDocument.theme.colors.border,
          text: aiDocument.theme.colors.text,
          mutedText: aiDocument.theme.colors.textMuted,
          primary: aiDocument.theme.colors.primary,
          primaryText: '#ffffff',
          secondary: aiDocument.theme.colors.secondary,
          accent: aiDocument.theme.colors.accent,
          ring: aiDocument.theme.colors.primary,
        },
        radiusScale: 'md',
        shadowScale: 'soft',
        spacingScale: 'normal',
        motion: 'subtle',
        backgroundStyle: 'flat',
        typography: {
          fontFamily: {
            heading: aiDocument.theme.typography.fontFamilyHeading,
            body: aiDocument.theme.typography.fontFamily,
          },
          baseSize: aiDocument.theme.typography.baseFontSize,
          headingScale: {
            h1: '2.5rem',
            h2: '2rem',
            h3: '1.75rem',
            h4: '1.5rem',
            h5: '1.25rem',
            h6: '1rem',
          },
        },
      },
      pages: [
        {
          id: 'home',
          name: aiDocument.meta.title || 'Home',
          slug: 'home',
          structure: aiDocument.structure as any,
        },
      ],
    }

    // Carregar o documento no editor
    if (loadDocument) {
      loadDocument(editorDocument)
    }

    // Fechar o painel de IA
    setShowAIAgent(false)
    setSelectedBlockId(null)
  }

  // Handler para quando IA gera patches (modo edição rápida)
  const handleAIPatches = (patches: APIPatchOperation[]) => {
    console.log('============================================')
    console.log('[AI Patches] INICIANDO APLICAÇÃO DE PATCHES')
    console.log('[AI Patches] Patches recebidos:', JSON.stringify(patches, null, 2))

    // Converter patches do formato AI para o formato do Editor
    const convertedPatches: Patch = patches.map(patch => {
      let path = patch.path
      
      // Converter /structure/N para /pages/0/structure/N
      if (path.startsWith('/structure')) {
        path = `/pages/0${path}`
      }
      
      // Corrigir caminho de props - a IA pode enviar /structure/0/bg mas deveria ser /structure/0/props/bg
      // Detectar se está tentando acessar uma prop diretamente no bloco
      const structureMatch = path.match(/^\/pages\/0\/structure\/(\d+)\/([^/]+)$/)
      if (structureMatch) {
        const [, index, propName] = structureMatch
        // Se não é id, type ou props, provavelmente é uma prop que deveria estar em props/
        if (!['id', 'type', 'props'].includes(propName)) {
          path = `/pages/0/structure/${index}/props/${propName}`
          console.log(`[AI Patches] Corrigindo path: ${patch.path} -> ${path}`)
        }
      }
      
      // Converter /theme/colors/background para /theme/colors/bg
      if (path === '/theme/colors/background') {
        path = '/theme/colors/bg'
      }
      // Converter /theme/colors/textMuted para /theme/colors/mutedText
      if (path === '/theme/colors/textMuted') {
        path = '/theme/colors/mutedText'
      }
      
      // Retornar com tipo correto para o engine
      if (patch.op === 'add') {
        return { op: 'add' as const, path, value: patch.value }
      } else if (patch.op === 'remove') {
        return { op: 'remove' as const, path }
      } else if (patch.op === 'replace') {
        return { op: 'replace' as const, path, value: patch.value }
      } else if (patch.op === 'move') {
        return { op: 'move' as const, path, from: patch.from! }
      } else if (patch.op === 'copy') {
        return { op: 'copy' as const, path, from: patch.from! }
      } else {
        return { op: 'test' as const, path, value: patch.value }
      }
    })

    console.log('[AI Patches] Patches convertidos:', JSON.stringify(convertedPatches, null, 2))

    // Aplicar patches usando applyChange (atualização suave com histórico)
    try {
      applyChange(convertedPatches, 'AI Edit')
      console.log('[AI Patches] Patches aplicados com sucesso via applyChange!')
    } catch (err) {
      console.error('[AI Patches] Erro ao aplicar patches:', err)
    }

    // NÃO fechar o painel de IA - manter o chat aberto
    console.log('[AI Patches] FIM - mantendo chat aberto')
    console.log('============================================')
  }

  return (
    <div className="h-[91vh] max-h-[91vh] flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        history={history}
        isSaving={isSaving}
        showAIAgent={showAIAgent}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onPublish={onPublish ? handlePublish : undefined}
        onReset={resetToTemplate}
        onToggleAI={() => {
          setShowAIAgent(!showAIAgent)
          if (!showAIAgent) {
            setSelectedBlockId(null)
          }
        }}
      />

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden min-h-0 max-h-full">
        {/* Left: Block Selector / Palette */}
        <LeftPanel
          showPalette={showPalette}
          setShowPalette={setShowPalette}
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          isPaletteSelected={isPaletteSelected}
          onSelectBlock={setSelectedBlockId}
          onDeleteBlock={handleDeleteBlock}
          onAddBlock={handleAddBlock}
        />

        {/* Center: Preview */}
        <CenterPanel
          document={document}
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          onBlockClick={setSelectedBlockId}
        />

        {/* Right: Editor Panel */}
        <RightPanel
          isPaletteSelected={isPaletteSelected}
          selectedBlock={selectedBlock}
          showAIAgent={showAIAgent}
          aiEndpoint={aiEndpoint}
          aiAuthToken={aiAuthToken}
          currentDocument={currentPage ? convertToAIDocument(document, currentPage) : undefined}
          onPaletteChange={handlePaletteChange}
          onUpdateBlock={handleUpdateBlock}
          onAIGenerate={handleAIGenerate}
          onApplyPatches={handleAIPatches}
          onCloseAI={() => setShowAIAgent(false)}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

function Toolbar({
  history,
  isSaving,
  showAIAgent,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onReset,
  onToggleAI,
}: {
  history: any
  isSaving: boolean
  showAIAgent: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onPublish?: () => void
  onReset: () => void
  onToggleAI: () => void
}) {
  return (
    <div className="h-12 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4">
      <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">
        Editor de Landing Page
      </h1>

      {/* Center: AI Agent Button */}
      <button
        onClick={onToggleAI}
        className={cn(
          'h-8 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer',
          'flex items-center gap-2',
          showAIAgent
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/25',
          'hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        <Sparkles className="w-4 h-4" />
        Agente Gerador de Sites
      </button>

      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={onUndo}
          disabled={!history.canUndo()}
          title="Desfazer"
          icon={<Undo className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={onRedo}
          disabled={!history.canRedo()}
          title="Refazer"
          icon={<Redo className="w-4 h-4" />}
        />
        
        {/* Reset */}
        <ToolbarButton
          onClick={onReset}
          title="Resetar Template"
          icon={<RotateCcw className="w-4 h-4" />}
        />

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            'h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer',
            'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]'
          )}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>

        {/* Publish */}
        {onPublish && (
          <button
            onClick={onPublish}
            disabled={isSaving}
            className={cn(
              'h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer',
              'border-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-transparent',
              'hover:bg-purple-50 dark:hover:bg-purple-950/50',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Publicar
          </button>
        )}
      </div>
    </div>
  )
}

function ToolbarButton({
  onClick,
  disabled,
  title,
  icon,
}: {
  onClick: () => void
  disabled?: boolean
  title: string
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 rounded-md text-xs font-medium transition-all cursor-pointer',
        'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'flex items-center justify-center'
      )}
      title={title}
    >
      {icon}
    </button>
  )
}

function LeftPanel({
  showPalette,
  setShowPalette,
  currentPage,
  selectedBlockId,
  isPaletteSelected,
  onSelectBlock,
  onDeleteBlock,
  onAddBlock,
}: {
  showPalette: boolean
  setShowPalette: (show: boolean) => void
  currentPage: any
  selectedBlockId: string | null
  isPaletteSelected: boolean
  onSelectBlock: (id: string | null) => void
  onDeleteBlock: (id: string) => void
  onAddBlock: (type: any, parentId?: string, position?: number) => void
}) {
  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 h-9">
          <button
            onClick={() => {
              setShowPalette(false)
              onSelectBlock(null)
            }}
            className={cn(
              'text-xs font-semibold transition-all',
              !showPalette
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            Blocos
          </button>
          <button
            onClick={() => {
              setShowPalette(true)
              onSelectBlock(null)
            }}
            className={cn(
              'text-xs font-semibold transition-all',
              showPalette
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Content */}
      {showPalette ? (
        <BlockPalette
          onAddBlock={onAddBlock}
          selectedParentBlockId={selectedBlockId}
        />
      ) : (
        currentPage && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Ação rápida: Paletas */}
            <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => onSelectBlock('palette-selector')}
                className={cn(
                  'w-full px-2 py-1.5 text-xs font-medium rounded transition-all',
                  isPaletteSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                )}
              >
                🎨 Paletas de Cores
              </button>
            </div>
            <BlockSelector
              structure={currentPage.structure?.filter((b: any) => b?.id && b?.type) || []}
              selectedBlockId={selectedBlockId}
              onSelectBlock={onSelectBlock}
              onDeleteBlock={onDeleteBlock}
            />
          </div>
        )
      )}
    </div>
  )
}

function CenterPanel({
  document,
  currentPage,
  selectedBlockId,
  onBlockClick,
}: {
  document: SiteDocumentV2
  currentPage: any
  selectedBlockId: string | null
  onBlockClick: (id: string) => void
}) {
  return (
    <div className="flex-1 overflow-hidden bg-gray-50/30 dark:bg-gray-900/30">
      {currentPage ? (
        <PreviewV2
          document={document}
          pageId="home"
          style={{ height: '100%' }}
          onBlockClick={onBlockClick}
          selectedBlockId={selectedBlockId}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Nenhuma página encontrada</div>
        </div>
      )}
    </div>
  )
}

function RightPanel({
  isPaletteSelected,
  selectedBlock,
  showAIAgent,
  aiEndpoint,
  aiAuthToken,
  currentDocument,
  onPaletteChange,
  onUpdateBlock,
  onAIGenerate,
  onApplyPatches,
  onCloseAI,
}: {
  isPaletteSelected: boolean
  selectedBlock: any
  showAIAgent: boolean
  aiEndpoint?: string
  aiAuthToken?: string
  currentDocument?: AIDocumentV2
  onPaletteChange: (palette: any) => void
  onUpdateBlock: (updates: Record<string, any>) => void
  onAIGenerate: (document: AIDocumentV2) => void
  onApplyPatches: (patches: APIPatchOperation[]) => void
  onCloseAI: () => void
}) {
  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      {showAIAgent ? (
        <AIAgentPanel
          onGenerate={onAIGenerate}
          onApplyPatches={onApplyPatches}
          apiEndpoint={aiEndpoint}
          authToken={aiAuthToken}
          onClose={onCloseAI}
          currentDocument={currentDocument}
        />
      ) : isPaletteSelected ? (
        <div className="p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Escolha uma Paleta de Cores
          </h2>
          <PaletteSelector
            selectedPalette={undefined}
            onPaletteChange={onPaletteChange}
          />
        </div>
      ) : selectedBlock ? (
        <div className="overflow-y-auto overflow-x-hidden flex-1">
          <BlockPropertyEditor
            block={selectedBlock}
            onUpdate={onUpdateBlock}
          />
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Selecione um bloco para editar
        </div>
      )}
    </div>
  )
}
