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
 * - shine: Luz branca que desliza
 * - fill: Preenchimento de cor da esquerda para direita
 * - bounce: Pequeno salto animado
 * - icon: Ícone que aparece no hover
 * - border-glow: Borda que pulsa
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
    const { overlay, overlayColor, primaryColor = "#3b82f6", iconName, textColor } = config;

    switch (overlay) {
        case "none":
            return "";

        case "shine":
            return getShineOverlayCSS(selector);

        case "fill":
            return getFillOverlayCSS(selector, overlayColor || primaryColor);

        case "bounce":
            return getBounceOverlayCSS(selector);

        case "icon":
            return getIconOverlayCSS(selector, iconName || "arrow-right", textColor);

        case "border-glow":
            return getBorderGlowOverlayCSS(selector, overlayColor || primaryColor);

        default:
            return "";
    }
}

/**
 * Retorna CSS para o efeito shine (luz branca deslizando)
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
 * Retorna CSS para o efeito fill (preenchimento da esquerda para direita)
 */
function getFillOverlayCSS(selector: string, color: string): string {
    const fillColor = hexToRgba(color, 0.15);
    return `
    ${selector} {
      position: relative !important;
      overflow: hidden !important;
    }
    ${selector}::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background: ${fillColor};
      transition: width 0.3s ease-out;
      pointer-events: none;
      z-index: 0;
    }
    ${selector}:hover::before {
      width: 100%;
    }
    `;
}

/**
 * Retorna CSS para o efeito bounce (pequeno salto animado)
 */
function getBounceOverlayCSS(selector: string): string {
    return `
    ${selector} {
      transition: transform 0.2s ease !important;
    }
    ${selector}:hover {
      animation: sg-btn-bounce 0.4s ease !important;
    }

    @keyframes sg-btn-bounce {
      0%, 100% {
        transform: translateY(0);
      }
      25% {
        transform: translateY(-6px);
      }
      50% {
        transform: translateY(-2px);
      }
      75% {
        transform: translateY(-4px);
      }
    }
    `;
}

/**
 * Gera um SVG inline para usar como máscara
 * Usa preto como cor para a máscara funcionar corretamente
 */
function createMaskSvg(pathData: string, filled: boolean = false): string {
    // Para máscaras, usamos preto (black) que define as áreas visíveis
    const fillAttr = filled ? 'black' : 'none';
    const strokeAttr = filled ? 'none' : 'black';
    return `%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${fillAttr}' stroke='${strokeAttr}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E${pathData}%3C/svg%3E`;
}

/**
 * Path data para cada ícone (simplificado para evitar problemas de encoding)
 * IMPORTANTE: Manter sincronizado com HOVER_ICONS em IconGridInput.tsx
 */
const ICON_PATHS: Record<string, { path: string; filled?: boolean }> = {
    // Setas e navegacao
    "arrow-right": { path: "%3Cpath d='M5 12h14M12 5l7 7-7 7'/%3E" },
    "chevron-right": { path: "%3Cpath d='M9 18l6-6-6-6'/%3E" },
    "external-link": { path: "%3Cpath d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3'/%3E" },
    // Acoes
    "plus": { path: "%3Cpath d='M12 5v14M5 12h14'/%3E" },
    "check": { path: "%3Cpath d='M20 6L9 17l-5-5'/%3E" },
    "download": { path: "%3Cpath d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3'/%3E" },
    "send": { path: "%3Cpath d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z'/%3E" },
    "play": { path: "%3Cpolygon points='5 3 19 12 5 21 5 3'/%3E", filled: true },
    // Icones expressivos
    "star": { path: "%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E", filled: true },
    "heart": { path: "%3Cpath d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'/%3E", filled: true },
    "zap": { path: "%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E", filled: true },
    "sparkles": { path: "%3Cpath d='M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z'/%3E", filled: true },
    "rocket": { path: "%3Cpath d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z'/%3E" },
    "fire": { path: "%3Cpath d='M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 4-7.5 1-1 2-2.5 2-4.5 0 3 2.5 5 4 6.5 2 2 3 4 3 5.5 0 4.5-3 7-6 7z'/%3E", filled: true },
    "gift": { path: "%3Cpath d='M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z'/%3E" },
    "trophy": { path: "%3Cpath d='M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V9M14 22V9'/%3E%3Cpath d='M18 2H6v7a6 6 0 1012 0V2z'/%3E" },
    // Comunicacao
    "mail": { path: "%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpath d='M22 6l-10 7L2 6'/%3E" },
    "phone": { path: "%3Cpath d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'/%3E" },
    // Compras e E-commerce
    "cart": { path: "%3Ccircle cx='9' cy='21' r='1'/%3E%3Ccircle cx='20' cy='21' r='1'/%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6'/%3E" },
    "tag": { path: "%3Cpath d='M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z'/%3E%3Cline x1='7' y1='7' x2='7.01' y2='7'/%3E" },
    // Interface
    "eye": { path: "%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E" },
    "lock": { path: "%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0110 0v4'/%3E" },
    "user": { path: "%3Cpath d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E" },
    "settings": { path: "%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'/%3E" },
};

/**
 * Lista de ícones disponíveis para o efeito icon
 */
export const AVAILABLE_OVERLAY_ICONS = Object.keys(ICON_PATHS);

/**
 * Retorna CSS para o efeito icon (ícone que aparece no hover)
 * O ícone aparece junto ao texto com a mesma cor e tamanho
 * Usa mask-image + currentColor para herdar automaticamente a cor do texto do botão
 *
 * @param selector - Seletor CSS do botão
 * @param iconName - Nome do ícone a ser exibido
 * @param _textColor - Deprecated: não é mais usado, o ícone herda via currentColor
 */
function getIconOverlayCSS(selector: string, iconName: string, _textColor?: string): string {
    const iconData = ICON_PATHS[iconName] || ICON_PATHS["arrow-right"];
    const svgMaskUrl = `url("data:image/svg+xml,${createMaskSvg(iconData.path, iconData.filled)}")`;

    return `
    ${selector} {
      position: relative !important;
      overflow: visible !important;
      transition: padding-right 0.25s ease !important;
    }
    ${selector}::after {
      content: "";
      position: absolute;
      right: 0.35em;
      top: 50%;
      transform: translateY(-50%) scale(0.8);
      width: 1em;
      height: 1em;
      background-color: currentColor;
      -webkit-mask-image: ${svgMaskUrl};
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-image: ${svgMaskUrl};
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
    }
    ${selector}:hover {
      padding-right: 1.6em !important;
    }
    ${selector}:hover::after {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
    `;
}

/**
 * Retorna CSS para o efeito border-glow (borda pulsando)
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
