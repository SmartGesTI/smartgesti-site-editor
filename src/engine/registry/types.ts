/**
 * Types for Component Registry
 */

import { Block, BlockType, BlockPropsFor } from "../schema/siteDocument";
import type { ShowWhenCondition } from "../shared/showWhen";

/**
 * Metadata for property panel (como exibir no editor)
 */
export interface InspectorMeta {
  label: string;
  description?: string;
  group?: string;
  inputType?:
    | "text"
    | "number"
    | "color"
    | "color-advanced"  // Advanced color picker with react-colorful
    | "select"
    | "slider"
    | "textarea"
    | "image"
    | "image-upload"    // Image upload with file picker
    | "checkbox"
    | "icon-grid"       // Grid of icons for selection
    | "image-grid"      // Image grid editor with preset selector
    | "typography"      // Typography editor (size, weight, color, effects)
    | "carousel-images"; // Carousel images editor (array of image URLs)
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  /** Tamanho do input (para checkbox/toggle) */
  size?: "sm" | "md";
  /** Condição para exibir o campo (visibilidade condicional) */
  showWhen?: ShowWhenCondition;
  /** Campo somente leitura (exibido mas não editável) */
  readOnly?: boolean;
  /** Campo desabilitado (cinza, não interativo) */
  disabled?: boolean;
}

/**
 * Constraint - Regras de validação
 */
export interface BlockConstraint {
  required?: string[]; // Props obrigatórias
  min?: Record<string, number>;
  max?: Record<string, number>;
  pattern?: Record<string, RegExp>;
  custom?: (props: any) => boolean | string; // Função de validação customizada
}

/**
 * Slot definition - Para blocos compostos
 */
export interface SlotDefinition {
  name: string;
  label: string;
  accepts?: BlockType[]; // Tipos de blocos aceitos neste slot
  required?: boolean;
  maxItems?: number;
}

/**
 * Variação de bloco (preset com nome e props)
 */
export interface BlockVariation<T extends BlockType = BlockType> {
  id: string;
  name: string;
  defaultProps: T extends BlockType ? Partial<BlockPropsFor<T>> : Record<string, any>;
}

/**
 * Block Definition - Metadados completos de um bloco
 */
export interface BlockDefinition<T extends BlockType = BlockType> {
  type: T;
  name: string;
  description: string;
  icon?: string;
  category: "layout" | "content" | "composition" | "sections" | "forms";
  defaultProps: T extends BlockType ? Partial<BlockPropsFor<T>> : Record<string, any>;
  /** Variações pré-definidas (ex.: Hero Dividido, Hero Parallax) */
  variations?: Record<string, BlockVariation<T>>;
  slots?: SlotDefinition[]; // Para blocos compostos (Card, Section)
  constraints?: BlockConstraint;
  inspectorMeta?: Record<string, InspectorMeta>; // Como exibir cada prop no editor
  canHaveChildren?: boolean;
  defaultChildren?: Block[]; // Blocos padrão quando criado
  /** Plugin que contribuiu este bloco (blocos nativos não têm) */
  pluginId?: string;
}

/**
 * Component Registry Interface
 */
export interface ComponentRegistry {
  register(definition: BlockDefinition): void;
  get(type: BlockType): BlockDefinition | undefined;
  getAll(): BlockDefinition[];
  getByCategory(category: string): BlockDefinition[];
  getByPlugin(pluginId: string): BlockDefinition[];
  validate(block: Block): { valid: boolean; errors: string[] };
}
