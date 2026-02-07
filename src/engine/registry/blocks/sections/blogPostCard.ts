import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogPostCardBlock: BlockDefinition<"blogPostCard"> = {
  type: "blogPostCard",
  name: "Blog Post Card",
  description: "Card de post do blog (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    title: "Título do Post",
    excerpt: "Uma breve descrição do conteúdo do post...",
    linkText: "Ler mais",
    linkHref: "#",
    variant: "default",
    showImage: true,
    showCategory: true,
    showDate: true,
    showAuthor: false,
    showReadingTime: false,
  },
  inspectorMeta: {
    image: { label: "Imagem", inputType: "image-upload", group: "Conteúdo" },
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    excerpt: { label: "Resumo", inputType: "textarea", group: "Conteúdo" },
    date: { label: "Data", inputType: "text", group: "Conteúdo" },
    category: { label: "Categoria", inputType: "text", group: "Conteúdo" },
    authorName: { label: "Autor", inputType: "text", group: "Conteúdo" },
    authorAvatar: { label: "Avatar do Autor", inputType: "image-upload", group: "Conteúdo" },
    readingTime: { label: "Tempo de Leitura", inputType: "text", group: "Conteúdo" },
    linkText: { label: "Texto do Link", inputType: "text", group: "Link" },
    linkHref: { label: "URL do Link", inputType: "text", group: "Link" },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Horizontal", value: "horizontal" },
        { label: "Minimal", value: "minimal" },
      ],
      group: "Aparência",
    },
    showImage: { label: "Mostrar Imagem", inputType: "checkbox", group: "Visibilidade" },
    showCategory: { label: "Mostrar Categoria", inputType: "checkbox", group: "Visibilidade" },
    showDate: { label: "Mostrar Data", inputType: "checkbox", group: "Visibilidade" },
    showAuthor: { label: "Mostrar Autor", inputType: "checkbox", group: "Visibilidade" },
    showReadingTime: { label: "Mostrar Tempo de Leitura", inputType: "checkbox", group: "Visibilidade" },
  },
};

// Auto-registro
componentRegistry.register(blogPostCardBlock);
