import React from "react";
import { cn } from "../../utils/cn";
import { BlockSelector } from "../BlockSelector";
import { PluginPanel } from "../PluginPanel";

interface LeftPanelProps {
  currentPage: any;
  selectedBlockId: string | null;
  isPaletteSelected: boolean;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  activePlugins: string[];
  onActivatePlugin: (pluginId: string) => void;
  onDeactivatePlugin: (pluginId: string) => void;
}

export const LeftPanel = React.memo(function LeftPanel({
  currentPage,
  selectedBlockId,
  isPaletteSelected,
  onSelectBlock,
  onDeleteBlock,
  activePlugins,
  onActivatePlugin,
  onDeactivatePlugin,
}: LeftPanelProps) {
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
      {/* Plugins */}
      <PluginPanel
        activePlugins={activePlugins}
        onActivate={onActivatePlugin}
        onDeactivate={onDeactivatePlugin}
      />
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
});
