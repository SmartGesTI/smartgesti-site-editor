import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const stackBlock: BlockDefinition = {
  type: "stack",
  name: "Stack",
  description: "Layout flex (linha ou coluna)",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    direction: "col",
    gap: "1rem",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
  inspectorMeta: {
    direction: {
      label: "Direção",
      inputType: "select",
      options: [
        { label: "Coluna", value: "col" },
        { label: "Linha", value: "row" },
      ],
      group: "Layout",
    },
    gap: {
      label: "Gap",
      inputType: "text",
      group: "Layout",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Fim", value: "end" },
        { label: "Esticar", value: "stretch" },
      ],
      group: "Layout",
    },
    justify: {
      label: "Justificar",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Fim", value: "end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
      ],
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(stackBlock);
