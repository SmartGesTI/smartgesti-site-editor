import { describe, it, expect } from 'vitest';
import { htmlExportRegistry } from '../exporters/HtmlExporter';

// Importar todos os exporters para forçar auto-registro
import '../exporters/content';
import '../exporters/layout';
import '../exporters/sections';
import '../exporters/forms';

// Todos os block types que DEVEM ter exporter HTML
const ALL_BLOCK_TYPES_WITH_EXPORTER = [
  // Layout
  'container', 'stack', 'grid', 'box', 'spacer',
  // Content
  'heading', 'text', 'image', 'button', 'link', 'divider',
  'badge', 'icon', 'avatar', 'video', 'socialLinks',
  // Composition
  'card', 'section',
  // Sections
  'hero', 'feature', 'featureGrid', 'pricing', 'pricingCard',
  'testimonial', 'testimonialGrid', 'faq', 'faqItem', 'cta',
  'stats', 'statItem', 'logoCloud', 'navbar', 'footer',
  'countdown', 'carousel', 'blogCard', 'blogCardGrid',
  'teamCard', 'teamGrid', 'courseCardGrid', 'categoryCardGrid',
  // Image Gallery
  'imageGallery',
  // Advanced sections
  'productShowcase', 'aboutSection', 'contactSection',
  // Forms
  'form', 'input', 'textarea', 'formSelect',
  // Blog plugin
  'blogPostCard', 'blogPostGrid', 'blogPostDetail',
  'blogCategoryFilter', 'blogSearchBar', 'blogRecentPosts', 'blogTagCloud',
] as const;

describe('Export Registry — Paridade de Exporters', () => {
  it('todos os block types devem ter um exporter HTML registrado', () => {
    const missing: string[] = [];
    for (const type of ALL_BLOCK_TYPES_WITH_EXPORTER) {
      if (!htmlExportRegistry.has(type)) {
        missing.push(type);
      }
    }
    expect(missing, `Block types sem exporter: ${missing.join(', ')}`).toEqual([]);
  });

  it('cada exporter registrado deve ser uma função', () => {
    const registeredTypes = htmlExportRegistry.getRegisteredTypes();
    for (const type of registeredTypes) {
      const exporter = htmlExportRegistry.get(type);
      expect(typeof exporter, `Exporter de ${type} não é função`).toBe('function');
    }
  });
});
