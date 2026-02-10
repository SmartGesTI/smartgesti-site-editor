/**
 * BlogTagCloud Renderer
 * Widget de sidebar com nuvem de tags do blog
 */

import React from "react";

interface TagItem {
  name: string;
  count: number;
}

export function renderBlogTagCloud(block: any): React.ReactNode {
  const {
    title = "Tags",
    tags = [],
    variant = "badges",
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

      <div style={{ padding: "1rem 1.25rem" }}>
        {tags.length === 0 ? (
          <p
            style={{
              color: "var(--sg-muted-text)",
              fontSize: "0.875rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            Nenhuma tag encontrada
          </p>
        ) : variant === "badges" ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {tags.map((tag: TagItem, index: number) => (
              <span
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  backgroundColor: "var(--sg-surface, #f3f4f6)",
                  color: "var(--sg-text)",
                }}
              >
                {tag.name}
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--sg-muted-text)",
                    opacity: 0.7,
                  }}
                >
                  ({tag.count})
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {tags.map((tag: TagItem, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--sg-card-radius, 0.5rem)",
                  fontSize: "0.875rem",
                  color: "var(--sg-text)",
                }}
              >
                <span>{tag.name}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--sg-muted-text)",
                    backgroundColor: "var(--sg-surface, #f3f4f6)",
                    padding: "0.125rem 0.5rem",
                    borderRadius: "9999px",
                  }}
                >
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
