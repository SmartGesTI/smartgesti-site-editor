/**
 * Render Node Implementation
 * Implementação da renderização de blocos usando Registry Pattern
 *
 * REFATORAÇÃO FASE 3:
 * - Switch gigante substituído por lookup no registry
 * - Renderizadores extraídos para arquivos separados
 * - Auto-registro via barrel imports
 * - Arquivo reduzido de 2937 linhas para ~200 linhas
 */

import React from "react";
import { Block } from "../schema/siteDocument";
import { renderRegistry } from "./registry/renderRegistry";

// Auto-importa e registra TODOS os renderizadores
// O import por si só executa o código de registro em cada index.ts
import "./renderers";

/**
 * Renderiza um bloco recursivamente
 * Factory pattern com lookup O(1) no registry
 */
export function renderBlockNode(
  block: Block,
  depth: number = 0,
): React.ReactNode {
  // Tentar obter renderizador do registry
  const renderer = renderRegistry.get(block.type);

  if (renderer) {
    return renderer(block, depth);
  }

  // Renderizadores temporários (ainda não extraídos)
  // TODO: Migrar para arquivos separados nas próximas iterações
  switch (block.type) {
    case "countdown":
      return renderCountdown(block);
    case "carousel":
      return renderCarousel(block);
    case "blogCard":
      return renderBlogCard(block);
    case "blogCardGrid":
      return renderBlogCardGrid(block);
    case "teamCard":
      return renderTeamCard(block);
    case "teamGrid":
      return renderTeamGrid(block);
    case "courseCardGrid":
      return renderCourseCardGrid(block);
    case "categoryCardGrid":
      return renderCategoryCardGrid(block);
    default:
      console.warn(`Unknown block type: ${block.type}`);
      return (
        <div
          key={block.id}
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "0.25rem",
          }}
        >
          Bloco desconhecido: {block.type}
        </div>
      );
  }
}

// ============================================================================
// RENDERIZADORES TEMPORÁRIOS (A SEREM MIGRADOS)
// ============================================================================

function renderCountdown(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const {
    title,
    description,
    endDate: _endDate,
    showPlaceholders = true,
    buttonText,
    buttonHref,
    variant = "default",
    badgeText,
    bg,
  } = props;
  const isBanner = variant === "banner";

  const sectionStyle: React.CSSProperties = {
    padding: "var(--sg-section-padding-md, 4rem 2rem)",
    backgroundColor: bg || "var(--sg-primary)",
    color: "#fff",
    position: "relative",
  };

  return (
    <section
      key={block.id}
      className="sg-countdown"
      style={sectionStyle}
      data-variant={variant}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {isBanner && badgeText && (
          <div
            className="sg-countdown__badge-circle"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              textAlign: "center",
              padding: "1rem",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {badgeText}
          </div>
        )}
        <div style={{ flex: 1, minWidth: "200px" }}>
          {title && (
            <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
              {title}
            </h2>
          )}
          {description && (
            <p style={{ opacity: 0.9, marginBottom: "1rem" }}>{description}</p>
          )}
          {showPlaceholders && (
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>00</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
          {buttonText && (
            <a
              href={buttonHref || "#"}
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#fff",
                color: "var(--sg-primary)",
                fontWeight: 600,
                borderRadius: "var(--sg-button-radius, 0.5rem)",
                textDecoration: "none",
              }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function renderCarousel(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { items = [], showDots = true, autoplay = false } = props;

  return (
    <div
      key={block.id}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--sg-radius, 0.5rem)",
      }}
    >
      <div style={{ display: "flex", transition: "transform 0.3s" }}>
        {(items as unknown[]).map((item: Record<string, any>, index: number) => (
          <div
            key={index}
            style={{
              minWidth: "100%",
              backgroundImage: item.image ? `url(${item.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            {item.title && (
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {item.title}
              </h2>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        ))}
      </div>
      {showDots && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {(items as unknown[]).map((_: unknown, index: number) => (
            <div
              key={index}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: index === 0 ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function renderBlogCard(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const {
    title,
    excerpt,
    image,
    author,
    date,
    category,
    readTime,
    href,
  } = props;

  return (
    <article
      key={block.id}
      style={{
        backgroundColor: "var(--sg-surface)",
        borderRadius: "var(--sg-card-radius)",
        overflow: "hidden",
        boxShadow: "var(--sg-card-shadow)",
      }}
    >
      {image && (
        <div
          style={{
            height: "200px",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div style={{ padding: "1.5rem" }}>
        {category && (
          <span
            style={{
              color: "var(--sg-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {category}
          </span>
        )}
        <h3 style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}>{title}</h3>
        <p style={{ color: "var(--sg-muted-text)", marginBottom: "1rem" }}>
          {excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            color: "var(--sg-muted-text)",
          }}
        >
          <span>{author}</span>
          <span>{date}</span>
          {readTime && <span>{readTime} min read</span>}
        </div>
        {href && (
          <a
            href={href}
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "var(--sg-primary)",
              fontWeight: 500,
            }}
          >
            Ler mais →
          </a>
        )}
      </div>
    </article>
  );
}

function renderBlogCardGrid(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { title, subtitle, columns = 3, posts = [] } = props;

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
          {(posts as unknown[]).map((post: Record<string, any>, index: number) =>
            renderBlogCard({
              id: `${block.id}-post-${index}`,
              type: 'blogCard',
              props: post,
            }),
          )}
        </div>
      </div>
    </section>
  );
}

function renderTeamCard(block: Block): React.ReactNode {
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

function renderTeamGrid(block: Block): React.ReactNode {
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
              type: 'teamCard',
              props: member,
            }),
          )}
        </div>
      </div>
    </section>
  );
}

function renderCourseCardGrid(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { title, subtitle, columns = 3, courses = [] } = props;

  return (
    <section
      key={block.id}
      style={{
        padding: "var(--sg-section-padding-md)",
        backgroundColor: "var(--sg-surface)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && <h2>{title}</h2>}
            {subtitle && <p style={{ color: "var(--sg-muted-text)" }}>{subtitle}</p>}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "2rem",
          }}
        >
          {(courses as unknown[]).map((course: Record<string, any>, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: "var(--sg-bg)",
                borderRadius: "var(--sg-card-radius)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "200px",
                  backgroundImage: `url(${course.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3>{course.title}</h3>
                <p style={{ color: "var(--sg-muted-text)" }}>{course.description}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <span>{course.duration}</span>
                  <span style={{ fontWeight: 600 }}>{course.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderCategoryCardGrid(block: Block): React.ReactNode {
  const props = block.props as Record<string, any>;
  const { title, subtitle, columns = 4, categories = [] } = props;

  return (
    <section
      key={block.id}
      style={{ padding: "var(--sg-section-padding-md)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {title && <h2>{title}</h2>}
            {subtitle && <p style={{ color: "var(--sg-muted-text)" }}>{subtitle}</p>}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "1.5rem",
          }}
        >
          {(categories as unknown[]).map((category: Record<string, any>, index: number) => (
            <a
              key={index}
              href={category.href || "#"}
              style={{
                backgroundColor: "var(--sg-surface)",
                borderRadius: "var(--sg-card-radius)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {category.icon && <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{category.icon}</div>}
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{category.name}</h3>
              <p style={{ color: "var(--sg-muted-text)", fontSize: "0.875rem" }}>
                {category.count} cursos
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
