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
    links: Array<{ text: string; href: string }>;
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
};

export const navbarVariationIds: NavbarVariationId[] = [
  "navbar-classic",
  "navbar-centered",
];

export function getNavbarVariation(
  id: NavbarVariationId,
): NavbarVariationPreset {
  return navbarVariations[id];
}
