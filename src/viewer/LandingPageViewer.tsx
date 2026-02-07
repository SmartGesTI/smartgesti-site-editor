/**
 * Landing Page Viewer
 * Visualização pública da landing page.
 * Usa o mesmo mecanismo do Preview (editor): exportPageToHtml + iframe srcdoc.
 *
 * Supports dynamic pages via ContentProvider (Sprint 3):
 * - Optional `contentProviders` prop allows consumer to supply data providers
 * - Dynamic page resolution (e.g., "blog/:slug")
 * - Automatic content hydration before rendering
 */

import { useState, useEffect, useRef } from "react";
import {
  SiteDocument,
  SitePage,
  exportPageToHtml,
  createEmptySiteDocument,
  defaultThemeTokens,
} from "../engine";
import type { ContentProvider } from "../engine/plugins/types";
import { matchDynamicPage } from "../engine/plugins/dynamicPageResolver";
import {
  hydratePageWithContent,
  type ContentProviderMap,
} from "../engine/plugins/contentHydration";
import { logger } from "../utils/logger";

/** Verifica se o HTML tem conteúdo real no body (evita usar publishedHtml vazio) */
function hasBodyContent(html: string): boolean {
  if (!html || typeof html !== "string") return false;
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyInner = match ? match[1].trim() : "";
  return bodyInner.length > 50;
}

export interface SchoolData {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

interface LandingPageViewerProps {
  siteId: string;
  apiBaseUrl: string;
  projectId: string;
  /** Slug da página (ex.: avisos). Se não informado, usa home. */
  pageSlug?: string;
  /** Slug da escola no contexto /site/escola/:schoolSlug */
  schoolSlug?: string;
  /** Dados da escola para header/navbar dinâmico (quando em contexto escola) */
  schoolData?: SchoolData;
  /**
   * Content providers for dynamic pages (e.g., blog posts, products).
   * Supplied by the consumer project to connect plugin data to the viewer.
   */
  contentProviders?: ContentProvider[];
}

/**
 * Builds a ContentProviderMap from an array of providers.
 */
function buildProviderMap(providers?: ContentProvider[]): ContentProviderMap {
  const map: ContentProviderMap = new Map();
  if (providers) {
    for (const p of providers) {
      map.set(p.type, p);
    }
  }
  return map;
}

export function LandingPageViewer({
  siteId,
  apiBaseUrl,
  projectId,
  pageSlug,
  schoolSlug,
  schoolData: _schoolData, // reservado para header/navbar dinâmico (logo, nome da escola)
  contentProviders,
}: LandingPageViewerProps) {
  const [document, setDocument] = useState<SiteDocument | null>(null);
  const [publishedHtml, setPublishedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydratedHtml, setHydratedHtml] = useState<string | null>(null);

  // Track if hydration is in progress
  const isHydratingRef = useRef(false);

  useEffect(() => {
    loadLandingPage();
  }, [siteId]);

  const loadLandingPage = async () => {
    setIsLoading(true);
    setError(null);
    setHydratedHtml(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/sites/${siteId}?projectId=${projectId}`,
      );
      if (!response.ok) {
        throw new Error("Landing page não encontrada");
      }

      const data = await response.json();

      // Sempre guardar template quando existir (para fallback se publishedHtml estiver vazio)
      if (data.template) {
        const schemaVersion = data.template.schemaVersion;
        const hasPages =
          data.template.pages && Array.isArray(data.template.pages);
        const isV2 = schemaVersion === 2 || schemaVersion === "2" || hasPages;

        if (isV2) {
          const template = data.template as SiteDocument;
          if (!Array.isArray(template.pages)) {
            template.pages = [];
          }
          if (template.schemaVersion !== 2 && template.schemaVersion !== "2") {
            template.schemaVersion = 2;
          }
          setDocument(template);
        } else {
          throw new Error(
            "Formato de template legado não suportado. Por favor, recrie o site.",
          );
        }
      } else {
        setDocument(null);
      }

      // publishedHtml só é usado se tiver conteúdo no body (evita tela em branco quando salvo vazio)
      if (data.publishedHtml && hasBodyContent(data.publishedHtml)) {
        setPublishedHtml(data.publishedHtml);
      } else {
        setPublishedHtml(null);
      }

      if (!data.template && !data.publishedHtml) {
        throw new Error("Template não encontrado");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar landing page",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hydrate dynamic pages when document + contentProviders are available
  useEffect(() => {
    if (!document || !pageSlug || isHydratingRef.current) return;

    const pages = Array.isArray(document.pages) ? document.pages : [];
    const providerMap = buildProviderMap(contentProviders);

    // Only hydrate if we have providers
    if (providerMap.size === 0) return;

    // Try to resolve the page (exact or dynamic)
    const exactPage = pages.find(
      (p) => p.slug === pageSlug || p.id === pageSlug,
    );

    let resolvedPage: SitePage | undefined;
    let urlParams: Record<string, string> = {};

    if (exactPage) {
      resolvedPage = exactPage;
    } else {
      // Try dynamic page resolution
      const match = matchDynamicPage(pages, pageSlug);
      if (match) {
        resolvedPage = match.page;
        urlParams = match.params;
      }
    }

    // Only hydrate pages with a dataSource
    if (!resolvedPage?.dataSource) return;

    isHydratingRef.current = true;

    hydratePageWithContent(resolvedPage, providerMap, urlParams)
      .then((hydratedPage) => {
        // Generate HTML from hydrated page
        const html = renderPageToHtml(hydratedPage, document, schoolSlug, pages);
        if (html) {
          setHydratedHtml(html);
        }
      })
      .catch((err) => {
        logger.error("Error hydrating page:", err);
      })
      .finally(() => {
        isHydratingRef.current = false;
      });
  }, [document, pageSlug, contentProviders, schoolSlug]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div>{error || "Landing page não encontrada"}</div>
      </div>
    );
  }

  // Preferir renderização via template (client-side) quando disponível.
  // Isso garante que o viewer usa exatamente o mesmo exportPageToHtml() do editor,
  // evitando diferenças de hover effects, CSS, etc. entre editor e site publicado.
  // publishedHtml do servidor é usado apenas como fallback quando não há template.
  const isHomeRoute = !pageSlug || pageSlug === "home";
  if (publishedHtml && isHomeRoute && !document) {
    return (
      <iframe
        srcDoc={publishedHtml}
        title="Site publicado"
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "none",
          backgroundColor: "#ffffff",
        }}
      />
    );
  }

  // Renderizar documento (template) — mesmo pipeline do editor
  if (!document) {
    return null;
  }

  // Garantir que pages seja array (evita crash se API retornar formato inesperado)
  const pages = Array.isArray(document.pages) ? document.pages : [];

  if (pages.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>Nenhuma página no site. Adicione páginas no editor.</div>
      </div>
    );
  }

  // If we have hydrated HTML from ContentProvider, use it
  if (hydratedHtml) {
    return (
      <iframe
        srcDoc={hydratedHtml}
        title="Site"
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "none",
          backgroundColor: "#ffffff",
        }}
      />
    );
  }

  // Resolver página por slug ou id; fallback para home
  // Also try dynamic page resolution
  let page =
    (pageSlug
      ? pages.find((p) => p.slug === pageSlug || p.id === pageSlug)
      : null) ??
    null;

  if (!page && pageSlug) {
    const match = matchDynamicPage(pages, pageSlug);
    if (match) {
      page = match.page;
    }
  }

  if (!page) {
    page = pages.find((p) => p.id === "home") ?? pages[0];
  }

  if (!page) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div>Página não encontrada</div>
      </div>
    );
  }

  const html = renderPageToHtml(page, document, schoolSlug, pages);
  if (!html) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>Conteúdo da página vazio. Adicione blocos no editor.</div>
      </div>
    );
  }

  // Mesmo mecanismo do Preview (editor): iframe com srcdoc = HTML completo
  return (
    <iframe
      srcDoc={html}
      title="Site"
      style={{
        width: "100%",
        minHeight: "100vh",
        border: "none",
        backgroundColor: "#ffffff",
      }}
    />
  );
}

/**
 * Generates HTML from a page using the standard export pipeline.
 * Extracted to reuse for both static and hydrated pages.
 */
function renderPageToHtml(
  page: SitePage,
  document: SiteDocument,
  schoolSlug?: string,
  allPages?: SitePage[],
): string | null {
  // Garantir structure para o export (evita erro se página vier sem structure)
  const pageWithStructure = {
    ...page,
    structure: Array.isArray(page.structure) ? page.structure : [],
  };

  // Garantir theme completo para o export (merge com default evita theme parcial quebrar CSS)
  const defaultDoc = createEmptySiteDocument("");
  const rawTheme =
    document.theme && typeof document.theme === "object"
      ? document.theme
      : null;
  const theme = rawTheme
    ? {
        ...defaultThemeTokens,
        ...rawTheme,
        colors:
          rawTheme.colors && typeof rawTheme.colors === "object"
            ? { ...defaultThemeTokens.colors, ...rawTheme.colors }
            : defaultThemeTokens.colors,
        typography:
          rawTheme.typography && typeof rawTheme.typography === "object"
            ? { ...defaultThemeTokens.typography, ...rawTheme.typography }
            : defaultThemeTokens.typography,
      }
    : defaultDoc.theme;

  const documentWithTheme: SiteDocument = {
    ...document,
    schemaVersion: 2,
    theme,
  };

  // basePath para links (ex.: /site ou /site/escola/:slug)
  const basePath = schoolSlug ? `/site/escola/${schoolSlug}` : "/site";

  const pages = allPages ?? document.pages;
  const homePage = pages.find((p) => p.id === "home") ?? pages[0];
  const layoutFromPage =
    homePage && homePage.id !== pageWithStructure.id
      ? {
          ...homePage,
          structure: Array.isArray(homePage.structure)
            ? homePage.structure
            : [],
        }
      : undefined;

  try {
    const html = exportPageToHtml(
      pageWithStructure,
      documentWithTheme,
      true,
      basePath,
      layoutFromPage ? { layoutFromPage } : undefined,
    );

    if (!html || !html.trim()) {
      return null;
    }

    return html;
  } catch (err) {
    logger.error("Error generating HTML:", err);
    return null;
  }
}
