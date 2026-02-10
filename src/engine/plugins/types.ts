/**
 * Plugin System Types
 * Tipos para o sistema de plugins do SmartGesti Site Editor
 */

import type { Block, BlockType, SiteDocument, SitePage } from "../schema/siteDocument";
import type { BlockDefinition } from "../registry/types";

// ============================================================================
// Data Schema
// ============================================================================

/**
 * Campo de um schema de dados de plugin
 */
export interface DataSchemaField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "richtext" | "image" | "url" | "array" | "object";
  required?: boolean;
  label?: string;
  description?: string;
}

/**
 * Schema dos dados que o plugin gerencia (ex.: Product, BlogPost)
 */
export interface DataSchema {
  type: string;
  label: string;
  fields: DataSchemaField[];
}

// ============================================================================
// Content Provider
// ============================================================================

/**
 * Parâmetros para busca de lista de conteúdo
 */
export interface ContentListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, unknown>;
  tenantId?: string;
  projectId?: string;
  ownerId?: string;
  ownerType?: string;
}

/**
 * Item de conteúdo retornado pelo ContentProvider
 */
export interface ContentItem {
  id: string;
  type: string;
  slug?: string;
  data: Record<string, unknown>;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    status: "draft" | "published" | "archived";
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      ogImage?: string;
    };
  };
}

/**
 * Resultado paginado de uma busca de lista
 */
export interface ContentListResult {
  items: ContentItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Interface para buscar dados dinâmicos de um plugin
 * Implementada pelo consumer project (ex.: SmartGesti-Ensino)
 */
export interface ContentProvider {
  type: string;

  /** Busca lista de itens (listagem) */
  fetchList(params: ContentListParams): Promise<ContentListResult>;

  /** Busca item único por ID ou slug */
  fetchById(idOrSlug: string): Promise<ContentItem | null>;

  /** Retorna o schema dos dados */
  getSchema(): DataSchema;

  /** Transforma um ContentItem em props de bloco */
  toBlockProps(item: ContentItem): Record<string, unknown>;
}

// ============================================================================
// Page Template
// ============================================================================

/**
 * Data source configuration para uma página dinâmica
 */
export interface PageDataSource {
  /** Nome do content provider (ex.: "blog-posts", "products") */
  provider: string;
  /** Modo de busca */
  mode: "single" | "list";
  /** Mapeamento de parâmetros da URL para filtros (ex.: { slug: ":slug" }) */
  paramMapping?: Record<string, string>;
  /** Parâmetros padrão para a busca */
  defaultParams?: Record<string, unknown>;
}

/**
 * Restrições de edição para uma página de plugin
 */
export interface PageEditRestrictions {
  /** Estrutura de blocos não pode ser alterada */
  lockedStructure?: boolean;
  /** Apenas estes campos podem ser editados pelo usuário */
  editableFields?: string[];
  /** Página não pode ser removida */
  nonRemovable?: boolean;
}

/**
 * Template de página fornecido por um plugin
 */
export interface PageTemplate {
  id: string;
  name: string;
  /** Slug da página (pode conter parâmetros dinâmicos: "blog/:slug") */
  slug: string;
  pluginId: string;
  /** Estrutura de blocos da página */
  structure: Block[];
  /** Configuração de dados dinâmicos */
  dataSource?: PageDataSource;
  /** Restrições de edição */
  editRestrictions?: PageEditRestrictions;
}

// ============================================================================
// Editor Restrictions
// ============================================================================

/**
 * Restrição de edição aplicada pelo plugin no editor
 */
export interface EditorRestriction {
  /** Campos que não podem ser editados (vêm do backend) */
  lockedFields?: string[];
  /** Campos que podem ser editados (whitelist) */
  editableFields?: string[];
}

// ============================================================================
// Plugin Manifest
// ============================================================================

/**
 * Manifest de um plugin — define tudo que o plugin oferece
 */
export interface PluginManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  icon?: string;

  /** Capacidades do plugin */
  capabilities: {
    /** BlockTypes que este plugin adiciona */
    blocks: BlockType[];
    /** Templates de página dinâmica */
    pageTemplates: PageTemplate[];
    /** Schemas de dados que o plugin gerencia */
    dataSchemas: DataSchema[];
    /** Content providers necessários */
    contentProviders: string[];
  };

  /** Restrições de edição impostas pelo plugin */
  restrictions?: {
    /** Campos locked por tipo de bloco */
    lockedFields?: Record<string, string[]>;
    /** Páginas que não podem ser removidas */
    requiredPages?: string[];
    /** Blocos obrigatórios por página */
    requiredBlocks?: Record<string, string[]>;
  };

  /** Plugins dos quais este depende */
  dependencies?: string[];

  /** Configurações padrão do plugin */
  defaultConfig?: Record<string, unknown>;
}

// ============================================================================
// Plugin Registration
// ============================================================================

/**
 * Registro completo de um plugin (manifest + hooks)
 */
export interface PluginRegistration {
  manifest: PluginManifest;

  /** Chamado quando o plugin é ativado num documento */
  onActivate?: (document: SiteDocument) => SiteDocument;

  /** Chamado quando o plugin é desativado num documento */
  onDeactivate?: (document: SiteDocument) => SiteDocument;

  /** Retorna restrições de edição para um tipo de bloco */
  getEditorRestrictions?: (blockType: BlockType) => EditorRestriction | undefined;

  /** Retorna definições de blocos do plugin */
  getBlockDefinitions?: () => BlockDefinition[];
}

// ============================================================================
// Plugin Config (dentro do SiteDocument)
// ============================================================================

/**
 * Configuração de plugins dentro de um SiteDocument
 */
export interface SitePluginsConfig {
  /** IDs dos plugins ativos */
  active: string[];
  /** Configurações por plugin */
  config?: Record<string, Record<string, unknown>>;
}
