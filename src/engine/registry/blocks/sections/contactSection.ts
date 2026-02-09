import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const contactSectionBlock: BlockDefinition = {
  type: "contactSection",
  name: "Contact Section",
  description: "Seção de contato com informações e formulário",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Entre em Contato",
    subtitle: "Contato",
    description: "Estamos prontos para ajudar. Entre em contato conosco.",
    variant: "split",
    contactInfo: [
      { icon: "mail", label: "Email", value: "contato@empresa.com" },
      { icon: "phone", label: "Telefone", value: "(11) 99999-9999" },
      { icon: "map-pin", label: "Endereço", value: "Rua Example, 123 - São Paulo, SP" },
    ],
    formTitle: "Envie sua mensagem",
    formFields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Seu nome", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "seu@email.com", required: true },
      { name: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" },
      { name: "message", label: "Mensagem", type: "textarea", placeholder: "Como podemos ajudar?", required: true },
    ],
    submitText: "Enviar Mensagem",
    buttonHoverEffect: "none",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    formTitle: {
      label: "Título do Formulário",
      inputType: "text",
      group: "Formulário",
    },
    submitText: {
      label: "Texto do Botão",
      inputType: "text",
      group: "Formulário",
    },
    variant: {
      label: "Layout",
      inputType: "select",
      options: [
        { label: "Dividido", value: "split" },
        { label: "Empilhado", value: "stacked" },
        { label: "Só Formulário", value: "form-only" },
      ],
      group: "Layout",
    },
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Estilo",
    },
    buttonHoverEffect: {
      label: "Efeito do Botão",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Escurecer", value: "darken" },
        { label: "Clarear", value: "lighten" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
        { label: "Sombra", value: "shadow" },
        { label: "Pulso", value: "pulse" },
      ],
      group: "Hover",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Hover",
    },
    buttonHoverOverlay: {
      label: "Efeito Extra",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Brilho", value: "shine" },
        { label: "Preenchimento", value: "fill" },
        { label: "Salto", value: "bounce" },
        { label: "Ícone", value: "icon" },
        { label: "Borda Glow", value: "border-glow" },
      ],
      group: "Hover",
    },
    buttonHoverIconName: {
      label: "Ícone",
      inputType: "icon-grid",
      group: "Hover",
      showWhen: { field: "buttonHoverOverlay", equals: "icon" },
    },
  },
};

// Auto-registro
componentRegistry.register(contactSectionBlock);
