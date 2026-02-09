/**
 * Badge Renderer
 * Renderiza badges/tags com variantes de cor
 */

import React from "react";

export function renderBadge(block: any): React.ReactNode {
  const { text, variant = "default", size = "md" } = block.props;

  const variantColors: Record<string, { bg: string; text: string }> = {
    default: {
      bg: "var(--sg-surface2, #f3f4f6)",
      text: "var(--sg-text, #1f2937)",
    },
    primary: {
      bg: "var(--sg-primary, #3b82f6)",
      text: "var(--sg-primary-text, #fff)",
    },
    secondary: { bg: "var(--sg-secondary, #6b7280)", text: "var(--sg-primary-text, #fff)" },
    success: { bg: "var(--sg-success, #10b981)", text: "var(--sg-primary-text, #fff)" },
    warning: { bg: "var(--sg-warning, #f59e0b)", text: "var(--sg-primary-text, #fff)" },
    danger: { bg: "var(--sg-danger, #ef4444)", text: "var(--sg-primary-text, #fff)" },
    info: { bg: "var(--sg-info, #3b82f6)", text: "var(--sg-primary-text, #fff)" },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.125rem 0.5rem", fontSize: "0.625rem" },
    md: { padding: "0.25rem 0.75rem", fontSize: "0.75rem" },
    lg: { padding: "0.375rem 1rem", fontSize: "0.875rem" },
  };

  const colors = variantColors[variant] || variantColors.default;

  return (
    <span
      key={block.id}
      style={{
        display: "inline-block",
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: "var(--sg-radius-pill, 9999px)",
        fontWeight: 500,
        ...sizeStyles[size],
      }}
    >
      {text}
    </span>
  );
}
