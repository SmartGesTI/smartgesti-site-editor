/**
 * Image Grid Presets
 * Configurações de layout para cada preset da grid de imagens
 */

import type { ImageGridPreset, GridPresetConfig } from "./types";

/**
 * Mapeamento de presets para configurações de CSS Grid
 *
 * Cada preset define:
 * - gridTemplate: Template do grid CSS
 * - positions: Posições de cada imagem no grid
 * - maxImages: Número máximo de imagens
 * - name: Nome para exibição
 * - icon: Representação visual simplificada
 */
export const gridPresetMap: Record<ImageGridPreset, GridPresetConfig> = {
  /**
   * Single: 1 imagem ocupando toda a grid
   * ┌───────────────────┐
   * │                   │
   * │     Img 1 (2x2)   │
   * │                   │
   * └───────────────────┘
   */
  single: {
    gridTemplate: "1fr / 1fr",
    positions: [{ col: "1 / -1", row: "1 / -1" }],
    maxImages: 1,
    name: "Única",
    icon: "■",
  },

  /**
   * Two Horizontal: 2 imagens lado a lado
   * ┌─────────┬─────────┐
   * │         │         │
   * │  Img 1  │  Img 2  │
   * │         │         │
   * └─────────┴─────────┘
   */
  "two-horizontal": {
    gridTemplate: "1fr / 1fr 1fr",
    positions: [
      { col: "1 / 2", row: "1 / -1" },
      { col: "2 / 3", row: "1 / -1" },
    ],
    maxImages: 2,
    name: "2 Horizontal",
    icon: "▌▐",
  },

  /**
   * Two Vertical: 2 imagens empilhadas
   * ┌───────────────────┐
   * │      Img 1        │
   * ├───────────────────┤
   * │      Img 2        │
   * └───────────────────┘
   */
  "two-vertical": {
    gridTemplate: "1fr 1fr / 1fr",
    positions: [
      { col: "1 / -1", row: "1 / 2" },
      { col: "1 / -1", row: "2 / 3" },
    ],
    maxImages: 2,
    name: "2 Vertical",
    icon: "▀▄",
  },

  /**
   * Three Left: 1 grande à esquerda + 2 pequenas à direita
   * ┌─────────┬─────────┐
   * │         │  Img 2  │
   * │  Img 1  ├─────────┤
   * │  (1x2)  │  Img 3  │
   * └─────────┴─────────┘
   */
  "three-left": {
    gridTemplate: "1fr 1fr / 1fr 1fr",
    positions: [
      { col: "1 / 2", row: "1 / 3" }, // Grande esquerda
      { col: "2 / 3", row: "1 / 2" }, // Pequena superior direita
      { col: "2 / 3", row: "2 / 3" }, // Pequena inferior direita
    ],
    maxImages: 3,
    name: "3 Esquerda",
    icon: "█▐",
  },

  /**
   * Three Right: 2 pequenas à esquerda + 1 grande à direita
   * ┌─────────┬─────────┐
   * │  Img 1  │         │
   * ├─────────┤  Img 3  │
   * │  Img 2  │  (1x2)  │
   * └─────────┴─────────┘
   */
  "three-right": {
    gridTemplate: "1fr 1fr / 1fr 1fr",
    positions: [
      { col: "1 / 2", row: "1 / 2" }, // Pequena superior esquerda
      { col: "1 / 2", row: "2 / 3" }, // Pequena inferior esquerda
      { col: "2 / 3", row: "1 / 3" }, // Grande direita
    ],
    maxImages: 3,
    name: "3 Direita",
    icon: "▌█",
  },

  /**
   * Three Top: 1 grande no topo + 2 pequenas embaixo
   * ┌───────────────────┐
   * │    Img 1 (2x1)    │
   * ├─────────┬─────────┤
   * │  Img 2  │  Img 3  │
   * └─────────┴─────────┘
   */
  "three-top": {
    gridTemplate: "1fr 1fr / 1fr 1fr",
    positions: [
      { col: "1 / 3", row: "1 / 2" }, // Grande topo
      { col: "1 / 2", row: "2 / 3" }, // Pequena inferior esquerda
      { col: "2 / 3", row: "2 / 3" }, // Pequena inferior direita
    ],
    maxImages: 3,
    name: "3 Topo",
    icon: "▀▀",
  },

  /**
   * Four Equal: 4 imagens iguais (2x2)
   * ┌─────────┬─────────┐
   * │  Img 1  │  Img 2  │
   * ├─────────┼─────────┤
   * │  Img 3  │  Img 4  │
   * └─────────┴─────────┘
   */
  "four-equal": {
    gridTemplate: "1fr 1fr / 1fr 1fr",
    positions: [
      { col: "1 / 2", row: "1 / 2" },
      { col: "2 / 3", row: "1 / 2" },
      { col: "1 / 2", row: "2 / 3" },
      { col: "2 / 3", row: "2 / 3" },
    ],
    maxImages: 4,
    name: "4 Iguais",
    icon: "▚▞",
  },
};

/**
 * Lista ordenada de presets para exibição no seletor
 */
export const imageGridPresetIds: ImageGridPreset[] = [
  "single",
  "two-horizontal",
  "two-vertical",
  "three-left",
  "three-right",
  "three-top",
  "four-equal",
];

/**
 * Obtém a configuração de um preset
 */
export function getGridPresetConfig(preset: ImageGridPreset): GridPresetConfig {
  return gridPresetMap[preset];
}

/**
 * Obtém o número máximo de imagens para um preset
 */
export function getMaxImagesForPreset(preset: ImageGridPreset): number {
  return gridPresetMap[preset].maxImages;
}
