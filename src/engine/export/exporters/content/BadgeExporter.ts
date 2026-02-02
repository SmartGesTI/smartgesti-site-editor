/**
 * Badge Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportBadge(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { text, variant = "default", size = "md" } = (block as any).props;

  const variantColors: Record<string, { bg: string; text: string }> = {
    default: {
      bg: "var(--sg-surface2, #f3f4f6)",
      text: "var(--sg-text, #1f2937)",
    },
    primary: { bg: "var(--sg-primary, #3b82f6)", text: "#fff" },
    secondary: { bg: "var(--sg-secondary, #6b7280)", text: "#fff" },
    success: { bg: "var(--sg-success, #10b981)", text: "#fff" },
    warning: { bg: "var(--sg-warning, #f59e0b)", text: "#fff" },
    danger: { bg: "var(--sg-danger, #ef4444)", text: "#fff" },
  };

  const sizeStyles: Record<string, string> = {
    sm: "padding: 0.125rem 0.5rem; font-size: 0.625rem;",
    md: "padding: 0.25rem 0.75rem; font-size: 0.75rem;",
    lg: "padding: 0.375rem 1rem; font-size: 0.875rem;",
  };

  const colors = variantColors[variant] || variantColors.default;

  return `<span ${dataBlockIdAttr(block.id)} style="display: inline-block; background-color: ${colors.bg}; color: ${colors.text}; border-radius: 9999px; font-weight: 500; ${sizeStyles[size] || sizeStyles.md}">${escapeHtml(text)}</span>`;
}
