/**
 * Image Renderer
 * Renderiza imagens com fallback
 */

import React from "react";
import { ImageBlock } from "../../../schema/siteDocument";
import { PLACEHOLDER_IMAGE_URL } from "../../../presets/heroVariations";

export function renderImage(block: ImageBlock): React.ReactNode {
  const { src, alt = "", width, height, objectFit = "cover" } = block.props;
  const imgSrc = src || PLACEHOLDER_IMAGE_URL;

  return (
    <img
      key={block.id}
      src={imgSrc}
      alt={alt}
      style={{
        width: width || "100%",
        height: height || "auto",
        objectFit,
      }}
      onError={(e) => {
        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL;
      }}
    />
  );
}
