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
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
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
  },
};

// Auto-registro
componentRegistry.register(buttonBlock);
