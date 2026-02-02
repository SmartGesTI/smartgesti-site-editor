import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const videoBlock: BlockDefinition = {
  type: "video",
  name: "Video",
  description: "Embed de vídeo",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    src: "",
    controls: true,
    aspectRatio: "16:9",
  },
  inspectorMeta: {
    src: {
      label: "URL do Vídeo",
      inputType: "text",
      group: "Conteúdo",
    },
    poster: {
      label: "Thumbnail (Imagem de Capa)",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    aspectRatio: {
      label: "Proporção",
      inputType: "select",
      options: [
        { label: "16:9", value: "16:9" },
        { label: "4:3", value: "4:3" },
        { label: "1:1", value: "1:1" },
        { label: "9:16", value: "9:16" },
      ],
      group: "Layout",
    },
    autoplay: {
      label: "Autoplay",
      inputType: "checkbox",
      group: "Opções",
    },
    controls: {
      label: "Controles",
      inputType: "checkbox",
      group: "Opções",
    },
  },
};

// Auto-registro
componentRegistry.register(videoBlock);
