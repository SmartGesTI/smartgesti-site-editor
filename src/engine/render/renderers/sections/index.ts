/**
 * Section Renderers
 * Auto-registra todos os renderizadores de seções
 */

import { renderRegistry } from "../../registry/renderRegistry";
import { renderHero } from "./HeroRenderer";
import { renderFeature } from "./FeatureRenderer";
import { renderFeatureGrid } from "./FeatureGridRenderer";
import { renderPricing } from "./PricingRenderer";
import { renderPricingCard } from "./PricingCardRenderer";
import { renderTestimonial } from "./TestimonialRenderer";
import { renderTestimonialGrid } from "./TestimonialGridRenderer";
import { renderFaq } from "./FaqRenderer";
import { renderFaqItem } from "./FaqItemRenderer";
import { renderCta } from "./CtaRenderer";
import { renderStats } from "./StatsRenderer";
import { renderStatItem } from "./StatItemRenderer";
import { renderLogoCloud } from "./LogoCloudRenderer";
import { renderNavbar } from "./NavbarRenderer";
import { renderFooter } from "./FooterRenderer";
import { renderBlogPostCard } from "./BlogPostCardRenderer";
import { renderBlogPostGrid } from "./BlogPostGridRenderer";
import { renderBlogPostDetail } from "./BlogPostDetailRenderer";
import { renderBlogCategoryFilter } from "./BlogCategoryFilterRenderer";
import { renderBlogSearchBar } from "./BlogSearchBarRenderer";
import { renderProductShowcase } from "./ProductShowcaseRenderer";
import { renderAboutSection } from "./AboutSectionRenderer";
import { renderContactSection } from "./ContactSectionRenderer";
import { renderBlogRecentPosts } from "./BlogRecentPostsRenderer";
import { renderBlogTagCloud } from "./BlogTagCloudRenderer";
import { renderImageGallery } from "./ImageGalleryRenderer";
import { renderCountdown } from "./CountdownRenderer";
import { renderCarousel } from "./CarouselRenderer";
import { renderBlogCard } from "./BlogCardRenderer";
import { renderBlogCardGrid } from "./BlogCardGridRenderer";
import { renderTeamCard } from "./TeamCardRenderer";
import { renderTeamGrid } from "./TeamGridRenderer";
import { renderCourseCardGrid } from "./CourseCardGridRenderer";
import { renderCategoryCardGrid } from "./CategoryCardGridRenderer";

// Registrar renderizadores
renderRegistry.register("hero", renderHero);
renderRegistry.register("feature", renderFeature);
renderRegistry.register("featureGrid", renderFeatureGrid);
renderRegistry.register("pricing", renderPricing);
renderRegistry.register("pricingCard", renderPricingCard);
renderRegistry.register("testimonial", renderTestimonial);
renderRegistry.register("testimonialGrid", renderTestimonialGrid);
renderRegistry.register("faq", renderFaq);
renderRegistry.register("faqItem", renderFaqItem);
renderRegistry.register("cta", renderCta);
renderRegistry.register("stats", renderStats);
renderRegistry.register("statItem", renderStatItem);
renderRegistry.register("logoCloud", renderLogoCloud);
renderRegistry.register("navbar", renderNavbar);
renderRegistry.register("footer", renderFooter);
renderRegistry.register("blogPostCard", renderBlogPostCard);
renderRegistry.register("blogPostGrid", renderBlogPostGrid);
renderRegistry.register("blogPostDetail", renderBlogPostDetail);
renderRegistry.register("blogCategoryFilter", renderBlogCategoryFilter);
renderRegistry.register("blogSearchBar", renderBlogSearchBar);
renderRegistry.register("productShowcase", renderProductShowcase);
renderRegistry.register("aboutSection", renderAboutSection);
renderRegistry.register("contactSection", renderContactSection);
renderRegistry.register("blogRecentPosts", renderBlogRecentPosts);
renderRegistry.register("blogTagCloud", renderBlogTagCloud);
renderRegistry.register("imageGallery", renderImageGallery);
renderRegistry.register("countdown", renderCountdown);
renderRegistry.register("carousel", renderCarousel);
renderRegistry.register("blogCard", renderBlogCard);
renderRegistry.register("blogCardGrid", renderBlogCardGrid);
renderRegistry.register("teamCard", renderTeamCard);
renderRegistry.register("teamGrid", renderTeamGrid);
renderRegistry.register("courseCardGrid", renderCourseCardGrid);
renderRegistry.register("categoryCardGrid", renderCategoryCardGrid);
