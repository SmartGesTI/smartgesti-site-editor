/**
 * Select Renderer
 * Renderiza campo select de formulário
 */

import React from "react";

export function renderFormSelect(block: any): React.ReactNode {
  const { name, label, placeholder, options = [], required } = block.props;

  return (
    <div key={block.id}>
      {label && (
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <select
        name={name}
        required={required}
        style={{
          width: "100%",
          padding: "var(--sg-input-padding)",
          borderRadius: "var(--sg-input-radius)",
          border: "var(--sg-input-border-width) solid var(--sg-input-border)",
          backgroundColor: "var(--sg-input-bg)",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option: any, index: number) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
