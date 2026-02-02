/**
 * Testimonial Renderer
 * Renderiza depoimento individual
 */

import React from "react";
import { renderAvatar } from "../content/AvatarRenderer";

export function renderTestimonial(block: any): React.ReactNode {
  const { quote, authorName, authorRole, authorCompany, authorAvatar, rating } =
    block.props;

  return (
    <div
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "var(--sg-card-radius)",
        padding: "2rem",
      }}
    >
      {rating && (
        <div style={{ marginBottom: "1rem", color: "#fbbf24" }}>
          {"\u2605".repeat(rating)}
        </div>
      )}
      <blockquote
        style={{
          fontSize: "1rem",
          marginBottom: "1.5rem",
          fontStyle: "italic",
        }}
      >
        "{quote}"
      </blockquote>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {authorAvatar ? (
          <img
            src={authorAvatar}
            alt={authorName}
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          renderAvatar({
            id: `${block.id}-avatar`,
            props: { name: authorName, size: "lg" },
          })
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{authorName}</div>
          {(authorRole || authorCompany) && (
            <div
              style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}
            >
              {authorRole}
              {authorRole && authorCompany && ", "}
              {authorCompany}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
