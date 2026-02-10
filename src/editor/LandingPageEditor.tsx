/**
 * Landing Page Editor
 * Editor de landing pages usando block engine
 */

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { TemplatePicker } from "./TemplatePicker";
import { Toolbar, LeftPanel, CenterPanel, RightPanel } from "./components";
import { useEditorState } from "../hooks/useEditorState";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SiteDocument, PatchBuilder, Block } from "../engine";
import { getTemplate, templateDefaultPalette } from "../shared/templates";
import type { TemplateId } from "../shared/templates";
import { findPaletteByName } from "./PaletteSelector";
import { sharedTemplateToEngineDocument } from "../utils/sharedTemplateToEngine";
import { findBlockInStructure } from "../utils/blockUtils";
import { derivePaletteColors } from "../utils/colorUtils";
import { logger } from "../utils/logger";
import { processBlockDataURLs } from "../utils/dataURLUtils";

// ============================================================================
// Types
// ============================================================================

export interface UploadConfig {
  tenantId?: string;
  schoolId?: string;
  siteId?: string | null;
  authToken?: string;
}

export interface LandingPageEditorProps {
  initialData?: SiteDocument;
  /** ID do template a carregar quando não houver initialData (ex.: "escola-edvi") */
  defaultTemplateId?: TemplateId;
  onSave?: (data: SiteDocument) => Promise<void>;
  onPublish?: (data: SiteDocument) => Promise<void>;
  /** Configuração para upload seguro de imagens/vídeos */
  uploadConfig?: UploadConfig;
}

// ============================================================================
// Component
// ============================================================================

export function LandingPageEditor({
  initialData,
  defaultTemplateId,
  onSave,
  onPublish,
  uploadConfig,
}: LandingPageEditorProps) {
  // Hook de estado do editor (edição por páginas; sem navegação)
  const {
    document,
    currentPageId,
    currentPage,
    selectedBlockId,
    selectedBlock,
    history,
    setCurrentPageId,
    addPage,
    removePage,
    canRemovePage,
    setSelectedBlockId,
    handleUndo,
    handleRedo,
    handleDeleteBlock,
    handleUpdateBlock,
    applyChange,
    resetToTemplate,
    isPaletteSelected,
    loadDocument,
    selectedPalette,
    setSelectedPalette,
    activePlugins,
    activatePlugin,
    deactivatePlugin,
  } = useEditorState({ initialData });

  // Estado local da UI
  const [isSaving, setIsSaving] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId | null>(
    null,
  );
  const [focusedGroup, setFocusedGroup] = useState<string | null>(null);
  const [showSelectionOverlay, setShowSelectionOverlay] = useState(false);

  // Carregar template escolhido (converter shared → engine e carregar no editor)
  const handleSelectTemplate = useCallback(
    (templateId: TemplateId) => {
      const sharedDoc = getTemplate(templateId);
      if (!sharedDoc) return;
      const engineDoc = sharedTemplateToEngineDocument(sharedDoc);
      loadDocument(engineDoc);
      setCurrentTemplateId(templateId);

      // Auto-selecionar paleta correspondente ao template
      const paletteName = templateDefaultPalette[templateId];
      if (paletteName) {
        setSelectedPalette(paletteName);
      }
    },
    [loadDocument, setSelectedPalette],
  );

  // Ao montar sem documento: carregar defaultTemplateId se informado
  useEffect(() => {
    if (!document && defaultTemplateId) {
      handleSelectTemplate(defaultTemplateId);
    }
  }, [defaultTemplateId]); // eslint-disable-line react-hooks/exhaustive-deps -- carregar só uma vez quando defaultTemplateId existe

  // Handlers de save/publish
  const handleSave = async () => {
    if (!document || !onSave || !uploadConfig) return;
    setIsSaving(true);
    try {
      // Processar o documento para fazer upload de todos os Data URLs
      const processedPages = await Promise.all(
        (document.pages || []).map(async (page) => ({
          ...page,
          structure: await Promise.all(
            (page.structure || []).map((block) => processBlockDataURLs(block, uploadConfig))
          ),
        }))
      );

      const processedDocument = {
        ...document,
        pages: processedPages,
      };

      await onSave(processedDocument);
    } catch (error) {
      logger.error("Error saving:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!document || !onPublish) return;
    setIsSaving(true);
    try {
      await onPublish(document);
    } catch (error) {
      logger.error("Error publishing:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para atualizar um bloco específico
  const handleUpdateBlockById = useCallback(
    (blockId: string, updates: Record<string, any>) => {
      if (!document || !currentPage) return;
      const pageId = (currentPage as any).id;
      if (!pageId) return;

      try {
        const patch = PatchBuilder.updateBlockProps(
          document,
          pageId,
          blockId,
          updates
        );
        if (patch?.length) {
          applyChange(patch, "Update block properties");
        }
      } catch (error) {
        logger.error("Error updating block:", error);
      }
    },
    [document, currentPage, applyChange]
  );

  // Handler para atualizar paleta de cores
  // Usa derivePaletteColors() para derivar todas as cores e patcha Hero/Navbar/Footer alem do theme
  const handlePaletteChange = useCallback((palette: any) => {
    if (!document) return;
    const derived = derivePaletteColors(palette);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPatches: Array<{ op: "replace"; path: string; value: any }> = [];

    // 1. Theme color updates
    for (const [key, value] of Object.entries(derived.themeColors)) {
      allPatches.push({ op: "replace", path: `/theme/colors/${key}`, value });
    }

    // 2. Block-level patches (todas as paginas)
    // Hero variations that use dark gradient backgrounds
    const darkGradientVariations = new Set([
      "hero-gradient", "hero-parallax", "hero-overlay", "hero-carousel",
    ]);
    // Blog widget types que recebem cores da paleta
    const blogWidgetTypes = new Set([
      "blogCategoryFilter", "blogRecentPosts", "blogTagCloud",
    ]);

    // Recursivamente patcha blog widgets em children de grid/stack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patchNestedBlocks = (blocks: any[], basePath: string) => {
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const bPath = `${basePath}/${i}/props`;
        if (blogWidgetTypes.has(b.type)) {
          allPatches.push(
            { op: "replace", path: `${bPath}/linkColor`, value: derived.themeColors.text },
            { op: "replace", path: `${bPath}/linkHoverColor`, value: derived.themeColors.primary },
          );
        }
        if (Array.isArray(b.props?.children)) {
          patchNestedBlocks(b.props.children, `${bPath}/children`);
        }
      }
    };

    for (let pageIdx = 0; pageIdx < document.pages.length; pageIdx++) {
      const page = document.pages[pageIdx];
      if (!page?.structure) continue;
      for (let blockIdx = 0; blockIdx < page.structure.length; blockIdx++) {
        const block = page.structure[blockIdx];
        const base = `/pages/${pageIdx}/structure/${blockIdx}/props`;

        if (block.type === "hero") {
          const variation = (block.props as any)?.variation || "";
          if (darkGradientVariations.has(variation)) {
            allPatches.push(
              { op: "replace", path: `${base}/background`, value: `linear-gradient(135deg, ${derived.heroGradientStart} 0%, ${derived.heroGradientEnd} 100%)` },
              { op: "replace", path: `${base}/titleColor`, value: derived.heroTitleColor },
              { op: "replace", path: `${base}/subtitleColor`, value: derived.heroSubtitleColor },
              { op: "replace", path: `${base}/descriptionColor`, value: derived.heroDescColor },
            );
          }
        } else if (block.type === "navbar") {
          allPatches.push(
            { op: "replace", path: `${base}/bg`, value: derived.navbarBg },
            { op: "replace", path: `${base}/linkColor`, value: derived.themeColors.menuLinkColor },
            { op: "replace", path: `${base}/linkHoverColor`, value: derived.themeColors.primary },
            { op: "replace", path: `${base}/buttonColor`, value: derived.themeColors.primary },
            { op: "replace", path: `${base}/buttonTextColor`, value: derived.themeColors.primaryText },
          );
        } else if (block.type === "footer") {
          allPatches.push(
            { op: "replace", path: `${base}/linkHoverColor`, value: derived.footerLinkHover },
          );
        }
      }
      // Patchar blog widgets aninhados (dentro de grid/stack children)
      patchNestedBlocks(page.structure, `/pages/${pageIdx}/structure`);
    }

    applyChange(allPatches, "Update color palette");
    setSelectedPalette(palette.name ?? null);
  }, [document, applyChange, setSelectedPalette]);

  // Handler para clique no preview (com grupo opcional para scroll-to-group)
  const handleBlockClick = useCallback((blockId: string, group?: string) => {
    setSelectedBlockId(blockId);
    setFocusedGroup(group || null);
  }, [setSelectedBlockId]);

  // Limpar focusedGroup quando o bloco selecionado muda (via seleção no painel esquerdo, etc.)
  // Nota: handleBlockClick já define o focusedGroup corretamente quando vem do preview

  // No editor: cliques em links no preview não navegam; trocam a página em edição
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onSave: handleSave,
    onDelete: () => {
      if (selectedBlockId) {
        handleDeleteBlock(selectedBlockId);
      }
    },
    onDeselect: () => setSelectedBlockId(null),
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "editor-navigate" || !event.data.href) return;
      const href = String(event.data.href);
      if (!document) return;
      // Links internos: /site/p/:slug ou /p/:slug
      const match = href.match(/^(?:\/site)?\/p\/([^#?]+)/);
      if (match) {
        const slug = match[1];
        const page = document.pages.find((p) => p.slug === slug);
        if (page) setCurrentPageId(page.id);
        return;
      }
      // Âncora #id: selecionar bloco com esse id e trocar para a página que o contém
      if (href.startsWith("#")) {
        const id = href.slice(1);
        for (const p of document.pages) {
          if (findBlockInStructure(p.structure || [], id)) {
            setCurrentPageId(p.id);
            setSelectedBlockId(id);
            break;
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [document, setCurrentPageId, setSelectedBlockId]);

  // Sem documento: mostrar seletor de templates
  if (!document) {
    return (
      <div className="h-[91vh] max-h-[91vh] flex flex-col bg-background overflow-hidden">
        <TemplatePicker onSelectTemplate={handleSelectTemplate} />
      </div>
    );
  }

  return (
    <div className="h-[91vh] max-h-[91vh] flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        history={history}
        isSaving={isSaving}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onPublish={onPublish ? handlePublish : undefined}
        onReset={
          currentTemplateId
            ? () => {
                // Recarregar o mesmo template
                const sharedDoc = getTemplate(currentTemplateId);
                if (sharedDoc) {
                  loadDocument(sharedTemplateToEngineDocument(sharedDoc));
                  const paletteName = templateDefaultPalette[currentTemplateId];
                  if (paletteName) {
                    setSelectedPalette(paletteName);
                  }
                }
              }
            : resetToTemplate
        }
        showSelectionOverlay={showSelectionOverlay}
        onToggleSelectionOverlay={() => setShowSelectionOverlay(prev => !prev)}
      />

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden min-h-0 max-h-full">
        {/* Left: Block Selector + Paletas */}
        <LeftPanel
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          isPaletteSelected={isPaletteSelected}
          onSelectBlock={(id) => { setSelectedBlockId(id); setFocusedGroup(null); }}
          onDeleteBlock={handleDeleteBlock}
        />

        {/* Center: Preview (apenas a página em edição) */}
        <CenterPanel
          document={document}
          currentPageId={currentPageId}
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          onBlockClick={handleBlockClick}
          onSelectPage={setCurrentPageId}
          onAddPage={() => {
            const name = prompt("Nome da página:");
            if (!name) return;
            const slug = name.toLowerCase().replace(/\s+/g, "-");
            const id = slug;
            addPage(id, name, slug);
          }}
          onRemovePage={removePage}
          canRemovePage={canRemovePage}
          onUpdateBlock={handleUpdateBlockById}
          activePlugins={activePlugins}
          onActivatePlugin={activatePlugin}
          onDeactivatePlugin={deactivatePlugin}
          showSelectionOverlay={showSelectionOverlay}
          focusedGroup={focusedGroup}
        />

        {/* Right: Editor Panel */}
        <RightPanel
          isPaletteSelected={isPaletteSelected}
          selectedBlock={selectedBlock}
          selectedPalette={selectedPalette ? findPaletteByName(selectedPalette) : undefined}
          onPaletteChange={handlePaletteChange}
          onUpdateBlock={handleUpdateBlock}
          uploadConfig={uploadConfig}
          document={document}
          currentPageId={currentPageId}
          focusedGroup={focusedGroup}
        />
      </div>
    </div>
  );
}
