/**
 * Section Renderer
 * Renderiza seção HTML com background e padding
 */

import React from "react";
import { SectionBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderSection(
  block: SectionBlock,
  depth: number,
): React.ReactNode {
  const { id, bg, padding = "2rem", children = [] } = block.props;

  // Detectar se bg é gradiente ou cor sólida
  const isGradient =
    bg &&
    (bg.includes("gradient") || bg.includes("linear") || bg.includes("radial"));
  const backgroundStyle = isGradient
    ? { background: bg }
    : { backgroundColor: bg || "var(--sg-bg, #ffffff)" };

  return (
    <section
      key={block.id}
      id={id}
      style={{
        ...backgroundStyle,
        padding,
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>
          {renderBlockNode(child, depth + 1)}
        </React.Fragment>
      ))}
    </section>
  );
}
