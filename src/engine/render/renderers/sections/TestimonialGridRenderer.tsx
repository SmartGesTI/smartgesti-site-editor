/**
 * TestimonialGrid Renderer
 * Renderiza grid de testimonials
 */

import React from "react";
import { renderTestimonial } from "./TestimonialRenderer";

export function renderTestimonialGrid(block: any): React.ReactNode {
  const { title, subtitle, columns = 3, testimonials = [] } = block.props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div data-block-group="Conteúdo" style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && (
              <h2
                style={{
                  fontSize: "var(--sg-heading-h2)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{ color: "var(--sg-muted-text)", fontSize: "1.125rem" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div
          data-block-group="Layout"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "2rem",
          }}
        >
          {testimonials.map((testimonial: any, index: number) =>
            renderTestimonial({
              id: `${block.id}-testimonial-${index}`,
              props: testimonial,
            }),
          )}
        </div>
      </div>
    </section>
  );
}
