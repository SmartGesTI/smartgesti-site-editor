import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogPostDetailBlock: BlockDefinition<"blogPostDetail"> = {
  type: "blogPostDetail",
  name: "Blog Post Detail",
  description: "Conteúdo completo de um post do blog (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    title: "Título do Post",
    content: "<p>Conteúdo do post...</p>",
    showFeaturedImage: true,
    showAuthor: true,
    authorVariant: "inline",
    showDate: true,
    showTags: true,
    showReadingTime: true,
    contentMaxWidth: "720px",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    content: { label: "Conteúdo", inputType: "textarea", group: "Conteúdo" },
    featuredImage: { label: "Imagem Destacada", inputType: "image-upload", group: "Mídia" },
    date: { label: "Data", inputType: "text", group: "Metadata" },
    category: { label: "Categoria", inputType: "text", group: "Metadata" },
    readingTime: { label: "Tempo de Leitura", inputType: "text", group: "Metadata" },
    showFeaturedImage: { label: "Mostrar Imagem Destacada", inputType: "checkbox", group: "Visibilidade" },
    showAuthor: { label: "Mostrar Autor", inputType: "checkbox", group: "Autor" },
    authorVariant: {
      label: "Variante do Autor",
      inputType: "select",
      group: "Autor",
      options: [
        { value: "inline", label: "Inline — Avatar + nome" },
        { value: "card", label: "Card — Avatar, nome e bio" },
        { value: "minimal", label: "Minimal — Apenas nome" },
      ],
    },
    showDate: { label: "Mostrar Data", inputType: "checkbox", group: "Visibilidade" },
    showTags: { label: "Mostrar Tags", inputType: "checkbox", group: "Visibilidade" },
    showReadingTime: { label: "Mostrar Tempo de Leitura", inputType: "checkbox", group: "Visibilidade" },
    contentMaxWidth: { label: "Largura Máxima do Conteúdo", inputType: "text", group: "Layout" },
  },
};

// Auto-registro
componentRegistry.register(blogPostDetailBlock);
