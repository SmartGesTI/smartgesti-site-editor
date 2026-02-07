/**
 * Plugin Registry
 * Registry centralizado para gerenciamento de plugins
 */

import { logger } from "../../utils/logger";
import type { BlockType, SiteDocument } from "../schema/siteDocument";
import type { BlockDefinition } from "../registry/types";
import { componentRegistry } from "../registry/registry";
import type {
  PluginManifest,
  PluginRegistration,
  ContentProvider,
  EditorRestriction,
  PageTemplate,
  DataSchema,
  SitePluginsConfig,
} from "./types";

// ============================================================================
// Plugin Registry Interface
// ============================================================================

export interface PluginRegistry {
  /** Registra um plugin (manifest + hooks) */
  register(plugin: PluginRegistration): void;

  /** Retorna um plugin registrado por ID */
  get(pluginId: string): PluginRegistration | undefined;

  /** Retorna todos os plugins registrados */
  getAll(): PluginRegistration[];

  /** Retorna IDs dos plugins ativos num documento */
  getActive(document: SiteDocument): string[];

  /** Ativa um plugin num documento (retorna documento atualizado) */
  activate(document: SiteDocument, pluginId: string): SiteDocument;

  /** Desativa um plugin num documento (retorna documento atualizado) */
  deactivate(document: SiteDocument, pluginId: string): SiteDocument;

  /** Registra um content provider (implementado pelo consumer project) */
  registerContentProvider(provider: ContentProvider): void;

  /** Retorna um content provider por tipo */
  getContentProvider(type: string): ContentProvider | undefined;

  /** Retorna todos os content providers registrados */
  getAllContentProviders(): ContentProvider[];

  /** Retorna restrições de edição para um bloco num documento */
  getEditorRestrictions(document: SiteDocument, blockType: BlockType): EditorRestriction | undefined;

  /** Retorna todos os page templates disponíveis de plugins registrados */
  getPageTemplates(): PageTemplate[];

  /** Retorna page templates de um plugin específico */
  getPageTemplatesForPlugin(pluginId: string): PageTemplate[];

  /** Retorna todos os data schemas de plugins registrados */
  getDataSchemas(): DataSchema[];

  /** Verifica se um plugin tem dependências satisfeitas */
  checkDependencies(pluginId: string): { satisfied: boolean; missing: string[] };
}

// ============================================================================
// Implementation
// ============================================================================

class PluginRegistryImpl implements PluginRegistry {
  private plugins: Map<string, PluginRegistration> = new Map();
  private contentProviders: Map<string, ContentProvider> = new Map();

  register(plugin: PluginRegistration): void {
    const { id } = plugin.manifest;
    if (this.plugins.has(id)) {
      logger.warn(`Plugin "${id}" is already registered. Overwriting...`);
    }
    this.plugins.set(id, plugin);

    // Registrar block definitions do plugin no componentRegistry
    if (plugin.getBlockDefinitions) {
      const definitions = plugin.getBlockDefinitions();
      for (const def of definitions) {
        componentRegistry.register(def);
      }
    }

    logger.debug(`Plugin "${id}" v${plugin.manifest.version} registered`);
  }

  get(pluginId: string): PluginRegistration | undefined {
    return this.plugins.get(pluginId);
  }

  getAll(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  getActive(document: SiteDocument): string[] {
    return document.plugins?.active ?? [];
  }

  activate(document: SiteDocument, pluginId: string): SiteDocument {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      logger.error(`Plugin "${pluginId}" not found in registry`);
      return document;
    }

    // Verificar dependências
    const deps = this.checkDependencies(pluginId);
    if (!deps.satisfied) {
      logger.error(
        `Plugin "${pluginId}" has unsatisfied dependencies: ${deps.missing.join(", ")}`
      );
      return document;
    }

    // Verificar se já está ativo
    const activePlugins = document.plugins?.active ?? [];
    if (activePlugins.includes(pluginId)) {
      logger.warn(`Plugin "${pluginId}" is already active`);
      return document;
    }

    // Criar plugins config se não existir
    const pluginsConfig: SitePluginsConfig = {
      active: [...activePlugins, pluginId],
      config: document.plugins?.config ?? {},
    };

    // Aplicar config padrão se não existir
    if (plugin.manifest.defaultConfig && !pluginsConfig.config?.[pluginId]) {
      pluginsConfig.config = {
        ...pluginsConfig.config,
        [pluginId]: { ...plugin.manifest.defaultConfig },
      };
    }

    let updatedDocument: SiteDocument = {
      ...document,
      plugins: pluginsConfig,
    };

    // Chamar hook onActivate
    if (plugin.onActivate) {
      updatedDocument = plugin.onActivate(updatedDocument);
    }

    logger.debug(`Plugin "${pluginId}" activated`);
    return updatedDocument;
  }

  deactivate(document: SiteDocument, pluginId: string): SiteDocument {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      logger.error(`Plugin "${pluginId}" not found in registry`);
      return document;
    }

    const activePlugins = document.plugins?.active ?? [];
    if (!activePlugins.includes(pluginId)) {
      logger.warn(`Plugin "${pluginId}" is not active`);
      return document;
    }

    // Verificar se outros plugins dependem deste
    for (const active of activePlugins) {
      if (active === pluginId) continue;
      const activePlugin = this.plugins.get(active);
      if (activePlugin?.manifest.dependencies?.includes(pluginId)) {
        logger.error(
          `Cannot deactivate "${pluginId}": plugin "${active}" depends on it`
        );
        return document;
      }
    }

    const pluginsConfig: SitePluginsConfig = {
      active: activePlugins.filter((id) => id !== pluginId),
      config: document.plugins?.config ?? {},
    };

    let updatedDocument: SiteDocument = {
      ...document,
      plugins: pluginsConfig,
    };

    // Chamar hook onDeactivate
    if (plugin.onDeactivate) {
      updatedDocument = plugin.onDeactivate(updatedDocument);
    }

    logger.debug(`Plugin "${pluginId}" deactivated`);
    return updatedDocument;
  }

  registerContentProvider(provider: ContentProvider): void {
    if (this.contentProviders.has(provider.type)) {
      logger.warn(
        `ContentProvider "${provider.type}" is already registered. Overwriting...`
      );
    }
    this.contentProviders.set(provider.type, provider);
    logger.debug(`ContentProvider "${provider.type}" registered`);
  }

  getContentProvider(type: string): ContentProvider | undefined {
    return this.contentProviders.get(type);
  }

  getAllContentProviders(): ContentProvider[] {
    return Array.from(this.contentProviders.values());
  }

  getEditorRestrictions(
    document: SiteDocument,
    blockType: BlockType
  ): EditorRestriction | undefined {
    const activePlugins = this.getActive(document);

    // Merge restrictions from all active plugins
    let merged: EditorRestriction | undefined;

    for (const pluginId of activePlugins) {
      const plugin = this.plugins.get(pluginId);
      if (!plugin?.getEditorRestrictions) continue;

      const restriction = plugin.getEditorRestrictions(blockType);
      if (!restriction) continue;

      if (!merged) {
        merged = { ...restriction };
      } else {
        // Merge locked fields (union)
        if (restriction.lockedFields) {
          merged.lockedFields = [
            ...new Set([
              ...(merged.lockedFields ?? []),
              ...restriction.lockedFields,
            ]),
          ];
        }
        // Merge editable fields (intersection se ambos definem)
        if (restriction.editableFields) {
          if (merged.editableFields) {
            merged.editableFields = merged.editableFields.filter((f) =>
              restriction.editableFields!.includes(f)
            );
          } else {
            merged.editableFields = [...restriction.editableFields];
          }
        }
      }
    }

    return merged;
  }

  getPageTemplates(): PageTemplate[] {
    const templates: PageTemplate[] = [];
    for (const plugin of this.plugins.values()) {
      templates.push(...plugin.manifest.capabilities.pageTemplates);
    }
    return templates;
  }

  getPageTemplatesForPlugin(pluginId: string): PageTemplate[] {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return [];
    return plugin.manifest.capabilities.pageTemplates;
  }

  getDataSchemas(): DataSchema[] {
    const schemas: DataSchema[] = [];
    for (const plugin of this.plugins.values()) {
      schemas.push(...plugin.manifest.capabilities.dataSchemas);
    }
    return schemas;
  }

  checkDependencies(
    pluginId: string
  ): { satisfied: boolean; missing: string[] } {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return { satisfied: false, missing: [pluginId] };
    }

    const deps = plugin.manifest.dependencies ?? [];
    const missing = deps.filter((dep) => !this.plugins.has(dep));

    return {
      satisfied: missing.length === 0,
      missing,
    };
  }
}

// Singleton instance
export const pluginRegistry: PluginRegistry = new PluginRegistryImpl();
