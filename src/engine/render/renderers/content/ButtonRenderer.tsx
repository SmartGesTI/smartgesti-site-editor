/**
 * Button Renderer
 * Renderiza botões com variantes (primary, secondary, outline, ghost)
 * Inclui suporte a efeitos de hover configuráveis
 */

import React from "react";
import { ButtonBlock } from "../../../schema/siteDocument";
import {
  generateButtonHoverStyles,
  generateButtonOverlayCSS,
  getButtonHoverKeyframes,
  type ButtonHoverEffect,
  type ButtonHoverOverlay,
} from "../../../shared/hoverEffects";

export function renderButton(block: ButtonBlock): React.ReactNode {
  const {
    text,
    href,
    variant = "primary",
    size = "md",
    // Hover effects
    hoverEffect = "darken",
    hoverIntensity = 50,
    hoverOverlay = "none",
    hoverIconName = "arrow-right",
  } = block.props;

  // Cores baseadas na variante
  const primaryColor = "var(--sg-primary, #3b82f6)";
  const primaryColorHex = "#3b82f6"; // Para cálculos de hover
  const primaryText = "var(--sg-primary-text, #ffffff)";
  const primaryTextHex = "#ffffff";

  const baseStyles: React.CSSProperties = {
    padding:
      size === "sm"
        ? "0.5rem 1rem"
        : size === "lg"
          ? "0.75rem 1.5rem"
          : "0.625rem 1.25rem",
    borderRadius: "var(--sg-radius, 0.5rem)",
    border: "none",
    cursor: "pointer",
    fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem",
    fontWeight: 500,
    transition: "all 0.2s",
    position: "relative" as const,
    overflow: "hidden" as const,
    display: "inline-block",
    textDecoration: "none",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: primaryColor,
      color: primaryText,
    },
    secondary: {
      backgroundColor: "var(--sg-secondary, #6b7280)",
      color: "#ffffff",
    },
    outline: {
      backgroundColor: "transparent",
      color: primaryColor,
      border: `2px solid ${primaryColor}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: primaryColor,
    },
  };

  const buttonStyle = { ...baseStyles, ...variantStyles[variant] };

  // Gerar CSS de hover
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  // Efeito principal
  if (hoverEffect && hoverEffect !== "none") {
    const hoverResult = generateButtonHoverStyles({
      effect: hoverEffect as ButtonHoverEffect,
      intensity: hoverIntensity,
      buttonColor: primaryColorHex,
      buttonTextColor: primaryTextHex,
      variant: variant === "outline" ? "outline" : variant === "ghost" ? "ghost" : "solid",
    });

    if (hoverResult.base) {
      hoverCss += `${scope} { ${hoverResult.base} }`;
    }
    hoverCss += `${scope}:hover { ${hoverResult.hover} }`;
    hoverCss += getButtonHoverKeyframes();
  }

  // Efeito overlay (adicional)
  // Nota: O ícone agora usa currentColor, então herda automaticamente a cor do texto do botão
  if (hoverOverlay && hoverOverlay !== "none") {
    hoverCss += generateButtonOverlayCSS(scope, {
      overlay: hoverOverlay as ButtonHoverOverlay,
      primaryColor: primaryColorHex,
      iconName: hoverIconName,
    });
  }

  const styleElement = hoverCss ? <style>{hoverCss}</style> : null;

  if (href) {
    return (
      <>
        {styleElement}
        <a key={block.id} data-block-id={block.id} href={href} style={buttonStyle}>
          {text}
        </a>
      </>
    );
  }

  return (
    <>
      {styleElement}
      <button key={block.id} data-block-id={block.id} style={buttonStyle}>
        {text}
      </button>
    </>
  );
}
