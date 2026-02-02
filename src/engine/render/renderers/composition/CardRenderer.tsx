/**
 * Card Renderer
 * Renderiza card com header, content e footer
 */

import React from "react";
import { CardBlock } from "../../../schema/siteDocument";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderCard(block: CardBlock, depth: number): React.ReactNode {
  const {
    header = [],
    content = [],
    footer = [],
    padding = "1rem",
    bg,
    border,
    radius,
    shadow,
  } = block.props;

  return (
    <div
      key={block.id}
      style={{
        backgroundColor: bg || "var(--sg-surface, #f9fafb)",
        border: border || "1px solid var(--sg-border, #e5e7eb)",
        borderRadius: radius || "var(--sg-radius, 0.5rem)",
        boxShadow:
          shadow || "var(--sg-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))",
        padding,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {header.length > 0 && (
        <div>
          {header.map((child) => (
            <React.Fragment key={child.id}>
              {renderBlockNode(child, depth + 1)}
            </React.Fragment>
          ))}
        </div>
      )}
      {content.length > 0 && (
        <div>
          {content.map((child) => (
            <React.Fragment key={child.id}>
              {renderBlockNode(child, depth + 1)}
            </React.Fragment>
          ))}
        </div>
      )}
      {footer.length > 0 && (
        <div>
          {footer.map((child) => (
            <React.Fragment key={child.id}>
              {renderBlockNode(child, depth + 1)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
