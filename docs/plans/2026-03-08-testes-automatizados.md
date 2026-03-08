# Testes Automatizados — Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Estabelecer uma suite de testes automatizados que valide a integridade dos 57 blocos do editor — registro, paridade dual rendering, e export HTML.

**Architecture:** Vitest como test runner (compatível com Vite, zero config extra). Testes unitários focados em validação de registro (block definitions, renderers, exporters) e testes de integração para export HTML. Sem testes de componente React (requer DOM setup complexo com vanilla-extract).

**Tech Stack:** Vitest, @testing-library/react (futuro), Node.js assertions

---

## Fase 1: Setup e Testes de Registro (Tasks 1-4)

Foco em validar que todos os blocos estão corretamente registrados nos 3 registries.

### Task 1: Setup do Vitest

**Files:**
- Modify: `package.json` (adicionar vitest + script)
- Create: `vitest.config.ts`

**Step 1: Instalar Vitest**

```bash
npm install -D vitest
```

**Step 2: Criar vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

**Step 3: Adicionar script de teste ao package.json**

Adicionar em `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verificar que Vitest roda**

```bash
npm test
```

Expected: "No test files found" (nenhum teste existe ainda)

**Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "feat(testes): setup do Vitest como test runner"
```

---

### Task 2: Teste de Registro de Block Definitions

**Files:**
- Create: `src/engine/registry/__tests__/blockRegistry.test.ts`

**Step 1: Escrever teste que valida TODOS os block types do schema**

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
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

  it('cada block definition deve ter inspectorMeta', () => {
    const allDefs = componentRegistry.getAll();
    const withoutInspector: string[] = [];
    for (const def of allDefs) {
      // Child blocks e layout blocks podem não ter inspectorMeta
      if (!def.inspectorMeta && !def.isChildBlock) {
        withoutInspector.push(def.type);
      }
    }
    // Informational: log blocks sem inspector (não falha)
    if (withoutInspector.length > 0) {
      console.warn(`Blocks sem inspectorMeta: ${withoutInspector.join(', ')}`);
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
});
```

**Step 2: Rodar teste para verificar que passa**

```bash
npm test -- src/engine/registry/__tests__/blockRegistry.test.ts
```

Expected: PASS (todos os blocks devem estar registrados após as correções de paridade)

**Step 3: Commit**

```bash
git add src/engine/registry/__tests__/blockRegistry.test.ts
git commit -m "test(registry): validação de registro de todos os 57 block types"
```

---

### Task 3: Teste de Paridade Renderer Registry

**Files:**
- Create: `src/engine/render/__tests__/renderRegistry.test.ts`

**Step 1: Escrever teste que valida que TODOS os block types têm renderer**

```typescript
import { describe, it, expect } from 'vitest';
import { renderRegistry } from '../registry/renderRegistry';

// Importar todos os renderers para forçar auto-registro
import '../renderers';

// Todos os block types que DEVEM ter renderer
// (mesma lista de blockRegistry.test.ts, excluindo blog plugin que registra separadamente)
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
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/render/__tests__/renderRegistry.test.ts
```

Expected: PASS

Nota: Este teste pode falhar se o ambiente Node não suportar JSX. Se falhar, ajustar vitest.config.ts para environment: 'jsdom' ou marcar como skip com nota.

**Step 3: Commit**

```bash
git add src/engine/render/__tests__/renderRegistry.test.ts
git commit -m "test(render): validação de paridade de renderers para todos os blocks"
```

---

### Task 4: Teste de Paridade Exporter Registry

**Files:**
- Create: `src/engine/export/__tests__/exportRegistry.test.ts`

**Step 1: Escrever teste que valida que TODOS os block types têm exporter**

```typescript
import { describe, it, expect } from 'vitest';
import { htmlExportRegistry, initializeExporters } from '../exporters';

// Inicializar exporters (injeta renderChild)
initializeExporters();

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
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/export/__tests__/exportRegistry.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/engine/export/__tests__/exportRegistry.test.ts
git commit -m "test(export): validação de paridade de exporters para todos os blocks"
```

---

## Fase 2: Testes de Cross-Registry Parity (Task 5)

### Task 5: Teste de Paridade Cruzada (Block ↔ Renderer ↔ Exporter)

**Files:**
- Create: `src/engine/__tests__/dualRenderingParity.test.ts`

**Step 1: Escrever teste que cruza os 3 registries**

```typescript
import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../registry/registry';
import { renderRegistry } from '../render/registry/renderRegistry';
import { htmlExportRegistry, initializeExporters } from '../export/exporters';

// Forçar auto-registro de tudo
import '../registry/blocks/layout';
import '../registry/blocks/content';
import '../registry/blocks/composition';
import '../registry/blocks/sections';
import '../registry/blocks/forms';
import '../render/renderers';
import '../plugins/builtin/blog';

initializeExporters();

describe('Dual Rendering Parity — Cross-Registry', () => {
  it('todo block registrado deve ter renderer E exporter', () => {
    const allDefs = componentRegistry.getAll();
    const missingRenderer: string[] = [];
    const missingExporter: string[] = [];

    for (const def of allDefs) {
      if (!renderRegistry.has(def.type)) {
        missingRenderer.push(def.type);
      }
      if (!htmlExportRegistry.has(def.type)) {
        missingExporter.push(def.type);
      }
    }

    expect(
      missingRenderer,
      `Blocks registrados SEM renderer: ${missingRenderer.join(', ')}`,
    ).toEqual([]);

    expect(
      missingExporter,
      `Blocks registrados SEM exporter: ${missingExporter.join(', ')}`,
    ).toEqual([]);
  });

  it('nenhum renderer órfão (sem block definition)', () => {
    const allRenderers = renderRegistry.getAll();
    const orphanRenderers: string[] = [];

    for (const [type] of allRenderers) {
      if (!componentRegistry.get(type)) {
        orphanRenderers.push(type);
      }
    }

    expect(
      orphanRenderers,
      `Renderers sem block definition: ${orphanRenderers.join(', ')}`,
    ).toEqual([]);
  });

  it('nenhum exporter órfão (sem block definition)', () => {
    const registeredTypes = htmlExportRegistry.getRegisteredTypes();
    const orphanExporters: string[] = [];

    for (const type of registeredTypes) {
      if (!componentRegistry.get(type)) {
        orphanExporters.push(type);
      }
    }

    expect(
      orphanExporters,
      `Exporters sem block definition: ${orphanExporters.join(', ')}`,
    ).toEqual([]);
  });

  it('contagem de registros deve ser consistente', () => {
    const defCount = componentRegistry.getAll().length;
    const rendererCount = renderRegistry.getAll().length;
    const exporterCount = htmlExportRegistry.getRegisteredTypes().length;

    // Todos devem ter o mesmo número
    expect(rendererCount, `Renderers (${rendererCount}) != Definitions (${defCount})`).toBe(defCount);
    expect(exporterCount, `Exporters (${exporterCount}) != Definitions (${defCount})`).toBe(defCount);
  });
});
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/__tests__/dualRenderingParity.test.ts
```

Expected: PASS (se Tasks 1-4 passaram, esta deve passar também)

**Step 3: Commit**

```bash
git add src/engine/__tests__/dualRenderingParity.test.ts
git commit -m "test(engine): validação de paridade cruzada block-renderer-exporter"
```

---

## Fase 3: Testes de Export HTML (Tasks 6-7)

### Task 6: Teste de Export de Blocos Simples

**Files:**
- Create: `src/engine/export/__tests__/blockExport.test.ts`

**Step 1: Escrever testes de export para blocos representativos**

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { htmlExportRegistry, initializeExporters } from '../exporters';
import type { Block } from '../../schema/siteDocument';

// Importar exporters
import '../exporters/content';
import '../exporters/layout';
import '../exporters/sections';
import '../exporters/forms';

beforeAll(() => {
  initializeExporters();
});

function createBlock(type: string, props: Record<string, any>): Block {
  return { id: `test-${type}`, type, props } as Block;
}

describe('HTML Export — Blocos Simples', () => {
  it('heading export deve conter tag h1-h6 e texto', () => {
    const block = createBlock('heading', { text: 'Olá Mundo', level: 2 });
    const exporter = htmlExportRegistry.get('heading');
    expect(exporter).toBeDefined();

    const html = exporter!(block, 0);
    expect(html).toContain('Olá Mundo');
    expect(html).toContain('<h2');
  });

  it('text export deve conter parágrafo', () => {
    const block = createBlock('text', { content: 'Texto de teste' });
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

  it('image export deve conter tag img com src e alt', () => {
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

  it('button deve escapar href malicioso', () => {
    const block = createBlock('button', {
      text: 'Click',
      href: 'javascript:alert(1)',
    });
    const exporter = htmlExportRegistry.get('button');
    const html = exporter!(block, 0);

    // Deve escapar ou sanitizar javascript: URLs
    // O comportamento exato depende da implementação
    expect(html).toBeDefined();
  });
});
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/export/__tests__/blockExport.test.ts
```

Expected: PASS (maioria dos exporters já usa escapeHtml)

**Step 3: Commit**

```bash
git add src/engine/export/__tests__/blockExport.test.ts
git commit -m "test(export): testes de export HTML para blocos simples e XSS"
```

---

### Task 7: Teste de Export de Página Completa

**Files:**
- Create: `src/engine/export/__tests__/pageExport.test.ts`

**Step 1: Escrever teste de exportação de página completa**

```typescript
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
import '../exporters/content';
import '../exporters/layout';
import '../exporters/sections';
import '../exporters/forms';

function createMinimalDocument(): SiteDocument {
  const homePage: SitePage = {
    id: 'page-home',
    slug: 'home',
    title: 'Home',
    blocks: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          brandText: 'Meu Site',
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
    isHome: true,
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
    const html = exportPageToHtml(doc, doc.pages[0]);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('<body');
    expect(html).toContain('</html>');
  });

  it('deve incluir CSS variables do theme no head', () => {
    const doc = createMinimalDocument();
    const html = exportPageToHtml(doc, doc.pages[0]);

    expect(html).toContain('--sg-primary');
    expect(html).toContain(':root');
  });

  it('deve conter conteúdo dos blocos', () => {
    const doc = createMinimalDocument();
    const html = exportPageToHtml(doc, doc.pages[0]);

    expect(html).toContain('Meu Site');
    expect(html).toContain('Bem-vindo');
  });

  it('deve gerar HTML válido para página vazia (só navbar/footer)', () => {
    const doc = createMinimalDocument();
    doc.pages[0].blocks = [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: { brandText: 'Site', links: [], layout: 'expanded' },
      } as Block,
      {
        id: 'footer-1',
        type: 'footer',
        props: { companyName: 'Empresa', columns: [] },
      } as Block,
    ];

    const html = exportPageToHtml(doc, doc.pages[0]);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Site');
  });

  it('deve incluir metadata SEO quando configurada', () => {
    const doc = createMinimalDocument();
    doc.pages[0].seo = {
      title: 'Título SEO',
      description: 'Descrição SEO',
    };

    const html = exportPageToHtml(doc, doc.pages[0]);
    expect(html).toContain('Título SEO');
  });
});
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/export/__tests__/pageExport.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/engine/export/__tests__/pageExport.test.ts
git commit -m "test(export): testes de exportação de página HTML completa"
```

---

## Fase 4: Testes de Plugin System (Task 8)

### Task 8: Teste do Blog Plugin

**Files:**
- Create: `src/engine/plugins/__tests__/blogPlugin.test.ts`

**Step 1: Escrever teste do ciclo de vida do blog plugin**

```typescript
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

function createBaseDocument(): SiteDocument {
  const homePage: SitePage = {
    id: 'page-home',
    slug: 'home',
    title: 'Home',
    blocks: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          brandText: 'Site',
          links: [{ text: 'Home', href: '/' }],
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
        props: { companyName: 'Test', columns: [] },
      } as Block,
    ],
    isHome: true,
  };

  return {
    schemaVersion: 2,
    metadata: { title: 'Test' },
    theme: defaultThemeTokens,
    pages: [homePage],
    activePlugins: [],
  } as SiteDocument;
}

describe('Blog Plugin — Ciclo de Vida', () => {
  it('deve estar disponível no plugin registry', () => {
    const available = pluginRegistry.getAvailable();
    const blogPlugin = available.find(p => p.id === 'blog');
    expect(blogPlugin).toBeDefined();
    expect(blogPlugin?.name).toBeTruthy();
  });

  it('ativação deve adicionar páginas de blog ao documento', () => {
    const doc = createBaseDocument();
    const result = pluginRegistry.activate(doc, 'blog');

    // Deve ter mais páginas que o original
    expect(result.pages.length).toBeGreaterThan(doc.pages.length);

    // Deve ter página de blog
    const blogPage = result.pages.find(p => p.slug === 'blog');
    expect(blogPage).toBeDefined();
  });

  it('ativação deve adicionar link no navbar', () => {
    const doc = createBaseDocument();
    const result = pluginRegistry.activate(doc, 'blog');

    const navbar = result.pages[0].blocks.find(b => b.type === 'navbar');
    expect(navbar).toBeDefined();

    const navbarProps = navbar!.props as Record<string, any>;
    const blogLink = navbarProps.links?.find((l: any) => l.text === 'Blog');
    expect(blogLink).toBeDefined();
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

  it('desativação deve remover páginas de blog', () => {
    const doc = createBaseDocument();
    const activated = pluginRegistry.activate(doc, 'blog');
    const deactivated = pluginRegistry.deactivate(activated, 'blog');

    const blogPage = deactivated.pages.find(p => p.slug === 'blog');
    expect(blogPage).toBeUndefined();
  });

  it('activePlugins deve ser atualizado após ativação/desativação', () => {
    const doc = createBaseDocument();
    const activated = pluginRegistry.activate(doc, 'blog');
    expect(activated.activePlugins).toContain('blog');

    const deactivated = pluginRegistry.deactivate(activated, 'blog');
    expect(deactivated.activePlugins).not.toContain('blog');
  });
});
```

**Step 2: Rodar teste**

```bash
npm test -- src/engine/plugins/__tests__/blogPlugin.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/engine/plugins/__tests__/blogPlugin.test.ts
git commit -m "test(plugins): testes do ciclo de vida do blog plugin"
```

---

## Fase 5: Integração no CI e Validação Final (Task 9)

### Task 9: Rodar Suite Completa e Documentar

**Step 1: Rodar toda a suite de testes**

```bash
npm test
```

Expected: Todos os testes passam (7 test files, ~25 test cases)

**Step 2: Verificar build ainda funciona**

```bash
npm run build
```

Expected: Build OK

**Step 3: Atualizar package.json sideEffects se necessário**

Verificar que test files não são incluídos nos sideEffects.

**Step 4: Commit final**

```bash
git add -A
git commit -m "test(suite): suite de testes automatizados completa — 7 arquivos, ~25 casos"
```

---

## Resumo

| Fase | Task | Descrição | Testes |
|------|------|-----------|--------|
| 1 | 1 | Setup Vitest | — |
| 1 | 2 | Block definitions registry | ~4 |
| 1 | 3 | Renderer registry parity | ~2 |
| 1 | 4 | Exporter registry parity | ~2 |
| 2 | 5 | Cross-registry parity | ~4 |
| 3 | 6 | Block export HTML | ~8 |
| 3 | 7 | Page export HTML | ~5 |
| 4 | 8 | Blog plugin lifecycle | ~6 |
| 5 | 9 | Suite completa + CI | — |

**Total: 9 tasks, ~31 test cases**

## O que NÃO está no escopo (futuro)

- Testes de componente React (requer jsdom + vanilla-extract mock)
- Testes visuais / snapshot (complexidade com CSS-in-JS)
- Testes E2E (requer browser + demo app)
- Cobertura de código (não tem valor sem testes de componente)

Esses podem ser adicionados incrementalmente após a base estar sólida.
