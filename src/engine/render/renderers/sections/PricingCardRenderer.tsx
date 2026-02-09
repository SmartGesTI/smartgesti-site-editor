/**
 * PricingCard Renderer
 * Renderiza card individual de pricing
 */

import React from "react";

export function renderPricingCard(block: any): React.ReactNode {
  const {
    name,
    price,
    period,
    description,
    features = [],
    buttonText,
    highlighted,
    badge,
  } = block.props;

  return (
    <div
      key={block.id}
      data-block-group="Conteúdo"
      style={{
        backgroundColor: "var(--sg-bg)",
        borderRadius: "var(--sg-card-radius, 0.75rem)",
        padding: "2rem",
        boxShadow: highlighted
          ? "var(--sg-shadow-strong)"
          : "var(--sg-card-shadow)",
        border: highlighted
          ? "2px solid var(--sg-primary)"
          : "1px solid var(--sg-border)",
        position: "relative",
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "-0.75rem",
            right: "1rem",
            backgroundColor: "var(--sg-primary)",
            color: "var(--sg-primary-text, #fff)",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
          }}
        >
          {badge}
        </span>
      )}
      <h3
        style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}
      >
        {name}
      </h3>
      {description && (
        <p style={{ color: "var(--sg-muted-text)", marginBottom: "1rem" }}>
          {description}
        </p>
      )}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "2.5rem", fontWeight: 700 }}>{price}</span>
        {period && (
          <span style={{ color: "var(--sg-muted-text)" }}>{period}</span>
        )}
      </div>
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
        {features.map((feature: string, index: number) => (
          <li
            key={index}
            style={{
              padding: "0.5rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "var(--sg-success)" }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {buttonText && (
        <button
          style={{
            width: "100%",
            padding: "var(--sg-button-padding-md)",
            backgroundColor: highlighted ? "var(--sg-primary)" : "transparent",
            color: highlighted ? "var(--sg-primary-text)" : "var(--sg-primary)",
            border: highlighted ? "none" : "1px solid var(--sg-primary)",
            borderRadius: "var(--sg-button-radius)",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
