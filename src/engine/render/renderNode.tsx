/**
 * Render Node
 * Renderiza um bloco individual em React
 */

import { Block } from '../schema/siteDocument'
import { renderBlockNode } from './renderNodeImpl'

export interface RenderNodeProps {
  block: Block
  depth?: number
}

/**
 * Componente React que renderiza um bloco
 */
export function RenderNode({ block, depth = 0 }: RenderNodeProps) {
  return <>{renderBlockNode(block, depth)}</>
}

/**
 * Função que renderiza um bloco e retorna JSX
 */
export { renderBlockNode as renderNode }
