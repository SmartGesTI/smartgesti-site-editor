import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const countdownBlock: BlockDefinition = {
  type: "countdown",
  name: "Countdown",
  description: "Contador regressivo (eventos, matrículas, promoções)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Spring 2024 Admission is Now Open!",
    showPlaceholders: true,
    buttonText: "Apply Now",
    buttonHref: "#",
    variant: "banner",
    badgeText: "Admission on Going",
    bg: "var(--sg-primary)",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    description: { label: "Descrição", inputType: "text", group: "Conteúdo" },
    endDate: {
      label: "Data final (ISO)",
      inputType: "text",
      group: "Conteúdo",
    },
    showPlaceholders: {
      label: "Exibir placeholders",
      inputType: "checkbox",
      group: "Conteúdo",
    },
    buttonText: {
      label: "Texto do botão",
      inputType: "text",
      group: "Conteúdo",
    },
    buttonHref: {
      label: "Link do botão",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Banner", value: "banner" },
      ],
      group: "Layout",
    },
    badgeText: {
      label: "Texto do badge (círculo)",
      inputType: "text",
      group: "Conteúdo",
    },
    bg: { label: "Cor de fundo", inputType: "text", group: "Estilo" },
  },
};

// Auto-registro
componentRegistry.register(countdownBlock);
