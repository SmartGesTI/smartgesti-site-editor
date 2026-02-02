import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const courseCardGridBlock: BlockDefinition = {
  type: "courseCardGrid",
  name: "Course Card Grid",
  description: "Grid de cards de curso (thumbnail, preço, rating, View Course)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Popular Courses",
    subtitle: "Explore our courses",
    columns: 3,
    cards: [
      {
        title: "Course 1",
        price: "$29.00",
        rating: 5,
        meta: ["2h", "120 students"],
        buttonText: "View Course",
        buttonHref: "#",
      },
      {
        title: "Course 2",
        price: "$39.00",
        rating: 4,
        meta: ["3h", "85 students"],
        buttonText: "View Course",
        buttonHref: "#",
      },
      {
        title: "Course 3",
        price: "$49.00",
        rating: 5,
        meta: ["4h", "200 students"],
        buttonText: "View Course",
        buttonHref: "#",
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
componentRegistry.register(courseCardGridBlock);
