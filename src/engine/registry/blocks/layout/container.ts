import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const containerBlock: BlockDefinition = {
  type: "container",
  name: "Contêiner",
  description: "Container com largura máxima e padding",
  category: "layout",
  userCategory: "Estrutura",
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
      label: "Espaçamento Interno",
      description: "Distância entre o conteúdo e as bordas",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(containerBlock);
