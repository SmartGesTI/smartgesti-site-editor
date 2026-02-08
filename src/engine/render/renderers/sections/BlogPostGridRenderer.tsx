/**
 * BlogPostGrid Renderer
 * Renderiza grid de cards de blog posts com título, subtítulo e link "ver todos"
 */

import React from "react";
import { renderBlogPostCard } from "./BlogPostCardRenderer";

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
      </div>
    </section>
  );
}
