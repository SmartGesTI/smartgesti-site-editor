import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const gridBlock: BlockDefinition = {
  type: "grid",
  name: "Grid",
  description: "Layout em grid responsivo",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    cols: 2,
    colTemplate: "",
    gap: "2.5rem",
  },
  inspectorMeta: {
    colTemplate: {
      label: "Layout",
      description: "Distribuição das colunas",
      inputType: "select",
      options: [
        { label: "Iguais", value: "" },
        { label: "Conteúdo + Lateral", value: "1fr 320px" },
        { label: "Lateral + Conteúdo", value: "320px 1fr" },
      ],
      group: "Layout",
    },
    cols: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2 Colunas", value: 2 },
        { label: "3 Colunas", value: 3 },
        { label: "4 Colunas", value: 4 },
      ],
      showWhen: { field: "colTemplate", truthy: false },
      group: "Layout",
    },
    gap: {
      label: "Espaçamento",
      description: "Distância entre colunas",
      inputType: "select",
      options: [
        { label: "Compacto", value: "1.5rem" },
        { label: "Padrão", value: "2.5rem" },
        { label: "Espaçoso", value: "4rem" },
      ],
      group: "Layout",
    },
    maxWidth: {
      label: "Largura",
      description: "Largura máxima do container",
      inputType: "select",
      options: [
        { label: "Padrão", value: "1200px" },
        { label: "Largo", value: "1400px" },
        { label: "Tela Cheia", value: "" },
      ],
      group: "Espaçamento",
    },
    padding: {
      label: "Padding Lateral",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "" },
        { label: "Padrão", value: "2rem" },
        { label: "Grande", value: "4rem" },
      ],
      group: "Espaçamento",
    },
    paddingTop: {
      label: "Espaço do Topo",
      description: "Compensação para navbar fixa",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "" },
        { label: "Navbar", value: "5rem" },
        { label: "Grande", value: "8rem" },
      ],
      group: "Espaçamento",
    },
  },
};

// Auto-registro
componentRegistry.register(gridBlock);
