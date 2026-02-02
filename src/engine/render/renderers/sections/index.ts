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
