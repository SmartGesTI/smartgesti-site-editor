/**
 * Avatar Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportAvatar(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { src, name, size = "md" } = (block as any).props;

  const sizeMap: Record<string, string> = {
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
  };

  const avatarSize = sizeMap[size] || sizeMap.md;

  const initials = name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (src) {
    return `<img ${dataBlockIdAttr(block.id)} src="${escapeHtml(src)}" alt="${escapeHtml(name || "Avatar")}" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; object-fit: cover;" />`;
  }

  return `<div ${dataBlockIdAttr(block.id)} style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; background-color: var(--sg-primary, #3b82f6); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: calc(${avatarSize} / 2.5);">${initials}</div>`;
}
