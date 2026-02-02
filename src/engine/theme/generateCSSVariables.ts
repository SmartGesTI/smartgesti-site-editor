import type { ThemeTokens, PartialThemeTokens } from './themeTokens';
import { defaultTheme } from './defaultTheme';

/**
 * Mescla tokens parciais com o tema padrão
 */
export function mergeThemeTokens(partial: PartialThemeTokens): ThemeTokens {
  return {
    name: partial.name ?? defaultTheme.name,
    colors: {
      ...defaultTheme.colors,
      ...partial.colors,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...partial.spacing,
    },
    typography: {
      ...defaultTheme.typography,
      ...partial.typography,
      fontSize: {
        ...defaultTheme.typography.fontSize,
        ...partial.typography?.fontSize,
      },
      fontWeight: {
        ...defaultTheme.typography.fontWeight,
        ...partial.typography?.fontWeight,
      },
      lineHeight: {
        ...defaultTheme.typography.lineHeight,
        ...partial.typography?.lineHeight,
      },
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      ...partial.borderRadius,
    },
    shadows: {
      ...defaultTheme.shadows,
      ...partial.shadows,
    },
    breakpoints: {
      ...defaultTheme.breakpoints,
      ...partial.breakpoints,
    },
  };
}

/**
 * Gera CSS Variables a partir dos ThemeTokens
 *
 * As variáveis são geradas com o prefixo --site- para evitar
 * conflitos com o CSS do host application.
 *
 * @param tokens - Tokens do tema
 * @returns String CSS com as variáveis
 *
 * @example
 * ```typescript
 * const css = generateCSSVariables(myTheme);
 * // Resultado:
 * // :root {
 * //   --site-color-primary: 217 91% 60%;
 * //   --site-spacing-md: 1rem;
 * //   ...
 * // }
 * ```
 */
export function generateCSSVariables(tokens: ThemeTokens | PartialThemeTokens): string {
  const theme = 'name' in tokens && tokens.name !== undefined
    ? tokens as ThemeTokens
    : mergeThemeTokens(tokens as PartialThemeTokens);

  const variables: string[] = [];

  // Cores
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    variables.push(`  --site-color-${cssKey}: ${value};`);
  });

  // Espaçamentos
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`  --site-spacing-${key}: ${value};`);
  });

  // Tipografia
  variables.push(`  --site-font-family: ${theme.typography.fontFamily};`);
  if (theme.typography.fontFamilyHeading) {
    variables.push(`  --site-font-family-heading: ${theme.typography.fontFamilyHeading};`);
  } else {
    variables.push(`  --site-font-family-heading: ${theme.typography.fontFamily};`);
  }

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables.push(`  --site-font-size-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`  --site-font-weight-${key}: ${value};`);
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables.push(`  --site-line-height-${key}: ${value};`);
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables.push(`  --site-radius-${key}: ${value};`);
  });

  // Sombras
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables.push(`  --site-shadow-${key}: ${value};`);
  });

  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    variables.push(`  --site-breakpoint-${key}: ${value};`);
  });

  return `:root {\n${variables.join('\n')}\n}`;
}

/**
 * Gera CSS Variables como objeto JavaScript
 * Útil para injetar via style prop em React
 */
export function generateCSSVariablesObject(
  tokens: ThemeTokens | PartialThemeTokens
): Record<string, string> {
  const theme = 'name' in tokens && tokens.name !== undefined
    ? tokens as ThemeTokens
    : mergeThemeTokens(tokens as PartialThemeTokens);

  const variables: Record<string, string> = {};

  // Cores
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    variables[`--site-color-${cssKey}`] = value;
  });

  // Espaçamentos
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--site-spacing-${key}`] = value;
  });

  // Tipografia
  variables['--site-font-family'] = theme.typography.fontFamily;
  variables['--site-font-family-heading'] = theme.typography.fontFamilyHeading ?? theme.typography.fontFamily;

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables[`--site-font-size-${key}`] = value;
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables[`--site-font-weight-${key}`] = value;
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables[`--site-line-height-${key}`] = value;
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--site-radius-${key}`] = value;
  });

  // Sombras
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables[`--site-shadow-${key}`] = value;
  });

  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    variables[`--site-breakpoint-${key}`] = value;
  });

  return variables;
}

/**
 * Cria uma string de estilo inline para aplicar o tema a um elemento
 * Útil para componentes React que precisam aplicar o tema localmente
 */
export function createThemeStyle(tokens: ThemeTokens | PartialThemeTokens): string {
  const variables = generateCSSVariablesObject(tokens);
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}
