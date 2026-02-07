/**
 * Blog Plugin Manifest
 * Plugin para blog com posts, categorias e tags
 */

import type { PluginRegistration } from "../../types";
import type { SiteDocument, BlockType } from "../../../schema/siteDocument";
import { logger } from "../../../../utils/logger";

export const blogPlugin: PluginRegistration = {
  manifest: {
    id: "blog",
    version: "1.0.0",
    name: "Blog",
    description: "Blog com posts, categorias e tags",
    icon: "FileText",

    capabilities: {
      blocks: ["blogPostCard", "blogPostGrid", "blogPostDetail"],

      pageTemplates: [
        {
          id: "blog-listing",
          name: "Blog",
          slug: "blog",
          pluginId: "blog",
          structure: [],
          dataSource: {
            provider: "blog-posts",
            mode: "list",
          },
        },
        {
          id: "blog-post",
          name: "Post",
          slug: "blog/:slug",
          pluginId: "blog",
          structure: [],
          dataSource: {
            provider: "blog-posts",
            mode: "single",
            paramMapping: { slug: ":slug" },
          },
          editRestrictions: {
            lockedStructure: true,
            nonRemovable: true,
          },
        },
      ],

      dataSchemas: [
        {
          type: "blog-post",
          label: "Blog Post",
          fields: [
            { name: "title", type: "string", required: true, label: "Title" },
            { name: "slug", type: "string", required: true, label: "Slug" },
            { name: "excerpt", type: "string", label: "Excerpt" },
            { name: "content", type: "richtext", required: true, label: "Content" },
            { name: "featuredImage", type: "image", label: "Featured Image" },
            { name: "category", type: "string", label: "Category" },
            { name: "tags", type: "array", label: "Tags" },
            { name: "authorName", type: "string", label: "Author Name" },
            { name: "authorAvatar", type: "image", label: "Author Avatar" },
            { name: "readingTime", type: "number", label: "Reading Time" },
          ],
        },
      ],

      contentProviders: ["blog-posts", "blog-categories"],
    },

    restrictions: {
      lockedFields: {
        blogPostDetail: ["content", "date", "authorName"],
      },
      requiredPages: ["blog-listing", "blog-post"],
    },
  },

  onActivate(document: SiteDocument): SiteDocument {
    logger.debug("Blog plugin activating...");

    const existingPageIds = new Set(document.pages.map((p) => p.id));
    const newPages = [...document.pages];

    // Add blog listing page if it doesn't exist
    if (!existingPageIds.has("blog")) {
      newPages.push({
        id: "blog",
        name: "Blog",
        slug: "blog",
        pluginId: "blog",
        pageTemplateId: "blog-listing",
        structure: [
          {
            id: "blog-grid-default",
            type: "blogPostGrid",
            props: {
              title: "Blog",
              subtitle: "Últimas publicações",
              columns: 3,
              cards: [],
              variant: "default",
              showViewAll: false,
              viewAllText: "Ver todos",
              viewAllHref: "/blog",
            },
          },
        ],
        dataSource: {
          provider: "blog-posts",
          mode: "list",
        },
      });
      logger.debug("Blog listing page added");
    }

    // Add blog post detail page if it doesn't exist
    if (!existingPageIds.has("blog-post")) {
      newPages.push({
        id: "blog-post",
        name: "Post",
        slug: "blog/:slug",
        pluginId: "blog",
        pageTemplateId: "blog-post",
        isDynamic: true,
        structure: [
          {
            id: "blog-detail-default",
            type: "blogPostDetail",
            props: {
              title: "Título do Post",
              content: "<p>O conteúdo do post será carregado automaticamente.</p>",
              featuredImage: "",
              date: "",
              category: "",
              authorName: "",
              tags: [],
              showFeaturedImage: true,
              showAuthor: true,
              showDate: true,
              showTags: true,
              showReadingTime: true,
              contentMaxWidth: "720px",
            },
          },
        ],
        dataSource: {
          provider: "blog-posts",
          mode: "single",
          paramMapping: { slug: ":slug" },
        },
        editRestrictions: {
          lockedStructure: true,
          nonRemovable: true,
        },
      });
      logger.debug("Blog post detail page added");
    }

    return {
      ...document,
      pages: newPages,
    };
  },

  onDeactivate(document: SiteDocument): SiteDocument {
    logger.debug("Blog plugin deactivating...");

    const filteredPages = document.pages.filter(
      (page) => page.pluginId !== "blog"
    );

    logger.debug(
      `Removed ${document.pages.length - filteredPages.length} blog page(s)`
    );

    return {
      ...document,
      pages: filteredPages,
    };
  },

  getEditorRestrictions(blockType: BlockType) {
    if (blockType === "blogPostDetail") {
      return {
        lockedFields: ["content", "date", "authorName"],
      };
    }
    return undefined;
  },
};
