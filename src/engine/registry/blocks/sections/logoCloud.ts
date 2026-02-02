import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const logoCloudBlock: BlockDefinition = {
  type: "logoCloud",
  name: "Logo Cloud",
  description: "Grid de logos de clientes/parceiros",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Empresas que confiam em nós",
    logos: [],
    grayscale: true,
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    grayscale: {
      label: "Escala de Cinza",
      inputType: "checkbox",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(logoCloudBlock);
