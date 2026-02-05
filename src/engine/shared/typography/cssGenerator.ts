/**
 * CSS Generator for Typography
 * Gera estilos CSS a partir de TypographyConfig
 */

import { TypographyConfig, fontWeightMap, TextEffect } from './types';

interface GeneratedStyles {
  /** Estilos inline para React */
  style: React.CSSProperties;
  /** CSS string para export HTML */
  cssString: string;
  /** Classes CSS adicionais (se necessário) */
  className?: string;
}

/**
 * Gera o CSS do efeito de texto
 */
function generateEffectCSS(
  effect: TextEffect,
  effectColor: string,
  intensity: number
): { style: React.CSSProperties; css: string } {
  const normalizedIntensity = intensity / 100;

  switch (effect) {
    case 'shadow': {
      const blur = Math.round(4 + normalizedIntensity * 8); // 4-12px
      const opacity = 0.3 + normalizedIntensity * 0.5; // 0.3-0.8
      const shadow = `0 2px ${blur}px rgba(0, 0, 0, ${opacity})`;
      return {
        style: { textShadow: shadow },
        css: `text-shadow: ${shadow};`,
      };
    }

    case 'glow': {
      const blur = Math.round(8 + normalizedIntensity * 16); // 8-24px
      const color = effectColor || '#3b82f6';
      const shadow = `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}`;
      return {
        style: { textShadow: shadow },
        css: `text-shadow: ${shadow};`,
      };
    }

    case 'outline': {
      const width = Math.round(1 + normalizedIntensity * 2); // 1-3px
      const color = effectColor || '#000000';
      // Técnica de múltiplas sombras para simular outline
      const shadow = [
        `-${width}px -${width}px 0 ${color}`,
        `${width}px -${width}px 0 ${color}`,
        `-${width}px ${width}px 0 ${color}`,
        `${width}px ${width}px 0 ${color}`,
      ].join(', ');
      return {
        style: { textShadow: shadow },
        css: `text-shadow: ${shadow};`,
      };
    }

    case 'gradient': {
      const color2 = effectColor || '#8b5cf6';
      // Gradiente no texto requer técnica especial com background-clip
      return {
        style: {
          background: `linear-gradient(135deg, currentColor 0%, ${color2} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        css: `background: linear-gradient(135deg, currentColor 0%, ${color2} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`,
      };
    }

    default:
      return { style: {}, css: '' };
  }
}

/**
 * Gera estilos CSS a partir de TypographyConfig
 */
export function generateTypographyStyles(
  config: TypographyConfig,
  fallbackColor?: string
): GeneratedStyles {
  const {
    fontSize = 16,
    fontWeight = 'normal',
    color,
    effect = 'none',
    effectColor,
    effectIntensity = 50,
  } = config;

  const effectStyles = generateEffectCSS(
    effect,
    effectColor || '#000000',
    effectIntensity
  );

  const baseStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeightMap[fontWeight],
    ...(color && { color }),
    ...(!color && fallbackColor && { color: fallbackColor }),
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...effectStyles.style,
  };

  // Gera CSS string para export
  const cssProps: string[] = [
    `font-size: ${fontSize}px`,
    `font-weight: ${fontWeightMap[fontWeight]}`,
  ];

  if (color) {
    cssProps.push(`color: ${color}`);
  } else if (fallbackColor) {
    cssProps.push(`color: ${fallbackColor}`);
  }

  if (effectStyles.css) {
    cssProps.push(effectStyles.css.replace(/;$/, ''));
  }

  const cssString = cssProps.join('; ') + ';';

  return {
    style: combinedStyle,
    cssString,
  };
}

/**
 * Gera resumo textual da configuração (para preview no input)
 */
export function generateTypographySummary(config: TypographyConfig): string {
  const parts: string[] = [];

  if (config.fontSize) {
    parts.push(`${config.fontSize}px`);
  }

  if (config.fontWeight && config.fontWeight !== 'normal') {
    const weightLabels: Record<string, string> = {
      light: 'Leve',
      medium: 'Médio',
      semibold: 'Semi',
      bold: 'Bold',
    };
    parts.push(weightLabels[config.fontWeight] || config.fontWeight);
  }

  if (config.effect && config.effect !== 'none') {
    const effectLabels: Record<string, string> = {
      shadow: 'Sombra',
      glow: 'Brilho',
      outline: 'Contorno',
      gradient: 'Gradiente',
    };
    parts.push(effectLabels[config.effect] || config.effect);
  }

  return parts.join(' • ') || 'Padrão';
}
