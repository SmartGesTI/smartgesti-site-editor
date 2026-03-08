/**
 * Countdown Renderer
 * Contador regressivo com variantes default e banner
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderCountdown(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const {
    title,
    description,
    showPlaceholders = true,
    buttonText,
    buttonHref,
    variant = "default",
    badgeText,
    bg,
  } = props;
  const isBanner = variant === "banner";

  const sectionStyle: React.CSSProperties = {
    padding: "var(--sg-section-padding-md, 4rem 2rem)",
    backgroundColor: bg || "var(--sg-primary)",
    color: "#fff",
    position: "relative",
  };

  return (
    <section
      key={block.id}
      className="sg-countdown"
      style={sectionStyle}
      data-variant={variant}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {isBanner && badgeText && (
          <div
            className="sg-countdown__badge-circle"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              textAlign: "center",
              padding: "1rem",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {badgeText}
          </div>
        )}
        <div style={{ flex: 1, minWidth: "200px" }}>
          {title && (
            <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
              {title}
            </h2>
          )}
          {description && (
            <p style={{ opacity: 0.9, marginBottom: "1rem" }}>{description}</p>
          )}
          {showPlaceholders && (
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>00</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
          {buttonText && (
            <a
              href={buttonHref || "#"}
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#fff",
                color: "var(--sg-primary)",
                fontWeight: 600,
                borderRadius: "var(--sg-button-radius, 0.5rem)",
                textDecoration: "none",
              }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
