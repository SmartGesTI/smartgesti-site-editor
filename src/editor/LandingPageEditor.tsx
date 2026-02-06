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
import { getTemplate } from "../shared/templates";
import type { TemplateId } from "../shared/templates";
import { sharedTemplateToEngineDocument } from "../utils/sharedTemplateToEngine";
import { findBlockInStructure } from "../utils/blockUtils";
import { isLightColor } from "../utils/colorUtils";
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
  } = useEditorState({ initialData });

  // Estado local da UI
  const [isSaving, setIsSaving] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId | null>(
    null,
  );

  // Carregar template escolhido (converter shared → engine e carregar no editor)
  const handleSelectTemplate = useCallback(
    (templateId: TemplateId) => {
      const sharedDoc = getTemplate(templateId);
      if (!sharedDoc) return;
      const engineDoc = sharedTemplateToEngineDocument(sharedDoc);
      loadDocument(engineDoc);
      setCurrentTemplateId(templateId);
    },
    [loadDocument],
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

  // Handler para atualizar paleta de cores (inclui mutedText, primaryText, linkColor e menuLinkColor)
  const handlePaletteChange = useCallback((palette: any) => {
    if (!document) return;
    const bgLight = isLightColor(palette.background ?? "#ffffff");
    const primaryLight = isLightColor(palette.primary ?? "#3b82f6");
    const mutedText = bgLight ? "#6b7280" : "#9ca3af";
    const primaryText = primaryLight ? "#1f2937" : "#ffffff";
    const patch = PatchBuilder.updateTheme(document, {
      colors: {
        ...document.theme.colors,
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        bg: palette.background,
        surface: palette.surface || document.theme.colors.surface,
        text: palette.text || document.theme.colors.text,
        mutedText,
        primaryText,
        linkColor: palette.linkColor || palette.primary, // Links gerais
        menuLinkColor: palette.menuLinkColor || palette.primary, // Links do menu navbar
      },
    });
    applyChange(patch, "Update color palette");
  }, [document, applyChange]);

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
                if (sharedDoc)
                  loadDocument(sharedTemplateToEngineDocument(sharedDoc));
              }
            : resetToTemplate
        }
      />

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden min-h-0 max-h-full">
        {/* Left: Block Selector + Paletas */}
        <LeftPanel
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          isPaletteSelected={isPaletteSelected}
          onSelectBlock={setSelectedBlockId}
          onDeleteBlock={handleDeleteBlock}
        />

        {/* Center: Preview (apenas a página em edição) */}
        <CenterPanel
          document={document}
          currentPageId={currentPageId}
          currentPage={currentPage}
          selectedBlockId={selectedBlockId}
          onBlockClick={setSelectedBlockId}
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
        />

        {/* Right: Editor Panel */}
        <RightPanel
          isPaletteSelected={isPaletteSelected}
          selectedBlock={selectedBlock}
          onPaletteChange={handlePaletteChange}
          onUpdateBlock={handleUpdateBlock}
          uploadConfig={uploadConfig}
          document={document}
          currentPageId={currentPageId}
        />
      </div>
    </div>
  );
}
