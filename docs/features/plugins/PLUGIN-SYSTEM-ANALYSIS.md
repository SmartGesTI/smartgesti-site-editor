# Plugin System — Análise Arquitetural Completa

> **Data**: 2026-02-07 (RFC) · Atualizado 2026-02-08 (pós-implementação)
> **Status**: Implementado (Sprints 0–5 concluídos) — E-commerce pendente
> **Autor**: Claude Code (análise automatizada do codebase)
>
> **Nota de implementação**: Este documento foi escrito como RFC antes da implementação.
> As seções marcadas com ✅ refletem o que foi implementado. Diferenças entre proposta e
> implementação real estão anotadas inline. Ver commits `812ba76`…`562d9be` para o código.

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Estado Atual da Arquitetura](#2-estado-atual-da-arquitetura)
3. [Análise do Consumidor (SmartGesti-Ensino)](#3-análise-do-consumidor-smartgesti-ensino)
4. [Inventário Completo de Blocos](#4-inventário-completo-de-blocos)
5. [Pontos de Extensão Existentes](#5-pontos-de-extensão-existentes)
6. [Gaps e Limitações Atuais](#6-gaps-e-limitações-atuais)
7. [Proposta: Sistema de Plugins](#7-proposta-sistema-de-plugins)
8. [Plugin: E-commerce](#8-plugin-e-commerce)
9. [Plugin: Blog](#9-plugin-blog)
10. [Arquitetura de Dados SaaS](#10-arquitetura-de-dados-saas)
11. [Integração com Backend](#11-integração-com-backend)
12. [Roadmap de Implementação](#12-roadmap-de-implementação)
13. [Decisões em Aberto](#13-decisões-em-aberto)

---

## 1. Resumo Executivo

### O que temos hoje

O SmartGesti Site Editor (v1.0.0) é uma biblioteca React compartilhada que fornece um editor visual de landing pages baseado em blocos. Atualmente:

- **63 tipos de blocos** organizados em 5 categorias (layout, content, composition, sections, forms)
- **Dual rendering**: React (preview) + HTML estático (export)
- **Multi-página**: Cada `SiteDocument` possui N páginas com rotas independentes
- **Sistema de templates**: 3 templates pré-construídos (todos para educação)
- **Sistema de temas**: Paletas de cores, tipografia, escalas — aplicadas globalmente
- **Patch system**: Undo/redo via RFC 6902 JSON Patch
- **Multi-tenant**: Assets isolados por `tenant-{id}/school-{id}/site-{id}/`

### O que foi implementado (Sprints 0–5) ✅

1. ✅ **Plugin System** — `PluginManifest`, `PluginRegistration`, `PluginRegistry` singleton
2. ✅ **Conteúdo dinâmico** — `ContentProvider` interface com hidratação assíncrona
3. ✅ **Conexão com dados externos** — `BlogContentProvider` no consumer
4. ✅ **Páginas dinâmicas** — `matchDynamicPage()` resolve `blog/:slug`
5. ✅ **Restrição de edição** — `lockedFields`, `nonRemovable`, `lockedStructure`
6. ✅ **Backend genérico** — tabela `plugin_data` (JSONB) + API REST

### O que falta

1. **Plugin E-commerce** — blocos de produto, carrinho, checkout (Sprint 6+)
2. **Blocos avançados de Blog** — `blogSidebar`, `blogHero`, `blogNewsletter` (propostos neste RFC mas não prioritários)
3. **Página de categoria** — template `blog/categoria/:slug` (proposto mas desnecessário no MVP)
4. **Plugin settings** configuráveis por tenant
5. **Tabela `plugin_assets`** — upload de arquivos específicos de plugins

### Visão proposta

Plugins como **módulos que estendem o SiteDocument** com:
- Novos tipos de página (product detail, blog post, cart, checkout)
- Novos blocos especializados (product card, cart widget, blog list)
- Dados dinâmicos conectados via API (`ContentProvider`)
- Schema de dados reutilizável entre projetos (SaaS-ready)
- Customização restrita (paleta do tema, campos específicos)

---

## 2. Estado Atual da Arquitetura

### 2.1. SiteDocument Schema

```
SiteDocument
├── schemaVersion: 2
├── theme: ThemeTokens
│   ├── colors (20+ variáveis semânticas)
│   ├── typography (fontFamily, baseSize, headingScale)
│   ├── radiusScale, shadowScale, spacingScale
│   ├── motion, backgroundStyle
│   └── gradient?
├── content?: { collections?: ContentCollection[] }
│   └── ContentCollection { id, type, items[] }
│       type: "testimonials" | "faq" | "posts" | "services" | "team" | "custom"
└── pages: SitePage[]
    └── SitePage { id, name, slug, structure: Block[] }
```

**Observação crucial**: Já existe `content.collections` no schema com tipo `"posts"` — isso é um proto-plugin de Blog que nunca foi implementado.

### 2.2. Block System

Cada bloco segue o padrão:

```typescript
interface BlockBase {
  id: string;
  type: BlockType;
}

interface HeroBlock extends BlockBase {
  type: "hero";
  props: { /* 50+ props */ };
  children?: Block[];
}
```

Registros acontecem em 3 camadas paralelas:
1. **ComponentRegistry** (`registry.ts`) — definições, inspector meta, variações
2. **RenderRegistry** (`renderRegistry.ts`) — React renderers para preview
3. **HtmlExportRegistry** (`HtmlExporter.ts`) — exportadores HTML estáticos

### 2.3. Fluxo de Criação de Site

```
1. Usuário abre editor → TemplatePicker (ou initialData do backend)
2. Template → sharedTemplateToEngineDocument() → SiteDocument
3. Edição via PatchBuilder → applyPatch() → state update
4. Save → POST/PUT /api/sites (SiteDocument serializado como JSON)
5. Publish → POST /api/sites/:id/publish (gera publishedHtml)
6. View → LandingPageViewer busca GET /api/sites/:id → exportPageToHtml()
```

### 2.4. Multi-Página

```typescript
// pageTemplateFactory.ts
createDefaultPageStructure(id, name, slug, allPages) → SitePage
  ├── Home: navbar → hero → footer
  └── Other: navbar → heading → text → footer

// Navbar auto-sync: ao adicionar/remover página, links do navbar são atualizados
// em todas as páginas via useNavbarAutoSync hook
```

**Links de navegação**: `"/"` para home, `"/p/{slug}"` para sub-páginas.
**No viewer**: basePath é `/site` ou `/site/escola/:schoolSlug`.

### 2.5. Template System

Templates são `SiteDocument` completos com blocos pré-configurados:

```typescript
interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;   // "education"
  tags: string[];
  preview?: string;
}
```

Atualmente: `escola-premium`, `escola-edvi`, `escola-zilom` (todos educação).

---

## 3. Análise do Consumidor (SmartGesti-Ensino)

### 3.1. Como o Editor é Usado

```typescript
// CriarSite.tsx
<LandingPageEditor
  initialData={siteData?.template}
  onSave={handleSave}
  onPublish={handlePublish}
  uploadConfig={{ tenantId, schoolId, siteId, authToken }}
/>
```

### 3.2. Rotas do Site Público

```typescript
// routes.ts
site: {
  home: () => '/site',
  page: (pageSlug) => `/site/p/${pageSlug}`,
  school: (schoolSlug) => `/site/escola/${schoolSlug}`,
  schoolPage: (schoolSlug, pageSlug) => `/site/escola/${schoolSlug}/p/${pageSlug}`,
}
```

### 3.3. API Backend

| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/api/sites?projectId=ensino&schoolId={id}` | Listar sites |
| GET | `/api/sites/:id?projectId=ensino` | Buscar site |
| POST | `/api/sites` | Criar site |
| PUT | `/api/sites/:id?projectId=ensino` | Atualizar site |
| DELETE | `/api/sites/:id?projectId=ensino` | Deletar site |
| POST | `/api/sites/:id/publish?projectId=ensino` | Publicar site |
| GET | `/api/sites/current?projectId=ensino` | Site atual do tenant |

### 3.4. Multi-Tenancy

```
Subdomain → getTenantFromSubdomain()
  ├── magistral.smartgesti.com.br → "magistral"
  ├── ensinosbruno.localhost:5173 → "ensinosbruno"
  └── ?tenant=xxx (fallback)

Headers em todas as requests:
  Authorization: Bearer {supabase_token}
  X-Tenant-Subdomain: {tenant}
  X-School-Id: {schoolId}
```

### 3.5. Modelo de Dados no Backend

```typescript
interface Site {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  projectId: string;      // "ensino" | "portfolio" | futuro...
  schoolId: string;        // Escopo do dono
  template: SiteDocument;  // JSON completo
  publishedHtml?: string;  // HTML gerado no publish
  createdAt: string;
  updatedAt: string;
}
```

**Key insight**: O campo `projectId` já suporta multi-projeto, mas o `schoolId` é específico do contexto Ensino. Para SaaS genérico, precisamos de um conceito mais abstrato (ex: `ownerId` + `ownerType`).

---

## 4. Inventário Completo de Blocos

### 4.1. Layout (5 blocos)
| Bloco | Descrição | Children? |
|-------|-----------|-----------|
| `container` | Largura máxima e padding | Sim |
| `stack` | Layout vertical/horizontal | Sim |
| `grid` | CSS Grid configurável | Sim |
| `box` | Wrapper genérico | Sim |
| `spacer` | Espaçamento vertical | Não |

### 4.2. Content (11 blocos)
| Bloco | Descrição |
|-------|-----------|
| `heading` | Títulos h1-h6 |
| `text` | Texto com HTML rich |
| `image` | Imagem com alt, radius, shadow |
| `button` | Botão com variantes |
| `link` | Link inline |
| `divider` | Separador horizontal |
| `badge` | Badge/chip |
| `icon` | Ícone vetorial |
| `avatar` | Imagem circular |
| `video` | Embed de vídeo |
| `socialLinks` | Links de redes sociais |

### 4.3. Composition (2 blocos)
| Bloco | Descrição | Children? |
|-------|-----------|-----------|
| `card` | Card com border/shadow | Sim |
| `section` | Seção com background | Sim |

### 4.4. Sections (15 blocos)
| Bloco | Descrição | Variações |
|-------|-----------|-----------|
| `hero` | Hero principal | 7 variações (split, parallax, overlay, gradient, minimal, card, carousel) |
| `navbar` | Barra de navegação | 3 variações (expanded, centered, compact) |
| `footer` | Rodapé | - |
| `feature` / `featureGrid` | Features | - |
| `pricing` / `pricingCard` | Tabela de preços | - |
| `testimonial` / `testimonialGrid` | Depoimentos | - |
| `faq` / `faqItem` | Perguntas frequentes | - |
| `cta` | Call to Action | - |
| `stats` / `statItem` | Estatísticas | - |
| `logoCloud` | Grid de logos | - |

### 4.5. Blocos Reutilizáveis (8 blocos)
| Bloco | Descrição |
|-------|-----------|
| `countdown` | Timer regressivo |
| `carousel` | Slideshow de imagens |
| `blogCard` / `blogCardGrid` | Cards de blog |
| `teamCard` / `teamGrid` | Cards de equipe |
| `courseCardGrid` | Grid de cursos |
| `categoryCardGrid` | Grid de categorias |

### 4.6. Forms (4 blocos)
| Bloco | Descrição |
|-------|-----------|
| `form` | Container de formulário |
| `input` | Campo de texto |
| `textarea` | Área de texto |
| `formSelect` | Select/dropdown |

### 4.7. Blocos Relevantes para Plugins

**Já existem proto-blocos** que seriam base para plugins:
- `blogCard` / `blogCardGrid` → Plugin Blog
- `courseCardGrid` → Plugin Cursos (educação)
- `categoryCardGrid` → Plugin Categorias
- `pricingCard` / `pricing` → Base para Plugin E-commerce
- `form` → Base para Plugin Formulários dinâmicos

**O que falta** para serem "plugáveis":
- Conexão com dados dinâmicos (API)
- Páginas de detalhe automáticas
- CRUD integrado (admin)

---

## 5. Pontos de Extensão Existentes

### 5.1. Registry Pattern (Já Extensível)

```typescript
// Registrar novo bloco
componentRegistry.register("productCard", {
  type: "productCard",
  name: "Card de Produto",
  category: "sections",
  defaultProps: { /* ... */ },
  inspectorMeta: { /* ... */ },
});

// Registrar renderer
renderRegistry.register("productCard", renderProductCard);

// Registrar exporter
htmlExportRegistry.register("productCard", exportProductCard);
```

**Nenhuma mudança** necessária no registry para suportar novos blocos — o pattern já é extensível.

### 5.2. ContentCollection (Proto-Plugin)

```typescript
content?: {
  collections?: ContentCollection[];
}

interface ContentCollection {
  id: string;
  type: "testimonials" | "faq" | "posts" | "services" | "team" | "custom";
  items: Array<Record<string, any>>;
}
```

Existe no schema mas **nunca foi implementado** nos renderers. Os blocos de blog/team/faq usam dados inline nas props, não coleções compartilhadas.

### 5.3. Template System

Templates já são `SiteDocument` completos. Um plugin poderia fornecer templates com suas páginas e blocos pré-configurados.

### 5.4. Page Factory

`createDefaultPageStructure()` cria páginas com navbar + conteúdo + footer. Poderia ser estendido para gerar páginas específicas de plugin.

### 5.5. Theme System

O tema é global no `SiteDocument` — cores, tipografia, escalas. Plugins herdam automaticamente.

---

## 6. Gaps e Limitações ~~Atuais~~ (status pós-implementação)

### 6.1. ~~Sem Conceito de "Plugin" no Schema~~ ✅ RESOLVIDO

`SiteDocument.plugins?: SitePluginsConfig` com `active: string[]` e `config?`.
`SitePage` ganhou `pluginId`, `pageTemplateId`, `isDynamic`, `dataSource`, `editRestrictions`.

### 6.2. ~~Sem Dados Dinâmicos~~ ✅ RESOLVIDO

`ContentProvider` interface implementada. `hydratePageWithContent()` injeta dados da API nos blocos antes do render. `LandingPageViewer` aceita prop `contentProviders?: ContentProvider[]`.

### 6.3. ~~Sem Páginas Dinâmicas~~ ✅ RESOLVIDO

`matchDynamicPage()` resolve slugs dinâmicos (ex: `blog/meu-post` → página `blog/:slug`). Blog plugin cria páginas automaticamente via `onActivate()`. Rotas wildcard no consumer (`/site/p/*`).

### 6.4. ~~Sem Restrição de Edição~~ ✅ RESOLVIDO

`getEditorRestrictions()` retorna `lockedFields` por blockType. `BlockPropertyEditor` aplica read-only com lock icon. Páginas com `nonRemovable: true` não podem ser deletadas.

### 6.5. ~~Sem Backend Genérico~~ ✅ RESOLVIDO

Tabela `plugin_data` (JSONB) com RLS multi-tenant. API REST genérica `/api/plugin-data` com CRUD, publish/unpublish, bulk operations. `owner_id` + `owner_type` genérico.

### 6.6. ~~Export HTML é Estático~~ ✅ RESOLVIDO (abordagem híbrida)

Implementado como **Opção D** (híbrido): Editor preview usa `defaultProps` com sample data (síncrono). Viewer usa `hydratePageWithContent()` antes do `exportPageToHtml()` (assíncrono). Footer/navbar duplicados corrigidos com detecção inteligente em `exportPageToHtml()`. Click interceptor + `onNavigate` para navegação dentro do iframe.

---

## 7. Proposta: Sistema de Plugins

### 7.1. Conceitos Fundamentais

```
Plugin = {
  manifest     → metadata, capabilities, dependencies
  blocks[]     → novos tipos de bloco (registry, renderer, exporter)
  pages[]      → templates de página (product-detail, blog-post, cart)
  dataSchema   → schema dos dados que o plugin gerencia (Product, Post)
  api          → endpoints necessários (CRUD + custom)
  restrictions → regras de edição (campos locked, seções obrigatórias)
  templates[]  → SiteDocument parciais com blocos do plugin pré-configurados
}
```

### 7.2. Plugin Manifest

```typescript
interface PluginManifest {
  id: string;                           // "ecommerce" | "blog" | "courses"
  version: string;                      // "1.0.0"
  name: string;                         // "E-commerce"
  description: string;
  icon: string;                         // Lucide icon name

  // Capacidades
  capabilities: {
    blocks: string[];                   // BlockTypes que este plugin adiciona
    pageTemplates: PageTemplate[];      // Templates de página
    dataSchemas: DataSchema[];          // Schemas de dados
    contentProviders: string[];         // Providers de dados dinâmicos
  };

  // Restrições
  restrictions?: {
    lockedFields?: Record<string, string[]>;  // blockType → fields que não podem editar
    requiredPages?: string[];                  // Páginas que não podem ser removidas
    requiredBlocks?: Record<string, string[]>; // page → blocks obrigatórios
    maxPages?: number;                         // Limite de páginas manuais
  };

  // Dependências
  dependencies?: string[];              // Outros plugins necessários

  // Configuração
  settings?: Record<string, PluginSetting>;  // Config por tenant
}
```

### 7.3. Ativação no SiteDocument

```typescript
interface SiteDocument {
  schemaVersion: 2;
  theme: ThemeTokens;

  // NOVO: Plugins ativos e suas configurações
  plugins?: {
    active: string[];                           // ["blog", "ecommerce"]
    config?: Record<string, Record<string, any>>; // { blog: { postsPerPage: 6 } }
  };

  // EXISTENTE (expandido)
  content?: {
    collections?: ContentCollection[];
  };

  pages: SitePage[];
}
```

### 7.4. Plugin Registry (Nova Camada)

```typescript
// src/engine/plugins/pluginRegistry.ts

interface PluginRegistration {
  manifest: PluginManifest;

  // Hooks de ciclo de vida
  onActivate?: (document: SiteDocument) => SiteDocument;   // Adiciona páginas/blocos
  onDeactivate?: (document: SiteDocument) => SiteDocument;  // Remove (com confirmação)

  // Customização do editor
  getEditorRestrictions?: (blockType: string) => EditorRestriction[];
  getPageTemplates?: () => PageTemplate[];
  getBlockDefinitions?: () => BlockDefinition[];

  // Data providers
  getContentProvider?: (providerType: string) => ContentProvider;
}

class PluginRegistry {
  private plugins: Map<string, PluginRegistration> = new Map();

  register(plugin: PluginRegistration): void;
  get(pluginId: string): PluginRegistration | undefined;
  getAll(): PluginRegistration[];
  getActive(document: SiteDocument): PluginRegistration[];

  // Ativar plugin num documento
  activate(document: SiteDocument, pluginId: string): SiteDocument;
  deactivate(document: SiteDocument, pluginId: string): SiteDocument;
}

export const pluginRegistry = new PluginRegistry();
```

### 7.5. Content Provider (Dados Dinâmicos)

```typescript
interface ContentProvider {
  type: string;                          // "products" | "blog-posts"

  // Fetch dados
  fetchList(params: ListParams): Promise<ContentItem[]>;
  fetchById(id: string): Promise<ContentItem | null>;

  // Schema
  getSchema(): DataSchema;

  // Transformação para blocos
  toBlockProps(item: ContentItem): Record<string, any>;
}

interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  tenantId: string;
  projectId: string;
}

interface ContentItem {
  id: string;
  type: string;
  data: Record<string, any>;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    status: "draft" | "published" | "archived";
  };
}
```

### 7.6. Páginas Dinâmicas

```typescript
interface PageTemplate {
  id: string;                            // "product-detail"
  name: string;                          // "Página de Produto"
  slug: string;                          // "produto/:slug" (com params dinâmicos)
  pluginId: string;                      // "ecommerce"

  // Template da página
  structure: Block[];                     // Blocos com data binding

  // Data binding
  dataSource: {
    provider: string;                    // "products"
    mode: "single" | "list";             // Detalhe ou listagem
    paramMapping?: Record<string, string>; // { slug: ":slug" }
  };

  // Restrições de edição
  editableFields?: string[];             // Só estes campos podem ser editados
  lockedStructure?: boolean;             // Estrutura de blocos não pode mudar
}
```

### 7.7. Fluxo de Ativação de Plugin

```
1. Usuário clica "Adicionar Plugin: E-commerce"

2. pluginRegistry.activate(document, "ecommerce")
   ├── Valida dependências
   ├── Adiciona plugin.id ao document.plugins.active
   ├── Executa onActivate():
   │   ├── Cria páginas obrigatórias (catálogo, produto/:slug, carrinho)
   │   ├── Adiciona bloco "productGrid" na landing page (home)
   │   ├── Aplica restrições de edição
   │   └── Herda paleta do tema atual
   └── Retorna SiteDocument modificado

3. Editor detecta plugins ativos:
   ├── Mostra blocos do plugin no BlockSelector
   ├── Mostra páginas do plugin no PageTabBar (com ícone/badge)
   ├── Aplica restrições no PropertyEditor
   └── Habilita ContentProviders para blocos dinâmicos

4. Save → documento vai para backend com plugins.active

5. View → Viewer resolve rotas dinâmicas:
   /site/produto/camiseta-azul →
     ├── Identifica PageTemplate "product-detail"
     ├── Extrai slug "camiseta-azul"
     ├── Busca produto via ContentProvider
     ├── Renderiza template com dados
     └── Retorna HTML
```

---

## 8. Plugin: E-commerce

### 8.1. Manifest

```typescript
const ecommercePlugin: PluginManifest = {
  id: "ecommerce",
  version: "1.0.0",
  name: "E-commerce",
  description: "Loja virtual com catálogo, carrinho e checkout",
  icon: "ShoppingCart",

  capabilities: {
    blocks: [
      "productCard",
      "productGrid",
      "productDetail",
      "cartWidget",
      "cartPage",
      "checkoutForm",
      "categoryFilter",
      "searchBar",
      "priceDisplay",
      "productGallery",
    ],

    pageTemplates: [
      {
        id: "catalog",
        name: "Catálogo",
        slug: "loja",
        structure: [/* navbar, categoryFilter, productGrid, footer */],
        dataSource: { provider: "products", mode: "list" },
      },
      {
        id: "product-detail",
        name: "Produto",
        slug: "produto/:slug",
        structure: [/* navbar, productGallery, productDetail, relatedProducts, footer */],
        dataSource: { provider: "products", mode: "single", paramMapping: { slug: ":slug" } },
        lockedStructure: true,
      },
      {
        id: "cart",
        name: "Carrinho",
        slug: "carrinho",
        structure: [/* navbar, cartPage, footer */],
        lockedStructure: true,
      },
      {
        id: "checkout",
        name: "Checkout",
        slug: "checkout",
        structure: [/* navbar, checkoutForm, footer */],
        lockedStructure: true,
      },
    ],

    dataSchemas: [
      { type: "product", fields: [/* ver seção 10 */] },
      { type: "category", fields: [/* ... */] },
      { type: "order", fields: [/* ... */] },
    ],

    contentProviders: ["products", "categories", "orders"],
  },

  restrictions: {
    lockedFields: {
      productCard: ["price", "sku", "stock"],      // Vem do backend
      productDetail: ["price", "sku", "stock"],
      checkoutForm: ["*"],                          // Totalmente locked
    },
    requiredPages: ["catalog", "product-detail", "cart", "checkout"],
    requiredBlocks: {
      "catalog": ["productGrid"],
      "product-detail": ["productDetail"],
    },
  },
};
```

### 8.2. Novos Blocos

| Bloco | Descrição | Dados Dinâmicos? |
|-------|-----------|------------------|
| `productCard` | Card de produto (imagem, nome, preço) | Sim — via ContentProvider |
| `productGrid` | Grid de produtos com filtros | Sim — lista de produtos |
| `productDetail` | Detalhe do produto (galeria, descrição, preço, add to cart) | Sim — produto único |
| `productGallery` | Galeria de imagens do produto | Sim — imagens do produto |
| `cartWidget` | Mini carrinho no navbar | Sim — itens do carrinho |
| `cartPage` | Página completa do carrinho | Sim — itens + totais |
| `checkoutForm` | Formulário de checkout | Sim — dados do pedido |
| `categoryFilter` | Filtro por categorias | Sim — categorias da loja |
| `searchBar` | Busca de produtos | Não (client-side) |
| `priceDisplay` | Display formatado de preço (promoção, parcelamento) | Sim |

### 8.3. Customização Permitida

O que o **usuário PODE** editar:
- Cores (herda do tema, pode ajustar accent colors)
- Tipografia (herda do tema)
- Imagem de banner da loja
- Texto de header do catálogo
- Layout do grid (2, 3, 4 colunas)
- Ordem das seções na página de produto

O que o **usuário NÃO PODE** editar:
- Preço (vem do backend)
- SKU, estoque
- Fluxo de checkout
- Campos do formulário de pedido
- Remoção de páginas obrigatórias (cart, checkout)

### 8.4. Fluxo de Visualização

```
/site/loja
  → Viewer identifica slug "loja" → page template "catalog"
  → ContentProvider("products").fetchList({ limit: 12 })
  → Renderiza productGrid com dados reais
  → Links de cada produto: /site/produto/{slug}

/site/produto/camiseta-azul
  → Viewer identifica pattern "produto/:slug" → page template "product-detail"
  → ContentProvider("products").fetchById({ slug: "camiseta-azul" })
  → Renderiza productDetail + productGallery com dados reais
  → Botão "Adicionar ao Carrinho" → /site/carrinho

/site/carrinho
  → Viewer renderiza cartPage
  → Dados do carrinho via localStorage + API (sessão)
  → Botão "Finalizar" → /site/checkout
```

---

## 9. Plugin: Blog

### 9.1. Manifest

```typescript
const blogPlugin: PluginManifest = {
  id: "blog",
  version: "1.0.0",
  name: "Blog",
  description: "Blog com posts, categorias e tags",
  icon: "FileText",

  capabilities: {
    blocks: [
      "blogPostCard",      // ✅ Card de post (evolução do blogCard existente)
      "blogPostGrid",      // ✅ Grid de posts (evolução do blogCardGrid)
      "blogPostDetail",    // ✅ Conteúdo completo do post
      // Blocos abaixo propostos no RFC mas NÃO implementados no MVP:
      // "blogSidebar",    // Sidebar com categorias, tags, posts recentes
      // "blogHero",       // Hero específico para blog (featured post)
      // "blogNewsletter", // Formulário de newsletter
    ],

    pageTemplates: [
      {
        id: "blog-listing",
        name: "Blog",
        slug: "blog",
        structure: [/* navbar, blogHero, blogPostGrid, blogSidebar, footer */],
        dataSource: { provider: "blog-posts", mode: "list" },
      },
      {
        id: "blog-post",
        name: "Post",
        slug: "blog/:slug",
        structure: [/* navbar, blogPostDetail, blogSidebar, relatedPosts, footer */],
        dataSource: { provider: "blog-posts", mode: "single", paramMapping: { slug: ":slug" } },
      },
      {
        id: "blog-category",
        name: "Categoria",
        slug: "blog/categoria/:slug",
        structure: [/* navbar, heading, blogPostGrid(filtered), footer */],
        dataSource: { provider: "blog-posts", mode: "list", paramMapping: { category: ":slug" } },
      },
    ],

    dataSchemas: [
      { type: "blog-post", fields: [/* ver seção 10 */] },
      { type: "blog-category", fields: [/* ... */] },
      { type: "blog-tag", fields: [/* ... */] },
    ],

    contentProviders: ["blog-posts", "blog-categories", "blog-tags"],
  },

  restrictions: {
    lockedFields: {
      blogPostDetail: ["content", "publishedAt", "author"],  // Vem do backend
    },
    requiredPages: ["blog-listing", "blog-post"],
  },
};
```

### 9.2. Integração com Landing Page

O ponto-chave do Blog é poder **adicionar uma seção na landing page** que lista os últimos posts:

```
Home page (landing page)
├── navbar
├── hero
├── features
├── blogPostGrid (plugin: blog)  ← Seção "Últimas do Blog"
│   └── dataSource: { provider: "blog-posts", mode: "list", limit: 3 }
│   └── Link "Ver todos" → /site/blog
├── testimonials
└── footer
```

O bloco `blogPostGrid` seria adicionável no BlockSelector quando o plugin Blog está ativo.

### 9.3. Relação com Blocos Existentes

Os blocos `blogCard` e `blogCardGrid` **já existem** no editor mas são estáticos (dados nas props). A evolução seria:

```
blogCard (atual, estático)     → blogPostCard (dinâmico, com dataSource)
blogCardGrid (atual, estático) → blogPostGrid (dinâmico, com dataSource)
```

**Estratégia de migração**:
1. Manter `blogCard`/`blogCardGrid` para uso estático (sem plugin)
2. Novos blocos `blogPostCard`/`blogPostGrid` com ContentProvider
3. Ou: adicionar prop `dataSource?: { provider, mode }` aos blocos existentes (abordagem unificada)

### 9.4. Editor de Posts

O editor de posts do Blog **NÃO** é o SiteEditor. É um editor de conteúdo separado:

```
Blog Admin (no consumer project)
├── Lista de posts (CRUD)
├── Editor de post (título, conteúdo markdown/rich-text, imagem, tags, categoria)
├── Preview
└── Publicar/Despublicar

API: POST /api/plugin-data/blog-posts
     GET  /api/plugin-data/blog-posts?limit=10&category=tech
     etc.
```

O SiteEditor apenas **configura como os posts aparecem** (layout, cores, quantidade por página).

---

## 10. Arquitetura de Dados SaaS

### 10.1. Princípio Fundamental

Os dados de plugins devem ser **agnósticos ao projeto consumidor**. O mesmo schema de "Produto" funciona no SmartGesti-Ensino (venda de uniformes), SmartGesti-Portfólios (venda de serviços), ou qualquer futuro projeto.

### 10.2. Schema Genérico de Plugin Data

```sql
-- Tabela universal para dados de plugins (Supabase/PostgreSQL)

CREATE TABLE plugin_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Escopo multi-tenant
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL,              -- "ensino" | "portfolio" | etc.
  owner_id UUID NOT NULL,                -- school_id, user_id, org_id...
  owner_type TEXT NOT NULL DEFAULT 'school', -- "school" | "user" | "organization"

  -- Plugin e tipo
  plugin_id TEXT NOT NULL,               -- "ecommerce" | "blog"
  data_type TEXT NOT NULL,               -- "product" | "blog-post" | "category"

  -- Dados
  slug TEXT,                              -- URL-friendly identifier
  data JSONB NOT NULL DEFAULT '{}',       -- Dados estruturados (flexível)

  -- Status e publicação
  status TEXT NOT NULL DEFAULT 'draft',   -- "draft" | "published" | "archived"
  published_at TIMESTAMPTZ,

  -- Metadata
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(tenant_id, plugin_id, data_type, slug)
);

-- Índices para queries comuns
CREATE INDEX idx_plugin_data_tenant ON plugin_data(tenant_id, plugin_id, data_type);
CREATE INDEX idx_plugin_data_owner ON plugin_data(owner_id, owner_type);
CREATE INDEX idx_plugin_data_slug ON plugin_data(slug);
CREATE INDEX idx_plugin_data_status ON plugin_data(status) WHERE status = 'published';

-- RLS para multi-tenant isolation
ALTER TABLE plugin_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON plugin_data
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY "owner_access" ON plugin_data
  FOR ALL USING (
    owner_id = current_setting('app.owner_id')::UUID
    AND owner_type = current_setting('app.owner_type')
  );
```

### 10.3. Tabela de Relacionamentos (Many-to-Many)

```sql
-- Relacionamentos entre dados de plugin (ex: produto ↔ categoria)
CREATE TABLE plugin_data_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  source_id UUID NOT NULL REFERENCES plugin_data(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES plugin_data(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,           -- "belongs_to" | "has_many" | "tagged"

  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',

  UNIQUE(source_id, target_id, relation_type)
);
```

### 10.4. Tabela de Assets de Plugin

```sql
-- Assets específicos de plugins (imagens de produtos, thumbnails de posts)
CREATE TABLE plugin_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  plugin_data_id UUID NOT NULL REFERENCES plugin_data(id) ON DELETE CASCADE,

  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,                -- Supabase Storage URL
  file_type TEXT NOT NULL,               -- "image/jpeg" | "image/png" | etc.
  file_size INTEGER,

  purpose TEXT DEFAULT 'gallery',        -- "thumbnail" | "gallery" | "attachment"
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10.5. Schema de Dados por Plugin

#### Produto (E-commerce)

```typescript
interface ProductData {
  // Identificação
  name: string;
  slug: string;
  sku?: string;

  // Descrição
  shortDescription: string;
  fullDescription: string;           // HTML/Markdown

  // Preço
  price: number;
  compareAtPrice?: number;           // Preço "de" (promoção)
  currency: string;                  // "BRL"

  // Estoque
  stockQuantity?: number;
  trackStock: boolean;
  allowBackorder: boolean;

  // Imagens (via plugin_assets)
  thumbnailUrl?: string;

  // Variantes (ex: tamanho, cor)
  variants?: ProductVariant[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Categorias (via plugin_data_relations)
  // Tags (via plugin_data_relations)
}
```

#### Post de Blog

```typescript
interface BlogPostData {
  // Identificação
  title: string;
  slug: string;

  // Conteúdo
  excerpt: string;
  content: string;                   // HTML/Markdown (rich text)

  // Imagem
  featuredImageUrl?: string;

  // Autor
  authorName: string;
  authorAvatar?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Leitura
  readingTime?: number;              // minutos

  // Categorias e tags (via plugin_data_relations)
}
```

### 10.6. API REST Genérica

```
Base: /api/plugin-data

# CRUD genérico
GET    /api/plugin-data?pluginId=blog&dataType=blog-post&status=published&limit=10&page=1
GET    /api/plugin-data/:id
GET    /api/plugin-data/by-slug/:pluginId/:dataType/:slug
POST   /api/plugin-data
PUT    /api/plugin-data/:id
DELETE /api/plugin-data/:id

# Publish/Unpublish
PATCH  /api/plugin-data/:id/status  { status: "published" }

# Relacionamentos
GET    /api/plugin-data/:id/relations?type=belongs_to
POST   /api/plugin-data/:id/relations  { targetId, relationType }
DELETE /api/plugin-data/:id/relations/:relationId

# Assets
GET    /api/plugin-data/:id/assets
POST   /api/plugin-data/:id/assets  (multipart upload)
DELETE /api/plugin-data/:id/assets/:assetId

# Bulk operations
POST   /api/plugin-data/bulk  { action: "publish" | "archive" | "delete", ids: [] }
```

### 10.7. Headers de Contexto

```
Authorization: Bearer {token}
X-Tenant-Subdomain: magistral
X-Project-Id: ensino
X-Owner-Id: {schoolId}
X-Owner-Type: school
```

O backend extrai tenant/owner do token + headers e aplica RLS automaticamente.

### 10.8. Por Que JSONB e Não Tabelas Separadas?

| Abordagem | Prós | Contras |
|-----------|------|---------|
| **JSONB (proposta)** | Uma tabela para todos os plugins. Reutilizável em qualquer projeto. Schema flexível. | Queries JSONB são mais lentas. Sem foreign keys nos dados. |
| **Tabelas por plugin** | Type safety no banco. Índices específicos. Foreign keys. | Uma migração por plugin por projeto. Não portável entre projetos. |
| **Híbrido** | Melhor dos dois mundos. | Mais complexo. |

**Recomendação**: JSONB para v1 (velocidade de desenvolvimento), com possibilidade de materializar views/tabelas para queries frequentes:

```sql
-- View materializada para produtos publicados
CREATE MATERIALIZED VIEW published_products AS
SELECT
  id, tenant_id, owner_id,
  data->>'name' as name,
  data->>'slug' as slug,
  (data->>'price')::numeric as price,
  data->>'thumbnailUrl' as thumbnail_url,
  published_at
FROM plugin_data
WHERE plugin_id = 'ecommerce'
  AND data_type = 'product'
  AND status = 'published';
```

---

## 11. Integração com Backend

### 11.1. Onde Cada Parte Vive

```
┌──────────────────────────────────────────────────┐
│              smartgesti-site-editor               │
│                 (NPM library)                     │
│                                                   │
│  Plugin Registry  ← Manifests, blocos, renderers  │
│  Content Provider ← Interface para buscar dados   │
│  Plugin UI        ← Ativação, config no editor    │
│  Blocks           ← Novos blocos do plugin        │
│  Page Templates   ← Templates dinâmicos           │
└───────────┬───────────────────────────────────────┘
            │ importa
            ▼
┌──────────────────────────────────────────────────┐
│           Consumer Project Frontend               │
│        (ex: Frontend-SmartGesti-Ensino)           │
│                                                   │
│  Plugin Admin Pages ← CRUD de produtos/posts     │
│  Route Handler      ← Resolve rotas dinâmicas    │
│  API Service        ← Conecta ContentProvider    │
│  Plugin Config      ← Passa settings para editor │
└───────────┬───────────────────────────────────────┘
            │ HTTP
            ▼
┌──────────────────────────────────────────────────┐
│                Backend (API)                      │
│                                                   │
│  /api/plugin-data   ← CRUD genérico              │
│  /api/sites         ← Sites (existente)          │
│  /api/site-assets   ← Assets (existente)         │
│  Supabase RLS       ← Multi-tenant isolation     │
│  Storage            ← Arquivos de plugin         │
└──────────────────────────────────────────────────┘
```

### 11.2. O que o Editor Library Exporta (Implementado)

> **Nota**: A proposta original incluía um `PluginAwareViewer` separado. Na implementação real,
> o suporte a plugins foi integrado diretamente no `LandingPageViewer` existente (mais limpo).

```typescript
// src/index.ts (exports reais)

// Plugin system
export { pluginRegistry } from './engine/plugins/pluginRegistry';
export type { PluginManifest, PluginRegistration, SitePluginsConfig } from './engine/plugins/types';
export type { ContentProvider, ContentItem, ContentListParams } from './engine/plugins/types';
export type { PageDataSource, PageEditRestrictions, EditorRestriction } from './engine/plugins/types';

// Content Provider API
export { hydratePageWithContent } from './engine/plugins/contentHydration';
export { matchDynamicPage } from './engine/plugins/dynamicPageResolver';

// Built-in plugins
export { blogPlugin } from './engine/plugins/builtin/blog';
export { mockBlogContentProvider } from './engine/plugins/builtin/blog';
// export { ecommercePlugin } — Sprint 6 (não implementado)

// Viewer com suporte a plugins (NÃO é PluginAwareViewer separado)
export { LandingPageViewer } from './viewer/LandingPageViewer';
// Props: contentProviders?: ContentProvider[], onNavigate?: (href: string) => void
```

### 11.3. O que o Consumer Project Implementa

```typescript
// No Frontend-SmartGesti-Ensino

// 1. Configura content providers com API real
const blogContentProvider: ContentProvider = {
  type: "blog-posts",
  async fetchList(params) {
    const res = await apiRequest(`/api/plugin-data?pluginId=blog&dataType=blog-post&...`);
    return res.data.map(transformToContentItem);
  },
  async fetchById(id) { ... },
  getSchema() { return blogPostSchema; },
  toBlockProps(item) {
    return {
      title: item.data.title,
      excerpt: item.data.excerpt,
      image: item.data.featuredImageUrl,
      date: item.metadata.publishedAt,
      href: `/site/blog/${item.data.slug}`,
    };
  },
};

// 2. Registra providers
pluginRegistry.registerContentProvider("blog-posts", blogContentProvider);

// 3. Páginas admin para CRUD
// /escola/:slug/blog/posts → Lista de posts
// /escola/:slug/blog/posts/novo → Editor de post
// /escola/:slug/blog/posts/:id → Editar post

// 4. Rotas públicas para visualização
// /site/blog → Listing (dinâmico)
// /site/blog/:slug → Post detail (dinâmico)
```

### 11.4. Viewer com Suporte a Plugins (Implementado)

> **Decisão de implementação**: Em vez de criar um `PluginAwareViewer` separado,
> o suporte a plugins foi integrado no `LandingPageViewer` existente.

```typescript
// LandingPageViewer.tsx (implementação real)

export function LandingPageViewer({
  siteId,
  apiBaseUrl,
  projectId,
  pageSlug,           // "blog" ou "blog/meu-post" (wildcard route captura tudo)
  contentProviders,   // ContentProvider[] passado como prop pelo consumer
  onNavigate,         // (href: string) => void — navegação iframe→parent
}: LandingPageViewerProps) {

  // 1. Busca SiteDocument via API
  // 2. Se contentProviders fornecido e página tem dataSource:
  //    - matchDynamicPage() resolve "blog/meu-post" → página "blog/:slug"
  //    - hydratePageWithContent() busca dados e injeta nos blocos
  //    - Gera HTML via renderPageToHtml() (helper extraído)
  // 3. Click interceptor injetado em TODOS os iframes (postMessage 'viewer-navigate')
  // 4. Sem dataSource: renderiza normalmente via exportPageToHtml()
}
```

---

## 12. Roadmap de Implementação

### Fase 0: Infraestrutura ✅ CONCLUÍDA (Sprints 0 + 3)

**Editor Library**:
- [x] Criar `src/engine/plugins/` com types e registry
- [x] Definir `PluginManifest`, `ContentProvider`, `PageTemplate` types
- [x] Criar `PluginRegistry` singleton
- [x] Adicionar `plugins` field ao `SiteDocument` schema

**Backend**:
- [x] Criar tabela `plugin_data` (JSONB)
- [x] Criar tabela `plugin_data_relations`
- [ ] Criar tabela `plugin_assets`
- [x] Criar API REST genérica `/api/plugin-data`
- [x] Configurar RLS para multi-tenant

### Fase 1: Plugin Blog ✅ CONCLUÍDA (Sprints 1–5)

**Editor Library**:
- [x] Registrar `blogPlugin` manifest
- [x] Blocos `blogPostCard`, `blogPostGrid`, `blogPostDetail` (renderer + exporter)
- [x] Plugin activation UI (dropdown "+ Adicionar" no PageTabBar)
- [x] Auto-geração de páginas via `onActivate()` (blog listing, blog/:slug + navbar/footer clonados)
- [x] ContentProvider API (`hydratePageWithContent`, `matchDynamicPage`)
- [x] Viewer com `onNavigate` + click interceptor para navegação iframe
- [x] Fix: footer duplicado, rotas wildcard `/site/p/*`

**Consumer (Ensino)**:
- [x] Implementar `BlogContentProvider` conectando à API
- [x] Páginas admin: CRUD de posts (lista, editor)
- [x] Rotas públicas: /site/p/blog, /site/p/blog/:slug (wildcard)
- [x] Integração `onNavigate` com React Router `useNavigate()`

### Fase 2: Plugin E-commerce (PENDENTE — Sprint 6+)

**Editor Library**:
- [ ] Registrar `ecommercePlugin` manifest
- [ ] Criar blocos: `productCard`, `productGrid`, `productDetail`, `cartWidget`
- [ ] Page templates: catálogo, produto/:slug, carrinho
- [ ] Restrições de edição (campos locked)

**Consumer (Ensino ou novo projeto)**:
- [ ] Implementar `ProductContentProvider`
- [ ] Páginas admin: CRUD de produtos
- [ ] Carrinho (localStorage + API)
- [ ] Checkout básico (integração com pagamento)
- [ ] Rotas públicas: /site/loja, /site/produto/:slug

### Fase 3: Amadurecimento (PENDENTE)

- [ ] Plugin settings configuráveis (postsPerPage, currency, etc.)
- [ ] Temas específicos por plugin
- [x] Preview de dados dinâmicos no editor (mock data via defaultProps) ✅
- [ ] SEO: meta tags dinâmicas para páginas de plugin
- [ ] Analytics: tracking de views por página/produto
- [ ] Marketplace de plugins (futuro distante)
- [ ] Blocos avançados de blog (blogSidebar, blogHero, blogNewsletter)

---

## 13. Decisões ~~em Aberto~~ (Resolvidas)

### 13.1. Dados no SiteDocument vs API — ✅ DECIDIDO: Opção A (referência)

**Opção A**: Plugins armazenam referência (ID) no SiteDocument, dados reais na API
```typescript
// Bloco tem referência
productGrid.props = { dataSource: { provider: "products", limit: 12 } }
// Viewer busca na API em runtime
```

**Opção B**: Dados são embedados no SiteDocument no momento do save/publish
```typescript
// Bloco tem dados inline (como é hoje com blogCard)
productGrid.props = { items: [{ name: "Produto 1", price: 29.90 }, ...] }
// Viewer não precisa de API (estático)
```

**Opção C**: Híbrido — editor mostra preview com dados da API, export/publish faz snapshot
```typescript
// No editor: busca da API e renderiza preview dinâmico
// No publish: faz snapshot dos dados no publishedHtml
// Resultado: site publicado é estático mas com dados reais do momento
```

**Recomendação**: Opção A para e-commerce (dados mudam frequentemente), Opção C para blog (posts mudam raramente, snapshot é aceitável).

**Implementação real**: Opção A — blocos têm `dataSource` com referência ao provider. Viewer busca dados via `ContentProvider.fetchList()`/`fetchById()` e injeta nos blocos via `hydratePageWithContent()`. Editor preview usa `defaultProps` com sample data estático.

### 13.2. Abordagem de Blocos Dinâmicos — ✅ DECIDIDO: Opção A (tipos explícitos)

**Opção A**: Novos block types para cada plugin
```typescript
type BlockType = ... | "productCard" | "blogPostCard" | ...
```
- Pro: Type safety total, cada bloco tem props específicas
- Contra: Muitas adições ao schema central

**Opção B**: Block type genérico "pluginBlock"
```typescript
interface PluginBlock extends BlockBase {
  type: "pluginBlock";
  props: {
    pluginId: string;
    blockType: string;         // "productCard"
    data: Record<string, any>; // Props específicas do plugin
  };
}
```
- Pro: Schema central não cresce
- Contra: Perde type safety, inspector meta complexo

**Recomendação**: Opção A para plugins built-in (blog, ecommerce). Opção B para plugins de terceiros (futuro marketplace).

**Implementação real**: Opção A — `blogPostCard`, `blogPostGrid`, `blogPostDetail` são BlockTypes explícitos em `siteDocument.ts` com interfaces tipadas. Cada um tem registry definition, React renderer e HTML exporter.

### 13.3. Onde Renderizar Páginas Dinâmicas — ✅ DECIDIDO: Opção D (híbrido)

**Opção A**: Client-side rendering (React no browser)
- Viewer busca dados via fetch e renderiza React components
- Pro: Mesmo mecanismo do editor preview
- Contra: Não é SEO-friendly, loading spinner

**Opção B**: Server-side rendering (backend gera HTML)
- Backend recebe template + dados → exportPageToHtml() → HTML
- Pro: SEO, performance, cacheável
- Contra: Precisa do engine no backend (Node.js), mais complexo

**Opção C**: Static generation no publish (SSG)
- No publish, gera HTML para todas as combinações (cada produto, cada post)
- Pro: Máxima performance, CDN-friendly
- Contra: Não escala para muitos produtos, rebuild necessário em cada mudança

**Opção D**: Hybrid — SSG para listagens, CSR para detalhes
- Publish gera HTML das listagens com últimos N items
- Detalhes são CSR (busca na API no browser)
- Pro: Balanço entre SEO e dinamismo
- Contra: Dois mecanismos de renderização

**Recomendação**: Opção D como padrão. Blog usa SSG completo (poucos posts, raramente mudam). E-commerce usa CSR para detalhes (dados mudam frequentemente).

**Implementação real**: Opção D — Editor preview usa `defaultProps` (estático, síncrono). Viewer usa `hydratePageWithContent()` com dados da API (assíncrono, client-side). O HTML do iframe inclui click interceptor que propaga navegação via `postMessage` + `onNavigate` callback.

### 13.4. Onde Fica o CRUD Admin dos Plugins? — ✅ DECIDIDO: Opção A (consumer project)

**Opção A**: No consumer project (cada projeto implementa suas pages admin)
- Pro: Total controle, adaptado ao contexto
- Contra: Duplicação entre projetos

**Opção B**: No editor library (plugin fornece componentes admin)
- Pro: Reutilizável, consistente entre projetos
- Contra: Library fica enorme, dependências extras (rich text editor, etc.)

**Opção C**: Pacote separado por plugin (`@smartgesti/plugin-blog-admin`)
- Pro: Modular, tree-shakeable, cada projeto instala o que precisa
- Contra: Mais pacotes para manter

**Recomendação**: Opção C para longo prazo. Opção A para MVP (implementar no Ensino primeiro, depois extrair).

**Implementação real**: Opção A — Páginas admin (`BlogPosts.tsx`, `BlogPostEditor.tsx`) vivem no consumer project `Frontend-SmartGesti-Ensino/src/pages/blog/`. O editor library fornece apenas blocos, manifest e ContentProvider interface.

### 13.5. Owner Genérico vs School-Specific

O campo `owner_id`/`owner_type` na tabela `plugin_data` substitui `school_id`:

```
Ensino: owner_id = school_uuid, owner_type = "school"
Portfólio: owner_id = user_uuid, owner_type = "user"
Futuro: owner_id = org_uuid, owner_type = "organization"
```

Isso torna os dados **agnósticos ao projeto**, mas o consumer project precisa saber qual `owner_type` usar.

---

## Apêndice A: Diagrama de Arquitetura Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    smartgesti-site-editor (NPM)                 │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Block System  │  │ Plugin System│  │ Template System       │ │
│  │ 63+ blocks   │  │ (NOVO)       │  │ 3 templates           │ │
│  │ registry     │←─│ manifest     │  │ (extensível)          │ │
│  │ renderer     │  │ restrictions │  │                       │ │
│  │ exporter     │  │ pageTemplates│  │                       │ │
│  └──────────────┘  │ providers    │  └───────────────────────┘ │
│                    └──────┬───────┘                             │
│  ┌──────────────┐         │         ┌───────────────────────┐  │
│  │ Theme System  │         │         │ Export System          │  │
│  │ colors/typo  │         │         │ HTML static           │  │
│  │ 8 presets    │         │         │ + dynamic (NOVO)      │  │
│  └──────────────┘         │         └───────────────────────┘  │
│                           │                                     │
│  ┌──────────────┐         │         ┌───────────────────────┐  │
│  │ Patch System  │         │         │ Editor UI              │  │
│  │ RFC 6902     │         │         │ + Plugin Panel (NOVO) │  │
│  │ undo/redo    │         │         │ + Restrictions (NOVO) │  │
│  └──────────────┘         │         └───────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│ SmartGesti-     │ │ SmartGesti-     │ │ Projeto Futuro      │
│ Ensino          │ │ Portfólios      │ │                     │
│                 │ │                 │ │                     │
│ ContentProviders│ │ ContentProviders│ │ ContentProviders    │
│ Blog Admin      │ │ Blog Admin      │ │ Custom Admin        │
│ E-commerce Admin│ │ Services Admin  │ │                     │
│ school context  │ │ user context    │ │ org context         │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                      │
         └───────────────────┼──────────────────────┘
                             │
                             ▼
               ┌──────────────────────────┐
               │     Backend (Shared)      │
               │                          │
               │  /api/sites              │
               │  /api/site-assets        │
               │  /api/plugin-data (NOVO) │
               │                          │
               │  Supabase + RLS          │
               │  plugin_data (JSONB)     │
               │  plugin_data_relations   │
               │  plugin_assets           │
               └──────────────────────────┘
```

## Apêndice B: Exemplo de Ativação Completa (Implementação Real)

```typescript
// 1. No editor library — auto-registro via side effect
// src/engine/plugins/builtin/blog/manifest.ts (final do arquivo)
pluginRegistry.register(blogPlugin);
// Import chain: src/engine/index.ts → import "./plugins/builtin/blog"
// sideEffects em package.json: "./src/engine/plugins/builtin/**"

// 2. No consumer project — criar ContentProvider
// src/services/blogContentProvider.ts
export function createBlogContentProvider(apiBase, projectId, schoolId): ContentProvider {
  return {
    type: "blog-posts",
    async fetchList(params) {
      const res = await fetch(`${apiBase}/plugin-data?pluginId=blog&dataType=blog-post&status=published`);
      return { items: res.data.map(toContentItem), total: res.total };
    },
    async fetchById(slug) {
      const res = await fetch(`${apiBase}/plugin-data/by-slug/blog/blog-post/${slug}`);
      return toContentItem(res);
    },
    getSchema() { return blogPostSchema; },
    toBlockProps(item) {
      return {
        title: item.data.title,
        excerpt: item.data.excerpt,
        image: item.data.featuredImage,
        date: new Date(item.metadata.publishedAt).toLocaleDateString('pt-BR'),
        linkHref: `/site/p/blog/${item.data.slug}`,
        linkText: "Ler mais",
      };
    },
  };
}

// 3. No editor (ativação pelo usuário)
// PageTabBar: dropdown "+ Adicionar" → "Blog" → useEditorState.activatePlugin("blog")
// → pluginRegistry.activate(document, "blog")
// → onActivate(): injeta blogPostGrid na home, cria páginas Blog e Post
// → Retorna SiteDocument modificado

// 4. No viewer (renderização pública) — VerSite.tsx
const contentProviders = useMemo(() => {
  if (!schoolData?.id) return undefined;
  return [createBlogContentProvider(apiBase, PROJECT_ID, schoolData.id)];
}, [schoolData?.id]);

const handleNavigate = useCallback((href) => {
  if (href.startsWith('http')) window.open(href, '_blank');
  else navigate(href); // React Router
}, [navigate]);

<LandingPageViewer
  siteId={siteId}
  apiBaseUrl={apiBase}
  projectId="ensino"
  pageSlug={params['*']}  // Wildcard route captura "blog/meu-post"
  contentProviders={contentProviders}
  onNavigate={handleNavigate}
/>
// → matchDynamicPage() resolve "blog/meu-post" → página "blog/:slug"
// → hydratePageWithContent() busca post e injeta nos blocos
// → exportPageToHtml() gera HTML → iframe com click interceptor
```

## Apêndice C: Impacto no Schema Existente

### Mudanças no `siteDocument.ts`

```typescript
// ADIÇÃO ao SiteDocument
interface SiteDocument {
  schemaVersion: 2;
  theme: ThemeTokens;
  plugins?: {                            // NOVO
    active: string[];
    config?: Record<string, Record<string, any>>;
  };
  content?: {
    collections?: ContentCollection[];
  };
  pages: SitePage[];
}

// ADIÇÃO ao SitePage
interface SitePage {
  id: string;
  name: string;
  slug: string;
  structure: Block[];
  pluginId?: string;                     // NOVO: se a página veio de um plugin
  pageTemplateId?: string;               // NOVO: referência ao template do plugin
  isDynamic?: boolean;                   // NOVO: slug com parâmetros
  dataSource?: {                         // NOVO: fonte de dados
    provider: string;
    mode: "single" | "list";
    paramMapping?: Record<string, string>;
    defaultParams?: Record<string, any>;
  };
  editRestrictions?: {                   // NOVO: restrições de edição
    lockedStructure?: boolean;
    editableFields?: string[];
    nonRemovable?: boolean;
  };
}
```

### Backward Compatibility

- `plugins` é **opcional** (`?`) — sites existentes continuam funcionando sem mudanças
- `pluginId`, `isDynamic`, `dataSource` em SitePage são **opcionais** — páginas existentes não são afetadas
- Nenhum campo existente é removido ou renomeado
- `schemaVersion` permanece `2` (mudanças são aditivas)

---

> **Próximos passos**: Discutir este RFC com o time, priorizar Fase 0 + Fase 1 (Blog), e definir as decisões em aberto (seção 13) antes de iniciar implementação.
