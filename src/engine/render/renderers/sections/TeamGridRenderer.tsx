/**
 * TeamGrid Renderer
 * Grid de membros da equipe
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";
import { renderTeamCard } from "./TeamCardRenderer";

export function renderTeamGrid(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { title, subtitle, columns = 4, members = [] } = props;

  return (
    <section
      key={block.id}
      style={{ padding: "var(--sg-section-padding-md)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && <h2 style={{ fontSize: "2rem" }}>{title}</h2>}
            {subtitle && (
              <p style={{ color: "var(--sg-muted-text)" }}>{subtitle}</p>
            )}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "2rem",
          }}
        >
          {(members as unknown[]).map((member: Record<string, any>, index: number) =>
            renderTeamCard({
              id: `${block.id}-member-${index}`,
              type: "teamCard",
              props: member,
            }),
          )}
        </div>
      </div>
    </section>
  );
}
