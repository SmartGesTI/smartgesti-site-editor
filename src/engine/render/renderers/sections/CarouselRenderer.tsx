/**
 * Carousel Renderer
 * Slider com slides de conteúdo
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderCarousel(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { items = [], showDots = true } = props;

  return (
    <div
      key={block.id}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--sg-radius, 0.5rem)",
      }}
    >
      <div style={{ display: "flex", transition: "transform 0.3s" }}>
        {(items as unknown[]).map((item: Record<string, any>, index: number) => (
          <div
            key={index}
            style={{
              minWidth: "100%",
              backgroundImage: item.image ? `url(${item.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            {item.title && (
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {item.title}
              </h2>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        ))}
      </div>
      {showDots && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {(items as unknown[]).map((_: unknown, index: number) => (
            <div
              key={index}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: index === 0 ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
