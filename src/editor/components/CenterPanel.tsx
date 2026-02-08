import React, { lazy, Suspense } from "react";
import { SiteDocument } from "../../engine";
import { PageTabBar } from "../PageTabBar";
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy load Preview (componente pesado)
const Preview = lazy(() =>
  import("../../engine").then(module => ({ default: module.Preview }))
);

interface CenterPanelProps {
  document: SiteDocument;
  currentPageId: string;
  currentPage: any;
  selectedBlockId: string | null;
  onBlockClick: (id: string) => void;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onRemovePage: (id: string) => void;
  canRemovePage: (id: string) => boolean;
  /** Callback ao atualizar um bloco específico */
  onUpdateBlock?: (blockId: string, updates: Record<string, any>) => void;
  /** Plugin integration */
  activePlugins: string[];
  onActivatePlugin: (pluginId: string) => void;
  onDeactivatePlugin: (pluginId: string) => void;
}

export const CenterPanel = React.memo(function CenterPanel({
  document,
  currentPageId,
  currentPage,
  selectedBlockId,
  onBlockClick,
  onSelectPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
  activePlugins,
  onActivatePlugin,
  onDeactivatePlugin,
}: CenterPanelProps) {
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
        activePlugins={activePlugins}
        onActivatePlugin={onActivatePlugin}
        onDeactivatePlugin={onDeactivatePlugin}
      />

      {/* Preview */}
      <div className="flex-1 overflow-hidden relative">
        {currentPage ? (
          <Suspense fallback={<LoadingSpinner />}>
            <Preview
              document={document}
              pageId={currentPageId}
              style={{ height: "100%", width: "100%" }}
              onBlockClick={onBlockClick}
              selectedBlockId={selectedBlockId}
            />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Nenhuma página encontrada</div>
          </div>
        )}
      </div>
    </div>
  );
});
