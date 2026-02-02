/**
 * Stack Renderer
 * Renderiza bloco de stack com flex layout
 */

import React from "react";
import { StackBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderStack(
  block: StackBlock,
  depth: number,
): React.ReactNode {
  const {
    direction = "col",
    gap = "1rem",
    align = "stretch",
    justify = "start",
    wrap = false,
    children = [],
  } = block.props;

  const flexDirection = direction === "row" ? "row" : "column";
  const alignItems =
    align === "start"
      ? "flex-start"
      : align === "end"
        ? "flex-end"
        : align === "center"
          ? "center"
          : "stretch";
  const justifyContent =
    justify === "start"
      ? "flex-start"
      : justify === "end"
        ? "flex-end"
        : justify === "center"
          ? "center"
          : justify === "space-between"
            ? "space-between"
            : "space-around";

  return (
    <div
      key={block.id}
      style={{
        display: "flex",
        flexDirection,
        gap,
        alignItems,
        justifyContent,
        flexWrap: wrap ? "wrap" : "nowrap",
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
