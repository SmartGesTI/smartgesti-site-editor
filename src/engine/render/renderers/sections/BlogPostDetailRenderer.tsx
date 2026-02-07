/**
 * BlogPostDetail Renderer
 * Renderiza conteudo completo de um post de blog (pagina blog/:slug)
 */

import React from "react";

export function renderBlogPostDetail(block: any): React.ReactNode {
  const {
    title,
    content,
    featuredImage,
    date,
    category,
    authorName,
    authorAvatar,
    authorBio,
    readingTime,
    tags = [],
    showFeaturedImage = true,
    showAuthor = true,
    showDate = true,
    showTags = true,
    showReadingTime = true,
    contentMaxWidth = "720px",
  } = block.props;

  return (
    <article
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      {/* Featured image — full width banner */}
      {showFeaturedImage && featuredImage && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto 2.5rem auto",
            borderRadius: "var(--sg-card-radius)",
            overflow: "hidden",
          }}
        >
          <img
            src={featuredImage}
            alt={title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "480px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Content area */}
      <div
        style={{
          maxWidth: contentMaxWidth,
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {/* Post header: category, date, reading time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          {category && (
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--sg-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {category}
            </span>
          )}
          {category && ((showDate && date) || (showReadingTime && readingTime)) && (
            <span style={{ color: "var(--sg-muted-text)", fontSize: "0.75rem" }}>
              {"\u00B7"}
            </span>
          )}
          {showDate && date && (
            <span
              style={{
                color: "var(--sg-muted-text)",
                fontSize: "0.875rem",
              }}
            >
              {date}
            </span>
          )}
          {showReadingTime && readingTime && (
            <span
              style={{
                color: "var(--sg-muted-text)",
                fontSize: "0.875rem",
              }}
            >
              {readingTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}
        >
          {title}
        </h1>

        {/* Content body (rendered HTML) */}
        <div
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "var(--sg-text)",
          }}
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--sg-border, #e5e7eb)",
            }}
          >
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: "var(--sg-surface)",
                  color: "var(--sg-muted-text)",
                  borderRadius: "9999px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author card */}
        {showAuthor && authorName && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: showTags && tags.length > 0
                ? undefined
                : "1px solid var(--sg-border, #e5e7eb)",
            }}
          >
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
                {authorName}
              </div>
              {authorBio && (
                <p
                  style={{
                    color: "var(--sg-muted-text)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {authorBio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
