/**
 * Button Renderer
 * Renderiza botões com variantes (primary, secondary, outline, ghost)
 */

import React from "react";
import { ButtonBlock } from "../../../schema/siteDocument";

export function renderButton(block: ButtonBlock): React.ReactNode {
  const { text, href, variant = "primary", size = "md" } = block.props;

  const baseStyles: React.CSSProperties = {
    padding:
      size === "sm"
        ? "0.5rem 1rem"
        : size === "lg"
          ? "0.75rem 1.5rem"
          : "0.625rem 1.25rem",
    borderRadius: "var(--sg-radius, 0.5rem)",
    border: "none",
    cursor: "pointer",
    fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem",
    fontWeight: 500,
    transition: "all 0.2s",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--sg-primary, #3b82f6)",
      color: "var(--sg-primary-text, #ffffff)",
    },
    secondary: {
      backgroundColor: "var(--sg-secondary, #6b7280)",
      color: "#ffffff",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--sg-primary, #3b82f6)",
      border: "1px solid var(--sg-primary, #3b82f6)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--sg-primary, #3b82f6)",
    },
  };

  const buttonStyle = { ...baseStyles, ...variantStyles[variant] };

  if (href) {
    return (
      <a key={block.id} href={href} style={buttonStyle}>
        {text}
      </a>
    );
  }

  return (
    <button key={block.id} style={buttonStyle}>
      {text}
    </button>
  );
}
