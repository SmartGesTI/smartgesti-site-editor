/**
 * Link Renderer
 * Renderiza links de texto com suporte a efeitos de hover configuráveis
 */

import React from "react";
import { LinkBlock } from "../../../schema/siteDocument";
import {
  generateLinkHoverStyles,
  type LinkHoverEffect,
} from "../../../shared/hoverEffects";

export function renderLink(block: LinkBlock): React.ReactNode {
  const {
    text,
    href,
    target = "_self",
    // Hover effects
    hoverEffect = "underline",
    hoverIntensity = 50,
    hoverColor,
  } = block.props;

  const primaryColorHex = "#3b82f6";
  const effectiveHoverColor = hoverColor || primaryColorHex;

  // Gerar CSS de hover
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  if (hoverEffect && hoverEffect !== "none") {
    const hoverResult = generateLinkHoverStyles({
      effect: hoverEffect as LinkHoverEffect,
      intensity: hoverIntensity,
      hoverColor: effectiveHoverColor,
    });

    if (hoverResult.base) {
      hoverCss += `${scope} { ${hoverResult.base} }`;
    }
    hoverCss += `${scope}:hover { ${hoverResult.hover} }`;
  }

  const styleElement = hoverCss ? <style>{hoverCss}</style> : null;

  return (
    <>
      {styleElement}
      <a
        key={block.id}
        data-block-id={block.id}
        href={href}
        target={target}
        style={{
          color: "var(--sg-primary, #3b82f6)",
          textDecoration: "none",
          transition: "all 0.3s ease",
          display: "inline-block",
          backgroundRepeat: "no-repeat",
        }}
      >
        {text}
      </a>
    </>
  );
}
