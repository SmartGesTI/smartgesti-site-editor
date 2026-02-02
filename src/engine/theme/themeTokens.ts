/**
 * ThemeTokens - Sistema de Design Tokens para Sites
 *
 * Define a estrutura de tokens de design que podem ser customizados
 * pelo usuário no editor e são convertidos em CSS Variables para
 * estilização dinâmica dos sites.
 */

/**
 * Cores do tema em formato HSL (sem 'hsl()' wrapper)
 * Exemplo: '217 91% 60%' para azul
 */
export interface ThemeColors {
  /** Cor principal da marca */
  primary: string;
  /** Cor secundária/complementar */
  secondary: string;
  /** Cor de destaque para CTAs e elementos importantes */
  accent: string;
  /** Cor de fundo principal */
  background: string;
  /** Cor do texto principal */
  foreground: string;
  /** Cor de bordas e separadores */
  border: string;
  /** Cor para elementos menos importantes */
  muted: string;
  /** Cor de fundo para elementos mutados */
  mutedForeground: string;
  /** Cor para estados de sucesso */
  success: string;
  /** Cor para estados de erro */
  error: string;
  /** Cor para estados de aviso */
  warning: string;
}

/**
 * Espaçamentos do tema
 * Valores em rem ou px
 */
export interface ThemeSpacing {
  xs: string;   // 0.25rem (4px)
  sm: string;   // 0.5rem (8px)
  md: string;   // 1rem (16px)
  lg: string;   // 1.5rem (24px)
  xl: string;   // 2rem (32px)
  '2xl': string; // 3rem (48px)
  '3xl': string; // 4rem (64px)
}

/**
 * Tipografia do tema
 */
export interface ThemeTypography {
  /** Família de fonte principal */
  fontFamily: string;
  /** Família de fonte para títulos (opcional, usa fontFamily se não definido) */
  fontFamilyHeading?: string;
  /** Tamanhos de fonte */
  fontSize: {
    xs: string;   // 0.75rem (12px)
    sm: string;   // 0.875rem (14px)
    base: string; // 1rem (16px)
    lg: string;   // 1.125rem (18px)
    xl: string;   // 1.25rem (20px)
    '2xl': string; // 1.5rem (24px)
    '3xl': string; // 1.875rem (30px)
    '4xl': string; // 2.25rem (36px)
    '5xl': string; // 3rem (48px)
    '6xl': string; // 3.75rem (60px)
  };
  /** Pesos de fonte */
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  /** Alturas de linha */
  lineHeight: {
    tight: string;   // 1.25
    normal: string;  // 1.5
    relaxed: string; // 1.75
  };
}

/**
 * Bordas arredondadas
 */
export interface ThemeBorderRadius {
  none: string;  // 0
  sm: string;    // 0.25rem (4px)
  md: string;    // 0.5rem (8px)
  lg: string;    // 0.75rem (12px)
  xl: string;    // 1rem (16px)
  '2xl': string; // 1.5rem (24px)
  full: string;  // 9999px
}

/**
 * Sombras
 */
export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Breakpoints para responsividade
 */
export interface ThemeBreakpoints {
  sm: string;  // 640px
  md: string;  // 768px
  lg: string;  // 1024px
  xl: string;  // 1280px
  '2xl': string; // 1536px
}

/**
 * Estrutura completa de tokens do tema
 */
export interface ThemeTokens {
  /** Nome do tema para identificação */
  name: string;
  /** Cores do tema */
  colors: ThemeColors;
  /** Espaçamentos */
  spacing: ThemeSpacing;
  /** Tipografia */
  typography: ThemeTypography;
  /** Bordas arredondadas */
  borderRadius: ThemeBorderRadius;
  /** Sombras */
  shadows: ThemeShadows;
  /** Breakpoints */
  breakpoints: ThemeBreakpoints;
}

/**
 * Tokens parciais para override
 * Permite customizar apenas alguns valores
 */
export type PartialThemeTokens = {
  name?: string;
  colors?: Partial<ThemeColors>;
  spacing?: Partial<ThemeSpacing>;
  typography?: Partial<ThemeTypography> & {
    fontSize?: Partial<ThemeTypography['fontSize']>;
    fontWeight?: Partial<ThemeTypography['fontWeight']>;
    lineHeight?: Partial<ThemeTypography['lineHeight']>;
  };
  borderRadius?: Partial<ThemeBorderRadius>;
  shadows?: Partial<ThemeShadows>;
  breakpoints?: Partial<ThemeBreakpoints>;
};
