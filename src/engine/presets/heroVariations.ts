/**
 * Presets de variações do bloco Hero
 * Imagens padrão são placeholders visíveis; o usuário pode trocar por upload ou URL.
 */

import type { HeroVariationId } from "../schema/siteDocument";

/** URL de imagem placeholder que funciona no editor e no site (sem depender de /site-images/) */
export const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/1200x800/e2e8f0/64748b?text=Imagem+Hero";

export const HERO_IMAGE_NAMES = [
  "20221121_00_ensino_ciencias_molecula.jpg",
  "escolaweb-capas-artigos-5-maneiras-de-engajar-os-alunos-nas-atividades-escolares-1.jpg",
  "metodo-tradicional-de-ensino-do-Brasil.jpg",
  "niveis-e-modalidades-de-ensino-da-Educacao-Basica-scaled.jpg",
] as const;

export interface HeroVariationPreset {
  id: HeroVariationId;
  name: string;
  defaultProps: {
    variation: HeroVariationId;
    variant: "centered" | "split" | "image-bg" | "video-bg";
    title: string;
    subtitle?: string;
    description?: string;
    primaryButton?: { text: string; href?: string };
    secondaryButton?: { text: string; href?: string };
    image?: string;
    badge?: string;
    align?: "left" | "center" | "right";
    minHeight?: string;
    overlay?: boolean;
    overlayColor?: string;
    background?: string;
    // Typography
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    // Badge
    badgeColor?: string;
    badgeTextColor?: string;
    // Layout
    contentMaxWidth?: string;
    paddingY?: string;
    // Image
    imageRadius?: number;
    imageShadow?: "none" | "sm" | "md" | "lg" | "xl";
    imagePosition?: "left" | "right";
    // Buttons
    buttonSize?: "sm" | "md" | "lg";
    primaryButtonVariant?: "solid" | "outline" | "ghost";
    primaryButtonColor?: string;
    primaryButtonTextColor?: string;
    primaryButtonRadius?: number;
    secondaryButtonVariant?: "solid" | "outline" | "ghost";
    secondaryButtonColor?: string;
    secondaryButtonTextColor?: string;
    secondaryButtonRadius?: number;
    // Decorative
    showWave?: boolean;
    waveColor?: string;
  };
}

export const heroVariations: Record<HeroVariationId, HeroVariationPreset> = {
  // ============================================================================
  // HERO SPLIT - Layout dividido (conteúdo + imagem)
  // ============================================================================
  "hero-split": {
    id: "hero-split",
    name: "Dividido",
    defaultProps: {
      variation: "hero-split",
      variant: "split",
      title: "Educação que transforma",
      subtitle: "Metodologias ativas e suporte dedicado",
      description:
        "Conteúdo alinhado à Base Nacional Comum Curricular, com foco em competências e habilidades para o mundo atual.",
      primaryButton: { text: "Conhecer cursos", href: "#courses" },
      secondaryButton: { text: "Fale conosco", href: "#contact" },
      align: "left",
      minHeight: "600px",
      imageRadius: 16,
      imageShadow: "lg",
      imagePosition: "right",
      primaryButtonVariant: "solid",
      secondaryButtonVariant: "outline",
      primaryButtonRadius: 8,
      secondaryButtonRadius: 8,
    },
  },

  // ============================================================================
  // HERO PARALLAX - Efeito de parallax com imagem fixa
  // ============================================================================
  "hero-parallax": {
    id: "hero-parallax",
    name: "Parallax",
    defaultProps: {
      variation: "hero-parallax",
      variant: "image-bg",
      title: "Ensino de qualidade para todos",
      subtitle: "Do tradicional ao contemporâneo",
      description:
        "Integramos as melhores práticas pedagógicas para formar cidadãos críticos e criativos.",
      primaryButton: { text: "Saiba mais", href: "#about" },
      secondaryButton: { text: "Matricule-se", href: "#enroll" },
      overlay: true,
      overlayColor: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
      align: "center",
      minHeight: "85vh",
      titleColor: "#ffffff",
      subtitleColor: "#f3f4f6",
      descriptionColor: "#e5e7eb",
      primaryButtonVariant: "solid",
      secondaryButtonVariant: "outline",
      secondaryButtonColor: "#ffffff",
      secondaryButtonTextColor: "#ffffff",
      primaryButtonRadius: 8,
      secondaryButtonRadius: 8,
    },
  },

  // ============================================================================
  // HERO OVERLAY - Fullscreen com overlay escuro
  // ============================================================================
  "hero-overlay": {
    id: "hero-overlay",
    name: "Fullscreen",
    defaultProps: {
      variation: "hero-overlay",
      variant: "image-bg",
      title: "Engaje seus alunos nas atividades escolares",
      subtitle: "5 maneiras comprovadas de aumentar a participação",
      badge: "Destaque",
      primaryButton: { text: "Ver artigos", href: "#blog" },
      secondaryButton: { text: "Aula grátis", href: "#trial" },
      overlay: true,
      overlayColor: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)",
      align: "center",
      minHeight: "100vh",
      titleColor: "#ffffff",
      subtitleColor: "#f3f4f6",
      descriptionColor: "#d1d5db",
      badgeColor: "#3b82f6",
      badgeTextColor: "#ffffff",
      primaryButtonVariant: "solid",
      secondaryButtonVariant: "ghost",
      secondaryButtonTextColor: "#ffffff",
      primaryButtonRadius: 50,
      secondaryButtonRadius: 50,
    },
  },

  // ============================================================================
  // HERO GRADIENT - Fundo gradiente vibrante (SEM imagem)
  // ============================================================================
  "hero-gradient": {
    id: "hero-gradient",
    name: "Gradiente",
    defaultProps: {
      variation: "hero-gradient",
      variant: "centered",
      title: "Transforme o futuro da educação",
      subtitle: "Plataforma completa para gestão escolar",
      description:
        "Simplifique processos, engaje alunos e pais, e tenha controle total da sua instituição com nossa solução integrada.",
      primaryButton: { text: "Começar grátis", href: "#trial" },
      secondaryButton: { text: "Ver demonstração", href: "#demo" },
      badge: "Novo",
      align: "center",
      minHeight: "90vh",
      // Gradiente vibrante azul/roxo
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      titleColor: "#ffffff",
      subtitleColor: "#f3f4f6",
      descriptionColor: "#e5e7eb",
      badgeColor: "rgba(255,255,255,0.2)",
      badgeTextColor: "#ffffff",
      contentMaxWidth: "800px",
      // Botões brancos/transparentes para contraste
      primaryButtonVariant: "solid",
      primaryButtonColor: "#ffffff",
      primaryButtonTextColor: "#667eea",
      primaryButtonRadius: 50,
      secondaryButtonVariant: "outline",
      secondaryButtonColor: "#ffffff",
      secondaryButtonTextColor: "#ffffff",
      secondaryButtonRadius: 50,
      // Onda decorativa
      showWave: true,
      waveColor: "rgba(255,255,255,0.1)",
    },
  },

  // ============================================================================
  // HERO MINIMAL - Design limpo e minimalista
  // ============================================================================
  "hero-minimal": {
    id: "hero-minimal",
    name: "Minimal",
    defaultProps: {
      variation: "hero-minimal",
      variant: "centered",
      title: "Educação simplificada",
      subtitle: "Menos complexidade, mais aprendizado",
      description:
        "Uma abordagem moderna e direta para o ensino de qualidade. Foco no que realmente importa.",
      primaryButton: { text: "Explorar", href: "#explore" },
      align: "center",
      minHeight: "70vh",
      background: "#fafafa",
      titleColor: "#111827",
      subtitleColor: "#4b5563",
      descriptionColor: "#6b7280",
      contentMaxWidth: "700px",
      paddingY: "120px",
      // Botão único, estilo minimalista
      primaryButtonVariant: "solid",
      primaryButtonColor: "#111827",
      primaryButtonTextColor: "#ffffff",
      primaryButtonRadius: 4,
      buttonSize: "lg",
    },
  },

  // ============================================================================
  // HERO CARD - Conteúdo em card flutuante sobre imagem
  // ============================================================================
  "hero-card": {
    id: "hero-card",
    name: "Card",
    defaultProps: {
      variation: "hero-card",
      variant: "image-bg",
      title: "Aprenda com os melhores",
      subtitle: "Professores qualificados e conteúdo atualizado",
      description:
        "Nossa equipe de educadores está pronta para guiar você em uma jornada de conhecimento transformadora.",
      primaryButton: { text: "Matricule-se", href: "#enroll" },
      secondaryButton: { text: "Conheça o time", href: "#team" },
      badge: "Matrículas Abertas",
      overlay: true,
      overlayColor: "rgba(0,0,0,0.3)",
      align: "left",
      minHeight: "70vh",
      paddingY: "6rem",
      // Card styling (cores do card)
      background: "#ffffff",
      titleColor: "#111827",
      subtitleColor: "#374151",
      descriptionColor: "#6b7280",
      badgeColor: "#10b981",
      badgeTextColor: "#ffffff",
      contentMaxWidth: "450px",
      // Botões dentro do card
      primaryButtonVariant: "solid",
      primaryButtonRadius: 8,
      secondaryButtonVariant: "ghost",
      secondaryButtonRadius: 8,
      // Imagem
      imageRadius: 0,
      imageShadow: "none",
    },
  },
};

export const heroVariationIds: HeroVariationId[] = [
  "hero-split",
  "hero-parallax",
  "hero-overlay",
  "hero-gradient",
  "hero-minimal",
  "hero-card",
];

export function getHeroVariation(id: HeroVariationId): HeroVariationPreset {
  return heroVariations[id];
}
