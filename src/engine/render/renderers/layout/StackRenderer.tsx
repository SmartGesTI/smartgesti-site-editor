/**
 * Stack Renderer
 * Renderiza bloco de stack com flex layout
 * Suporte a sticky positioning para sidebars
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
    sticky = false,
    stickyOffset = "80px",
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

  // Sticky: position sticky + top offset + align-self flex-start (required in grid)
  const stickyStyles: React.CSSProperties = sticky
    ? {
        position: "sticky",
        top: stickyOffset,
        alignSelf: "flex-start",
      }
    : {};

  // Responsive: disable sticky on mobile via media query
  const responsiveStyle = sticky
    ? `@media (max-width: 767px) { #stack-${block.id} { position: static !important; align-self: stretch !important; } }`
    : "";

  return (
    <React.Fragment key={block.id}>
      {responsiveStyle && <style>{responsiveStyle}</style>}
      <div
        id={`stack-${block.id}`}
        key={block.id}
        style={{
          display: "flex",
          flexDirection,
          gap,
          alignItems,
          justifyContent,
          flexWrap: wrap ? "wrap" : "nowrap",
          ...stickyStyles,
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
