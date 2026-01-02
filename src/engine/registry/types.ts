/**
 * Types for Component Registry
 */

import { Block, BlockType } from '../schema/siteDocument'

/**
 * Metadata for property panel (como exibir no editor)
 */
export interface InspectorMeta {
  label: string
  description?: string
  group?: string
  inputType?: 'text' | 'number' | 'color' | 'select' | 'slider' | 'textarea' | 'image' | 'checkbox'
  options?: Array<{ label: string; value: any }>
  min?: number
  max?: number
  step?: number
}

/**
 * Constraint - Regras de validação
 */
export interface BlockConstraint {
  required?: string[] // Props obrigatórias
  min?: Record<string, number>
  max?: Record<string, number>
  pattern?: Record<string, RegExp>
  custom?: (props: any) => boolean | string // Função de validação customizada
}

/**
 * Slot definition - Para blocos compostos
 */
export interface SlotDefinition {
  name: string
  label: string
  accepts?: BlockType[] // Tipos de blocos aceitos neste slot
  required?: boolean
  maxItems?: number
}

/**
 * Block Definition - Metadados completos de um bloco
 */
export interface BlockDefinition {
  type: BlockType
  name: string
  description: string
  icon?: string
  category: 'layout' | 'content' | 'composition' | 'sections' | 'forms'
  defaultProps: Partial<Block['props']>
  slots?: SlotDefinition[] // Para blocos compostos (Card, Section)
  constraints?: BlockConstraint
  inspectorMeta?: Record<string, InspectorMeta> // Como exibir cada prop no editor
  canHaveChildren?: boolean
  defaultChildren?: Block[] // Blocos padrão quando criado
}

/**
 * Component Registry Interface
 */
export interface ComponentRegistry {
  register(definition: BlockDefinition): void
  get(type: BlockType): BlockDefinition | undefined
  getAll(): BlockDefinition[]
  getByCategory(category: string): BlockDefinition[]
  validate(block: Block): { valid: boolean; errors: string[] }
}
