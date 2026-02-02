import React from "react";
import { SiteDocumentV2 } from "../../engine";
import { PreviewV2 } from "../../engine";
import { PageTabBar } from "../PageTabBar";

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
