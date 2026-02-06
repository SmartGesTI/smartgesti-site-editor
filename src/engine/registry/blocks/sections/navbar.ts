import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";
import {
  navbarVariations,
  navbarVariationIds,
} from "../../../presets/navbarVariations";

/**
 * Valores padrão da Navbar - Use para garantir consistência em templates e factories
 */
export const NAVBAR_DEFAULT_PROPS = {
  variation: "navbar-moderno",
  links: [
    { text: "Início", href: "/site/p/home" },
    { text: "Serviços", href: "/site/p/servicos" },
    { text: "Produtos", href: "/site/p/produtos" },
    { text: "Contato", href: "/site/p/contato" },
  ],
  ctaButton: { text: "Começar", href: "/site/p/contato" },
  sticky: true,
  floating: false,
  layout: "expanded",
  borderRadius: 0,
  shadow: "sm",
  opacity: 100,
  blurOpacity: 0,
  logoHeight: 70,
  linkFontSize: "md",
  buttonVariant: "solid",
  buttonBorderRadius: 8,
  // Borda
  borderPosition: "none",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  // Cores padrão
  bg: "#ffffff",
  linkColor: "#374151",
  linkHoverColor: "#2563eb",
  linkHoverEffect: "background",
  linkHoverIntensity: 50,
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  buttonSize: "md",
  buttonHoverEffect: "darken",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
} as const;

export const navbarBlock: BlockDefinition = {
  type: "navbar",
  name: "Navbar",
  description: "Barra de navegação customizável",
  category: "sections",
  canHaveChildren: false,
  defaultProps: NAVBAR_DEFAULT_PROPS,
  variations: navbarVariationIds.reduce(
    (acc, id) => {
      const v = navbarVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, any> }
    >,
  ),
  inspectorMeta: {
    // === GRUPO: Posicionamento ===
    layout: {
      label: "Organizacao",
      inputType: "select",
      options: [
        { label: "Expandido", value: "expanded" },
        { label: "Centralizado", value: "centered" },
        { label: "Compacto", value: "compact" },
      ],
      group: "Posicionamento",
    },
    sticky: {
      label: "Fixar no Topo",
      inputType: "checkbox",
      size: "sm",
      group: "Posicionamento",
    },
    floating: {
      label: "Menu Flutuante",
      inputType: "checkbox",
      size: "sm",
      group: "Posicionamento",
    },

    // === GRUPO: Aparencia ===
    bg: {
      label: "Cor de Fundo",
      inputType: "color-advanced",
      group: "Aparencia",
    },
    opacity: {
      label: "Transparencia",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "Aparencia",
    },
    blurOpacity: {
      label: "Desfoque",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "Aparencia",
    },
    borderRadius: {
      label: "Cantos",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "Aparencia",
    },
    shadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Pequena", value: "sm" },
        { label: "Media", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Aparencia",
    },
    borderPosition: {
      label: "Borda",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Completa", value: "all" },
        { label: "Superior", value: "top" },
        { label: "Inferior", value: "bottom" },
        { label: "Esquerda", value: "left" },
        { label: "Direita", value: "right" },
      ],
      group: "Aparencia",
    },
    borderWidth: {
      label: "Espessura da Borda",
      inputType: "slider",
      min: 1,
      max: 4,
      step: 1,
      group: "Aparencia",
    },
    borderColor: {
      label: "Cor da Borda",
      inputType: "color-advanced",
      group: "Aparencia",
    },

    // === GRUPO: Logo e Marca ===
    logo: {
      label: "Logo (Imagem)",
      inputType: "image-upload",
      group: "Logo e Marca",
    },
    logoHeight: {
      label: "Tamanho do Logo",
      inputType: "slider",
      min: 40,
      max: 130,
      step: 5,
      group: "Logo e Marca",
    },
    logoText: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "Logo e Marca",
    },

    // === GRUPO: Links ===
    linkColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "Links",
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "Links",
    },
    linkFontSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Medio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Links",
    },
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Fundo", value: "background" },
        { label: "Sublinhado", value: "underline" },
        { label: "Sublinhado Centro", value: "underline-center" },
        { label: "Fundo Subindo", value: "slide-bg" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "Links",
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Links",
    },

    // === GRUPO: Botao CTA ===
    buttonVariant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Solido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Botao CTA",
    },
    buttonColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "Botao CTA",
    },
    buttonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Botao CTA",
    },
    buttonBorderRadius: {
      label: "Cantos do Botao",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "Botao CTA",
    },
    buttonSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Medio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Botao CTA",
    },
    buttonHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Escurecer", value: "darken" },
        { label: "Clarear", value: "lighten" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
        { label: "Sombra", value: "shadow" },
        { label: "Pulso", value: "pulse" },
      ],
      group: "Botao CTA",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Botao CTA",
    },
    buttonHoverOverlay: {
      label: "Efeito Extra",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Brilho", value: "shine" },
        { label: "Preenchimento", value: "fill" },
        { label: "Salto", value: "bounce" },
        { label: "Icone", value: "icon" },
        { label: "Borda Glow", value: "border-glow" },
      ],
      group: "Botao CTA",
    },
    buttonHoverIconName: {
      label: "Icone",
      inputType: "icon-grid",
      group: "Botao CTA",
      showWhen: { field: "buttonHoverOverlay", equals: "icon" },
    },
  },
};

// Auto-registro
componentRegistry.register(navbarBlock);
