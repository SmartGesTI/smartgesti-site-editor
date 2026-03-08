import { describe, it, expect } from 'vitest';
import { pluginRegistry } from '../pluginRegistry';
import { componentRegistry } from '../../registry/registry';
import type { SiteDocument, SitePage, Block } from '../../schema/siteDocument';
import { defaultThemeTokens } from '../../schema/themeTokens';

// Importar blocos base e plugin
import '../../registry/blocks/layout';
import '../../registry/blocks/content';
import '../../registry/blocks/composition';
import '../../registry/blocks/sections';
import '../../registry/blocks/forms';
import '../builtin/blog';

function createBaseDocument(): SiteDocument {
  const homePage: SitePage = {
    id: 'page-home',
    name: 'Home',
    slug: 'home',
    structure: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          links: [{ text: 'Home', href: '/' }, { text: 'Contato', href: '/contato' }],
          layout: 'expanded',
        },
      } as Block,
      {
        id: 'hero-1',
        type: 'hero',
        props: { title: 'Welcome', variant: 'centered' },
      } as Block,
      {
        id: 'footer-1',
        type: 'footer',
        props: { columns: [] },
      } as Block,
    ],
  };

  return {
    schemaVersion: 2,
    metadata: { title: 'Test' },
    theme: defaultThemeTokens,
    pages: [homePage],
  } as SiteDocument;
}

describe('Blog Plugin — Ciclo de Vida', () => {
  it('deve estar disponível no plugin registry', () => {
    const plugin = pluginRegistry.get('blog');
    expect(plugin).toBeDefined();
    expect(plugin?.manifest.name).toBe('Blog');
  });

  it('ativação deve adicionar páginas de blog ao documento', () => {
    const doc = createBaseDocument();
    const result = pluginRegistry.activate(doc, 'blog');

    // Deve ter mais páginas que o original
    expect(result.pages.length).toBeGreaterThan(doc.pages.length);

    // Deve ter página de blog
    const blogPage = result.pages.find(p => p.slug === 'blog');
    expect(blogPage).toBeDefined();
    expect(blogPage?.pluginId).toBe('blog');

    // Deve ter página de post
    const postPage = result.pages.find(p => p.slug === 'blog/:slug');
    expect(postPage).toBeDefined();
    expect(postPage?.pluginId).toBe('blog');
  });

  it('ativação deve adicionar link Blog na navbar da home', () => {
    const doc = createBaseDocument();
    const result = pluginRegistry.activate(doc, 'blog');

    const navbar = result.pages[0].structure.find(b => b.type === 'navbar');
    expect(navbar).toBeDefined();

    const navbarProps = navbar!.props as Record<string, any>;
    const blogLink = navbarProps.links?.find((l: any) => l.href === '/site/p/blog');
    expect(blogLink).toBeDefined();
    expect(blogLink?.text).toBe('Blog');
  });

  it('ativação deve injetar seção blogPostGrid na home antes do footer', () => {
    const doc = createBaseDocument();
    const result = pluginRegistry.activate(doc, 'blog');

    const homePage = result.pages[0];
    const blogSection = homePage.structure.find(b => b.id === 'plugin-blog-home-grid');
    expect(blogSection).toBeDefined();
    expect(blogSection?.type).toBe('blogPostGrid');

    // Deve estar antes do footer
    const blogIdx = homePage.structure.findIndex(b => b.id === 'plugin-blog-home-grid');
    const footerIdx = homePage.structure.findIndex(b => b.type === 'footer');
    expect(blogIdx).toBeLessThan(footerIdx);
  });

  it('ativação deve registrar blog blocks no componentRegistry', () => {
    const blogBlockTypes = [
      'blogPostCard', 'blogPostGrid', 'blogPostDetail',
      'blogCategoryFilter', 'blogSearchBar', 'blogRecentPosts', 'blogTagCloud',
    ];

    for (const type of blogBlockTypes) {
      expect(componentRegistry.get(type), `${type} não registrado`).toBeDefined();
    }
  });

  it('plugins.active deve conter blog após ativação', () => {
    const doc = createBaseDocument();
    const activated = pluginRegistry.activate(doc, 'blog');
    expect(activated.plugins?.active).toContain('blog');
  });

  it('desativação deve remover páginas de blog e seção injetada', () => {
    const doc = createBaseDocument();
    const activated = pluginRegistry.activate(doc, 'blog');
    const deactivated = pluginRegistry.deactivate(activated, 'blog');

    // Páginas de blog removidas
    const blogPage = deactivated.pages.find(p => p.slug === 'blog');
    expect(blogPage).toBeUndefined();

    const postPage = deactivated.pages.find(p => p.slug === 'blog/:slug');
    expect(postPage).toBeUndefined();

    // Seção injetada removida da home
    const homePage = deactivated.pages[0];
    const blogSection = homePage.structure.find(b => b.id === 'plugin-blog-home-grid');
    expect(blogSection).toBeUndefined();

    // Link Blog removido da navbar
    const navbar = homePage.structure.find(b => b.type === 'navbar');
    const navbarProps = navbar!.props as Record<string, any>;
    const blogLink = navbarProps.links?.find((l: any) => l.href === '/site/p/blog');
    expect(blogLink).toBeUndefined();
  });

  it('plugins.active não deve conter blog após desativação', () => {
    const doc = createBaseDocument();
    const activated = pluginRegistry.activate(doc, 'blog');
    const deactivated = pluginRegistry.deactivate(activated, 'blog');
    expect(deactivated.plugins?.active).not.toContain('blog');
  });
});
