/**
 * Tipos para sistema de renderização de componentes
 */

import { Component, Site } from '../../types'
import { ReactNode } from 'react'

export interface RenderProps {
  component: Component
  site: Site
  // Props adicionais que podem ser passadas para renderers específicos
  scrollY?: number
  scrollToSection?: (sectionId: string) => void
  navbar?: ReactNode
}

export type ComponentRenderer = (props: RenderProps) => ReactNode
