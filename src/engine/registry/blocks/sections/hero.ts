import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";
import { heroVariations, heroVariationIds } from "../../../presets/heroVariations";

/**
 * Valores padrão do Hero - Use para garantir consistência em templates e factories
 */
export const HERO_DEFAULT_PROPS = {
  variant: "centered",
  title: "Bem-vindo ao Nosso Site",
  subtitle: "Subtítulo incrível aqui",
  description: "Uma descrição breve do seu produto ou serviço.",
  primaryButton: { text: "Começar Agora" },
  secondaryButton: { text: "Saber Mais" },
  align: "center",
  contentPosition: "center",
  minHeight: "80vh",
  // Layout
  contentMaxWidth: "800px",
  paddingY: "100px",
  // Image
  imageRadius: 16,
  imageShadow: "lg",
  imagePosition: "right",
  // Button defaults
  buttonSize: "md",
  primaryButtonVariant: "solid",
  primaryButtonRadius: 8,
  secondaryButtonVariant: "outline",
  secondaryButtonRadius: 8,
  // Button hover defaults
  buttonHoverEffect: "scale",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
} as const;

export const heroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero",
  description: "Seção hero completa com múltiplas variações",
  category: "sections",
  canHaveChildren: false,
  defaultProps: HERO_DEFAULT_PROPS,
  variations: heroVariationIds.reduce(
    (acc, id) => {
      const v = heroVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    // =========================================================================
    // GRUPO: Conteúdo
    // =========================================================================
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },

    // =========================================================================
    // GRUPO: Mídia
    // =========================================================================
    image: {
      label: "Imagem",
      inputType: "image-upload",
      group: "Mídia",
      description: "Imagem de fundo ou lateral",
    },
    imagePosition: {
      label: "Posição da Imagem",
      inputType: "select",
      options: [
        { label: "Direita", value: "right" },
        { label: "Esquerda", value: "left" },
      ],
      group: "Mídia",
    },
    imageRadius: {
      label: "Cantos da Imagem",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "Mídia",
    },
    imageShadow: {
      label: "Sombra da Imagem",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Pequena", value: "sm" },
        { label: "Média", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Mídia",
    },

    // =========================================================================
    // GRUPO: Grid de Imagens
    // =========================================================================
    imageGridEnabled: {
      label: "Usar Grid de Imagens",
      inputType: "checkbox",
      group: "Grid de Imagens",
      description: "Substituir imagem única por grid de até 4 imagens (split layout)",
    },
    imageGridConfig: {
      label: "Configuração da Grid",
      inputType: "image-grid",
      group: "Grid de Imagens",
      showWhen: { field: "imageGridEnabled", equals: true },
    },

    // =========================================================================
    // GRUPO: Layout
    // =========================================================================
    align: {
      label: "Alinhamento do Texto",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Layout",
      description: "Alinhamento do texto e elementos internos",
    },
    contentPosition: {
      label: "Posição do Conteúdo",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Layout",
      description: "Posição do bloco de conteúdo no layout",
    },
    minHeight: {
      label: "Altura Mínima",
      inputType: "select",
      options: [
        { label: "Pequena (50vh)", value: "50vh" },
        { label: "Média (70vh)", value: "70vh" },
        { label: "Grande (85vh)", value: "85vh" },
        { label: "Tela Cheia (100vh)", value: "100vh" },
        { label: "Auto", value: "auto" },
      ],
      group: "Layout",
    },
    contentMaxWidth: {
      label: "Largura do Conteúdo",
      inputType: "select",
      options: [
        { label: "Estreita (500px)", value: "500px" },
        { label: "Média (700px)", value: "700px" },
        { label: "Larga (900px)", value: "900px" },
        { label: "Total (1200px)", value: "1200px" },
      ],
      group: "Layout",
    },

    // =========================================================================
    // GRUPO: Aparência
    // =========================================================================
    background: {
      label: "Cor de Fundo",
      inputType: "color-advanced",
      group: "Aparência",
      description: "Cor ou gradiente de fundo",
    },
    overlay: {
      label: "Escurecer Imagem",
      inputType: "checkbox",
      group: "Aparência",
    },
    overlayColor: {
      label: "Cor do Overlay",
      inputType: "color-advanced",
      group: "Aparência",
      description: "Gradiente sobre a imagem",
    },
    showWave: {
      label: "Onda Decorativa",
      inputType: "checkbox",
      group: "Aparência",
    },
    waveColor: {
      label: "Cor da Onda",
      inputType: "color-advanced",
      group: "Aparência",
      showWhen: { field: "showWave", equals: true },
    },

    // =========================================================================
    // GRUPO: Tipografia
    // =========================================================================
    titleColor: {
      label: "Cor do Título",
      inputType: "color-advanced",
      group: "Tipografia",
    },
    subtitleColor: {
      label: "Cor do Subtítulo",
      inputType: "color-advanced",
      group: "Tipografia",
    },
    descriptionColor: {
      label: "Cor da Descrição",
      inputType: "color-advanced",
      group: "Tipografia",
    },

    // =========================================================================
    // GRUPO: Badge
    // =========================================================================
    badgeColor: {
      label: "Cor do Badge",
      inputType: "color-advanced",
      group: "Badge",
    },
    badgeTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Badge",
    },

    // =========================================================================
    // GRUPO: Botão Primário
    // =========================================================================
    primaryButtonVariant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Sólido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Botão Primário",
    },
    primaryButtonColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "Botão Primário",
    },
    primaryButtonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Botão Primário",
    },
    primaryButtonRadius: {
      label: "Cantos",
      inputType: "slider",
      min: 0,
      max: 50,
      step: 2,
      group: "Botão Primário",
    },

    // =========================================================================
    // GRUPO: Botão Secundário
    // =========================================================================
    secondaryButtonVariant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Sólido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Botão Secundário",
    },
    secondaryButtonColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "Botão Secundário",
    },
    secondaryButtonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Botão Secundário",
    },
    secondaryButtonRadius: {
      label: "Cantos",
      inputType: "slider",
      min: 0,
      max: 50,
      step: 2,
      group: "Botão Secundário",
    },

    // =========================================================================
    // GRUPO: Efeitos Hover (afeta ambos os botões)
    // =========================================================================
    buttonSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Efeitos Hover",
    },
    buttonHoverEffect: {
      label: "Efeito Hover",
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
      group: "Efeitos Hover",
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Efeitos Hover",
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
      group: "Efeitos Hover",
    },
    buttonHoverIconName: {
      label: "Ícone",
      inputType: "icon-grid",
      group: "Efeitos Hover",
      showWhen: { field: "buttonHoverOverlay", equals: "icon" },
    },
  },
};

// Auto-registro
componentRegistry.register(heroBlock);
