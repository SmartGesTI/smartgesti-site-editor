/**
 * Grid Renderer
 * Renderiza bloco de grid com CSS Grid
 * Suporte a colTemplate para templates customizados (ex: "1fr 320px")
 * Suporte a maxWidth e padding para espaçamento
 */

import React from "react";
import { GridBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderGrid(
  block: GridBlock,
  depth: number,
): React.ReactNode {
  const { cols = 3, colTemplate, gap = "1rem", maxWidth, padding, paddingTop, children = [] } = block.props;

  const gridCols =
    typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 3;

  const gridTemplateColumns = colTemplate || `repeat(${gridCols}, 1fr)`;

  // When colTemplate is used, add responsive style to collapse to 1fr on mobile
  const responsiveStyle = colTemplate
    ? `@media (max-width: 767px) { #grid-${block.id} { grid-template-columns: 1fr !important; } }`
    : "";

  // Wrapper styles for maxWidth + padding (container-like behavior)
  const wrapperStyle: React.CSSProperties = {};
  if (maxWidth || padding || paddingTop) {
    if (maxWidth) {
      wrapperStyle.maxWidth = maxWidth;
      wrapperStyle.marginLeft = "auto";
      wrapperStyle.marginRight = "auto";
    }
    if (padding) {
      wrapperStyle.paddingLeft = padding;
      wrapperStyle.paddingRight = padding;
    }
    if (paddingTop) {
      wrapperStyle.paddingTop = paddingTop;
    }
  }

  const hasWrapper = maxWidth || padding || paddingTop;

  const gridDiv = (
    <div
      id={`grid-${block.id}`}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap,
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>
          {renderBlockNode(child, depth + 1)}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <React.Fragment key={block.id}>
      {responsiveStyle && <style>{responsiveStyle}</style>}
      {hasWrapper ? (
        <div style={wrapperStyle}>{gridDiv}</div>
      ) : (
        gridDiv
      )}
    </React.Fragment>
  );
}
