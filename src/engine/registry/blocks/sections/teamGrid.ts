import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const teamGridBlock: BlockDefinition = {
  type: "teamGrid",
  name: "Team Grid",
  description: "Grid de membros da equipe/professores",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Meet Our Teachers",
    subtitle: "Our dedicated team",
    columns: 4,
    members: [
      { name: "Teacher 1", role: "Creative Teacher" },
      { name: "Teacher 2", role: "Math Teacher" },
      { name: "Teacher 3", role: "Science Teacher" },
      { name: "Teacher 4", role: "Art Teacher" },
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
componentRegistry.register(teamGridBlock);
