/**
 * Content Hydration
 * Hydrates page blocks with data from ContentProviders before rendering.
 *
 * This works at the data level, before either rendering pipeline
 * (React renderers or HTML exporters) processes the blocks.
 */

import { logger } from "../../utils/logger";
import type { SitePage, Block } from "../schema/siteDocument";
import type { ContentProvider, ContentItem, ContentListParams } from "./types";

/**
 * Map of provider type → ContentProvider instance
 */
export type ContentProviderMap = Map<string, ContentProvider>;

/**
 * Hydrates a page's blocks with data from ContentProviders.
 *
 * For pages with a dataSource:
 * - mode "list": fetches list and populates grid blocks' `cards` prop
 * - mode "single": fetches single item and spreads props onto detail blocks
 *
 * Returns a new page with hydrated block props (original page is not mutated).
 */
export async function hydratePageWithContent(
  page: SitePage,
  providers: ContentProviderMap,
  urlParams?: Record<string, string>,
  fetchParams?: ContentListParams,
): Promise<SitePage> {
  // No dataSource → return page as-is
  if (!page.dataSource) {
    return page;
  }

  const { provider: providerType, mode, paramMapping } = page.dataSource;
  const provider = providers.get(providerType);

  if (!provider) {
    logger.warn(
      `ContentProvider "${providerType}" not found for page "${page.id}". Rendering with static props.`,
    );
    return page;
  }

  try {
    if (mode === "list") {
      return await hydrateListPage(page, provider, fetchParams);
    }

    if (mode === "single") {
      // Resolve the ID/slug from URL params
      const idOrSlug = resolveIdFromParams(paramMapping, urlParams);
      if (!idOrSlug) {
        logger.warn(
          `Could not resolve ID/slug for page "${page.id}" from URL params. Using static props.`,
        );
        return page;
      }
      return await hydrateSinglePage(page, provider, idOrSlug);
    }

    return page;
  } catch (error) {
    logger.error(`Error hydrating page "${page.id}":`, error);
    return page;
  }
}

/**
 * Hydrates a list-mode page: fetches items and populates grid blocks.
 */
async function hydrateListPage(
  page: SitePage,
  provider: ContentProvider,
  fetchParams?: ContentListParams,
): Promise<SitePage> {
  const params: ContentListParams = {
    limit: 12,
    ...page.dataSource?.defaultParams,
    ...fetchParams,
  };

  const result = await provider.fetchList(params);

  if (!result.items || result.items.length === 0) {
    return page;
  }

  // Convert items to block props
  const cardProps = result.items.map((item) => provider.toBlockProps(item));

  // Hydrate all grid blocks on the page with the fetched cards
  const hydratedStructure = page.structure.map((block) =>
    hydrateGridBlock(block, cardProps),
  );

  return {
    ...page,
    structure: hydratedStructure,
  };
}

/**
 * Hydrates grid blocks (blogPostGrid, etc.) with card data.
 */
function hydrateGridBlock(
  block: Block,
  cardProps: Record<string, unknown>[],
): Block {
  // Direct match: blogPostGrid gets cards populated
  if (block.type === "blogPostGrid") {
    return {
      ...block,
      props: {
        ...block.props,
        cards: cardProps,
      },
    };
  }

  // Recurse into children for nested structures
  const props = block.props as Record<string, unknown>;
  if (props.children && Array.isArray(props.children)) {
    return {
      ...block,
      props: {
        ...props,
        children: (props.children as Block[]).map((child) =>
          hydrateGridBlock(child, cardProps),
        ),
      },
    };
  }

  return block;
}

/**
 * Hydrates a single-mode page: fetches one item and populates detail blocks.
 */
async function hydrateSinglePage(
  page: SitePage,
  provider: ContentProvider,
  idOrSlug: string,
): Promise<SitePage> {
  const item = await provider.fetchById(idOrSlug);

  if (!item) {
    logger.warn(`Content item "${idOrSlug}" not found. Using static props.`);
    return page;
  }

  const blockProps = provider.toBlockProps(item);

  // Hydrate all detail blocks on the page
  const hydratedStructure = page.structure.map((block) =>
    hydrateDetailBlock(block, blockProps, item),
  );

  return {
    ...page,
    structure: hydratedStructure,
  };
}

/**
 * Hydrates detail blocks (blogPostDetail, etc.) with item data.
 */
function hydrateDetailBlock(
  block: Block,
  blockProps: Record<string, unknown>,
  item: ContentItem,
): Block {
  if (block.type === "blogPostDetail") {
    return {
      ...block,
      props: {
        ...block.props,
        ...blockProps,
        // Preserve metadata
        _contentItemId: item.id,
        _contentItemSlug: item.slug,
      },
    };
  }

  // Also hydrate blogPostCard blocks that reference the same item
  if (block.type === "blogPostCard") {
    return {
      ...block,
      props: {
        ...block.props,
        ...blockProps,
      },
    };
  }

  // Recurse into children
  const props = block.props as Record<string, unknown>;
  if (props.children && Array.isArray(props.children)) {
    return {
      ...block,
      props: {
        ...props,
        children: (props.children as Block[]).map((child) =>
          hydrateDetailBlock(child, blockProps, item),
        ),
      },
    };
  }

  return block;
}

/**
 * Resolves the item ID/slug from URL params using paramMapping.
 * e.g., paramMapping: { slug: ":slug" }, urlParams: { slug: "my-post" } → "my-post"
 */
function resolveIdFromParams(
  paramMapping?: Record<string, string>,
  urlParams?: Record<string, string>,
): string | undefined {
  if (!paramMapping || !urlParams) return undefined;

  // Try slug first, then id
  for (const key of ["slug", "id"]) {
    const paramPattern = paramMapping[key];
    if (paramPattern) {
      // Extract param name from pattern (e.g., ":slug" → "slug")
      const paramName = paramPattern.startsWith(":")
        ? paramPattern.slice(1)
        : paramPattern;
      const value = urlParams[paramName];
      if (value) return value;
    }
  }

  // Fallback: return first available param value
  for (const paramPattern of Object.values(paramMapping)) {
    const paramName = paramPattern.startsWith(":")
      ? paramPattern.slice(1)
      : paramPattern;
    const value = urlParams[paramName];
    if (value) return value;
  }

  return undefined;
}
