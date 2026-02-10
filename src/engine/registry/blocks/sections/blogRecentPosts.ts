import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogRecentPostsBlock: BlockDefinition = {
  type: "blogRecentPosts",
  name: "Posts Recentes",
  description: "Widget com os posts mais recentes do blog",
  category: "sections",
  pluginId: "blog",
  defaultProps: {
    title: "Posts Recentes",
    count: 5,
    showThumbnail: true,
    showDate: true,
    showCategory: false,
    posts: [],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    count: { label: "Quantidade", inputType: "number", min: 1, max: 10, group: "Conteúdo" },
    showThumbnail: { label: "Mostrar Miniatura", inputType: "checkbox", group: "Exibição" },
    showDate: { label: "Mostrar Data", inputType: "checkbox", group: "Exibição" },
    showCategory: { label: "Mostrar Categoria", inputType: "checkbox", group: "Exibição" },
    posts: { label: "Posts", inputType: "text", readOnly: true, group: "Dados" },
  },
};

// Auto-registro
componentRegistry.register(blogRecentPostsBlock);
