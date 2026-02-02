import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const testimonialBlock: BlockDefinition = {
  type: "testimonial",
  name: "Testimonial",
  description: "Card de depoimento individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    quote: "Produto incrível! Recomendo a todos.",
    authorName: "João Silva",
    authorRole: "CEO",
    authorCompany: "Empresa X",
    rating: 5,
  },
  inspectorMeta: {
    quote: {
      label: "Depoimento",
      inputType: "textarea",
      group: "Conteúdo",
    },
    authorName: {
      label: "Nome",
      inputType: "text",
      group: "Autor",
    },
    authorRole: {
      label: "Cargo",
      inputType: "text",
      group: "Autor",
    },
    authorCompany: {
      label: "Empresa",
      inputType: "text",
      group: "Autor",
    },
    authorAvatar: {
      label: "Avatar do Autor",
      inputType: "image-upload",
      group: "Autor",
    },
    rating: {
      label: "Estrelas",
      inputType: "number",
      min: 1,
      max: 5,
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(testimonialBlock);
