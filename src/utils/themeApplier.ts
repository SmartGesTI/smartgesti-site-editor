/**
 * Utilitário para aplicar paleta de cores dinâmica ao site gerado
 * Usa variáveis CSS com prefixo --site-* para isolamento total
 */

import { ColorPalette } from '../types'

/**
 * Aplica a paleta de cores do site usando CSS variables com prefixo --site-*
 * Isso garante isolamento total das cores do site gerado vs. editor
 */
export function applySiteTheme(palette: ColorPalette): void {
  if (!palette) {
    console.warn('Color palette is undefined, skipping theme application')
    return
  }

  const root = document.documentElement

  if (!root) {
    console.error('document.documentElement is not available')
    return
  }

  // Aplicar variáveis de cor com prefixo --site-*
  root.style.setProperty('--site-primary-color', palette.primary)
  root.style.setProperty('--site-secondary-color', palette.secondary)
  root.style.setProperty('--site-accent-color', palette.accent)
  root.style.setProperty('--site-background', palette.background)
  root.style.setProperty('--site-surface', palette.surface)
  root.style.setProperty('--site-text', palette.text)
  root.style.setProperty('--site-text-secondary', palette.textSecondary)

  // Aplicar gradiente
  const gradientString = palette.gradient.join(', ')
  root.style.setProperty(
    '--site-primary-gradient',
    `linear-gradient(135deg, ${gradientString})`
  )
  root.style.setProperty(
    '--site-radial-gradient',
    `radial-gradient(circle, ${gradientString})`
  )

  // Verificar que as variáveis foram aplicadas
  const primaryColor = getComputedStyle(root)
    .getPropertyValue('--site-primary-color')
    .trim()

  if (primaryColor) {
    console.log(`✅ Applied ${palette.name} theme successfully`)
  }
}

/**
 * Remove o tema aplicado (reseta para valores padrão)
 */
export function removeSiteTheme(): void {
  const root = document.documentElement

  root.style.removeProperty('--site-primary-color')
  root.style.removeProperty('--site-secondary-color')
  root.style.removeProperty('--site-accent-color')
  root.style.removeProperty('--site-background')
  root.style.removeProperty('--site-surface')
  root.style.removeProperty('--site-text')
  root.style.removeProperty('--site-text-secondary')
  root.style.removeProperty('--site-primary-gradient')
  root.style.removeProperty('--site-radial-gradient')
}
