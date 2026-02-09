/**
 * Feature Renderer
 * Renderiza um item de feature com ícone, título e descrição
 */

import React from "react";
import { renderIcon } from "../content/IconRenderer";

export function renderFeature(block: any): React.ReactNode {
  const { icon, title, description } = block.props;

  return (
    <div
      key={block.id}
      data-block-group="Conteúdo"
      style={{
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      {icon && (
        <div
          style={{
            width: "3rem",
            height: "3rem",
            backgroundColor: "var(--sg-primary)",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "var(--sg-primary-text)",
          }}
        >
          {renderIcon({
            id: `${block.id}-icon`,
            props: { name: icon, size: "md", color: "var(--sg-primary-text, #fff)" },
          })}
        </div>
      )}
      <h3
        style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}
      >
        {title}
      </h3>
      <p style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
        {description}
      </p>
    </div>
  );
}
