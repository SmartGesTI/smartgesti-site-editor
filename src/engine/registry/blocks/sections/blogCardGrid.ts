import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogCardGridBlock: BlockDefinition = {
  type: "blogCardGrid",
  name: "Blog Card Grid",
  description: "Grid de cards de blog/notícias",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Recently News & Blogs",
    subtitle: "Latest updates and articles",
    columns: 3,
    cards: [
      {
        title: "Post 1",
        excerpt: "Excerpt 1",
        linkText: "Read More",
        linkHref: "#",
      },
      {
        title: "Post 2",
        excerpt: "Excerpt 2",
        linkText: "Read More",
        linkHref: "#",
      },
      {
        title: "Post 3",
        excerpt: "Excerpt 3",
        linkText: "Read More",
        linkHref: "#",
      },
    ],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Conteúdo" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(blogCardGridBlock);
