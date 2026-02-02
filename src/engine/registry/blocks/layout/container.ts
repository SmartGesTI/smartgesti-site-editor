import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const containerBlock: BlockDefinition = {
  type: "container",
  name: "Container",
  description: "Container com largura máxima e padding",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    maxWidth: "1200px",
    padding: "1rem",
  },
  inspectorMeta: {
    maxWidth: {
      label: "Largura Máxima",
      description: "Largura máxima do container",
      inputType: "text",
      group: "Layout",
    },
    padding: {
      label: "Padding",
      description: "Espaçamento interno",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(containerBlock);
