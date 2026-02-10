/**
 * Blog block variation presets
 * Combines visual props (variant, borderRadius, shadow, show* toggles) into
 * meaningful presets the user can pick from the VariationSelector.
 *
 * Rule: NEVER include user-content fields in defaultProps.
 * Preserved fields (title, posts, tags, categories, etc.) stay untouched.
 */

// ---------------------------------------------------------------------------
// blogPostCard
// ---------------------------------------------------------------------------

export interface BlogPostCardVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogPostCardVariations: Record<string, BlogPostCardVariation> = {
  "card-default": {
    id: "card-default",
    name: "Cartão",
    defaultProps: {
      variation: "card-default",
      variant: "default",
      showImage: true,
      showCategory: true,
      showDate: true,
      showAuthor: false,
      showReadingTime: false,
    },
  },
  "card-horizontal": {
    id: "card-horizontal",
    name: "Horizontal",
    defaultProps: {
      variation: "card-horizontal",
      variant: "horizontal",
      showImage: true,
      showCategory: true,
      showDate: true,
      showAuthor: true,
      showReadingTime: true,
    },
  },
  "card-minimal": {
    id: "card-minimal",
    name: "Minimal",
    defaultProps: {
      variation: "card-minimal",
      variant: "minimal",
      showImage: false,
      showCategory: true,
      showDate: true,
      showAuthor: false,
      showReadingTime: true,
    },
  },
};

export const blogPostCardVariationIds = Object.keys(blogPostCardVariations);

// ---------------------------------------------------------------------------
// blogPostDetail
// ---------------------------------------------------------------------------

export interface BlogPostDetailVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogPostDetailVariations: Record<string, BlogPostDetailVariation> = {
  "detail-classic": {
    id: "detail-classic",
    name: "Clássico",
    defaultProps: {
      variation: "detail-classic",
      authorVariant: "inline",
      showFeaturedImage: true,
      showAuthor: true,
      showDate: true,
      showTags: true,
      showReadingTime: true,
      contentMaxWidth: "720px",
    },
  },
  "detail-card-author": {
    id: "detail-card-author",
    name: "Autor Card",
    defaultProps: {
      variation: "detail-card-author",
      authorVariant: "card",
      showFeaturedImage: true,
      showAuthor: true,
      showDate: true,
      showTags: true,
      showReadingTime: true,
      contentMaxWidth: "720px",
    },
  },
  "detail-clean": {
    id: "detail-clean",
    name: "Limpo",
    defaultProps: {
      variation: "detail-clean",
      authorVariant: "minimal",
      showFeaturedImage: true,
      showAuthor: true,
      showDate: true,
      showTags: false,
      showReadingTime: false,
      contentMaxWidth: "680px",
    },
  },
  "detail-immersive": {
    id: "detail-immersive",
    name: "Imersivo",
    defaultProps: {
      variation: "detail-immersive",
      authorVariant: "card",
      showFeaturedImage: true,
      showAuthor: true,
      showDate: true,
      showTags: true,
      showReadingTime: true,
      contentMaxWidth: "800px",
    },
  },
};

export const blogPostDetailVariationIds = Object.keys(blogPostDetailVariations);

// ---------------------------------------------------------------------------
// blogCategoryFilter
// ---------------------------------------------------------------------------

export interface BlogCategoryFilterVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogCategoryFilterVariations: Record<string, BlogCategoryFilterVariation> = {
  "cat-chips": {
    id: "cat-chips",
    name: "Chips",
    defaultProps: {
      variation: "cat-chips",
      variant: "chips",
      showCount: true,
      showAll: true,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "cat-buttons": {
    id: "cat-buttons",
    name: "Botoes",
    defaultProps: {
      variation: "cat-buttons",
      variant: "buttons",
      showCount: true,
      showAll: true,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "cat-list": {
    id: "cat-list",
    name: "Lista",
    defaultProps: {
      variation: "cat-list",
      variant: "list",
      showCount: true,
      showAll: true,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "cat-flat": {
    id: "cat-flat",
    name: "Flat",
    defaultProps: {
      variation: "cat-flat",
      variant: "chips",
      showCount: false,
      showAll: true,
      borderRadius: "0",
      shadow: "none",
    },
  },
};

export const blogCategoryFilterVariationIds = Object.keys(blogCategoryFilterVariations);

// ---------------------------------------------------------------------------
// blogSearchBar
// ---------------------------------------------------------------------------

export interface BlogSearchBarVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogSearchBarVariations: Record<string, BlogSearchBarVariation> = {
  "search-simple": {
    id: "search-simple",
    name: "Simples",
    defaultProps: {
      variation: "search-simple",
      variant: "simple",
      showIcon: true,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "search-expanded": {
    id: "search-expanded",
    name: "Destaque",
    defaultProps: {
      variation: "search-expanded",
      variant: "expanded",
      showIcon: true,
      borderRadius: "1.25rem",
      shadow: "md",
    },
  },
  "search-filters": {
    id: "search-filters",
    name: "Filtros",
    defaultProps: {
      variation: "search-filters",
      variant: "with-filters",
      showIcon: true,
      filterCategories: true,
      filterTags: true,
      filterDate: false,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
};

export const blogSearchBarVariationIds = Object.keys(blogSearchBarVariations);

// ---------------------------------------------------------------------------
// blogRecentPosts
// ---------------------------------------------------------------------------

export interface BlogRecentPostsVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogRecentPostsVariations: Record<string, BlogRecentPostsVariation> = {
  "recent-thumbs": {
    id: "recent-thumbs",
    name: "Miniaturas",
    defaultProps: {
      variation: "recent-thumbs",
      showThumbnail: true,
      showDate: true,
      showCategory: false,
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "recent-compact": {
    id: "recent-compact",
    name: "Compacto",
    defaultProps: {
      variation: "recent-compact",
      showThumbnail: false,
      showDate: true,
      showCategory: true,
      borderRadius: "0.75rem",
      shadow: "none",
    },
  },
  "recent-full": {
    id: "recent-full",
    name: "Completo",
    defaultProps: {
      variation: "recent-full",
      showThumbnail: true,
      showDate: true,
      showCategory: true,
      borderRadius: "1.25rem",
      shadow: "md",
    },
  },
};

export const blogRecentPostsVariationIds = Object.keys(blogRecentPostsVariations);

// ---------------------------------------------------------------------------
// blogTagCloud
// ---------------------------------------------------------------------------

export interface BlogTagCloudVariation {
  id: string;
  name: string;
  defaultProps: Record<string, any>;
}

export const blogTagCloudVariations: Record<string, BlogTagCloudVariation> = {
  "tags-badges": {
    id: "tags-badges",
    name: "Badges",
    defaultProps: {
      variation: "tags-badges",
      variant: "badges",
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "tags-list": {
    id: "tags-list",
    name: "Lista",
    defaultProps: {
      variation: "tags-list",
      variant: "list",
      borderRadius: "0.75rem",
      shadow: "sm",
    },
  },
  "tags-flat": {
    id: "tags-flat",
    name: "Flat",
    defaultProps: {
      variation: "tags-flat",
      variant: "badges",
      borderRadius: "0",
      shadow: "none",
    },
  },
};

export const blogTagCloudVariationIds = Object.keys(blogTagCloudVariations);
