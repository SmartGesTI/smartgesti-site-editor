import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const textareaBlockDef: BlockDefinition = {
  type: "textarea",
  name: "Campo de Texto Longo",
  description: "Área de texto para mensagens",
  category: "forms",
  userCategory: "Formulários",
  canHaveChildren: false,
  defaultProps: {
    name: "mensagem",
    placeholder: "Digite sua mensagem...",
    rows: 4,
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
    rows: {
      label: "Linhas",
      inputType: "number",
      min: 2,
      max: 20,
      group: "Layout",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

// Auto-registro
componentRegistry.register(textareaBlockDef);
