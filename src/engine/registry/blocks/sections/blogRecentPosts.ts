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
    linkColor: "#374151",
    linkHoverColor: "#2563eb",
    linkHoverEffect: "background",
    linkHoverIntensity: 50,
    borderRadius: "0.75rem",
    shadow: "none",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    count: {
      label: "Quantidade",
      inputType: "select",
      options: [
        { label: "5 posts", value: 5 },
        { label: "10 posts", value: 10 },
        { label: "15 posts", value: 15 },
        { label: "20 posts", value: 20 },
      ],
      group: "Conteúdo",
    },
    showThumbnail: { label: "Mostrar Miniatura", inputType: "checkbox", group: "Exibição" },
    showDate: { label: "Mostrar Data", inputType: "checkbox", group: "Exibição" },
    showCategory: { label: "Mostrar Categoria", inputType: "checkbox", group: "Exibição" },
    linkColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Links",
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "Links",
    },
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Fundo", value: "background" },
        { label: "Sublinhado", value: "underline" },
        { label: "Sublinhado Centro", value: "underline-center" },
        { label: "Fundo Subindo", value: "slide-bg" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "Links",
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Links",
    },
    borderRadius: {
      label: "Arredondamento",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "0" },
        { label: "Padrão", value: "0.75rem" },
        { label: "Grande", value: "1.25rem" },
      ],
      group: "Aparência",
    },
    shadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Suave", value: "sm" },
        { label: "Média", value: "md" },
      ],
      group: "Aparência",
    },
  },
};

// Auto-registro
componentRegistry.register(blogRecentPostsBlock);
