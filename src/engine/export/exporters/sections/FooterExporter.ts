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
        `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" style="color: var(--sg-muted-text, #64748b); text-decoration: none;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${socialIcons[item.platform] || socialIcons.github}"/></svg></a>`,
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
