/**
 * Section Exporters Auto-Registration
 */

import { htmlExportRegistry } from "../HtmlExporter";
import { exportHero } from "./HeroExporter";
import { exportNavbar } from "./NavbarExporter";
import { exportFooter } from "./FooterExporter";
import {
  exportFeature,
  exportFeatureGrid,
  exportCta,
  exportPricingCard,
  exportPricing,
  exportTestimonial,
  exportTestimonialGrid,
  exportFaqItem,
  exportFaq,
  exportStats,
  exportStatItem,
  exportLogoCloud,
  exportSocialLinks,
} from "./MarketingExporters";
import {
  exportBlogCard,
  exportBlogCardGrid,
  exportTeamCard,
  exportTeamGrid,
  exportCourseCardGrid,
  exportCountdown,
  exportCarousel,
} from "./ContentGridExporters";
import {
  exportBlogPostCard,
  exportBlogPostGrid,
  exportBlogPostDetail,
  exportBlogCategoryFilter,
  exportBlogSearchBar,
  exportBlogRecentPosts,
  exportBlogTagCloud,
} from "./BlogPostExporters";
import {
  exportProductShowcase,
  exportAboutSection,
  exportContactSection,
} from "./AdminSectionExporters";

// Referência para renderChild
import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";

let renderChildRef: ((block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string) | null = null;

export function setSectionExportersRenderChild(
  fn: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string
) {
  renderChildRef = fn;
}

// Exporters simples (sem children)
htmlExportRegistry.register("hero", exportHero);
htmlExportRegistry.register("navbar", exportNavbar);
htmlExportRegistry.register("footer", exportFooter);
htmlExportRegistry.register("feature", exportFeature);
htmlExportRegistry.register("cta", exportCta);
htmlExportRegistry.register("pricingCard", exportPricingCard);
htmlExportRegistry.register("testimonial", exportTestimonial);
htmlExportRegistry.register("faqItem", exportFaqItem);
htmlExportRegistry.register("stats", exportStats);
htmlExportRegistry.register("statItem", exportStatItem);
htmlExportRegistry.register("logoCloud", exportLogoCloud);
htmlExportRegistry.register("socialLinks", exportSocialLinks);
htmlExportRegistry.register("blogCard", exportBlogCard);
htmlExportRegistry.register("blogPostCard", exportBlogPostCard);
htmlExportRegistry.register("blogPostDetail", exportBlogPostDetail);
htmlExportRegistry.register("blogCategoryFilter", exportBlogCategoryFilter);
htmlExportRegistry.register("blogSearchBar", exportBlogSearchBar);
htmlExportRegistry.register("blogRecentPosts", exportBlogRecentPosts);
htmlExportRegistry.register("blogTagCloud", exportBlogTagCloud);
htmlExportRegistry.register("teamCard", exportTeamCard);
htmlExportRegistry.register("courseCardGrid", exportCourseCardGrid);
htmlExportRegistry.register("countdown", exportCountdown);
htmlExportRegistry.register("carousel", exportCarousel);
htmlExportRegistry.register("productShowcase", exportProductShowcase);
htmlExportRegistry.register("aboutSection", exportAboutSection);
htmlExportRegistry.register("contactSection", exportContactSection);

// Exporters que precisam de renderChild
htmlExportRegistry.register("featureGrid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportFeatureGrid(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("pricing", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportPricing(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("testimonialGrid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportTestimonialGrid(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("faq", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportFaq(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("blogCardGrid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportBlogCardGrid(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("blogPostGrid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportBlogPostGrid(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("teamGrid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportTeamGrid(block, depth, basePath, theme, renderChildRef);
});
