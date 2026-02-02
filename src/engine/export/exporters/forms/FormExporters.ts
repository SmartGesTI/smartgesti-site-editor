/**
 * Form Block Exporters
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportForm(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    action,
    method = "post",
    children = [],
    submitText = "Enviar",
  } = (block as any).props;

  if (!renderChild) {
    throw new Error("exportForm requires renderChild function");
  }

  const childrenHtml = children
    .map((c: Block) => renderChild(c, depth + 1, basePath, theme))
    .join("");

  return `<form ${dataBlockIdAttr(block.id)} action="${escapeHtml(action || "")}" method="${method}" style="display: flex; flex-direction: column; gap: 1rem;">${childrenHtml}<button type="submit" style="padding: 0.625rem 1.25rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius); border: none; font-weight: 500; cursor: pointer;">${escapeHtml(submitText)}</button></form>`;
}

export function exportInput(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    name,
    label,
    placeholder,
    type = "text",
    required,
  } = (block as any).props;

  const labelHtml = label
    ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
    : "";

  return `<div ${dataBlockIdAttr(block.id)}>${labelHtml}<input name="${escapeHtml(name)}" type="${type}" placeholder="${escapeHtml(placeholder || "")}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);" /></div>`;
}

export function exportTextarea(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    name,
    label,
    placeholder,
    rows = 4,
    required,
  } = (block as any).props;

  const labelHtml = label
    ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
    : "";

  return `<div ${dataBlockIdAttr(block.id)}>${labelHtml}<textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder || "")}" rows="${rows}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff); resize: vertical;"></textarea></div>`;
}

export function exportFormSelect(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    name,
    label,
    placeholder,
    options = [],
    required,
  } = (block as any).props;

  const labelHtml = label
    ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>`
    : "";

  const optionsHtml =
    (placeholder
      ? `<option value="">${escapeHtml(placeholder)}</option>`
      : "") +
    options
      .map(
        (o: any) =>
          `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`,
      )
      .join("");

  return `<div ${dataBlockIdAttr(block.id)}>${labelHtml}<select name="${escapeHtml(name)}" ${required ? "required" : ""} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);">${optionsHtml}</select></div>`;
}
