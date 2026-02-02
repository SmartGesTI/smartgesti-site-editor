import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const sectionBlock: BlockDefinition = {
  type: "section",
  name: "Section",
  description: "Seção container",
  category: "composition",
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
      label: "Background",
      inputType: "color",
      group: "Estilo",
    },
    padding: {
      label: "Padding",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(sectionBlock);
