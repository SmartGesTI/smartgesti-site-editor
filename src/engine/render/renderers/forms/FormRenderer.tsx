/**
 * Form Renderer
 * Renderiza formulário com campos children
 */

import React from "react";
import { renderBlockNode } from "../../renderNodeImpl";

export function renderForm(block: any, depth: number): React.ReactNode {
  const {
    action,
    method = "post",
    children = [],
    submitText = "Enviar",
  } = block.props;

  return (
    <form
      key={block.id}
      action={action}
      method={method}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {children.map((child: any) => (
        <React.Fragment key={child.id}>
          {renderBlockNode(child, depth + 1)}
        </React.Fragment>
      ))}
      <button
        type="submit"
        style={{
          padding: "var(--sg-button-padding-md)",
          backgroundColor: "var(--sg-primary)",
          color: "var(--sg-primary-text)",
          borderRadius: "var(--sg-button-radius)",
          border: "none",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {submitText}
      </button>
    </form>
  );
}
