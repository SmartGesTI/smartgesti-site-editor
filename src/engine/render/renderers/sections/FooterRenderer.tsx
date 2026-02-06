/**
 * Footer Renderer
 * Renderiza rodapé com logo, descrição, colunas de links e redes sociais
 */

import React from "react";
import { socialIconPaths } from "../../../shared/socialIcons";

export function renderFooter(block: any): React.ReactNode {
  const {
    logo,
    description,
    columns = [],
    social = [],
    copyright,
    variant = "simple",
  } = block.props;

  const logoUrl = typeof logo === "string" ? logo : (logo?.src ?? "");
  const logoAlt = typeof logo === "string" ? "Logo" : (logo?.alt ?? "Logo");

  const isMultiColumn = variant === "multi-column" && columns.length > 0;

  return (
    <footer
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface, #f8fafc)",
        borderTop: "1px solid var(--sg-border, #e5e7eb)",
        padding: "3rem 0 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {isMultiColumn ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `2fr repeat(${columns.length}, 1fr)`,
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Brand column */}
            <div>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  style={{
                    height: "2.5rem",
                    objectFit: "contain",
                    marginBottom: "1rem",
                  }}
                />
              )}
              {description && (
                <p
                  style={{
                    color: "var(--sg-muted-text, #64748b)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                  }}
                >
                  {description}
                </p>
              )}
              {social.length > 0 && (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {social.map((item: any, index: number) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--sg-muted-text, #64748b)",
                        textDecoration: "none",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          d={socialIconPaths[item.platform] || socialIconPaths.github}
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link columns */}
            {columns.map((column: any, index: number) => (
              <div key={index}>
                <h4
                  style={{
                    fontWeight: 600,
                    marginBottom: "1rem",
                    color: "var(--sg-text, #0f172a)",
                  }}
                >
                  {column.title}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {column.links?.map((link: any, linkIndex: number) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        style={{
                          color: "var(--sg-muted-text, #64748b)",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                        }}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt={logoAlt}
                style={{
                  height: "2.5rem",
                  objectFit: "contain",
                  marginBottom: "1rem",
                }}
              />
            )}
            {description && (
              <p
                style={{
                  color: "var(--sg-muted-text, #64748b)",
                  fontSize: "0.875rem",
                  maxWidth: "400px",
                  margin: "0 auto 1rem",
                }}
              >
                {description}
              </p>
            )}
            {social.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                {social.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--sg-muted-text, #64748b)",
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d={socialIconPaths[item.platform] || socialIconPaths.github}
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copyright */}
        {copyright && (
          <div
            style={{
              borderTop: "1px solid var(--sg-border, #e5e7eb)",
              paddingTop: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "var(--sg-muted-text, #64748b)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              {copyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
