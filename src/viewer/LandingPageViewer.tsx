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

import { useState, useEffect, useRef, useCallback } from "react";
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
  /**
   * Callback for internal navigation (link clicks inside iframe).
   * Receives the href from clicked links. Consumer should use router navigation.
   */
  onNavigate?: (href: string) => void;
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
  onNavigate,
}: LandingPageViewerProps) {
  const [document, setDocument] = useState<SiteDocument | null>(null);
  const [publishedHtml, setPublishedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydratedHtml, setHydratedHtml] = useState<string | null>(null);

  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  // Inject click interceptor into iframe HTML so link clicks propagate to parent
  const injectClickInterceptor = useCallback((html: string): string => {
    const script = `<script>
(function() {
  document.addEventListener('click', function(e) {
    var target = e.target;
    var anchor = target;
    while (anchor && anchor.tagName !== 'A') {
      anchor = anchor.parentElement;
    }
    if (anchor && anchor.tagName === 'A') {
      var href = anchor.getAttribute('href') || '';
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: 'viewer-navigate', href: href }, '*');
        return;
      }
    }
  }, true);
})();
</script>`;
    if (html.includes("</body>")) {
      return html.replace("</body>", `${script}</body>`);
    }
    return html + script;
  }, []);

  // Listen for navigation messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "viewer-navigate" && event.data?.href) {
        if (onNavigateRef.current) {
          onNavigateRef.current(event.data.href);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Load site document from API. Uses stale flag to prevent
  // React Strict Mode double-mount from causing duplicate state updates.
  useEffect(() => {
    let stale = false;

    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/sites/${siteId}?projectId=${projectId}`,
        );
        if (!response.ok) {
          throw new Error("Landing page não encontrada");
        }

        const data = await response.json();
        if (stale) return;

        if (data.template) {
          const schemaVersion = data.template.schemaVersion;
          const hasPages =
            data.template.pages && Array.isArray(data.template.pages);
          const isV2 =
            schemaVersion === 2 || schemaVersion === "2" || hasPages;

          if (isV2) {
            const template = data.template as SiteDocument;
            if (!Array.isArray(template.pages)) {
              template.pages = [];
            }
            if (
              template.schemaVersion !== 2 &&
              template.schemaVersion !== "2"
            ) {
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

        if (data.publishedHtml && hasBodyContent(data.publishedHtml)) {
          setPublishedHtml(data.publishedHtml);
        } else {
          setPublishedHtml(null);
        }

        if (!data.template && !data.publishedHtml) {
          throw new Error("Template não encontrado");
        }
      } catch (err) {
        if (!stale) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar landing page",
          );
        }
      } finally {
        if (!stale) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      stale = true;
    };
  }, [siteId, apiBaseUrl, projectId]);

  // Hydrate pages when document + contentProviders are available.
  // Supports both: pages with explicit dataSource AND pages with blogPostGrid blocks.
  // Does NOT reset hydratedHtml at the start to avoid flash of mock data.
  // Only clears it when navigating to a page that doesn't need hydration.
  useEffect(() => {
    if (!document) {
      setHydratedHtml(null);
      return;
    }

    let stale = false;

    const pages = Array.isArray(document.pages) ? document.pages : [];
    const providerMap = buildProviderMap(contentProviders);

    if (providerMap.size === 0) {
      setHydratedHtml(null);
      return;
    }

    // Resolve the current page
    let resolvedPage: SitePage | undefined;
    let urlParams: Record<string, string> = {};

    if (pageSlug) {
      const exactPage = pages.find(
        (p) => p.slug === pageSlug || p.id === pageSlug,
      );
      if (exactPage) {
        resolvedPage = exactPage;
      } else {
        const match = matchDynamicPage(pages, pageSlug);
        if (match) {
          resolvedPage = match.page;
          urlParams = match.params;
        }
      }
    } else {
      resolvedPage = pages.find((p) => p.id === "home") ?? pages[0];
    }

    if (!resolvedPage) {
      setHydratedHtml(null);
      return;
    }

    // Check if page needs hydration:
    // 1. Has explicit dataSource (blog page, blog-post page)
    // 2. Has blogPostGrid blocks but no dataSource (home page with blog widget)
    const hasDataSource = !!resolvedPage.dataSource;
    const hasBlogBlocks = resolvedPage.structure?.some(
      (b) => b.type === "blogPostGrid",
    );

    if (!hasDataSource && !hasBlogBlocks) {
      setHydratedHtml(null);
      return;
    }

    // For pages without dataSource but with blog blocks, create synthetic dataSource
    let pageToHydrate = resolvedPage;
    if (!hasDataSource && hasBlogBlocks) {
      pageToHydrate = {
        ...resolvedPage,
        dataSource: { mode: "list" as const, provider: "blog-posts" },
      };
    }

    hydratePageWithContent(pageToHydrate, providerMap, urlParams)
      .then((hydratedPage) => {
        if (stale) return;

        // useCache: false — hydrated page has different block props than the
        // cached static render. Without this, exportPageToHtml returns the
        // cached static HTML (same page.id + docHash = same cache key).
        const html = renderPageToHtml(
          hydratedPage,
          document,
          schoolSlug,
          pages,
          false,
        );

        setHydratedHtml(html ?? null);
      })
      .catch((err) => {
        if (!stale) {
          logger.error("Error in content hydration:", err);
          setHydratedHtml(null);
        }
      });

    return () => {
      stale = true;
    };
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
        srcDoc={injectClickInterceptor(publishedHtml)}
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
        srcDoc={injectClickInterceptor(hydratedHtml)}
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
      srcDoc={injectClickInterceptor(html)}
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
 *
 * @param useCache - Pass false for hydrated pages to bypass the export cache.
 *   The cache key uses page.id + docHash, which is identical for static and
 *   hydrated renders of the same page. Hydrated pages have different block
 *   props (real data), so they must skip the cache to avoid getting stale HTML.
 */
function renderPageToHtml(
  page: SitePage,
  document: SiteDocument,
  schoolSlug?: string,
  allPages?: SitePage[],
  useCache: boolean = true,
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
      useCache,
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
