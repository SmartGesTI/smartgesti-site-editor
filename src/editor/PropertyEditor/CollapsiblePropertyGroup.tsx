import { memo, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { InspectorMeta } from "../../engine";
import { renderPropertyInput, type RenderInputContext } from "./renderPropertyInput";
import { cn } from "../../utils/cn";
import type { UploadConfig } from "../LandingPageEditorV2";

interface CollapsiblePropertyGroupProps {
  groupName: string;
  props: Array<{
    propName: string;
    meta: InspectorMeta;
    value: any;
  }>;
  onPropChange: (propName: string, value: any) => void;
  /** Callback to update multiple props at once (for special inputs like image-grid) */
  onMultiUpdate?: (updates: Record<string, any>) => void;
  /** All current prop values (for special inputs that need to read multiple props) */
  allProps?: Record<string, any>;
  uploadConfig?: UploadConfig;
  defaultOpen?: boolean;
}

/**
 * Grupo de propriedades colapsável
 * Memoizado para evitar re-renders desnecessários
 */
export const CollapsiblePropertyGroup = memo(function CollapsiblePropertyGroup({
  groupName,
  props,
  onPropChange,
  onMultiUpdate,
  allProps,
  uploadConfig,
  defaultOpen = true,
}: CollapsiblePropertyGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Create context for special inputs
  const renderContext = useMemo<RenderInputContext | undefined>(() => {
    if (allProps && onMultiUpdate) {
      return { allProps, onMultiUpdate };
    }
    return undefined;
  }, [allProps, onMultiUpdate]);

  if (props.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header clicável */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2.5",
          "bg-gray-50 dark:bg-gray-800/50",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "transition-colors cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
          "rounded-t-lg",
          !isOpen && "rounded-b-lg"
        )}
      >
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {groupName}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Conteúdo colapsável */}
      {isOpen && (
        <div className="p-3 space-y-3 bg-white dark:bg-gray-900 rounded-b-lg">
          {props.map(({ propName, meta, value }) =>
            renderPropertyInput(
              propName,
              meta,
              value,
              (newValue) => onPropChange(propName, newValue),
              uploadConfig,
              renderContext
            )
          )}
        </div>
      )}
    </div>
  );
});
