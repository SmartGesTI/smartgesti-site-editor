import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const faqItemBlock: BlockDefinition = {
  type: "faqItem",
  name: "FAQ Item",
  description: "Item individual do FAQ",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    question: "Pergunta frequente?",
    answer: "Resposta detalhada aqui.",
  },
  inspectorMeta: {
    question: {
      label: "Pergunta",
      inputType: "text",
      group: "Conteúdo",
    },
    answer: {
      label: "Resposta",
      inputType: "textarea",
      group: "Conteúdo",
    },
    defaultOpen: {
      label: "Aberto por Padrão",
      inputType: "checkbox",
      group: "Opções",
    },
  },
};

// Auto-registro
componentRegistry.register(faqItemBlock);
