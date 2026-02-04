import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const buttonBlock: BlockDefinition = {
  type: "button",
  name: "Button",
  description: "Botão",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Clique aqui",
    variant: "primary",
    size: "md",
    // Hover effects defaults
    hoverEffect: "darken",
    hoverIntensity: 50,
    hoverOverlay: "none",
  },
  constraints: {
    required: ["text"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    href: {
      label: "Link",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Estilo do Botão",
      inputType: "select",
      options: [
        { label: "Principal", value: "primary" },
        { label: "Secundário", value: "secondary" },
        { label: "Apenas Contorno", value: "outline" },
        { label: "Transparente", value: "ghost" },
      ],
      group: "Estilo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
    // Hover effects (principal)
    hoverEffect: {
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
      group: "🎯 Hover",
    },
    hoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "🎯 Hover",
    },
    // Hover overlay (adicional - combina com o principal)
    hoverOverlay: {
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
      group: "🎯 Hover",
    },
  },
};

// Auto-registro
componentRegistry.register(buttonBlock);
