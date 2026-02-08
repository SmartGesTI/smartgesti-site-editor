/**
 * FeatureGrid Renderer
 * Renderiza grid de features com título, subtítulo e cards
 */

import React from "react";
import { renderIcon } from "../content/IconRenderer";

export function renderFeatureGrid(block: any): React.ReactNode {
  const {
    title,
    subtitle,
    columns = 3,
    variant = "default",
    features = [],
  } = block.props;
  const isImageCards = variant === "image-cards";

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md, 4rem 0)",
        backgroundColor: "var(--sg-surface)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div data-block-group="Conteúdo" style={{ textAlign: "center", marginBottom: "3rem" }}>
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
          data-block-group="Layout"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "2rem",
          }}
        >
          {features.map((feature: any, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: "var(--sg-bg)",
                borderRadius: "var(--sg-card-radius, 0.75rem)",
                padding: isImageCards && feature.image ? 0 : "2rem",
                boxShadow: "var(--sg-card-shadow)",
                overflow: "hidden",
              }}
            >
              {isImageCards && feature.image && (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundImage: `url(${feature.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div
                style={{
                  padding: isImageCards && feature.image ? "1.5rem" : 0,
                }}
              >
                {!isImageCards && feature.icon && (
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "var(--sg-primary)",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {renderIcon({
                      id: `${block.id}-feat-${index}-icon`,
                      props: { name: feature.icon, color: "#fff" },
                    })}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "var(--sg-muted-text)" }}>
                  {feature.description}
                </p>
                {feature.link && (
                  <a
                    href={feature.link.href || "#"}
                    style={{
                      display: "inline-block",
                      marginTop: "0.75rem",
                      color: "var(--sg-primary)",
                      fontWeight: 500,
                      textDecoration: "none",
                      border: "1px solid var(--sg-primary)",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--sg-button-radius, 0.5rem)",
                    }}
                  >
                    {feature.link.text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
