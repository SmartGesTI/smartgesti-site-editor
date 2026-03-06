import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const teamCardBlock: BlockDefinition = {
  type: "teamCard",
  name: "Membro da Equipe",
  description: "Card individual de membro",
  category: "sections",
  userCategory: "Equipe",
  isChildBlock: true,
  canHaveChildren: false,
  defaultProps: {
    name: "John Doe",
    role: "Creative Teacher",
  },
  inspectorMeta: {
    avatar: { label: "Foto", inputType: "image-upload", group: "Conteúdo" },
    name: { label: "Nome", inputType: "text", group: "Conteúdo" },
    role: { label: "Cargo", inputType: "text", group: "Conteúdo" },
  },
};

// Auto-registro
componentRegistry.register(teamCardBlock);
