import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

/**
 * Sample cards for editor preview.
 * In production, these are replaced by ContentProvider data.
 */
const sampleCards = [
  {
    title: "Bem-vindo ao nosso blog!",
    excerpt: "Estamos animados em lançar nosso blog oficial. Acompanhe novidades e dicas.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    category: "Novidades",
    date: "15 Jan 2025",
    linkHref: "/site/p/blog/bem-vindo",
    linkText: "Ler mais",
  },
  {
    title: "5 Dicas para Estudantes de Sucesso",
    excerpt: "Confira as melhores práticas para melhorar seus estudos e alcançar seus objetivos.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
    category: "Educação",
    date: "20 Jan 2025",
    linkHref: "/site/p/blog/dicas-estudantes",
    linkText: "Ler mais",
  },
  {
    title: "Novidades para o Próximo Semestre",
    excerpt: "Novos cursos, eventos e melhorias que estão chegando. Saiba tudo sobre o que vem por aí.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    category: "Institucional",
    date: "01 Fev 2025",
    linkHref: "/site/p/blog/novidades-semestre",
    linkText: "Ler mais",
  },
];

export const blogPostGridBlock: BlockDefinition<"blogPostGrid"> = {
  type: "blogPostGrid",
  name: "Blog Post Grid",
  description: "Grid de posts do blog com suporte a dados dinâmicos (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    title: "Blog",
    subtitle: "Últimas publicações",
    columns: 3,
    cards: sampleCards,
    variant: "default",
    showViewAll: false,
    viewAllText: "Ver todos",
    viewAllHref: "/site/p/blog",
    // Card styling (grupo único)
    cardBorderRadius: "0.75rem",
    cardShadow: "md",
    cardHoverEffect: "lift",
    cardBorder: true,
    cardBorderColor: "#e5e7eb",
    cardBorderWidth: 1,
    // Image effects
    imageHoverEffect: "zoom",
    imageBorderRadius: "0.75rem",
    // CTA "Ler mais" - padrão do sistema (Hero)
    ctaVariation: "link", // "link" | "button"
    // Link (quando ctaVariation === "link")
    linkColor: "#2563eb",
    linkHoverColor: "#1d4ed8",
    linkHoverEffect: "underline",
    linkHoverIntensity: 50,
    // Button (quando ctaVariation === "button")
    buttonVariant: "solid", // solid | outline | ghost
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    buttonRadius: 8,
    buttonSize: "md", // sm | md | lg
    buttonHoverEffect: "darken",
    buttonHoverIntensity: 20,
    buttonHoverOverlay: "none",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Cabeçalho" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Cabeçalho" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Magazine", value: "magazine" },
        { label: "Destaque", value: "featured" },
        { label: "Minimal", value: "minimal" },
      ],
      group: "Aparência",
    },
    showViewAll: { label: "Mostrar 'Ver Todos'", inputType: "checkbox", group: "Rodapé" },
    viewAllText: {
      label: "Texto do Link",
      inputType: "text",
      group: "Rodapé",
      showWhen: { field: "showViewAll", equals: true },
    },
    viewAllHref: {
      label: "URL do Link",
      inputType: "text",
      group: "Rodapé",
      showWhen: { field: "showViewAll", equals: true },
    },

    // =========================================================================
    // GRUPO: Cards (tudo em um grupo único, organizado com separadores visuais)
    // =========================================================================
    cardBorderRadius: {
      label: "Arredondamento",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "0" },
        { label: "Pequeno", value: "0.5rem" },
        { label: "Médio", value: "0.75rem" },
        { label: "Grande", value: "1rem" },
        { label: "Extra Grande", value: "1.5rem" },
      ],
      group: "Cards",
    },
    cardShadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Suave", value: "sm" },
        { label: "Média", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Cards",
    },
    cardHoverEffect: {
      label: "Efeito Hover do Card",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Elevar", value: "lift" },
        { label: "Escala", value: "scale" },
        { label: "Brilho", value: "glow" },
      ],
      group: "Cards",
    },
    cardBorder: {
      label: "Borda",
      inputType: "checkbox",
      group: "Cards",
    },
    cardBorderColor: {
      label: "Cor da Borda",
      inputType: "color-advanced",
      group: "Cards",
      showWhen: { field: "cardBorder", equals: true },
    },
    cardBorderWidth: {
      label: "Espessura da Borda",
      inputType: "slider",
      min: 1,
      max: 4,
      step: 1,
      group: "Cards",
      showWhen: { field: "cardBorder", equals: true },
    },

    // --- Imagem (dentro do grupo Cards) ---
    imageHoverEffect: {
      label: "Efeito Hover da Imagem",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Zoom", value: "zoom" },
        { label: "Brilho", value: "brightness" },
      ],
      group: "Cards",
    },
    imageBorderRadius: {
      label: "Arredondamento da Imagem",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "0" },
        { label: "Pequeno", value: "0.5rem" },
        { label: "Médio", value: "0.75rem" },
        { label: "Grande", value: "1rem" },
      ],
      group: "Cards",
    },

    // --- CTA "Ler mais" (dentro do grupo Cards) ---
    ctaVariation: {
      label: 'Variação "Ler mais"',
      inputType: "select",
      options: [
        { label: "Link", value: "link" },
        { label: "Botão", value: "button" },
      ],
      group: "Cards",
    },

    // Link (quando ctaVariation === "link")
    linkColor: {
      label: "Cor do Link",
      inputType: "color-advanced",
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "link" },
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "link" },
    },
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Sublinhado", value: "underline" },
        { label: "Sublinhado (Centro)", value: "underline-center" },
        { label: "Fundo Colorido", value: "background" },
        { label: "Fundo Deslizante", value: "slide-bg" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
        { label: "Nenhum", value: "none" },
      ],
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "link" },
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "link" },
    },

    // Button (quando ctaVariation === "button") - padrão do Hero
    buttonVariant: {
      label: "Estilo do Botão",
      inputType: "select",
      options: [
        { label: "Sólido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonColor: {
      label: "Cor do Botão",
      inputType: "color-advanced",
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonRadius: {
      label: "Cantos do Botão",
      inputType: "slider",
      min: 0,
      max: 50,
      step: 2,
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonSize: {
      label: "Tamanho do Botão",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonHoverEffect: {
      label: "Efeito Hover do Botão",
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
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
    buttonHoverOverlay: {
      label: "Efeito Extra",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "none" },
        { label: "Brilho", value: "shine" },
        { label: "Preenchimento", value: "fill" },
        { label: "Salto", value: "bounce" },
        { label: "Borda Glow", value: "border-glow" },
      ],
      group: "Cards",
      showWhen: { field: "ctaVariation", equals: "button" },
    },
  },
};

// Auto-registro
componentRegistry.register(blogPostGridBlock);
