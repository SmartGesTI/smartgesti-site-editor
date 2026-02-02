import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const inputBlock: BlockDefinition = {
  type: "input",
  name: "Input",
  description: "Campo de entrada",
  category: "forms",
  canHaveChildren: false,
  defaultProps: {
    name: "campo",
    type: "text",
    placeholder: "Digite aqui...",
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
    type: {
      label: "Tipo",
      inputType: "select",
      options: [
        { label: "Texto", value: "text" },
        { label: "Email", value: "email" },
        { label: "Senha", value: "password" },
        { label: "Telefone", value: "tel" },
        { label: "URL", value: "url" },
        { label: "Número", value: "number" },
      ],
      group: "Config",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

// Auto-registro
componentRegistry.register(inputBlock);
