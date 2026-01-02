/**
 * Color Utilities
 * Utilitários para manipulação de cores
 */

/**
 * Converte hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calcula o brilho relativo de uma cor (0-255)
 * Usa a fórmula de luminância relativa
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 128 // Default para cinza médio

  // Normalizar valores RGB para 0-1
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255]

  // Aplicar gamma correction
  const [rLinear, gLinear, bLinear] = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  // Calcular luminância relativa
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Detecta se uma cor é clara ou escura
 * Retorna true se a cor for clara (luminância > 0.5)
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5
}

/**
 * Detecta se uma cor é escura
 * Retorna true se a cor for escura (luminância <= 0.5)
 */
export function isDarkColor(hex: string): boolean {
  return !isLightColor(hex)
}

/**
 * Aplica cores customizadas à landing page usando CSS variables
 */
export function applyLandingPageColors(colors: {
  primary?: string
  secondary?: string
  background?: string
  text?: string
  accent?: string
}): void {
  const root = document.documentElement

  if (colors.primary) {
    root.style.setProperty('--lp-primary-color', colors.primary)
  }
  if (colors.secondary) {
    root.style.setProperty('--lp-secondary-color', colors.secondary)
  }
  if (colors.background) {
    root.style.setProperty('--lp-background-color', colors.background)
  }
  if (colors.text) {
    root.style.setProperty('--lp-text-color', colors.text)
  }
  if (colors.accent) {
    root.style.setProperty('--lp-accent-color', colors.accent)
  }
}

/**
 * Remove cores customizadas
 */
export function removeLandingPageColors(): void {
  const root = document.documentElement
  root.style.removeProperty('--lp-primary-color')
  root.style.removeProperty('--lp-secondary-color')
  root.style.removeProperty('--lp-background-color')
  root.style.removeProperty('--lp-text-color')
  root.style.removeProperty('--lp-accent-color')
}
