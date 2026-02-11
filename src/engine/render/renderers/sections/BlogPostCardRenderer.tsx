/**
 * BlogPostCard Renderer
 * Renderiza card individual de post de blog
 * Variantes: default (vertical), horizontal (imagem esquerda), minimal (sem imagem)
 *
 * NOTA: Este renderer não é usado no preview do editor (que usa exportPageToHtml).
 * Mantido para compatibilidade ou uso futuro.
 */

import React from "react";

export function renderBlogPostCard(block: any): React.ReactNode {
  const {
    title,
    excerpt,
    image,
    date,
    category,
    authorName,
    authorAvatar,
    readingTime,
    linkHref,
    linkText = "Ler mais",
    variant = "default",
    showImage = true,
    showCategory = true,
    showDate = true,
    showAuthor = true,
    showReadingTime = true,
  } = block.props;

  const isHorizontal = variant === "horizontal";
  const isMinimal = variant === "minimal";
  const shouldShowImage = showImage && !isMinimal && image;

  // Image element
  const imageElement = shouldShowImage ? (
    <div
      style={{
        width: isHorizontal ? "40%" : "100%",
        height: isHorizontal ? "100%" : "200px",
        minHeight: isHorizontal ? "200px" : undefined,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: isHorizontal ? "0.75rem 0 0 0.75rem" : "0.75rem 0.75rem 0 0",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  ) : null;

  // Content element
  const contentElement = (
    <div
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Category badge */}
      {showCategory && category && (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--sg-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          {category}
        </span>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}
      >
        {linkHref ? (
          <a
            href={linkHref}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      {/* Excerpt */}
      {excerpt && (
        <p
          style={{
            color: "var(--sg-muted-text)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            flex: 1,
          }}
        >
          {excerpt}
        </p>
      )}

      {/* Meta row: author + date + reading time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "auto",
          flexWrap: "wrap",
        }}
      >
        {/* Author */}
        {showAuthor && authorName && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {authorName}
            </span>
          </div>
        )}

        {/* Separator dot */}
        {showAuthor && authorName && ((showDate && date) || (showReadingTime && readingTime)) && (
          <span style={{ color: "var(--sg-muted-text)", fontSize: "0.75rem" }}>
            {"\u00B7"}
          </span>
        )}

        {/* Date */}
        {showDate && date && (
          <span
            style={{
              color: "var(--sg-muted-text)",
              fontSize: "0.8125rem",
            }}
          >
            {date}
          </span>
        )}

        {/* Reading time */}
        {showReadingTime && readingTime && (
          <span
            style={{
              color: "var(--sg-muted-text)",
              fontSize: "0.8125rem",
            }}
          >
            {readingTime}
          </span>
        )}
      </div>

      {/* Read more link */}
      {linkHref && linkText && (
        <a
          href={linkHref}
          style={{
            color: "var(--sg-primary)",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "0.875rem",
            marginTop: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {linkText} →
        </a>
      )}
    </div>
  );

  return (
    <article
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid var(--sg-border, #e5e7eb)",
        overflow: "hidden",
        display: isHorizontal ? "flex" : "block",
      }}
    >
      {imageElement}
      {contentElement}
    </article>
  );
}
