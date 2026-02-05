/**
 * Typography configuration types
 * Sistema global de tipografia para textos customizáveis
 */

export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

export type TextEffect = 'none' | 'shadow' | 'glow' | 'outline' | 'gradient';

export interface TypographyConfig {
  /** Tamanho da fonte em pixels */
  fontSize?: number;
  /** Peso da fonte */
  fontWeight?: FontWeight;
  /** Cor do texto (pode ser cor sólida ou gradiente CSS) */
  color?: string;
  /** Tipo de efeito aplicado ao texto */
  effect?: TextEffect;
  /** Cor do efeito (sombra, glow, outline, ou segunda cor do gradiente) */
  effectColor?: string;
  /** Intensidade do efeito (0-100) */
  effectIntensity?: number;
}

/** Mapa de pesos para valores CSS */
export const fontWeightMap: Record<FontWeight, number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/** Labels em português para os pesos */
export const fontWeightLabels: Record<FontWeight, string> = {
  light: 'Leve',
  normal: 'Normal',
  medium: 'Médio',
  semibold: 'Seminegrito',
  bold: 'Negrito',
};

/** Labels em português para os efeitos */
export const textEffectLabels: Record<TextEffect, string> = {
  none: 'Nenhum',
  shadow: 'Sombra',
  glow: 'Brilho',
  outline: 'Contorno',
  gradient: 'Gradiente',
};
