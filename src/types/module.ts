/**
 * Sistema de Módulos - Arquitetura para adicionar módulos dinamicamente
 * Preparação para módulos futuros como Ecommerce, Blog, etc.
 */

import { ComponentDefinition, Template } from './index'

export interface SiteModule {
  id: string
  name: string
  description: string
  version: string
  components: ComponentDefinition[]
  templates?: Template[]
  // Configurações específicas do módulo
  config?: {
    requiresAuth?: boolean
    requiresPayment?: boolean
    dependencies?: string[] // IDs de outros módulos necessários
  }
  // Hooks para inicialização e cleanup
  onInstall?: () => void | Promise<void>
  onUninstall?: () => void | Promise<void>
}

export interface ModuleRegistry {
  modules: Map<string, SiteModule>
  register: (module: SiteModule) => void
  unregister: (moduleId: string) => void
  get: (moduleId: string) => SiteModule | undefined
  getAll: () => SiteModule[]
  isInstalled: (moduleId: string) => boolean
}
