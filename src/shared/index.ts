/**
 * SmartGesti Site Editor - Shared Module
 *
 * Este módulo exporta tipos, validadores e templates
 * para uso por backends que consomem o Editor
 *
 * Uso:
 * import {
 *   SiteDocument,
 *   validateDocument,
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
  SiteDocument,
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
} from "./schema";

// Theme utilities
export {
  defaultThemeTokens,
  generateThemeCSSVariables,
  themePresets,
  generateBlockId,
} from "./schema";

// ============================================
// VALIDATORS
// ============================================
export {
  validateDocument,
  sanitizeDocument,
  ensureBlockIds,
} from "./validators";

export type { ValidationError, ValidationResult } from "./validators";

// ============================================
// TEMPLATES
// ============================================
export {
  // Individual templates
  escolaPremiumTemplate,
  escolaEdviTemplate,
  escolaZilomTemplate,
  // Template utilities
  templates,
  templateList,
  getTemplate,
  getTemplatesByCategory,
  getTemplatesByTag,
  searchTemplates,
} from "./templates";

export type { TemplateInfo, TemplateId } from "./templates";
