/**
 * Landing Page Editor V2 - Refatorado
 * Editor de landing pages usando engine V2
 */

import { useState, useCallback, useEffect } from "react";
import { BlockSelector } from "./BlockSelector";
import { BlockPropertyEditor } from "./BlockPropertyEditor";
import { TemplatePicker } from "./TemplatePicker";
import { PageTabBar } from "./PageTabBar";
import { PreviewV2 } from "../engine";
import { PaletteSelector } from "./PaletteSelector";
import { Save, Eye, Undo, Redo, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";
import { useEditorState } from "../hooks/useEditorState";
import { SiteDocumentV2, PatchBuilder } from "../engine";
import { getTemplate } from "../shared/templates";
import type { TemplateId } from "../shared/templates";
import { sharedTemplateToEngineDocument } from "../utils/sharedTemplateToEngine";
import { findBlockInStructure } from "../utils/blockUtils";
import { isLightColor } from "../utils/colorUtils";

// ============================================================================
// Types
// ============================================================================

interface LandingPageEditorV2Props {
  initialData?: SiteDocumentV2;
  /** ID do template a carregar quando não houver initialData (ex.: "escola-edvi") */
  defaultTemplateId?: TemplateId;
  onSave?: (data: SiteDocumentV2) => Promise<void>;
  onPublish?: (data: SiteDocumentV2) => Promise<void>;
}

// ============================================================================
// Component
// ============================================================================

export function LandingPageEditorV2({
  initialData,
  defaultTemplateId,
  onSave,
  onPublish,
}: LandingPageEditorV2Props) {
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
    if (!document || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(document);
    } catch (error) {
      console.error("Error saving:", error);
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
      console.error("Error publishing:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para atualizar paleta de cores (inclui mutedText, primaryText, linkColor e menuLinkColor)
  const handlePaletteChange = (palette: any) => {
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
  };

  // No editor: cliques em links no preview não navegam; trocam a página em edição
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
        />

        {/* Right: Editor Panel */}
        <RightPanel
          isPaletteSelected={isPaletteSelected}
          selectedBlock={selectedBlock}
          onPaletteChange={handlePaletteChange}
          onUpdateBlock={handleUpdateBlock}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function Toolbar({
  history,
  isSaving,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onReset,
}: {
  history: any;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish?: () => void;
  onReset: () => void;
}) {
  return (
    <div className="h-12 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4">
      <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">
        Editor de Landing Page
      </h1>

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
            "h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
            "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]",
          )}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "Salvando..." : "Salvar"}
        </button>

        {/* Publish */}
        {onPublish && (
          <button
            onClick={onPublish}
            disabled={isSaving}
            className={cn(
              "h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
              "border-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-transparent",
              "hover:bg-purple-50 dark:hover:bg-purple-950/50",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Publicar
          </button>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  title,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 rounded-md text-xs font-medium transition-all cursor-pointer",
        "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "flex items-center justify-center",
      )}
      title={title}
    >
      {icon}
    </button>
  );
}

function LeftPanel({
  currentPage,
  selectedBlockId,
  isPaletteSelected,
  onSelectBlock,
  onDeleteBlock,
}: {
  currentPage: any;
  selectedBlockId: string | null;
  isPaletteSelected: boolean;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
}) {
  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Paletas de Cores */}
      <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={() => onSelectBlock("palette-selector")}
          className={cn(
            "w-full px-2 py-1.5 text-xs font-medium rounded transition-all",
            isPaletteSelected
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600",
          )}
        >
          🎨 Paletas de Cores
        </button>
      </div>
      {/* Lista de blocos da página atual */}
      {currentPage && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <BlockSelector
            structure={
              currentPage.structure?.filter((b: any) => b?.id && b?.type) || []
            }
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            onDeleteBlock={onDeleteBlock}
          />
        </div>
      )}
    </div>
  );
}

function CenterPanel({
  document,
  currentPageId,
  currentPage,
  selectedBlockId,
  onBlockClick,
  onSelectPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
}: {
  document: SiteDocumentV2;
  currentPageId: string;
  currentPage: any;
  selectedBlockId: string | null;
  onBlockClick: (id: string) => void;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onRemovePage: (id: string) => void;
  canRemovePage: (id: string) => boolean;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30 dark:bg-gray-900/30">
      {/* Barra de abas das páginas */}
      <PageTabBar
        pages={document.pages}
        currentPageId={currentPageId}
        onSelectPage={onSelectPage}
        onAddPage={onAddPage}
        onRemovePage={onRemovePage}
        canRemovePage={canRemovePage}
      />

      {/* Preview */}
      <div className="flex-1 overflow-hidden">
        {currentPage ? (
          <PreviewV2
            document={document}
            pageId={currentPageId}
            style={{ height: "100%" }}
            onBlockClick={onBlockClick}
            selectedBlockId={selectedBlockId}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Nenhuma página encontrada</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RightPanel({
  isPaletteSelected,
  selectedBlock,
  onPaletteChange,
  onUpdateBlock,
}: {
  isPaletteSelected: boolean;
  selectedBlock: any;
  onPaletteChange: (palette: any) => void;
  onUpdateBlock: (updates: Record<string, any>) => void;
}) {
  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      {isPaletteSelected ? (
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
          <BlockPropertyEditor block={selectedBlock} onUpdate={onUpdateBlock} />
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Selecione um bloco para editar
        </div>
      )}
    </div>
  );
}
