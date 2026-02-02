/**
 * LogoCloud Renderer
 * Renderiza grid de logos de parceiros/clientes
 */

import React from "react";

export function renderLogoCloud(block: any): React.ReactNode {
  const { title, logos = [], grayscale } = block.props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-sm)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        {title && (
          <p style={{ color: "var(--sg-muted-text)", marginBottom: "2rem" }}>
            {title}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {logos.map((logo: any, index: number) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: "2rem",
                objectFit: "contain",
                filter: grayscale ? "grayscale(100%)" : undefined,
                opacity: grayscale ? 0.6 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
