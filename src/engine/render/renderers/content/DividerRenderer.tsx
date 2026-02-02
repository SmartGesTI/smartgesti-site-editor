/**
 * Divider Renderer
 * Renderiza linha divisória horizontal
 */

import React from "react";
import { DividerBlock } from "../../../schema/siteDocument";

export function renderDivider(block: DividerBlock): React.ReactNode {
  const { color = "#e5e7eb", thickness = "1px" } = block.props;

  return (
    <hr
      key={block.id}
      style={{
        border: "none",
        borderTop: `${thickness} solid ${color}`,
        margin: "1rem 0",
      }}
    />
  );
}
