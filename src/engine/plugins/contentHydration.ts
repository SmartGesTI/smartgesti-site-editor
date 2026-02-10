/**
 * Content Hydration
 * Hydrates page blocks with data from ContentProviders before rendering.
 *
 * This works at the data level, before either rendering pipeline
 * (React renderers or HTML exporters) processes the blocks.
 */

import { logger } from "../../utils/logger";
import type { SitePage, Block, PageSeoConfig } from "../schema/siteDocument";
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
 * Pagination metadata passed from hydration to grid blocks.
 */
interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  paginationBaseUrl: string;
}

/**
 * Builds a pagination base URL from the page slug and current filter params.
 * Preserves search/category so pagination links keep the active filters.
 * Uses /site/p/ prefix to match the consumer route pattern (same as viewAllHref, linkHref).
 */
function buildPaginationBaseUrl(
  page: SitePage,
  fetchParams?: ContentListParams,
): string {
  // Always paginate on the blog listing page — home page widget points to blog page
  const slug = page.slug && page.slug !== "home" ? page.slug : "blog";
  const basePath = `/site/p/${slug}`;

  const params = new URLSearchParams();
  const filter = fetchParams?.filter as Record<string, string> | undefined;
  if (filter?.search) params.set("busca", filter.search);
  if (filter?.category) params.set("categoria", filter.category);

  return params.toString() ? `${basePath}?${params.toString()}` : basePath;
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

  // Convert items to block props (empty array if no results — shows empty state, never mock data)
  const cardProps = (result.items || []).map((item) => provider.toBlockProps(item));

  // Build pagination metadata (only when there are multiple pages)
  // _noPagination flag suppresses pagination for synthetic dataSource (e.g., home page blog widget)
  const noPagination = !!(page.dataSource?.defaultParams as Record<string, unknown> | undefined)?._noPagination;
  const totalPages = Math.ceil((result.total || 0) / (result.limit || params.limit || 12));
  const pagination: PaginationMeta | undefined = !noPagination && totalPages > 1
    ? {
        currentPage: result.page || 1,
        totalPages,
        paginationBaseUrl: buildPaginationBaseUrl(page, fetchParams),
      }
    : undefined;

  // Build recent posts for sidebar blogRecentPosts widget
  const recentPosts = (result.items || []).slice(0, 5).map((i) => {
    const d = i.data as Record<string, any>;
    return {
      title: (d.title as string) ?? '',
      slug: i.slug as string,
      date: i.metadata?.publishedAt
        ? new Date(i.metadata.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : undefined,
      image: (d.featuredImage as string) ?? undefined,
      category: (d.category as string) ?? undefined,
    };
  });

  // Extract tags from all posts for sidebar blogTagCloud widget
  const allTags = new Map<string, number>();
  for (const i of (result.items || [])) {
    const tags = (i.data as Record<string, any>).tags as string[] | undefined;
    if (tags) {
      for (const tag of tags) {
        allTags.set(tag, (allTags.get(tag) ?? 0) + 1);
      }
    }
  }
  const tagCloud = Array.from(allTags.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Hydrate all grid blocks, category filters, recent posts and tag cloud on the page
  const hydratedStructure = page.structure.map((block) => {
    let hydrated = hydrateGridBlock(block, cardProps, pagination);
    hydrated = hydrateCategoryFilterBlock(hydrated, cardProps);
    hydrated = hydrateRecentPostsBlock(hydrated, recentPosts);
    hydrated = hydrateTagCloudBlock(hydrated, tagCloud);
    return hydrated;
  });

  return {
    ...page,
    structure: hydratedStructure,
  };
}

/**
 * Hydrates grid blocks (blogPostGrid, etc.) with card data and pagination.
 */
function hydrateGridBlock(
  block: Block,
  cardProps: Record<string, unknown>[],
  pagination?: PaginationMeta,
): Block {
  // Direct match: blogPostGrid gets cards + pagination populated
  if (block.type === "blogPostGrid") {
    return {
      ...block,
      props: {
        ...block.props,
        cards: cardProps,
        ...(pagination ? {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          paginationBaseUrl: pagination.paginationBaseUrl,
        } : {}),
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
          hydrateGridBlock(child, cardProps, pagination),
        ),
      },
    };
  }

  return block;
}

/**
 * Hydrates a single-mode page: fetches one item and populates detail blocks.
 * Also fetches sidebar data (recent posts, tags, categories) for widgets.
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

  // Fetch recent posts for sidebar widgets
  let recentPosts: Array<{ title: string; slug: string; date?: string; image?: string; category?: string }> = [];
  let tagCloud: Array<{ name: string; count: number }> = [];
  let sidebarCardProps: Record<string, unknown>[] = [];

  try {
    const recentResult = await provider.fetchList({ limit: 10, sort: 'published_at' });
    const allItems = recentResult.items || [];

    // Map to card props for category filter hydration
    sidebarCardProps = allItems.map((i) => provider.toBlockProps(i));

    // Map recent posts (exclude current post)
    recentPosts = allItems
      .filter((i) => i.slug !== idOrSlug && i.slug)
      .slice(0, 5)
      .map((i) => {
        const d = i.data as Record<string, any>;
        return {
          title: (d.title as string) ?? '',
          slug: i.slug as string,
          date: i.metadata?.publishedAt
            ? new Date(i.metadata.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            : undefined,
          image: (d.featuredImage as string) ?? undefined,
          category: (d.category as string) ?? undefined,
        };
      });

    // Extract tags from all posts
    const allTags = new Map<string, number>();
    for (const i of allItems) {
      const tags = (i.data as Record<string, any>).tags as string[] | undefined;
      if (tags) {
        for (const tag of tags) {
          allTags.set(tag, (allTags.get(tag) ?? 0) + 1);
        }
      }
    }
    tagCloud = Array.from(allTags.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (err) {
    logger.warn(`Failed to fetch sidebar data for page "${page.id}":`, err);
  }

  // Hydrate all blocks on the page
  const hydratedStructure = page.structure
    .map((block) => hydrateDetailBlock(block, blockProps, item))
    .map((block) => hydrateRecentPostsBlock(block, recentPosts))
    .map((block) => hydrateTagCloudBlock(block, tagCloud))
    .map((block) => hydrateCategoryFilterBlock(block, sidebarCardProps));

  // Extract SEO from content item and set on page
  const seo = extractSeoFromContent(item, blockProps);

  return {
    ...page,
    structure: hydratedStructure,
    ...(seo ? { seo } : {}),
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
 * Extracts SEO configuration from a ContentItem and block props.
 * Priority: item.metadata.seo > blockProps (metaTitle/title, metaDescription/excerpt, ogImage/featuredImage)
 */
function extractSeoFromContent(
  item: ContentItem,
  blockProps: Record<string, unknown>,
): PageSeoConfig | undefined {
  const seoMeta = item.metadata?.seo;

  const metaTitle = seoMeta?.metaTitle || (blockProps.metaTitle as string) || (blockProps.title as string);
  const metaDescription = seoMeta?.metaDescription || (blockProps.metaDescription as string) || (blockProps.excerpt as string);
  const ogImage = seoMeta?.ogImage || (blockProps.ogImage as string) || (blockProps.featuredImage as string);

  if (!metaTitle && !metaDescription && !ogImage) {
    return undefined;
  }

  return {
    metaTitle,
    metaDescription,
    ogImage,
    ogType: "article",
  };
}

/**
 * Hydrates blogRecentPosts blocks with recent post data.
 */
function hydrateRecentPostsBlock(
  block: Block,
  recentPosts: Array<{ title: string; slug: string; date?: string; image?: string; category?: string }>,
): Block {
  if (block.type === "blogRecentPosts") {
    return {
      ...block,
      props: {
        ...block.props,
        posts: recentPosts,
      },
    } as Block;
  }

  // Recurse into children
  const props = block.props as Record<string, unknown>;
  if (props.children && Array.isArray(props.children)) {
    return {
      ...block,
      props: {
        ...props,
        children: (props.children as Block[]).map((child) =>
          hydrateRecentPostsBlock(child, recentPosts),
        ),
      },
    } as Block;
  }

  return block;
}

/**
 * Hydrates blogTagCloud blocks with tag data.
 */
function hydrateTagCloudBlock(
  block: Block,
  tags: Array<{ name: string; count: number }>,
): Block {
  if (block.type === "blogTagCloud") {
    return {
      ...block,
      props: {
        ...block.props,
        tags,
      },
    } as Block;
  }

  // Recurse into children
  const props = block.props as Record<string, unknown>;
  if (props.children && Array.isArray(props.children)) {
    return {
      ...block,
      props: {
        ...props,
        children: (props.children as Block[]).map((child) =>
          hydrateTagCloudBlock(child, tags),
        ),
      },
    } as Block;
  }

  return block;
}

/**
 * Hydrates blogCategoryFilter blocks with category data extracted from posts.
 */
function hydrateCategoryFilterBlock(
  block: Block,
  cardProps: Record<string, unknown>[],
): Block {
  if (block.type === "blogCategoryFilter") {
    // Extract unique categories from posts with counts
    const categoryMap = new Map<string, number>();
    for (const card of cardProps) {
      const cat = card.category as string;
      if (cat) {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      }
    }

    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      slug: name,
      count,
    }));

    return {
      ...block,
      props: {
        ...block.props,
        categories,
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
          hydrateCategoryFilterBlock(child, cardProps),
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
