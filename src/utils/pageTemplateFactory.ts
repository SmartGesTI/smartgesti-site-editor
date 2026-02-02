/**
 * Page Template Factory - Cria estruturas padrão para novas páginas
 * Factory functions para gerar páginas com navbar, hero/conteúdo e footer
 */

import { Block, NavbarBlock, SitePage } from "@/engine/schema/siteDocument";

/**
 * Gera ID único para blocos
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gera slug único verificando se já existe
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingPages: SitePage[]
): string {
  const slugs = new Set(existingPages.map((p) => p.slug));

  // Se o slug base não existe, retorna ele
  if (!slugs.has(baseSlug)) {
    return baseSlug;
  }

  // Tenta com sufixos numéricos
  let counter = 2;
  while (slugs.has(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}

/**
 * Cria um bloco navbar com links para todas as páginas
 * Com sincronização automática ativada
 */
export function createNavbarBlock(pages: SitePage[]): NavbarBlock {
  return {
    id: `navbar-${generateId()}`,
    type: "navbar",
    props: {
      variation: "navbar-classic",
      logoText: "Logo",
      links: pages.map((page) => ({
        text: page.name,
        href: page.slug === "home" ? "/" : `/p/${page.slug}`,
      })),
      ctaButton: { text: "Contato", href: "/p/contato" },
      sticky: true,
      _autoSync: true, // Ativar sincronização automática

      // Default styling
      floating: false,
      layout: "expanded",
      borderRadius: 0,
      shadow: "sm",
      opacity: 100,
      linkFontSize: "md",
      buttonVariant: "solid",
      buttonBorderRadius: 8,
    } as any,
  };
}

/**
 * Cria um bloco footer simples
 */
export function createFooterBlock(): Block {
  return {
    id: `footer-${generateId()}`,
    type: "footer",
    props: {
      logoText: "Logo",
      description: "Descrição do site",
      columns: [
        {
          title: "Links",
          links: [{ text: "Home", href: "/" }],
        },
      ],
      social: [],
      copyright: "© 2025. Todos os direitos reservados.",
      variant: "simple",
    } as any,
  };
}

/**
 * Cria estrutura padrão para a página home
 */
function createHomePageStructure(allPages: SitePage[]): Block[] {
  return [
    createNavbarBlock(allPages),
    {
      id: `home-hero-${generateId()}`,
      type: "hero",
      props: {
        variant: "centered",
        title: "Bem-vindo",
        description: "Sua landing page profissional",
        primaryButton: { text: "Começar", href: "#" },
      },
    },
    createFooterBlock(),
  ];
}

/**
 * Cria estrutura padrão para páginas de conteúdo
 */
function createContentPageStructure(
  pageId: string,
  pageName: string,
  allPages: SitePage[]
): Block[] {
  return [
    createNavbarBlock(allPages),
    {
      id: `${pageId}-heading-${generateId()}`,
      type: "heading",
      props: {
        level: 1,
        text: pageName,
      },
    },
    {
      id: `${pageId}-content-${generateId()}`,
      type: "text",
      props: {
        text: `Conteúdo da página ${pageName}.`,
      },
    },
    createFooterBlock(),
  ];
}

/**
 * Cria estrutura completa para uma nova página
 * @param id - ID da página
 * @param name - Nome da página
 * @param slug - Slug da página
 * @param allPages - Todas as páginas (incluindo a nova) para gerar links do navbar
 */
export function createDefaultPageStructure(
  id: string,
  name: string,
  slug: string,
  allPages: SitePage[]
): SitePage {
  // Home tem estrutura diferente (com Hero)
  const structure =
    id === "home"
      ? createHomePageStructure(allPages)
      : createContentPageStructure(id, name, allPages);

  return {
    id,
    name,
    slug,
    structure,
  };
}
