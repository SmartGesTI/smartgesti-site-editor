import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const productShowcaseBlock: BlockDefinition = {
  type: "productShowcase",
  name: "Vitrine de Produtos",
  description: "Produtos com layout alternado imagem/texto",
  category: "sections",
  userCategory: "Institucional",
  canHaveChildren: false,
  defaultProps: {
    title: "Nossos Produtos",
    subtitle: "Conheça nossas soluções",
    variant: "alternating",
    buttonHoverEffect: "none",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
    products: [
      {
        name: "Produto Principal",
        description: "Descrição breve do produto.",
        longDescription: "Uma descrição mais detalhada sobre o que esse produto oferece e como pode ajudar.",
        badge: "Destaque",
        icon: "🚀",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        primaryButton: { text: "Saiba Mais" },
      },
      {
        name: "Segundo Produto",
        description: "Descrição breve do segundo produto.",
        longDescription: "Detalhes adicionais sobre o segundo produto e seus benefícios.",
        icon: "⭐",
        features: ["Feature A", "Feature B", "Feature C"],
        primaryButton: { text: "Saiba Mais" },
      },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Layout",
      inputType: "select",
      options: [
        { label: "Alternado", value: "alternating" },
        { label: "Grid", value: "grid" },
        { label: "Empilhado", value: "stacked" },
      ],
      group: "Layout",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Estilo",
    },
    buttonHoverEffect: {
      label: "Efeito do Botão",
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
      group: "Hover",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Hover",
    },
    buttonHoverOverlay: {
      label: "Efeito Extra",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Brilho", value: "shine" },
        { label: "Preenchimento", value: "fill" },
        { label: "Salto", value: "bounce" },
        { label: "Ícone", value: "icon" },
        { label: "Borda Glow", value: "border-glow" },
      ],
      group: "Hover",
    },
    buttonHoverIconName: {
      label: "Ícone",
      inputType: "icon-grid",
      group: "Hover",
      showWhen: { field: "buttonHoverOverlay", equals: "icon" },
    },
  },
};

// Auto-registro
componentRegistry.register(productShowcaseBlock);
