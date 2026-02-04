/**
 * Presets de variações do bloco Navbar
 *
 * Cada variação define um conjunto de defaultProps que são aplicados
 * quando o usuário seleciona a variação. Os valores aparecem nos
 * controles do editor e podem ser customizados.
 *
 * IMPORTANTE: As variações NÃO definem cores! As cores vêm da paleta
 * escolhida pelo usuário e são preservadas ao trocar de variação.
 *
 * Variações disponíveis:
 * - Simples: Design limpo, sem efeitos visuais
 * - Moderno: Visual contemporâneo com sombra
 * - Glass: Efeito glassmorphism com transparência e blur
 * - Elegante: Refinado com botão outline
 * - Pill: Formato pílula flutuante com cantos muito arredondados
 */

import type { NavbarVariationId } from "../schema/siteDocument";

export interface NavbarVariationPreset {
  id: NavbarVariationId;
  name: string;
  description: string;
  defaultProps: {
    variation: NavbarVariationId;
    // Estrutura/Layout
    sticky: boolean;
    floating: boolean;
    layout: "expanded" | "centered" | "compact";
    // Visual (sem cores!)
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg" | "xl";
    opacity: number;
    blurOpacity: number;
    // Botão - apenas variante e forma
    buttonVariant: "solid" | "outline" | "ghost";
    buttonBorderRadius: number;
    // Logo
    logoHeight: number;
    // Links
    linkFontSize: "sm" | "md" | "lg";
  };
}

export const navbarVariations: Record<NavbarVariationId, NavbarVariationPreset> = {
  /**
   * SIMPLES
   * Design limpo e minimalista, sem sombra nem cantos arredondados.
   * Ideal para sites que preferem um visual clean e direto.
   */
  "navbar-simples": {
    id: "navbar-simples",
    name: "Simples",
    description: "Design limpo e minimalista",
    defaultProps: {
      variation: "navbar-simples",
      // Estrutura
      sticky: true,
      floating: false,
      layout: "expanded",
      // Visual - clean, sem efeitos
      borderRadius: 0,
      shadow: "none",
      opacity: 100,
      blurOpacity: 0,
      // Botão
      buttonVariant: "solid",
      buttonBorderRadius: 4,
      // Logo
      logoHeight: 45,
      // Links
      linkFontSize: "sm",
    },
  },

  /**
   * MODERNO
   * Visual contemporâneo com sombra pronunciada.
   * Transmite profissionalismo e modernidade.
   */
  "navbar-moderno": {
    id: "navbar-moderno",
    name: "Moderno",
    description: "Contemporâneo com sombra",
    defaultProps: {
      variation: "navbar-moderno",
      // Estrutura
      sticky: true,
      floating: false,
      layout: "expanded",
      // Visual - moderno com sombra mais pronunciada
      borderRadius: 0,
      shadow: "md",
      opacity: 100,
      blurOpacity: 0,
      // Botão
      buttonVariant: "solid",
      buttonBorderRadius: 8,
      // Logo
      logoHeight: 55,
      // Links
      linkFontSize: "md",
    },
  },

  /**
   * GLASS (Glassmorphism)
   * Efeito de vidro fosco com transparência e blur.
   * Ideal para sobrepor heroes com imagem de fundo.
   */
  "navbar-glass": {
    id: "navbar-glass",
    name: "Glass",
    description: "Vidro com transparência",
    defaultProps: {
      variation: "navbar-glass",
      // Estrutura
      sticky: true,
      floating: true,
      layout: "expanded",
      // Visual - glassmorphism
      borderRadius: 16,
      shadow: "lg",
      opacity: 75,
      blurOpacity: 60,
      // Botão
      buttonVariant: "solid",
      buttonBorderRadius: 10,
      // Logo
      logoHeight: 50,
      // Links
      linkFontSize: "md",
    },
  },

  /**
   * ELEGANTE
   * Design refinado com sombra sutil e botão outline.
   * Transmite sofisticação e elegância.
   */
  "navbar-elegante": {
    id: "navbar-elegante",
    name: "Elegante",
    description: "Refinado com botão outline",
    defaultProps: {
      variation: "navbar-elegante",
      // Estrutura
      sticky: true,
      floating: false,
      layout: "expanded",
      // Visual - elegante e refinado
      borderRadius: 0,
      shadow: "sm",
      opacity: 100,
      blurOpacity: 0,
      // Botão - outline para elegância
      buttonVariant: "outline",
      buttonBorderRadius: 6,
      // Logo
      logoHeight: 50,
      // Links
      linkFontSize: "md",
    },
  },

  /**
   * PILL (Pílula Flutuante)
   * Formato pílula flutuante com cantos muito arredondados.
   * Visual moderno e destacado, ótimo para landing pages.
   */
  "navbar-pill": {
    id: "navbar-pill",
    name: "Pill",
    description: "Pílula flutuante arredondada",
    defaultProps: {
      variation: "navbar-pill",
      // Estrutura
      sticky: true,
      floating: true,
      layout: "expanded",
      // Visual - formato pílula
      borderRadius: 32,
      shadow: "xl",
      opacity: 100,
      blurOpacity: 0,
      // Botão - arredondado para combinar
      buttonVariant: "solid",
      buttonBorderRadius: 20,
      // Logo
      logoHeight: 45,
      // Links
      linkFontSize: "sm",
    },
  },
};

export const navbarVariationIds: NavbarVariationId[] = [
  "navbar-simples",
  "navbar-moderno",
  "navbar-glass",
  "navbar-elegante",
  "navbar-pill",
];

export function getNavbarVariation(id: NavbarVariationId): NavbarVariationPreset {
  return navbarVariations[id];
}
