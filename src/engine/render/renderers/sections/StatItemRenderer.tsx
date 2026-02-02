/**
 * StatItem Renderer
 * Renderiza item individual de estatística
 */

import React from "react";

export function renderStatItem(block: any): React.ReactNode {
  const { value, label, prefix, suffix } = block.props;

  return (
    <div key={block.id} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "var(--sg-primary)",
        }}
      >
        {prefix}
        {value}
        {suffix}
      </div>
      <div style={{ color: "var(--sg-muted-text)" }}>{label}</div>
    </div>
  );
}
