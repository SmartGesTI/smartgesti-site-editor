/**
 * Presets de variações do bloco Navbar
 * Estilos visuais: Clássico, Centralizado, Clássico com Dropdowns, Centralizado com Dropdowns
 */

import type { NavbarVariationId, NavbarLink } from "../schema/siteDocument";

export interface NavbarVariationPreset {
  id: NavbarVariationId;
  name: string;
  defaultProps: {
    variation: NavbarVariationId;
    logoText: string;
    links: Array<NavbarLink>;
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
  "navbar-dropdown-classic": {
    id: "navbar-dropdown-classic",
    name: "Clássico com Dropdowns",
    defaultProps: {
      variation: "navbar-dropdown-classic",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        {
          text: "Cursos",
          dropdown: [
            { text: "Ensino Fundamental", href: "/site/p/fundamental" },
            { text: "Ensino Médio", href: "/site/p/medio" },
            { text: "EJA", href: "/site/p/eja" },
          ],
        },
        { text: "Avisos", href: "/site/p/avisos" },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Matrícula", href: "/site/p/matricula" },
      sticky: true,
    },
  },
  "navbar-dropdown-centered": {
    id: "navbar-dropdown-centered",
    name: "Centralizado com Dropdowns",
    defaultProps: {
      variation: "navbar-dropdown-centered",
      logoText: "Logo",
      links: [
        { text: "Início", href: "/site/p/home" },
        {
          text: "Cursos",
          dropdown: [
            { text: "Ensino Fundamental", href: "/site/p/fundamental" },
            { text: "Ensino Médio", href: "/site/p/medio" },
            { text: "EJA", href: "/site/p/eja" },
          ],
        },
        { text: "Avisos", href: "/site/p/avisos" },
        { text: "Contato", href: "/site/p/contato" },
      ],
      ctaButton: { text: "Matrícula", href: "/site/p/matricula" },
      sticky: true,
    },
  },
};

export const navbarVariationIds: NavbarVariationId[] = [
  "navbar-classic",
  "navbar-centered",
  "navbar-dropdown-classic",
  "navbar-dropdown-centered",
];

export function getNavbarVariation(
  id: NavbarVariationId,
): NavbarVariationPreset {
  return navbarVariations[id];
}
