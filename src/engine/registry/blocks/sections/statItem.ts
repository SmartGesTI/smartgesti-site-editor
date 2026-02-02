import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const statItemBlock: BlockDefinition = {
  type: "statItem",
  name: "Stat Item",
  description: "Item individual de estatística",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    value: "100",
    label: "Clientes",
  },
  inspectorMeta: {
    value: {
      label: "Valor",
      inputType: "text",
      group: "Conteúdo",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    prefix: {
      label: "Prefixo",
      inputType: "text",
      group: "Conteúdo",
    },
    suffix: {
      label: "Sufixo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(statItemBlock);
