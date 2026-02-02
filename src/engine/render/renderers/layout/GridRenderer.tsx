/**
 * Grid Renderer
 * Renderiza bloco de grid com CSS Grid
 */

import React from "react";
import { GridBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderGrid(
  block: GridBlock,
  depth: number,
): React.ReactNode {
  const { cols = 3, gap = "1rem", children = [] } = block.props;

  const gridCols =
    typeof cols === "number" ? cols : cols.lg || cols.md || cols.sm || 3;

  return (
    <div
      key={block.id}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
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
}
