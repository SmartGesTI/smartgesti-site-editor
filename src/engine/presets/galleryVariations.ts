/**
 * Presets de variações do bloco ImageGallery
 */

import type { GalleryVariation } from "../schema/siteDocument";

export interface GalleryVariationPreset {
  id: GalleryVariation;
  name: string;
  description: string;
  thumbnail?: string; // Future: add preview image URLs
  defaultProps: {
    variation: GalleryVariation;
    columns: 2 | 3 | 4;
    gap: number;
    aspectRatio?: "1/1" | "4/3" | "16/9" | "3/2" | "auto";
    imageBorderRadius: number;
    imageShadow: "none" | "sm" | "md" | "lg" | "xl";
    enterAnimation: "fade-scale" | "stagger" | "slide-up" | "none";
    hoverEffect: "zoom-overlay" | "glow" | "scale" | "caption-reveal" | "none";
  };
}

export const galleryVariations: Record<GalleryVariation, GalleryVariationPreset> = {
  // ============================================================================
  // GALLERY GRID - Grade clássica de imagens
  // ============================================================================
  "gallery-grid": {
    id: "gallery-grid",
    name: "Grid Clássico",
    description: "Grade responsiva com 4 colunas",
    defaultProps: {
      variation: "gallery-grid",
      columns: 4,
      gap: 1,
      aspectRatio: "auto",
      imageBorderRadius: 8,
      imageShadow: "md",
      enterAnimation: "fade-scale",
      hoverEffect: "zoom-overlay",
    },
  },

  // ============================================================================
  // FUTURE VARIATIONS (v1.1-v1.4) - Placeholders for now
  // ============================================================================
  "gallery-masonry": {
    id: "gallery-masonry",
    name: "Mosaico",
    description: "Grade tipo Pinterest com alturas variadas",
    defaultProps: {
      variation: "gallery-masonry",
      columns: 3,
      gap: 1.5,
      aspectRatio: "auto",
      imageBorderRadius: 12,
      imageShadow: "lg",
      enterAnimation: "stagger",
      hoverEffect: "scale",
    },
  },

  "gallery-featured": {
    id: "gallery-featured",
    name: "Destaque",
    description: "Uma imagem grande + grid de miniaturas",
    defaultProps: {
      variation: "gallery-featured",
      columns: 3,
      gap: 1,
      aspectRatio: "16/9",
      imageBorderRadius: 8,
      imageShadow: "lg",
      enterAnimation: "slide-up",
      hoverEffect: "glow",
    },
  },

  "gallery-carousel": {
    id: "gallery-carousel",
    name: "Carrossel",
    description: "Slider horizontal de imagens",
    defaultProps: {
      variation: "gallery-carousel",
      columns: 4, // Not used in carousel but required by type
      gap: 1.5,
      aspectRatio: "16/9",
      imageBorderRadius: 16,
      imageShadow: "xl",
      enterAnimation: "fade-scale",
      hoverEffect: "caption-reveal",
    },
  },

  "gallery-alternating": {
    id: "gallery-alternating",
    name: "Alternado",
    description: "Layout em zigue-zague",
    defaultProps: {
      variation: "gallery-alternating",
      columns: 2,
      gap: 2,
      aspectRatio: "4/3",
      imageBorderRadius: 12,
      imageShadow: "lg",
      enterAnimation: "stagger",
      hoverEffect: "zoom-overlay",
    },
  },
};
