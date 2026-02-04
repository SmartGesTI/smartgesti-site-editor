/**
 * Hover Effects - Button Hover Styles Generator
 *
 * Gera estilos CSS para hover de botões baseado no efeito selecionado.
 *
 * Efeitos disponíveis:
 * - darken: Escurece o botão e eleva
 * - lighten: Clareia o botão e eleva
 * - scale: Aumenta de tamanho
 * - glow: Brilho neon ao redor
 * - shadow: Sombra elevada dramática
 * - pulse: Animação de pulso infinita
 * - shine: Luz que desliza sobre o botão
 */

import { ButtonHoverConfig, HoverStyles } from "./types";
import { hexToRgba, adjustColor, normalizeIntensity } from "./colorUtils";

/**
 * Gera estilos CSS para hover de botões
 *
 * @param config - Configuração do efeito
 * @returns Objeto com estilos base e hover
 */
export function generateButtonHoverStyles(config: ButtonHoverConfig): HoverStyles {
    const {
        effect,
        intensity: rawIntensity,
        buttonColor,
        variant = "solid",
    } = config;

    // Normalizar intensidade (10-100 → 0.15-1)
    const intensity = normalizeIntensity(rawIntensity);

    const baseStyles: string[] = [];
    const hoverStyles: string[] = [];

    switch (effect) {
        case "none":
            // Sem efeito
            break;

        case "darken": {
            // Escurecer com elevação suave
            const darkenAmount = 0.10 + (intensity * 0.25);
            const darkerColor = adjustColor(buttonColor, darkenAmount, false);
            if (variant === "solid") {
                hoverStyles.push(`background-color: ${darkerColor} !important`);
            } else {
                hoverStyles.push(`border-color: ${darkerColor} !important`);
                hoverStyles.push(`color: ${darkerColor} !important`);
            }
            const translateY = Math.round(1 + intensity * 3);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }

        case "lighten": {
            // Clarear com elevação
            const lightenAmount = 0.10 + (intensity * 0.25);
            const lighterColor = adjustColor(buttonColor, lightenAmount, true);
            if (variant === "solid") {
                hoverStyles.push(`background-color: ${lighterColor} !important`);
            } else {
                hoverStyles.push(`border-color: ${lighterColor} !important`);
                hoverStyles.push(`color: ${lighterColor} !important`);
            }
            const translateY = Math.round(1 + intensity * 2);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }

        case "scale": {
            // Escala suave
            const scale = 1.05 + (intensity * 0.07);
            hoverStyles.push(`transform: scale(${scale.toFixed(2)}) !important`);
            hoverStyles.push(`position: relative !important`);
            hoverStyles.push(`z-index: 10 !important`);
            break;
        }

        case "glow": {
            // Brilho neon com múltiplas camadas
            const glowSize1 = Math.round(6 + (intensity * 10));
            const glowSize2 = Math.round(12 + (intensity * 20));
            const glowSize3 = Math.round(24 + (intensity * 30));
            const shadow1 = `0 0 ${glowSize1}px ${hexToRgba(buttonColor, 0.8)}`;
            const shadow2 = `0 0 ${glowSize2}px ${hexToRgba(buttonColor, 0.5)}`;
            const shadow3 = `0 0 ${glowSize3}px ${hexToRgba(buttonColor, 0.3)}`;
            hoverStyles.push(`box-shadow: ${shadow1}, ${shadow2}, ${shadow3} !important`);
            break;
        }

        case "shadow": {
            // Sombra elevada dramática
            const shadowY = Math.round(4 + (intensity * 8));
            const shadowBlur = Math.round(12 + (intensity * 16));
            const shadowOpacity = 0.25 + (intensity * 0.30);
            hoverStyles.push(`box-shadow: 0 ${shadowY}px ${shadowBlur}px -2px ${hexToRgba(buttonColor, shadowOpacity)} !important`);
            const translateY = Math.round(2 + intensity * 3);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }

        case "pulse": {
            // Efeito de pulso com sombra animada
            const pulseSize = Math.round(8 + (intensity * 12));
            baseStyles.push(`animation: none !important`);
            hoverStyles.push(`animation: sg-btn-pulse 1s ease-in-out infinite !important`);
            hoverStyles.push(`--pulse-color: ${hexToRgba(buttonColor, 0.5)} !important`);
            hoverStyles.push(`--pulse-size: ${pulseSize}px !important`);
            break;
        }

        case "shine": {
            // Brilho que passa por cima do botão
            baseStyles.push(`position: relative !important`);
            baseStyles.push(`overflow: hidden !important`);
            // O pseudo-elemento ::before será adicionado via CSS global
            hoverStyles.push(`--shine-active: 1 !important`);
            break;
        }

        default: {
            // Fallback para darken
            const darkerColor = adjustColor(buttonColor, 0.15, false);
            hoverStyles.push(`background-color: ${darkerColor} !important`);
            hoverStyles.push(`transform: translateY(-2px) !important`);
        }
    }

    return {
        base: baseStyles.join("; "),
        hover: hoverStyles.join("; "),
    };
}

/**
 * Retorna os keyframes CSS necessários para animações de botões
 */
export function getButtonHoverKeyframes(): string {
    return `
    @keyframes sg-btn-pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 var(--pulse-color, rgba(59, 130, 246, 0.5));
      }
      50% {
        box-shadow: 0 0 0 var(--pulse-size, 10px) transparent;
      }
    }
    `;
}

/**
 * Retorna CSS para o efeito shine (pseudo-elemento)
 *
 * @param selector - Seletor CSS do botão
 */
export function getShineEffectCSS(selector: string): string {
    return `
    ${selector}::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.5s ease;
      pointer-events: none;
    }

    ${selector}:hover::before {
      left: 100%;
    }
    `;
}
