/**
 * Schema Simplificado para Geração por IA
 *
 * Este schema define tipos standalone mais simples
 * que a IA pode gerar facilmente e que podem ser
 * convertidos para o schema do Editor quando necessário.
 */

// ============================================================================
// TIPOS DE BLOCO
// ============================================================================

export type BlockType =
  // Layout
  | "container"
  | "stack"
  | "grid"
  | "box"
  | "spacer"
  // Conteúdo
  | "heading"
  | "text"
  | "image"
  | "button"
  | "link"
  | "divider"
  | "badge"
  | "icon"
  | "avatar"
  | "video"
  | "socialLinks"
  // Composição
  | "card"
  | "section"
  // Landing Page
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
  // Forms
  | "form"
  | "input"
  | "textarea"
  | "formSelect";

/** Lista de tipos de bloco válidos (para validação) */
export const AVAILABLE_BLOCK_TYPES: readonly BlockType[] = [
  "container",
  "stack",
  "grid",
  "box",
  "spacer",
  "heading",
  "text",
  "image",
  "button",
  "link",
  "divider",
  "badge",
  "icon",
  "avatar",
  "video",
  "socialLinks",
  "card",
  "section",
  "hero",
  "feature",
  "featureGrid",
  "pricing",
  "pricingCard",
  "testimonial",
  "testimonialGrid",
  "faq",
  "faqItem",
  "cta",
  "stats",
  "statItem",
  "logoCloud",
  "navbar",
  "footer",
  "countdown",
  "carousel",
  "blogCard",
  "blogCardGrid",
  "teamCard",
  "teamGrid",
  "courseCardGrid",
  "categoryCardGrid",
  "form",
  "input",
  "textarea",
  "formSelect",
] as const;

// ============================================================================
// BLOCOS BASE
// ============================================================================

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface Block extends BlockBase {
  props: Record<string, any>;
}

// ============================================================================
// BLOCOS ESPECÍFICOS
// ============================================================================

export interface ContainerBlock extends BlockBase {
  type: "container";
  props: { maxWidth?: string; padding?: string; children?: Block[] };
}

export interface StackBlock extends BlockBase {
  type: "stack";
  props: {
    direction?: "row" | "col";
    gap?: string;
    align?: string;
    justify?: string;
    wrap?: boolean;
    children?: Block[];
  };
}

export interface GridBlock extends BlockBase {
  type: "grid";
  props: {
    cols?: number | { sm?: number; md?: number; lg?: number };
    gap?: string;
    children?: Block[];
  };
}

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

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  props: { size?: string };
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  props: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    align?: string;
    color?: string;
  };
}

export interface TextBlock extends BlockBase {
  type: "text";
  props: {
    text: string;
    align?: string;
    color?: string;
    size?: "sm" | "md" | "lg";
  };
}

export interface ImageBlock extends BlockBase {
  type: "image";
  props: {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    objectFit?: string;
  };
}

export interface ButtonBlock extends BlockBase {
  type: "button";
  props: {
    text: string;
    href?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
  };
}

export interface LinkBlock extends BlockBase {
  type: "link";
  props: { text: string; href: string; target?: "_blank" | "_self" };
}

export interface DividerBlock extends BlockBase {
  type: "divider";
  props: { color?: string; thickness?: string };
}

export interface BadgeBlock extends BlockBase {
  type: "badge";
  props: { text: string; variant?: string };
}

export interface IconBlock extends BlockBase {
  type: "icon";
  props: { name: string; size?: string; color?: string };
}

export interface AvatarBlock extends BlockBase {
  type: "avatar";
  props: { src?: string; name?: string; size?: "sm" | "md" | "lg" | "xl" };
}

export interface VideoBlock extends BlockBase {
  type: "video";
  props: {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
}

export interface SocialLinksBlock extends BlockBase {
  type: "socialLinks";
  props: { links: Array<{ platform: string; url: string }>; variant?: string };
}

export interface CardBlock extends BlockBase {
  type: "card";
  props: { header?: Block[]; content?: Block[]; footer?: Block[] };
}

export interface SectionBlock extends BlockBase {
  type: "section";
  props: { bg?: string; padding?: string; children?: Block[] };
}

export interface HeroBlock extends BlockBase {
  type: "hero";
  props: {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    primaryButton?: { text: string; href?: string };
    secondaryButton?: { text: string; href?: string };
    variant?: "centered" | "split" | "background";
    align?: string;
    overlay?: boolean;
    overlayColor?: string;
    background?: string;
  };
}

export interface FeatureBlock extends BlockBase {
  type: "feature";
  props: { icon?: string; title: string; description: string };
}

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

export interface PricingCardBlock extends BlockBase {
  type: "pricingCard";
  props: {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    buttonText: string;
    highlighted?: boolean;
  };
}

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
      buttonText: string;
      highlighted?: boolean;
    }>;
  };
}

export interface TestimonialBlock extends BlockBase {
  type: "testimonial";
  props: {
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
  };
}

export interface TestimonialGridBlock extends BlockBase {
  type: "testimonialGrid";
  props: {
    title?: string;
    testimonials: Array<{
      quote: string;
      author: string;
      role?: string;
      company?: string;
      avatar?: string;
    }>;
  };
}

export interface FaqItemBlock extends BlockBase {
  type: "faqItem";
  props: { question: string; answer: string };
}

export interface FaqBlock extends BlockBase {
  type: "faq";
  props: { title?: string; items: Array<{ question: string; answer: string }> };
}

export interface CtaBlock extends BlockBase {
  type: "cta";
  props: {
    title: string;
    description?: string;
    buttonText: string;
    buttonHref?: string;
    variant?: "simple" | "centered" | "split";
  };
}

export interface StatItemBlock extends BlockBase {
  type: "statItem";
  props: { value: string; label: string; description?: string };
}

export interface StatsBlock extends BlockBase {
  type: "stats";
  props: {
    items: Array<{ value: string; label: string; description?: string }>;
  };
}

export interface LogoCloudBlock extends BlockBase {
  type: "logoCloud";
  props: {
    title?: string;
    logos: Array<{ src: string; alt?: string; href?: string }>;
  };
}

export interface NavbarBlock extends BlockBase {
  type: "navbar";
  props: {
    variation?: string;
    logo?: string | { src: string; alt?: string; href?: string };
    logoText?: string;
    links: Array<{ text: string; href: string }>;
    ctaButton?: { text: string; href?: string };
    sticky?: boolean;
    transparent?: boolean;
    bg?: string;
  };
}

export interface CountdownBlock extends BlockBase {
  type: "countdown";
  props: {
    title?: string;
    description?: string;
    endDate?: string;
    showPlaceholders?: boolean;
    buttonText?: string;
    buttonHref?: string;
    variant?: "default" | "banner";
    badgeText?: string;
    bg?: string;
  };
}

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

export interface TeamCardBlock extends BlockBase {
  type: "teamCard";
  props: {
    avatar?: string;
    name: string;
    role?: string;
  };
}

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

export interface FormBlock extends BlockBase {
  type: "form";
  props: { action?: string; method?: string; children?: Block[] };
}

export interface InputBlock extends BlockBase {
  type: "input";
  props: {
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
}

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

export interface FormSelectBlock extends BlockBase {
  type: "formSelect";
  props: {
    name: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
    required?: boolean;
  };
}

// Alias para nomes alternativos (compatibilidade)
export type FAQBlock = FaqBlock;
export type FAQItemBlock = FaqItemBlock;
export type CTABlock = CtaBlock;

// ============================================================================
// TEMA SIMPLIFICADO PARA IA
// ============================================================================

export interface SimpleColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface SimpleTypographyTokens {
  fontFamily: string;
  fontFamilyHeading: string;
  baseFontSize: string;
  lineHeight: number;
  headingLineHeight: number;
}

export interface SimpleSpacingTokens {
  unit: string;
  scale: number[];
}

export interface SimpleEffectTokens {
  borderRadius: string;
  shadow: string;
  shadowLg: string;
  transition: string;
}

export interface SimpleThemeTokens {
  colors: SimpleColorTokens;
  typography: SimpleTypographyTokens;
  spacing: SimpleSpacingTokens;
  effects: SimpleEffectTokens;
}

// ============================================================================
// DOCUMENTO SIMPLIFICADO PARA IA
// ============================================================================

export interface DocumentMeta {
  title: string;
  description?: string;
  favicon?: string;
  language?: string;
}

export interface SiteDocument {
  meta: DocumentMeta;
  theme: SimpleThemeTokens;
  structure: Block[];
}

// ============================================================================
// TEMA PADRÃO
// ============================================================================

export const defaultThemeTokens: SimpleThemeTokens = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontFamilyHeading: "Inter, system-ui, sans-serif",
    baseFontSize: "16px",
    lineHeight: 1.6,
    headingLineHeight: 1.2,
  },
  spacing: {
    unit: "0.25rem",
    scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
  },
  effects: {
    borderRadius: "0.5rem",
    shadow: "0 1px 3px rgba(0,0,0,0.1)",
    shadowLg: "0 10px 15px rgba(0,0,0,0.1)",
    transition: "0.2s ease",
  },
};

// ============================================================================
// HELPERS
// ============================================================================

let blockIdCounter = 0;

export function generateBlockId(prefix: string = "block"): string {
  return `${prefix}-${++blockIdCounter}-${Date.now().toString(36)}`;
}

export function generateThemeCSSVariables(theme: SimpleThemeTokens): string {
  return `
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
    --color-border: ${theme.colors.border};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
    --font-family: ${theme.typography.fontFamily};
    --font-family-heading: ${theme.typography.fontFamilyHeading};
    --font-size-base: ${theme.typography.baseFontSize};
    --line-height: ${theme.typography.lineHeight};
    --line-height-heading: ${theme.typography.headingLineHeight};
    --border-radius: ${theme.effects.borderRadius};
    --shadow: ${theme.effects.shadow};
    --shadow-lg: ${theme.effects.shadowLg};
    --transition: ${theme.effects.transition};
  `;
}

// Re-export tipos com alias para compatibilidade
export type ColorTokens = SimpleColorTokens;
export type TypographyTokens = SimpleTypographyTokens;
export type SpacingTokens = SimpleSpacingTokens;
export type EffectTokens = SimpleEffectTokens;
export type ThemeTokens = SimpleThemeTokens;
export type LayoutTokens = Record<string, any>;
export type ComponentTokens = Record<string, any>;
export type ThemePreset = string;
export const themePresets: Record<string, SimpleThemeTokens> = {
  default: defaultThemeTokens,
};
