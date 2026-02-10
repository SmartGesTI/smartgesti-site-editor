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
        { label: "Pequeno", value: "1200px" },
        { label: "Padrão", value: "1400px" },
        { label: "Grande", value: "1600px" },
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
    paddingBottom: {
      label: "Espaço Inferior",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "" },
        { label: "Padrão", value: "3rem" },
        { label: "Grande", value: "6rem" },
      ],
      group: "Espaçamento",
    },
    contentPosition: {
      label: "Posição",
      description: "Posição do container quando menor que a tela",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      showWhen: { field: "maxWidth", truthy: true },
      group: "Espaçamento",
    },
    bg: {
      label: "Cor de Fundo",
      description: "Cor de fundo do layout (preenche toda a largura)",
      inputType: "color",
      group: "Fundo",
    },
    bgImage: {
      label: "Imagem de Fundo",
      inputType: "image-upload",
      group: "Fundo",
    },
    bgOverlay: {
      label: "Overlay Escuro",
      inputType: "checkbox",
      showWhen: { field: "bgImage", truthy: true },
      group: "Fundo",
    },
    bgOverlayColor: {
      label: "Cor do Overlay",
      inputType: "color",
      showWhen: { field: "bgOverlay", equals: true },
      group: "Fundo",
    },
    bgGradient: {
      label: "Gradiente",
      description: "Ex: linear-gradient(135deg, #667eea, #764ba2)",
      inputType: "text",
      group: "Fundo",
    },
  },
};

// Auto-registro
componentRegistry.register(gridBlock);
