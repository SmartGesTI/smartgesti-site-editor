/**
 * Textarea Renderer
 * Renderiza campo textarea de formulário
 */

import React from "react";

export function renderTextarea(block: any): React.ReactNode {
  const { name, label, placeholder, rows = 4, required } = block.props;

  return (
    <div key={block.id}>
      {label && (
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        style={{
          width: "100%",
          padding: "var(--sg-input-padding)",
          borderRadius: "var(--sg-input-radius)",
          border: "var(--sg-input-border-width) solid var(--sg-input-border)",
          backgroundColor: "var(--sg-input-bg)",
          resize: "vertical",
        }}
      />
    </div>
  );
}
