import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../registry';

// Importar TODOS os blocos para forçar auto-registro
import '../blocks/layout';
import '../blocks/content';
import '../blocks/composition';
import '../blocks/sections';
import '../blocks/forms';

// Lista completa de block types do schema (siteDocument.ts)
const ALL_BLOCK_TYPES = [
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
] as const;

// Blog plugin block types (registrados pelo plugin, não pelo barrel import)
const BLOG_PLUGIN_BLOCK_TYPES = [
  'blogPostCard', 'blogPostGrid', 'blogPostDetail',
  'blogCategoryFilter', 'blogSearchBar', 'blogRecentPosts', 'blogTagCloud',
] as const;

describe('Block Registry — Definições', () => {
  it('todos os block types do schema devem estar registrados', () => {
    const missing: string[] = [];
    for (const type of ALL_BLOCK_TYPES) {
      if (!componentRegistry.get(type)) {
        missing.push(type);
      }
    }
    expect(missing, `Block types sem definição: ${missing.join(', ')}`).toEqual([]);
  });

  it('cada block definition deve ter name, category e defaultProps', () => {
    const allDefs = componentRegistry.getAll();
    for (const def of allDefs) {
      expect(def.name, `${def.type} sem name`).toBeTruthy();
      expect(def.category, `${def.type} sem category`).toBeTruthy();
      expect(def.defaultProps, `${def.type} sem defaultProps`).toBeDefined();
    }
  });

  it('blog plugin blocks devem estar registrados após import do plugin', async () => {
    // Importar plugin para forçar registro
    await import('../../plugins/builtin/blog');

    const missing: string[] = [];
    for (const type of BLOG_PLUGIN_BLOCK_TYPES) {
      if (!componentRegistry.get(type)) {
        missing.push(type);
      }
    }
    expect(missing, `Blog plugin blocks sem definição: ${missing.join(', ')}`).toEqual([]);
  });

  it('total de blocos base (sem plugins) deve ser >= 49', () => {
    // 49 blocos base + forms = sem blog plugin
    const allDefs = componentRegistry.getAll();
    expect(allDefs.length).toBeGreaterThanOrEqual(49);
  });
});
