/**
 * Footer Renderer
 * Renderiza rodapé com logo, descrição, colunas de links e redes sociais
 */

import React from "react";

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

  // SVG paths for social icons
  const socialIcons: Record<string, string> = {
    facebook:
      "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    twitter:
      "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    instagram:
      "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
    linkedin:
      "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    youtube:
      "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
    github:
      "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  };

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
                          d={socialIcons[item.platform] || socialIcons.github}
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
                        d={socialIcons[item.platform] || socialIcons.github}
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
