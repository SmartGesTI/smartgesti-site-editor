import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const ctaBlock: BlockDefinition = {
  type: "cta",
  name: "CTA",
  description: "Seção Call-to-Action",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Pronto para começar?",
    description: "Junte-se a milhares de usuários satisfeitos.",
    primaryButton: { text: "Começar Agora" },
    variant: "centered",
    // Button defaults
    buttonSize: "md",
    // Button hover defaults
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
    buttonHoverIconName: "arrow-right",
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    variant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Centralizado", value: "centered" },
        { label: "Dividido", value: "split" },
        { label: "Com Efeito de Cores", value: "gradient" },
      ],
      group: "Estilo",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
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
componentRegistry.register(ctaBlock);
