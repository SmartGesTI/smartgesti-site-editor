import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const formBlock: BlockDefinition = {
  type: "form",
  name: "Formulário",
  description: "Container de formulário com envio",
  category: "forms",
  userCategory: "Formulários",
  canHaveChildren: true,
  defaultProps: {
    submitText: "Enviar",
  },
  inspectorMeta: {
    action: {
      label: "Action URL",
      inputType: "text",
      group: "Config",
    },
    method: {
      label: "Método",
      inputType: "select",
      options: [
        { label: "POST", value: "post" },
        { label: "GET", value: "get" },
      ],
      group: "Config",
    },
    submitText: {
      label: "Texto do Botão",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

// Auto-registro
componentRegistry.register(formBlock);
