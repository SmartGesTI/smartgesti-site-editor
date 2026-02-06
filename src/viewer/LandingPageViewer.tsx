/**
 * Landing Page Viewer
 * Visualização pública da landing page.
 * Usa o mesmo mecanismo do Preview (editor): exportPageToHtml + iframe srcdoc.
 */

import { useState, useEffect } from "react";
import {
  SiteDocument,
  exportPageToHtml,
  createEmptySiteDocument,
  defaultThemeTokens,
} from "../engine";

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
}

export function LandingPageViewer({
  siteId,
  apiBaseUrl,
  projectId,
  pageSlug,
  schoolSlug,
  schoolData: _schoolData, // reservado para header/navbar dinâmico (logo, nome da escola)
}: LandingPageViewerProps) {
  const [document, setDocument] = useState<SiteDocument | null>(null);
  const [publishedHtml, setPublishedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLandingPage();
  }, [siteId]);

  const loadLandingPage = async () => {
    setIsLoading(true);
    setError(null);

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

  // Resolver página por slug ou id; fallback para home
  const page =
    (pageSlug
      ? pages.find((p) => p.slug === pageSlug || p.id === pageSlug)
      : null) ??
    pages.find((p) => p.id === "home") ??
    pages[0];

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

  let html: string;
  try {
    html = exportPageToHtml(
      pageWithStructure,
      documentWithTheme,
      true,
      basePath,
      layoutFromPage ? { layoutFromPage } : undefined,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao gerar HTML do site";
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
            Erro ao renderizar o site
          </p>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>{message}</p>
        </div>
      </div>
    );
  }

  if (!html || !html.trim()) {
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
