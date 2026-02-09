/**
 * AboutSection Renderer
 * Renderiza seção sobre com imagem, texto, achievements e stats
 */

import React from "react";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

export function renderAboutSection(block: any): React.ReactNode {
  const {
    title,
    subtitle,
    description,
    secondaryDescription,
    image,
    achievements = [],
    primaryButton,
    variant = "image-left",
    bg,
    stats = [],
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = block.props;

  const isCentered = variant === "centered";
  const isReversed = variant === "image-right";

  // Generate hover CSS
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  if (buttonHoverEffect !== "none") {
    const result = generateButtonHoverStyles({
      effect: buttonHoverEffect as ButtonHoverEffect,
      intensity: buttonHoverIntensity,
      buttonColor: "#6366f1",
      variant: "solid",
    });
    if (result.base) {
      hoverCss += `${scope} .sg-about__btn--primary { ${result.base} }`;
    }
    hoverCss += `${scope} .sg-about__btn--primary:hover { ${result.hover} }`;
    hoverCss += getButtonHoverKeyframes();
  }

  if (buttonHoverOverlay && buttonHoverOverlay !== "none") {
    hoverCss += generateButtonOverlayCSS(`${scope} .sg-about__btn--primary`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor: "#6366f1",
      iconName: buttonHoverIconName,
      textColor: "#fff",
    });
  }

  const hasHover = hoverCss.length > 0;
  const btnStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "var(--sg-primary)",
    color: "var(--sg-primary-text)",
    borderRadius: "var(--sg-button-radius, 0.5rem)",
    textDecoration: "none",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.2s ease",
  };

  const buttonElement = primaryButton ? (
    <a
      href={primaryButton.href || "#"}
      className="sg-about__btn sg-about__btn--primary"
      style={btnStyle}
    >
      {primaryButton.text}
    </a>
  ) : null;

  if (isCentered) {
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
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            {subtitle && (
              <span
                data-block-group="Conteúdo"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: "var(--sg-primary)",
                  color: "var(--sg-primary-text, #fff)",
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
              <h2 style={{ fontSize: "var(--sg-heading-h2)", marginBottom: "1rem" }}>{title}</h2>
            )}
            {image && (
              <div data-block-group="Mídia" style={{ margin: "2rem 0" }}>
                <img
                  src={image}
                  alt={title || "About"}
                  style={{
                    width: "100%",
                    borderRadius: "var(--sg-card-radius, 0.75rem)",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            {description && (
              <p style={{ color: "var(--sg-muted-text)", fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                {description}
              </p>
            )}
            {secondaryDescription && (
              <p style={{ color: "var(--sg-muted-text)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {secondaryDescription}
              </p>
            )}
            {achievements.length > 0 && (
              <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.5rem", textAlign: "left", marginBottom: "1.5rem" }}>
                {achievements.map((a: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            )}
            {buttonElement && <div>{buttonElement}</div>}
          </div>
        </section>
      </>
    );
  }

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
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            gap: "3rem",
            alignItems: "center",
            flexDirection: isReversed ? "row-reverse" : "row",
          }}
        >
          {/* Image side */}
          <div data-block-group="Mídia" style={{ flex: "1 1 50%", position: "relative" }}>
            {image ? (
              <img
                src={image}
                alt={title || "About"}
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
                  height: "400px",
                  backgroundColor: "var(--sg-surface)",
                  borderRadius: "var(--sg-card-radius, 0.75rem)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "var(--sg-muted-text)",
                }}
              >
                Adicione uma imagem
              </div>
            )}
            {/* Floating stats */}
            {stats.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-1rem",
                  right: isReversed ? "auto" : "-1rem",
                  left: isReversed ? "-1rem" : "auto",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {stats.map((stat: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--sg-primary)",
                      color: "var(--sg-primary-text, #fff)",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--sg-card-radius, 0.75rem)",
                      textAlign: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      minWidth: "80px",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content side */}
          <div data-block-group="Conteúdo" style={{ flex: "1 1 50%" }}>
            {subtitle && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: "var(--sg-primary)",
                  color: "var(--sg-primary-text, #fff)",
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
              <h2 style={{ fontSize: "var(--sg-heading-h2)", marginBottom: "1rem" }}>{title}</h2>
            )}
            {description && (
              <p style={{ color: "var(--sg-muted-text)", lineHeight: 1.7, marginBottom: "1rem" }}>
                {description}
              </p>
            )}
            {secondaryDescription && (
              <p style={{ color: "var(--sg-muted-text)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {secondaryDescription}
              </p>
            )}
            {achievements.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0" }}>
                {achievements.map((a: any, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                    <span>{a.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {buttonElement}
          </div>
        </div>
      </section>
    </>
  );
}
