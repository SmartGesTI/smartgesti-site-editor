import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { BlockSelector } from "../BlockSelector";
import { BlockPalette } from "../BlockPalette";
import { DndEditorContext } from "../dnd";
import { BlockType, Block } from "../../engine";
import { List, Plus } from "lucide-react";

interface LeftPanelProps {
  currentPage: any;
  selectedBlockId: string | null;
  isPaletteSelected: boolean;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void;
  onMoveBlock: (blockId: string, newPosition: number) => void;
  activePlugins?: string[];
}

export const LeftPanel = React.memo(function LeftPanel({
  currentPage,
  selectedBlockId,
  isPaletteSelected,
  onSelectBlock,
  onDeleteBlock,
  onAddBlock,
  onMoveBlock,
  activePlugins,
}: LeftPanelProps) {
  const [mode, setMode] = useState<"blocks" | "add">("blocks");

  // Extrair tipos de blocos existentes na página (para restrições navbar/footer)
  const existingBlockTypes = useMemo(() => {
    if (!currentPage?.structure) return [];
    return currentPage.structure
      .filter((b: Block) => b?.type)
      .map((b: Block) => b.type);
  }, [currentPage]);

  return (
    <DndEditorContext onAddBlock={onAddBlock} onMoveBlock={onMoveBlock}>
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

        {/* Toggle Blocos / Adicionar */}
        <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setMode("blocks")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium transition-all",
              mode === "blocks"
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
            )}
          >
            <List className="w-3.5 h-3.5" />
            Blocos
          </button>
          <button
            onClick={() => setMode("add")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium transition-all",
              mode === "add"
                ? "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 border-b-2 border-green-500"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>

        {/* Conteúdo dinâmico */}
        {currentPage && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {mode === "blocks" ? (
              <BlockSelector
                structure={
                  currentPage.structure?.filter((b: any) => b?.id && b?.type) || []
                }
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                onDeleteBlock={onDeleteBlock}
              />
            ) : (
              <BlockPalette
                onAddBlock={onAddBlock}
                selectedParentBlockId={selectedBlockId}
                activePlugins={activePlugins}
                existingBlockTypes={existingBlockTypes}
              />
            )}
          </div>
        )}
      </div>
    </DndEditorContext>
  );
});
