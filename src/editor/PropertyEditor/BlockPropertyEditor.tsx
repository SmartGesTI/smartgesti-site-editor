/**
 * Block Property Editor - Refatorado
 * Editor dinâmico de propriedades baseado em inspectorMeta
 */

import { memo, useMemo, useCallback } from "react";
import { Block, SiteDocumentV2, componentRegistry, InspectorMeta } from "../../engine";
import { VariationSelector } from "./VariationSelector";
import { PropertyGroup } from "./PropertyGroup";

interface BlockPropertyEditorProps {
  block: Block | null;
  document?: SiteDocumentV2;
  currentPageId?: string;
  onUpdate: (updates: Record<string, any>) => void;
}

/**
 * Componente principal do editor de propriedades
 * Memoizado para performance
 */
export const BlockPropertyEditor = memo(function BlockPropertyEditor({
  block,
  onUpdate,
}: BlockPropertyEditorProps) {
  // Obter definição do bloco do registry
  const blockDefinition = useMemo(() => {
    if (!block) return null;
    return componentRegistry.get(block.type);
  }, [block]);

  // Agrupar propriedades por grupo
  const groupedProps = useMemo(() => {
    if (!block || !blockDefinition?.inspectorMeta) return {};

    const props = block.props as Record<string, any>;
    const groups: Record<
      string,
      Array<{ propName: string; meta: InspectorMeta; value: any }>
    > = {};

    for (const [propName, meta] of Object.entries(
      blockDefinition.inspectorMeta,
    )) {
      const group = meta.group || "Geral";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push({
        propName,
        meta,
        value: props[propName],
      });
    }

    return groups;
  }, [block, blockDefinition]);

  if (!block) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        Selecione um bloco para editar
      </div>
    );
  }

  if (!blockDefinition) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        Tipo de bloco desconhecido: {block.type}
      </div>
    );
  }

  const handlePropChange = useCallback((propName: string, value: any) => {
    onUpdate({ [propName]: value });
  }, [onUpdate]);

  return (
    <div className="p-3 space-y-4">
      {/* Header com nome do bloco */}
      <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {blockDefinition.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {blockDefinition.description}
        </p>
      </div>

      {/* Seletor de variações (Hero/Navbar) */}
      {blockDefinition.variations && (
        <VariationSelector block={block} onUpdate={onUpdate} />
      )}

      {/* Propriedades agrupadas */}
      {Object.keys(groupedProps).length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-4">
          Nenhuma propriedade configurável
        </div>
      ) : (
        Object.entries(groupedProps).map(([groupName, props]) => (
          <PropertyGroup
            key={groupName}
            groupName={groupName}
            props={props}
            onPropChange={handlePropChange}
          />
        ))
      )}
    </div>
  );
});
