/**
 * Hover Effects - CSS Generator
 *
 * Funções para gerar CSS completo com seletores.
 */

import { HoverStyles, HoverCSS } from "./types";

/**
 * Gera regras CSS completas a partir dos estilos de hover
 *
 * @param selector - Seletor CSS base (ex: "[data-block-id='123'] .link")
 * @param styles - Estilos base e hover
 * @param options - Opções adicionais
 * @returns CSS rules formatadas
 */
export function generateHoverCSS(
    selector: string,
    styles: HoverStyles,
    options: {
        includeTransition?: boolean;
        transitionDuration?: string;
    } = {}
): HoverCSS {
    const {
        includeTransition = true,
        transitionDuration = "0.3s",
    } = options;

    const result: HoverCSS = {
        hoverRule: "",
    };

    // Regra base (se houver estilos preparatórios)
    if (styles.base) {
        const transitionStyle = includeTransition
            ? `transition: all ${transitionDuration} ease;`
            : "";
        result.baseRule = `
    ${selector} {
      ${styles.base}
      ${transitionStyle}
    }`;
    }

    // Regra hover
    const hoverTransition = includeTransition
        ? `transition: all ${transitionDuration} ease;`
        : "";
    result.hoverRule = `
    ${selector}:hover {
      ${styles.hover}
      ${hoverTransition}
    }`;

    return result;
}

/**
 * Combina múltiplas regras CSS em um bloco único
 */
export function combineCSS(...cssBlocks: (string | undefined)[]): string {
    return cssBlocks
        .filter(Boolean)
        .join("\n")
        .trim();
}

/**
 * Gera CSS com escopo para um bloco específico
 *
 * @param blockId - ID do bloco para escopo
 * @param className - Classe do elemento
 * @param styles - Estilos hover
 * @param options - Opções adicionais
 */
export function generateScopedHoverCSS(
    blockId: string,
    className: string,
    styles: HoverStyles,
    options?: {
        includeTransition?: boolean;
        transitionDuration?: string;
    }
): string {
    const selector = `[data-block-id="${blockId}"] .${className}`;
    const css = generateHoverCSS(selector, styles, options);

    return combineCSS(css.baseRule, css.hoverRule);
}
