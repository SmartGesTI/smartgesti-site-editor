/**
 * BlogCategoryFilter Renderer
 * Renderiza filtro de categorias com 3 variantes: chips, buttons, list
 */

import React from "react";

export function renderBlogCategoryFilter(block: any): React.ReactNode {
  const {
    title,
    categories = [],
    variant = "chips",
    showCount = true,
    showAll = true,
    allLabel = "Todas",
    activeCategory,
    filterUrl = "#",
  } = block.props;

  const buildHref = (slug?: string) => {
    if (!slug) return filterUrl;
    return `${filterUrl}?categoria=${slug}`;
  };

  // ─── Variant: chips ───
  if (variant === "chips") {
    return (
      <div
        key={block.id}
        data-block-group="Conteúdo"
        style={{
          padding: "1.5rem 0",
          backgroundColor: "var(--sg-bg)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {title && (
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--sg-text)" }}>
              {title}
            </h3>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {showAll && (
              <a
                href={filterUrl}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: !activeCategory ? "var(--sg-primary)" : "var(--sg-surface, #f3f4f6)",
                  color: !activeCategory ? "var(--sg-primary-text, #fff)" : "var(--sg-text)",
                  transition: "all 0.2s ease",
                }}
              >
                {allLabel}
              </a>
            )}
            {categories.map((cat: any, i: number) => (
              <a
                key={i}
                href={buildHref(cat.slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: activeCategory === cat.slug ? "var(--sg-primary)" : "var(--sg-surface, #f3f4f6)",
                  color: activeCategory === cat.slug ? "var(--sg-primary-text, #fff)" : "var(--sg-text)",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.name}
                {showCount && cat.count != null && (
                  <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({cat.count})</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Variant: buttons ───
  if (variant === "buttons") {
    return (
      <div
        key={block.id}
        data-block-group="Conteúdo"
        style={{
          padding: "1.5rem 0",
          backgroundColor: "var(--sg-bg)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {title && (
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--sg-text)" }}>
              {title}
            </h3>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {showAll && (
              <a
                href={filterUrl}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: !activeCategory ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)",
                  backgroundColor: !activeCategory ? "var(--sg-primary)" : "transparent",
                  color: !activeCategory ? "var(--sg-primary-text, #fff)" : "var(--sg-text)",
                  transition: "all 0.2s ease",
                }}
              >
                {allLabel}
              </a>
            )}
            {categories.map((cat: any, i: number) => (
              <a
                key={i}
                href={buildHref(cat.slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: activeCategory === cat.slug ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)",
                  backgroundColor: activeCategory === cat.slug ? "var(--sg-primary)" : "transparent",
                  color: activeCategory === cat.slug ? "var(--sg-primary-text, #fff)" : "var(--sg-text)",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.name}
                {showCount && cat.count != null && (
                  <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({cat.count})</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Variant: list ───
  return (
    <div
      key={block.id}
      data-block-group="Conteúdo"
      style={{
        padding: "1.5rem 0",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {title && (
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--sg-text)" }}>
            {title}
          </h3>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {showAll && (
            <a
              href={filterUrl}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                borderRadius: "var(--sg-card-radius, 0.5rem)",
                fontSize: "0.875rem",
                fontWeight: !activeCategory ? 600 : 400,
                textDecoration: "none",
                backgroundColor: !activeCategory ? "var(--sg-surface, #f3f4f6)" : "transparent",
                color: !activeCategory ? "var(--sg-primary)" : "var(--sg-text)",
                transition: "all 0.2s ease",
              }}
            >
              {allLabel}
            </a>
          )}
          {categories.map((cat: any, i: number) => (
            <a
              key={i}
              href={buildHref(cat.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                borderRadius: "var(--sg-card-radius, 0.5rem)",
                fontSize: "0.875rem",
                fontWeight: activeCategory === cat.slug ? 600 : 400,
                textDecoration: "none",
                backgroundColor: activeCategory === cat.slug ? "var(--sg-surface, #f3f4f6)" : "transparent",
                color: activeCategory === cat.slug ? "var(--sg-primary)" : "var(--sg-text)",
                transition: "all 0.2s ease",
              }}
            >
              <span>{cat.name}</span>
              {showCount && cat.count != null && (
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--sg-muted-text)",
                  backgroundColor: "var(--sg-surface, #f3f4f6)",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                }}>
                  {cat.count}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
