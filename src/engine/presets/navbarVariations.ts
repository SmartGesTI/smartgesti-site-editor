/**
 * Presets de variações do bloco Navbar
 * 3 estilos visuais: Clássico, Centralizado, Minimal
 */

import type { NavbarVariationId } from "../schema/siteDocument";

export interface NavbarVariationPreset {
  id: NavbarVariationId;
  name: string;
  defaultProps: {
    variation: NavbarVariationId;
    logoText: string;
    links: Array<{ text: string; href: string; submenu?: Array<{ text: string; href: string; description?: string }> }>;
    ctaButton?: { text: string; href?: string };
    sticky: boolean;
    bg?: string;
  };
}

export const navbarVariations: Record<
  NavbarVariationId,
  NavbarVariationPreset
> = {
  "navbar-classic": {
    id: "navbar-classic",
    name: "Clássico",
    defaultProps: {
      variation: "navbar-classic",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        { text: "Cursos", href: "/site/p/cursos" },
        { text: "Avisos", href: "/site/p/avisos" },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Começar", href: "/site/p/contato" },
      sticky: true,
    },
  },
  "navbar-centered": {
    id: "navbar-centered",
    name: "Centralizado",
    defaultProps: {
      variation: "navbar-centered",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        { text: "Cursos", href: "/site/p/cursos" },
        { text: "Avisos", href: "/site/p/avisos" },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Começar", href: "/site/p/contato" },
      sticky: true,
    },
  },
  "navbar-dropdown": {
    id: "navbar-dropdown",
    name: "Com Dropdowns",
    defaultProps: {
      variation: "navbar-dropdown",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        {
          text: "Serviços",
          href: "#",
          submenu: [
            { text: "Web Design", href: "/site/p/web-design" },
            { text: "SEO", href: "/site/p/seo" },
            { text: "Marketing Digital", href: "/site/p/marketing" },
            { text: "Consultoria", href: "/site/p/consultoria" },
          ]
        },
        {
          text: "Produtos",
          href: "#",
          submenu: [
            { text: "Software", href: "/site/p/software" },
            { text: "Apps Mobile", href: "/site/p/apps" },
            { text: "Integrações", href: "/site/p/integracoes" },
          ]
        },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Começar Agora", href: "/site/p/contato" },
      sticky: true,
    },
  },
  "navbar-mega": {
    id: "navbar-mega",
    name: "Mega Menu",
    defaultProps: {
      variation: "navbar-mega",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        {
          text: "Soluções",
          href: "#",
          submenu: [
            { text: "Web Design", href: "/site/p/web-design", description: "Sites modernos e responsivos" },
            { text: "SEO & Marketing", href: "/site/p/seo", description: "Otimização e tráfego orgânico" },
            { text: "E-commerce", href: "/site/p/ecommerce", description: "Lojas virtuais completas" },
            { text: "Aplicativos", href: "/site/p/apps", description: "Apps para iOS e Android" },
            { text: "Consultoria", href: "/site/p/consultoria", description: "Estratégia digital personalizada" },
            { text: "Suporte 24/7", href: "/site/p/suporte", description: "Atendimento contínuo" },
          ]
        },
        {
          text: "Recursos",
          href: "#",
          submenu: [
            { text: "Blog", href: "/site/p/blog", description: "Artigos e tutoriais" },
            { text: "Documentação", href: "/site/p/docs", description: "Guias completos" },
            { text: "Cases", href: "/site/p/cases", description: "Histórias de sucesso" },
          ]
        },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Teste Grátis", href: "/site/p/trial" },
      sticky: true,
    },
  },
};

export const navbarVariationIds: NavbarVariationId[] = [
  "navbar-classic",
  "navbar-centered",
  "navbar-dropdown",
  "navbar-mega",
];

export function getNavbarVariation(
  id: NavbarVariationId,
): NavbarVariationPreset {
  return navbarVariations[id];
}
