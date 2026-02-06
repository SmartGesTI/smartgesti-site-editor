import React from "react";
import { Save, Eye, Undo, Redo, RotateCcw } from "lucide-react";
import { cn } from "../../utils/cn";

interface ToolbarProps {
  history: any;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish?: () => void;
  onReset: () => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  icon: React.ReactNode;
}

function ToolbarButton({
  onClick,
  disabled,
  title,
  icon,
}: ToolbarButtonProps) {
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

export const Toolbar = React.memo(function Toolbar({
  history,
  isSaving,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onReset,
}: ToolbarProps) {
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
});
