/**
 * ProductShowcase Renderer
 * Renderiza vitrine de produtos com layouts alternado, grid ou empilhado
 */

import React from "react";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

export function renderProductShowcase(block: any): React.ReactNode {
  const {
    title,
    subtitle,
    products = [],
    variant = "alternating",
    bg,
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = block.props;

  const isGrid = variant === "grid";

  // Generate hover CSS
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  if (buttonHoverEffect !== "none") {
    const primaryResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: "#6366f1",
      variant: "solid",
    });
    const outlineResult = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: "#6366f1",
      variant: "outline",
    });
    if (primaryResult.base) {
      hoverCss += `${scope} .sg-showcase__btn--primary { ${primaryResult.base} }`;
    }
    if (outlineResult.base) {
      hoverCss += `${scope} .sg-showcase__btn--secondary { ${outlineResult.base} }`;
    }
    hoverCss += `${scope} .sg-showcase__btn--primary:hover { ${primaryResult.hover} }`;
    hoverCss += `${scope} .sg-showcase__btn--secondary:hover { ${outlineResult.hover} }`;
    hoverCss += getButtonHoverKeyframes();
  }

  if (buttonHoverOverlay && buttonHoverOverlay !== "none") {
    hoverCss += generateButtonOverlayCSS(`${scope} .sg-showcase__btn--primary`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor: "#6366f1",
      iconName: buttonHoverIconName,
      textColor: "#fff",
    });
    hoverCss += generateButtonOverlayCSS(`${scope} .sg-showcase__btn--secondary`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor: "#6366f1",
      iconName: buttonHoverIconName,
      textColor: "#6366f1",
    });
  }

  const hasHover = hoverCss.length > 0;
  const btnBaseStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    transition: "all 0.2s ease",
  };

  return (
    <>
      {hasHover && <style>{hoverCss}</style>}
      <section
        key={block.id}
        data-block-id={block.id}
        style={{
          padding: "var(--sg-section-padding-md, 4rem 0)",
          backgroundColor: bg || "var(--sg-bg)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {(title || subtitle) && (
            <div data-block-group="Conteúdo" style={{ textAlign: "center", marginBottom: "3rem" }}>
              {subtitle && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "var(--sg-primary)",
                    color: "#fff",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {subtitle}
                </span>
              )}
              {title && (
                <h2 style={{ fontSize: "var(--sg-heading-h2)", marginBottom: "0.5rem" }}>
                  {title}
                </h2>
              )}
            </div>
          )}

          {isGrid ? (
            <div
              data-block-group="Layout"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`,
                gap: "2rem",
              }}
            >
              {products.map((product: any, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "var(--sg-surface)",
                    borderRadius: "var(--sg-card-radius, 0.75rem)",
                    overflow: "hidden",
                    boxShadow: "var(--sg-card-shadow)",
                  }}
                >
                  {product.image && (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  <div style={{ padding: "1.5rem" }}>
                    {product.badge && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.125rem 0.5rem",
                          backgroundColor: "var(--sg-primary)",
                          color: "#fff",
                          borderRadius: "9999px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                      {product.icon && <span style={{ marginRight: "0.5rem" }}>{product.icon}</span>}
                      {product.name}
                    </h3>
                    <p style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
                      {product.description}
                    </p>
                    {product.primaryButton && (
                      <a
                        href={product.primaryButton.href || "#"}
                        className="sg-showcase__btn sg-showcase__btn--primary"
                        style={{
                          display: "inline-block",
                          marginTop: "1rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "var(--sg-primary)",
                          color: "var(--sg-primary-text)",
                          borderRadius: "var(--sg-button-radius, 0.5rem)",
                          textDecoration: "none",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          ...btnBaseStyle,
                        }}
                      >
                        {product.primaryButton.text}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div data-block-group="Layout" style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              {products.map((product: any, index: number) => {
                const isReversed = variant === "alternating" && index % 2 === 1;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "3rem",
                      alignItems: "center",
                      flexDirection: isReversed ? "row-reverse" : "row",
                    }}
                  >
                    {/* Image side */}
                    <div style={{ flex: "1 1 50%" }}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            borderRadius: "var(--sg-card-radius, 0.75rem)",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "300px",
                            backgroundColor: "var(--sg-surface)",
                            borderRadius: "var(--sg-card-radius, 0.75rem)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "4rem",
                          }}
                        >
                          {product.icon || "📦"}
                        </div>
                      )}
                    </div>

                    {/* Content side */}
                    <div style={{ flex: "1 1 50%" }}>
                      {product.badge && (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "var(--sg-primary)",
                            color: "#fff",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            marginBottom: "0.75rem",
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                        {product.icon && <span style={{ marginRight: "0.5rem" }}>{product.icon}</span>}
                        {product.name}
                      </h3>
                      <p style={{ color: "var(--sg-muted-text)", marginBottom: "1rem", lineHeight: 1.7 }}>
                        {product.longDescription || product.description}
                      </p>
                      {product.features && product.features.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0" }}>
                          {product.features.map((feat: string, fi: number) => (
                            <li
                              key={fi}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                                color: "var(--sg-text)",
                              }}
                            >
                              <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        {product.primaryButton && (
                          <a
                            href={product.primaryButton.href || "#"}
                            className="sg-showcase__btn sg-showcase__btn--primary"
                            style={{
                              padding: "0.625rem 1.25rem",
                              backgroundColor: "var(--sg-primary)",
                              color: "var(--sg-primary-text)",
                              borderRadius: "var(--sg-button-radius, 0.5rem)",
                              textDecoration: "none",
                              fontWeight: 500,
                              ...btnBaseStyle,
                            }}
                          >
                            {product.primaryButton.text}
                          </a>
                        )}
                        {product.secondaryButton && (
                          <a
                            href={product.secondaryButton.href || "#"}
                            className="sg-showcase__btn sg-showcase__btn--secondary"
                            style={{
                              padding: "0.625rem 1.25rem",
                              backgroundColor: "transparent",
                              color: "var(--sg-primary)",
                              border: "1px solid var(--sg-primary)",
                              borderRadius: "var(--sg-button-radius, 0.5rem)",
                              textDecoration: "none",
                              fontWeight: 500,
                              ...btnBaseStyle,
                            }}
                          >
                            {product.secondaryButton.text}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
