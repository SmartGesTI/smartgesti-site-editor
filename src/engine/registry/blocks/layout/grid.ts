import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const gridBlock: BlockDefinition = {
  type: "grid",
  name: "Grid",
  description: "Layout em grid responsivo",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    cols: 3,
    gap: "1rem",
  },
  inspectorMeta: {
    cols: {
      label: "Colunas",
      description: "Número de colunas (ou objeto responsivo)",
      inputType: "number",
      min: 1,
      max: 12,
      group: "Layout",
    },
    colTemplate: {
      label: "Template de Colunas",
      description: "CSS grid-template-columns (ex: '1fr 320px'). Se definido, sobrescreve 'Colunas'.",
      inputType: "text",
      group: "Layout",
    },
    gap: {
      label: "Gap",
      inputType: "text",
      group: "Layout",
    },
    maxWidth: {
      label: "Largura Máxima",
      description: "Largura máxima do container (ex: '1200px'). Centraliza com margem automática.",
      inputType: "text",
      group: "Espaçamento",
    },
    padding: {
      label: "Padding Lateral",
      description: "Espaçamento horizontal interno (ex: '2rem')",
      inputType: "text",
      group: "Espaçamento",
    },
  },
};

// Auto-registro
componentRegistry.register(gridBlock);
