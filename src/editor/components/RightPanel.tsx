import React, { lazy, Suspense } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import type { UploadConfig } from "../LandingPageEditor";
import type { SiteDocument } from "../../engine";
import type { ColorPalette } from "../PaletteSelector";

// Lazy load componentes pesados do editor
const BlockPropertyEditor = lazy(() =>
  import("../PropertyEditor").then(module => ({ default: module.BlockPropertyEditor }))
);
const PaletteSelector = lazy(() =>
  import("../PaletteSelector").then(module => ({ default: module.PaletteSelector }))
);

interface RightPanelProps {
  isPaletteSelected: boolean;
  selectedBlock: any;
  selectedPalette?: ColorPalette;
  onPaletteChange: (palette: any) => void;
  onUpdateBlock: (updates: Record<string, any>) => void;
  uploadConfig?: UploadConfig;
  document?: SiteDocument;
  currentPageId?: string;
  /** When set, the matching property group opens and scrolls into view */
  focusedGroup?: string | null;
}

export const RightPanel = React.memo(function RightPanel({
  isPaletteSelected,
  selectedBlock,
  selectedPalette,
  onPaletteChange,
  onUpdateBlock,
  uploadConfig,
  document,
  currentPageId,
  focusedGroup,
}: RightPanelProps) {
  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      <Suspense fallback={<LoadingSpinner />}>
        {isPaletteSelected ? (
          <div className="p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Escolha uma Paleta de Cores
            </h2>
            <PaletteSelector
              selectedPalette={selectedPalette}
              onPaletteChange={onPaletteChange}
            />
          </div>
        ) : selectedBlock ? (
          <div className="overflow-y-auto overflow-x-hidden flex-1">
            <BlockPropertyEditor
              block={selectedBlock}
              document={document}
              currentPageId={currentPageId}
              onUpdate={onUpdateBlock}
              uploadConfig={uploadConfig}
              focusedGroup={focusedGroup}
            />
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Selecione um bloco para editar
          </div>
        )}
      </Suspense>
    </div>
  );
});
