import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const carouselBlock: BlockDefinition = {
  type: "carousel",
  name: "Carrossel de Slides",
  description: "Slider com slides de conteúdo",
  category: "sections",
  userCategory: "Galeria e Mídia",
  canHaveChildren: false,
  defaultProps: {
    slides: [
      {
        image: "https://placehold.co/600x400/1e40af/fff?text=Program",
        title: "Natural Programs for Children",
        description: "Programas que desenvolvem habilidades naturais.",
        primaryButton: { text: "Explore More", href: "#" },
        secondaryButton: { text: "View Courses", href: "#" },
      },
    ],
    showArrows: true,
    showDots: false,
  },
  inspectorMeta: {
    showArrows: { label: "Setas", inputType: "checkbox", group: "Layout" },
    showDots: { label: "Dots", inputType: "checkbox", group: "Layout" },
    autoplay: { label: "Autoplay", inputType: "checkbox", group: "Layout" },
  },
};

// Auto-registro
componentRegistry.register(carouselBlock);
