/**
 * Input Renderer
 * Renderiza campo input de formulário
 */

import React from "react";

export function renderInput(block: any): React.ReactNode {
  const { name, label, placeholder, type = "text", required } = block.props;

  return (
    <div key={block.id}>
      {label && (
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "var(--sg-input-padding)",
          borderRadius: "var(--sg-input-radius)",
          border: "var(--sg-input-border-width) solid var(--sg-input-border)",
          backgroundColor: "var(--sg-input-bg)",
        }}
      />
    </div>
  );
}
