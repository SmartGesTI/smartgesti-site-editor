import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";
import { heroVariations, heroVariationIds } from "../../../presets/heroVariations";

export const heroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero",
  description: "Seção hero completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    variant: "centered",
    title: "Bem-vindo ao Nosso Site",
    subtitle: "Subtitulo incrível aqui",
    description: "Uma descrição breve do seu produto ou serviço.",
    primaryButton: { text: "Começar Agora" },
    secondaryButton: { text: "Saber Mais" },
    align: "center",
    // Button defaults
    buttonSize: "md",
    // Button hover defaults
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
    buttonHoverIconName: "arrow-right",
  },
  variations: heroVariationIds.reduce(
    (acc, id) => {
      const v = heroVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    // variation/variant removidos - os botões de variação são renderizados automaticamente pelo VariationSelector
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
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
    image: {
      label: "Imagem de Fundo",
      inputType: "image-upload",
      group: "Mídia",
      description: "Adicione uma imagem ao fundo da seção principal",
    },
    overlay: {
      label: "Escurecer imagem de fundo",
      inputType: "checkbox",
      group: "Estilo",
    },
    overlayColor: {
      label: "Cor da camada",
      inputType: "color-advanced",
      group: "Estilo",
      description: "Escolha a cor da camada sobre a imagem",
    },
    background: {
      label: "Cor de fundo",
      inputType: "color-advanced",
      group: "Estilo",
      description: "Cor de fundo da seção",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Estilo",
    },
    // Button size
    buttonSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Medio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Botoes",
    },
    // Button hover effects (principal)
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
      group: "Botoes",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Botoes",
    },
    // Button hover overlay (adicional)
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
      group: "Botoes",
    },
    buttonHoverIconName: {
      label: "Icone",
      inputType: "icon-grid",
      group: "Botoes",
      showWhen: { field: "buttonHoverOverlay", equals: "icon" },
    },
  },
};

// Auto-registro
componentRegistry.register(heroBlock);
