import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const dividerBlock: BlockDefinition = {
  type: "divider",
  name: "Divider",
  description: "Divisor horizontal",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    color: "#e5e7eb",
    thickness: "1px",
  },
  inspectorMeta: {
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
    thickness: {
      label: "Espessura",
      inputType: "text",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(dividerBlock);
