/**
 * BlogSearchBar Renderer
 * Card widget com barra de busca — 3 variantes: simple, expanded, with-filters
 * Background: var(--sg-surface) para contraste com layout
 * Hover: focus ring no input
 */

import React from "react";
import { resolveWidgetShadow } from "../../../shared/widgetStyles";

function SearchIcon() {
  return (
    <svg
      style={{
        position: "absolute",
        left: "0.75rem",
        top: "50%",
        transform: "translateY(-50%)",
        width: "1.25rem",
        height: "1.25rem",
        color: "var(--sg-muted-text)",
      }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

export function renderBlogSearchBar(block: any): React.ReactNode {
  const {
    placeholder = "Buscar posts...",
    variant = "simple",
    showIcon = true,
    searchUrl = "#",
    filterCategories = false,
    filterTags = false,
    filterDate = false,
    borderRadius = "0.75rem",
    shadow = "none",
  } = block.props;

  const widgetId = `widget-search-${block.id}`;
  const boxShadow = resolveWidgetShadow(shadow);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--sg-surface, var(--sg-bg))",
    border: "1px solid var(--sg-border, #e5e7eb)",
    borderRadius,
    boxShadow: boxShadow !== "none" ? boxShadow : undefined,
    overflow: "hidden",
  };

  const inputRadius = `calc(${borderRadius} * 0.6)`;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    paddingLeft: showIcon ? "2.5rem" : "0.75rem",
    paddingRight: "1rem",
    paddingTop: variant === "expanded" ? "0.875rem" : "0.625rem",
    paddingBottom: variant === "expanded" ? "0.875rem" : "0.625rem",
    fontSize: variant === "expanded" ? "1.0625rem" : "0.875rem",
    border: variant === "expanded" ? "2px solid var(--sg-border, #e5e7eb)" : "1px solid var(--sg-border, #e5e7eb)",
    borderRadius: inputRadius,
    backgroundColor: "var(--sg-bg)",
    color: "var(--sg-text)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    border: "1px solid var(--sg-border, #e5e7eb)",
    borderRadius: inputRadius,
    backgroundColor: "var(--sg-bg)",
    color: "var(--sg-text)",
    transition: "border-color 0.2s",
  };

  // Focus ring CSS
  const focusCSS = `
    #${widgetId} input:focus, #${widgetId} select:focus {
      border-color: var(--sg-primary);
      box-shadow: 0 0 0 3px rgba(var(--sg-primary-rgb, 59, 130, 246), 0.15);
    }
  `;

  const renderFilters = () => (
    <>
      {filterCategories && (
        <select name="categoria" style={selectStyle}>
          <option value="">Categoria</option>
        </select>
      )}
      {filterTags && (
        <select name="tag" style={selectStyle}>
          <option value="">Tag</option>
        </select>
      )}
      {filterDate && (
        <select name="periodo" style={selectStyle}>
          <option value="">Período</option>
        </select>
      )}
    </>
  );

  if (variant === "with-filters") {
    return (
      <React.Fragment key={block.id}>
        <style>{focusCSS}</style>
        <div id={widgetId} data-block-group="Conteúdo" style={cardStyle}>
          <form action={searchUrl} method="get" style={{ padding: "1.25rem" }}>
            <div style={{ position: "relative", marginBottom: "0.75rem" }}>
              {showIcon && <SearchIcon />}
              <input type="search" name="busca" placeholder={placeholder} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {renderFilters()}
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment key={block.id}>
      <style>{focusCSS}</style>
      <div id={widgetId} data-block-group="Conteúdo" style={cardStyle}>
        <form action={searchUrl} method="get" style={{ padding: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            {showIcon && <SearchIcon />}
            <input type="search" name="busca" placeholder={placeholder} style={inputStyle} />
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
