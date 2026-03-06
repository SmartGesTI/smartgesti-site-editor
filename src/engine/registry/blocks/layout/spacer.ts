import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const spacerBlock: BlockDefinition = {
  type: "spacer",
  name: "Espaçador",
  description: "Espaço vazio entre elementos",
  category: "layout",
  userCategory: "Estrutura",
  canHaveChildren: false,
  defaultProps: {
    height: "2rem",
  },
  inspectorMeta: {
    height: {
      label: "Altura",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(spacerBlock);
