/**
 * PluginPanel
 * Painel de plugins disponíveis com toggle de ativação/desativação
 */

import React, { useState, useMemo, useCallback } from "react";
import { pluginRegistry } from "../engine";
import { cn } from "../utils/cn";

interface PluginPanelProps {
  activePlugins: string[];
  onActivate: (pluginId: string) => void;
  onDeactivate: (pluginId: string) => void;
}

export const PluginPanel = React.memo(function PluginPanel({
  activePlugins,
  onActivate,
  onDeactivate,
}: PluginPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const availablePlugins = useMemo(
    () => pluginRegistry.getAll(),
    [],
  );

  const handleToggle = useCallback(
    (pluginId: string, isActive: boolean) => {
      if (isActive) {
        onDeactivate(pluginId);
      } else {
        onActivate(pluginId);
      }
    },
    [onActivate, onDeactivate],
  );

  // Não renderizar se não há plugins registrados
  if (availablePlugins.length === 0) return null;

  return (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span>Plugins ({activePlugins.length}/{availablePlugins.length})</span>
        <svg
          className={cn(
            "w-3.5 h-3.5 transition-transform",
            isExpanded && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-2 pb-2 space-y-1">
          {availablePlugins.map((plugin) => {
            const { id, name, description, icon } = plugin.manifest;
            const isActive = activePlugins.includes(id);

            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-gray-50 dark:bg-gray-800/30",
                )}
              >
                {/* Icon */}
                <span className="text-sm flex-shrink-0">{icon || "🧩"}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {name}
                  </p>
                  {description && (
                    <p className="text-gray-500 dark:text-gray-400 truncate">
                      {description}
                    </p>
                  )}
                </div>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(id, isActive)}
                  className={cn(
                    "relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    isActive
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600",
                  )}
                  role="switch"
                  aria-checked={isActive}
                  aria-label={`${isActive ? "Desativar" : "Ativar"} plugin ${name}`}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform transition-transform",
                      isActive ? "translate-x-3" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
