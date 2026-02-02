/**
 * Heading Renderer
 * Renderiza títulos (h1-h6)
 */

import React from "react";
import { HeadingBlock } from "../../../schema/siteDocument";

export function renderHeading(block: HeadingBlock): React.ReactNode {
  const { level, text, align = "left", color } = block.props;
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag
      key={block.id}
      style={{
        textAlign: align,
        color: color || "var(--sg-text, #1f2937)",
      }}
    >
      {text}
    </Tag>
  );
}
