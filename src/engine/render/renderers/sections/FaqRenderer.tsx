/**
 * Faq Renderer
 * Renderiza seção de FAQ com título e lista de itens
 */

import React from "react";
import { renderFaqItem } from "./FaqItemRenderer";

export function renderFaq(block: any): React.ReactNode {
  const { title, subtitle, items = [] } = block.props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-bg)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
        <div>
          {items.map((item: any, index: number) =>
            renderFaqItem({ id: `${block.id}-faq-${index}`, props: item }),
          )}
        </div>
      </div>
    </section>
  );
}
