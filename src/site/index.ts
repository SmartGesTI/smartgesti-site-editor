/**
 * Site Module - Components and utilities for site rendering
 *
 * This module provides:
 * - Site blocks (Hero, Features, Navbar, Footer, etc.)
 * - Site styles (Vanilla Extract)
 * - Theme utilities
 */

// Site blocks
export * from './blocks';

// Block renderer
export {
  BlockRenderer,
  BlockListRenderer,
  registerBlockComponent,
  getBlockComponent,
} from './BlockRenderer';
export type { BlockData, BlockRendererProps, BlockListRendererProps } from './BlockRenderer';

// Re-export styles for convenience
export * from '../styles/site';

// Re-export theme types
export type {
  SiteThemeTokens,
  PartialSiteThemeTokens,
  SiteThemeColors,
  SiteThemeSpacing,
  SiteThemeTypography,
  SiteThemeBorderRadius,
  SiteThemeShadows,
} from '../engine/theme';

// Re-export theme utilities
export {
  siteDefaultTheme,
  siteDarkTheme,
  generateSiteCSSVariables,
  generateSiteCSSVariablesObject,
  createSiteThemeStyle,
  mergeSiteThemeTokens,
} from '../engine/theme';
