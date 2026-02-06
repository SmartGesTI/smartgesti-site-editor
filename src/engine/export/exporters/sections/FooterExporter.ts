/**
 * Footer Section Exporter
 * Mobile-first responsive: multi-column collapses to stack in mobile
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  generateLinkHoverStyles,
  type LinkHoverEffect,
} from "../../../shared/hoverEffects";
import { socialIconPaths } from "../../../shared/socialIcons";

export function exportFooter(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    logo,
    description,
    columns = [],
    social = [],
    copyright,
    variant = "simple",
    // Hover effects
    linkHoverEffect = "underline",
    linkHoverIntensity = 50,
    linkHoverColor,
  } = (block as any).props;

  // Determinar cor do hover (usa primary do tema se não definido)
  const hoverColor = linkHoverColor || theme?.colors?.primary || "#3b82f6";

  // Gerar estilos de hover para links
  const linkHoverStyles = generateLinkHoverStyles({
    effect: linkHoverEffect as LinkHoverEffect,
    intensity: linkHoverIntensity,
    hoverColor,
  });

  // Gerar CSS de hover com escopo do bloco
  const scope = `[data-block-id="${block.id}"]`;
  let hoverCss = "";

  if (linkHoverEffect !== "none") {
    // Estilos base se necessários
    if (linkHoverStyles.base) {
      hoverCss += `
        ${scope} .sg-footer__link {
          ${linkHoverStyles.base}
          transition: all 0.3s ease;
        }
      `;
    }
    // Estilos de hover
    hoverCss += `
      ${scope} .sg-footer__link:hover {
        ${linkHoverStyles.hover}
      }
    `;
  }

  const logoUrl = typeof logo === "string" ? logo : (logo?.src ?? "");
  const logoAlt = typeof logo === "string" ? "Logo" : (logo?.alt ?? "Logo");

  const isMultiColumn = variant === "multi-column" && columns.length > 0;

  const socialHtml = social
    .map(
      (item: any) =>
        `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" style="color: var(--sg-muted-text, #64748b); text-decoration: none;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${socialIconPaths[item.platform] || socialIconPaths.github}"/></svg></a>`,
    )
    .join("");

  const logoHtml = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(logoAlt)}" style="height: 2.5rem; object-fit: contain; margin-bottom: 1rem;" />`
    : "";

  const descHtml = description
    ? `<p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1rem;">${escapeHtml(description)}</p>`
    : "";

  const socialContainerHtml =
    social.length > 0
      ? `<div style="display: flex; gap: 0.75rem;">${socialHtml}</div>`
      : "";

  let contentHtml = "";
  if (isMultiColumn) {
    // Responsive footer grid: 1 col (mobile) → 2 cols (tablet) → 2fr + N×1fr (desktop)
    const footerId = generateScopedId(block.id || "", "footer-grid");
    const footerCss = `
      #${footerId} {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      @media (min-width: 640px) {
        #${footerId} {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 1024px) {
        #${footerId} {
          grid-template-columns: 2fr repeat(${columns.length}, 1fr);
        }
      }
    `;

    const columnsHtml = columns
      .map((col: any) => {
        const linksHtml = (col.links || [])
          .map(
            (link: any) =>
              `<li><a href="${escapeHtml(link.href)}" class="sg-footer__link" style="color: var(--sg-muted-text, #64748b); text-decoration: none; font-size: 0.875rem; display: inline-block; padding: 0.25rem 0; transition: all 0.3s ease;">${escapeHtml(link.text)}</a></li>`,
          )
          .join("");
        return `<div><h4 style="font-weight: 600; margin-bottom: 1rem; color: var(--sg-text, #0f172a);">${escapeHtml(col.title)}</h4><ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">${linksHtml}</ul></div>`;
      })
      .join("");

    contentHtml = `<style>${footerCss}${hoverCss}</style><div id="${footerId}" style="margin-bottom: 2rem;"><div>${logoHtml}${descHtml}${socialContainerHtml}</div>${columnsHtml}</div>`;
  } else {
    contentHtml = `<div style="text-align: center; margin-bottom: 1.5rem;">${logoHtml}${descHtml ? `<p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; max-width: 400px; margin: 0 auto 1rem;">${escapeHtml(description || "")}</p>` : ""}${social.length > 0 ? `<div style="display: flex; justify-content: center; gap: 1rem;">${socialHtml}</div>` : ""}</div>`;
  }

  const copyrightHtml = copyright
    ? `<div style="border-top: 1px solid var(--sg-border, #e5e7eb); padding-top: 1.5rem; text-align: center;"><p style="color: var(--sg-muted-text, #64748b); font-size: 0.875rem; margin: 0;">${escapeHtml(copyright)}</p></div>`
    : "";

  return `<footer ${dataBlockIdAttr(block.id)} style="background-color: var(--sg-surface, #f8fafc); border-top: 1px solid var(--sg-border, #e5e7eb); padding: 3rem 0 1.5rem;"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${contentHtml}${copyrightHtml}</div></footer>`;
}
