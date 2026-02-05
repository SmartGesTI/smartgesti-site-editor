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
 * Helper para preservar um valor se ele existir (não undefined)
 */
function preserveIfDefined(obj: Record<string, any>, key: string): Record<string, any> {
  return obj[key] !== undefined ? { [key]: obj[key] } : {};
}

/**
 * Props visuais do Hero que DEVEM ser resetadas ao trocar de variação
 * para evitar "vazamento" de estilos entre variações
 */
const HERO_VISUAL_PROPS_TO_RESET: Record<string, any> = {
  // Variant e variation
  variation: undefined,
  variant: "centered",
  // Layout
  align: "center",
  minHeight: "80vh",
  contentMaxWidth: "800px",
  paddingY: undefined,
  // Background & Overlay
  background: undefined,
  overlay: false,
  overlayColor: undefined,
  // Typography colors
  titleColor: undefined,
  subtitleColor: undefined,
  descriptionColor: undefined,
  // Badge styling
  badgeColor: undefined,
  badgeTextColor: undefined,
  // Image styling
  imageRadius: 16,
  imageShadow: "lg",
  imagePosition: "right",
  // Button styling
  buttonSize: "md",
  primaryButtonVariant: "solid",
  primaryButtonColor: undefined,
  primaryButtonTextColor: undefined,
  primaryButtonRadius: 8,
  secondaryButtonVariant: "outline",
  secondaryButtonColor: undefined,
  secondaryButtonTextColor: undefined,
  secondaryButtonRadius: 8,
  // Button hover
  buttonHoverEffect: "scale",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
  // Decorative
  showWave: false,
  waveColor: "rgba(255,255,255,0.1)",
  // Image Grid
  imageGridEnabled: false,
  imageGridPreset: "four-equal",
  imageGridImages: [],
  imageGridGap: 8,
};

/**
 * Props visuais da Navbar que DEVEM ser resetadas ao trocar de variação
 */
const NAVBAR_VISUAL_PROPS_TO_RESET: Record<string, any> = {
  variation: undefined,
  layout: "expanded",
  floating: false,
  sticky: true,
  // Aparência
  bg: "#ffffff",
  opacity: 100,
  blurOpacity: 0,
  borderRadius: 0,
  shadow: "sm",
  // Borda
  borderPosition: "none",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  // Links
  linkColor: "#374151",
  linkHoverColor: "#2563eb",
  linkFontSize: "md",
  linkHoverEffect: "background",
  linkHoverIntensity: 50,
  // Botão
  buttonVariant: "solid",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonSize: "md",
  buttonHoverEffect: "darken",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
};

/**
 * Componente para selecionar variações de Hero e Navbar
 * Preserva props customizadas ao trocar variação
 */
export function VariationSelector({ block, onUpdate }: VariationSelectorProps) {
  // Hero variations
  if (block.type === "hero") {
    const currentVariation = (block.props as any).variation;
    const props = block.props as any;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Variações
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {heroVariationIds.map((id) => {
            const v = heroVariations[id];
            const isActive = currentVariation === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  // IMPORTANTE: Ao trocar variação:
                  // 1. Primeiro RESETA todas as props visuais para valores padrão
                  // 2. Depois aplica os defaults da nova variação
                  // 3. Por fim preserva o conteúdo do usuário

                  const newProps = {
                    // 1. RESET: Limpa todas as props visuais para evitar vazamento
                    ...HERO_VISUAL_PROPS_TO_RESET,

                    // 2. Aplica os defaults da nova variação
                    ...v.defaultProps,

                    // 3. Preserva APENAS o conteúdo editado pelo usuário
                    ...preserveIfDefined(props, "title"),
                    ...preserveIfDefined(props, "subtitle"),
                    ...preserveIfDefined(props, "description"),
                    ...preserveIfDefined(props, "badge"),
                    ...preserveIfDefined(props, "primaryButton"),
                    ...preserveIfDefined(props, "secondaryButton"),
                    ...preserveIfDefined(props, "image"),

                    // 4. Preserva configuração da Image Grid
                    ...preserveIfDefined(props, "imageGridEnabled"),
                    ...preserveIfDefined(props, "imageGridPreset"),
                    ...preserveIfDefined(props, "imageGridImages"),
                    ...preserveIfDefined(props, "imageGridGap"),
                  };

                  onUpdate(newProps);
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
    const props = block.props as any;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Variações
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
                  // IMPORTANTE: Ao trocar variação:
                  // 1. Primeiro RESETA todas as props visuais para valores padrão
                  // 2. Depois aplica os defaults da nova variação
                  // 3. Por fim preserva o conteúdo do usuário

                  const newProps = {
                    // 1. RESET: Limpa todas as props visuais para evitar vazamento
                    ...NAVBAR_VISUAL_PROPS_TO_RESET,

                    // 2. Aplica os defaults da nova variação
                    ...v.defaultProps,

                    // 3. Preserva APENAS o conteúdo editado pelo usuário
                    ...preserveIfDefined(props, "logo"),
                    ...preserveIfDefined(props, "logoText"),
                    ...preserveIfDefined(props, "logoHeight"),
                    ...preserveIfDefined(props, "links"),
                    ...preserveIfDefined(props, "ctaButton"),
                  };

                  onUpdate(newProps);
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
