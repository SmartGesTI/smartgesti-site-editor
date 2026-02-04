/**
 * Hover Effects - Link Hover Styles Generator
 *
 * Gera estilos CSS para hover de links baseado no efeito selecionado.
 *
 * Efeitos disponíveis:
 * - background: Fundo colorido que aparece
 * - underline: Sublinhado que desliza da esquerda para direita
 * - underline-center: Sublinhado que cresce do centro
 * - scale: Aumenta de tamanho
 * - glow: Brilho neon ao redor do texto
 * - slide-bg: Fundo que desliza de baixo para cima
 */

import { LinkHoverConfig, HoverStyles } from "./types";
import { hexToRgba, normalizeIntensity } from "./colorUtils";

/**
 * Gera estilos CSS para hover de links
 *
 * @param config - Configuração do efeito
 * @returns Objeto com estilos base e hover
 */
export function generateLinkHoverStyles(config: LinkHoverConfig): HoverStyles {
    const {
        effect,
        intensity: rawIntensity,
        hoverColor,
    } = config;

    // Normalizar intensidade (10-100 → 0.15-1)
    const intensity = normalizeIntensity(rawIntensity);

    const baseStyles: string[] = [];
    const hoverStyles: string[] = [];

    // Cor do texto sempre muda no hover
    hoverStyles.push(`color: ${hoverColor} !important`);

    switch (effect) {
        case "none":
            // Sem efeito adicional, apenas mudança de cor
            break;

        case "background": {
            // Fundo com opacidade que aparece suavemente
            const bgOpacity = 0.10 + (intensity * 0.25);
            hoverStyles.push(`background-color: ${hexToRgba(hoverColor, bgOpacity)} !important`);
            // Leve elevação baseada na intensidade
            const translateY = Math.round(intensity * 3);
            if (translateY > 0) {
                hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            }
            break;
        }

        case "underline": {
            // Sublinhado animado que desliza da esquerda para direita
            const thickness = Math.max(2, Math.round(2 + intensity * 2));
            // Estilos base para preparar a animação
            baseStyles.push(`background-image: linear-gradient(${hoverColor}, ${hoverColor}) !important`);
            baseStyles.push(`background-size: 0% ${thickness}px !important`);
            baseStyles.push(`background-position: 0% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            baseStyles.push(`text-decoration: none !important`);
            // Hover expande o background
            hoverStyles.push(`background-size: 100% ${thickness}px !important`);
            break;
        }

        case "underline-center": {
            // Sublinhado que cresce do centro para as bordas
            const thickness = Math.max(2, Math.round(2 + intensity * 2));
            baseStyles.push(`background-image: linear-gradient(${hoverColor}, ${hoverColor}) !important`);
            baseStyles.push(`background-size: 0% ${thickness}px !important`);
            baseStyles.push(`background-position: 50% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            baseStyles.push(`text-decoration: none !important`);
            hoverStyles.push(`background-size: 100% ${thickness}px !important`);
            break;
        }

        case "scale": {
            // Escala suave
            const scale = 1.05 + (intensity * 0.10);
            hoverStyles.push(`transform: scale(${scale.toFixed(2)}) !important`);
            hoverStyles.push(`position: relative !important`);
            hoverStyles.push(`z-index: 10 !important`);
            break;
        }

        case "glow": {
            // Brilho neon com múltiplas camadas para efeito mais intenso
            const glowSize1 = Math.round(4 + (intensity * 8));
            const glowSize2 = Math.round(8 + (intensity * 16));
            const glowSize3 = Math.round(16 + (intensity * 24));
            const glowOpacity1 = 0.9;
            const glowOpacity2 = 0.6;
            const glowOpacity3 = 0.3;
            const shadow1 = `0 0 ${glowSize1}px ${hexToRgba(hoverColor, glowOpacity1)}`;
            const shadow2 = `0 0 ${glowSize2}px ${hexToRgba(hoverColor, glowOpacity2)}`;
            const shadow3 = `0 0 ${glowSize3}px ${hexToRgba(hoverColor, glowOpacity3)}`;
            hoverStyles.push(`text-shadow: ${shadow1}, ${shadow2}, ${shadow3} !important`);
            break;
        }

        case "slide-bg": {
            // Fundo que desliza de baixo para cima
            const bgOpacity = 0.15 + (intensity * 0.20);
            baseStyles.push(`background-image: linear-gradient(${hexToRgba(hoverColor, bgOpacity)}, ${hexToRgba(hoverColor, bgOpacity)}) !important`);
            baseStyles.push(`background-size: 100% 0% !important`);
            baseStyles.push(`background-position: 0% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            hoverStyles.push(`background-size: 100% 100% !important`);
            break;
        }

        default:
            // Fallback para background
            hoverStyles.push(`background-color: ${hexToRgba(hoverColor, 0.15)} !important`);
    }

    return {
        base: baseStyles.join("; "),
        hover: hoverStyles.join("; "),
    };
}
