/**
 * Converte documento no formato shared (templates) para o formato do engine.
 * Shared: meta, theme (SimpleThemeTokens), structure na raiz.
 * Engine: schemaVersion, theme (ThemeTokens), pages[].structure.
 */

import type { SiteDocument as EngineDocument } from "../engine/schema/siteDocument";
import type { ThemeTokens } from "../engine/schema/themeTokens";
import type { SiteDocument as SharedDocument } from "../shared/schema";
import { createNavbarBlock, createFooterBlock } from "./pageTemplateFactory";

/** Slugs canônicos das páginas pré-fabricadas do site. Links do navbar/CTAs usam /site/p/:slug. */
export const CANONICAL_SITE_PAGE_SLUGS = [
  "home",
  "avisos",
  "cursos",
  "contato",
  "sobre",
  "metodologia",
  "depoimentos",
  "faq",
] as const;

type CanonicalSlug = (typeof CANONICAL_SITE_PAGE_SLUGS)[number];

/**
 * Cria estrutura mínima (navbar + título + placeholder + footer) para cada página canônica além da home.
 * As páginas são criadas dinamicamente com navbar e footer incluídos.
 */
function createCanonicalPageStructure(
  slug: Exclude<CanonicalSlug, "home">,
  name: string,
  placeholder: string,
  allPages: EngineDocument["pages"]
): EngineDocument["pages"][0]["structure"] {
  return [
    createNavbarBlock(allPages),
    {
      id: `${slug}-heading`,
      type: "heading",
      props: { level: 1, text: name },
    },
    {
      id: `${slug}-placeholder`,
      type: "text",
      props: { text: placeholder },
    },
    createFooterBlock(),
  ];
}

/** Metadados das páginas canônicas */
const CANONICAL_PAGE_META: Record<
  Exclude<CanonicalSlug, "home">,
  { name: string; placeholder: string }
> = {
  avisos: {
    name: "Avisos",
    placeholder: "Os avisos e comunicados aparecerão aqui quando houver conteúdo.",
  },
  cursos: {
    name: "Cursos",
    placeholder: "Conheça nossos cursos e formações. O conteúdo será exibido aqui.",
  },
  contato: {
    name: "Contato",
    placeholder: "Entre em contato conosco. As informações serão exibidas aqui.",
  },
  sobre: {
    name: "Sobre",
    placeholder: "Conheça nossa história e missão. O conteúdo será exibido aqui.",
  },
  metodologia: {
    name: "Metodologia",
    placeholder: "Nossa forma de ensinar. O conteúdo será exibido aqui.",
  },
  depoimentos: {
    name: "Depoimentos",
    placeholder: "O que nossos alunos dizem. Os depoimentos serão exibidos aqui.",
  },
  faq: {
    name: "FAQ",
    placeholder: "Perguntas e respostas frequentes. O conteúdo será exibido aqui.",
  },
};

/**
 * Converte um documento no formato shared (usado nos templates em shared/templates)
 * para o formato do engine (usado pelo LandingPageEditor e Preview).
 * Cria todas as páginas pré-fabricadas (home + avisos, cursos, contato, etc.) para que
 * os links do navbar (/site/p/:slug) tenham página correspondente.
 * Cada página criada automaticamente inclui navbar (com links para todas as páginas) e footer.
 */
export function sharedTemplateToEngineDocument(
  shared: SharedDocument,
): EngineDocument {
  const theme = mapSharedThemeToEngine(shared.theme);
  const structure = shared.structure ? [...shared.structure] : [];

  // Primeiro, criar array de metadados das páginas
  const pagesMetadata = [
    { id: "home", name: shared.meta?.title || "Home", slug: "home" },
    ...CANONICAL_SITE_PAGE_SLUGS.filter(s => s !== "home").map(slug => ({
      id: slug,
      name: CANONICAL_PAGE_META[slug].name,
      slug,
    })),
  ];

  // Criar páginas vazias inicialmente para generateNavbarLinks
  const pages: EngineDocument["pages"] = pagesMetadata.map(({ id, name, slug }) => ({
    id,
    name,
    slug,
    structure: [],
  }));

  // Agora preencher a estrutura de cada página com navbar, conteúdo e footer
  pages[0].structure = structure as EngineDocument["pages"][0]["structure"];

  for (let i = 1; i < pages.length; i++) {
    const page = pages[i];
    const meta = CANONICAL_PAGE_META[page.id as Exclude<CanonicalSlug, "home">];
    page.structure = createCanonicalPageStructure(
      page.id as Exclude<CanonicalSlug, "home">,
      meta.name,
      meta.placeholder,
      pages
    );
  }

  return {
    schemaVersion: 2,
    theme,
    pages,
  };
}

function mapSharedThemeToEngine(
  sharedTheme: SharedDocument["theme"],
): ThemeTokens {
  const c = sharedTheme.colors;
  return {
    colors: {
      bg: c.background ?? "#ffffff",
      surface: c.surface ?? "#f8fafc",
      border: c.border ?? "#e2e8f0",
      text: c.text ?? "#1e293b",
      mutedText: c.textMuted ?? "#64748b",
      primary: c.primary ?? "#3b82f6",
      primaryText: "#ffffff",
      secondary: c.secondary ?? "#64748b",
      accent: c.accent ?? "#f59e0b",
      ring: c.primary ?? "#3b82f6",
      success: c.success,
      warning: c.warning,
      danger: c.error,
    },
    radiusScale: "md",
    shadowScale: "soft",
    spacingScale: "normal",
    motion: "subtle",
    backgroundStyle: "flat",
    typography: {
      fontFamily: {
        heading:
          sharedTheme.typography?.fontFamilyHeading ??
          "Inter, system-ui, sans-serif",
        body:
          sharedTheme.typography?.fontFamily ?? "Inter, system-ui, sans-serif",
      },
      baseSize: sharedTheme.typography?.baseFontSize ?? "16px",
      headingScale: {
        h1: "2.5rem",
        h2: "2rem",
        h3: "1.75rem",
        h4: "1.5rem",
        h5: "1.25rem",
        h6: "1rem",
      },
    },
  };
}
