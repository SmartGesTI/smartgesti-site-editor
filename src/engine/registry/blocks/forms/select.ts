import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const formSelectBlock: BlockDefinition = {
  type: "formSelect",
  name: "Select",
  description: "Dropdown de formulário",
  category: "forms",
  canHaveChildren: false,
  defaultProps: {
    name: "opcao",
    placeholder: "Selecione...",
    options: [
      { value: "opt1", label: "Opção 1" },
      { value: "opt2", label: "Opção 2" },
      { value: "opt3", label: "Opção 3" },
    ],
  },
  inspectorMeta: {
    name: {
      label: "Nome",
      inputType: "text",
      group: "Config",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    placeholder: {
      label: "Placeholder",
      inputType: "text",
      group: "Conteúdo",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

// Auto-registro
componentRegistry.register(formSelectBlock);
