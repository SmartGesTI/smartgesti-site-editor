/**
 * TeamCard Renderer
 * Card de membro da equipe
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderTeamCard(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { name, role, bio, image, social = [] } = props;

  return (
    <div
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "var(--sg-card-radius)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {image && (
        <img
          src={image}
          alt={name}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 1rem",
          }}
        />
      )}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>{name}</h3>
      <p style={{ color: "var(--sg-primary)", marginBottom: "0.5rem" }}>
        {role}
      </p>
      {bio && (
        <p style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
          {bio}
        </p>
      )}
      {Array.isArray(social) && social.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {social.map((link: Record<string, any>, index: number) => (
            <a
              key={index}
              href={link.url}
              style={{ color: "var(--sg-muted-text)" }}
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
