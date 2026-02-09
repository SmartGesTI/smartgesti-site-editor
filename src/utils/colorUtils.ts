/**
 * Color Utilities
 * Utilitarios para manipulacao de cores, contraste WCAG e derivacao de paleta
 */

import type { ColorPalette } from "../editor/PaletteSelector";

// ============================================================================
// Core Conversions
// ============================================================================

/**
 * Converte hex para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
 * Converte hex para HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex)
  if (!rgb) return { h: 0, s: 0, l: 50 }

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l: l * 100 }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Converte HSL para hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// ============================================================================
// Luminance & Contrast (WCAG 2.1)
// ============================================================================

/**
 * Calcula luminancia relativa (WCAG 2.1)
 * Retorna valor entre 0 (preto) e 1 (branco)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Detecta se uma cor e clara (luminancia > 0.5)
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5
}

/**
 * Detecta se uma cor e escura (luminancia <= 0.5)
 */
export function isDarkColor(hex: string): boolean {
  return !isLightColor(hex)
}

/**
 * Calcula contrast ratio entre duas cores (WCAG 2.1)
 * Retorna valor entre 1 (sem contraste) e 21 (maximo)
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = getLuminance(fg)
  const l2 = getLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ============================================================================
// Color Manipulation
// ============================================================================

/**
 * Escurece uma cor por amount (0-100, reduz lightness)
 */
export function darken(hex: string, amount: number): string {
  const hsl = hexToHSL(hex)
  return hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - amount))
}

/**
 * Clareia uma cor por amount (0-100, aumenta lightness)
 */
export function lighten(hex: string, amount: number): string {
  const hsl = hexToHSL(hex)
  return hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + amount))
}

/**
 * Ajusta foreground (clareia ou escurece) ate atingir minRatio de contraste com bg
 * Default minRatio = 4.5 (WCAG AA para texto normal)
 */
export function ensureContrast(fg: string, bg: string, minRatio: number = 4.5): string {
  if (contrastRatio(fg, bg) >= minRatio) return fg

  const bgLum = getLuminance(bg)
  const hsl = hexToHSL(fg)

  // Tentar clarear se bg e escuro, escurecer se bg e claro
  const direction = bgLum < 0.5 ? 1 : -1
  let bestColor = fg
  let bestRatio = contrastRatio(fg, bg)

  for (let step = 5; step <= 100; step += 5) {
    const newL = Math.max(0, Math.min(100, hsl.l + direction * step))
    const candidate = hslToHex(hsl.h, hsl.s, newL)
    const ratio = contrastRatio(candidate, bg)
    if (ratio > bestRatio) {
      bestColor = candidate
      bestRatio = ratio
    }
    if (ratio >= minRatio) return candidate
  }

  // Fallback: branco ou preto (maximo contraste)
  if (bestRatio < minRatio) {
    return bgLum < 0.5 ? "#ffffff" : "#000000"
  }
  return bestColor
}

// ============================================================================
// Palette Derivation
// ============================================================================

export interface DerivedPaletteColors {
  /** Theme color tokens (patch em /theme/colors/*) */
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
    primaryHover: string;
    primaryText: string;
    secondaryHover: string;
    mutedText: string;
    border: string;
    linkColor: string;
    menuLinkColor: string;
    ring: string;
  };

  /** Hero gradient colors */
  heroGradientStart: string;
  heroGradientEnd: string;
  heroTitleColor: string;
  heroSubtitleColor: string;
  heroDescColor: string;

  /** Navbar */
  navbarBg: string;

  /** Footer */
  footerLinkHover: string;
}

/**
 * Deriva todas as cores da paleta a partir dos seeds
 */
export function derivePaletteColors(palette: ColorPalette): DerivedPaletteColors {
  const bgLight = isLightColor(palette.background)
  const primaryText = ensureContrast("#ffffff", palette.primary)

  const mutedText = bgLight ? "#6b7280" : "#9ca3af"
  const border = bgLight ? darken(palette.background, 12) : lighten(palette.background, 15)
  const menuLinkColor = palette.menuLinkColor || palette.primary
  const linkColor = palette.linkColor || palette.primary

  // Hero gradients: usar paleta se definido, senao derivar do primary/secondary
  const heroGradientStart = palette.heroGradientStart || darken(palette.primary, 35)
  const heroGradientEnd = palette.heroGradientEnd || darken(palette.secondary, 25)

  // Hero text colors: garantir contraste sobre o gradiente start (area mais escura)
  const heroTitleColor = ensureContrast("#ffffff", heroGradientStart, 7)
  const heroSubtitleColor = ensureContrast(
    lighten(heroTitleColor, 10),
    heroGradientStart,
    4.5
  )
  const heroDescColor = ensureContrast(
    lighten(heroTitleColor, 20),
    heroGradientStart,
    4.5
  )

  return {
    themeColors: {
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      bg: palette.background,
      surface: palette.surface || (bgLight ? "#f8fafc" : lighten(palette.background, 5)),
      text: palette.text,
      primaryHover: darken(palette.primary, 10),
      primaryText,
      secondaryHover: darken(palette.secondary, 10),
      mutedText,
      border,
      linkColor,
      menuLinkColor,
      ring: palette.primary,
    },
    heroGradientStart,
    heroGradientEnd,
    heroTitleColor,
    heroSubtitleColor,
    heroDescColor,
    navbarBg: palette.background,
    footerLinkHover: lighten(palette.primary, 20),
  }
}
