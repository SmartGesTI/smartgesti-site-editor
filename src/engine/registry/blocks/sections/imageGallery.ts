import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";
import type { ImageGalleryBlock } from "../../../schema/siteDocument";

/**
 * Valores padrão do ImageGallery - Use para garantir consistência em templates e factories
 */
export const IMAGE_GALLERY_DEFAULT_PROPS: ImageGalleryBlock["props"] = {
  // Conteúdo
  title: "Nossa Galeria",
  subtitle: "Confira nossas imagens",
  images: [
    {
      id: "1",
      src: "https://placehold.co/800x600/3b82f6/ffffff?text=Image+1",
      alt: "Imagem de demonstração 1",
      title: "Projeto 1",
      description: "Descrição da primeira imagem",
    },
    {
      id: "2",
      src: "https://placehold.co/800x600/8b5cf6/ffffff?text=Image+2",
      alt: "Imagem de demonstração 2",
      title: "Projeto 2",
      description: "Descrição da segunda imagem",
    },
    {
      id: "3",
      src: "https://placehold.co/800x600/ec4899/ffffff?text=Image+3",
      alt: "Imagem de demonstração 3",
      title: "Projeto 3",
      description: "Descrição da terceira imagem",
    },
    {
      id: "4",
      src: "https://placehold.co/800x600/10b981/ffffff?text=Image+4",
      alt: "Imagem de demonstração 4",
      title: "Projeto 4",
      description: "Descrição da quarta imagem",
    },
  ],

  // Layout
  variation: "gallery-grid",
  columns: 4,
  gap: 1,
  aspectRatio: "auto",

  // Aparência
  imageBorderRadius: 8,
  imageShadow: "md",

  // Animações
  enterAnimation: "fade-scale",
  hoverEffect: "zoom-overlay",
  hoverIntensity: 50,

  // Lightbox
  lightbox: {
    mode: "adaptive",
    showArrows: true,
    showThumbnails: true,
    showCounter: true,
    showCaption: true,
    enableZoom: true,
    enableDownload: false,
    enableAutoplay: false,
    autoplayInterval: 5,
    closeOnBackdropClick: true,
    closeOnEsc: true,
    enableKeyboard: true,
    enableTouchGestures: true,
    transitionDuration: 300,
  },

  // Performance
  lazyLoad: true,
  showWarningAt: 50,
};

export const imageGalleryBlock: BlockDefinition<"imageGallery"> = {
  type: "imageGallery",
  name: "Galeria de Imagens",
  description: "Galeria de imagens com lightbox profissional e zoom",
  category: "sections",
  canHaveChildren: false,
  defaultProps: IMAGE_GALLERY_DEFAULT_PROPS,

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
    images: {
      label: "Imagens",
      inputType: "gallery-images",
      group: "Conteúdo",
      description: "Gerencie as imagens da galeria",
    },

    // =========================================================================
    // GRUPO: Layout
    // =========================================================================
    variation: {
      label: "Layout",
      inputType: "select",
      options: [
        { value: "gallery-grid", label: "Grid Clássico" },
        { value: "gallery-masonry", label: "Masonry (v1.1)" },
        { value: "gallery-featured", label: "Destaque (v1.2)" },
        { value: "gallery-carousel", label: "Carrossel (v1.3)" },
        { value: "gallery-alternating", label: "Alternado (v1.4)" },
      ],
      group: "Layout",
    },
    columns: {
      label: "Colunas",
      inputType: "number",
      min: 2,
      max: 4,
      group: "Layout",
      description: "Número de colunas no desktop",
    },
    gap: {
      label: "Espaçamento",
      inputType: "number",
      min: 0,
      max: 3,
      step: 0.5,
      group: "Layout",
      description: "Espaçamento entre imagens (rem)",
    },
    aspectRatio: {
      label: "Proporção",
      inputType: "select",
      options: [
        { value: "auto", label: "Original" },
        { value: "1/1", label: "Quadrado (1:1)" },
        { value: "4/3", label: "Paisagem (4:3)" },
        { value: "16/9", label: "Widescreen (16:9)" },
        { value: "3/2", label: "Clássico (3:2)" },
      ],
      group: "Layout",
    },

    // =========================================================================
    // GRUPO: Aparência
    // =========================================================================
    bg: {
      label: "Cor de Fundo",
      inputType: "color",
      group: "Aparência",
    },
    imageBorderRadius: {
      label: "Borda Arredondada",
      inputType: "number",
      min: 0,
      max: 32,
      group: "Aparência",
      description: "Arredondamento das imagens (px)",
    },
    imageShadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { value: "none", label: "Sem sombra" },
        { value: "sm", label: "Pequena" },
        { value: "md", label: "Média" },
        { value: "lg", label: "Grande" },
        { value: "xl", label: "Extra grande" },
      ],
      group: "Aparência",
    },

    // =========================================================================
    // GRUPO: Animações
    // =========================================================================
    enterAnimation: {
      label: "Animação de Entrada",
      inputType: "select",
      options: [
        { value: "fade-scale", label: "Fade + Zoom" },
        { value: "stagger", label: "Cascata" },
        { value: "slide-up", label: "Desliza de Baixo" },
        { value: "none", label: "Sem animação" },
      ],
      group: "Animações",
    },
    hoverEffect: {
      label: "Efeito de Hover",
      inputType: "select",
      options: [
        { value: "zoom-overlay", label: "Zoom + Overlay" },
        { value: "glow", label: "Brilho" },
        { value: "scale", label: "Aumentar" },
        { value: "caption-reveal", label: "Revelar Legenda" },
        { value: "none", label: "Sem efeito" },
      ],
      group: "Animações",
    },
    hoverIntensity: {
      label: "Intensidade do Hover",
      inputType: "number",
      min: 0,
      max: 100,
      group: "Animações",
      description: "Intensidade do efeito (0-100%)",
    },

    // =========================================================================
    // GRUPO: Lightbox - Tema
    // =========================================================================
    "lightbox.mode": {
      label: "Tema do Lightbox",
      inputType: "select",
      options: [
        { value: "adaptive", label: "Adaptável (Auto)" },
        { value: "dark", label: "Escuro" },
        { value: "light", label: "Claro" },
        { value: "theme", label: "Seguir Tema do Site" },
      ],
      group: "Lightbox - Tema",
    },

    // =========================================================================
    // GRUPO: Lightbox - Navegação
    // =========================================================================
    "lightbox.showArrows": {
      label: "Mostrar Setas",
      inputType: "checkbox",
      group: "Lightbox - Navegação",
    },
    "lightbox.showThumbnails": {
      label: "Mostrar Miniaturas",
      inputType: "checkbox",
      group: "Lightbox - Navegação",
    },
    "lightbox.showCounter": {
      label: "Mostrar Contador",
      inputType: "checkbox",
      group: "Lightbox - Navegação",
      description: 'Exibe "3 de 12"',
    },
    "lightbox.showCaption": {
      label: "Mostrar Legenda",
      inputType: "checkbox",
      group: "Lightbox - Navegação",
    },

    // =========================================================================
    // GRUPO: Lightbox - Funcionalidades
    // =========================================================================
    "lightbox.enableZoom": {
      label: "Ativar Zoom",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
    },
    "lightbox.enableDownload": {
      label: "Ativar Download",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
      description: "Permitir download de imagens (v1.1)",
    },
    "lightbox.enableAutoplay": {
      label: "Ativar Autoplay",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
      description: "Reprodução automática (v1.3)",
    },
    "lightbox.autoplayInterval": {
      label: "Intervalo do Autoplay",
      inputType: "number",
      min: 2,
      max: 10,
      group: "Lightbox - Funcionalidades",
      description: "Intervalo em segundos",
    },
    "lightbox.closeOnBackdropClick": {
      label: "Fechar ao Clicar Fora",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
    },
    "lightbox.closeOnEsc": {
      label: "Fechar com ESC",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
    },
    "lightbox.enableKeyboard": {
      label: "Navegação por Teclado",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
      description: "Arrows, +, -, 0",
    },
    "lightbox.enableTouchGestures": {
      label: "Gestos Touch",
      inputType: "checkbox",
      group: "Lightbox - Funcionalidades",
      description: "Swipe, pinch, double-tap",
    },
    "lightbox.transitionDuration": {
      label: "Duração da Transição",
      inputType: "number",
      min: 100,
      max: 1000,
      step: 50,
      group: "Lightbox - Funcionalidades",
      description: "Velocidade da animação (ms)",
    },

    // =========================================================================
    // GRUPO: Performance
    // =========================================================================
    lazyLoad: {
      label: "Lazy Loading",
      inputType: "checkbox",
      group: "Performance",
      description: "Carregar imagens sob demanda",
    },
    showWarningAt: {
      label: "Aviso de Performance",
      inputType: "number",
      min: 20,
      max: 100,
      group: "Performance",
      description: "Mostrar alerta após N imagens",
    },
  },
};

// Register the block
componentRegistry.register(imageGalleryBlock);

export default imageGalleryBlock;
