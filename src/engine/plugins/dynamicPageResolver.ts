/**
 * Dynamic Page Resolver
 * Matches URL paths against dynamic page slugs (e.g., "blog/:slug")
 * and extracts URL parameters.
 */

import type { SitePage } from "../schema/siteDocument";

/**
 * Result of matching a URL path against dynamic pages
 */
export interface DynamicPageMatch {
  /** The matched page */
  page: SitePage;
  /** Extracted URL parameters (e.g., { slug: "my-first-post" }) */
  params: Record<string, string>;
}

/**
 * Matches a URL path against pages, supporting dynamic segments.
 *
 * Priority:
 * 1. Exact slug match (e.g., "blog" matches page with slug "blog")
 * 2. Dynamic pattern match (e.g., "blog/my-post" matches "blog/:slug")
 *
 * Dynamic segments are prefixed with ":" (e.g., ":slug", ":id")
 *
 * @param pages - Available pages to match against
 * @param urlPath - URL path to match (e.g., "blog/my-first-post")
 * @returns Match result with page and extracted params, or null
 */
export function matchDynamicPage(
  pages: SitePage[],
  urlPath: string,
): DynamicPageMatch | null {
  // Normalize: remove leading/trailing slashes
  const normalizedPath = urlPath.replace(/^\/+|\/+$/g, "");
  const pathSegments = normalizedPath.split("/");

  // 1. Try exact match first (highest priority)
  const exactMatch = pages.find((p) => {
    const pageSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
    return pageSlug === normalizedPath;
  });

  if (exactMatch) {
    return { page: exactMatch, params: {} };
  }

  // 2. Try dynamic pattern matches
  let bestMatch: DynamicPageMatch | null = null;
  let bestStaticSegments = -1;

  for (const page of pages) {
    const pageSlug = (page.slug || "").replace(/^\/+|\/+$/g, "");

    // Skip non-dynamic pages (already tried exact match)
    if (!pageSlug.includes(":")) continue;

    const slugSegments = pageSlug.split("/");

    // Segment count must match
    if (slugSegments.length !== pathSegments.length) continue;

    const params: Record<string, string> = {};
    let isMatch = true;
    let staticSegments = 0;

    for (let i = 0; i < slugSegments.length; i++) {
      const slugPart = slugSegments[i];
      const pathPart = pathSegments[i];

      if (slugPart.startsWith(":")) {
        // Dynamic segment — extract param
        const paramName = slugPart.slice(1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (slugPart === pathPart) {
        // Static segment — must match exactly
        staticSegments++;
      } else {
        // No match
        isMatch = false;
        break;
      }
    }

    // Prefer matches with more static segments (more specific)
    if (isMatch && staticSegments > bestStaticSegments) {
      bestMatch = { page, params };
      bestStaticSegments = staticSegments;
    }
  }

  return bestMatch;
}
