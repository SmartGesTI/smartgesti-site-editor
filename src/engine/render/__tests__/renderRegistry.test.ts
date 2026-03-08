import { describe, it, expect } from 'vitest';
import { renderRegistry } from '../registry/renderRegistry';

// Importar todos os renderers para forçar auto-registro
import '../renderers';

// Todos os block types que DEVEM ter renderer
const ALL_BLOCK_TYPES_WITH_RENDERER = [
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

describe('Render Registry — Paridade de Renderers', () => {
  it('todos os block types devem ter um renderer registrado', () => {
    const missing: string[] = [];
    for (const type of ALL_BLOCK_TYPES_WITH_RENDERER) {
      if (!renderRegistry.has(type)) {
        missing.push(type);
      }
    }
    expect(missing, `Block types sem renderer: ${missing.join(', ')}`).toEqual([]);
  });

  it('cada renderer registrado deve ser uma função', () => {
    const allRenderers = renderRegistry.getAll();
    for (const [type, renderer] of allRenderers) {
      expect(typeof renderer, `Renderer de ${type} não é função`).toBe('function');
    }
  });
});
