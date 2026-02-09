/**
 * ContactSection Renderer
 * Renderiza seção de contato com info cards e formulário
 */

import React from "react";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

const CONTACT_ICONS: Record<string, string> = {
  mail: "✉",
  phone: "📞",
  "map-pin": "📍",
  clock: "🕐",
  globe: "🌐",
};

export function renderContactSection(block: any): React.ReactNode {
  const {
    title,
    subtitle,
    description,
    contactInfo = [],
    formTitle,
    formFields = [],
    submitText = "Enviar",
    variant = "split",
    bg,
    buttonHoverEffect = "none",
    buttonHoverIntensity = 50,
    buttonHoverOverlay = "none",
    buttonHoverIconName = "arrow-right",
  } = block.props;

  const isFormOnly = variant === "form-only";
  const isStacked = variant === "stacked";

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
      hoverCss += `${scope} .sg-contact__btn--submit { ${result.base} }`;
    }
    hoverCss += `${scope} .sg-contact__btn--submit:hover { ${result.hover} }`;
    hoverCss += getButtonHoverKeyframes();
  }

  if (buttonHoverOverlay && buttonHoverOverlay !== "none") {
    hoverCss += generateButtonOverlayCSS(`${scope} .sg-contact__btn--submit`, {
      overlay: buttonHoverOverlay as ButtonHoverOverlay,
      primaryColor: "#6366f1",
      iconName: buttonHoverIconName,
      textColor: "#fff",
    });
  }

  const hasHover = hoverCss.length > 0;

  const formElement = (
    <div
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "var(--sg-card-radius, 0.75rem)",
        padding: "2rem",
        boxShadow: "var(--sg-card-shadow)",
      }}
    >
      {formTitle && (
        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          {formTitle}
        </h3>
      )}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {formFields.map((field: any, i: number) => (
          <div key={i}>
            {field.label && (
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "0.375rem",
                  color: "var(--sg-text)",
                }}
              >
                {field.label}
                {field.required && <span style={{ color: "#ef4444" }}> *</span>}
              </label>
            )}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid var(--sg-border)",
                  borderRadius: "var(--sg-button-radius, 0.5rem)",
                  fontSize: "0.875rem",
                  backgroundColor: "var(--sg-bg)",
                  color: "var(--sg-text)",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid var(--sg-border)",
                  borderRadius: "var(--sg-button-radius, 0.5rem)",
                  fontSize: "0.875rem",
                  backgroundColor: "var(--sg-bg)",
                  color: "var(--sg-text)",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="sg-contact__btn sg-contact__btn--submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--sg-primary)",
            color: "var(--sg-primary-text)",
            border: "none",
            borderRadius: "var(--sg-button-radius, 0.5rem)",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "1rem",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s ease",
          }}
        >
          {submitText}
        </button>
      </form>
    </div>
  );

  if (isFormOnly) {
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
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
            {(title || subtitle) && (
              <div data-block-group="Conteúdo" style={{ textAlign: "center", marginBottom: "2rem" }}>
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
                  <h2 style={{ fontSize: "var(--sg-heading-h2)", marginBottom: "0.5rem" }}>{title}</h2>
                )}
                {description && (
                  <p style={{ color: "var(--sg-muted-text)" }}>{description}</p>
                )}
              </div>
            )}
            <div data-block-group="Formulário">{formElement}</div>
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
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {(title || subtitle) && (
            <div data-block-group="Conteúdo" style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                <h2 style={{ fontSize: "var(--sg-heading-h2)", marginBottom: "0.5rem" }}>{title}</h2>
              )}
              {description && (
                <p style={{ color: "var(--sg-muted-text)" }}>{description}</p>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "3rem",
              flexDirection: isStacked ? "column" : "row",
              alignItems: isStacked ? "stretch" : "flex-start",
            }}
          >
            {/* Contact info */}
            {contactInfo.length > 0 && (
              <div
                data-block-group="Info"
                style={{
                  flex: isStacked ? "1" : "1 1 40%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {contactInfo.map((info: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "1.25rem",
                      backgroundColor: "var(--sg-surface)",
                      borderRadius: "var(--sg-card-radius, 0.75rem)",
                      boxShadow: "var(--sg-card-shadow)",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: "var(--sg-primary)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--sg-primary-text, #fff)",
                        flexShrink: 0,
                        fontSize: "1.25rem",
                      }}
                    >
                      {CONTACT_ICONS[info.icon || ""] || "📧"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                        {info.label}
                      </div>
                      <div style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
                        {info.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            <div data-block-group="Formulário" style={{ flex: isStacked ? "1" : "1 1 60%" }}>
              {formElement}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
