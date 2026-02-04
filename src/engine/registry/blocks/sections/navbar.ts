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
  logoPosition: "left",
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
  buttonHoverEffect: "darken",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
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
    // === GRUPO: 📐 Posicionamento ===
    layout: {
      label: "Organização",
      inputType: "select",
      options: [
        { label: "Expandido", value: "expanded" },
        { label: "Centralizado", value: "centered" },
        { label: "Compacto", value: "compact" },
      ],
      group: "📐 Posicionamento",
    },
    sticky: {
      label: "Fixar no Topo",
      inputType: "checkbox",
      size: "sm",
      group: "📐 Posicionamento",
    },
    floating: {
      label: "Menu Flutuante",
      inputType: "checkbox",
      size: "sm",
      group: "📐 Posicionamento",
    },

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
      label: "Desfoque",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "🎨 Aparência",
    },
    borderRadius: {
      label: "Cantos",
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
      group: "🎨 Aparência",
    },
    borderWidth: {
      label: "Espessura da Borda",
      inputType: "slider",
      min: 1,
      max: 4,
      step: 1,
      group: "🎨 Aparência",
    },
    borderColor: {
      label: "Cor da Borda",
      inputType: "color-advanced",
      group: "🎨 Aparência",
    },

    // === GRUPO: 🖼️ Logo e Marca ===
    logo: {
      label: "Logo (Imagem)",
      inputType: "image-upload",
      group: "🖼️ Logo e Marca",
    },
    logoHeight: {
      label: "Tamanho do Logo",
      inputType: "slider",
      min: 40,
      max: 130,
      step: 5,
      group: "🖼️ Logo e Marca",
    },
    logoPosition: {
      label: "Posição do Logo",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
      ],
      group: "🖼️ Logo e Marca",
    },
    logoText: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "🖼️ Logo e Marca",
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
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Fundo", value: "background" },
        { label: "Sublinhado →", value: "underline" },
        { label: "Sublinhado ←→", value: "underline-center" },
        { label: "Fundo ↑", value: "slide-bg" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "🔗 Links",
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
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
      label: "Cantos do Botão",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "🎯 Botão CTA",
    },
    buttonHoverEffect: {
      label: "Efeito Principal",
      inputType: "select",
      options: [
        { label: "Escurecer", value: "darken" },
        { label: "Clarear", value: "lighten" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
        { label: "Sombra", value: "shadow" },
        { label: "Pulso", value: "pulse" },
      ],
      group: "🎯 Botão CTA",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "🎯 Botão CTA",
    },
    buttonHoverOverlay: {
      label: "Efeito Extra",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "✨ Brilho", value: "shine" },
        { label: "🌊 Ondas", value: "ripple" },
        { label: "🌈 Gradiente", value: "gradient" },
        { label: "⭐ Faíscas", value: "sparkle" },
        { label: "💫 Borda Glow", value: "border-glow" },
      ],
      group: "🎯 Botão CTA",
    },
  },
};

// Auto-registro
componentRegistry.register(navbarBlock);
