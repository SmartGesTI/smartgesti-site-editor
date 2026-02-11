/**
 * Card Hover Effects Utilities
 * Gera CSS para efeitos de hover em cards
 * Reutilizável em qualquer componente de card
 */

export type CardHoverEffect = "none" | "lift" | "scale" | "glow";

export interface CardHoverStyles {
  /** CSS for the card wrapper */
  base: string;
  /** CSS for hover state */
  hover: string;
}

/**
 * Generates CSS for card hover effects
 * @param effect - The hover effect type
 * @param shadowToken - Optional shadow to enhance on hover
 */
export function generateCardHoverStyles(
  effect: CardHoverEffect = "lift",
  shadowToken: "sm" | "md" | "lg" | "xl" = "lg",
): CardHoverStyles {
  const hoverShadows = {
    sm: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  switch (effect) {
    case "lift":
      return {
        base: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
        hover: `transform: translateY(-8px); box-shadow: ${hoverShadows[shadowToken]};`,
      };

    case "scale":
      return {
        base: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
        hover: `transform: scale(1.02); box-shadow: ${hoverShadows[shadowToken]};`,
      };

    case "glow":
      return {
        base: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
        hover: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), ${hoverShadows[shadowToken]};`,
      };

    case "none":
    default:
      return {
        base: "",
        hover: "",
      };
  }
}

/**
 * Generates inline CSS string for card hover (for React style prop)
 */
export function getCardHoverInlineStyles(
  effect: CardHoverEffect = "lift",
): Record<string, string | number> {
  if (effect === "none") return {};

  return {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  };
}
