import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const linkBlock: BlockDefinition = {
  type: "link",
  name: "Link",
  description: "Link",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Link",
    href: "#",
    target: "_self",
    // Hover effects defaults
    hoverEffect: "underline",
    hoverIntensity: 50,
  },
  constraints: {
    required: ["text", "href"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    href: {
      label: "URL",
      inputType: "text",
      group: "Conteúdo",
    },
    target: {
      label: "Onde Abrir o Link",
      inputType: "select",
      options: [
        { label: "Mesma Janela", value: "_self" },
        { label: "Nova Janela", value: "_blank" },
      ],
      group: "Conteúdo",
    },
    // Hover effects
    hoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Fundo", value: "background" },
        { label: "Sublinhado →", value: "underline" },
        { label: "Sublinhado ←→", value: "underline-center" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "🔗 Hover",
    },
    hoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "🔗 Hover",
    },
    hoverColor: {
      label: "Cor no Hover",
      inputType: "color-advanced",
      group: "🔗 Hover",
    },
  },
};

// Auto-registro
componentRegistry.register(linkBlock);
