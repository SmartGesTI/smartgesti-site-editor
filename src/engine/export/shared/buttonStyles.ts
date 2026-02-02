/**
 * Utilitários compartilhados para estilos de botões
 * Reutilizável entre React e HTML
 */

import { stylesToString } from "./stylesToString";

export interface ButtonStyleProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Retorna estilos de botão como objeto
 */
export function getButtonStylesObject(props: ButtonStyleProps): Record<string, string> {
  const { variant = "primary", size = "md" } = props;

  const padding =
    size === "sm"
      ? "0.5rem 1rem"
      : size === "lg"
        ? "0.75rem 1.5rem"
        : "0.625rem 1.25rem";

  const fontSize =
    size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem";

  const baseStyles: Record<string, string> = {
    padding,
    fontSize,
    borderRadius: "var(--sg-radius, 0.5rem)",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  };

  const variantStyles: Record<string, Record<string, string>> = {
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

  return { ...baseStyles, ...(variantStyles[variant] || variantStyles.primary) };
}

/**
 * Retorna estilos de botão como string CSS inline
 */
export function getButtonStyles(props: ButtonStyleProps): string {
  const styles = getButtonStylesObject(props);
  return stylesToString(styles);
}
