import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const badgeBlock: BlockDefinition = {
  type: "badge",
  name: "Badge",
  description: "Tag/badge com variantes",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Badge",
    variant: "default",
    size: "md",
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Primário", value: "primary" },
        { label: "Secundário", value: "secondary" },
        { label: "Sucesso", value: "success" },
        { label: "Aviso", value: "warning" },
        { label: "Perigo", value: "danger" },
        { label: "Info", value: "info" },
      ],
      group: "Estilo",
    },
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
  },
};

// Auto-registro
componentRegistry.register(badgeBlock);
