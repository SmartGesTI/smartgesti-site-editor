/**
 * Types for Component Registry
 */

import { Block, BlockType } from "../schema/siteDocument";

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
    | "image-grid";     // Image grid editor with preset selector
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  /** Tamanho do input (para checkbox/toggle) */
  size?: "sm" | "md";
  /** Condição para exibir o campo (visibilidade condicional) */
  showWhen?: { field: string; equals?: string | boolean | number; notEquals?: string | boolean | number };
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
export interface BlockVariation {
  id: string;
  name: string;
  defaultProps: Partial<Block["props"]>;
}

/**
 * Block Definition - Metadados completos de um bloco
 */
export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  icon?: string;
  category: "layout" | "content" | "composition" | "sections" | "forms";
  defaultProps: Partial<Block["props"]>;
  /** Variações pré-definidas (ex.: Hero Dividido, Hero Parallax) */
  variations?: Record<string, BlockVariation>;
  slots?: SlotDefinition[]; // Para blocos compostos (Card, Section)
  constraints?: BlockConstraint;
  inspectorMeta?: Record<string, InspectorMeta>; // Como exibir cada prop no editor
  canHaveChildren?: boolean;
  defaultChildren?: Block[]; // Blocos padrão quando criado
}

/**
 * Component Registry Interface
 */
export interface ComponentRegistry {
  register(definition: BlockDefinition): void;
  get(type: BlockType): BlockDefinition | undefined;
  getAll(): BlockDefinition[];
  getByCategory(category: string): BlockDefinition[];
  validate(block: Block): { valid: boolean; errors: string[] };
}
