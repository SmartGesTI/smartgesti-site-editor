/**
 * CTA Renderer
 * Renderiza call-to-action com título, descrição e botões
 */

import React from "react";

export function renderCta(block: any): React.ReactNode {
  const {
    title,
    description,
    primaryButton,
    secondaryButton,
    variant = "centered",
    bg,
  } = block.props;

  const isGradient = variant === "gradient";

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: isGradient
          ? "var(--sg-primary)"
          : bg || "var(--sg-surface)",
        background: isGradient
          ? "linear-gradient(135deg, var(--sg-primary), var(--sg-accent))"
          : undefined,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        <div data-block-group="Conteúdo">
        <h2
          style={{
            fontSize: "var(--sg-heading-h2)",
            marginBottom: "1rem",
            color: isGradient ? "#fff" : "var(--sg-text)",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2rem",
              color: isGradient
                ? "rgba(255,255,255,0.9)"
                : "var(--sg-muted-text)",
            }}
          >
            {description}
          </p>
        )}
        </div>
        <div data-block-group="Botoes" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {primaryButton && (
            <a
              href={primaryButton.href || "#"}
              style={{
                padding: "var(--sg-button-padding-lg)",
                backgroundColor: isGradient ? "#fff" : "var(--sg-primary)",
                color: isGradient
                  ? "var(--sg-primary)"
                  : "var(--sg-primary-text)",
                borderRadius: "var(--sg-button-radius)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {primaryButton.text}
            </a>
          )}
          {secondaryButton && (
            <a
              href={secondaryButton.href || "#"}
              style={{
                padding: "var(--sg-button-padding-lg)",
                backgroundColor: "transparent",
                color: isGradient ? "#fff" : "var(--sg-primary)",
                border: `1px solid ${isGradient ? "#fff" : "var(--sg-primary)"}`,
                borderRadius: "var(--sg-button-radius)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {secondaryButton.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
