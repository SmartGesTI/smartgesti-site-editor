/**
 * useEditorState Hook
 * Gerencia todo o estado do editor de landing pages
 */

import { useState, useMemo, useCallback } from 'react'
import {
  SiteDocumentV2,
  Block,
  BlockType,
  HistoryManager,
  createHistoryManager,
  applyPatch,
  PatchBuilder,
  generateCompleteLandingPage,
  componentRegistry,
} from '../engine'
import { findBlockInStructure, cleanDocumentStructure } from '../utils/blockUtils'

interface UseEditorStateOptions {
  initialData?: SiteDocumentV2
}

interface UseEditorStateReturn {
  // Estado
  document: SiteDocumentV2
  currentPage: ReturnType<typeof useMemo>
  selectedBlockId: string | null
  selectedBlock: Block | null
  history: HistoryManager
  
  // Ações
  setDocument: (doc: SiteDocumentV2) => void
  loadDocument: (doc: SiteDocumentV2) => void
  setSelectedBlockId: (id: string | null) => void
  handleUndo: () => void
  handleRedo: () => void
  handleAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void
  handleDeleteBlock: (blockId: string) => void
  handleUpdateBlock: (updates: Record<string, any>) => void
  applyChange: (patch: any[], description?: string) => void
  resetToTemplate: () => void
  
  // Estado derivado
  isPaletteSelected: boolean
  isTemplateSelected: boolean
}

/**
 * Hook para gerenciar estado do editor
 */
export function useEditorState(options: UseEditorStateOptions = {}): UseEditorStateReturn {
  const { initialData } = options
  
  // Inicializar documento - gera template completo por padrão
  const initialDocument = useMemo(() => {
    if (initialData) {
      return initialData
    }
    // Gerar landing page completa por padrão
    return generateCompleteLandingPage({
      name: 'Landing Page',
      title: 'Bem-vindo à Nossa Solução',
      subtitle: 'Transforme seu negócio com tecnologia de ponta',
      description: 'A solução completa para suas necessidades',
      primaryColor: '#3b82f6',
      theme: 'modern',
    })
  }, [initialData])

  // Estados
  const [document, setDocument] = useState<SiteDocumentV2>(initialDocument)
  const [history] = useState<HistoryManager>(() => createHistoryManager(50))
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  // Página atual
  const currentPage = useMemo(() => {
    if (!document?.pages?.length) return null
    const page = document.pages.find((p) => p?.id === 'home') || document.pages[0]
    if (page && !Array.isArray(page.structure)) {
      page.structure = []
    }
    return page
  }, [document])

  // Bloco selecionado
  const selectedBlock = useMemo(() => {
    if (!selectedBlockId || !currentPage) return null
    if (selectedBlockId === 'palette-selector' || selectedBlockId === 'template-selector') {
      return null
    }
    return findBlockInStructure(currentPage.structure, selectedBlockId)
  }, [selectedBlockId, currentPage])

  // Estados derivados
  const isPaletteSelected = selectedBlockId === 'palette-selector'
  const isTemplateSelected = selectedBlockId === 'template-selector'

  // Aplicar mudanças via patches
  const applyChange = useCallback((patch: any[], description?: string) => {
    console.log('[applyChange] Applying patch:', patch, 'Description:', description)
    
    if (!patch?.length) {
      console.warn('[applyChange] Empty patch, skipping')
      return
    }

    console.log('[applyChange] Document before:', document)
    console.log('[applyChange] Document before structure length:', document.pages[0]?.structure?.length)
    const result = applyPatch(document, patch)
    console.log('[applyChange] Patch result:', result)
    console.log('[applyChange] Result document structure length:', result.document?.pages[0]?.structure?.length)
    
    if (result.success && result.document) {
      console.log('[applyChange] Result doc structure:', result.document.pages[0]?.structure?.map((b: any) => b.id))
      const cleanedDocument = cleanDocumentStructure(result.document)
      console.log('[applyChange] Cleaned document:', cleanedDocument)
      console.log('[applyChange] Cleaned structure:', cleanedDocument.pages[0]?.structure?.map((b: any) => b.id))
      console.log('[applyChange] Structure length:', cleanedDocument.pages[0]?.structure?.length)
      setDocument(cleanedDocument)
      history.push(patch, description || 'User edit')
      console.log('[applyChange] Document updated successfully')
    } else {
      console.error('[applyChange] Failed to apply patch:', result.errors)
    }
  }, [document, history])

  // Undo/Redo
  const handleUndo = useCallback(() => {
    const result = history.undo(document)
    if (result.success && result.document) {
      setDocument(result.document)
    }
  }, [document, history])

  const handleRedo = useCallback(() => {
    const result = history.redo(document)
    if (result.success && result.document) {
      setDocument(result.document)
    }
  }, [document, history])

  // Criar bloco
  const createBlockFromType = useCallback((blockType: BlockType): Block | null => {
    const definition = componentRegistry.get(blockType)
    if (!definition) {
      console.error(`[createBlockFromType] Block type "${blockType}" not found in registry`)
      console.log('[createBlockFromType] Available types:', componentRegistry.getAll().map(d => d.type))
      return null
    }

    const id = `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return {
      id,
      type: blockType,
      props: {
        ...definition.defaultProps,
        ...(definition.defaultChildren && { children: definition.defaultChildren }),
      },
    } as Block
  }, [])

  // Adicionar bloco
  const handleAddBlock = useCallback((
    blockType: BlockType,
    parentBlockId?: string,
    position?: number
  ) => {
    console.log('[handleAddBlock] Adding block:', blockType, 'to parent:', parentBlockId)
    
    if (!currentPage) {
      console.error('[handleAddBlock] No current page')
      return
    }

    try {
      const newBlock = createBlockFromType(blockType)
      if (!newBlock) {
        console.error('[handleAddBlock] Failed to create block of type:', blockType)
        return
      }
      
      console.log('[handleAddBlock] Created block:', newBlock.id)
      const patch = PatchBuilder.addBlock(document, currentPage.id, newBlock, parentBlockId, position)
      console.log('[handleAddBlock] Patch:', patch)
      
      applyChange(patch, `Add ${blockType} block`)
      setSelectedBlockId(newBlock.id)
      console.log('[handleAddBlock] Block added successfully')
    } catch (error) {
      console.error('[handleAddBlock] Error adding block:', error)
    }
  }, [currentPage, document, createBlockFromType, applyChange])

  // Deletar bloco
  const handleDeleteBlock = useCallback((blockId: string) => {
    if (!currentPage) return

    try {
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null)
      }
      const patch = PatchBuilder.removeBlock(document, currentPage.id, blockId)
      applyChange(patch, 'Delete block')
    } catch (error) {
      console.error('Error deleting block:', error)
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null)
      }
    }
  }, [currentPage, document, selectedBlockId, applyChange])

  // Atualizar propriedades do bloco
  const handleUpdateBlock = useCallback((updates: Record<string, any>) => {
    if (!selectedBlockId || !currentPage) return
    if (selectedBlockId === 'palette-selector' || selectedBlockId === 'template-selector') return

    try {
      const patch = PatchBuilder.updateBlockProps(document, currentPage.id, selectedBlockId, updates)
      if (patch?.length) {
        applyChange(patch, 'Update block properties')
      }
    } catch (error) {
      console.error('Error updating block:', error)
    }
  }, [selectedBlockId, currentPage, document, applyChange])

  // Resetar para template padrão
  const resetToTemplate = useCallback(() => {
    const newDoc = generateCompleteLandingPage({
      name: 'Landing Page',
      title: 'Bem-vindo à Nossa Solução',
      subtitle: 'Transforme seu negócio com tecnologia de ponta',
      description: 'A solução completa para suas necessidades',
      primaryColor: '#3b82f6',
      theme: 'modern',
    })
    setDocument(newDoc)
    history.clear()
    if (newDoc.pages[0]?.structure.length > 0) {
      setSelectedBlockId(newDoc.pages[0].structure[0].id)
    }
  }, [history])

  // Carregar um documento completo (ex: gerado por IA)
  const loadDocument = useCallback((doc: SiteDocumentV2) => {
    setDocument(doc)
    history.clear()
    setSelectedBlockId(null)
    // Selecionar o primeiro bloco se existir
    if (doc.pages?.[0]?.structure?.length > 0) {
      setSelectedBlockId(doc.pages[0].structure[0].id)
    }
  }, [history])

  return {
    // Estado
    document,
    currentPage,
    selectedBlockId,
    selectedBlock,
    history,
    
    // Ações
    setDocument,
    loadDocument,
    setSelectedBlockId,
    handleUndo,
    handleRedo,
    handleAddBlock,
    handleDeleteBlock,
    handleUpdateBlock,
    applyChange,
    resetToTemplate,
    
    // Estado derivado
    isPaletteSelected,
    isTemplateSelected,
  }
}
