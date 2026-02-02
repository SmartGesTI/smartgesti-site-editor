/**
 * Hero Renderer
 * Renderiza seção hero com variações (centered, split, overlay, parallax)
 */

import React from "react";
import { PLACEHOLDER_IMAGE_URL } from "../../../presets/heroVariations";

export function renderHero(block: any): React.ReactNode {
  const {
    variation,
    variant = "centered",
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    image,
    badge,
    align = "center",
    minHeight = "80vh",
    overlay,
    overlayColor,
    background,
  } = block.props;

  const heroImage = image || PLACEHOLDER_IMAGE_URL;
  const isImageBg = variant === "image-bg" && heroImage;
  const isOverlay = isImageBg && overlay;
  const isSplit = variation === "hero-split" || variant === "split";
  const isParallax = variation === "hero-parallax";
  const isOverlayVariant = variation === "hero-overlay";

  const sectionClass = [
    "sg-hero",
    variation && `sg-hero--${variation.replace("hero-", "")}`,
    isSplit && "sg-hero--split",
    isParallax && "sg-hero--parallax",
    isOverlayVariant && "sg-hero--overlay",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle: React.CSSProperties = {
    minHeight,
    padding: "var(--sg-section-padding-lg, 6rem 0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--sg-bg, #fff)",
    backgroundImage: isImageBg ? `url(${heroImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    ...(isParallax && { backgroundAttachment: "fixed" }),
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: "1200px",
    padding: "0 1rem",
    textAlign: align as any,
    position: "relative",
    zIndex: 1,
  };

  const textColor = isOverlay ? "#fff" : "var(--sg-text)";
  const mutedColor = isOverlay
    ? "rgba(255,255,255,0.85)"
    : "var(--sg-muted-text)";

  const content = (
    <>
      {badge && <span className="sg-hero__badge">{badge}</span>}
      {title && (
        <h1 className="sg-hero__title" style={{ color: textColor }}>
          {title}
        </h1>
      )}
      {subtitle && (
        <h2 className="sg-hero__subtitle" style={{ color: mutedColor }}>
          {subtitle}
        </h2>
      )}
      {description && (
        <p
          className="sg-hero__description"
          style={{
            maxWidth: "600px",
            margin: align === "center" ? "0 auto 2rem" : "0 0 2rem",
            color: mutedColor,
          }}
        >
          {description}
        </p>
      )}
      <div
        className="sg-hero__actions"
        style={{ justifyContent: align === "center" ? "center" : "flex-start" }}
      >
        {primaryButton && (
          <a
            href={primaryButton.href || "#"}
            className="sg-hero__btn sg-hero__btn--primary"
          >
            {primaryButton.text}
          </a>
        )}
        {secondaryButton && (
          <a
            href={secondaryButton.href || "#"}
            className="sg-hero__btn sg-hero__btn--secondary"
            style={{
              color: isOverlay ? "#fff" : "var(--sg-primary)",
              borderColor: isOverlay ? "#fff" : "var(--sg-primary)",
            }}
          >
            {secondaryButton.text}
          </a>
        )}
      </div>
    </>
  );

  if (isSplit && heroImage) {
    const splitContentStyle: React.CSSProperties = {
      ...contentStyle,
      ...(background && { background }),
    };
    return (
      <section
        key={block.id}
        className={sectionClass}
        style={{ ...containerStyle, backgroundImage: undefined }}
        data-variation={variation || variant}
      >
        <div className="sg-hero__split-inner">
          <div className="sg-hero__split-content" style={splitContentStyle}>
            {content}
          </div>
          <div className="sg-hero__split-image">
            <img
              src={heroImage}
              alt={title || ""}
              className="sg-hero__img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL;
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      key={block.id}
      className={sectionClass}
      style={containerStyle}
      data-variation={variation || variant}
    >
      {isOverlay && (
        <div
          className="sg-hero__overlay"
          style={overlayColor ? { background: overlayColor } : undefined}
        />
      )}
      <div style={contentStyle}>{content}</div>
    </section>
  );
}
