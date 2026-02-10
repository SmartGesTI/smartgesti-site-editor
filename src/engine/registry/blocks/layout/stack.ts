import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const stackBlock: BlockDefinition = {
  type: "stack",
  name: "Stack",
  description: "Layout flex (linha ou coluna)",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    direction: "col",
    gap: "1rem",
    align: "stretch",
    justify: "start",
    wrap: false,
    sticky: false,
    stickyOffset: "80px",
  },
  inspectorMeta: {
    direction: {
      label: "Direção",
      inputType: "select",
      options: [
        { label: "Coluna", value: "col" },
        { label: "Linha", value: "row" },
      ],
      group: "Layout",
    },
    gap: {
      label: "Espaçamento",
      inputType: "select",
      options: [
        { label: "Compacto", value: "0.5rem" },
        { label: "Padrão", value: "1.5rem" },
        { label: "Espaçoso", value: "3rem" },
      ],
      group: "Layout",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Esticar", value: "stretch" },
      ],
      group: "Layout",
    },
    justify: {
      label: "Justificar",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Espaçar", value: "space-between" },
      ],
      group: "Layout",
    },
    wrap: {
      label: "Quebrar Linha",
      description: "Permite que itens quebrem para próxima linha",
      inputType: "checkbox",
      showWhen: { field: "direction", equals: "row" },
      group: "Layout",
    },
    sticky: {
      label: "Fixo ao Rolar",
      description: "Mantém o bloco visível enquanto rola (desativado em mobile)",
      inputType: "checkbox",
      group: "Comportamento",
    },
    stickyOffset: {
      label: "Distância do Topo",
      description: "Espaço do topo quando fixo",
      inputType: "select",
      options: [
        { label: "Rente", value: "0px" },
        { label: "Navbar", value: "80px" },
        { label: "Navbar + Espaço", value: "100px" },
        { label: "Grande", value: "140px" },
      ],
      showWhen: { field: "sticky", equals: true },
      group: "Comportamento",
    },
  },
};

// Auto-registro
componentRegistry.register(stackBlock);
