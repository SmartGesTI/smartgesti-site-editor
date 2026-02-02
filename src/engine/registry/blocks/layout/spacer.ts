import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const spacerBlock: BlockDefinition = {
  type: "spacer",
  name: "Spacer",
  description: "Espaçador flexível",
  category: "layout",
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
