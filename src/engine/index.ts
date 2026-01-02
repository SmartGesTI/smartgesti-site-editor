/**
 * Engine V2 - Entry Point
 * Exporta todos os módulos do engine V2
 */

// Schema
export * from './schema/siteDocument'
export * from './schema/themeTokens'

// Registry
export * from './registry/registry'
export * from './registry/types'
export * from './registry/blocks'
// Garantir que blocks seja importado para executar registerAllBlocks()
import './registry/blocks'

// Render
export * from './render/renderNode'
export * from './render/renderPage'

// Export
export * from './export/exportHtml'
export * from './export/sanitizeHtml'

// Preview
export * from './preview/PreviewV2'

// Patch
export * from './patch/types'
export * from './patch/applyPatch'
export * from './patch/history'
export * from './patch/PatchBuilder'

// Presets
export * from './presets/themePresets'

// Generators
export * from './generators/generateLandingPage'
