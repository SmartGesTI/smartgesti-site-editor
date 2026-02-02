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
  };
}

export const heroVariations: Record<HeroVariationId, HeroVariationPreset> = {
  "hero-split": {
    id: "hero-split",
    name: "Hero Dividido",
    defaultProps: {
      variation: "hero-split",
      variant: "split",
      title: "Educação que transforma",
      subtitle: "Metodologias ativas e suporte dedicado",
      description:
        "Conteúdo alinhado à Base Nacional Comum Curricular, com foco em competências e habilidades para o mundo atual.",
      primaryButton: { text: "Conhecer cursos", href: "#courses" },
      secondaryButton: { text: "Fale conosco", href: "#contact" },
      // image removido: não sobrescrever a imagem do usuário ao trocar de variação
      align: "left",
    },
  },
  "hero-parallax": {
    id: "hero-parallax",
    name: "Hero Parallax",
    defaultProps: {
      variation: "hero-parallax",
      variant: "image-bg",
      title: "Ensino de qualidade para todos",
      subtitle: "Do tradicional ao contemporâneo",
      description:
        "Integramos as melhores práticas pedagógicas para formar cidadãos críticos e criativos.",
      primaryButton: { text: "Saiba mais", href: "#about" },
      secondaryButton: { text: "Matricule-se", href: "#enroll" },
      // image removido: não sobrescrever a imagem do usuário ao trocar de variação
      overlay: true,
      align: "center",
      minHeight: "85vh",
    },
  },
  "hero-overlay": {
    id: "hero-overlay",
    name: "Hero Overlay / Fullscreen",
    defaultProps: {
      variation: "hero-overlay",
      variant: "image-bg",
      title: "Engaje seus alunos nas atividades escolares",
      subtitle: "5 maneiras comprovadas de aumentar a participação",
      badge: "Destaque",
      primaryButton: { text: "Ver artigos", href: "#blog" },
      secondaryButton: { text: "Aula grátis", href: "#trial" },
      // image removido: não sobrescrever a imagem do usuário ao trocar de variação
      overlay: true,
      align: "center",
      minHeight: "100vh",
    },
  },
};

export const heroVariationIds: HeroVariationId[] = [
  "hero-split",
  "hero-parallax",
  "hero-overlay",
];

export function getHeroVariation(id: HeroVariationId): HeroVariationPreset {
  return heroVariations[id];
}
