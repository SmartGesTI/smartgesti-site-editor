import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const footerBlock: BlockDefinition = {
  type: "footer",
  name: "Footer",
  description: "Rodapé do site",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    logoText: "Logo",
    description: "Descrição do site",
    columns: [
      {
        title: "Links",
        links: [
          { text: "Home", href: "/" },
          { text: "Sobre", href: "/sobre" },
        ],
      },
    ],
    social: [],
    copyright: "© 2025. Todos os direitos reservados.",
    variant: "simple",
  },
  inspectorMeta: {
    logo: {
      label: "Logo (Imagem)",
      inputType: "image-upload",
      group: "Logo",
    },
    logoText: {
      label: "Logo (texto)",
      inputType: "text",
      group: "Logo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    copyright: {
      label: "Copyright",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Simples", value: "simple" },
        { label: "Multi-colunas", value: "multi-column" },
      ],
      group: "Layout",
    },
  },
};

// Auto-registro
componentRegistry.register(footerBlock);
