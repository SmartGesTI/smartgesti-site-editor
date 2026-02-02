/**
 * Content Grid Exporters
 * Blog Cards, Team Cards, Course Cards, Countdown, Carousel
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportBlogCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { image, date, category, title, excerpt, linkText, linkHref } = (
    block as any
  ).props;

  const imgHtml = image
    ? `<div style="height: 200px; background-image: url(${escapeHtml(image)}); background-size: cover; background-position: center;"></div>`
    : "";

  const metaHtml =
    date || category
      ? `<p style="font-size: 0.75rem; color: var(--sg-muted-text); margin-bottom: 0.5rem;">${[date, category].filter(Boolean).join(" / ")}</p>`
      : "";

  const linkHtml = linkText
    ? `<a href="${escapeHtml(linkHref || "#")}" style="color: var(--sg-primary); font-weight: 500; text-decoration: none;">${escapeHtml(linkText)}</a>`
    : "";

  return `<article ${dataBlockIdAttr(block.id)} class="sg-blog-card" style="background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);">${imgHtml}<div style="padding: 1.5rem;">${metaHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3>${excerpt ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1rem;">${escapeHtml(excerpt)}</p>` : ""}${linkHtml}</div></article>`;
}

export function exportBlogCardGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const { title, subtitle, columns = 3, cards = [] } = (block as any).props;

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportBlogCardGrid requires renderChild function");
  }

  const cardsHtml = cards
    .map((c: any, i: number) =>
      renderChild(
        {
          id: `${block.id}-card-${i}`,
          type: "blogCard",
          props: c,
        } as Block,
        depth + 1,
        basePath,
        theme,
      ),
    )
    .join("");

  return `<section ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${cardsHtml}</div></div></section>`;
}

export function exportTeamCard(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { avatar, name, role } = (block as any).props;

  const avatarHtml = avatar
    ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; display: block;" />`
    : `<div style="width: 120px; height: 120px; border-radius: 50%; background-color: var(--sg-primary); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; font-weight: 600;">${name ? name.charAt(0) : "?"}</div>`;

  return `<div ${dataBlockIdAttr(block.id)} class="sg-team-card" style="text-align: center;">${avatarHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(name)}</h3>${role ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(role)}</p>` : ""}</div>`;
}

export function exportTeamGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
  renderChild?: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string,
): string {
  const {
    title,
    subtitle,
    columns = 4,
    members = [],
  } = (block as any).props;

  const headerHtml =
    title || subtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ""}${subtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(subtitle)}</p>` : ""}</div>`
      : "";

  if (!renderChild) {
    throw new Error("exportTeamGrid requires renderChild function");
  }

  const membersHtml = members
    .map((m: any, i: number) =>
      renderChild(
        {
          id: `${block.id}-member-${i}`,
          type: "teamCard",
          props: m,
        } as Block,
        depth + 1,
        basePath,
        theme,
      ),
    )
    .join("");

  return `<section ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${membersHtml}</div></div></section>`;
}

export function exportCourseCardGrid(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title: courseTitle,
    subtitle: courseSubtitle,
    columns: courseCols = 3,
    cards = [],
  } = (block as any).props;

  const courseHeaderHtml =
    courseTitle || courseSubtitle
      ? `<div style="text-align: center; margin-bottom: 3rem;">${courseTitle ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(courseTitle)}</h2>` : ""}${courseSubtitle ? `<p style="color: var(--sg-muted-text);">${escapeHtml(courseSubtitle)}</p>` : ""}</div>`
      : "";

  const courseCardsHtml = cards
    .map((card: any) => {
      const imgHtml = card.image
        ? `<div style="height: 180px; background-image: url(${escapeHtml(card.image)}); background-size: cover; background-position: center;"></div>`
        : "";
      const priceInner = card.period
        ? ' <span style="font-size: 0.875rem; font-weight: 400; color: var(--sg-muted-text);">/ ' +
          escapeHtml(card.period) +
          "</span>"
        : "";
      const priceHtml =
        card.price != null
          ? `<p style="font-size: 1rem; font-weight: 600; color: var(--sg-primary); margin-bottom: 0.5rem;">${escapeHtml(String(card.price))}${priceInner}</p>`
          : "";
      const durationHtml = card.duration
        ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem;">Duração: ${escapeHtml(card.duration)}</p>`
        : "";
      const levelHtml = card.level
        ? `<span style="display: inline-block; padding: 0.25rem 0.5rem; background-color: var(--sg-surface2); color: var(--sg-text); border-radius: 0.25rem; font-size: 0.75rem; margin-bottom: 0.5rem;">${escapeHtml(card.level)}</span>`
        : "";
      return `<div style="background-color: var(--sg-bg); border-radius: var(--sg-card-radius); overflow: hidden; box-shadow: var(--sg-card-shadow);">${imgHtml}<div style="padding: 1.5rem;">${levelHtml}<h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(card.title)}</h3>${card.description ? `<p style="color: var(--sg-muted-text); font-size: 0.875rem; margin-bottom: 1rem;">${escapeHtml(card.description)}</p>` : ""}${priceHtml}${durationHtml}</div></div>`;
    })
    .join("");

  return `<section ${dataBlockIdAttr(block.id)} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${courseHeaderHtml}<div style="display: grid; grid-template-columns: repeat(${courseCols}, 1fr); gap: 2rem;">${courseCardsHtml}</div></div></section>`;
}

export function exportCountdown(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    title,
    description,
    showPlaceholders = true,
    buttonText,
    buttonHref,
    variant = "default",
    badgeText,
    bg,
  } = (block as any).props;

  const isBanner = variant === "banner";
  const sectionStyle = `padding: 4rem 2rem; background-color: ${bg || "var(--sg-primary)"}; color: #fff;`;

  const badgeCircle =
    isBanner && badgeText
      ? `<div style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; text-align: center; padding: 1rem; font-weight: 600; font-size: 0.875rem;">${escapeHtml(badgeText)}</div>`
      : "";

  const placeholdersHtml = showPlaceholders
    ? `<div style="display: flex; gap: 1rem; margin-bottom: 1rem;">${["Days", "Hours", "Minutes", "Seconds"].map((label) => `<div style="text-align: center;"><div style="font-size: 1.75rem; font-weight: 700;">00</div><div style="font-size: 0.75rem; opacity: 0.9;">${label}</div></div>`).join("")}</div>`
    : "";

  const btnHtml = buttonText
    ? `<a href="${escapeHtml(buttonHref || "#")}" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #fff; color: var(--sg-primary); font-weight: 600; border-radius: var(--sg-button-radius); text-decoration: none;">${escapeHtml(buttonText)}</a>`
    : "";

  const inner = `<div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">${badgeCircle}<div style="flex: 1; min-width: 200px;">${title ? `<h2 style="margin-bottom: 0.5rem; font-size: 1.5rem;">${escapeHtml(title)}</h2>` : ""}${description ? `<p style="opacity: 0.9; margin-bottom: 1rem;">${escapeHtml(description)}</p>` : ""}${placeholdersHtml}${btnHtml}</div></div>`;

  return `<section ${dataBlockIdAttr(block.id)} class="sg-countdown" style="${sectionStyle}" data-variant="${escapeHtml(variant)}">${inner}</section>`;
}

export function exportCarousel(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const { slides = [] } = (block as any).props;
  const slide = slides[0];

  if (!slide)
    return `<section ${dataBlockIdAttr(block.id)} class="sg-carousel"></section>`;

  const slideImg = slide.image
    ? `<div style="min-height: 300px; background-image: url(${escapeHtml(slide.image)}); background-size: cover; background-position: center;"></div>`
    : "";

  const primaryBtn = slide.primaryButton
    ? `<a href="${escapeHtml(slide.primaryButton.href || "#")}" style="padding: 0.75rem 1.5rem; background-color: #fff; color: var(--sg-primary); border-radius: var(--sg-button-radius); font-weight: 500; text-decoration: none;">${escapeHtml(slide.primaryButton.text)}</a>`
    : "";

  const secondaryBtn = slide.secondaryButton
    ? `<a href="${escapeHtml(slide.secondaryButton.href || "#")}" style="padding: 0.75rem 1.5rem; border: 2px solid #fff; color: #fff; border-radius: var(--sg-button-radius); font-weight: 500; text-decoration: none;">${escapeHtml(slide.secondaryButton.text)}</a>`
    : "";

  const slideContent = `<div style="padding: 2rem; color: #fff;">${slide.title ? `<h2 style="margin-bottom: 1rem;">${escapeHtml(slide.title)}</h2>` : ""}${slide.description ? `<p style="margin-bottom: 1.5rem; opacity: 0.9;">${escapeHtml(slide.description)}</p>` : ""}<div style="display: flex; gap: 1rem; flex-wrap: wrap;">${primaryBtn}${secondaryBtn}</div></div>`;

  const slideHtml = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; background-color: var(--sg-primary); border-radius: var(--sg-card-radius); overflow: hidden;">${slideImg}${slideContent}</div>`;

  return `<section ${dataBlockIdAttr(block.id)} class="sg-carousel" style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${slideHtml}</div></section>`;
}
