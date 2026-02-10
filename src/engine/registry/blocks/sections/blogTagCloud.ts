import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogTagCloudBlock: BlockDefinition = {
  type: "blogTagCloud",
  name: "Nuvem de Tags",
  description: "Widget com tags dos posts do blog",
  category: "sections",
  pluginId: "blog",
  defaultProps: {
    title: "Tags",
    tags: [],
    variant: "badges",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    variant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { value: "badges", label: "Badges" },
        { value: "list", label: "Lista" },
      ],
      group: "Exibição",
    },
    tags: { label: "Tags", inputType: "text", readOnly: true, group: "Dados" },
  },
};

// Auto-registro
componentRegistry.register(blogTagCloudBlock);
