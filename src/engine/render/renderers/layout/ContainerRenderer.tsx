/**
 * Container Renderer
 * Renderiza bloco de container com max-width e padding
 */

import React from "react";
import { ContainerBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderContainer(
  block: ContainerBlock,
  depth: number,
): React.ReactNode {
  const { maxWidth = "1200px", padding = "1rem", children = [] } = block.props;

  return (
    <div
      key={block.id}
      style={{
        maxWidth,
        padding,
        margin: "0 auto",
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
