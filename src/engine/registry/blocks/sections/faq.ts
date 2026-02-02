import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const faqBlock: BlockDefinition = {
  type: "faq",
  name: "FAQ",
  description: "Seção FAQ completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Perguntas Frequentes",
    items: [
      { question: "Como funciona?", answer: "Explicamos tudo aqui." },
      { question: "Qual o preço?", answer: "Confira nossa página de preços." },
      { question: "Posso cancelar?", answer: "Sim, a qualquer momento." },
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
componentRegistry.register(faqBlock);
