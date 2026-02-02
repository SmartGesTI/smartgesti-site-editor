# Design Philosophy - Sistema de Plugins

## Visão Geral

O **Sistema de Plugins** do SmartGestI Site Editor permite estender o editor com **módulos funcionais** (Ecommerce, Blog, Contato, Agenda) sem modificar o core, mantendo a filosofia **user-first** e a simplicidade para usuários leigos.

## Problema que Resolve

### Situação Atual (Sem Plugins)

Para adicionar funcionalidade de **Blog** ao editor:

❌ Modificar `src/engine/registry/blocks/index.ts` (1598 linhas)
❌ Adicionar blocos `BlogPostList`, `BlogPostCard`, `BlogPostDetail`
❌ Modificar rendering em `renderNodeImpl.tsx` (1944 linhas)
❌ Modificar export em `exportHtml.ts` (1078 linhas)
❌ Criar migrations no backend
❌ Hardcoding de endpoints no `SitesService`

**Problemas:**
- Core fica inchado com funcionalidades específicas
- Impossível distribuir módulos separadamente
- Difícil manutenção (mudanças em 4+ arquivos)
- Não é reutilizável entre projetos

### Com Sistema de Plugins

✅ Criar `blog-plugin/` como pacote separado
✅ Registrar via `pluginRegistry.register(blogPlugin)`
✅ Plugin adiciona seus próprios blocos
✅ Plugin gerencia seus próprios dados (Data Provider)
✅ Plugin define suas próprias migrations
✅ Core permanece limpo e focado

**Benefícios:**
- **Modularidade**: Cada plugin é autocontido
- **Distribuição**: Plugins podem ser NPM packages
- **Manutenção**: Mudanças isoladas no plugin
- **Reutilização**: Mesmo plugin em múltiplos projetos

## Princípios de Design

### 1. User-First (Mesmo com Plugins)

Plugins devem ser **invisíveis** para o usuário final. O usuário **não sabe** que está usando um plugin.

#### ❌ Design Ruim (Plugin-Centric)

```
Usuário vê:
"Adicionar Plugin de Blog"
└─> "Instalar Blog Plugin v1.2.3"
    └─> "Configurar plugin..."
        └─> "Adicionar bloco do plugin"
```

#### ✅ Design Bom (User-First)

```
Usuário vê:
"Adicionar Seção"
└─> Paleta mostra: Hero, Features, Blog Posts, Products, Events
    └─> Usuário clica "Blog Posts"
        └─> Seção adicionada (usuário não sabe que é um plugin!)
```

**Princípio:** Plugins estendem a paleta de seções, mas a UX permanece a mesma.

### 2. Pluggable (Extensível)

Plugins podem adicionar:

- **Seções** (novas opções na paleta)
- **Variações** (presets visuais para seções)
- **Temas** (paletas de cores globais)
- **Data Sources** (conectar a dados dinâmicos)
- **Templates** (sites completos pré-configurados)

```typescript
const ecommercePlugin: Plugin = {
  manifest: {
    id: 'ecommerce',
    name: 'E-commerce',
    version: '1.0.0',
  },

  // Novas seções
  blocks: [
    {
      type: 'product-list',
      name: 'Lista de Produtos',
      category: 'sections',
      variations: {
        grid: ProductGridVariation,
        carousel: ProductCarouselVariation,
      },
    },
    {
      type: 'shopping-cart',
      name: 'Carrinho de Compras',
      category: 'sections',
    },
  ],

  // Acesso ao banco de dados
  dataProvider: new EcommerceDataProvider(supabase),

  // Lifecycle
  lifecycleHooks: {
    onInstall: async () => {
      // Criar tabelas: products, orders, cart
    },
  },
};
```

### 3. Isolated (Isolado)

Plugins **não interferem** entre si.

#### Namespacing

Blocos de plugins têm namespace automático:

```typescript
// Plugin Blog registra bloco 'post-list'
pluginRegistry.register({
  manifest: { id: 'blog' },
  blocks: [{ type: 'post-list', /* ... */ }],
});

// Internamente vira: 'blog:post-list'
componentRegistry.get('blog:post-list');

// Plugin Ecommerce pode ter bloco com mesmo nome
pluginRegistry.register({
  manifest: { id: 'ecommerce' },
  blocks: [{ type: 'post-list', /* ... */ }], // OK! Vira 'ecommerce:post-list'
});
```

#### Data Isolation

Cada plugin acessa apenas seus próprios dados:

```typescript
// Blog Plugin não pode acessar dados de Ecommerce
blogDataProvider.getItems('products'); // ❌ Error: Unknown type
blogDataProvider.getItems('posts');    // ✅ OK

// Ecommerce Plugin não pode acessar dados de Blog
ecommerceDataProvider.getItems('posts');    // ❌ Error
ecommerceDataProvider.getItems('products'); // ✅ OK
```

### 4. Database-Aware (Conectado ao Banco)

Plugins podem **ler e escrever** no banco de dados do host application de forma **segura**.

#### Data Provider Interface

```typescript
interface DataProvider {
  // CRUD operations
  getItems(type: string, filters: DataFilters): Promise<{ items: any[]; total: number }>;
  getItem(type: string, id: string): Promise<any>;
  createItem(type: string, data: any): Promise<any>;
  updateItem(type: string, id: string, data: any): Promise<any>;
  deleteItem(type: string, id: string): Promise<void>;
}
```

#### Segurança (Multi-Tenant)

```typescript
class BlogDataProvider implements DataProvider {
  constructor(private supabase: SupabaseClient) {}

  async getItems(type: 'posts', filters: DataFilters) {
    // Supabase RLS (Row Level Security) garante:
    // - Usuário só vê dados do seu tenant
    // - tenant_id é filtrado automaticamente
    const { data } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('tenant_id', currentTenantId) // Auto-injetado pelo RLS
      .range(0, filters.limit ?? 10);

    return { items: data ?? [], total: data.length };
  }
}
```

**Garantias de Segurança:**
- ✅ Row Level Security (RLS) do Supabase
- ✅ Permissions verificadas antes de acesso
- ✅ Tenant ID propagado automaticamente
- ✅ Plugin não pode acessar dados de outro tenant
- ✅ Plugin não pode acessar tabelas de outro plugin

### 5. Type-Safe (Seguro em Tipos)

Plugins são **totalmente tipados** com TypeScript.

```typescript
// Plugin definition é tipado
const blogPlugin: Plugin = {
  manifest: {
    id: 'blog', // string literal
    version: '1.0.0', // SemVer
  },
  blocks: [
    {
      type: 'post-list',
      props: {
        layout: 'grid' as const, // Typed literal
        postsPerPage: 10, // number
      },
      // TypeScript garante que props são válidos
    }
  ],
};

// Uso é tipado
const blogPosts = await blogDataProvider.getItems('posts', { limit: 10 });
//    ^? { items: BlogPost[]; total: number }
```

## Casos de Uso

### Caso 1: Ecommerce Plugin

**Objetivo:** Adicionar funcionalidade de loja virtual.

**O que o Plugin Adiciona:**

1. **Seções:**
   - `product-list` (Lista de Produtos)
   - `product-detail` (Detalhes do Produto)
   - `shopping-cart` (Carrinho)
   - `checkout` (Finalizar Compra)

2. **Variações:**
   - Product List: Grid, Carousel, List
   - Product Card: Simples, Com hover, Com quick-view

3. **Data:**
   - `products` (id, name, price, image, category)
   - `categories` (id, name, slug)
   - `orders` (id, customer_id, items, total)
   - `cart_items` (id, product_id, quantity)

4. **Funcionalidades:**
   - Adicionar ao carrinho (client-side)
   - Checkout flow (API call)
   - Integração com gateway de pagamento

**UX para Usuário:**

```
1. Adicionar Seção
   └─> Vê "Lista de Produtos" na paleta (junto com Hero, Features, etc.)

2. Customizar
   ├─> Escolher variação: "Grid 3 colunas"
   ├─> Escolher categoria: "Cursos"
   ├─> Número de produtos: 12
   └─> Ordenação: "Mais vendidos"

3. Resultado
   └─> Seção dinâmica que busca produtos do banco automaticamente
```

### Caso 2: Blog Plugin

**Objetivo:** Adicionar sistema de blog.

**O que o Plugin Adiciona:**

1. **Seções:**
   - `blog-post-list` (Lista de Posts)
   - `blog-post-card` (Card de Post)
   - `blog-post-detail` (Post Completo)
   - `blog-category-filter` (Filtro por Categoria)

2. **Data:**
   - `blog_posts` (id, title, slug, content, published_at)
   - `blog_categories` (id, name, slug)
   - `blog_tags` (id, name)

3. **Funcionalidades:**
   - Listagem paginada
   - Filtro por categoria/tag
   - Busca por texto
   - SEO metadata (title, description, og:image)
   - RSS feed

### Caso 3: Contact Forms Plugin

**Objetivo:** Formulários de contato com validação.

**O que o Plugin Adiciona:**

1. **Seções:**
   - `contact-form` (Formulário Completo)
   - `form-field` (Campo Individual)

2. **Data:**
   - `contact_submissions` (id, form_id, data JSONB, created_at)

3. **Funcionalidades:**
   - Validação client-side (Zod)
   - Validação server-side (class-validator)
   - Anti-spam (reCAPTCHA)
   - Email notification (opcional)
   - Webhook support (enviar para Zapier, etc.)

### Caso 4: Agenda/Events Plugin

**Objetivo:** Sistema de eventos e calendário.

**O que o Plugin Adiciona:**

1. **Seções:**
   - `event-calendar` (Calendário Visual)
   - `event-list` (Lista de Eventos)
   - `event-card` (Card de Evento)

2. **Data:**
   - `events` (id, title, date, location, description)
   - `event_registrations` (id, event_id, user_id)

3. **Funcionalidades:**
   - Calendário interativo
   - Inscrição em eventos
   - iCal export
   - Google Calendar sync
   - Timezone handling

## Arquitetura de Plugins

### Plugin Lifecycle

```
1. Install (onInstall)
   ├─> Criar tabelas no banco
   ├─> Seeds iniciais (dados de exemplo)
   └─> Registrar no sistema

2. Enable (onEnable)
   ├─> Registrar blocos no ComponentRegistry
   ├─> Registrar Data Provider
   ├─> Adicionar rotas de API
   └─> Seções aparecem na paleta

3. Disable (onDisable)
   ├─> Remover blocos da paleta
   ├─> Manter dados no banco (não apagar!)
   └─> Seções existentes continuam funcionando (read-only)

4. Uninstall (onUninstall)
   ├─> Confirmar com usuário (dados serão perdidos!)
   ├─> Remover blocos do ComponentRegistry
   ├─> DROP tabelas do banco
   └─> Limpar completamente
```

### Plugin Structure

```
plugins/blog-plugin/
├── package.json
├── README.md
├── src/
│   ├── index.ts                 # Entry point
│   ├── manifest.ts              # Plugin metadata
│   ├── blocks/                  # Definições de seções
│   │   ├── PostListBlock.tsx
│   │   ├── PostCardBlock.tsx
│   │   └── PostDetailBlock.tsx
│   ├── data-provider.ts         # Data Provider implementation
│   ├── variations/              # Presets visuais
│   │   ├── postListVariations.ts
│   │   └── postCardVariations.ts
│   ├── migrations/              # SQL migrations
│   │   └── 001_create_blog_tables.sql
│   └── api/                     # Backend routes (opcional)
│       ├── posts.controller.ts
│       └── posts.service.ts
└── examples/                    # Exemplos de uso
    └── blog-template.ts
```

### Plugin Manifest

```typescript
interface PluginManifest {
  // Identificação
  id: string;                    // 'ecommerce', 'blog', 'contact'
  name: string;                  // 'E-commerce Module'
  version: string;               // '1.0.0' (SemVer)
  description: string;
  author: string;

  // Dependências
  dependencies?: {
    core?: string;               // '^1.0.0' (versão mínima do core)
    plugins?: Record<string, string>; // { 'auth': '^2.0.0' }
  };

  // Permissões requeridas
  permissions: PluginPermission[];

  // Compatibilidade
  compatibility?: {
    projects?: string[];         // ['ensino', 'portifolio']
    databases?: string[];        // ['supabase', 'postgres']
  };
}

type PluginPermission =
  | 'database:read'
  | 'database:write'
  | 'api:extend'
  | 'theme:extend'
  | 'storage:read'
  | 'storage:write';
```

## Comparação: Com vs Sem Plugins

### Adicionando Funcionalidade de Blog

#### ❌ Sem Sistema de Plugins

```typescript
// Modificar src/engine/registry/blocks/index.ts
componentRegistry.register({
  type: 'blog-post-list',
  // ... 100+ linhas
});

// Modificar src/engine/render/renderNodeImpl.tsx
case 'blog-post-list':
  return <BlogPostList {...props} />;

// Modificar src/engine/export/exportHtml.ts
case 'blog-post-list':
  return `<div class="blog-posts">...</div>`;

// Modificar backend/src/sites/sites.service.ts
if (type === 'blog-posts') {
  // hardcode query
}

// Criar migrations no projeto principal
CREATE TABLE blog_posts (...);
```

**Problemas:**
- 5+ arquivos modificados
- Core fica inchado
- Difícil remover feature depois
- Não é modular

#### ✅ Com Sistema de Plugins

```typescript
// Criar blog-plugin/ separado
const blogPlugin: Plugin = {
  manifest: { id: 'blog', name: 'Blog Module', version: '1.0.0' },
  blocks: [BlogPostListBlock, BlogPostCardBlock],
  dataProvider: new BlogDataProvider(supabase),
  lifecycleHooks: {
    onInstall: async () => {
      await supabase.query(`CREATE TABLE blog_posts (...)`);
    },
  },
};

// Registrar
pluginRegistry.register(blogPlugin);
```

**Benefícios:**
- 1 arquivo (`plugins/blog-plugin/index.ts`)
- Core permanece limpo
- Fácil habilitar/desabilitar
- Modular e reutilizável
- Pode ser NPM package

## Próximos Passos

1. ✅ Definir filosofia de plugins (este doc)
2. ⏭️ Implementar `PluginRegistry` class
3. ⏭️ Criar interfaces TypeScript (`Plugin`, `DataProvider`, `LifecycleHooks`)
4. ⏭️ Refatorar blocos atuais como "core plugin"
5. ⏭️ Criar plugin de exemplo: "Contact Forms"
6. ⏭️ Documentar API de plugins
7. ⏭️ Criar 4 plugins de referência (Ecommerce, Blog, Contact, Agenda)

---

**Próximo:** [Plugin Architecture →](02-plugin-architecture.md)
