/**
 * Hover Effects - Button Hover Styles Generator
 *
 * Gera estilos CSS para hover de botões baseado no efeito selecionado.
 *
 * Efeitos Principais:
 * - darken: Escurece o botão e eleva
 * - lighten: Clareia o botão e eleva
 * - scale: Aumenta de tamanho
 * - glow: Brilho neon ao redor
 * - shadow: Sombra elevada dramática
 * - pulse: Animação de pulso infinita
 *
 * Efeitos Overlay (combinam com os principais):
 * - shine: ✨ Luz branca que desliza
 * - ripple: 🌊 Ondas expandindo do centro
 * - gradient: 🌈 Gradiente colorido passando
 * - sparkle: ⭐ Faíscas brilhantes
 * - border-glow: 💫 Borda que pulsa
 */

import { ButtonHoverConfig, ButtonOverlayConfig, ButtonHoverOverlay, HoverStyles } from "./types";
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
 * Gera CSS para um efeito de overlay específico
 *
 * @param selector - Seletor CSS do botão
 * @param config - Configuração do overlay
 * @returns CSS completo para o overlay
 */
export function generateButtonOverlayCSS(
    selector: string,
    config: ButtonOverlayConfig,
): string {
    const { overlay, overlayColor, primaryColor = "#3b82f6" } = config;

    switch (overlay) {
        case "none":
            return "";

        case "shine":
            return getShineOverlayCSS(selector);

        case "ripple":
            return getRippleOverlayCSS(selector, overlayColor || primaryColor);

        case "gradient":
            return getGradientOverlayCSS(selector, primaryColor);

        case "sparkle":
            return getSparkleOverlayCSS(selector);

        case "border-glow":
            return getBorderGlowOverlayCSS(selector, overlayColor || primaryColor);

        default:
            return "";
    }
}

/**
 * Retorna CSS para o efeito shine (✨ luz branca deslizando)
 */
function getShineOverlayCSS(selector: string): string {
    return `
    ${selector} {
      position: relative !important;
      overflow: hidden !important;
    }
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
        rgba(255, 255, 255, 0.4),
        transparent
      );
      transition: left 0.6s ease;
      pointer-events: none;
      z-index: 1;
    }
    ${selector}:hover::before {
      left: 100%;
    }
    `;
}

/**
 * Retorna CSS para o efeito ripple (🌊 ondas expandindo)
 */
function getRippleOverlayCSS(selector: string, color: string): string {
    const rippleColor = hexToRgba(color, 0.3);
    return `
    ${selector} {
      position: relative !important;
      overflow: hidden !important;
    }
    ${selector}::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${rippleColor};
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
      pointer-events: none;
      opacity: 0;
      z-index: 0;
    }
    ${selector}:hover::after {
      width: 300%;
      height: 300%;
      opacity: 1;
    }
    `;
}

/**
 * Retorna CSS para o efeito gradient (🌈 gradiente passando)
 */
function getGradientOverlayCSS(selector: string, primaryColor: string): string {
    return `
    ${selector} {
      position: relative !important;
      overflow: hidden !important;
    }
    ${selector}::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        ${hexToRgba(primaryColor, 0.2)} 25%,
        ${hexToRgba("#ffffff", 0.3)} 50%,
        ${hexToRgba(primaryColor, 0.2)} 75%,
        transparent 100%
      );
      transition: left 0.8s ease;
      pointer-events: none;
      z-index: 1;
    }
    ${selector}:hover::before {
      left: 100%;
    }
    `;
}

/**
 * Retorna CSS para o efeito sparkle (⭐ faíscas brilhantes)
 */
function getSparkleOverlayCSS(selector: string): string {
    return `
    ${selector} {
      position: relative !important;
      overflow: hidden !important;
    }
    ${selector}::before,
    ${selector}::after {
      content: "✨";
      position: absolute;
      font-size: 0.75rem;
      opacity: 0;
      transition: all 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }
    ${selector}::before {
      top: 10%;
      right: 15%;
      transform: scale(0) rotate(0deg);
    }
    ${selector}::after {
      bottom: 10%;
      left: 15%;
      transform: scale(0) rotate(0deg);
    }
    ${selector}:hover::before {
      opacity: 1;
      transform: scale(1.2) rotate(15deg);
    }
    ${selector}:hover::after {
      opacity: 1;
      transform: scale(1) rotate(-10deg);
      transition-delay: 0.1s;
    }

    @keyframes sg-sparkle-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(5deg); }
    }
    ${selector}:hover::before,
    ${selector}:hover::after {
      animation: sg-sparkle-float 0.8s ease-in-out infinite;
    }
    `;
}

/**
 * Retorna CSS para o efeito border-glow (💫 borda pulsando)
 */
function getBorderGlowOverlayCSS(selector: string, color: string): string {
    const glowColor = hexToRgba(color, 0.6);
    const glowColorLight = hexToRgba(color, 0.3);
    return `
    ${selector} {
      position: relative !important;
    }
    ${selector}::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: inherit;
      background: linear-gradient(45deg, ${color}, ${glowColorLight}, ${color});
      background-size: 200% 200%;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      filter: blur(4px);
    }
    ${selector}:hover::before {
      opacity: 1;
      animation: sg-border-glow 1.5s ease infinite;
    }

    @keyframes sg-border-glow {
      0%, 100% {
        background-position: 0% 50%;
        filter: blur(4px);
        box-shadow: 0 0 10px ${glowColor};
      }
      50% {
        background-position: 100% 50%;
        filter: blur(6px);
        box-shadow: 0 0 20px ${glowColor};
      }
    }
    `;
}

/**
 * Retorna os keyframes CSS necessários para todas as animações de overlay
 */
export function getOverlayKeyframes(): string {
    return `
    @keyframes sg-sparkle-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(5deg); }
    }
    @keyframes sg-border-glow {
      0%, 100% {
        background-position: 0% 50%;
        filter: blur(4px);
      }
      50% {
        background-position: 100% 50%;
        filter: blur(6px);
      }
    }
    `;
}

// ============================================================================
// DEPRECATED - Mantido para compatibilidade, use generateButtonOverlayCSS
// ============================================================================

/**
 * @deprecated Use generateButtonOverlayCSS com overlay: "shine"
 */
export function getShineEffectCSS(selector: string): string {
    return getShineOverlayCSS(selector);
}
