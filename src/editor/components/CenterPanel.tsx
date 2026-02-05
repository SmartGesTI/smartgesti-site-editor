import { lazy, Suspense } from "react";
import { SiteDocumentV2 } from "../../engine";
import { PageTabBar } from "../PageTabBar";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Lazy load PreviewV2 (componente pesado)
const PreviewV2 = lazy(() =>
  import("../../engine").then(module => ({ default: module.PreviewV2 }))
);

interface CenterPanelProps {
  document: SiteDocumentV2;
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
}

export function CenterPanel({
  document,
  currentPageId,
  currentPage,
  selectedBlockId,
  onBlockClick,
  onSelectPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
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
      />

      {/* Preview */}
      <div className="flex-1 overflow-hidden relative">
        {currentPage ? (
          <Suspense fallback={<LoadingSpinner />}>
            <PreviewV2
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
}
