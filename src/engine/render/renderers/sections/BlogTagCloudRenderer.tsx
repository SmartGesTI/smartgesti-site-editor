/**
 * BlogTagCloud Renderer
 * Card widget de sidebar com nuvem de tags do blog
 * Background: var(--sg-surface) para contraste com layout
 * Hover effects nas tags
 */

import React from "react";
import { resolveWidgetShadow } from "../../../shared/widgetStyles";
import { generateLinkHoverStyles } from "../../../shared/hoverEffects";

interface TagItem {
  name: string;
  count: number;
}

export function renderBlogTagCloud(block: any): React.ReactNode {
  const {
    title = "Tags",
    tags = [],
    variant = "badges",
    borderRadius = "0.75rem",
    shadow = "none",
    linkColor: linkColorProp,
    linkHoverColor: linkHoverColorProp,
    linkHoverEffect: linkHoverEffectProp,
    linkHoverIntensity: linkHoverIntensityProp,
  } = block.props;

  const linkColor = linkColorProp || "";
  const linkHoverColor = linkHoverColorProp || "";
  const linkHoverEffect = linkHoverEffectProp || "background";
  const linkHoverIntensity = linkHoverIntensityProp ?? 50;

  const widgetId = `widget-tags-${block.id}`;
  const boxShadow = resolveWidgetShadow(shadow);

  // Hover CSS for tag items
  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-tag-badge, #${widgetId} .sg-tag-list-item { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-tag-badge, #${widgetId} .sg-tag-list-item { transition: all 0.3s ease; }`;
    const hoverRule = `
      #${widgetId} .sg-tag-badge:hover,
      #${widgetId} .sg-tag-list-item:hover { ${styles.hover}; transition: all 0.3s ease; }`;
    hoverCSS = baseRule + "\n" + hoverRule;
  } else {
    hoverCSS = `
      #${widgetId} .sg-tag-badge, #${widgetId} .sg-tag-list-item { transition: all 0.2s ease; }
      #${widgetId} .sg-tag-badge:hover { opacity: 0.8; transform: translateY(-1px); }
      #${widgetId} .sg-tag-list-item:hover { background-color: rgba(0,0,0,0.04); }
    `;
  }

  return (
    <React.Fragment key={block.id}>
      <style>{hoverCSS}</style>
      <div
        id={widgetId}
        data-block-group="Conteúdo"
        style={{
          backgroundColor: "var(--sg-surface, var(--sg-bg))",
          borderRadius,
          border: "1px solid var(--sg-border, #e5e7eb)",
          boxShadow: boxShadow !== "none" ? boxShadow : undefined,
          overflow: "hidden",
        }}
      >
        {title && (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid var(--sg-border, #e5e7eb)",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                margin: 0,
                color: "var(--sg-text)",
              }}
            >
              {title}
            </h3>
          </div>
        )}

        <div style={{ padding: "1rem 1.25rem" }}>
          {tags.length === 0 ? (
            <p
              style={{
                color: "var(--sg-muted-text)",
                fontSize: "0.875rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              Nenhuma tag encontrada
            </p>
          ) : variant === "badges" ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {tags.map((tag: TagItem, index: number) => (
                <span
                  key={index}
                  className="sg-tag-badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    backgroundColor: "var(--sg-bg)",
                    color: linkColor || "var(--sg-text)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tag.name}
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--sg-muted-text)",
                      opacity: 0.7,
                    }}
                  >
                    ({tag.count})
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {tags.map((tag: TagItem, index: number) => (
                <div
                  key={index}
                  className="sg-tag-list-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: `calc(${borderRadius} * 0.5)`,
                    fontSize: "0.875rem",
                    color: linkColor || "var(--sg-text)",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                >
                  <span>{tag.name}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sg-muted-text)",
                      backgroundColor: "var(--sg-bg)",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
