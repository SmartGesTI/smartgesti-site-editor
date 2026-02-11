/**
 * Link/Button Styles Utilities
 * Gera estilos para links e botões em cards e componentes
 * Reutilizável em qualquer componente que precise de CTAs
 */

export type LinkButtonStyle = "link" | "button" | "button-outline";

export interface LinkButtonStyleConfig {
  /** Main color */
  color: string;
  /** Hover color */
  hoverColor: string;
}

/**
 * Generates inline styles for link/button elements
 */
export function getLinkButtonStyles(
  style: LinkButtonStyle = "link",
  config: LinkButtonStyleConfig,
): Record<string, string | number> {
  const { color, hoverColor } = config;

  const baseStyles = {
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  switch (style) {
    case "button":
      return {
        ...baseStyles,
        display: "inline-block",
        padding: "0.625rem 1.25rem",
        backgroundColor: color,
        color: "#ffffff",
        borderRadius: "0.375rem",
        border: "none",
      };

    case "button-outline":
      return {
        ...baseStyles,
        display: "inline-block",
        padding: "0.625rem 1.25rem",
        backgroundColor: "transparent",
        color: color,
        borderRadius: "0.375rem",
        border: `1px solid ${color}`,
      };

    case "link":
    default:
      return {
        ...baseStyles,
        display: "inline-block",
        color: color,
      };
  }
}

/**
 * Generates CSS string for link/button hover states
 * Returns CSS rules for <style> tag
 */
export function generateLinkButtonHoverCSS(
  selector: string,
  style: LinkButtonStyle = "link",
  config: LinkButtonStyleConfig,
): string {
  const { hoverColor } = config;

  switch (style) {
    case "button":
      return `
        ${selector}:hover {
          background-color: ${hoverColor};
          transform: translateY(-1px);
        }
      `;

    case "button-outline":
      return `
        ${selector}:hover {
          background-color: ${hoverColor};
          color: #ffffff;
          border-color: ${hoverColor};
        }
      `;

    case "link":
    default:
      return `
        ${selector}:hover {
          color: ${hoverColor};
          text-decoration: underline;
        }
      `;
  }
}
