/**
 * Hero Renderer
 * Renderiza seção hero com múltiplas variações e customizações avançadas
 */

import React from "react";
import { PLACEHOLDER_IMAGE_URL } from "../../../presets/heroVariations";
import { gridPresetMap, type ImageGridItem, type ImageGridPreset } from "../../../shared/imageGrid";

// Mapa de sombras para imagens
const imageShadowMap: Record<string, string> = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  md: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 10px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)",
  xl: "0 25px 50px rgba(0,0,0,0.25)",
};

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
    contentPosition = "center",
    minHeight = "80vh",
    overlay,
    overlayColor,
    background,
    // Typography colors
    titleColor,
    subtitleColor,
    descriptionColor,
    // Badge styling
    badgeColor,
    badgeTextColor,
    // Layout
    contentMaxWidth = "800px",
    paddingY,
    // Image styling
    imageRadius = 16,
    imageShadow = "lg",
    imagePosition = "right",
    // Button styling
    buttonSize = "md",
    primaryButtonVariant = "solid",
    primaryButtonColor,
    primaryButtonTextColor,
    primaryButtonRadius = 8,
    secondaryButtonVariant = "outline",
    secondaryButtonColor,
    secondaryButtonTextColor,
    secondaryButtonRadius = 8,
    // Decorative
    showWave,
    waveColor = "rgba(255,255,255,0.1)",
    // Image Grid
    imageGridEnabled,
    imageGridPreset = "four-equal",
    imageGridImages = [],
    imageGridGap = 8,
  } = block.props;

  // Determine variation type
  const heroImage = image || PLACEHOLDER_IMAGE_URL;
  const isSplit = variation === "hero-split" || variant === "split";
  const isParallax = variation === "hero-parallax";
  const isOverlayVariant = variation === "hero-overlay";
  const isGradient = variation === "hero-gradient";
  const isMinimal = variation === "hero-minimal";
  const isCard = variation === "hero-card";
  const isImageBg = (variant === "image-bg" || isOverlayVariant || isParallax || isCard) && heroImage;
  const isOverlay = isImageBg && overlay;

  // Check if image grid should be shown (works in ANY variation now)
  const hasValidGridImages = imageGridImages && imageGridImages.length > 0 && imageGridImages.some((img: ImageGridItem) => img?.src);
  const shouldShowImageGrid = imageGridEnabled && hasValidGridImages;

  // Build section classes
  const sectionClass = [
    "sg-hero",
    variation && `sg-hero--${variation.replace("hero-", "")}`,
    isSplit && "sg-hero--split",
    isParallax && "sg-hero--parallax",
    isOverlayVariant && "sg-hero--overlay",
    isGradient && "sg-hero--gradient",
    isMinimal && "sg-hero--minimal",
    isCard && "sg-hero--card",
    shouldShowImageGrid && "sg-hero--with-grid",
  ]
    .filter(Boolean)
    .join(" ");

  // Map content position to flexbox justify-content
  const contentPositionMap: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    minHeight,
    padding: paddingY ? `${paddingY} 2rem` : "6rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: contentPositionMap[contentPosition] || "center",
    position: "relative",
    overflow: "hidden",
    // Background
    ...(background && { background }),
    ...(isImageBg && !isSplit && {
      backgroundImage: `url(${heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    ...(isParallax && { backgroundAttachment: "fixed" }),
  };

  // Text colors - use custom or fallback based on context
  const hasOverlayOrDarkBg = isOverlay || isGradient || isOverlayVariant;
  const defaultTextColor = hasOverlayOrDarkBg ? "#ffffff" : "var(--sg-text, #1f2937)";
  const defaultMutedColor = hasOverlayOrDarkBg ? "rgba(255,255,255,0.85)" : "var(--sg-muted-text, #6b7280)";

  const titleStyle: React.CSSProperties = {
    color: titleColor || defaultTextColor,
    marginBottom: "1rem",
  };

  const subtitleStyle: React.CSSProperties = {
    color: subtitleColor || defaultMutedColor,
    marginBottom: "1rem",
  };

  const descriptionStyle: React.CSSProperties = {
    color: descriptionColor || defaultMutedColor,
    maxWidth: "600px",
    margin: align === "center" ? "0 auto 2rem" : "0 0 2rem",
  };

  // Badge styles
  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    backgroundColor: badgeColor || "var(--sg-primary, #3b82f6)",
    color: badgeTextColor || "#ffffff",
  };

  // Button size map
  const buttonSizeMap = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
    md: { padding: "0.75rem 1.5rem", fontSize: "1rem" },
    lg: { padding: "1rem 2rem", fontSize: "1.125rem" },
  };
  const btnSize = buttonSizeMap[buttonSize as keyof typeof buttonSizeMap] || buttonSizeMap.md;

  // Primary button styles
  const getPrimaryButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: btnSize.padding,
      fontSize: btnSize.fontSize,
      fontWeight: 600,
      borderRadius: `${primaryButtonRadius}px`,
      textDecoration: "none",
      transition: "all 0.2s ease",
      cursor: "pointer",
    };

    const color = primaryButtonColor || "var(--sg-primary, #3b82f6)";
    const textColor = primaryButtonTextColor || "#ffffff";

    switch (primaryButtonVariant) {
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: `2px solid ${color}`,
          color: color,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: "none",
          color: color,
        };
      default: // solid
        return {
          ...baseStyle,
          backgroundColor: color,
          border: `2px solid ${color}`,
          color: textColor,
        };
    }
  };

  // Secondary button styles
  const getSecondaryButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: btnSize.padding,
      fontSize: btnSize.fontSize,
      fontWeight: 600,
      borderRadius: `${secondaryButtonRadius}px`,
      textDecoration: "none",
      transition: "all 0.2s ease",
      cursor: "pointer",
    };

    const color = secondaryButtonColor || (hasOverlayOrDarkBg ? "#ffffff" : "var(--sg-primary, #3b82f6)");
    const textColor = secondaryButtonTextColor || color;

    switch (secondaryButtonVariant) {
      case "solid":
        return {
          ...baseStyle,
          backgroundColor: color,
          border: `2px solid ${color}`,
          color: textColor === color ? "#ffffff" : textColor,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: "none",
          color: textColor,
        };
      default: // outline
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: `2px solid ${color}`,
          color: textColor,
        };
    }
  };

  // Content wrapper style
  const contentStyle: React.CSSProperties = {
    maxWidth: contentMaxWidth,
    width: "100%",
    textAlign: align as any,
    position: "relative",
    zIndex: 2,
  };

  // Wave SVG for gradient variation
  const WaveElement = showWave ? (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "150px",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill={waveColor}
          opacity="0.5"
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill={waveColor}
          opacity="0.3"
        />
      </svg>
    </div>
  ) : null;

  // Content block (reused across layouts)
  const content = (
    <>
      {badge && <span style={badgeStyle}>{badge}</span>}
      {title && (
        <h1 className="sg-hero__title" style={titleStyle}>
          {title}
        </h1>
      )}
      {subtitle && (
        <h2 className="sg-hero__subtitle" style={subtitleStyle}>
          {subtitle}
        </h2>
      )}
      {description && (
        <p className="sg-hero__description" style={descriptionStyle}>
          {description}
        </p>
      )}
      <div
        className="sg-hero__actions"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {primaryButton && (
          <a
            href={primaryButton.href || "#"}
            className="sg-hero__btn sg-hero__btn--primary"
            style={getPrimaryButtonStyle()}
          >
            {primaryButton.text}
          </a>
        )}
        {secondaryButton && (
          <a
            href={secondaryButton.href || "#"}
            className="sg-hero__btn sg-hero__btn--secondary"
            style={getSecondaryButtonStyle()}
          >
            {secondaryButton.text}
          </a>
        )}
      </div>
    </>
  );

  // Image styles for split layout
  const imageStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "500px",
    height: "auto",
    borderRadius: `${imageRadius}px`,
    boxShadow: imageShadowMap[imageShadow] || imageShadowMap.lg,
    objectFit: "cover",
  };

  // =========================================================================
  // IMAGE GRID RENDERER - Floating element that works in any variation
  // =========================================================================
  const renderImageGrid = (
    images: ImageGridItem[],
    preset: ImageGridPreset,
    gap: number,
    radius: number,
    shadow: string
  ) => {
    const config = gridPresetMap[preset];
    const shadowValue = imageShadowMap[shadow] || imageShadowMap.lg;

    return (
      <div
        className="sg-hero__image-grid"
        style={{
          display: "grid",
          gridTemplate: config.gridTemplate,
          gap: `${gap}px`,
          width: "100%",
          maxWidth: "450px",
          aspectRatio: "1 / 1",
        }}
      >
        {config.positions.map((pos, idx) => {
          const img = images[idx];
          const imgSrc = img?.src || PLACEHOLDER_IMAGE_URL;

          return (
            <div
              key={idx}
              style={{
                gridColumn: pos.col,
                gridRow: pos.row,
                overflow: "hidden",
                borderRadius: `${radius}px`,
              }}
            >
              <img
                src={imgSrc}
                alt={img?.alt || `Imagem ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  boxShadow: shadowValue,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL;
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Image Grid element (floating, used in all variations when enabled)
  const ImageGridElement = shouldShowImageGrid ? (
    <div
      className="sg-hero__grid-wrapper"
      style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderImageGrid(
        imageGridImages as ImageGridItem[],
        imageGridPreset as ImageGridPreset,
        imageGridGap as number,
        imageRadius,
        imageShadow
      )}
    </div>
  ) : null;

  // =========================================================================
  // RENDER: Split Layout (original behavior without grid)
  // =========================================================================
  if (isSplit && heroImage && !shouldShowImageGrid) {
    const isImageLeft = imagePosition === "left";

    const imageArea = (
      <div className="sg-hero__split-image" style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={heroImage}
          alt={title || ""}
          className="sg-hero__img"
          style={imageStyle}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL;
          }}
        />
      </div>
    );

    return (
      <section
        key={block.id}
        className={sectionClass}
        style={{
          ...containerStyle,
          backgroundImage: undefined,
          background: background || "var(--sg-bg, #ffffff)",
        }}
        data-variation={variation || variant}
        data-block-id={block.id}
      >
        <div
          className="sg-hero__split-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            maxWidth: "1200px",
            width: "100%",
            alignItems: "center",
          }}
        >
          {isImageLeft && imageArea}
          <div className="sg-hero__split-content" style={contentStyle}>
            {content}
          </div>
          {!isImageLeft && imageArea}
        </div>
      </section>
    );
  }

  // =========================================================================
  // RENDER: Card Layout (content in floating card over image)
  // Supports both with and without Image Grid
  // Card always stays on the left (original position), Grid on the right
  // =========================================================================
  if (isCard && heroImage) {
    // Card element (reused in both layouts)
    const CardElement = (
      <div
        className="sg-hero__card"
        style={{
          ...contentStyle,
          backgroundColor: background || "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          zIndex: 2,
          maxWidth: shouldShowImageGrid ? "500px" : contentMaxWidth,
        }}
      >
        {content}
      </div>
    );

    // With Image Grid: Card on left + Grid on right (preserves original card position)
    if (shouldShowImageGrid) {
      return (
        <section
          key={block.id}
          className={sectionClass}
          style={{
            ...containerStyle,
            justifyContent: "flex-start",
            padding: paddingY ? `${paddingY} 3rem` : "6rem 3rem",
          }}
          data-variation={variation || variant}
          data-block-id={block.id}
        >
          {/* Overlay */}
          {isOverlay && (
            <div
              className="sg-hero__overlay"
              style={{
                position: "absolute",
                inset: 0,
                background: overlayColor || "rgba(0,0,0,0.4)",
                zIndex: 1,
              }}
            />
          )}
          {/* Card + Grid Layout: Card left, Grid right with proper spacing */}
          <div
            className="sg-hero__card-grid-layout"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "1200px",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2,
              padding: "0 2rem",
              gap: "3rem",
            }}
          >
            {CardElement}
            {ImageGridElement}
          </div>
        </section>
      );
    }

    // Without Image Grid: Original card layout
    return (
      <section
        key={block.id}
        className={sectionClass}
        style={{
          ...containerStyle,
          justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          padding: paddingY ? `${paddingY} 3rem` : "6rem 3rem",
        }}
        data-variation={variation || variant}
        data-block-id={block.id}
      >
        {/* Overlay */}
        {isOverlay && (
          <div
            className="sg-hero__overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: overlayColor || "rgba(0,0,0,0.4)",
              zIndex: 1,
            }}
          />
        )}
        {/* Content Card */}
        {CardElement}
      </section>
    );
  }

  // =========================================================================
  // RENDER: With Image Grid (any variation) - Split layout with content + grid
  // =========================================================================
  if (shouldShowImageGrid) {
    const isGridLeft = imagePosition === "left";

    return (
      <section
        key={block.id}
        className={sectionClass}
        style={containerStyle}
        data-variation={variation || variant}
        data-block-id={block.id}
      >
        {/* Overlay for image backgrounds */}
        {isOverlay && (
          <div
            className="sg-hero__overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: overlayColor || "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
              zIndex: 1,
            }}
          />
        )}
        {/* Wave decoration */}
        {WaveElement}
        {/* Main content wrapper with grid layout */}
        <div
          className="sg-hero__grid-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            maxWidth: "1200px",
            width: "100%",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
            padding: "0 2rem",
          }}
        >
          {isGridLeft && ImageGridElement}
          <div className="sg-hero__content-side" style={contentStyle}>
            {content}
          </div>
          {!isGridLeft && ImageGridElement}
        </div>
      </section>
    );
  }

  // =========================================================================
  // RENDER: Default (centered, gradient, minimal, parallax, overlay)
  // =========================================================================
  return (
    <section
      key={block.id}
      className={sectionClass}
      style={containerStyle}
      data-variation={variation || variant}
      data-block-id={block.id}
    >
      {/* Overlay for image backgrounds */}
      {isOverlay && (
        <div
          className="sg-hero__overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: overlayColor || "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
            zIndex: 1,
          }}
        />
      )}
      {/* Wave decoration */}
      {WaveElement}
      {/* Content */}
      <div style={contentStyle}>{content}</div>
    </section>
  );
}
