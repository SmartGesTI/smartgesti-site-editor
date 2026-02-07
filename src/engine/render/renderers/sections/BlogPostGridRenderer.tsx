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
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
        <div
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

        {/* View All link */}
        {showViewAll && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
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
