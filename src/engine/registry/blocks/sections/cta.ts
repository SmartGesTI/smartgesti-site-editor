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
    // Button hover defaults
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
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
    // Button hover effects (principal)
    buttonHoverEffect: {
      label: "Efeito Principal",
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
      group: "🎯 Botões",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "🎯 Botões",
    },
    // Button hover overlay (adicional)
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
      group: "🎯 Botões",
    },
  },
};

// Auto-registro
componentRegistry.register(ctaBlock);
