/**
 * SmartGesti Site Editor
 * Editor de sites compartilhado para projetos SmartGesti
 */

// CSS será importado pelos componentes que precisam dele
// SiteViewer e PreviewPanel importam diretamente

// Legacy exports (mantidos para compatibilidade)
export { SiteEditor } from './components/SiteEditor'
export { SiteViewer } from './components/SiteViewer'
export { exportSiteToHtml } from './utils/htmlExporter'
export { applySiteTheme, removeSiteTheme } from './utils/themeApplier'
export { PaletteSelector, defaultColorPalettes } from './components/editors/PaletteSelector'
export { SectionGlow } from './components/effects/SectionGlow'
export * from './components/inputs'
export { moduleRegistry, createModule } from './modules/registry'

// Landing Page Builder V2 exports
export { LandingPageEditorV2 } from './editor/LandingPageEditorV2'
export type { UploadConfig, LandingPageEditorV2Props } from './editor/LandingPageEditorV2'
export { LandingPageViewerV2 } from './viewer/LandingPageViewerV2'
export type {
  Site,
  Page,
  Component,
  ComponentType,
  ComponentDefinition,
  Template,
  SiteEditorProps,
  SiteViewerProps,
  ColorPalette,
  SiteTheme,
  GlowVariant,
  GlowSettings,
  ComponentGlow,
} from './types'
export type {
  SiteModule,
  ModuleRegistry,
} from './types/module'

// Engine V2 exports (Lovable-like)
export * from './engine'
