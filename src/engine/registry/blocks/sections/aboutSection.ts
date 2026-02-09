import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const aboutSectionBlock: BlockDefinition = {
  type: "aboutSection",
  name: "About Section",
  description: "Seção sobre com imagem, texto e conquistas",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Sobre Nós",
    subtitle: "Quem Somos",
    description: "Somos uma empresa dedicada a oferecer as melhores soluções para nossos clientes, com anos de experiência no mercado.",
    secondaryDescription: "Nossa missão é transformar a forma como as pessoas interagem com tecnologia.",
    variant: "image-left",
    achievements: [
      { text: "Mais de 10 anos de experiência" },
      { text: "Equipe qualificada e dedicada" },
      { text: "Milhares de clientes satisfeitos" },
      { text: "Suporte 24/7" },
    ],
    primaryButton: { text: "Saiba Mais" },
    buttonHoverEffect: "none",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",
    stats: [
      { value: "500+", label: "Clientes" },
      { value: "10+", label: "Anos" },
    ],
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
    secondaryDescription: {
      label: "Descrição Secundária",
      inputType: "textarea",
      group: "Conteúdo",
    },
    image: {
      label: "Imagem",
      inputType: "image-upload",
      group: "Mídia",
    },
    variant: {
      label: "Layout",
      inputType: "select",
      options: [
        { label: "Imagem à Esquerda", value: "image-left" },
        { label: "Imagem à Direita", value: "image-right" },
        { label: "Centralizado", value: "centered" },
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
componentRegistry.register(aboutSectionBlock);
