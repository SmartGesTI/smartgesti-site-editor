import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const linkBlock: BlockDefinition = {
  type: "link",
  name: "Link",
  description: "Link",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Link",
    href: "#",
    target: "_self",
  },
  constraints: {
    required: ["text", "href"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    href: {
      label: "URL",
      inputType: "text",
      group: "Conteúdo",
    },
    target: {
      label: "Onde Abrir o Link",
      inputType: "select",
      options: [
        { label: "Mesma Janela", value: "_self" },
        { label: "Nova Janela", value: "_blank" },
      ],
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(linkBlock);
