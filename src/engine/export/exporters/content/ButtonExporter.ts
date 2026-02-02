/**
 * Button Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";

export function exportButton(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    text,
    href,
    variant = "primary",
    size = "md",
  } = (block as any).props;

  const padding =
    size === "sm"
      ? "0.5rem 1rem"
      : size === "lg"
        ? "0.75rem 1.5rem"
        : "0.625rem 1.25rem";

  const fontSize =
    size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem";

  const variantStyles: Record<string, string> = {
    primary:
      "background-color: var(--sg-primary, #3b82f6); color: var(--sg-primary-text, #ffffff);",
    secondary:
      "background-color: var(--sg-secondary, #6b7280); color: #ffffff;",
    outline:
      "background-color: transparent; color: var(--sg-primary, #3b82f6); border: 1px solid var(--sg-primary, #3b82f6);",
    ghost:
      "background-color: transparent; color: var(--sg-primary, #3b82f6);",
  };

  const style = [
    `padding: ${padding}`,
    "border-radius: var(--sg-radius, 0.5rem)",
    "border: none",
    "cursor: pointer",
    `font-size: ${fontSize}`,
    "font-weight: 500",
    "transition: all 0.2s",
    variantStyles[variant],
  ]
    .filter(Boolean)
    .join("; ");

  if (href) {
    const resolvedHref = resolveHref(href, basePath);
    const targetAttr = linkTargetAttr(resolvedHref, basePath);
    return `<a ${dataBlockIdAttr(block.id)} href="${escapeHtml(resolvedHref)}"${targetAttr} style="${style}">${escapeHtml(text)}</a>`;
  }

  return `<button ${dataBlockIdAttr(block.id)} style="${style}">${escapeHtml(text)}</button>`;
}
