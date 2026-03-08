import { describe, it, expect, beforeAll } from 'vitest';
import { htmlExportRegistry } from '../exporters/HtmlExporter';
import { initializeExporters } from '../exporters';
import type { Block } from '../../schema/siteDocument';

// Importar exporters
import '../exporters/content';
import '../exporters/layout';
import '../exporters/sections';
import '../exporters/forms';

beforeAll(() => {
  // Inicializar com renderChild dummy para exporters que precisam
  initializeExporters((block, depth, basePath, theme) => {
    const exporter = htmlExportRegistry.get(block.type);
    if (exporter) return exporter(block, depth, basePath, theme);
    return `<div data-block-id="${block.id}">[${block.type}]</div>`;
  });
});

function createBlock(type: string, props: Record<string, any>): Block {
  return { id: `test-${type}`, type, props } as Block;
}

describe('HTML Export — Blocos Simples', () => {
  it('heading export deve conter tag h e texto', () => {
    const block = createBlock('heading', { text: 'Olá Mundo', level: 2 });
    const exporter = htmlExportRegistry.get('heading');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Olá Mundo');
    expect(html).toContain('<h2');
  });

  it('text export deve conter conteúdo', () => {
    const block = createBlock('text', { text: 'Texto de teste' });
    const exporter = htmlExportRegistry.get('text');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Texto de teste');
  });

  it('button export deve conter link e texto', () => {
    const block = createBlock('button', { text: 'Clique aqui', href: '/pagina' });
    const exporter = htmlExportRegistry.get('button');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Clique aqui');
    expect(html).toContain('/pagina');
  });

  it('image export deve conter src e alt', () => {
    const block = createBlock('image', { src: 'foto.jpg', alt: 'Descrição' });
    const exporter = htmlExportRegistry.get('image');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('foto.jpg');
    expect(html).toContain('Descrição');
  });

  it('divider export deve gerar separador', () => {
    const block = createBlock('divider', {});
    const exporter = htmlExportRegistry.get('divider');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('<hr');
  });

  it('spacer export deve gerar espaçamento', () => {
    const block = createBlock('spacer', { height: '2rem' });
    const exporter = htmlExportRegistry.get('spacer');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html.length).toBeGreaterThan(0);
  });

  it('countdown export deve conter título e placeholders', () => {
    const block = createBlock('countdown', {
      title: 'Em breve!',
      showPlaceholders: true,
      variant: 'default',
    });
    const exporter = htmlExportRegistry.get('countdown');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Em breve!');
    expect(html).toContain('Days');
  });

  it('categoryCardGrid export deve conter título e cards', () => {
    const block = createBlock('categoryCardGrid', {
      title: 'Categorias',
      columns: 3,
      categories: [
        { title: 'Design', href: '#', icon: '🎨' },
      ],
    });
    const exporter = htmlExportRegistry.get('categoryCardGrid');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Categorias');
    expect(html).toContain('Design');
  });
});

describe('HTML Export — XSS Prevention', () => {
  it('heading deve escapar HTML malicioso', () => {
    const block = createBlock('heading', {
      text: '<script>alert("xss")</script>',
      level: 1,
    });
    const exporter = htmlExportRegistry.get('heading');
    const html = exporter!(block, 0);

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('text deve escapar HTML malicioso', () => {
    const block = createBlock('text', {
      text: '<img onerror="alert(1)" src=x>',
    });
    const exporter = htmlExportRegistry.get('text');
    const html = exporter!(block, 0);

    // O conteúdo deve estar escapado — não pode conter tag <img real
    expect(html).not.toContain('<img ');
    expect(html).toContain('&lt;img');
  });
});
