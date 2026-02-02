/**
 * Stats Renderer
 * Renderiza seção de estatísticas com grid de números
 */

import React from "react";

export function renderStats(block: any): React.ReactNode {
  const { title, subtitle, items = [] } = block.props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-surface)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && (
              <h2
                style={{
                  fontSize: "var(--sg-heading-h2)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{ color: "var(--sg-muted-text)", fontSize: "1.125rem" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${items.length}, 1fr)`,
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {items.map((item: any, index: number) => (
            <div key={index}>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "var(--sg-primary)",
                }}
              >
                {item.prefix}
                {item.value}
                {item.suffix}
              </div>
              <div style={{ color: "var(--sg-muted-text)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
