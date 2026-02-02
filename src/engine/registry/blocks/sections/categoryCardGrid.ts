import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const categoryCardGridBlock: BlockDefinition = {
  type: "categoryCardGrid",
  name: "Category Card Grid",
  description: "Grid de categorias (imagem de fundo + título overlay + link)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Top Categories",
    subtitle: "Browse by category",
    columns: 4,
    categories: [
      {
        image: "https://placehold.co/400x240/6366f1/fff?text=Art",
        title: "Art & Design",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/8b5cf6/fff?text=Business",
        title: "Business",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/a855f7/fff?text=Dev",
        title: "Development",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/d946ef/fff?text=Marketing",
        title: "Marketing",
        href: "#",
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
componentRegistry.register(categoryCardGridBlock);
