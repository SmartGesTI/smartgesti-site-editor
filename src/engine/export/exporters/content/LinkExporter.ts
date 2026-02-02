/**
 * Link Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml, resolveHref, linkTargetAttr } from "../../shared/htmlHelpers";

export function exportLink(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { text, href } = (block as any).props;

  const resolvedHref = resolveHref(href, basePath);
  const targetAttr = linkTargetAttr(resolvedHref, basePath) || ' target="_self"';

  return `<a ${dataBlockIdAttr(block.id)} href="${escapeHtml(resolvedHref)}"${targetAttr} style="color: var(--sg-primary, #3b82f6); text-decoration: underline;">${escapeHtml(text)}</a>`;
}
