import React from "react";
import { cn } from "../../utils/cn";
import { Block } from "../../engine";
import {
  heroVariations,
  heroVariationIds,
} from "../../engine/presets/heroVariations";
import {
  navbarVariations,
  navbarVariationIds,
} from "../../engine/presets/navbarVariations";
import {
  blogPostCardVariations,
  blogPostCardVariationIds,
  blogPostDetailVariations,
  blogPostDetailVariationIds,
  blogCategoryFilterVariations,
  blogCategoryFilterVariationIds,
  blogSearchBarVariations,
  blogSearchBarVariationIds,
  blogRecentPostsVariations,
  blogRecentPostsVariationIds,
  blogTagCloudVariations,
  blogTagCloudVariationIds,
} from "../../engine/presets/blogVariations";

interface VariationSelectorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
}

/**
 * Helper para preservar um valor se ele existir (não undefined)
 */
function preserveIfDefined(obj: Record<string, any>, key: string): Record<string, any> {
  return obj[key] !== undefined ? { [key]: obj[key] } : {};
}

/**
 * Preserva múltiplas props de uma vez
 */
function preserveMany(obj: Record<string, any>, keys: string[]): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of keys) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Props visuais do Hero que DEVEM ser resetadas ao trocar de variação
 * para evitar "vazamento" de estilos entre variações
 */
const HERO_VISUAL_PROPS_TO_RESET: Record<string, any> = {
  // Variant e variation
  variation: undefined,
  variant: "centered",
  // Layout
  align: "center",
  contentPosition: "center",
  contentSpacing: "default",
  blockGap: "default",
  minHeight: "70vh",
  contentMaxWidth: "700px",
  paddingY: undefined,
  // Background & Overlay
  background: undefined,
  overlay: false,
  overlayColor: undefined,
  // Typography colors (legacy)
  titleColor: undefined,
  subtitleColor: undefined,
  descriptionColor: undefined,
  // Typography config (novo sistema)
  titleTypography: undefined,
  subtitleTypography: undefined,
  descriptionTypography: undefined,
  // Badge styling
  badgeColor: undefined,
  badgeTextColor: undefined,
  // Image styling
  imageRadius: 16,
  imageShadow: "lg",
  imagePosition: "right",
  // Button styling
  buttonSize: "md",
  primaryButtonVariant: "solid",
  primaryButtonColor: undefined,
  primaryButtonTextColor: undefined,
  primaryButtonRadius: 8,
  secondaryButtonVariant: "outline",
  secondaryButtonColor: undefined,
  secondaryButtonTextColor: undefined,
  secondaryButtonRadius: 8,
  // Button hover
  buttonHoverEffect: "scale",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
  // Decorative
  showWave: false,
  waveColor: "rgba(255,255,255,0.1)",
  // Image Grid
  imageGridEnabled: false,
  imageGridPreset: "four-equal",
  imageGridImages: [],
  imageGridGap: 8,
};

/**
 * Props visuais da Navbar que DEVEM ser resetadas ao trocar de variação
 */
const NAVBAR_VISUAL_PROPS_TO_RESET: Record<string, any> = {
  variation: undefined,
  layout: "expanded",
  floating: false,
  sticky: true,
  // Aparência
  bg: "#ffffff",
  opacity: 100,
  blurOpacity: 0,
  borderRadius: 0,
  shadow: "sm",
  // Borda
  borderPosition: "none",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  // Links
  linkColor: "#374151",
  linkHoverColor: "#2563eb",
  linkFontSize: "md",
  linkHoverEffect: "background",
  linkHoverIntensity: 50,
  // Botão
  buttonVariant: "solid",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonSize: "md",
  buttonHoverEffect: "darken",
  buttonHoverIntensity: 50,
  buttonHoverOverlay: "none",
  buttonHoverIconName: "arrow-right",
};

// ---------------------------------------------------------------------------
// Blog visual props to reset
// ---------------------------------------------------------------------------

const BLOG_POST_CARD_VISUAL_RESET: Record<string, any> = {
  variation: undefined,
  variant: "default",
  showImage: true,
  showCategory: true,
  showDate: true,
  showAuthor: false,
  showReadingTime: false,
};

const BLOG_POST_DETAIL_VISUAL_RESET: Record<string, any> = {
  variation: undefined,
  authorVariant: "inline",
  showFeaturedImage: true,
  showAuthor: true,
  showDate: true,
  showTags: true,
  showReadingTime: true,
  contentMaxWidth: "720px",
};

const BLOG_WIDGET_VISUAL_RESET: Record<string, any> = {
  variation: undefined,
  variant: undefined,
  borderRadius: "0.75rem",
  shadow: "none",
  showCount: true,
  showAll: true,
  showThumbnail: true,
  showDate: true,
  showCategory: false,
  showIcon: true,
  filterCategories: false,
  filterTags: false,
  filterDate: false,
  // Hover effects
  linkColor: undefined,
  linkHoverColor: undefined,
  linkHoverEffect: "background",
  linkHoverIntensity: 50,
};

// ---------------------------------------------------------------------------
// User-content fields to preserve (per block type)
// ---------------------------------------------------------------------------

const BLOG_POST_CARD_PRESERVE = [
  "title", "excerpt", "image", "date", "category",
  "authorName", "authorAvatar", "readingTime",
  "linkHref", "linkText",
];

const BLOG_POST_DETAIL_PRESERVE = [
  "title", "content", "featuredImage", "date", "category",
  "readingTime", "tags", "authorName", "authorAvatar", "authorBio",
];

const BLOG_CATEGORY_FILTER_PRESERVE = [
  "title", "categories", "activeCategory", "allLabel", "filterUrl",
];

const BLOG_SEARCH_BAR_PRESERVE = [
  "placeholder", "searchUrl",
];

const BLOG_RECENT_POSTS_PRESERVE = [
  "title", "count", "posts",
];

const BLOG_TAG_CLOUD_PRESERVE = [
  "title", "tags",
];

// ---------------------------------------------------------------------------
// Generic variation grid renderer
// ---------------------------------------------------------------------------

function VariationGrid({
  variationIds,
  variations,
  currentVariation,
  resetProps,
  preserveKeys,
  props,
  onUpdate,
}: {
  variationIds: string[];
  variations: Record<string, { id: string; name: string; defaultProps: Record<string, any> }>;
  currentVariation: string | undefined;
  resetProps: Record<string, any>;
  preserveKeys: string[];
  props: Record<string, any>;
  onUpdate: (updates: Record<string, any>) => void;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Variações
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {variationIds.map((id) => {
          const v = variations[id];
          const isActive = currentVariation === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                const newProps = {
                  ...resetProps,
                  ...v.defaultProps,
                  ...preserveMany(props, preserveKeys),
                };
                onUpdate(newProps);
              }}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700",
              )}
            >
              <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                {v.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Componente para selecionar variações de blocos
 * Preserva props customizadas ao trocar variação
 */
export const VariationSelector = React.memo(function VariationSelector({ block, onUpdate }: VariationSelectorProps) {
  const props = block.props as Record<string, any>;
  const currentVariation = props.variation;

  // Hero variations
  if (block.type === "hero") {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Variações
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {heroVariationIds.map((id) => {
            const v = heroVariations[id];
            const isActive = currentVariation === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  const newProps = {
                    ...HERO_VISUAL_PROPS_TO_RESET,
                    ...v.defaultProps,
                    ...preserveIfDefined(props, "title"),
                    ...preserveIfDefined(props, "subtitle"),
                    ...preserveIfDefined(props, "description"),
                    ...preserveIfDefined(props, "badge"),
                    ...preserveIfDefined(props, "primaryButton"),
                    ...preserveIfDefined(props, "secondaryButton"),
                    ...preserveIfDefined(props, "image"),
                    ...preserveIfDefined(props, "imageGridEnabled"),
                    ...preserveIfDefined(props, "imageGridPreset"),
                    ...preserveIfDefined(props, "imageGridImages"),
                    ...preserveIfDefined(props, "imageGridGap"),
                    ...preserveIfDefined(props, "carouselImages"),
                    ...preserveIfDefined(props, "carouselInterval"),
                    ...preserveIfDefined(props, "carouselTransition"),
                  };
                  onUpdate(newProps);
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Navbar variations
  if (block.type === "navbar") {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Variações
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {navbarVariationIds.map((id) => {
            const v = navbarVariations[id];
            const isActive = currentVariation === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  const newProps = {
                    ...NAVBAR_VISUAL_PROPS_TO_RESET,
                    ...v.defaultProps,
                    ...preserveIfDefined(props, "logo"),
                    ...preserveIfDefined(props, "logoText"),
                    ...preserveIfDefined(props, "logoHeight"),
                    ...preserveIfDefined(props, "links"),
                    ...preserveIfDefined(props, "ctaButton"),
                  };
                  onUpdate(newProps);
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                  isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Blog Post Card variations
  if (block.type === "blogPostCard") {
    return (
      <VariationGrid
        variationIds={blogPostCardVariationIds}
        variations={blogPostCardVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_POST_CARD_VISUAL_RESET}
        preserveKeys={BLOG_POST_CARD_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  // Blog Post Detail variations
  if (block.type === "blogPostDetail") {
    return (
      <VariationGrid
        variationIds={blogPostDetailVariationIds}
        variations={blogPostDetailVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_POST_DETAIL_VISUAL_RESET}
        preserveKeys={BLOG_POST_DETAIL_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  // Blog Category Filter variations
  if (block.type === "blogCategoryFilter") {
    return (
      <VariationGrid
        variationIds={blogCategoryFilterVariationIds}
        variations={blogCategoryFilterVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_WIDGET_VISUAL_RESET}
        preserveKeys={BLOG_CATEGORY_FILTER_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  // Blog Search Bar variations
  if (block.type === "blogSearchBar") {
    return (
      <VariationGrid
        variationIds={blogSearchBarVariationIds}
        variations={blogSearchBarVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_WIDGET_VISUAL_RESET}
        preserveKeys={BLOG_SEARCH_BAR_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  // Blog Recent Posts variations
  if (block.type === "blogRecentPosts") {
    return (
      <VariationGrid
        variationIds={blogRecentPostsVariationIds}
        variations={blogRecentPostsVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_WIDGET_VISUAL_RESET}
        preserveKeys={BLOG_RECENT_POSTS_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  // Blog Tag Cloud variations
  if (block.type === "blogTagCloud") {
    return (
      <VariationGrid
        variationIds={blogTagCloudVariationIds}
        variations={blogTagCloudVariations}
        currentVariation={currentVariation}
        resetProps={BLOG_WIDGET_VISUAL_RESET}
        preserveKeys={BLOG_TAG_CLOUD_PRESERVE}
        props={props}
        onUpdate={onUpdate}
      />
    );
  }

  return null;
});
