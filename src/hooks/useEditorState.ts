/**
 * useEditorState Hook
 * Gerencia todo o estado do editor de landing pages
 */

import { useState, useMemo, useCallback } from "react";
import {
  SiteDocumentV2,
  SitePage,
  Block,
  BlockType,
  HistoryManager,
  createHistoryManager,
  applyPatch,
  PatchBuilder,
  componentRegistry,
} from "../engine";
import {
  findBlockInStructure,
  cleanDocumentStructure,
} from "../utils/blockUtils";

interface UseEditorStateOptions {
  initialData?: SiteDocumentV2 | null;
}

interface UseEditorStateReturn {
  // Estado
  document: SiteDocumentV2 | null;
  currentPageId: string;
  currentPage: ReturnType<typeof useMemo>;
  selectedBlockId: string | null;
  selectedBlock: Block | null;
  history: HistoryManager;

  // Ações
  setDocument: (doc: SiteDocumentV2) => void;
  loadDocument: (doc: SiteDocumentV2) => void;
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
  const [document, setDocument] = useState<SiteDocumentV2 | null>(
    initialDocument,
  );
  const [currentPageId, setCurrentPageIdState] = useState<string>("home");
  const [history] = useState<HistoryManager>(() => createHistoryManager(50));
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

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

  // Aplicar mudanças via patches
  const applyChange = useCallback(
    (patch: any[], description?: string) => {
      if (!document) return;
      if (!patch?.length) return;

      const result = applyPatch(document, patch);
      console.log("[applyChange] Patch result:", result);
      console.log(
        "[applyChange] Result document structure length:",
        result.document?.pages[0]?.structure?.length,
      );

      if (result.success && result.document) {
        const cleanedDocument = cleanDocumentStructure(result.document);
        setDocument(cleanedDocument);
        history.push(patch, description || "User edit");
      }
    },
    [document, history],
  );

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
        console.error(
          `[createBlockFromType] Block type "${blockType}" not found in registry`,
        );
        console.log(
          "[createBlockFromType] Available types:",
          componentRegistry.getAll().map((d) => d.type),
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
          console.error(
            "[handleAddBlock] Failed to create block of type:",
            blockType,
          );
          return;
        }

        console.log("[handleAddBlock] Created block:", newBlock.id);
        const patch = PatchBuilder.addBlock(
          document,
          currentPage.id,
          newBlock,
          parentBlockId,
          position,
        );
        console.log("[handleAddBlock] Patch:", patch);

        applyChange(patch, `Add ${blockType} block`);
        setSelectedBlockId(newBlock.id);
        console.log("[handleAddBlock] Block added successfully");
      } catch (error) {
        console.error("[handleAddBlock] Error adding block:", error);
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
        console.error("Error deleting block:", error);
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
        console.error("Error updating block:", error);
      }
    },
    [document, selectedBlockId, currentPage, applyChange],
  );

  // Voltar ao seletor de templates (document = null)
  const resetToTemplate = useCallback(() => {
    setDocument(null);
    setCurrentPageIdState("home");
    history.clear();
    setSelectedBlockId(null);
  }, [history]);

  // Carregar um documento completo (ex: gerado por IA)
  const loadDocument = useCallback(
    (doc: SiteDocumentV2) => {
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

      // Importação dinâmica das funções
      const {
        createDefaultPageStructure,
        generateUniqueSlug
      } = require("../utils/pageTemplateFactory");
      const { syncNavbarLinks } = require("../utils/navbarSync");

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

      // Patch para sincronizar navbars (com nova página incluída)
      const updatedDoc = { ...document, pages: [...document.pages, newPage] };
      const navbarSyncPatches = syncNavbarLinks(updatedDoc);

      // Combinar patches
      const combined = [...addPagePatch, ...navbarSyncPatches];

      applyChange(combined, `Adicionar página ${name}`);
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

      // Importação dinâmica
      const { syncNavbarLinks } = require("../utils/navbarSync");

      const removePagePatch = PatchBuilder.removePage(document, pageId);

      // Sincronizar navbars (sem a página removida)
      const updatedPages = document.pages.filter(p => p.id !== pageId);
      const navbarSyncPatches = syncNavbarLinks({
        ...document,
        pages: updatedPages
      });

      const combined = [...removePagePatch, ...navbarSyncPatches];
      applyChange(combined, "Remover página");

      if (currentPageId === pageId) {
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
  };
}
