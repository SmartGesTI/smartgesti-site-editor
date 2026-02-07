/**
 * Block Property Editor - Refatorado
 * Editor dinâmico de propriedades baseado em inspectorMeta
 */

import { memo, useMemo, useCallback } from "react";
import { Block, SiteDocument, componentRegistry, InspectorMeta, evaluateShowWhen, pluginRegistry } from "../../engine";
import type { ShowWhenContext } from "../../engine";
import { VariationSelector } from "./VariationSelector";
import { BlockHeader } from "./BlockHeader";
import { CollapsiblePropertyGroup } from "./CollapsiblePropertyGroup";
import type { UploadConfig } from "../LandingPageEditor";

interface BlockPropertyEditorProps {
  block: Block | null;
  document?: SiteDocument;
  currentPageId?: string;
  onUpdate: (updates: Record<string, any>) => void;
  uploadConfig?: UploadConfig;
}

/**
 * Componente principal do editor de propriedades
 * Memoizado para performance
 */
export const BlockPropertyEditor = memo(function BlockPropertyEditor({
  block,
  document,
  currentPageId,
  onUpdate,
  uploadConfig,
}: BlockPropertyEditorProps) {
  // Obter definição do bloco do registry
  const blockDefinition = useMemo(() => {
    if (!block) return null;
    return componentRegistry.get(block.type);
  }, [block]);

  // Contexto para cross-block showWhen
  const showWhenContext = useMemo<ShowWhenContext>(
    () => ({ document, currentPageId }),
    [document, currentPageId],
  );

  // Obter restrições de edição do plugin (se houver)
  const lockedFields = useMemo(() => {
    if (!block || !document) return new Set<string>();
    const restriction = pluginRegistry.getEditorRestrictions(document, block.type);
    if (!restriction?.lockedFields) return new Set<string>();
    return new Set(restriction.lockedFields);
  }, [block, document]);

  // Agrupar propriedades por grupo
  const groupedProps = useMemo(() => {
    if (!block || !blockDefinition?.inspectorMeta) return {};

    const props = block.props as Record<string, any>;
    const defaultProps = (blockDefinition.defaultProps || {}) as Record<string, any>;
    const groups: Record<
      string,
      Array<{ propName: string; meta: InspectorMeta; value: any }>
    > = {};

    for (const [propName, meta] of Object.entries(
      blockDefinition.inspectorMeta,
    )) {
      // Visibilidade condicional via showWhen
      if (meta.showWhen) {
        if (!evaluateShowWhen(meta.showWhen, props, defaultProps, showWhenContext)) {
          continue;
        }
      }

      const group = meta.group || "Geral";
      if (!groups[group]) {
        groups[group] = [];
      }

      // Usar valor atual ou fallback para defaultProps
      const currentValue = props[propName];
      // Para campos de cor, também fazer fallback se o valor for string vazia
      const isColorInput = meta.inputType === "color" || meta.inputType === "color-advanced";
      const shouldUseFallback = currentValue === undefined || (isColorInput && currentValue === "");
      const value = shouldUseFallback ? defaultProps[propName] : currentValue;

      // Aplicar readOnly de plugin restrictions
      const effectiveMeta = lockedFields.has(propName)
        ? { ...meta, readOnly: true }
        : meta;

      groups[group].push({
        propName,
        meta: effectiveMeta,
        value,
      });
    }

    return groups;
  }, [block, blockDefinition, showWhenContext, lockedFields]);

  // IMPORTANTE: todos os hooks devem ser chamados ANTES de qualquer early return
  const handlePropChange = useCallback((propName: string, value: any) => {
    // Se remover o logo (definir como undefined), resetar logoHeight para padrão
    if (propName === "logo" && (value === undefined || value === "")) {
      onUpdate({ [propName]: value, logoHeight: 70 });
    } else {
      onUpdate({ [propName]: value });
    }
  }, [onUpdate]);

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

  return (
    <div className="p-3 space-y-4">
      {/* Header com ícone centralizado */}
      <BlockHeader
        type={block.type}
        name={blockDefinition.name}
        description={blockDefinition.description}
      />

      {/* Seletor de variações (Hero/Navbar) */}
      {blockDefinition.variations && (
        <VariationSelector block={block} onUpdate={onUpdate} />
      )}

      {/* Propriedades agrupadas com collapse */}
      {Object.keys(groupedProps).length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-4">
          Nenhuma propriedade configurável
        </div>
      ) : (
        Object.entries(groupedProps).map(([groupName, props]) => (
          <CollapsiblePropertyGroup
            key={groupName}
            groupName={groupName}
            props={props}
            onPropChange={handlePropChange}
            onMultiUpdate={onUpdate}
            allProps={block?.props as Record<string, any>}
            uploadConfig={uploadConfig}
          />
        ))
      )}
    </div>
  );
});
