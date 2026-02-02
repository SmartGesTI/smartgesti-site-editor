import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const featureGridBlock: BlockDefinition = {
  type: "featureGrid",
  name: "Feature Grid",
  description: "Grid de features (ícones, cards ou cards com imagem)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Nossas Features",
    subtitle: "Tudo que você precisa",
    columns: 3,
    variant: "default",
    features: [
      { icon: "zap", title: "Rápido", description: "Performance incrível" },
      { icon: "shield", title: "Seguro", description: "Proteção total" },
      { icon: "rocket", title: "Escalável", description: "Cresce com você" },
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
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2 Colunas", value: 2 },
        { label: "3 Colunas", value: 3 },
        { label: "4 Colunas", value: 4 },
      ],
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Cards", value: "cards" },
        { label: "Cards com Imagem", value: "image-cards" },
      ],
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(featureGridBlock);
