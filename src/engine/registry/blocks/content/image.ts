import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const imageBlock: BlockDefinition = {
  type: "image",
  name: "Image",
  description: "Imagem",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    src: "",
    alt: "",
    objectFit: "cover",
  },
  constraints: {
    required: ["src"],
    pattern: {
      src: /^https?:\/\/.+|^\/.+|^data:image\/.+/,
    },
  },
  inspectorMeta: {
    src: {
      label: "Imagem",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    alt: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "Conteúdo",
    },
    width: {
      label: "Largura",
      inputType: "text",
      group: "Dimensões",
    },
    height: {
      label: "Altura",
      inputType: "text",
      group: "Dimensões",
    },
    objectFit: {
      label: "Object Fit",
      inputType: "select",
      options: [
        { label: "Contain", value: "contain" },
        { label: "Cover", value: "cover" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
        { label: "Scale Down", value: "scale-down" },
      ],
      group: "Dimensões",
    },
  },
};

// Auto-registro
componentRegistry.register(imageBlock);
