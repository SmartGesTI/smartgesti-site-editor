import { cn } from "../../utils/cn";
import { Block } from "../../engine";
import {
  heroVariations,
  heroVariationIds,
} from "../../engine/presets/heroVariations";
import {
  navbarVariations,
  navbarVariationIds,
} from "../../engine/presets/navbarVariations";

interface VariationSelectorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
}

/**
 * Componente para selecionar variações de Hero e Navbar
 * Preserva props customizadas ao trocar variação
 */
export function VariationSelector({ block, onUpdate }: VariationSelectorProps) {
  // Hero variations
  if (block.type === "hero") {
    const currentVariation = (block.props as any).variation;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Variação
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {heroVariationIds.map((id) => {
            const v = heroVariations[id];
            const isActive = currentVariation === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  // Preservar TODAS as props customizadas ao mudar variação
                  // As variações definem a estrutura/layout, mas preservamos cores e outras customizações
                  const {
                    variation: _,
                    title: __,
                    subtitle: ___,
                    badge: ____,
                    primaryButton: _____,
                    secondaryButton: ______,
                    image: _______,
                    ...customProps
                  } = block.props as any;
                  onUpdate({
                    ...v.defaultProps, // Aplica estrutura da nova variação PRIMEIRO
                    ...customProps, // DEPOIS preserva customizações (cores, etc.) - OVERRIDE
                  });
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Navbar variations
  if (block.type === "navbar") {
    const currentVariation = (block.props as any).variation;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Estilo
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {navbarVariationIds.map((id) => {
            const v = navbarVariations[id];
            const isActive = currentVariation === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  // Preservar TODAS as props customizadas ao mudar variação
                  // As variações só definem: variation, logoText, links, ctaButton, sticky
                  const {
                    variation: _,
                    logoText: __,
                    links: ___,
                    ctaButton: ____,
                    sticky: _____,
                    ...customProps
                  } = block.props as any;
                  onUpdate({
                    ...v.defaultProps, // Aplica estrutura da nova variação PRIMEIRO
                    ...customProps, // DEPOIS preserva customizações (cores, etc.) - OVERRIDE
                  });
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
