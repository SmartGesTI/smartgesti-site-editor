import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const gridBlock: BlockDefinition = {
  type: "grid",
  name: "Grid",
  description: "Layout em grid responsivo",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    cols: 3,
    gap: "1rem",
  },
  inspectorMeta: {
    cols: {
      label: "Colunas",
      description: "Número de colunas (ou objeto responsivo)",
      inputType: "number",
      min: 1,
      max: 12,
      group: "Layout",
    },
    colTemplate: {
      label: "Template de Colunas",
      description: "CSS grid-template-columns. Se definido, sobrescreve 'Colunas'.",
      inputType: "select",
      options: [
        { label: "Automático (usa Colunas)", value: "" },
        { label: "Conteúdo + Sidebar (1fr 320px)", value: "1fr 320px" },
        { label: "Sidebar + Conteúdo (320px 1fr)", value: "320px 1fr" },
        { label: "Conteúdo + Sidebar Larga (1fr 380px)", value: "1fr 380px" },
        { label: "Sidebar Larga + Conteúdo (380px 1fr)", value: "380px 1fr" },
        { label: "2/3 + 1/3", value: "2fr 1fr" },
        { label: "1/3 + 2/3", value: "1fr 2fr" },
        { label: "Metade + Metade", value: "1fr 1fr" },
      ],
      group: "Layout",
    },
    gap: {
      label: "Distância entre Colunas",
      inputType: "select",
      options: [
        { label: "Compacto", value: "1rem" },
        { label: "Padrão", value: "1.5rem" },
        { label: "Espaçoso", value: "2rem" },
        { label: "Largo", value: "2.5rem" },
        { label: "X. Largo", value: "3rem" },
      ],
      group: "Layout",
    },
    maxWidth: {
      label: "Largura Máxima",
      description: "Largura máxima do container. Centraliza automaticamente.",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "" },
        { label: "Compacta (960px)", value: "960px" },
        { label: "Padrão (1200px)", value: "1200px" },
        { label: "Larga (1400px)", value: "1400px" },
        { label: "Máxima (1600px)", value: "1600px" },
      ],
      group: "Espaçamento",
    },
    padding: {
      label: "Padding Lateral",
      description: "Espaçamento horizontal interno",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "" },
        { label: "Pequeno (1rem)", value: "1rem" },
        { label: "Padrão (2rem)", value: "2rem" },
        { label: "Grande (3rem)", value: "3rem" },
        { label: "Extra Grande (4rem)", value: "4rem" },
      ],
      group: "Espaçamento",
    },
    paddingTop: {
      label: "Espaço do Topo",
      description: "Margem superior (útil abaixo de navbars fixas)",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "" },
        { label: "Pequeno (2rem)", value: "2rem" },
        { label: "Navbar Padrão (5rem)", value: "5rem" },
        { label: "Navbar + Respiro (6rem)", value: "6rem" },
        { label: "Grande (8rem)", value: "8rem" },
      ],
      group: "Espaçamento",
    },
  },
};

// Auto-registro
componentRegistry.register(gridBlock);
