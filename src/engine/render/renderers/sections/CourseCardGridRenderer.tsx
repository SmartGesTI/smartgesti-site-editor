/**
 * CourseCardGrid Renderer
 * Grid de cards de cursos
 */

import React from "react";
import { Block } from "../../../schema/siteDocument";

export function renderCourseCardGrid(block: Block): React.ReactNode {
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
