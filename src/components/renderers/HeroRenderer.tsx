/**
 * HeroRenderer - Seleciona e renderiza a variante apropriada do Hero
 */

import { RenderProps } from './types'
import { getComponentRenderer } from './index'

export function HeroRenderer(props: RenderProps) {
  const { component } = props
  const variant = component.variant || 'classic'
  
  const Renderer = getComponentRenderer('hero', variant)
  
  return <Renderer {...props} />
}
