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
  variation: "navbar-classic",
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
  blurOpacity: 10,
  logoHeight: 70,
  linkFontSize: "md",
  buttonVariant: "solid",
  buttonBorderRadius: 8,
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
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    // === GRUPO: 🎨 Aparência ===
    bg: {
      label: "Cor de Fundo",
      inputType: "color-advanced",
      group: "🎨 Aparência",
    },
    opacity: {
      label: "Transparência",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "🎨 Aparência",
    },
    blurOpacity: {
      label: "Intensidade do Desfoque",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "🎨 Aparência",
    },
    borderRadius: {
      label: "Cantos Arredondados",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "🎨 Aparência",
    },
    shadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Pequena", value: "sm" },
        { label: "Média", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "🎨 Aparência",
    },

    // === GRUPO: 📐 Layout ===
    layout: {
      label: "Organização dos Itens",
      inputType: "select",
      options: [
        { label: "Expandido", value: "expanded" },
        { label: "Centralizado", value: "centered" },
        { label: "Compacto", value: "compact" },
      ],
      group: "📐 Layout",
    },
    sticky: {
      label: "Fixar no Topo da Página",
      inputType: "checkbox",
      group: "📐 Layout",
    },
    floating: {
      label: "Menu Flutuante",
      inputType: "checkbox",
      group: "📐 Layout",
    },

    // === GRUPO: 🖼️ Logo ===
    logo: {
      label: "Logo (Imagem)",
      inputType: "image-upload",
      group: "🖼️ Logo",
    },
    logoHeight: {
      label: "Tamanho do Logo (px)",
      inputType: "slider",
      min: 40,
      max: 130,
      step: 5,
      group: "🖼️ Logo",
    },
    logoText: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "🖼️ Logo",
    },

    // === GRUPO: 🔗 Links ===
    linkColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "🔗 Links",
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "🔗 Links",
    },
    linkFontSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "🔗 Links",
    },

    // === GRUPO: 🎯 Botão CTA ===
    buttonVariant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Sólido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "🎯 Botão CTA",
    },
    buttonColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "🎯 Botão CTA",
    },
    buttonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "🎯 Botão CTA",
    },
    buttonBorderRadius: {
      label: "Cantos Arredondados do Botão",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "🎯 Botão CTA",
    },
  },
};

// Auto-registro
componentRegistry.register(navbarBlock);
