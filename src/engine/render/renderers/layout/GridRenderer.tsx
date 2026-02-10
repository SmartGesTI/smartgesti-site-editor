/**
 * Grid Renderer
 * Renderiza bloco de grid com CSS Grid
 * Suporte a colTemplate para templates customizados (ex: "1fr 320px")
 */

import React from "react";
import { GridBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderGrid(
  block: GridBlock,
  depth: number,
): React.ReactNode {
  const { cols = 3, colTemplate, gap = "1rem", children = [] } = block.props;

  const gridCols =
    typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 3;

  const gridTemplateColumns = colTemplate || `repeat(${gridCols}, 1fr)`;

  // When colTemplate is used, add responsive style to collapse to 1fr on mobile
  const responsiveStyle = colTemplate
    ? `@media (max-width: 767px) { #grid-${block.id} { grid-template-columns: 1fr !important; } }`
    : "";

  return (
    <React.Fragment key={block.id}>
      {responsiveStyle && <style>{responsiveStyle}</style>}
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
    </React.Fragment>
  );
}
