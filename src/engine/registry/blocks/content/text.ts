import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const textBlock: BlockDefinition = {
  type: "text",
  name: "Text",
  description: "Parágrafo de texto",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Texto do parágrafo",
    align: "left",
    size: "md",
  },
  constraints: {
    required: ["text"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "textarea",
      group: "Conteúdo",
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
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(textBlock);
