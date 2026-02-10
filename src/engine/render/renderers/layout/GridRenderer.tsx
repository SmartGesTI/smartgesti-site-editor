/**
 * Grid Renderer
 * Full-width outer wrapper for background effects (color, image, gradient, overlay)
 * Inner grid constrained by maxWidth with CSS Grid columns
 * Responsive: colTemplate collapses to 1fr on mobile
 */

import React from "react";
import { GridBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderGrid(
  block: GridBlock,
  depth: number,
): React.ReactNode {
  const {
    cols = 2,
    colTemplate,
    gap = "2.5rem",
    maxWidth,
    padding,
    paddingTop,
    paddingBottom,
    contentPosition = "center",
    bg,
    bgImage,
    bgOverlay,
    bgOverlayColor = "rgba(0,0,0,0.5)",
    bgGradient,
    children = [],
  } = block.props;

  const gridCols =
    typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 2;

  const gridTemplateColumns = colTemplate || `repeat(${gridCols}, 1fr)`;

  // Responsive style: collapse to 1fr on mobile when colTemplate is used
  const responsiveStyle = colTemplate
    ? `@media (max-width: 767px) { #grid-${block.id} { grid-template-columns: 1fr !important; } }`
    : "";

  // Inner grid styles
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns,
    gap,
    boxSizing: "border-box",
    width: "100%",
    position: "relative",
  };

  if (maxWidth) {
    gridStyle.maxWidth = maxWidth;
    if (contentPosition === "left") {
      gridStyle.marginRight = "auto";
    } else if (contentPosition === "right") {
      gridStyle.marginLeft = "auto";
    } else {
      gridStyle.marginLeft = "auto";
      gridStyle.marginRight = "auto";
    }
  }
  if (padding) {
    gridStyle.paddingLeft = padding;
    gridStyle.paddingRight = padding;
  }
  if (paddingTop) {
    gridStyle.paddingTop = paddingTop;
  }
  if (paddingBottom) {
    gridStyle.paddingBottom = paddingBottom;
  }

  // Check if we need an outer wrapper for background effects
  const hasBgEffects = bg || bgImage || bgGradient;

  if (!hasBgEffects) {
    // No background effects — render grid directly (no wrapper overhead)
    return (
      <React.Fragment key={block.id}>
        {responsiveStyle && <style>{responsiveStyle}</style>}
        <div id={`grid-${block.id}`} style={gridStyle}>
          {children.map((child) => (
            <React.Fragment key={child.id}>
              {renderBlockNode(child, depth + 1)}
            </React.Fragment>
          ))}
        </div>
      </React.Fragment>
    );
  }

  // Full-width outer wrapper for background effects
  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    position: "relative",
  };

  if (bg) {
    wrapperStyle.backgroundColor = bg;
  }
  if (bgImage) {
    wrapperStyle.backgroundImage = `url(${bgImage})`;
    wrapperStyle.backgroundSize = "cover";
    wrapperStyle.backgroundPosition = "center";
    wrapperStyle.backgroundRepeat = "no-repeat";
  }
  if (bgGradient && !bgImage) {
    wrapperStyle.background = bgGradient;
  }

  // Overlay element (only if bgImage + bgOverlay)
  const overlayEl = bgImage && bgOverlay ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: bgOverlayColor,
        zIndex: 0,
      }}
    />
  ) : null;

  // When using wrapper, the grid is positioned above the overlay
  if (overlayEl) {
    gridStyle.position = "relative";
    gridStyle.zIndex = 1;
  }

  return (
    <React.Fragment key={block.id}>
      {responsiveStyle && <style>{responsiveStyle}</style>}
      <div style={wrapperStyle}>
        {overlayEl}
        <div id={`grid-${block.id}`} style={gridStyle}>
          {children.map((child) => (
            <React.Fragment key={child.id}>
              {renderBlockNode(child, depth + 1)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
