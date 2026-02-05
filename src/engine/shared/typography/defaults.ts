/**
 * Default typography configurations
 * Valores padrão para diferentes contextos de texto
 */

import { TypographyConfig } from './types';

/** Tipografia padrão para títulos de Hero */
export const heroTitleDefaults: TypographyConfig = {
  fontSize: 48,
  fontWeight: 'bold',
  color: undefined, // Usa cor do tema
  effect: 'none',
  effectColor: undefined,
  effectIntensity: 50,
};

/** Tipografia padrão para subtítulos de Hero */
export const heroSubtitleDefaults: TypographyConfig = {
  fontSize: 24,
  fontWeight: 'medium',
  color: undefined,
  effect: 'none',
  effectColor: undefined,
  effectIntensity: 50,
};

/** Tipografia padrão para descrições de Hero */
export const heroDescriptionDefaults: TypographyConfig = {
  fontSize: 16,
  fontWeight: 'normal',
  color: undefined,
  effect: 'none',
  effectColor: undefined,
  effectIntensity: 50,
};

/** Tipografia padrão para badges */
export const badgeDefaults: TypographyConfig = {
  fontSize: 14,
  fontWeight: 'semibold',
  color: '#ffffff',
  effect: 'none',
  effectColor: undefined,
  effectIntensity: 50,
};

/** Mescla configuração do usuário com defaults */
export function mergeTypographyWithDefaults(
  config: Partial<TypographyConfig> | undefined,
  defaults: TypographyConfig
): TypographyConfig {
  if (!config) return defaults;

  return {
    fontSize: config.fontSize ?? defaults.fontSize,
    fontWeight: config.fontWeight ?? defaults.fontWeight,
    color: config.color ?? defaults.color,
    effect: config.effect ?? defaults.effect,
    effectColor: config.effectColor ?? defaults.effectColor,
    effectIntensity: config.effectIntensity ?? defaults.effectIntensity,
  };
}
