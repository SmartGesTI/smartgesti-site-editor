/**
 * Engine - Entry Point
 * Exporta todos os módulos do engine
 */

// Schema
export * from "./schema/siteDocument";
export * from "./schema/themeTokens";

// Registry
export * from "./registry/registry";
export * from "./registry/types";
export * from "./registry/blocks";
// Garantir que blocks seja importado para executar registerAllBlocks()
import "./registry/blocks";

// Render
export * from "./render/renderNode";
export * from "./render/renderPage";

// Export
export * from "./export/exportHtml";
export * from "./export/sanitizeHtml";

// Preview
export * from "./preview/Preview";

// Patch
export * from "./patch/types";
export * from "./patch/applyPatch";
export * from "./patch/history";
export * from "./patch/PatchBuilder";

// Theme (new modular system)
export * from "./theme";

// Presets
export * from "./presets/themePresets";
export {
  heroVariations,
  heroVariationIds,
  getHeroVariation,
  HERO_IMAGE_NAMES,
  PLACEHOLDER_IMAGE_URL,
  type HeroVariationPreset,
} from "./presets/heroVariations";
export {
  navbarVariations,
  navbarVariationIds,
  getNavbarVariation,
  type NavbarVariationPreset,
} from "./presets/navbarVariations";

// Generators
export * from "./generators/generateLandingPage";

// Plugins
export * from "./plugins";

// Shared modules
export * from "./shared/imageGrid";
export { evaluateShowWhen } from "./shared/showWhen";
export type {
  ShowWhenCondition,
  ShowWhenFieldCondition,
  ShowWhenAndCondition,
  ShowWhenOrCondition,
  ShowWhenContext,
} from "./shared/showWhen";
