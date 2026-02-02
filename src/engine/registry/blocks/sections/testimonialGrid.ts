import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const testimonialGridBlock: BlockDefinition = {
  type: "testimonialGrid",
  name: "Testimonial Grid",
  description: "Grid de depoimentos",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "O Que Nossos Clientes Dizem",
    columns: 3,
    testimonials: [
      {
        quote: "Excelente produto!",
        authorName: "Maria",
        authorRole: "Gerente",
        rating: 5,
      },
      {
        quote: "Recomendo muito!",
        authorName: "Pedro",
        authorRole: "Diretor",
        rating: 5,
      },
      {
        quote: "Transformou nosso negócio.",
        authorName: "Ana",
        authorRole: "CEO",
        rating: 5,
      },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2 Colunas", value: 2 },
        { label: "3 Colunas", value: 3 },
        { label: "4 Colunas", value: 4 },
      ],
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(testimonialGridBlock);
