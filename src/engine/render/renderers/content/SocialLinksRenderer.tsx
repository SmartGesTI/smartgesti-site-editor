/**
 * Social Links Renderer
 * Renderiza links de redes sociais com ícones SVG
 */

import React from "react";
import { socialIconPaths } from "../../../shared/socialIcons";

export function renderSocialLinks(block: any): React.ReactNode {
  const { links = [], size = "md", variant = "default" } = block.props;

  const sizeMap: Record<string, string> = {
    sm: "1.25rem",
    md: "1.5rem",
    lg: "2rem",
  };

  const iconSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      key={block.id}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      {links.map((link: any, index: number) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width:
              variant === "filled" ? `calc(${iconSize} + 0.75rem)` : iconSize,
            height:
              variant === "filled" ? `calc(${iconSize} + 0.75rem)` : iconSize,
            backgroundColor:
              variant === "filled" ? "var(--sg-surface)" : "transparent",
            borderRadius: variant === "filled" ? "50%" : undefined,
            color: "var(--sg-muted-text)",
            textDecoration: "none",
          }}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={socialIconPaths[link.platform] || socialIconPaths.github} />
          </svg>
        </a>
      ))}
    </div>
  );
}
