/**
 * BlogCategoryFilter Renderer
 * Card widget com filtro de categorias — 3 variantes: chips, buttons, list
 * Background: var(--sg-surface) para contraste com layout
 * Hover effects nos links de categoria
 */

import React from "react";
import { resolveWidgetShadow } from "../../../shared/widgetStyles";
import { generateLinkHoverStyles } from "../../../shared/hoverEffects";

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
    borderRadius = "0.75rem",
    shadow = "none",
    linkColor: linkColorProp,
    linkHoverColor: linkHoverColorProp,
    linkHoverEffect: linkHoverEffectProp,
    linkHoverIntensity: linkHoverIntensityProp,
  } = block.props;

  const linkColor = linkColorProp || "";
  const linkHoverColor = linkHoverColorProp || "";
  const linkHoverEffect = linkHoverEffectProp || "background";
  const linkHoverIntensity = linkHoverIntensityProp ?? 50;

  const widgetId = `widget-cat-${block.id}`;
  const boxShadow = resolveWidgetShadow(shadow);

  const buildHref = (slug?: string) => {
    if (!slug) return filterUrl;
    return `${filterUrl}?categoria=${slug}`;
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--sg-surface, var(--sg-bg))",
    border: "1px solid var(--sg-border, #e5e7eb)",
    borderRadius,
    boxShadow: boxShadow !== "none" ? boxShadow : undefined,
    overflow: "hidden",
  };

  // Hover CSS for interactive category links
  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-cat-chip:not(.sg-cat-active),
         #${widgetId} .sg-cat-btn:not(.sg-cat-active),
         #${widgetId} .sg-cat-list-item { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-cat-chip, #${widgetId} .sg-cat-btn, #${widgetId} .sg-cat-list-item { transition: all 0.3s ease; }`;
    const hoverRule = `
      #${widgetId} .sg-cat-chip:hover:not(.sg-cat-active),
      #${widgetId} .sg-cat-btn:hover:not(.sg-cat-active),
      #${widgetId} .sg-cat-list-item:hover { ${styles.hover}; transition: all 0.3s ease; }`;
    hoverCSS = baseRule + "\n" + hoverRule;
  } else {
    // Fallback: simple hover effects
    hoverCSS = `
      #${widgetId} .sg-cat-chip, #${widgetId} .sg-cat-btn, #${widgetId} .sg-cat-list-item { transition: all 0.2s ease; }
      #${widgetId} .sg-cat-chip:hover:not(.sg-cat-active) { opacity: 0.8; transform: translateY(-1px); }
      #${widgetId} .sg-cat-btn:hover:not(.sg-cat-active) { border-color: var(--sg-primary) !important; color: var(--sg-primary) !important; }
      #${widgetId} .sg-cat-list-item:hover { background-color: rgba(0,0,0,0.04); }
    `;
  }

  const renderTitle = () =>
    title ? (
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--sg-border, #e5e7eb)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "var(--sg-text)" }}>
          {title}
        </h3>
      </div>
    ) : null;

  // ─── Variant: chips ───
  if (variant === "chips") {
    return (
      <React.Fragment key={block.id}>
        <style>{hoverCSS}</style>
        <div id={widgetId} data-block-group="Conteúdo" style={cardStyle}>
          {renderTitle()}
          <div style={{ padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {showAll && (
              <a
                href={filterUrl}
                className={!activeCategory ? "sg-cat-active" : "sg-cat-chip"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: !activeCategory ? "var(--sg-primary)" : "var(--sg-bg)",
                  color: !activeCategory ? "var(--sg-primary-text, #fff)" : (linkColor || "var(--sg-text)"),
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
                className={activeCategory === cat.slug ? "sg-cat-active" : "sg-cat-chip"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: activeCategory === cat.slug ? "var(--sg-primary)" : "var(--sg-bg)",
                  color: activeCategory === cat.slug ? "var(--sg-primary-text, #fff)" : (linkColor || "var(--sg-text)"),
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
      </React.Fragment>
    );
  }

  // ─── Variant: buttons ───
  if (variant === "buttons") {
    const btnRadius = `calc(${borderRadius} * 0.6)`;
    return (
      <React.Fragment key={block.id}>
        <style>{hoverCSS}</style>
        <div id={widgetId} data-block-group="Conteúdo" style={cardStyle}>
          {renderTitle()}
          <div style={{ padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {showAll && (
              <a
                href={filterUrl}
                className={!activeCategory ? "sg-cat-active" : "sg-cat-btn"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 1rem",
                  borderRadius: btnRadius,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: !activeCategory ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)",
                  backgroundColor: !activeCategory ? "var(--sg-primary)" : "transparent",
                  color: !activeCategory ? "var(--sg-primary-text, #fff)" : (linkColor || "var(--sg-text)"),
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
                className={activeCategory === cat.slug ? "sg-cat-active" : "sg-cat-btn"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 1rem",
                  borderRadius: btnRadius,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: activeCategory === cat.slug ? "var(--sg-primary)" : "var(--sg-border, #e5e7eb)",
                  backgroundColor: activeCategory === cat.slug ? "var(--sg-primary)" : "transparent",
                  color: activeCategory === cat.slug ? "var(--sg-primary-text, #fff)" : (linkColor || "var(--sg-text)"),
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
      </React.Fragment>
    );
  }

  // ─── Variant: list ───
  return (
    <React.Fragment key={block.id}>
      <style>{hoverCSS}</style>
      <div id={widgetId} data-block-group="Conteúdo" style={cardStyle}>
        {renderTitle()}
        <div style={{ padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          {showAll && (
            <a
              href={filterUrl}
              className="sg-cat-list-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                borderRadius: `calc(${borderRadius} * 0.5)`,
                fontSize: "0.875rem",
                fontWeight: !activeCategory ? 600 : 400,
                textDecoration: "none",
                backgroundColor: !activeCategory ? "var(--sg-bg)" : "transparent",
                color: !activeCategory ? "var(--sg-primary)" : (linkColor || "var(--sg-text)"),
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
              className="sg-cat-list-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                borderRadius: `calc(${borderRadius} * 0.5)`,
                fontSize: "0.875rem",
                fontWeight: activeCategory === cat.slug ? 600 : 400,
                textDecoration: "none",
                backgroundColor: activeCategory === cat.slug ? "var(--sg-bg)" : "transparent",
                color: activeCategory === cat.slug ? "var(--sg-primary)" : (linkColor || "var(--sg-text)"),
                transition: "all 0.2s ease",
              }}
            >
              <span>{cat.name}</span>
              {showCount && cat.count != null && (
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--sg-muted-text)",
                  backgroundColor: "var(--sg-bg)",
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
    </React.Fragment>
  );
}
