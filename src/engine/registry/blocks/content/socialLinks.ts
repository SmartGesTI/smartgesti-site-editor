import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const socialLinksBlock: BlockDefinition = {
  type: "socialLinks",
  name: "Social Links",
  description: "Links para redes sociais",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    size: "md",
    variant: "default",
    links: [
      { platform: "facebook", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "instagram", url: "#" },
    ],
  },
  inspectorMeta: {
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Preenchido", value: "filled" },
      ],
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(socialLinksBlock);
