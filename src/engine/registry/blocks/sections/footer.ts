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
    // Hover effects defaults
    linkHoverEffect: "underline",
    linkHoverIntensity: 50,
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
    // Hover effects
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Fundo", value: "background" },
        { label: "Sublinhado →", value: "underline" },
        { label: "Sublinhado ←→", value: "underline-center" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "🔗 Links",
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "🔗 Links",
    },
    linkHoverColor: {
      label: "Cor no Hover",
      inputType: "color-advanced",
      group: "🔗 Links",
    },
  },
};

// Auto-registro
componentRegistry.register(footerBlock);
