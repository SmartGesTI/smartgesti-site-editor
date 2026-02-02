/**
 * Pricing Renderer
 * Renderiza seção de pricing com múltiplos plans
 */

import React from "react";
import { renderPricingCard } from "./PricingCardRenderer";

export function renderPricing(block: any): React.ReactNode {
  const { title, subtitle, plans = [] } = block.props;

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {plans.map((plan: any, index: number) =>
            renderPricingCard({
              id: `${block.id}-plan-${index}`,
              props: plan,
            }),
          )}
        </div>
      </div>
    </section>
  );
}
