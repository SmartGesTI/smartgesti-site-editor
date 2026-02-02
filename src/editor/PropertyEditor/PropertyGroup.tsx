import { memo } from "react";
import { InspectorMeta } from "../../engine";
import { renderPropertyInput } from "./renderPropertyInput";

interface PropertyGroupProps {
  groupName: string;
  props: Array<{
    propName: string;
    meta: InspectorMeta;
    value: any;
  }>;
  onPropChange: (propName: string, value: any) => void;
}

/**
 * Componente para agrupar propriedades relacionadas
 * Memoizado para evitar re-renders desnecessários
 */
export const PropertyGroup = memo(function PropertyGroup({
  groupName,
  props,
  onPropChange,
}: PropertyGroupProps) {
  if (props.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {groupName}
      </h4>
      <div className="space-y-3">
        {props.map(({ propName, meta, value }) =>
          renderPropertyInput(propName, meta, value, (newValue) =>
            onPropChange(propName, newValue),
          ),
        )}
      </div>
    </div>
  );
});
