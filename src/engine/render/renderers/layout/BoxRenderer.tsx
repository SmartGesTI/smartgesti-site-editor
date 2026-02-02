/**
 * Box Renderer
 * Renderiza bloco de box com estilos visuais (bg, border, shadow)
 */

import React from "react";
import { BoxBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderBox(
  block: BoxBlock,
  depth: number,
): React.ReactNode {
  const {
    bg,
    border,
    radius,
    shadow,
    padding = "1rem",
    children = [],
  } = block.props;

  // Detectar se bg é gradiente ou cor sólida
  const isGradient =
    bg &&
    (bg.includes("gradient") || bg.includes("linear") || bg.includes("radial"));
  const backgroundStyle = isGradient
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <div
      key={block.id}
      style={{
        ...backgroundStyle,
        border,
        borderRadius: radius,
        boxShadow: shadow,
        padding,
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
