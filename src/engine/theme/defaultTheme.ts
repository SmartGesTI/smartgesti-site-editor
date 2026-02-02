import type { ThemeTokens } from './themeTokens';

/**
 * Tema padrão do SmartGestI Site Editor
 *
 * Baseado em um design moderno e limpo com cores neutras
 * e azul como cor primária.
 */
export const defaultTheme: ThemeTokens = {
  name: 'default',

  colors: {
    // Cores principais
    primary: '217 91% 60%',      // Azul vibrante (#3b82f6)
    secondary: '262 83% 58%',    // Roxo (#8b5cf6)
    accent: '142 76% 36%',       // Verde (#22c55e)

    // Cores base
    background: '0 0% 100%',     // Branco (#ffffff)
    foreground: '222 47% 11%',   // Quase preto (#0f172a)
    border: '214 32% 91%',       // Cinza claro (#e2e8f0)

    // Cores mutadas
    muted: '210 40% 96%',        // Cinza muito claro (#f1f5f9)
    mutedForeground: '215 16% 47%', // Cinza médio (#64748b)

    // Cores de estado
    success: '142 76% 36%',      // Verde (#22c55e)
    error: '0 84% 60%',          // Vermelho (#ef4444)
    warning: '38 92% 50%',       // Amarelo/Laranja (#f59e0b)
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyHeading: undefined, // Usa fontFamily

    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Tema escuro
 */
export const darkTheme: ThemeTokens = {
  ...defaultTheme,
  name: 'dark',

  colors: {
    // Cores principais (mantidas vibrantes)
    primary: '217 91% 60%',
    secondary: '262 83% 58%',
    accent: '142 76% 36%',

    // Cores base invertidas
    background: '222 47% 11%',   // Quase preto (#0f172a)
    foreground: '210 40% 98%',   // Quase branco (#f8fafc)
    border: '217 33% 17%',       // Cinza escuro (#1e293b)

    // Cores mutadas
    muted: '217 33% 17%',        // Cinza escuro (#1e293b)
    mutedForeground: '215 20% 65%', // Cinza médio (#94a3b8)

    // Cores de estado
    success: '142 76% 36%',
    error: '0 84% 60%',
    warning: '38 92% 50%',
  },
};
