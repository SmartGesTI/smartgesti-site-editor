import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const sectionBlock: BlockDefinition = {
  type: "section",
  name: "Seção",
  description: "Container de seção com fundo",
  category: "composition",
  userCategory: "Estrutura",
  canHaveChildren: true,
  defaultProps: {
    padding: "2rem",
  },
  inspectorMeta: {
    id: {
      label: "ID",
      inputType: "text",
      group: "Geral",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Estilo",
    },
    padding: {
      label: "Espaçamento Interno",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(sectionBlock);
