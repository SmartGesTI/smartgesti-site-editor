/**
 * BlogRecentPosts Renderer
 * Card widget de sidebar com lista dos posts mais recentes
 * Background: var(--sg-surface) para contraste com layout
 * Hover effects nos links de posts
 */

import React from "react";
import { resolveWidgetShadow } from "../../../shared/widgetStyles";
import { generateLinkHoverStyles } from "../../../shared/hoverEffects";

interface RecentPost {
  title: string;
  slug: string;
  date?: string;
  image?: string;
  category?: string;
}

export function renderBlogRecentPosts(block: any): React.ReactNode {
  const {
    title = "Posts Recentes",
    posts = [],
    showThumbnail = true,
    showDate = true,
    showCategory = false,
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

  const widgetId = `widget-recent-${block.id}`;
  const boxShadow = resolveWidgetShadow(shadow);

  // Hover CSS for post items
  let hoverCSS = "";
  if (linkHoverColor) {
    const styles = generateLinkHoverStyles({
      effect: linkHoverEffect as any,
      intensity: linkHoverIntensity,
      hoverColor: linkHoverColor,
    });
    const baseRule = styles.base
      ? `#${widgetId} .sg-recent-post { ${styles.base}; transition: all 0.3s ease; }`
      : `#${widgetId} .sg-recent-post { transition: all 0.3s ease; }`;
    const hoverRule = `#${widgetId} .sg-recent-post:hover { ${styles.hover}; transition: all 0.3s ease; }
      #${widgetId} .sg-recent-post:hover .sg-recent-title { color: ${linkHoverColor}; }`;
    hoverCSS = baseRule + "\n" + hoverRule;
  } else {
    hoverCSS = `
      #${widgetId} .sg-recent-post { transition: background-color 0.2s; }
      #${widgetId} .sg-recent-post:hover { background-color: rgba(0,0,0,0.04); }
      #${widgetId} .sg-recent-post:hover .sg-recent-title { color: var(--sg-primary); }
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

        <div style={{ padding: "0.5rem 0" }}>
          {posts.length === 0 ? (
            <p
              style={{
                padding: "1.5rem 1.25rem",
                color: "var(--sg-muted-text)",
                fontSize: "0.875rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              Nenhum post recente
            </p>
          ) : (
            posts.map((post: RecentPost, index: number) => (
              <a
                key={index}
                href={`/site/p/blog/${post.slug}`}
                className="sg-recent-post"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1.25rem",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background-color 0.2s",
                }}
              >
                {showThumbnail && post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: `calc(${borderRadius} * 0.5)`,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="sg-recent-title"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: linkColor || "var(--sg-text)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      transition: "color 0.2s",
                    }}
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {showDate && post.date && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--sg-muted-text)",
                        }}
                      >
                        {post.date}
                      </span>
                    )}
                    {showCategory && post.category && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--sg-primary)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
