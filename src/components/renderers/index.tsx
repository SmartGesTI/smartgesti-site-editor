/**
 * Registry de renderers por tipo e variante
 * Cada componente pode ter múltiplas variantes
 */

import React from 'react'
import { ComponentType } from '../../types'
import { ComponentRenderer } from './types'
import {
  HeroClassic,
  HeroSpotlight,
  HeroCinematic,
  HeroGlass,
  HeroSplit,
  HeroParallax,
  HeroBanner,
  HeroColumns,
  HeroNeon,
  HeroCollage,
} from './hero'

// Hero renderers - todas as 10 variantes implementadas
const heroRenderers: Record<string, ComponentRenderer> = {
  classic: HeroClassic,
  spotlight: HeroSpotlight,
  cinematic: HeroCinematic,
  glass: HeroGlass,
  split: HeroSplit,
  parallax: HeroParallax,
  banner: HeroBanner,
  columns: HeroColumns,
  neon: HeroNeon,
  collage: HeroCollage,
}

const navbarRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  sticky: () => null,
  compact: () => null,
}

const galleryRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  overlay: () => null,
  stacked: () => null,
}

const servicesRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  minimal: () => null,
  carousel: () => null,
}

const aboutRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  minimal: () => null,
  premium: () => null,
}

const testimonialsRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  professional: () => null,
  premium: () => null,
}

const contactRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  split: () => null,
  map: () => null,
}

const footerRenderers: Record<string, ComponentRenderer> = {
  classic: () => null,
  minimal: () => null,
  premium: () => null,
  maps: () => null,
  modern: () => null,
  premiumDeluxe: () => null,
}

// Renderers básicos para componentes simples
const basicRenderers: Record<string, ComponentRenderer> = {
  default: ({ component }) => {
    // Renderização básica genérica
    return React.createElement('div', null, JSON.stringify(component.props))
  },
}

export const componentRenderers: Record<
  ComponentType,
  Record<string, ComponentRenderer>
> = {
  hero: heroRenderers,
  navbar: navbarRenderers,
  gallery: galleryRenderers,
  services: servicesRenderers,
  about: aboutRenderers,
  testimonials: testimonialsRenderers,
  contact: contactRenderers,
  footer: footerRenderers,
  // Componentes básicos
  section: basicRenderers,
  container: basicRenderers,
  text: basicRenderers,
  heading: basicRenderers,
  image: basicRenderers,
  button: basicRenderers,
  grid: basicRenderers,
  card: basicRenderers,
  spacer: basicRenderers,
  divider: basicRenderers,
  list: basicRenderers,
  form: basicRenderers,
  video: basicRenderers,
  map: basicRenderers,
}

/**
 * Obtém o renderer apropriado para um componente
 */
export function getComponentRenderer(
  type: ComponentType,
  variant?: string
): ComponentRenderer {
  const typeRenderers = componentRenderers[type]
  if (!typeRenderers) {
    return basicRenderers.default
  }

  const variantKey = variant || 'classic'
  const renderer = typeRenderers[variantKey] || typeRenderers['classic'] || typeRenderers['default'] || basicRenderers.default

  return renderer
}
