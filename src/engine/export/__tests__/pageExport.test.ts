import { describe, it, expect } from 'vitest';
import { exportPageToHtml } from '../exportHtml';
import type { SiteDocument, SitePage, Block } from '../../schema/siteDocument';
import { defaultThemeTokens } from '../../schema/themeTokens';

// Importar tudo para auto-registro
import '../../registry/blocks/layout';
import '../../registry/blocks/content';
import '../../registry/blocks/composition';
import '../../registry/blocks/sections';
import '../../registry/blocks/forms';

function createMinimalDocument(): SiteDocument {
  const homePage: SitePage = {
    id: 'page-home',
    name: 'Home',
    slug: 'home',
    structure: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          links: [{ text: 'Home', href: '/' }],
          layout: 'expanded',
        },
      } as Block,
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'Bem-vindo',
          subtitle: 'Subtítulo',
          variant: 'centered',
        },
      } as Block,
      {
        id: 'footer-1',
        type: 'footer',
        props: {
          companyName: 'Empresa',
          columns: [],
        },
      } as Block,
    ],
  };

  return {
    schemaVersion: 2,
    metadata: {
      title: 'Site Teste',
      description: 'Descrição',
    },
    theme: defaultThemeTokens,
    pages: [homePage],
  } as SiteDocument;
}

describe('Page Export — HTML Completo', () => {
  it('deve gerar HTML com doctype, head e body', () => {
    const doc = createMinimalDocument();
    const html = exportPageToHtml(doc.pages[0], doc);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('<body');
    expect(html).toContain('</html>');
  });

  it('deve incluir CSS variables do theme no head', () => {
    const doc = createMinimalDocument();
    const html = exportPageToHtml(doc.pages[0], doc);

    expect(html).toContain('--sg-primary');
    expect(html).toContain(':root');
  });

  it('deve conter conteúdo dos blocos', () => {
    const doc = createMinimalDocument();
    const html = exportPageToHtml(doc.pages[0], doc);

    // Hero title e subtitle devem estar no HTML
    expect(html).toContain('Bem-vindo');
    expect(html).toContain('Subtítulo');
  });

  it('deve gerar HTML válido para página só com navbar e footer', () => {
    const doc = createMinimalDocument();
    doc.pages[0].structure = [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: { links: [], layout: 'expanded' },
      } as Block,
      {
        id: 'footer-1',
        type: 'footer',
        props: { companyName: 'Empresa', columns: [] },
      } as Block,
    ];

    const html = exportPageToHtml(doc.pages[0], doc);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('data-block-id="navbar-1"');
    expect(html).toContain('data-block-id="footer-1"');
  });

  it('deve incluir metadata SEO quando configurada', () => {
    const doc = createMinimalDocument();
    doc.pages[0].seo = {
      metaTitle: 'Título SEO',
      metaDescription: 'Descrição SEO',
    };

    const html = exportPageToHtml(doc.pages[0], doc);
    expect(html).toContain('Título SEO');
  });
});
