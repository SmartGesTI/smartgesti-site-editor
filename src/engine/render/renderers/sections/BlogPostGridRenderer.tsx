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

/**
 * Renders the magazine hero card (first post) with image overlay.
 */
function renderMagazineHero(card: any, blockId: string): React.ReactNode {
  return (
    <a
      key={`${blockId}-hero`}
      href={card.linkHref || "#"}
      data-block-group="Post em Destaque"
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        minHeight: "420px",
        borderRadius: "var(--sg-card-radius, 0.75rem)",
        overflow: "hidden",
        marginBottom: "2.5rem",
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#1a1a2e",
      }}
    >
      {card.image && (
        <img
          src={card.image}
          alt={card.title || ""}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2rem 2.5rem",
        }}
      >
        {card.category && (
          <span
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              backgroundColor: "var(--sg-primary)",
              color: "var(--sg-primary-text, #fff)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderRadius: "0.25rem",
              marginBottom: "0.75rem",
            }}
          >
            {card.category}
          </span>
        )}
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "0.5rem",
            color: "#fff",
          }}
        >
          {card.title}
        </h2>
        {card.excerpt && (
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
              maxWidth: "600px",
            }}
          >
            {card.excerpt}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {card.authorAvatar && (
            <img
              src={card.authorAvatar}
              alt={card.authorName || ""}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          {card.authorName && (
            <span style={{ fontWeight: 500 }}>{card.authorName}</span>
          )}
          {card.authorName && card.date && <span>{"\u00B7"}</span>}
          {card.date && <span>{card.date}</span>}
        </div>
      </div>
    </a>
  );
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
    // Card customization
    cardBorderRadius = "0.75rem",
    cardShadow = "md",
    cardHoverEffect = "lift",
    cardBorder = true,
    // Link customization
    linkStyle = "link",
    linkColor = "#2563eb",
    linkHoverColor = "#1d4ed8",
    // Image customization
    imageHoverEffect = "zoom",
    imageBorderRadius = "0.75rem",
  } = block.props;

  const isMagazine = variant === "magazine";
  const heroCard = isMagazine && cards.length > 0 ? cards[0] : null;
  const gridCards = isMagazine ? cards.slice(1) : cards;

  return (
    <section
      key={block.id}
      style={{
        padding: isMagazine ? "0" : "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={isMagazine ? {} : { maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Magazine Hero */}
        {heroCard && renderMagazineHero(heroCard, block.id)}

        {/* Header */}
        {isMagazine ? (
          gridCards.length > 0 && (
            <div data-block-group="Cabeçalho" style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--sg-text)",
                  marginBottom: "0.75rem",
                }}
              >
                Posts Recentes
              </h3>
              <div
                style={{
                  height: "2px",
                  backgroundColor: "var(--sg-primary)",
                  width: "3rem",
                }}
              />
            </div>
          )
        ) : (
          (title || subtitle) && (
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
          )
        )}

        {/* Grid */}
        {gridCards.length > 0 ? (
          <div
            data-block-group="Layout"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: "2rem",
            }}
          >
            {gridCards.map((card: any, index: number) =>
              renderBlogPostCard({
                id: `${block.id}-card-${isMagazine ? index + 1 : index}`,
                props: {
                  ...card,
                  variant:
                    variant === "featured" && index === 0
                      ? "horizontal"
                      : variant === "minimal"
                        ? "minimal"
                        : "default",
                  // Pass customization props
                  cardBorderRadius,
                  cardShadow,
                  cardHoverEffect,
                  cardBorder,
                  linkStyle,
                  linkColor,
                  linkHoverColor,
                  imageHoverEffect,
                  imageBorderRadius,
                },
              }),
            )}
          </div>
        ) : !heroCard ? (
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
        ) : null}

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
