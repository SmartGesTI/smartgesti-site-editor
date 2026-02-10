/**
 * SmartGesti Site Editor
 * Editor de sites compartilhado para projetos SmartGesti
 */

// Landing Page Builder exports
export { LandingPageEditor } from './editor/LandingPageEditor'
export type { UploadConfig, LandingPageEditorProps } from './editor/LandingPageEditor'
export { LandingPageViewer } from './viewer/LandingPageViewer'

// Engine exports
// Side-effect import to ensure blocks are registered
import './engine/registry/blocks'

// Schema - Core types and interfaces
export type {
  // Block types and union
  BlockType,
  Block,
  BlockBase,

  // Layout blocks
  ContainerBlock,
  StackBlock,
  GridBlock,
  BoxBlock,
  SpacerBlock,

  // Content blocks
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  LinkBlock,
  DividerBlock,
  BadgeBlock,
  IconBlock,
  AvatarBlock,
  VideoBlock,

  // Composition blocks
  CardBlock,
  SectionBlock,

  // Section blocks
  HeroBlock,
  HeroVariationId,
  NavbarBlock,
  NavbarLink,
  NavbarVariationId,
  FooterBlock,
  FeatureBlock,
  FeatureGridBlock,
  PricingCardBlock,
  PricingBlock,
  TestimonialBlock,
  TestimonialGridBlock,
  FaqItemBlock,
  FaqBlock,
  CtaBlock,
  StatItemBlock,
  StatsBlock,
  LogoCloudBlock,
  CountdownBlock,
  CarouselBlock,
  BlogCardBlock,
  BlogCardGridBlock,
  TeamCardBlock,
  TeamGridBlock,
  CourseCardGridBlock,
  CategoryCardGridBlock,
  SocialLinksBlock,
  BlogPostCardBlock,
  BlogPostGridBlock,
  BlogPostDetailBlock,

  // Advanced sections
  ProductShowcaseBlock,
  AboutSectionBlock,
  ContactSectionBlock,

  // Form blocks
  FormBlock,
  InputBlock,

  // Blog plugin blocks (new)
  BlogCategoryFilterBlock,
  BlogSearchBarBlock,
  BlogRecentPostsBlock,
  BlogTagCloudBlock,

  // SEO
  PageSeoConfig,
  SiteMetadata,

  // Document structure
  SiteDocument,
  SitePage,

  // Shared types
  ImageGridItem,
  ImageGridPreset,
  TypographyConfig,
} from './engine/schema/siteDocument'

export {
  createEmptySiteDocument,
} from './engine/schema/siteDocument'

// Theme tokens
export type {
  // Scale types
  RadiusScale,
  ShadowScale,
  SpacingScale,
  MotionLevel,
  BackgroundStyle,
  GradientDirection,

  // Token interfaces
  ColorTokens,
  TypographyTokens,
  EffectTokens,
  LayoutTokens,
  ComponentTokens,
  ThemeTokens,
} from './engine/schema/themeTokens'

export {
  // Scale maps
  radiusScaleMap,
  shadowScaleMap,
  spacingScaleMap,
  gradientDirectionMap,

  // Default tokens
  defaultEffectTokens,
  defaultLayoutTokens,
  defaultComponentTokens,
  defaultThemeTokens,
  darkThemeTokens,
  gradientThemeTokens,
  corporateThemeTokens,
  playfulThemeTokens,

  // Functions
  generateThemeCSSVariables,
} from './engine/schema/themeTokens'

// Registry
export type {
  InspectorMeta,
  BlockConstraint,
  SlotDefinition,
  BlockVariation,
  BlockDefinition,
  ComponentRegistry,
} from './engine/registry/types'

export { componentRegistry } from './engine/registry/registry'

// Re-export from blocks index for convenience
export type { BlockDefinition as BlockDef } from './engine/registry/blocks'
export { componentRegistry as blockRegistry } from './engine/registry/blocks'

// Render
export type {
  RenderNodeProps,
} from './engine/render/renderNode'

export type {
  RenderPageProps,
} from './engine/render/renderPage'

export {
  RenderNode,
  renderNode,
} from './engine/render/renderNode'

export {
  RenderPage,
  renderPage,
} from './engine/render/renderPage'

// Export
export type {
  ExportPageToHtmlOptions,
} from './engine/export/exportHtml'

export {
  exportPageToHtml,
  exportBlockToHtml,
  clearHtmlCache,
  exportDocumentToHtml,
  generateAssetsManifest,
} from './engine/export/exportHtml'

export {
  sanitizeHtml,
  isSafeUrl,
} from './engine/export/sanitizeHtml'

// Preview
export type {
  PreviewProps,
} from './engine/preview/Preview'

export {
  Preview,
} from './engine/preview/Preview'

// Patch system
export type {
  PatchOperation,
  AddOperation,
  RemoveOperation,
  ReplaceOperation,
  MoveOperation,
  CopyOperation,
  TestOperation,
  Patch,
  PatchResult,
} from './engine/patch/types'

export {
  applyPatch,
  createAddPatch,
  createRemovePatch,
  createReplacePatch,
  createMovePatch,
  createCopyPatch,
} from './engine/patch/applyPatch'

export type {
  HistoryEntry,
} from './engine/patch/history'

export {
  HistoryManager,
  createHistoryManager,
} from './engine/patch/history'

export {
  PatchBuilder,
} from './engine/patch/PatchBuilder'

// Theme system (renamed exports to avoid conflicts)
export type {
  SiteThemeTokens,
  PartialSiteThemeTokens,
  SiteThemeColors,
  SiteThemeSpacing,
  SiteThemeTypography,
  SiteThemeBorderRadius,
  SiteThemeShadows,
  SiteThemeBreakpoints,
} from './engine/theme'

export {
  siteDefaultTheme,
  siteDarkTheme,
  generateSiteCSSVariables,
  generateSiteCSSVariablesObject,
  createSiteThemeStyle,
  mergeSiteThemeTokens,
} from './engine/theme'

// Presets
export type {
  ThemePreset,
} from './engine/presets/themePresets'

export {
  cleanPreset,
  neonPreset,
  pastelPreset,
  corporatePreset,
  playfulKidsPreset,
  glassPreset,
  minimalPreset,
  classicPreset,
  themePresets,
  getPreset,
  getAllPresets,
  applyOverrides,
  validateContrast,
} from './engine/presets/themePresets'

export type {
  HeroVariationPreset,
} from './engine/presets/heroVariations'

export {
  heroVariations,
  heroVariationIds,
  getHeroVariation,
  HERO_IMAGE_NAMES,
  PLACEHOLDER_IMAGE_URL,
  CAROUSEL_PLACEHOLDER_IMAGES,
} from './engine/presets/heroVariations'

export type {
  NavbarVariationPreset,
} from './engine/presets/navbarVariations'

export {
  navbarVariations,
  navbarVariationIds,
  getNavbarVariation,
} from './engine/presets/navbarVariations'

// Generators
export {
  generateCompleteLandingPage,
  generatePatchesForLandingPage,
  generateModernLandingPage,
} from './engine/generators/generateLandingPage'

// Shared modules - Image grid
export type {
  ImageGridItem as EngineImageGridItem,
  ImageGridPreset as EngineImageGridPreset,
} from './engine/shared/imageGrid'

// Shared modules - ShowWhen (conditional visibility)
export { evaluateShowWhen } from './engine/shared/showWhen'
export type {
  ShowWhenCondition,
  ShowWhenFieldCondition,
  ShowWhenAndCondition,
  ShowWhenOrCondition,
  ShowWhenContext,
} from './engine/shared/showWhen'

// Plugin System
export { pluginRegistry } from './engine/plugins/pluginRegistry'
export type { PluginRegistry } from './engine/plugins/pluginRegistry'

export type {
  DataSchemaField,
  DataSchema,
  ContentListParams,
  ContentItem,
  ContentListResult,
  ContentProvider,
  PageDataSource,
  PageEditRestrictions,
  PageTemplate,
  EditorRestriction,
  PluginManifest,
  PluginRegistration,
  SitePluginsConfig,
} from './engine/plugins/types'

// Content Provider API
export { hydratePageWithContent } from './engine/plugins/contentHydration'
export type { ContentProviderMap } from './engine/plugins/contentHydration'

export { matchDynamicPage } from './engine/plugins/dynamicPageResolver'
export type { DynamicPageMatch } from './engine/plugins/dynamicPageResolver'

// Built-in plugins
export { blogPlugin } from './engine/plugins/builtin/blog'
export { mockBlogContentProvider } from './engine/plugins/builtin/blog'

// ============================================================================
// Deprecated re-exports (backward compatibility)
// ============================================================================

/** @deprecated Use SiteDocument */
export type { SiteDocument as SiteDocumentV2 } from './engine/schema/siteDocument'

/** @deprecated Use createEmptySiteDocument */
export { createEmptySiteDocument as createEmptySiteDocumentV2 } from './engine/schema/siteDocument'

/** @deprecated Use LandingPageEditor */
export { LandingPageEditor as LandingPageEditorV2 } from './editor/LandingPageEditor'

/** @deprecated Use LandingPageEditorProps */
export type { LandingPageEditorProps as LandingPageEditorV2Props } from './editor/LandingPageEditor'

/** @deprecated Use LandingPageViewer */
export { LandingPageViewer as LandingPageViewerV2 } from './viewer/LandingPageViewer'

/** @deprecated Use Preview */
export { Preview as PreviewV2 } from './engine/preview/Preview'

/** @deprecated Use PreviewProps */
export type { PreviewProps as PreviewV2Props } from './engine/preview/Preview'
