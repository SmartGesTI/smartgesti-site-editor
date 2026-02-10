/**
 * BlogPostGrid Renderer
 * Renderiza grid de cards de blog posts com título, subtítulo e link "ver todos"
 */

import React from "react";
import { renderBlogPostCard } from "./BlogPostCardRenderer";

/**
 * Builds a pagination URL appending ?pagina=N (or &pagina=N if URL has params).
 * Page 1 returns base URL without param (cleaner URL).
 */
function buildPageUrl(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}pagina=${page}`;
}

/**
 * Generates an array of page numbers to display, with -1 for ellipsis.
 * Shows all pages if <= 7, otherwise uses ellipsis pattern.
 */
function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: number[] = [1];
  if (current > 3) pages.push(-1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(-1);
  if (pages[pages.length - 1] !== total) pages.push(total);
  return pages;
}

export function renderBlogPostGrid(block: any): React.ReactNode {
  const {
    title,
    subtitle,
    columns = 3,
    cards = [],
    variant = "default",
    showViewAll = false,
    viewAllText = "Ver todos",
    viewAllHref = "#",
    currentPage = 1,
    totalPages = 1,
    paginationBaseUrl = "#",
  } = block.props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        {(title || subtitle) && (
          <div data-block-group="Cabeçalho" style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && (
              <h2
                style={{
                  fontSize: "var(--sg-heading-h2)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{ color: "var(--sg-muted-text)", fontSize: "1.125rem" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {cards.length > 0 ? (
          <div
            data-block-group="Layout"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: "2rem",
            }}
          >
            {cards.map((card: any, index: number) =>
              renderBlogPostCard({
                id: `${block.id}-card-${index}`,
                props: {
                  ...card,
                  variant:
                    variant === "featured" && index === 0
                      ? "horizontal"
                      : variant === "minimal"
                        ? "minimal"
                        : "default",
                },
              }),
            )}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "var(--sg-muted-text)",
              border: "2px dashed var(--sg-border, #e5e7eb)",
              borderRadius: "var(--sg-card-radius, 0.5rem)",
            }}
          >
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              Nenhum post encontrado
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Os posts aparecerão aqui quando forem publicados.
            </p>
          </div>
        )}

        {/* View All link */}
        {showViewAll && (
          <div data-block-group="Rodapé" style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a
              href={viewAllHref}
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                color: "var(--sg-primary)",
                border: "1px solid var(--sg-primary)",
                borderRadius: "var(--sg-button-radius, 0.5rem)",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.9375rem",
              }}
            >
              {viewAllText}
            </a>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            data-block-group="Paginação"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.375rem",
              marginTop: "2.5rem",
            }}
          >
            {/* Previous */}
            {currentPage > 1 ? (
              <a
                href={buildPageUrl(paginationBaseUrl, currentPage - 1)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  border: "1px solid var(--sg-border, #e5e7eb)",
                  textDecoration: "none",
                  color: "var(--sg-text)",
                  fontSize: "0.875rem",
                }}
              >
                ‹
              </a>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  border: "1px solid var(--sg-border, #e5e7eb)",
                  color: "var(--sg-muted-text)",
                  fontSize: "0.875rem",
                  opacity: 0.4,
                }}
              >
                ‹
              </span>
            )}

            {/* Page numbers */}
            {getPageNumbers(currentPage, totalPages).map((page, idx) =>
              page === -1 ? (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.25rem",
                    height: "2.25rem",
                    color: "var(--sg-muted-text)",
                    fontSize: "0.875rem",
                  }}
                >
                  …
                </span>
              ) : (
                <a
                  key={page}
                  href={buildPageUrl(paginationBaseUrl, page)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "var(--sg-card-radius, 0.5rem)",
                    border: `1px solid ${page === currentPage ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)"}`,
                    backgroundColor:
                      page === currentPage ? "var(--sg-primary)" : "transparent",
                    color:
                      page === currentPage
                        ? "var(--sg-primary-text, #fff)"
                        : "var(--sg-text)",
                    textDecoration: "none",
                    fontWeight: page === currentPage ? 600 : 400,
                    fontSize: "0.875rem",
                  }}
                >
                  {page}
                </a>
              ),
            )}

            {/* Next */}
            {currentPage < totalPages ? (
              <a
                href={buildPageUrl(paginationBaseUrl, currentPage + 1)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  border: "1px solid var(--sg-border, #e5e7eb)",
                  textDecoration: "none",
                  color: "var(--sg-text)",
                  fontSize: "0.875rem",
                }}
              >
                ›
              </a>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  border: "1px solid var(--sg-border, #e5e7eb)",
                  color: "var(--sg-muted-text)",
                  fontSize: "0.875rem",
                  opacity: 0.4,
                }}
              >
                ›
              </span>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
