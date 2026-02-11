/**
 * BlogPostCard Renderer
 * Renderiza card individual de post de blog com efeitos customizáveis
 * Variantes: default (vertical), horizontal (imagem esquerda), minimal (sem imagem)
 *
 * Usa utilitários globais reutilizáveis de card/image/button effects
 */

import React from "react";
import { resolveCardShadow, generateCardHoverStyles } from "../../../shared/cardEffects";
import { generateImageHoverStyles } from "../../../shared/imageEffects";
import { getLinkButtonStyles, generateLinkButtonHoverCSS } from "../../../shared/buttonStyles";

export function renderBlogPostCard(block: any): React.ReactNode {
  const {
    title,
    excerpt,
    image,
    date,
    category,
    authorName,
    authorAvatar,
    readingTime,
    linkHref,
    linkText = "Ler mais",
    variant = "default",
    showImage = true,
    showCategory = true,
    showDate = true,
    showAuthor = true,
    showReadingTime = true,
    // Card customization (reutilizável em qualquer card component)
    cardBorderRadius = "0.75rem",
    cardShadow = "md",
    cardHoverEffect = "lift",
    cardBorder = true,
    // Link customization (reutilizável em CTAs)
    linkStyle = "link",
    linkColor = "#2563eb",
    linkHoverColor = "#1d4ed8",
    // Image customization (reutilizável em galerias, hero, etc)
    imageHoverEffect = "zoom",
    imageBorderRadius = "0.75rem",
  } = block.props;

  const isHorizontal = variant === "horizontal";
  const isMinimal = variant === "minimal";
  const shouldShowImage = showImage && !isMinimal && image;

  // Generate styles using global utilities
  const shadow = resolveCardShadow(cardShadow);
  const cardHover = generateCardHoverStyles(cardHoverEffect, cardShadow === "none" ? "md" : cardShadow);
  const imageHover = generateImageHoverStyles(imageHoverEffect);
  const linkBtnStyles = getLinkButtonStyles(linkStyle, { color: linkColor, hoverColor: linkHoverColor });

  // Unique IDs for CSS selectors
  const cardId = `card-${block.id}`;
  const linkId = `link-${block.id}`;
  const imageId = `img-${block.id}`;

  // CSS for hover effects
  const hoverCSS = `
    ${cardHover.base ? `#${cardId} { ${cardHover.base} }` : ""}
    ${cardHover.hover ? `#${cardId}:hover { ${cardHover.hover} }` : ""}
    ${imageHover.imageBase ? `#${imageId} { ${imageHover.imageBase} }` : ""}
    ${imageHover.imageHover ? `#${cardId}:hover #${imageId} { ${imageHover.imageHover} }` : ""}
    ${generateLinkButtonHoverCSS(`#${linkId}`, linkStyle, { color: linkColor, hoverColor: linkHoverColor })}
  `;

  // Image element with hover effects
  const imageElement = shouldShowImage ? (
    <div
      style={{
        width: isHorizontal ? "40%" : "100%",
        height: isHorizontal ? "100%" : "200px",
        minHeight: isHorizontal ? "200px" : undefined,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: isHorizontal
          ? `${imageBorderRadius} 0 0 ${imageBorderRadius}`
          : `${imageBorderRadius} ${imageBorderRadius} 0 0`,
      }}
    >
      <img
        id={imageId}
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  ) : null;

  // Content element
  const contentElement = (
    <div
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Category badge */}
      {showCategory && category && (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--sg-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          {category}
        </span>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}
      >
        {linkHref ? (
          <a
            href={linkHref}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      {/* Excerpt */}
      {excerpt && (
        <p
          style={{
            color: "var(--sg-muted-text)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            flex: 1,
          }}
        >
          {excerpt}
        </p>
      )}

      {/* Meta row: author + date + reading time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "auto",
          flexWrap: "wrap",
        }}
      >
        {/* Author */}
        {showAuthor && authorName && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {authorName}
            </span>
          </div>
        )}

        {/* Separator dot */}
        {showAuthor && authorName && ((showDate && date) || (showReadingTime && readingTime)) && (
          <span style={{ color: "var(--sg-muted-text)", fontSize: "0.75rem" }}>
            {"\u00B7"}
          </span>
        )}

        {/* Date */}
        {showDate && date && (
          <span
            style={{
              color: "var(--sg-muted-text)",
              fontSize: "0.8125rem",
            }}
          >
            {date}
          </span>
        )}

        {/* Reading time */}
        {showReadingTime && readingTime && (
          <span
            style={{
              color: "var(--sg-muted-text)",
              fontSize: "0.8125rem",
            }}
          >
            {readingTime}
          </span>
        )}
      </div>

      {/* Read more link/button with customizable style */}
      {linkHref && linkText && (
        <a
          id={linkId}
          href={linkHref}
          style={{
            ...linkBtnStyles,
            marginTop: "1rem",
          }}
        >
          {linkText} {linkStyle === "link" ? "\u2192" : ""}
        </a>
      )}
    </div>
  );

  return (
    <React.Fragment key={block.id}>
      {/* Hover effects CSS */}
      {hoverCSS && <style>{hoverCSS}</style>}

      {/* Card wrapper with customizable shadow, border, hover */}
      <article
        id={cardId}
        style={{
          backgroundColor: "var(--sg-surface)",
          borderRadius: cardBorderRadius,
          boxShadow: shadow,
          border: cardBorder ? "1px solid var(--sg-border, #e5e7eb)" : "none",
          overflow: "hidden",
          display: isHorizontal ? "flex" : "block",
        }}
      >
        {imageElement}
        {contentElement}
      </article>
    </React.Fragment>
  );
}
