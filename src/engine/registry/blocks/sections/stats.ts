import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const statsBlock: BlockDefinition = {
  type: "stats",
  name: "Stats",
  description: "Seção de estatísticas",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Números que Impressionam",
    items: [
      { value: "10K+", label: "Usuários" },
      { value: "99%", label: "Satisfação" },
      { value: "24/7", label: "Suporte" },
      { value: "50+", label: "Países" },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(statsBlock);
