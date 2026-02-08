/**
 * Converte documento no formato shared (templates) para o formato do engine.
 * Shared: meta, theme (SimpleThemeTokens), structure na raiz.
 * Engine: schemaVersion, theme (ThemeTokens), pages[].structure.
 */

import type { SiteDocument as EngineDocument } from "../engine/schema/siteDocument";
import type { ThemeTokens } from "../engine/schema/themeTokens";
import type { SiteDocument as SharedDocument } from "../shared/schema";

/**
 * Converte um documento no formato shared (usado nos templates em shared/templates)
 * para o formato do engine (usado pelo LandingPageEditor e Preview).
 *
 * Cria apenas a página "home" com a estrutura do template.
 * Páginas adicionais podem ser criadas pelo usuário no editor (botão "+ Nova Página")
 * ou por plugins ativados (ex: Blog cria páginas "Blog" e "Post").
 */
export function sharedTemplateToEngineDocument(
  shared: SharedDocument,
): EngineDocument {
  const theme = mapSharedThemeToEngine(shared.theme);
  const structure = shared.structure ? [...shared.structure] : [];

  const pages: EngineDocument["pages"] = [
    {
      id: "home",
      name: shared.meta?.title || "Home",
      slug: "home",
      structure: structure as EngineDocument["pages"][0]["structure"],
    },
  ];

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
