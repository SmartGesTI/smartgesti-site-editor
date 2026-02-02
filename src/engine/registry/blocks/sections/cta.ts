import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const ctaBlock: BlockDefinition = {
  type: "cta",
  name: "CTA",
  description: "Seção Call-to-Action",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Pronto para começar?",
    description: "Junte-se a milhares de usuários satisfeitos.",
    primaryButton: { text: "Começar Agora" },
    variant: "centered",
  },
  inspectorMeta: {
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
    variant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Centralizado", value: "centered" },
        { label: "Dividido", value: "split" },
        { label: "Com Efeito de Cores", value: "gradient" },
      ],
      group: "Estilo",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(ctaBlock);
