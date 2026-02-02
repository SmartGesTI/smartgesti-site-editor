import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const pricingCardBlock: BlockDefinition = {
  type: "pricingCard",
  name: "Pricing Card",
  description: "Card de preço individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    name: "Plano Pro",
    price: "R$ 99",
    period: "/mês",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    buttonText: "Começar",
  },
  inspectorMeta: {
    name: {
      label: "Nome do Plano",
      inputType: "text",
      group: "Conteúdo",
    },
    price: {
      label: "Preço",
      inputType: "text",
      group: "Conteúdo",
    },
    period: {
      label: "Período",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "text",
      group: "Conteúdo",
    },
    buttonText: {
      label: "Texto do Botão",
      inputType: "text",
      group: "Conteúdo",
    },
    highlighted: {
      label: "Destacado",
      inputType: "checkbox",
      group: "Estilo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(pricingCardBlock);
