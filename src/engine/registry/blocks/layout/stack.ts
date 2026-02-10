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
      label: "Distância entre Itens",
      inputType: "select",
      options: [
        { label: "Compacto", value: "0.5rem" },
        { label: "Pequeno", value: "1rem" },
        { label: "Padrão", value: "1.5rem" },
        { label: "Espaçoso", value: "2rem" },
        { label: "Largo", value: "3rem" },
      ],
      group: "Layout",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Fim", value: "end" },
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
        { label: "Fim", value: "end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
      ],
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
        { label: "Rente ao Topo", value: "0px" },
        { label: "Pequeno (1rem)", value: "1rem" },
        { label: "Navbar Padrão (80px)", value: "80px" },
        { label: "Navbar + Respiro (100px)", value: "100px" },
        { label: "Grande (120px)", value: "120px" },
      ],
      showWhen: { field: "sticky", equals: true },
      group: "Comportamento",
    },
  },
};

// Auto-registro
componentRegistry.register(stackBlock);
