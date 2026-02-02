/**
 * Link Renderer
 * Renderiza links de texto
 */

import React from "react";
import { LinkBlock } from "../../../schema/siteDocument";

export function renderLink(block: LinkBlock): React.ReactNode {
  const { text, href, target = "_self" } = block.props;

  return (
    <a
      key={block.id}
      href={href}
      target={target}
      style={{
        color: "var(--sg-primary, #3b82f6)",
        textDecoration: "underline",
      }}
    >
      {text}
    </a>
  );
}
