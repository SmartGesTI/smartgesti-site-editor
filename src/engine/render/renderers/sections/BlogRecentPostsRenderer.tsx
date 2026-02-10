/**
 * BlogRecentPosts Renderer
 * Widget de sidebar com lista dos posts mais recentes
 */

import React from "react";

interface RecentPost {
  title: string;
  slug: string;
  date?: string;
  image?: string;
  category?: string;
}

export function renderBlogRecentPosts(block: any): React.ReactNode {
  const {
    title = "Posts Recentes",
    posts = [],
    showThumbnail = true,
    showDate = true,
    showCategory = false,
  } = block.props;

  return (
    <div
      key={block.id}
      data-block-group="Conteúdo"
      style={{
        backgroundColor: "var(--sg-bg)",
        borderRadius: "var(--sg-card-radius, 0.75rem)",
        border: "1px solid var(--sg-border, #e5e7eb)",
        overflow: "hidden",
      }}
    >
      {title && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--sg-border, #e5e7eb)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--sg-text)",
            }}
          >
            {title}
          </h3>
        </div>
      )}

      <div style={{ padding: "0.5rem 0" }}>
        {posts.length === 0 ? (
          <p
            style={{
              padding: "1.5rem 1.25rem",
              color: "var(--sg-muted-text)",
              fontSize: "0.875rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            Nenhum post recente
          </p>
        ) : (
          posts.map((post: RecentPost, index: number) => (
            <a
              key={index}
              href={`/site/p/blog/${post.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1.25rem",
                textDecoration: "none",
                color: "inherit",
                transition: "background-color 0.15s",
              }}
            >
              {showThumbnail && post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "var(--sg-card-radius, 0.5rem)",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--sg-text)",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {showDate && post.date && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--sg-muted-text)",
                      }}
                    >
                      {post.date}
                    </span>
                  )}
                  {showCategory && post.category && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--sg-primary)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
