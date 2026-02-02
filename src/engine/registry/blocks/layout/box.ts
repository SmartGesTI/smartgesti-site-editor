import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const boxBlock: BlockDefinition = {
  type: "box",
  name: "Box",
  description: "Container genérico com estilos",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    padding: "1rem",
  },
  inspectorMeta: {
    bg: {
      label: "Background",
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
    padding: {
      label: "Padding",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(boxBlock);
