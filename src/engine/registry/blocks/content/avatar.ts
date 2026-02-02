import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const avatarBlock: BlockDefinition = {
  type: "avatar",
  name: "Avatar",
  description: "Imagem circular com fallback",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    size: "md",
  },
  inspectorMeta: {
    src: {
      label: "Imagem do Avatar",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    name: {
      label: "Nome (para iniciais)",
      inputType: "text",
      group: "Conteúdo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(avatarBlock);
