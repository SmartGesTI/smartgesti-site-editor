/**
 * BlogPostDetail Renderer
 * Renderiza conteudo completo de um post de blog (pagina blog/:slug)
 * Dados do autor sao dinamicos (vem do banco) — aqui usamos placeholders.
 */

import React from "react";

function AuthorPlaceholderAvatar({ size }: { size: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--sg-primary, #6366f1) 0%, #818cf8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#fff",
        fontSize: `calc(${size} * 0.45)`,
        fontWeight: 700,
      }}
    >
      A
    </div>
  );
}

export function renderBlogPostDetail(block: any): React.ReactNode {
  const {
    title,
    content,
    featuredImage,
    date,
    category,
    readingTime,
    tags = [],
    showFeaturedImage = true,
    showAuthor = true,
    authorVariant = "inline",
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

        {/* Author — dynamic placeholder (data comes from DB at runtime) */}
        {showAuthor && (
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop:
                showTags && tags.length > 0
                  ? undefined
                  : "1px solid var(--sg-border, #e5e7eb)",
            }}
          >
            {authorVariant === "card" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1.25rem",
                  borderRadius: "var(--sg-card-radius, 0.75rem)",
                  backgroundColor: "var(--sg-surface, #f9fafb)",
                }}
              >
                <AuthorPlaceholderAvatar size="3.5rem" />
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sg-muted-text)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.125rem",
                    }}
                  >
                    Escrito por
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                    Nome do Autor
                  </div>
                  <p
                    style={{
                      color: "var(--sg-muted-text)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.5,
                      margin: "0.25rem 0 0",
                    }}
                  >
                    Bio do autor carregada do banco de dados.
                  </p>
                </div>
              </div>
            )}

            {authorVariant === "inline" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <AuthorPlaceholderAvatar size="2.5rem" />
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sg-muted-text)",
                    }}
                  >
                    Escrito por
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                    Nome do Autor
                  </div>
                </div>
              </div>
            )}

            {authorVariant === "minimal" && (
              <p
                style={{
                  color: "var(--sg-muted-text)",
                  fontSize: "0.9375rem",
                }}
              >
                Escrito por{" "}
                <span style={{ fontWeight: 600, color: "var(--sg-text)" }}>
                  Nome do Autor
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
