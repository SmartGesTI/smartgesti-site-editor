/**
 * Responsive Grid Helper
 * Utilitários para criar grids responsivos com media queries
 */

/**
 * Configuração de colunas responsivas por breakpoint
 */
export interface ResponsiveGridConfig {
  /** Número de colunas em mobile (< 640px) */
  sm: number;
  /** Número de colunas em tablet (640px - 1023px) */
  md: number;
  /** Número de colunas em desktop (>= 1024px) */
  lg: number;
}

/**
 * Breakpoints padrão do sistema
 */
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Resolve configuração de colunas responsivas
 *
 * Aceita tanto um número fixo quanto um objeto com breakpoints específicos
 *
 * @param cols - Número de colunas ou objeto com breakpoints {sm, md, lg}
 * @param defaultSm - Valor padrão para mobile (default: 1)
 * @param defaultMd - Valor padrão para tablet (default: 2)
 * @param defaultLg - Valor padrão para desktop (default: 3)
 * @returns Configuração completa de colunas por breakpoint
 *
 * @example
 * // Número fixo: converte para configuração mobile-first
 * resolveResponsiveColumns(3) // → {sm: 1, md: 2, lg: 3}
 * resolveResponsiveColumns(4) // → {sm: 1, md: 2, lg: 4}
 *
 * @example
 * // Objeto com breakpoints específicos
 * resolveResponsiveColumns({sm: 1, md: 3, lg: 4}) // → {sm: 1, md: 3, lg: 4}
 * resolveResponsiveColumns({lg: 5}) // → {sm: 1, md: 2, lg: 5} (defaults para sm e md)
 */
export function resolveResponsiveColumns(
  cols: number | { sm?: number; md?: number; lg?: number },
  defaultSm: number = 1,
  defaultMd: number = 2,
  defaultLg: number = 3,
): ResponsiveGridConfig {
  if (typeof cols === "number") {
    // Se é número fixo, criar configuração mobile-first progressiva
    return {
      sm: Math.min(cols, defaultSm),
      md: Math.min(cols, defaultMd),
      lg: cols,
    };
  }

  // Se é objeto, usar valores fornecidos ou defaults
  return {
    sm: cols.sm ?? defaultSm,
    md: cols.md ?? defaultMd,
    lg: cols.lg ?? defaultLg,
  };
}

/**
 * Gera media queries CSS para grid responsivo
 *
 * @param elementId - ID único do elemento grid
 * @param config - Configuração de colunas por breakpoint
 * @param additionalMdStyles - CSS adicional para aplicar em tablet (opcional)
 * @param additionalLgStyles - CSS adicional para aplicar em desktop (opcional)
 * @returns String com media queries CSS completas
 *
 * @example
 * const css = generateGridMediaQueries("grid-123", {sm: 1, md: 2, lg: 3});
 * // Retorna:
 * // @media (min-width: 640px) {
 * //   #grid-123 { grid-template-columns: repeat(2, 1fr); }
 * // }
 * // @media (min-width: 1024px) {
 * //   #grid-123 { grid-template-columns: repeat(3, 1fr); }
 * // }
 */
export function generateGridMediaQueries(
  elementId: string,
  config: ResponsiveGridConfig,
  additionalMdStyles?: string,
  additionalLgStyles?: string,
): string {
  const mdStyles = `grid-template-columns: repeat(${config.md}, 1fr);${additionalMdStyles ? ` ${additionalMdStyles}` : ""}`;
  const lgStyles = `grid-template-columns: repeat(${config.lg}, 1fr);${additionalLgStyles ? ` ${additionalLgStyles}` : ""}`;

  return `
    /* Tablet: ${config.md} colunas */
    @media (min-width: ${BREAKPOINTS.sm}) {
      #${elementId} {
        ${mdStyles}
      }
    }

    /* Desktop: ${config.lg} colunas */
    @media (min-width: ${BREAKPOINTS.lg}) {
      #${elementId} {
        ${lgStyles}
      }
    }
  `.trim();
}

/**
 * Gera media queries CSS para padding responsivo
 *
 * @param elementId - ID único do elemento
 * @param smPadding - Padding em mobile
 * @param mdPadding - Padding em tablet
 * @param lgPadding - Padding em desktop
 * @returns String com media queries CSS
 *
 * @example
 * generatePaddingMediaQueries("container-123", "1rem", "1.5rem", "2rem");
 */
export function generatePaddingMediaQueries(
  elementId: string,
  smPadding: string,
  mdPadding: string,
  lgPadding: string,
): string {
  return `
    /* Base: Mobile padding */
    #${elementId} {
      padding: ${smPadding};
    }

    /* Tablet padding */
    @media (min-width: ${BREAKPOINTS.md}) {
      #${elementId} {
        padding: ${mdPadding};
      }
    }

    /* Desktop padding */
    @media (min-width: ${BREAKPOINTS.lg}) {
      #${elementId} {
        padding: ${lgPadding};
      }
    }
  `.trim();
}

/**
 * Gera media queries para gap responsivo
 *
 * @param elementId - ID único do elemento
 * @param smGap - Gap em mobile
 * @param mdGap - Gap em tablet
 * @param lgGap - Gap em desktop
 * @returns String com media queries CSS
 */
export function generateGapMediaQueries(
  elementId: string,
  smGap: string,
  mdGap: string,
  lgGap: string,
): string {
  return `
    /* Base: Mobile gap */
    #${elementId} {
      gap: ${smGap};
    }

    /* Tablet gap */
    @media (min-width: ${BREAKPOINTS.sm}) {
      #${elementId} {
        gap: ${mdGap};
      }
    }

    /* Desktop gap */
    @media (min-width: ${BREAKPOINTS.lg}) {
      #${elementId} {
        gap: ${lgGap};
      }
    }
  `.trim();
}

/**
 * Gera media queries para flex-direction responsivo
 *
 * Útil para Stack components que precisam mudar de column (mobile) para row (desktop)
 *
 * @param elementId - ID único do elemento
 * @param smDirection - Direção em mobile (default: "column")
 * @param lgDirection - Direção em desktop (default: "row")
 * @returns String com media queries CSS
 */
export function generateFlexDirectionMediaQueries(
  elementId: string,
  smDirection: "row" | "column" | "row-reverse" | "column-reverse" = "column",
  lgDirection: "row" | "column" | "row-reverse" | "column-reverse" = "row",
): string {
  return `
    /* Base: Mobile direction */
    #${elementId} {
      flex-direction: ${smDirection};
    }

    /* Desktop direction */
    @media (min-width: ${BREAKPOINTS.lg}) {
      #${elementId} {
        flex-direction: ${lgDirection};
      }
    }
  `.trim();
}

/**
 * Gera CSS completo para um grid responsivo (inline + media queries)
 *
 * Helper que combina baseStyle inline + media queries em um só lugar
 *
 * IMPORTANTE: grid-template-columns é definido APENAS no CSS (não inline)
 * para permitir que media queries funcionem corretamente
 *
 * @param elementId - ID único do grid
 * @param config - Configuração de colunas
 * @param gap - Gap do grid
 * @param additionalInlineStyles - Estilos inline adicionais
 * @returns Objeto com {inlineStyles, mediaQueries}
 */
export function generateResponsiveGridStyles(
  elementId: string,
  config: ResponsiveGridConfig,
  gap: string = "1rem",
  additionalInlineStyles?: string,
): { inlineStyles: string; mediaQueries: string } {
  // IMPORTANTE: Não incluir grid-template-columns aqui - vai no CSS
  const inlineStyles = `display: grid; gap: ${gap};${additionalInlineStyles ? ` ${additionalInlineStyles}` : ""}`;

  // Gerar CSS completo com base mobile + media queries
  const mediaQueries = `
    /* Base: Mobile ${config.sm} coluna(s) */
    #${elementId} {
      grid-template-columns: repeat(${config.sm}, 1fr);
    }

    /* Tablet: ${config.md} colunas */
    @media (min-width: ${BREAKPOINTS.sm}) {
      #${elementId} {
        grid-template-columns: repeat(${config.md}, 1fr);
      }
    }

    /* Desktop: ${config.lg} colunas */
    @media (min-width: ${BREAKPOINTS.lg}) {
      #${elementId} {
        grid-template-columns: repeat(${config.lg}, 1fr);
      }
    }
  `.trim();

  return {
    inlineStyles,
    mediaQueries,
  };
}
