/**
 * Text Renderer
 * Renderiza parágrafos de texto
 */

import React from "react";
import { TextBlock } from "../../../schema/siteDocument";

export function renderText(block: TextBlock): React.ReactNode {
  const { text, align = "left", color, size = "md" } = block.props;

  const fontSizeMap: Record<string, string> = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  };

  return (
    <p
      key={block.id}
      style={{
        textAlign: align,
        color: color || "var(--sg-text, #1f2937)",
        fontSize: fontSizeMap[size],
      }}
    >
      {text}
    </p>
  );
}
