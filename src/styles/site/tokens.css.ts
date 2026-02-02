import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css';

/**
 * Contract de variáveis CSS do tema do site
 *
 * Define o "contrato" de variáveis que todo tema deve implementar.
 * Os valores reais são injetados dinamicamente via generateCSSVariables().
 */
export const siteVars = createThemeContract({
  colors: {
    primary: null,
    secondary: null,
    accent: null,
    background: null,
    foreground: null,
    border: null,
    muted: null,
    mutedForeground: null,
    success: null,
    error: null,
    warning: null,
  },
  spacing: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
    '3xl': null,
  },
  typography: {
    fontFamily: null,
    fontFamilyHeading: null,
    fontSize: {
      xs: null,
      sm: null,
      base: null,
      lg: null,
      xl: null,
      '2xl': null,
      '3xl': null,
      '4xl': null,
      '5xl': null,
      '6xl': null,
    },
    fontWeight: {
      normal: null,
      medium: null,
      semibold: null,
      bold: null,
    },
    lineHeight: {
      tight: null,
      normal: null,
      relaxed: null,
    },
  },
  borderRadius: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
    full: null,
  },
  shadows: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
});

/**
 * Tema padrão usando variáveis CSS
 *
 * Os valores aqui referenciam as CSS variables que serão
 * injetadas pelo host application via generateCSSVariables().
 */
createGlobalTheme(':root', siteVars, {
  colors: {
    primary: 'var(--site-color-primary, hsl(217 91% 60%))',
    secondary: 'var(--site-color-secondary, hsl(262 83% 58%))',
    accent: 'var(--site-color-accent, hsl(142 76% 36%))',
    background: 'var(--site-color-background, hsl(0 0% 100%))',
    foreground: 'var(--site-color-foreground, hsl(222 47% 11%))',
    border: 'var(--site-color-border, hsl(214 32% 91%))',
    muted: 'var(--site-color-muted, hsl(210 40% 96%))',
    mutedForeground: 'var(--site-color-muted-foreground, hsl(215 16% 47%))',
    success: 'var(--site-color-success, hsl(142 76% 36%))',
    error: 'var(--site-color-error, hsl(0 84% 60%))',
    warning: 'var(--site-color-warning, hsl(38 92% 50%))',
  },
  spacing: {
    xs: 'var(--site-spacing-xs, 0.25rem)',
    sm: 'var(--site-spacing-sm, 0.5rem)',
    md: 'var(--site-spacing-md, 1rem)',
    lg: 'var(--site-spacing-lg, 1.5rem)',
    xl: 'var(--site-spacing-xl, 2rem)',
    '2xl': 'var(--site-spacing-2xl, 3rem)',
    '3xl': 'var(--site-spacing-3xl, 4rem)',
  },
  typography: {
    fontFamily: 'var(--site-font-family, Inter, system-ui, sans-serif)',
    fontFamilyHeading: 'var(--site-font-family-heading, Inter, system-ui, sans-serif)',
    fontSize: {
      xs: 'var(--site-font-size-xs, 0.75rem)',
      sm: 'var(--site-font-size-sm, 0.875rem)',
      base: 'var(--site-font-size-base, 1rem)',
      lg: 'var(--site-font-size-lg, 1.125rem)',
      xl: 'var(--site-font-size-xl, 1.25rem)',
      '2xl': 'var(--site-font-size-2xl, 1.5rem)',
      '3xl': 'var(--site-font-size-3xl, 1.875rem)',
      '4xl': 'var(--site-font-size-4xl, 2.25rem)',
      '5xl': 'var(--site-font-size-5xl, 3rem)',
      '6xl': 'var(--site-font-size-6xl, 3.75rem)',
    },
    fontWeight: {
      normal: 'var(--site-font-weight-normal, 400)',
      medium: 'var(--site-font-weight-medium, 500)',
      semibold: 'var(--site-font-weight-semibold, 600)',
      bold: 'var(--site-font-weight-bold, 700)',
    },
    lineHeight: {
      tight: 'var(--site-line-height-tight, 1.25)',
      normal: 'var(--site-line-height-normal, 1.5)',
      relaxed: 'var(--site-line-height-relaxed, 1.75)',
    },
  },
  borderRadius: {
    none: 'var(--site-radius-none, 0)',
    sm: 'var(--site-radius-sm, 0.25rem)',
    md: 'var(--site-radius-md, 0.5rem)',
    lg: 'var(--site-radius-lg, 0.75rem)',
    xl: 'var(--site-radius-xl, 1rem)',
    '2xl': 'var(--site-radius-2xl, 1.5rem)',
    full: 'var(--site-radius-full, 9999px)',
  },
  shadows: {
    none: 'var(--site-shadow-none, none)',
    sm: 'var(--site-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
    md: 'var(--site-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1))',
    lg: 'var(--site-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1))',
    xl: 'var(--site-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1))',
  },
});
