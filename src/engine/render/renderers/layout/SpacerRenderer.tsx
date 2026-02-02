/**
 * Spacer Renderer
 * Renderiza espaçamento vertical
 */

import React from "react";

export function renderSpacer(block: any): React.ReactNode {
  const { height = "2rem" } = block.props;
  return <div key={block.id} style={{ height }} />;
}
