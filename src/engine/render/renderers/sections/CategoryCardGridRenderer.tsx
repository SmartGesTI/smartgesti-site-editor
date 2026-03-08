/**
 * CategoryCardGrid Renderer
 * Grid de categorias com imagem de fundo
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderCategoryCardGrid(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { title, subtitle, columns = 4, categories = [] } = props;

  return (
    <section
      key={block.id}
      style={{ padding: "var(--sg-section-padding-md)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && <h2>{title}</h2>}
            {subtitle && <p style={{ color: "var(--sg-muted-text)" }}>{subtitle}</p>}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "1.5rem",
          }}
        >
          {(categories as unknown[]).map((category: Record<string, any>, index: number) => (
            <a
              key={index}
              href={category.href || "#"}
              style={{
                backgroundColor: "var(--sg-surface)",
                borderRadius: "var(--sg-card-radius)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {category.icon && <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{category.icon}</div>}
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{category.name}</h3>
              <p style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
                {category.count} cursos
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
