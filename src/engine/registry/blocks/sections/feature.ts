import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const featureBlock: BlockDefinition = {
  type: "feature",
  name: "Feature",
  description: "Card de feature individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    icon: "star",
    title: "Feature",
    description: "Descrição da feature",
  },
  inspectorMeta: {
    icon: {
      label: "Ícone",
      inputType: "select",
      options: [
        { label: "Estrela", value: "star" },
        { label: "Check", value: "check" },
        { label: "Raio", value: "zap" },
        { label: "Escudo", value: "shield" },
        { label: "Foguete", value: "rocket" },
        { label: "Globo", value: "globe" },
        { label: "Gráfico", value: "bar-chart" },
        { label: "Usuários", value: "users" },
      ],
      group: "Conteúdo",
    },
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(featureBlock);
