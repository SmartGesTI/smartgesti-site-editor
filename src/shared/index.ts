/**
 * SmartGesti Site Editor - Shared Module
 * 
 * Este módulo exporta tipos, prompts, validadores e templates
 * para uso por backends que consomem o Editor
 * 
 * Uso:
 * import { 
 *   SiteDocumentV2, 
 *   validateDocument, 
 *   SITE_GENERATOR_SYSTEM_PROMPT,
 *   templates 
 * } from '@smartgesti/site-editor/shared'
 */

// ============================================
// SCHEMA & TYPES
// ============================================
export type {
  // Document types
  BlockType,
  BlockBase,
  Block,
  SiteDocumentV2,
  DocumentMeta,
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
  SocialLinksBlock,
  // Composition blocks
  CardBlock,
  SectionBlock,
  // Landing page blocks
  HeroBlock,
  FeatureBlock,
  FeatureGridBlock,
  PricingBlock,
  PricingCardBlock,
  TestimonialBlock,
  TestimonialGridBlock,
  FAQBlock,
  FAQItemBlock,
  CTABlock,
  StatsBlock,
  StatItemBlock,
  LogoCloudBlock,
  NavbarBlock,
  // Form blocks
  FormBlock,
  InputBlock,
  TextareaBlock,
  FormSelectBlock,
  // Theme types
  ThemeTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  EffectTokens,
  LayoutTokens,
  ComponentTokens,
  ThemePreset,
} from './schema'

// Theme utilities
export {
  defaultThemeTokens,
  generateThemeCSSVariables,
  themePresets,
  generateBlockId,
} from './schema'

// ============================================
// PROMPTS
// ============================================
export {
  AVAILABLE_BLOCK_TYPES,
  SCHEMA_REFERENCE,
  SITE_GENERATOR_SYSTEM_PROMPT,
  SECTION_REFINE_SYSTEM_PROMPT,
  CONTENT_GENERATOR_SYSTEM_PROMPT,
  buildSiteGenerationPrompt,
  buildSectionRefinePrompt,
} from './prompts/siteGeneratorPrompt'

export type { GenerationOptions } from './prompts/siteGeneratorPrompt'

// ============================================
// VALIDATORS
// ============================================
export {
  validateDocument,
  sanitizeDocument,
  ensureBlockIds,
} from './validators'

export type {
  ValidationError,
  ValidationResult,
} from './validators'

// ============================================
// TEMPLATES
// ============================================
export {
  // Individual templates
  landingSaasTemplate,
  landingEscolaTemplate,
  landingPortfolioTemplate,
  landingEmpresaTemplate,
  landingEventoTemplate,
  // Template utilities
  templates,
  templateList,
  getTemplate,
  getTemplatesByCategory,
  getTemplatesByTag,
  searchTemplates,
} from './templates'

export type {
  TemplateInfo,
  TemplateId,
} from './templates'
