import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const cardBlock: BlockDefinition = {
  type: "card",
  name: "Card",
  description: "Card com slots (header/content/footer)",
  category: "composition",
  canHaveChildren: false,
  defaultProps: {
    padding: "1rem",
  },
  slots: [
    { name: "header", label: "Cabeçalho", required: false },
    { name: "content", label: "Conteúdo", required: true },
    { name: "footer", label: "Rodapé", required: false },
  ],
  inspectorMeta: {
    padding: {
      label: "Espaçamento Interno",
      inputType: "text",
      group: "Layout",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Estilo",
    },
    border: {
      label: "Borda",
      inputType: "text",
      group: "Estilo",
    },
    radius: {
      label: "Raio",
      inputType: "text",
      group: "Estilo",
    },
    shadow: {
      label: "Sombra",
      inputType: "text",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(cardBlock);
