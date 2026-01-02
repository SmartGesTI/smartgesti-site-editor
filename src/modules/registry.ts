/**
 * Registry de Módulos
 * Sistema para registrar e gerenciar módulos dinamicamente
 */

import { SiteModule, ModuleRegistry } from '../types/module'

class ModuleRegistryImpl implements ModuleRegistry {
  modules: Map<string, SiteModule> = new Map()

  register(module: SiteModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`Module ${module.id} is already registered. Overwriting...`)
    }

    this.modules.set(module.id, module)

    // Executar hook de instalação se disponível
    if (module.onInstall) {
      try {
        module.onInstall()
      } catch (error) {
        console.error(`Error installing module ${module.id}:`, error)
      }
    }

    console.log(`Module ${module.id} (${module.name}) registered successfully`)
  }

  unregister(moduleId: string): void {
    const module = this.modules.get(moduleId)
    if (!module) {
      console.warn(`Module ${moduleId} not found`)
      return
    }

    // Executar hook de desinstalação se disponível
    if (module.onUninstall) {
      try {
        module.onUninstall()
      } catch (error) {
        console.error(`Error uninstalling module ${moduleId}:`, error)
      }
    }

    this.modules.delete(moduleId)
    console.log(`Module ${moduleId} unregistered`)
  }

  get(moduleId: string): SiteModule | undefined {
    return this.modules.get(moduleId)
  }

  getAll(): SiteModule[] {
    return Array.from(this.modules.values())
  }

  isInstalled(moduleId: string): boolean {
    return this.modules.has(moduleId)
  }

  // Métodos auxiliares
  getComponentsFromModule(moduleId: string): SiteModule['components'] {
    const module = this.get(moduleId)
    return module?.components || []
  }

  getAllComponents(): SiteModule['components'] {
    return this.getAll().flatMap((module) => module.components)
  }

  getTemplatesFromModule(moduleId: string): SiteModule['templates'] {
    const module = this.get(moduleId)
    return module?.templates || []
  }

  getAllTemplates(): SiteModule['templates'] {
    return this.getAll().flatMap((module) => module.templates || [])
  }
}

// Singleton instance
export const moduleRegistry: ModuleRegistry = new ModuleRegistryImpl()

/**
 * Helper para criar um módulo
 */
export function createModule(
  id: string,
  name: string,
  description: string,
  version: string,
  components: SiteModule['components'],
  options?: Partial<SiteModule>
): SiteModule {
  return {
    id,
    name,
    description,
    version,
    components,
    templates: options?.templates,
    config: options?.config,
    onInstall: options?.onInstall,
    onUninstall: options?.onUninstall,
  }
}

/**
 * Exemplo de uso futuro:
 * 
 * const ecommerceModule = createModule(
 *   'ecommerce',
 *   'Ecommerce',
 *   'Módulo completo de ecommerce',
 *   '1.0.0',
 *   [
 *     { type: 'product-grid', name: 'Grade de Produtos', ... },
 *     { type: 'cart', name: 'Carrinho', ... },
 *     // ...
 *   ],
 *   {
 *     templates: [/* templates de loja *\/],
 *     config: {
 *       requiresAuth: true,
 *       requiresPayment: true,
 *     },
 *   }
 * )
 * 
 * moduleRegistry.register(ecommerceModule)
 */
