/**
 * Site Document Schema
 * Documento componível baseado em blocos
 */

import { ThemeTokens } from "./themeTokens";
import type { ImageGridItem, ImageGridPreset } from "../shared/imageGrid";
import type { TypographyConfig } from "../shared/typography";
import type { SitePluginsConfig, PageDataSource, PageEditRestrictions } from "../plugins/types";

// Re-export shared types for convenience
export type { ImageGridItem, ImageGridPreset } from "../shared/imageGrid";
export type { TypographyConfig } from "../shared/typography";

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
  // Blog plugin (dinâmico)
  | "blogPostCard"
  | "blogPostGrid"
  | "blogPostDetail"
  | "blogCategoryFilter"
  | "blogSearchBar"
  | "blogRecentPosts"
  | "blogTagCloud"
  // Seções avançadas
  | "productShowcase"
  | "aboutSection"
  | "contactSection"
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
    /** Sticky positioning (stays fixed while scrolling). Disabled on mobile. */
    sticky?: boolean;
    /** Top offset when sticky (ex: "80px" for below navbar). Default "80px". */
    stickyOffset?: string;
    /** Bottom padding */
    paddingBottom?: string;
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
    /** CSS grid-template-columns override (ex: "1fr 320px"). Tem prioridade sobre cols. */
    colTemplate?: string;
    gap?: string;
    /** Max-width of the grid container. Centers with auto margin. */
    maxWidth?: string;
    /** Horizontal padding. Applied to the grid wrapper. */
    padding?: string;
    /** Top padding — useful to clear fixed/sticky navbars. */
    paddingTop?: string;
    /** Bottom padding */
    paddingBottom?: string;
    /** Grid container position when maxWidth is set. Default "center". */
    contentPosition?: "left" | "center" | "right";
    /** Background color for the full-width wrapper. */
    bg?: string;
    /** Background image URL */
    bgImage?: string;
    /** Dark overlay on background image */
    bgOverlay?: boolean;
    /** Overlay color (default "rgba(0,0,0,0.5)") */
    bgOverlayColor?: string;
    /** CSS gradient (applied as background) */
    bgGradient?: string;
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
    // Hover effects (principal)
    /** Efeito de hover no botão */
    hoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    /** Intensidade do efeito (10-100) */
    hoverIntensity?: number;
    // Hover overlay (adicional - combina com o principal)
    /** Efeito visual adicional no hover */
    hoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    /** Nome do ícone para o efeito "icon" */
    hoverIconName?: string;
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
    // Hover effects
    /** Efeito de hover no link */
    hoverEffect?: "none" | "background" | "underline" | "underline-center" | "scale" | "glow";
    /** Intensidade do efeito (10-100) */
    hoverIntensity?: number;
    /** Cor do hover */
    hoverColor?: string;
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
export type HeroVariationId =
  | "hero-split"
  | "hero-parallax"
  | "hero-overlay"
  | "hero-gradient"
  | "hero-minimal"
  | "hero-card"
  | "hero-carousel";

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
    /** Posição horizontal do container de conteúdo no layout */
    contentPosition?: "left" | "center" | "right";
    /** Espaçamento entre elementos do conteúdo (título, subtítulo, descrição, botões) */
    contentSpacing?: "compact" | "default" | "spacious";
    /** Distância entre o bloco de conteúdo e o bloco de imagem (layouts divididos) */
    blockGap?: "default" | "wide" | "x-wide";
    minHeight?: string;
    overlay?: boolean;
    /** Cor/gradiente do overlay (ex.: linear-gradient). Se omitido, usa fallback do CSS. */
    overlayColor?: string;
    /** Cor ou gradiente no layout split (lado do conteúdo). */
    background?: string;

    // === Typography Colors (legacy - mantido para retrocompatibilidade) ===
    /** Cor do título */
    titleColor?: string;
    /** Cor do subtítulo */
    subtitleColor?: string;
    /** Cor da descrição */
    descriptionColor?: string;

    // === Typography Config (novo sistema completo) ===
    /** Configuração completa de tipografia do título */
    titleTypography?: TypographyConfig;
    /** Configuração completa de tipografia do subtítulo */
    subtitleTypography?: TypographyConfig;
    /** Configuração completa de tipografia da descrição */
    descriptionTypography?: TypographyConfig;

    // === Badge Styling ===
    /** Cor de fundo do badge */
    badgeColor?: string;
    /** Cor do texto do badge */
    badgeTextColor?: string;

    // === Layout & Spacing ===
    /** Largura máxima do conteúdo */
    contentMaxWidth?: string;
    /** Espaçamento interno vertical */
    paddingY?: string;

    // === Image Styling ===
    /** Border radius da imagem (px) */
    imageRadius?: number;
    /** Sombra da imagem */
    imageShadow?: "none" | "sm" | "md" | "lg" | "xl";
    /** Posição da imagem no split */
    imagePosition?: "left" | "right";

    // === Button Size ===
    /** Tamanho dos botões */
    buttonSize?: "sm" | "md" | "lg";

    // === Primary Button Styling ===
    /** Variante do botão primário */
    primaryButtonVariant?: "solid" | "outline" | "ghost";
    /** Cor do botão primário */
    primaryButtonColor?: string;
    /** Cor do texto do botão primário */
    primaryButtonTextColor?: string;
    /** Border radius do botão primário */
    primaryButtonRadius?: number;

    // === Secondary Button Styling ===
    /** Variante do botão secundário */
    secondaryButtonVariant?: "solid" | "outline" | "ghost";
    /** Cor do botão secundário */
    secondaryButtonColor?: string;
    /** Cor do texto do botão secundário */
    secondaryButtonTextColor?: string;
    /** Border radius do botão secundário */
    secondaryButtonRadius?: number;

    // === Button Hover Effects (principal) ===
    /** Efeito de hover nos botões */
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    /** Intensidade do efeito (10-100) */
    buttonHoverIntensity?: number;

    // === Button Hover Overlay (adicional) ===
    /** Efeito visual adicional nos botões */
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    /** Nome do ícone para o efeito "icon" */
    buttonHoverIconName?: string;

    // === Decorative Elements ===
    /** Mostrar elemento decorativo de onda no fundo */
    showWave?: boolean;
    /** Cor da onda decorativa */
    waveColor?: string;

    // === Image Grid System ===
    /** Habilita grid de imagens no lugar da imagem única (split layout) */
    imageGridEnabled?: boolean;
    /** Preset de layout da grid */
    imageGridPreset?: ImageGridPreset;
    /** Array de imagens da grid (até 4) */
    imageGridImages?: ImageGridItem[];
    /** Espaçamento entre imagens em pixels */
    imageGridGap?: number;

    // === Carousel System ===
    /** Array de imagens do carrossel de fundo */
    carouselImages?: string[];
    /** Intervalo entre slides em segundos */
    carouselInterval?: number;
    /** Tipo de transição do carrossel */
    carouselTransition?: "crossfade" | "slide";
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
    // Button Size
    /** Tamanho dos botões */
    buttonSize?: "sm" | "md" | "lg";
    // Button Hover Effects (principal)
    /** Efeito de hover nos botões */
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    /** Intensidade do efeito (10-100) */
    buttonHoverIntensity?: number;
    // Button Hover Overlay (adicional)
    /** Efeito visual adicional nos botões */
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    /** Nome do ícone para o efeito "icon" */
    buttonHoverIconName?: string;
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
    /** Efeito de hover nos links */
    linkHoverEffect?: "background" | "underline" | "underline-center" | "slide-bg" | "scale" | "glow";
    /** Intensidade do efeito de hover nos links (0-100) */
    linkHoverIntensity?: number;

    // Button/CTA Styling
    /** Variante do botão CTA */
    buttonVariant?: "solid" | "outline" | "ghost";
    /** Tamanho do botão CTA */
    buttonSize?: "sm" | "md" | "lg";
    /** Cor do botão CTA */
    buttonColor?: string;
    /** Cor do texto do botão CTA */
    buttonTextColor?: string;
    /** Border radius do botão em pixels (0-24) */
    buttonBorderRadius?: number;
    /** Efeito de hover no botão CTA */
    buttonHoverEffect?: "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    /** Intensidade do efeito de hover no botão (0-100) */
    buttonHoverIntensity?: number;
    /** Efeito visual adicional no botão CTA */
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    /** Nome do ícone para o efeito "icon" */
    buttonHoverIconName?: string;
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
    // Link Hover Effects
    /** Efeito de hover nos links */
    linkHoverEffect?: "none" | "background" | "underline" | "underline-center" | "scale" | "glow";
    /** Intensidade do efeito (10-100) */
    linkHoverIntensity?: number;
    /** Cor do link no hover */
    linkHoverColor?: string;
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
// BLOCOS DE PLUGIN - BLOG (dinâmico, conectado a ContentProvider)
// ============================================================================

/**
 * BlogPostCard - Card individual de post (versão dinâmica do blogCard)
 * Pode receber dados de ContentProvider ou ter conteúdo estático
 */
export interface BlogPostCardBlock extends BlockBase {
  type: "blogPostCard";
  props: {
    title: string;
    excerpt?: string;
    image?: string;
    date?: string;
    category?: string;
    authorName?: string;
    authorAvatar?: string;
    readingTime?: string;
    linkHref?: string;
    linkText?: string;
    variant?: "default" | "horizontal" | "minimal";
    showImage?: boolean;
    showCategory?: boolean;
    showDate?: boolean;
    showAuthor?: boolean;
    showReadingTime?: boolean;
  };
}

/**
 * BlogPostGrid - Grid de posts com suporte a dados dinâmicos
 * Pode usar dataSource para buscar do ContentProvider ou cards estáticos
 */
export interface BlogPostGridBlock extends BlockBase {
  type: "blogPostGrid";
  props: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    /** Cards estáticos (quando não há dataSource) */
    cards?: Array<{
      title: string;
      excerpt?: string;
      image?: string;
      date?: string;
      category?: string;
      authorName?: string;
      linkHref?: string;
      linkText?: string;
    }>;
    /** Fonte de dados dinâmica (ContentProvider) */
    dataSource?: {
      provider: string;
      limit?: number;
      filter?: Record<string, unknown>;
    };
    variant?: "default" | "featured" | "minimal" | "magazine";
    showViewAll?: boolean;
    viewAllText?: string;
    viewAllHref?: string;
    /** Pagination — set by content hydration, not user-editable */
    currentPage?: number;
    totalPages?: number;
    paginationBaseUrl?: string;
    /** Card styling */
    cardBorderRadius?: string;
    cardShadow?: "none" | "sm" | "md" | "lg" | "xl";
    cardHoverEffect?: "none" | "lift" | "scale" | "glow";
    cardBorder?: boolean;
    cardBorderColor?: string;
    cardBorderWidth?: number;
    /** Image effects */
    imageHoverEffect?: "none" | "zoom" | "brightness";
    imageBorderRadius?: string;
    /** CTA "Ler mais" - padrão do sistema (Hero) */
    ctaVariation?: "link" | "button";
    /** Link (quando ctaVariation === "link") */
    linkColor?: string;
    linkHoverColor?: string;
    linkHoverEffect?: "none" | "background" | "underline" | "underline-center" | "slide-bg" | "scale" | "glow";
    linkHoverIntensity?: number;
    /** Button (quando ctaVariation === "button") - padrão Hero */
    buttonVariant?: "solid" | "outline" | "ghost";
    buttonColor?: string;
    buttonTextColor?: string;
    buttonRadius?: number;
    buttonSize?: "sm" | "md" | "lg";
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    buttonHoverIntensity?: number;
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "border-glow";
  };
}

/**
 * BlogPostDetail - Conteúdo completo de um post (para página blog/:slug)
 * Recebe dados do ContentProvider na página dinâmica
 */
export interface BlogPostDetailBlock extends BlockBase {
  type: "blogPostDetail";
  props: {
    title: string;
    content: string;
    featuredImage?: string;
    date?: string;
    category?: string;
    /** Variante visual do bloco autor: "inline" | "card" | "minimal" */
    authorVariant?: "inline" | "card" | "minimal";
    readingTime?: string;
    tags?: string[];
    showFeaturedImage?: boolean;
    showAuthor?: boolean;
    showDate?: boolean;
    showTags?: boolean;
    showReadingTime?: boolean;
    contentMaxWidth?: string;
    /** Nome do autor (populado pela hydration, editável no admin) */
    authorName?: string;
    /** Avatar URL do autor */
    authorAvatar?: string;
    /** Bio curta do autor */
    authorBio?: string;
    // SEO fields (populated by ContentProvider, readOnly in editor)
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

/**
 * BlogCategoryFilter - Filtro de categorias para listagem do blog
 * Dados populados pelo ContentProvider (categories extraídas dos posts)
 */
export interface BlogCategoryFilterBlock extends BlockBase {
  type: "blogCategoryFilter";
  props: {
    title?: string;
    categories: Array<{ name: string; slug: string; count?: number; image?: string }>;
    variant: "chips" | "buttons" | "list";
    showCount?: boolean;
    showAll?: boolean;
    allLabel?: string;
    activeCategory?: string;
    filterUrl?: string;
    /** Link text color */
    linkColor?: string;
    /** Link hover color */
    linkHoverColor?: string;
    /** Link hover effect type */
    linkHoverEffect?: string;
    /** Link hover intensity (10-100) */
    linkHoverIntensity?: number;
    /** Card border radius. Default "0.75rem". */
    borderRadius?: string;
    /** Card box shadow: "none" | "sm" | "md". Default "none". */
    shadow?: string;
  };
}

/**
 * BlogSearchBar - Barra de busca para o blog
 * Envia busca via form action para URL configurável
 */
export interface BlogSearchBarBlock extends BlockBase {
  type: "blogSearchBar";
  props: {
    placeholder?: string;
    variant: "simple" | "expanded" | "with-filters";
    showIcon?: boolean;
    searchUrl?: string;
    filterCategories?: boolean;
    filterTags?: boolean;
    filterDate?: boolean;
    /** Card border radius. Default "0.75rem". */
    borderRadius?: string;
    /** Card box shadow: "none" | "sm" | "md". Default "none". */
    shadow?: string;
  };
}

/**
 * BlogRecentPosts - Widget com os posts mais recentes do blog
 */
export interface BlogRecentPostsBlock extends BlockBase {
  type: "blogRecentPosts";
  props: {
    /** Título do widget (ex: "Posts Recentes") */
    title?: string;
    /** Quantidade de posts a exibir */
    count?: number;
    /** Posts hidratados pela contentHydration */
    posts?: Array<{
      title: string;
      slug: string;
      date?: string;
      image?: string;
      category?: string;
    }>;
    /** Mostrar miniatura */
    showThumbnail?: boolean;
    /** Mostrar data */
    showDate?: boolean;
    /** Mostrar badge de categoria */
    showCategory?: boolean;
    /** Link text color */
    linkColor?: string;
    /** Link hover color */
    linkHoverColor?: string;
    /** Link hover effect type */
    linkHoverEffect?: string;
    /** Link hover intensity (10-100) */
    linkHoverIntensity?: number;
    /** Card border radius. Default "0.75rem". */
    borderRadius?: string;
    /** Card box shadow: "none" | "sm" | "md". Default "none". */
    shadow?: string;
  };
}

/**
 * BlogTagCloud - Widget com nuvem de tags do blog
 */
export interface BlogTagCloudBlock extends BlockBase {
  type: "blogTagCloud";
  props: {
    /** Título do widget (ex: "Tags") */
    title?: string;
    /** Tags hidratadas pela contentHydration — array de {name, count} */
    tags?: Array<{ name: string; count: number }>;
    /** Estilo: "badges" | "list" */
    variant?: "badges" | "list";
    /** Link text color */
    linkColor?: string;
    /** Link hover color */
    linkHoverColor?: string;
    /** Link hover effect type */
    linkHoverEffect?: string;
    /** Link hover intensity (10-100) */
    linkHoverIntensity?: number;
    /** Card border radius. Default "0.75rem". */
    borderRadius?: string;
    /** Card box shadow: "none" | "sm" | "md". Default "none". */
    shadow?: string;
  };
}

// ============================================================================
// SEÇÕES AVANÇADAS
// ============================================================================

/**
 * ProductShowcase - Seção de produtos com layout alternado
 */
export interface ProductShowcaseBlock extends BlockBase {
  type: "productShowcase";
  props: {
    title?: string;
    subtitle?: string;
    products: Array<{
      image?: string;
      icon?: string;
      badge?: string;
      name: string;
      description: string;
      longDescription?: string;
      features?: string[];
      primaryButton?: { text: string; href?: string };
      secondaryButton?: { text: string; href?: string };
    }>;
    variant?: "alternating" | "grid" | "stacked";
    bg?: string;
    // Button Hover Effects
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    buttonHoverIntensity?: number;
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    buttonHoverIconName?: string;
  };
}

/**
 * AboutSection - Seção sobre com imagem decorativa + texto + achievements
 */
export interface AboutSectionBlock extends BlockBase {
  type: "aboutSection";
  props: {
    title?: string;
    subtitle?: string;
    description?: string;
    secondaryDescription?: string;
    image?: string;
    achievements?: Array<{
      text: string;
    }>;
    primaryButton?: { text: string; href?: string };
    variant?: "image-left" | "image-right" | "centered";
    bg?: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
    // Button Hover Effects
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    buttonHoverIntensity?: number;
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    buttonHoverIconName?: string;
  };
}

/**
 * ContactSection - Seção de contato com info cards + formulário
 */
export interface ContactSectionBlock extends BlockBase {
  type: "contactSection";
  props: {
    title?: string;
    subtitle?: string;
    description?: string;
    contactInfo?: Array<{
      icon?: string;
      label: string;
      value: string;
    }>;
    formTitle?: string;
    formFields?: Array<{
      name: string;
      label: string;
      type: "text" | "email" | "tel" | "textarea";
      placeholder?: string;
      required?: boolean;
    }>;
    submitText?: string;
    variant?: "split" | "stacked" | "form-only";
    bg?: string;
    // Button Hover Effects
    buttonHoverEffect?: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse";
    buttonHoverIntensity?: number;
    buttonHoverOverlay?: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow";
    buttonHoverIconName?: string;
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
  // Blog plugin (dinâmico)
  | BlogPostCardBlock
  | BlogPostGridBlock
  | BlogPostDetailBlock
  | BlogCategoryFilterBlock
  | BlogSearchBarBlock
  | BlogRecentPostsBlock
  | BlogTagCloudBlock
  // Seções avançadas
  | ProductShowcaseBlock
  | AboutSectionBlock
  | ContactSectionBlock
  // Formulários
  | FormBlock
  | InputBlock
  | TextareaBlock
  | FormSelectBlock;

/**
 * Utility type: extract the block interface for a given BlockType
 */
export type BlockOfType<T extends BlockType> = Extract<Block, { type: T }>;

/**
 * Utility type: extract the props type for a given BlockType
 */
export type BlockPropsFor<T extends BlockType> = BlockOfType<T>["props"];

/**
 * SEO configuration for a page
 */
export interface PageSeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/**
 * Global site metadata for SEO
 */
export interface SiteMetadata {
  siteName?: string;
  defaultOgImage?: string;
  language?: string;
}

/**
 * Página do site
 */
export interface SitePage {
  id: string;
  name: string;
  slug: string;
  structure: Block[]; // Árvore de blocos
  /** ID do plugin que criou esta página (se for uma página de plugin) */
  pluginId?: string;
  /** ID do template de página do plugin */
  pageTemplateId?: string;
  /** Página dinâmica com dados de backend (ex.: blog/:slug) */
  isDynamic?: boolean;
  /** Configuração de dados dinâmicos (provider, modo, mapeamento) */
  dataSource?: PageDataSource;
  /** Restrições de edição impostas pelo plugin */
  editRestrictions?: PageEditRestrictions;
  /** SEO configuration for this page */
  seo?: PageSeoConfig;
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
 * Documento completo do site
 */
export interface SiteDocument {
  schemaVersion: 2;
  theme: ThemeTokens;
  content?: {
    collections?: ContentCollection[];
  };
  pages: SitePage[];
  /** Configuração de plugins ativos e suas opções */
  plugins?: SitePluginsConfig;
  /** Global site metadata for SEO */
  metadata?: SiteMetadata;
}

/**
 * Helper para criar um documento vazio
 */
export function createEmptySiteDocument(
  _name: string = "Novo Site",
): SiteDocument {
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
