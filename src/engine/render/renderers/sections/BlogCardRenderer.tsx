/**
 * BlogCard Renderer
 * Card de post de blog (não-plugin)
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderBlogCard(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const {
    title,
    excerpt,
    image,
    author,
    date,
    category,
    readTime,
    href,
  } = props;

  return (
    <article
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "var(--sg-card-radius)",
        overflow: "hidden",
        boxShadow: "var(--sg-card-shadow)",
      }}
    >
      {image && (
        <div
          style={{
            height: "200px",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div style={{ padding: "1.5rem" }}>
        {category && (
          <span
            style={{
              color: "var(--sg-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {category}
          </span>
        )}
        <h3 style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}>{title}</h3>
        <p style={{ color: "var(--sg-muted-text)", marginBottom: "1rem" }}>
          {excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            color: "var(--sg-muted-text)",
          }}
        >
          <span>{author}</span>
          <span>{date}</span>
          {readTime && <span>{readTime} min read</span>}
        </div>
        {href && (
          <a
            href={href}
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "var(--sg-primary)",
              fontWeight: 500,
            }}
          >
            Ler mais →
          </a>
        )}
      </div>
    </article>
  );
}
