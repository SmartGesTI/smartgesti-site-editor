/**
 * ComponentRenderer genérico - Renderiza qualquer componente baseado em seu tipo e variante
 */

import { ComponentType } from '../../types'
import { RenderProps } from './types'
import { getComponentRenderer } from './index'
import { HeroRenderer } from './HeroRenderer'

interface ComponentRendererProps extends RenderProps {
  componentType: ComponentType
}

export function ComponentRenderer({ componentType, ...props }: ComponentRendererProps) {
  // Renderers específicos podem ter lógica adicional
  if (componentType === 'hero') {
    return <HeroRenderer {...props} />
  }

  // Para outros componentes, usar o registry diretamente
  const Renderer = getComponentRenderer(componentType, props.component.variant)
  return <Renderer {...props} />
}
