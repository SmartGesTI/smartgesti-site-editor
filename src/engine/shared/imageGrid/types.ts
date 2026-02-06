/**
 * Image Grid Types
 * Tipos para o sistema de grid de imagens reutilizável
 */

/**
 * Item individual da grid de imagens
 */
export interface ImageGridItem {
  /** URL da imagem */
  src: string;
  /** Texto alternativo para acessibilidade */
  alt?: string;
  /** Escala individual da imagem (1.0 = 100%, padrão) */
  scale?: number;
}

/**
 * Presets de layout disponíveis para a grid
 */
export type ImageGridPreset =
  | "single"         // 1 imagem ocupando toda a grid
  | "two-horizontal" // 2 imagens lado a lado (1x2 cada)
  | "two-vertical"   // 2 imagens empilhadas (2x1 cada)
  | "three-left"     // 1 grande esquerda (1x2) + 2 pequenas direita
  | "three-right"    // 2 pequenas esquerda + 1 grande direita
  | "three-top"      // 1 grande topo (2x1) + 2 pequenas baixo
  | "four-equal";    // 4 imagens iguais (1x1 cada)

/**
 * Configuração de posição no CSS Grid
 */
export interface GridPosition {
  /** grid-column value (ex: "1 / 2", "1 / -1") */
  col: string;
  /** grid-row value (ex: "1 / 2", "1 / -1") */
  row: string;
}

/**
 * Configuração completa de um preset de grid
 */
export interface GridPresetConfig {
  /** Template CSS do grid (grid-template) */
  gridTemplate: string;
  /** Posições de cada slot no grid */
  positions: GridPosition[];
  /** Número máximo de imagens para este preset */
  maxImages: number;
  /** Nome amigável para exibição */
  name: string;
  /** Ícone visual do preset (caracteres ASCII para representação) */
  icon: string;
}
