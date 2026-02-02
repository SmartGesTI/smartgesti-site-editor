import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const pricingBlock: BlockDefinition = {
  type: "pricing",
  name: "Pricing",
  description: "Seção de preços completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Planos e Preços",
    subtitle: "Escolha o plano ideal para você",
    plans: [
      {
        name: "Básico",
        price: "R$ 29",
        period: "/mês",
        features: ["1 Usuário", "10GB Storage", "Suporte Email"],
        buttonText: "Escolher",
      },
      {
        name: "Pro",
        price: "R$ 99",
        period: "/mês",
        features: [
          "5 Usuários",
          "100GB Storage",
          "Suporte Prioritário",
          "API Access",
        ],
        buttonText: "Escolher",
        highlighted: true,
        badge: "Popular",
      },
      {
        name: "Enterprise",
        price: "R$ 299",
        period: "/mês",
        features: [
          "Usuários Ilimitados",
          "Storage Ilimitado",
          "Suporte 24/7",
          "API Access",
          "SSO",
        ],
        buttonText: "Contato",
      },
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
componentRegistry.register(pricingBlock);
