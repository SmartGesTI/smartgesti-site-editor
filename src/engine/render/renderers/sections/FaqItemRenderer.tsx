/**
 * FaqItem Renderer
 * Renderiza item individual de FAQ (pergunta + resposta)
 */

import React from "react";

export function renderFaqItem(block: any): React.ReactNode {
  const { question, answer } = block.props;

  return (
    <details
      key={block.id}
      style={{
        borderBottom: "1px solid var(--sg-border)",
        padding: "1rem 0",
      }}
    >
      <summary
        style={{
          fontWeight: 600,
          cursor: "pointer",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {question}
        <span style={{ fontSize: "1.25rem" }}>+</span>
      </summary>
      <p style={{ marginTop: "1rem", color: "var(--sg-muted-text)" }}>
        {answer}
      </p>
    </details>
  );
}
