/**
 * Hover Effects Module
 *
 * Sistema reutilizável de efeitos hover para links e botões.
 *
 * @example
 * ```typescript
 * import {
 *   generateLinkHoverStyles,
 *   generateButtonHoverStyles,
 *   generateScopedHoverCSS,
 * } from "@/engine/shared/hoverEffects";
 *
 * // Gerar estilos para link
 * const linkStyles = generateLinkHoverStyles({
 *   effect: "underline",
 *   intensity: 50,
 *   hoverColor: "#3b82f6",
 * });
 *
 * // Gerar CSS com escopo
 * const css = generateScopedHoverCSS("block-123", "my-link", linkStyles);
 * ```
 */

// Types
export type {
    LinkHoverEffect,
    ButtonHoverEffect,
    LinkHoverConfig,
    ButtonHoverConfig,
    HoverStyles,
    HoverCSS,
    HoverPreset,
    PresetConfig,
} from "./types";

// Link hover
export { generateLinkHoverStyles } from "./linkHover";

// Button hover
export {
    generateButtonHoverStyles,
    getButtonHoverKeyframes,
    getShineEffectCSS,
} from "./buttonHover";

// CSS generation
export {
    generateHoverCSS,
    combineCSS,
    generateScopedHoverCSS,
} from "./cssGenerator";

// Color utilities
export {
    hexToRgb,
    hexToRgba,
    adjustColor,
    normalizeIntensity,
} from "./colorUtils";
