import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogCardBlock: BlockDefinition = {
  type: "blogCard",
  name: "Blog Card",
  description: "Card de post/notícia individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Post Title",
    excerpt: "Excerpt text here.",
    linkText: "Read More",
    linkHref: "#",
  },
  inspectorMeta: {
    image: { label: "Imagem", inputType: "image-upload", group: "Conteúdo" },
    date: { label: "Data", inputType: "text", group: "Conteúdo" },
    category: { label: "Categoria", inputType: "text", group: "Conteúdo" },
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    excerpt: { label: "Resumo", inputType: "textarea", group: "Conteúdo" },
    linkText: { label: "Texto do link", inputType: "text", group: "Conteúdo" },
    linkHref: { label: "URL do link", inputType: "text", group: "Conteúdo" },
  },
};

// Auto-registro
componentRegistry.register(blogCardBlock);
