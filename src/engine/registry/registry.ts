/**
 * Component Registry
 * Registry centralizado de definições de blocos com metadados
 */

import { Block, BlockType } from '../schema/siteDocument'
import { BlockDefinition, ComponentRegistry } from './types'
import { logger } from '../../utils/logger'

class ComponentRegistryImpl implements ComponentRegistry {
  private definitions: Map<BlockType, BlockDefinition> = new Map()

  register(definition: BlockDefinition): void {
    if (this.definitions.has(definition.type)) {
      logger.warn(`Block ${definition.type} is already registered. Overwriting...`)
    }
    this.definitions.set(definition.type, definition)
  }

  get(type: BlockType): BlockDefinition | undefined {
    return this.definitions.get(type)
  }

  getAll(): BlockDefinition[] {
    return Array.from(this.definitions.values())
  }

  getByCategory(category: string): BlockDefinition[] {
    return this.getAll().filter((def) => def.category === category)
  }

  getByPlugin(pluginId: string): BlockDefinition[] {
    return this.getAll().filter((def) => def.pluginId === pluginId)
  }

  validate(block: Block): { valid: boolean; errors: string[] } {
    const definition = this.get(block.type)
    if (!definition) {
      return { valid: false, errors: [`Block type ${block.type} not found in registry`] }
    }

    const errors: string[] = []
    const constraints = definition.constraints

    if (constraints) {
      const props = block.props as Record<string, any>;

      // Validar required
      if (constraints.required) {
        for (const prop of constraints.required) {
          if (!(prop in props) || props[prop] === undefined || props[prop] === '') {
            errors.push(`Required property '${prop}' is missing or empty`)
          }
        }
      }

      // Validar min/max
      if (constraints.min) {
        for (const [prop, min] of Object.entries(constraints.min)) {
          const value = props[prop]
          if (typeof value === 'number' && value < min) {
            errors.push(`Property '${prop}' must be at least ${min}`)
          }
        }
      }

      if (constraints.max) {
        for (const [prop, max] of Object.entries(constraints.max)) {
          const value = props[prop]
          if (typeof value === 'number' && value > max) {
            errors.push(`Property '${prop}' must be at most ${max}`)
          }
        }
      }

      // Validar pattern
      if (constraints.pattern) {
        for (const [prop, pattern] of Object.entries(constraints.pattern)) {
          const value = props[prop]
          if (typeof value === 'string' && !pattern.test(value)) {
            errors.push(`Property '${prop}' does not match required pattern`)
          }
        }
      }

      // Validar custom
      if (constraints.custom) {
        const result = constraints.custom(block.props)
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : 'Custom validation failed')
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Singleton instance
export const componentRegistry: ComponentRegistry = new ComponentRegistryImpl()
