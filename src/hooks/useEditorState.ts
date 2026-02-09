/**
 * useEditorState Hook
 * Gerencia todo o estado do editor de landing pages
 */

import { useState, useMemo, useCallback } from "react";
import {
  SiteDocument,
  SitePage,
  Block,
  BlockType,
  HistoryManager,
  createHistoryManager,
  applyPatch,
  PatchBuilder,
  componentRegistry,
  pluginRegistry,
} from "../engine";
import {
  findBlockInStructure,
  cleanDocumentStructure,
} from "../utils/blockUtils";
import { logger } from "../utils/logger";
import {
  createDefaultPageStructure,
  generateUniqueSlug,
} from "../utils/pageTemplateFactory";
import { useNavbarAutoSync } from "./useNavbarAutoSync";

interface UseEditorStateOptions {
  initialData?: SiteDocument | null;
}

interface UseEditorStateReturn {
  // Estado
  document: SiteDocument | null;
  currentPageId: string;
  currentPage: ReturnType<typeof useMemo>;
  selectedBlockId: string | null;
  selectedBlock: Block | null;
  history: HistoryManager;

  // Ações
  setDocument: (doc: SiteDocument) => void;
  loadDocument: (doc: SiteDocument) => void;
  setCurrentPageId: (id: string) => void;
  addPage: (pageId: string, name: string, slug: string) => void;
  removePage: (pageId: string) => void;
  setSelectedBlockId: (id: string | null) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleAddBlock: (
    blockType: BlockType,
    parentBlockId?: string,
    position?: number,
  ) => void;
  handleDeleteBlock: (blockId: string) => void;
  handleUpdateBlock: (updates: Record<string, any>) => void;
  applyChange: (patch: any[], description?: string) => void;
  resetToTemplate: () => void;

  // Estado derivado
  isPaletteSelected: boolean;
  isTemplateSelected: boolean;
  canRemovePage: (pageId: string) => boolean;

  // Paleta
  selectedPalette: string | null;
  setSelectedPalette: (name: string | null) => void;

  // Plugins
  activePlugins: string[];
  activatePlugin: (pluginId: string) => void;
  deactivatePlugin: (pluginId: string) => void;
}

/**
 * Hook para gerenciar estado do editor
 */
export function useEditorState(
  options: UseEditorStateOptions = {},
): UseEditorStateReturn {
  const { initialData } = options;

  // Sem initialData: documento null até o usuário escolher um template
  const initialDocument = useMemo(() => {
    if (initialData) {
      return initialData;
    }
    return null;
  }, [initialData]);

  // Estados
  const [document, setDocument] = useState<SiteDocument | null>(
    initialDocument,
  );
  const [currentPageId, setCurrentPageIdState] = useState<string>("home");
  const [history] = useState<HistoryManager>(() => createHistoryManager(50));
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedPalette, setSelectedPaletteState] = useState<string | null>(null);

  // Aplicar mudanças via patches (precisa ser declarado antes de useNavbarAutoSync)
  const applyChange = useCallback(
    (patch: any[], description?: string) => {
      if (!document) return;
      if (!patch?.length) return;

      // IMPORTANTE: Capturar histórico ANTES de aplicar patch
      history.push(document, patch, description || "User edit");

      const result = applyPatch(document, patch);
      logger.debug("[applyChange] Patch result:", result);

      if (result.success && result.document) {
        const cleanedDocument = cleanDocumentStructure(result.document);
        setDocument(cleanedDocument);
      } else {
        // Se falhar, reverter histórico
        if (history.canUndo()) {
          const undoResult = history.undo(document);
          if (!undoResult.success) {
            logger.error("[applyChange] Failed to undo after patch error");
          }
        }
      }
    },
    [document, history],
  );

  // Hook de sincronização automática do navbar
  useNavbarAutoSync(document, applyChange);

  // Página atual (derivada de currentPageId; sem navegação, só edição)
  const currentPage = useMemo(() => {
    if (!document?.pages?.length) return null;
    const page =
      document.pages.find((p) => p?.id === currentPageId) ?? document.pages[0];
    if (page && !Array.isArray(page.structure)) {
      page.structure = [];
    }
    return page;
  }, [document, currentPageId]);

  // Bloco selecionado
  const selectedBlock = useMemo(() => {
    if (!selectedBlockId || !currentPage) return null;
    if (
      selectedBlockId === "palette-selector" ||
      selectedBlockId === "template-selector"
    ) {
      return null;
    }
    return findBlockInStructure(currentPage.structure, selectedBlockId);
  }, [selectedBlockId, currentPage]);

  // Estados derivados
  const isPaletteSelected = selectedBlockId === "palette-selector";
  const isTemplateSelected = selectedBlockId === "template-selector";

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (!document) return;
    const result = history.undo(document);
    if (result.success && result.document) {
      setDocument(result.document);
    }
  }, [document, history]);

  const handleRedo = useCallback(() => {
    if (!document) return;
    const result = history.redo(document);
    if (result.success && result.document) {
      setDocument(result.document);
    }
  }, [document, history]);

  // Criar bloco
  const createBlockFromType = useCallback(
    (blockType: BlockType): Block | null => {
      const definition = componentRegistry.get(blockType);
      if (!definition) {
        logger.error(
          `[createBlockFromType] Block type "${blockType}" not found in registry`,
        );
        return null;
      }

      const id = `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        id,
        type: blockType,
        props: {
          ...definition.defaultProps,
          ...(definition.defaultChildren && {
            children: definition.defaultChildren,
          }),
        },
      } as Block;
    },
    [],
  );

  // Adicionar bloco (mantido para API; editor template-based não exibe paleta de blocos)
  const handleAddBlock = useCallback(
    (blockType: BlockType, parentBlockId?: string, position?: number) => {
      if (!document || !currentPage) return;

      try {
        const newBlock = createBlockFromType(blockType);
        if (!newBlock) {
          logger.error("[handleAddBlock] Failed to create block:", blockType);
          return;
        }

        const patch = PatchBuilder.addBlock(
          document,
          currentPage.id,
          newBlock,
          parentBlockId,
          position,
        );

        applyChange(patch, `Add ${blockType} block`);
        setSelectedBlockId(newBlock.id);
      } catch (error) {
        logger.error("[handleAddBlock] Error adding block:", error);
      }
    },
    [currentPage, document, createBlockFromType, applyChange],
  );

  // Deletar bloco
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (!document || !currentPage) return;

      try {
        if (selectedBlockId === blockId) {
          setSelectedBlockId(null);
        }
        const patch = PatchBuilder.removeBlock(
          document,
          currentPage.id,
          blockId,
        );
        applyChange(patch, "Delete block");
      } catch (error) {
        logger.error("Error deleting block:", error);
        if (selectedBlockId === blockId) {
          setSelectedBlockId(null);
        }
      }
    },
    [document, currentPage, selectedBlockId, applyChange],
  );

  // Atualizar propriedades do bloco
  const handleUpdateBlock = useCallback(
    (updates: Record<string, any>) => {
      if (!document || !selectedBlockId || !currentPage) return;
      if (
        selectedBlockId === "palette-selector" ||
        selectedBlockId === "template-selector"
      )
        return;

      try {
        const patch = PatchBuilder.updateBlockProps(
          document,
          currentPage.id,
          selectedBlockId,
          updates,
        );
        if (patch?.length) {
          applyChange(patch, "Update block properties");
        }
      } catch (error) {
        logger.error("Error updating block:", error);
      }
    },
    [document, selectedBlockId, currentPage, applyChange],
  );

  const setSelectedPalette = useCallback((name: string | null) => {
    setSelectedPaletteState(name);
  }, []);

  // Voltar ao seletor de templates (document = null)
  const resetToTemplate = useCallback(() => {
    setDocument(null);
    setCurrentPageIdState("home");
    history.clear();
    setSelectedBlockId(null);
    setSelectedPaletteState(null);
  }, [history]);

  // Carregar um documento completo (ex: gerado por IA)
  const loadDocument = useCallback(
    (doc: SiteDocument) => {
      setDocument(doc);
      setCurrentPageIdState(doc.pages?.[0]?.id ?? "home");
      history.clear();
      setSelectedBlockId(null);
      if (doc.pages?.[0]?.structure?.length > 0) {
        setSelectedBlockId(doc.pages[0].structure[0].id);
      }
    },
    [history],
  );

  const setCurrentPageId = useCallback((id: string) => {
    setCurrentPageIdState(id);
    setSelectedBlockId(null);
  }, []);

  // Adicionar página (ex.: Avisos) com estrutura mínima
  const addPage = useCallback(
    (pageId: string, name: string, slug: string) => {
      if (!document) return;
      const existing = document.pages.find((p) => p.id === pageId);
      if (existing) return;

      // Gera slug único se necessário
      const uniqueSlug = generateUniqueSlug(slug, document.pages);

      // Cria página com estrutura padrão (navbar + conteúdo + footer)
      const newPage: SitePage = createDefaultPageStructure(
        pageId,
        name,
        uniqueSlug,
        [...document.pages, { id: pageId, name, slug: uniqueSlug, structure: [] }]
      );

      // Patch para adicionar página
      const addPagePatch = PatchBuilder.addPage(document, newPage);

      // Aplicar mudança - o hook useNavbarAutoSync irá detectar e sincronizar automaticamente
      applyChange(addPagePatch, `Adicionar página ${name}`);
      setCurrentPageIdState(pageId);
      setSelectedBlockId(null);
    },
    [document, applyChange],
  );

  // Remover página (não permite remover home; exige pelo menos uma página)
  const removePage = useCallback(
    (pageId: string) => {
      if (!document) return;
      if (pageId === "home") return;
      if (document.pages.length <= 1) return;

      const removePagePatch = PatchBuilder.removePage(document, pageId);

      // Aplicar mudança - o hook useNavbarAutoSync irá detectar e sincronizar automaticamente
      applyChange(removePagePatch, "Remover página");

      if (currentPageId === pageId) {
        const updatedPages = document.pages.filter(p => p.id !== pageId);
        setCurrentPageIdState(updatedPages[0]?.id ?? "home");
      }
      setSelectedBlockId(null);
    },
    [document, currentPageId, applyChange],
  );

  const canRemovePage = useCallback(
    (pageId: string) => {
      if (!document) return false;
      return pageId !== "home" && document.pages.length > 1;
    },
    [document],
  );

  // Plugins: estado derivado
  const activePlugins = useMemo(
    () => document?.plugins?.active ?? [],
    [document],
  );

  // Ativar plugin
  const activatePlugin = useCallback(
    (pluginId: string) => {
      if (!document) return;
      const updatedDocument = pluginRegistry.activate(document, pluginId);
      if (updatedDocument !== document) {
        setDocument(updatedDocument);
      }
    },
    [document],
  );

  // Desativar plugin
  const deactivatePlugin = useCallback(
    (pluginId: string) => {
      if (!document) return;
      const updatedDocument = pluginRegistry.deactivate(document, pluginId);
      if (updatedDocument !== document) {
        setDocument(updatedDocument);
      }
    },
    [document],
  );

  return {
    // Estado
    document,
    currentPageId,
    currentPage,
    selectedBlockId,
    selectedBlock,
    history,

    // Ações
    setDocument,
    loadDocument,
    setCurrentPageId,
    addPage,
    removePage,
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
    canRemovePage,

    // Paleta
    selectedPalette,
    setSelectedPalette,

    // Plugins
    activePlugins,
    activatePlugin,
    deactivatePlugin,
  };
}
