import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const iconBlock: BlockDefinition = {
  type: "icon",
  name: "Icon",
  description: "Ícone SVG",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    name: "star",
    size: "md",
  },
  inspectorMeta: {
    name: {
      label: "Ícone",
      inputType: "select",
      options: [
        { label: "Estrela", value: "star" },
        { label: "Check", value: "check" },
        { label: "Seta Direita", value: "arrow-right" },
        { label: "Coração", value: "heart" },
        { label: "Usuário", value: "user" },
        { label: "Email", value: "mail" },
        { label: "Telefone", value: "phone" },
        { label: "Localização", value: "map-pin" },
        { label: "Configurações", value: "settings" },
        { label: "Pesquisar", value: "search" },
        { label: "Menu", value: "menu" },
        { label: "Fechar", value: "x" },
        { label: "Mais", value: "plus" },
        { label: "Menos", value: "minus" },
        { label: "Raio", value: "zap" },
        { label: "Escudo", value: "shield" },
        { label: "Foguete", value: "rocket" },
        { label: "Troféu", value: "trophy" },
        { label: "Gráfico", value: "bar-chart" },
        { label: "Globo", value: "globe" },
      ],
      group: "Conteúdo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Estilo",
    },
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

// Auto-registro
componentRegistry.register(iconBlock);
