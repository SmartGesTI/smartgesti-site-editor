import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const headingBlock: BlockDefinition = {
  type: "heading",
  name: "Heading",
  description: "Título (H1-H6)",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    level: 1,
    text: "Título",
    align: "left",
  },
  constraints: {
    required: ["text", "level"],
  },
  inspectorMeta: {
    level: {
      label: "Nível",
      inputType: "select",
      options: [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 },
        { label: "H4", value: 4 },
        { label: "H5", value: 5 },
        { label: "H6", value: 6 },
      ],
      group: "Conteúdo",
    },
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
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(headingBlock);
