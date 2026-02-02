import { lazy, Suspense } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { UploadConfig } from "../LandingPageEditorV2";

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
  onPaletteChange: (palette: any) => void;
  onUpdateBlock: (updates: Record<string, any>) => void;
  uploadConfig?: UploadConfig;
}

export function RightPanel({
  isPaletteSelected,
  selectedBlock,
  onPaletteChange,
  onUpdateBlock,
  uploadConfig,
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
              selectedPalette={undefined}
              onPaletteChange={onPaletteChange}
            />
          </div>
        ) : selectedBlock ? (
          <div className="overflow-y-auto overflow-x-hidden flex-1">
            <BlockPropertyEditor
              block={selectedBlock}
              onUpdate={onUpdateBlock}
              uploadConfig={uploadConfig}
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
}
