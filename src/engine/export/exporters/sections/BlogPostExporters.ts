/**
 * Blog Post Exporters
 * BlogPostCard, BlogPostGrid, BlogPostDetail
 * Mobile-first responsive layouts for blog plugin blocks
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import {
  resolveResponsiveColumns,
  generateResponsiveGridStyles,
} from "../../shared/responsiveGridHelper";

// ---------------------------------------------------------------------------
// BlogPostCard
// ---------------------------------------------------------------------------

export function exportBlogPostCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    excerpt,
    image,
    date,
    category,
    authorName,
    authorAvatar,
    readingTime,
    linkHref,
    linkText,
    variant = "default",
    showImage = true,
    showCategory = true,
    showDate = true,
    showAuthor = false,
    showReadingTime = false,
  } = (block as any).props;

  // ---------- variant: horizontal ----------
  if (variant === "horizontal") {
    const imgHtml =
      showImage && image
        ? `<div style="width: 260px; min-height: 180px; flex-shrink: 0; background-image: url(${escapeHtml(image)}); background-size: cover; background-position: center;"></div>`
        : "";

    const metaParts: string[] = [];
    if (showCategory && category) metaParts.push(escapeHtml(category));
    if (showDate && date) metaParts.push(escapeHtml(date));
    if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));
    const metaHtml = metaParts.length
      ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${metaParts.join(" &middot; ")}</p>`
      : "";

    const authorHtml =
      showAuthor && authorName
        ? `<div style="display: flex; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 0.75rem;">${
            authorAvatar
              ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />`
              : ""
          }<span style="font-size: 0.8rem; color: var(--sg-muted-text);">${escapeHtml(authorName)}</span></div>`
        : "";

    const linkHtml = linkText
      ? `<a href="${escapeHtml(linkHref || "#")}" style="color: var(--sg-primary); font-weight: 500; text-decoration: none; font-size: 0.875rem;">${escapeHtml(linkText)}</a>`
      : "";

    return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-post-card" style="display: flex; background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);" data-variant="horizontal">${imgHtml}<div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 0.75rem;">${escapeHtml(excerpt)}</p>` : ""}${linkHtml}${authorHtml}</div></article>`;
  }

  // ---------- variant: minimal ----------
  if (variant === "minimal") {
    const metaParts: string[] = [];
    if (showCategory && category) metaParts.push(escapeHtml(category));
    if (showDate && date) metaParts.push(escapeHtml(date));
    if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));
    const metaHtml = metaParts.length
      ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${metaParts.join(" &middot; ")}</p>`
      : "";

    const linkHtml = linkText
      ? `<a href="${escapeHtml(linkHref || "#")}" style="color: var(--sg-primary); font-weight: 500; text-decoration: none; font-size: 0.875rem;">${escapeHtml(linkText)}</a>`
      : "";

    return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-post-card" style="padding: 1.25rem 0; border-bottom: 1px solid var(--sg-border, #e5e7eb);" data-variant="minimal">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 0.5rem;">${escapeHtml(excerpt)}</p>` : ""}${linkHtml}</article>`;
  }

  // ---------- variant: default ----------
  const imgHtml =
    showImage && image
      ? `<div style="height: 200px; background-image: url(${escapeHtml(image)}); background-size: cover; background-position: center;"></div>`
      : "";

  const metaParts: string[] = [];
  if (showCategory && category) metaParts.push(escapeHtml(category));
  if (showDate && date) metaParts.push(escapeHtml(date));
  if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));
  const metaHtml = metaParts.length
    ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${metaParts.join(" &middot; ")}</p>`
    : "";

  const authorHtml =
    showAuthor && authorName
      ? `<div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">${
          authorAvatar
            ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />`
            : ""
        }<span style="font-size: 0.8rem; color: var(--sg-muted-text);">${escapeHtml(authorName)}</span></div>`
      : "";

  const linkHtml = linkText
    ? `<a href="${escapeHtml(linkHref || "#")}" style="color: var(--sg-primary); font-weight: 500; text-decoration: none; font-size: 0.875rem;">${escapeHtml(linkText)}</a>`
    : "";

  return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-post-card" style="background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);" data-variant="default">${imgHtml}<div style="padding: 1.5rem;">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1rem;">${escapeHtml(excerpt)}</p>` : ""}${linkHtml}${authorHtml}</div></article>`;
}

// ---------------------------------------------------------------------------
// BlogPostGrid
// ---------------------------------------------------------------------------

export function exportBlogPostGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, _depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    title,
    subtitle,
    columns = 3,
    cards = [],
    showViewAll = false,
    viewAllText,
    viewAllHref,
  } = (block as any).props;

  // Responsive grid: 1 col (mobile) -> 2 cols (tablet) -> N cols (desktop)
  const gridId = generateScopedId(block.id || "", "blog-post-grid");
  const responsiveConfig = resolveResponsiveColumns(columns, 1, 2, columns);
  const { inlineStyles, mediaQueries } = generateResponsiveGridStyles(
    gridId,
    responsiveConfig,
    "2rem",
  );

  const headerHtml =
    title || subtitle
      ? `<div data-block-group="Cabeçalho" style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportBlogPostGrid requires renderChild function");
  }

  const cardsHtml = cards.length > 0
    ? cards
        .map((c: any, i: number) =>
          renderChild(
            {
              id: `${block.id}-card-${i}`,
              type: "blogPostCard",
              props: c,
            } as Block,
            depth + 1,
            basePath,
            theme,
          ),
        )
        .join("")
    : `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--sg-muted-text); border: 2px dashed var(--sg-border, #e5e7eb); border-radius: var(--sg-card-radius, 0.5rem);"><p style="font-size: 1rem; margin-bottom: 0.5rem;">Nenhum post encontrado</p><p style="font-size: 0.875rem;">Os posts aparecerão aqui quando forem publicados.</p></div>`;

  const viewAllHtml =
    showViewAll && viewAllText
      ? `<div data-block-group="Rodapé" style="text-align: center; margin-top: 2.5rem;"><a href="${escapeHtml(viewAllHref || "#")}" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); font-weight: 600; border-radius: var(--sg-button-radius); text-decoration: none;">${escapeHtml(viewAllText)}</a></div>`
      : "";

  return `<style>${mediaQueries}</style><section ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div data-block-group="Layout" id="${gridId}" style="${inlineStyles}">${cardsHtml}</div>${viewAllHtml}</div></section>`;
}

// ---------------------------------------------------------------------------
// BlogPostDetail
// ---------------------------------------------------------------------------

export function exportBlogPostDetail(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    content,
    featuredImage,
    date,
    category,
    readingTime,
    tags = [],
    showFeaturedImage = true,
    showAuthor = true,
    authorVariant = "inline",
    showDate = true,
    showTags = true,
    showReadingTime = true,
    contentMaxWidth = "720px",
  } = (block as any).props;

  // Featured image banner
  const featuredImageHtml =
    showFeaturedImage && featuredImage
      ? `<div data-block-group="Mídia" style="width: 100%; height: 400px; background-image: url(${escapeHtml(featuredImage)}); background-size: cover; background-position: center; border-radius: var(--sg-card-radius); margin-bottom: 2rem;"></div>`
      : "";

  // Category badge
  const categoryHtml = category
    ? `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: 999px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem;">${escapeHtml(category)}</span>`
    : "";

  // Meta line (date + reading time)
  const metaParts: string[] = [];
  if (showDate && date) metaParts.push(escapeHtml(date));
  if (showReadingTime && readingTime) metaParts.push(escapeHtml(readingTime));
  const metaHtml = metaParts.length
    ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1.5rem;">${metaParts.join(" &middot; ")}</p>`
    : "";

  // Title
  const titleHtml = `<h1 data-block-group="Conteúdo" style="font-size: var(--sg-heading-h1, 2.25rem); font-weight: 700; margin-bottom: 0.75rem; line-height: 1.2;">${escapeHtml(title)}</h1>`;

  // Content — trusted HTML from backend, not escaped
  const contentHtml = content
    ? `<div class="sg-blog-post-content" style="font-size: 1.0625rem; line-height: 1.75; color: var(--sg-text);">${content}</div>`
    : "";

  // Author — placeholder structure (real data injected by ContentProvider at runtime)
  const avatarPlaceholder = `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg, var(--sg-primary, #6366f1) 0%, #818cf8 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--sg-primary-text, #fff);font-size:1.5rem;font-weight:700;">A</div>`;
  const avatarSmall = `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, var(--sg-primary, #6366f1) 0%, #818cf8 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--sg-primary-text, #fff);font-size:1.1rem;font-weight:700;">A</div>`;

  let authorHtml = "";
  if (showAuthor) {
    if (authorVariant === "card") {
      authorHtml = `<div data-block-group="Autor" style="display:flex;align-items:flex-start;gap:1rem;margin-top:3rem;padding:1.25rem;border-radius:var(--sg-card-radius, 0.75rem);background-color:var(--sg-surface, #f9fafb);">${avatarPlaceholder}<div><div style="font-size:0.75rem;color:var(--sg-muted-text);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.125rem;">Escrito por</div><div style="font-weight:600;font-size:1rem;">Nome do Autor</div><p style="color:var(--sg-muted-text);font-size:0.875rem;margin:0.25rem 0 0;">Bio do autor carregada do banco de dados.</p></div></div>`;
    } else if (authorVariant === "minimal") {
      authorHtml = `<p data-block-group="Autor" style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--sg-border, #e5e7eb);color:var(--sg-muted-text);font-size:0.9375rem;">Escrito por <span style="font-weight:600;color:var(--sg-text);">Nome do Autor</span></p>`;
    } else {
      // inline (default)
      authorHtml = `<div data-block-group="Autor" style="display:flex;align-items:center;gap:0.75rem;margin-top:3rem;padding-top:2rem;border-top:1px solid var(--sg-border, #e5e7eb);">${avatarSmall}<div><div style="font-size:0.75rem;color:var(--sg-muted-text);">Escrito por</div><div style="font-weight:600;font-size:0.9375rem;">Nome do Autor</div></div></div>`;
    }
  }

  // Tags
  const tagsHtml =
    showTags && tags.length > 0
      ? `<div data-block-group="Visibilidade" style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">${tags
          .map(
            (tag: string) =>
              `<span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--sg-surface, #f3f4f6); color: var(--sg-text); border-radius: 999px; font-size: 0.75rem;">${escapeHtml(tag)}</span>`,
          )
          .join("")}</div>`
      : "";

  return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-post-detail" style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: ${escapeHtml(contentMaxWidth)}; margin: 0 auto; padding: 0 1rem;">${featuredImageHtml}${categoryHtml}${titleHtml}${metaHtml}${contentHtml}${authorHtml}${tagsHtml}</div></article>`;
}
