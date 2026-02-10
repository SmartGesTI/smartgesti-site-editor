/**
 * BlogSearchBar Renderer
 * Renderiza barra de busca com 3 variantes: simple, expanded, with-filters
 */

import React from "react";

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
  } = block.props;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    paddingLeft: showIcon ? "2.5rem" : "0.75rem",
    paddingRight: "1rem",
    paddingTop: variant === "expanded" ? "0.875rem" : "0.625rem",
    paddingBottom: variant === "expanded" ? "0.875rem" : "0.625rem",
    fontSize: variant === "expanded" ? "1.0625rem" : "0.875rem",
    border: variant === "expanded" ? "2px solid var(--sg-border, #e5e7eb)" : "1px solid var(--sg-border, #e5e7eb)",
    borderRadius: "var(--sg-card-radius, 0.5rem)",
    backgroundColor: "var(--sg-bg)",
    color: "var(--sg-text)",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    border: "1px solid var(--sg-border, #e5e7eb)",
    borderRadius: "var(--sg-card-radius, 0.5rem)",
    backgroundColor: "var(--sg-bg)",
    color: "var(--sg-text)",
  };

  if (variant === "expanded") {
    return (
      <form
        key={block.id}
        data-block-group="Conteúdo"
        action={searchUrl}
        method="get"
        style={{
          padding: "2rem 0",
          backgroundColor: "var(--sg-bg)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            {showIcon && <SearchIcon />}
            <input type="search" name="busca" placeholder={placeholder} style={inputStyle} />
          </div>
        </div>
      </form>
    );
  }

  if (variant === "with-filters") {
    return (
      <form
        key={block.id}
        data-block-group="Conteúdo"
        action={searchUrl}
        method="get"
        style={{
          padding: "1.5rem 0",
          backgroundColor: "var(--sg-bg)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            {showIcon && <SearchIcon />}
            <input type="search" name="busca" placeholder={placeholder} style={inputStyle} />
          </div>
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
        </div>
      </form>
    );
  }

  // simple variant
  return (
    <form
      key={block.id}
      data-block-group="Conteúdo"
      action={searchUrl}
      method="get"
      style={{
        padding: "1.5rem 0",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          {showIcon && <SearchIcon />}
          <input type="search" name="busca" placeholder={placeholder} style={inputStyle} />
        </div>
      </div>
    </form>
  );
}
