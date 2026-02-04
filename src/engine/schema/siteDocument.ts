/**
 * Site Document V2 Schema
 * Documento componível baseado em blocos (Lovable-like)
 */

import { ThemeTokens } from "./themeTokens";

/**
 * Tipos de blocos disponíveis
 */
export type BlockType =
  // Layout primitives
  | "container"
  | "stack"
  | "grid"
  | "box"
  | "spacer"
  // Conteúdo básico
  | "heading"
  | "text"
  | "image"
  | "button"
  | "link"
  | "divider"
  // Conteúdo avançado
  | "badge"
  | "icon"
  | "avatar"
  | "video"
  | "socialLinks"
  // Composição básica
  | "card"
  | "section"
  // Seções compostas (Landing Page)
  | "hero"
  | "feature"
  | "featureGrid"
  | "pricing"
  | "pricingCard"
  | "testimonial"
  | "testimonialGrid"
  | "faq"
  | "faqItem"
  | "cta"
  | "stats"
  | "statItem"
  | "logoCloud"
  | "navbar"
  | "footer"
  // Novos blocos reutilizáveis
  | "countdown"
  | "carousel"
  | "blogCard"
  | "blogCardGrid"
  | "teamCard"
  | "teamGrid"
  | "courseCardGrid"
  | "categoryCardGrid"
  // Formulários
  | "form"
  | "input"
  | "textarea"
  | "formSelect";

/**
 * Props base de um bloco
 */
export interface BlockBase {
  id: string;
  type: BlockType;
}

/**
 * Container - Define largura máxima e padding
 */
export interface ContainerBlock extends BlockBase {
  type: "container";
  props: {
    maxWidth?: string; // ex: '1200px', '100%'
    padding?: string; // ex: '1rem', '2rem'
    children?: Block[];
  };
}

/**
 * Stack - Layout flex (row/col) com gap
 */
export interface StackBlock extends BlockBase {
  type: "stack";
  props: {
    direction?: "row" | "col";
    gap?: string; // ex: '1rem', '2rem'
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "space-between" | "space-around";
    wrap?: boolean;
    children?: Block[];
  };
}

/**
 * Grid - Layout em grid responsivo
 */
export interface GridBlock extends BlockBase {
  type: "grid";
  props: {
    cols?: number | { sm?: number; md?: number; lg?: number };
    gap?: string;
    children?: Block[];
  };
}

/**
 * Box - Container genérico com estilos
 */
export interface BoxBlock extends BlockBase {
  type: "box";
  props: {
    bg?: string;
    border?: string;
    radius?: string;
    shadow?: string;
    padding?: string;
    children?: Block[];
  };
}

/**
 * Heading - Título (H1-H6)
 */
export interface HeadingBlock extends BlockBase {
  type: "heading";
  props: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    align?: "left" | "center" | "right";
    color?: string;
  };
}

/**
 * Text - Parágrafo de texto
 */
export interface TextBlock extends BlockBase {
  type: "text";
  props: {
    text: string;
    align?: "left" | "center" | "right";
    color?: string;
    size?: "sm" | "md" | "lg";
  };
}

/**
 * Image - Imagem
 */
export interface ImageBlock extends BlockBase {
  type: "image";
  props: {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  };
}

/**
 * Button - Botão
 */
export interface ButtonBlock extends BlockBase {
  type: "button";
  props: {
    text: string;
    href?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
  };
}

/**
 * Link - Link
 */
export interface LinkBlock extends BlockBase {
  type: "link";
  props: {
    text: string;
    href: string;
    target?: "_blank" | "_self";
  };
}

/**
 * Divider - Divisor horizontal
 */
export interface DividerBlock extends BlockBase {
  type: "divider";
  props: {
    color?: string;
    thickness?: string;
  };
}

/**
 * Card - Card com slots (header/content/footer)
 */
export interface CardBlock extends BlockBase {
  type: "card";
  props: {
    header?: Block[];
    content?: Block[];
    footer?: Block[];
    padding?: string;
    bg?: string;
    border?: string;
    radius?: string;
    shadow?: string;
  };
}

/**
 * Section - Seção container
 */
export interface SectionBlock extends BlockBase {
  type: "section";
  props: {
    id?: string;
    bg?: string;
    padding?: string;
    children?: Block[];
  };
}

// ============================================================================
// NOVOS BLOCOS - LAYOUT AVANÇADO
// ============================================================================

/**
 * Spacer - Espaçador flexível
 */
export interface SpacerBlock extends BlockBase {
  type: "spacer";
  props: {
    height?: string;
    responsive?: { sm?: string; md?: string; lg?: string };
  };
}

// ============================================================================
// NOVOS BLOCOS - CONTEÚDO AVANÇADO
// ============================================================================

/**
 * Badge - Tag/badge com variantes
 */
export interface BadgeBlock extends BlockBase {
  type: "badge";
  props: {
    text: string;
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "info";
    size?: "sm" | "md" | "lg";
  };
}

/**
 * Icon - Ícone SVG
 */
export interface IconBlock extends BlockBase {
  type: "icon";
  props: {
    name: string; // nome do ícone (ex: 'check', 'star', 'arrow-right')
    size?: "sm" | "md" | "lg" | "xl";
    color?: string;
  };
}

/**
 * Avatar - Imagem circular com fallback
 */
export interface AvatarBlock extends BlockBase {
  type: "avatar";
  props: {
    src?: string;
    alt?: string;
    name?: string; // Para gerar iniciais se não houver imagem
    size?: "sm" | "md" | "lg" | "xl";
  };
}

/**
 * Video - Embed de vídeo
 */
export interface VideoBlock extends BlockBase {
  type: "video";
  props: {
    src: string; // URL do YouTube, Vimeo ou MP4
    poster?: string;
    autoplay?: boolean;
    controls?: boolean;
    aspectRatio?: "16:9" | "4:3" | "1:1" | "9:16";
  };
}

/**
 * SocialLinks - Links de redes sociais
 */
export interface SocialLinksBlock extends BlockBase {
  type: "socialLinks";
  props: {
    links: Array<{
      platform:
        | "facebook"
        | "twitter"
        | "instagram"
        | "linkedin"
        | "youtube"
        | "tiktok"
        | "github"
        | "whatsapp";
      url: string;
    }>;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "outline";
  };
}

// ============================================================================
// NOVOS BLOCOS - SEÇÕES COMPOSTAS
// ============================================================================

/**
 * Hero - Seção hero completa
 */
export type HeroVariationId = "hero-split" | "hero-parallax" | "hero-overlay";

export interface HeroBlock extends BlockBase {
  type: "hero";
  props: {
    variation?: HeroVariationId;
    variant?: "centered" | "split" | "image-bg" | "video-bg";
    title: string;
    subtitle?: string;
    description?: string;
    primaryButton?: { text: string; href?: string };
    secondaryButton?: { text: string; href?: string };
    image?: string;
    video?: string;
    badge?: string;
    align?: "left" | "center" | "right";
    minHeight?: string;
    overlay?: boolean;
    /** Cor/gradiente do overlay (ex.: linear-gradient). Se omitido, usa fallback do CSS. */
    overlayColor?: string;
    /** Cor ou gradiente no layout split (lado do conteúdo). */
    background?: string;
  };
}

/**
 * Feature - Card de feature individual
 */
export interface FeatureBlock extends BlockBase {
  type: "feature";
  props: {
    icon?: string;
    title: string;
    description: string;
    link?: { text: string; href: string };
  };
}

/**
 * FeatureGrid - Grid de features
 */
export interface FeatureGridBlock extends BlockBase {
  type: "featureGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    variant?: "default" | "cards" | "image-cards";
    features: Array<{
      icon?: string;
      title: string;
      description: string;
      image?: string;
      link?: { text: string; href?: string };
    }>;
  };
}

/**
 * PricingCard - Card de preço individual
 */
export interface PricingCardBlock extends BlockBase {
  type: "pricingCard";
  props: {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    buttonText?: string;
    buttonHref?: string;
    highlighted?: boolean;
    badge?: string;
  };
}

/**
 * Pricing - Seção de preços completa
 */
export interface PricingBlock extends BlockBase {
  type: "pricing";
  props: {
    title?: string;
    subtitle?: string;
    plans: Array<{
      name: string;
      price: string;
      period?: string;
      description?: string;
      features: string[];
      buttonText?: string;
      buttonHref?: string;
      highlighted?: boolean;
      badge?: string;
    }>;
  };
}

/**
 * Testimonial - Card de depoimento individual
 */
export interface TestimonialBlock extends BlockBase {
  type: "testimonial";
  props: {
    quote: string;
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    authorAvatar?: string;
    rating?: number; // 1-5 estrelas
  };
}

/**
 * TestimonialGrid - Grid de depoimentos
 */
export interface TestimonialGridBlock extends BlockBase {
  type: "testimonialGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    testimonials: Array<{
      quote: string;
      authorName: string;
      authorRole?: string;
      authorCompany?: string;
      authorAvatar?: string;
      rating?: number;
    }>;
  };
}

/**
 * FaqItem - Item individual do FAQ
 */
export interface FaqItemBlock extends BlockBase {
  type: "faqItem";
  props: {
    question: string;
    answer: string;
    defaultOpen?: boolean;
  };
}

/**
 * Faq - Seção FAQ completa (accordion)
 */
export interface FaqBlock extends BlockBase {
  type: "faq";
  props: {
    title?: string;
    subtitle?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

/**
 * CTA - Seção Call-to-Action
 */
export interface CtaBlock extends BlockBase {
  type: "cta";
  props: {
    title: string;
    description?: string;
    primaryButton?: { text: string; href?: string };
    secondaryButton?: { text: string; href?: string };
    variant?: "default" | "centered" | "split" | "gradient";
    bg?: string;
  };
}

/**
 * StatItem - Item individual de estatística
 */
export interface StatItemBlock extends BlockBase {
  type: "statItem";
  props: {
    value: string;
    label: string;
    prefix?: string;
    suffix?: string;
  };
}

/**
 * Stats - Seção de estatísticas
 */
export interface StatsBlock extends BlockBase {
  type: "stats";
  props: {
    title?: string;
    subtitle?: string;
    items: Array<{
      value: string;
      label: string;
      prefix?: string;
      suffix?: string;
    }>;
  };
}

/**
 * LogoCloud - Grid de logos
 */
export interface LogoCloudBlock extends BlockBase {
  type: "logoCloud";
  props: {
    title?: string;
    logos: Array<{
      src: string;
      alt: string;
      href?: string;
    }>;
    grayscale?: boolean;
  };
}

/**
 * Link da Navbar - pode ser um link simples ou ter um dropdown com subitems
 */
export type NavbarLink = {
  text: string;
  href?: string;
  dropdown?: Array<{ text: string; href: string }>;
};

/**
 * IDs das variações visuais do bloco Navbar
 */
export type NavbarVariationId =
  | "navbar-simples"
  | "navbar-moderno"
  | "navbar-glass"
  | "navbar-elegante"
  | "navbar-pill";

/**
 * Navbar - Barra de navegação
 */
export interface NavbarBlock extends BlockBase {
  type: "navbar";
  props: {
    variation?: NavbarVariationId;
    /** URL da imagem do logo ou objeto com src, alt e href */
    logo?: string | { src: string; alt?: string; href?: string };
    logoText?: string;
    links: Array<NavbarLink>;
    ctaButton?: { text: string; href?: string };
    sticky?: boolean;
    /** Cor de fundo customizada (suporta gradientes) */
    bg?: string;

    // Layout Options
    /** Distribuição do navbar: expandido, centralizado ou compacto */
    layout?: "expanded" | "centered" | "compact";
    /** Posição do logo: esquerda ou centro */
    logoPosition?: "left" | "center";
    /** Modo flutuante: navbar com margem lateral e mais destaque */
    floating?: boolean;

    // Visual Customization
    /** Border radius em pixels (0-24) */
    borderRadius?: number;
    /** Sombra do navbar */
    shadow?: "none" | "sm" | "md" | "lg" | "xl";
    /** Opacidade do navbar (0-100) */
    opacity?: number;
    /** Intensidade do desfoque/blur (0-100) para efeito de vidro fosco */
    blurOpacity?: number;
    /** Altura do logo em pixels (30-120) */
    logoHeight?: number;
    /** Posição da borda: nenhuma, completa, superior, inferior, esquerda, direita */
    borderPosition?: "none" | "all" | "top" | "bottom" | "left" | "right";
    /** Espessura da borda em pixels (1-4) */
    borderWidth?: number;
    /** Cor da borda */
    borderColor?: string;

    // Link Styling
    /** Cor dos links */
    linkColor?: string;
    /** Cor dos links no hover */
    linkHoverColor?: string;
    /** Tamanho da fonte dos links */
    linkFontSize?: "sm" | "md" | "lg";

    // Button/CTA Styling
    /** Variante do botão CTA */
    buttonVariant?: "solid" | "outline" | "ghost";
    /** Cor do botão CTA */
    buttonColor?: string;
    /** Cor do texto do botão CTA */
    buttonTextColor?: string;
    /** Border radius do botão em pixels (0-24) */
    buttonBorderRadius?: number;
  };
}

/**
 * Footer - Rodapé do site
 */
export interface FooterBlock extends BlockBase {
  type: "footer";
  props: {
    logo?: string | { src: string; alt?: string };
    logoText?: string;
    description?: string;
    columns?: Array<{
      title: string;
      links: Array<{
        text: string;
        href: string;
      }>;
    }>;
    social?: Array<{
      platform: string;
      href: string;
    }>;
    copyright?: string;
    variant?: "simple" | "multi-column";
  };
}

// ============================================================================
// NOVOS BLOCOS REUTILIZÁVEIS
// ============================================================================

/**
 * Countdown - Contador regressivo (eventos, matrículas, promoções)
 */
export interface CountdownBlock extends BlockBase {
  type: "countdown";
  props: {
    title?: string;
    description?: string;
    /** Data final em ISO string para cálculo real */
    endDate?: string;
    /** Exibir labels Days/Hours/Minutes/Seconds com valores 00 quando sem endDate */
    showPlaceholders?: boolean;
    buttonText?: string;
    buttonHref?: string;
    variant?: "default" | "banner";
    /** Texto no círculo decorativo (ex.: "Admission on Going") */
    badgeText?: string;
    bg?: string;
  };
}

/**
 * Carousel - Slider de slides (programas, destaques, depoimentos)
 */
export interface CarouselBlock extends BlockBase {
  type: "carousel";
  props: {
    slides: Array<{
      image?: string;
      title?: string;
      description?: string;
      primaryButton?: { text: string; href?: string };
      secondaryButton?: { text: string; href?: string };
    }>;
    autoplay?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
  };
}

/**
 * BlogCard - Card de post/notícia individual
 */
export interface BlogCardBlock extends BlockBase {
  type: "blogCard";
  props: {
    image?: string;
    date?: string;
    category?: string;
    title: string;
    excerpt?: string;
    linkText?: string;
    linkHref?: string;
  };
}

/**
 * BlogCardGrid - Grid de cards de blog/notícias
 */
export interface BlogCardGridBlock extends BlockBase {
  type: "blogCardGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    cards: Array<{
      image?: string;
      date?: string;
      category?: string;
      title: string;
      excerpt?: string;
      linkText?: string;
      linkHref?: string;
    }>;
  };
}

/**
 * TeamCard - Card de membro da equipe/professor
 */
export interface TeamCardBlock extends BlockBase {
  type: "teamCard";
  props: {
    avatar?: string;
    name: string;
    role?: string;
  };
}

/**
 * TeamGrid - Grid de membros da equipe
 */
export interface TeamGridBlock extends BlockBase {
  type: "teamGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    members: Array<{
      avatar?: string;
      name: string;
      role?: string;
    }>;
  };
}

/**
 * CourseCardGrid - Grid de cards de curso (thumbnail, título, preço, rating, View Course)
 */
export interface CourseCardGridBlock extends BlockBase {
  type: "courseCardGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    cards: Array<{
      image?: string;
      title: string;
      price?: string;
      period?: string;
      rating?: number;
      meta?: string[];
      buttonText?: string;
      buttonHref?: string;
    }>;
  };
}

/**
 * CategoryCardGrid - Grid de categorias (imagem de fundo + título overlay + link)
 */
export interface CategoryCardGridBlock extends BlockBase {
  type: "categoryCardGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    categories: Array<{
      image: string;
      title: string;
      href?: string;
    }>;
  };
}

// ============================================================================
// NOVOS BLOCOS - FORMULÁRIOS
// ============================================================================

/**
 * Form - Container de formulário
 */
export interface FormBlock extends BlockBase {
  type: "form";
  props: {
    action?: string;
    method?: "get" | "post";
    children?: Block[];
    submitText?: string;
  };
}

/**
 * Input - Campo de entrada
 */
export interface InputBlock extends BlockBase {
  type: "input";
  props: {
    name: string;
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel" | "url" | "number";
    required?: boolean;
  };
}

/**
 * Textarea - Campo de texto longo
 */
export interface TextareaBlock extends BlockBase {
  type: "textarea";
  props: {
    name: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
  };
}

/**
 * FormSelect - Dropdown de formulário
 */
export interface FormSelectBlock extends BlockBase {
  type: "formSelect";
  props: {
    name: string;
    label?: string;
    placeholder?: string;
    options: Array<{ value: string; label: string }>;
    required?: boolean;
  };
}

// ============================================================================
// UNION TYPE DE TODOS OS BLOCOS
// ============================================================================

/**
 * Union type de todos os blocos
 */
export type Block =
  // Layout
  | ContainerBlock
  | StackBlock
  | GridBlock
  | BoxBlock
  | SpacerBlock
  // Conteúdo básico
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | LinkBlock
  | DividerBlock
  // Conteúdo avançado
  | BadgeBlock
  | IconBlock
  | AvatarBlock
  | VideoBlock
  | SocialLinksBlock
  // Composição básica
  | CardBlock
  | SectionBlock
  // Seções compostas
  | HeroBlock
  | FeatureBlock
  | FeatureGridBlock
  | PricingBlock
  | PricingCardBlock
  | TestimonialBlock
  | TestimonialGridBlock
  | FaqBlock
  | FaqItemBlock
  | CtaBlock
  | StatsBlock
  | StatItemBlock
  | LogoCloudBlock
  | NavbarBlock
  | FooterBlock
  // Novos blocos reutilizáveis
  | CountdownBlock
  | CarouselBlock
  | BlogCardBlock
  | BlogCardGridBlock
  | TeamCardBlock
  | TeamGridBlock
  | CourseCardGridBlock
  | CategoryCardGridBlock
  // Formulários
  | FormBlock
  | InputBlock
  | TextareaBlock
  | FormSelectBlock;

/**
 * Página do site
 */
export interface SitePage {
  id: string;
  name: string;
  slug: string;
  structure: Block[]; // Árvore de blocos
}

/**
 * Coleções de conteúdo (testimonials, faq, posts, etc)
 */
export interface ContentCollection {
  id: string;
  type: "testimonials" | "faq" | "posts" | "services" | "team" | "custom";
  items: Array<Record<string, any>>;
}

/**
 * Documento completo do site V2
 */
export interface SiteDocumentV2 {
  schemaVersion: 2;
  theme: ThemeTokens;
  content?: {
    collections?: ContentCollection[];
  };
  pages: SitePage[];
}

/**
 * Helper para criar um documento V2 vazio
 */
export function createEmptySiteDocumentV2(
  _name: string = "Novo Site",
): SiteDocumentV2 {
  return {
    schemaVersion: 2,
    theme: {
      colors: {
        bg: "#ffffff",
        surface: "#f9fafb",
        border: "#e5e7eb",
        text: "#1f2937",
        mutedText: "#6b7280",
        primary: "#3b82f6",
        primaryText: "#ffffff",
        secondary: "#6b7280",
        accent: "#8b5cf6",
        ring: "#3b82f6",
      },
      radiusScale: "md",
      shadowScale: "soft",
      spacingScale: "normal",
      motion: "subtle",
      backgroundStyle: "flat",
      typography: {
        fontFamily: {
          heading: "system-ui, -apple-system, sans-serif",
          body: "system-ui, -apple-system, sans-serif",
        },
        baseSize: "16px",
        headingScale: {
          h1: "2.5rem",
          h2: "2rem",
          h3: "1.75rem",
          h4: "1.5rem",
          h5: "1.25rem",
          h6: "1rem",
        },
      },
    },
    pages: [
      {
        id: "home",
        name: "Home",
        slug: "home",
        structure: [],
      },
    ],
  };
}
