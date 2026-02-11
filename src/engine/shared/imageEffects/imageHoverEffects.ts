/**
 * Image Hover Effects Utilities
 * Gera CSS para efeitos de hover em imagens
 * Reutilizável em cards, galerias, hero sections, etc
 */

export type ImageHoverEffect = "none" | "zoom" | "brightness";

export interface ImageHoverStyles {
  /** CSS for the image wrapper container */
  container: string;
  /** CSS for the img element base state */
  imageBase: string;
  /** CSS for the img element hover state */
  imageHover: string;
}

/**
 * Generates CSS for image hover effects
 * Returns styles for container and image element
 */
export function generateImageHoverStyles(
  effect: ImageHoverEffect = "zoom",
): ImageHoverStyles {
  switch (effect) {
    case "zoom":
      return {
        container: "overflow: hidden;",
        imageBase: "transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);",
        imageHover: "transform: scale(1.1);",
      };

    case "brightness":
      return {
        container: "overflow: hidden;",
        imageBase: "transition: filter 0.3s ease;",
        imageHover: "filter: brightness(1.1);",
      };

    case "none":
    default:
      return {
        container: "",
        imageBase: "",
        imageHover: "",
      };
  }
}

/**
 * Generates inline CSS for image container (React style prop)
 */
export function getImageContainerStyles(
  effect: ImageHoverEffect = "zoom",
): Record<string, string> {
  if (effect === "none") return {};
  return {
    overflow: "hidden",
  };
}

/**
 * Generates inline CSS for image element (React style prop)
 */
export function getImageBaseStyles(
  effect: ImageHoverEffect = "zoom",
): Record<string, string> {
  if (effect === "none") return {};

  if (effect === "zoom" || effect === "brightness") {
    return {
      transition: effect === "zoom" ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "filter 0.3s ease",
    };
  }

  return {};
}
