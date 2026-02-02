# Visão Geral - SmartGestI Site Editor

## Introdução

O **SmartGestI Site Editor** é um construtor de sites projetado com filosofia **user-first**, permitindo que **usuários leigos** criem landing pages profissionais sem conhecimento técnico.

Ao invés de um builder complexo onde usuários montam páginas bloco por bloco, o sistema oferece **seções completas pré-montadas** com **variações visuais**, customização simples via UI e temas globais que propagam estilos automaticamente.

## Filosofia: User-First, Section-Based

### ❌ O que NÃO é

- **NÃO é** um page builder tradicional onde você arrasta componentes individuais (heading, button, image)
- **NÃO requer** conhecimento de CSS, HTML ou design
- **NÃO expõe** configurações técnicas complexas ao usuário

### ✅ O que É

- **Seções completas** prontas para uso (Hero, Features, Pricing, Testimonials, FAQ, etc.)
- **Variações visuais** para cada seção (ex: Hero Minimalista, Hero Dividido, Hero com Vídeo)
- **Customização simples** via color pickers, toggles, selects, sliders
- **Temas globais** que propagam cores/estilos para todos elementos automaticamente
- **Mix & Match** de seções entre templates diferentes

### Exemplo Prático

**Fluxo do Usuário:**

```
1. Escolher Template
   └─> "Landing Escola Moderna"

2. Adicionar Seções
   ├─> Hero (variação: Dividido com Imagem)
   ├─> Features (variação: Grid 3 colunas com ícones)
   ├─> Pricing (variação: Cards com destaque central)
   └─> FAQ (variação: Accordion simples)

3. Customizar Tema
   ├─> Cor primária: #3b82f6 (blue)
   ├─> Arredondamento: Large
   ├─> Sombras: Strong
   └─> Espaçamento: Spacious

4. Customizar Seções Individuais
   ├─> Hero: Mudar título, subtítulo, imagem
   ├─> Features: Editar textos e ícones
   └─> Pricing: Ajustar preços e features

5. Publicar ✅
   └─> HTML estático gerado automaticamente
```

**Resultado:** Site profissional criado em minutos por usuário sem conhecimento técnico.

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                 SmartGestI Site Editor                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Template   │─────▶│   Section    │─────▶│  Render   │ │
│  │   Picker     │      │   Palette    │      │  Preview  │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         │                      │                     │       │
│  ┌──────▼──────────────────────▼─────────────────────▼────┐ │
│  │              Section Registry                           │ │
│  │  (Hero, Features, Pricing, Testimonial, FAQ, etc.)     │ │
│  └─────────────────────────────────────────────────────────┘ │
│         │                      │                     │       │
│         │                      │                     │       │
│  ┌──────▼──────┐      ┌────────▼────────┐   ┌───────▼─────┐ │
│  │  Variations │      │  Theme System   │   │ Patch Ops  │ │
│  │  (Presets)  │      │  (CSS Vars)     │   │ (History)  │ │
│  └─────────────┘      └─────────────────┘   └────────────┘ │
│         │                      │                     │       │
│         └──────────────────────┼─────────────────────┘       │
│                                │                             │
│                         ┌──────▼──────┐                      │
│                         │   Export    │                      │
│                         │ (HTML + CSS)│                      │
│                         └─────────────┘                      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Published Site      │
                    │ (Static HTML, no JS)  │
                    └───────────────────────┘
```

## Componentes Principais

### 1. Template System

**Templates** são sites completos pré-configurados com:
- Tema visual (cores, tipografia, espaçamentos)
- Conjunto de seções (Hero + Features + Pricing + FAQ)
- Layout responsivo

**Exemplos de Templates:**
- `escola-completa` - Site institucional completo
- `escola-minimalista` - Design clean focado em conversão
- `escola-cursos-destaque` - Destaque para catálogo de cursos
- `landing-empresa` - Empresa/startup tech
- `landing-saas` - Produto SaaS

**Usuário pode:**
- ✅ Escolher template inicial
- ✅ Trocar seções entre templates (Mix & Match)
- ✅ Trocar tema global mantendo seções
- ✅ Adicionar/remover seções à vontade

### 2. Section Registry

**Registry centralizado** que armazena todas as definições de seções disponíveis.

**Estrutura de uma Seção:**

```typescript
interface SectionDefinition {
  type: 'hero' | 'features' | 'pricing' | 'testimonial' | 'faq' | ...;
  name: string;              // "Hero"
  description: string;       // "Seção de destaque principal"
  icon: string;              // Ícone na paleta
  category: 'sections';      // Categoria

  // Variações disponíveis
  variations: {
    minimalista: HeroVariationPreset;
    dividido: HeroVariationPreset;
    comVideo: HeroVariationPreset;
    parallax: HeroVariationPreset;
  };

  // Propriedades customizáveis
  inspectorMeta: {
    title: { label: 'Título', type: 'text' };
    subtitle: { label: 'Subtítulo', type: 'textarea' };
    ctaText: { label: 'Texto do Botão', type: 'text' };
    imageSrc: { label: 'Imagem', type: 'image' };
    backgroundColor: { label: 'Cor de Fundo', type: 'color' };
  };

  // Props padrão
  defaultProps: {
    title: 'Título Principal';
    subtitle: 'Subtítulo descritivo';
    ctaText: 'Começar Agora';
    layout: 'center';
  };
}
```

**Seções Disponíveis (v1.0):**

| Seção | Variações | Descrição |
|-------|-----------|-----------|
| **Hero** | Minimalista, Dividido, Com Vídeo, Parallax | Seção principal de destaque |
| **Features** | Grid 2 cols, Grid 3 cols, Lista vertical | Recursos/benefícios |
| **Pricing** | Cards simples, Cards destaque, Tabela | Planos e preços |
| **Testimonial** | Grid, Carousel, Single | Depoimentos |
| **FAQ** | Accordion, Grid 2 cols | Perguntas frequentes |
| **CTA** | Simples, Com imagem, Full-width | Call-to-action |
| **Stats** | Horizontal, Grid | Estatísticas/números |
| **LogoCloud** | Grid, Carousel | Logos de parceiros |
| **Navbar** | Simples, Com botão, Transparente | Navegação |

### 3. Variation System (Sistema de Variações)

Cada seção possui **variações visuais** pré-configuradas.

**Exemplo: Hero Section**

```typescript
// Variação 1: Minimalista
const heroMinimalista: HeroVariationPreset = {
  id: 'minimalista',
  name: 'Minimalista',
  description: 'Texto centralizado, sem imagem',
  preview: '/previews/hero-minimalista.png',
  apply: (block) => ({
    ...block,
    props: {
      ...block.props,
      layout: 'center',
      showImage: false,
    },
    styles: {
      background: 'var(--color-background)',
      padding: 'var(--spacing-xl)',
      textAlign: 'center',
    },
  }),
};

// Variação 2: Dividido com Imagem
const heroDividido: HeroVariationPreset = {
  id: 'dividido',
  name: 'Dividido',
  description: 'Texto à esquerda, imagem à direita',
  preview: '/previews/hero-dividido.png',
  apply: (block) => ({
    ...block,
    props: {
      ...block.props,
      layout: 'split',
      showImage: true,
      imagePosition: 'right',
    },
    styles: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--spacing-lg)',
    },
  }),
};
```

**Como Funciona:**

1. Usuário clica em "Adicionar Hero"
2. Modal aparece com preview das variações
3. Usuário escolhe "Dividido"
4. Seção é inserida com props/styles da variação
5. Usuário customiza texto, cores, imagem

### 4. Theme System (Sistema de Temas)

**Temas globais** definem a identidade visual do site inteiro.

```typescript
interface ThemeTokens {
  // Cores semânticas
  colors: {
    primary: string;      // Cor principal (botões, links)
    secondary: string;    // Cor secundária (destaques)
    accent: string;       // Cor de acento
    background: string;   // Fundo padrão
    text: string;         // Texto padrão
    border: string;       // Bordas
    // ... mais cores
  };

  // Tipografia
  typography: {
    fontFamily: {
      heading: 'Inter, sans-serif';
      body: 'Inter, sans-serif';
    };
    fontSize: {
      xs: '0.75rem';
      sm: '0.875rem';
      md: '1rem';
      lg: '1.125rem';
      xl: '1.25rem';
      // ... até 5xl
    };
    fontWeight: {
      normal: 400;
      medium: 500;
      semibold: 600;
      bold: 700;
    };
  };

  // Espaçamento
  spacing: {
    xs: '0.5rem';
    sm: '0.75rem';
    md: '1rem';
    lg: '1.5rem';
    xl: '2rem';
    // ... até 5xl
  };

  // Bordas e sombras
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
  shadows: 'none' | 'soft' | 'md' | 'strong' | 'glow';

  // Efeitos
  effects: {
    blur: { sm: '4px', md: '8px', lg: '16px' };
    transition: { fast: '150ms', normal: '300ms', slow: '500ms' };
  };
}
```

**CSS Variables Geradas:**

```css
:root {
  /* Cores */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;

  /* Tipografia */
  --font-family-heading: 'Inter', sans-serif;
  --font-size-md: 1rem;
  --font-weight-bold: 700;

  /* Espaçamento */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Efeitos */
  --radius: 0.5rem;
  --shadow: 0 4px 6px rgba(0,0,0,0.1);
  --blur-md: 8px;
}
```

**Mudança de Tema:**

```typescript
// Usuário escolhe "Tema Escuro"
const temaEscuro = {
  colors: {
    primary: '#60a5fa',
    background: '#1f2937',
    text: '#f9fafb',
  },
  // ...
};

// TODAS as seções atualizam automaticamente
// pois usam var(--color-primary), var(--color-background), etc.
```

### 5. Dual Rendering (React + HTML)

O sistema renderiza de **duas formas**:

#### **Modo Editor (React)**

- Interface interativa
- Preview em tempo real
- Drag & drop de seções
- Painel de customização

```tsx
function HeroSection({ props, styles }) {
  return (
    <section className="hero" style={styles}>
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
      <button>{props.ctaText}</button>
    </section>
  );
}
```

#### **Modo Export (HTML Estático)**

- HTML puro (sem React runtime)
- CSS inline + variables
- Otimizado para SEO
- Deploy em qualquer servidor

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>
    :root {
      --color-primary: #3b82f6;
      --spacing-md: 1rem;
    }
    .hero {
      background: var(--color-primary);
      padding: var(--spacing-md);
    }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Título Principal</h1>
    <p>Subtítulo descritivo</p>
    <button>Começar Agora</button>
  </section>
</body>
</html>
```

### 6. Patch System (Versionamento)

Todas as mudanças são rastreadas via **JSON Patch (RFC 6902)**.

```typescript
// Usuário muda título do Hero
const patch = [
  {
    op: 'replace',
    path: '/pages/0/blocks/0/props/title',
    value: 'Novo Título'
  }
];

// Salvo no banco
site_versions {
  site_id: 'abc',
  version: 5,
  patches: [/* patches */],
  author_type: 'user',
  created_at: '2026-01-30'
}

// Permite:
// - Undo/Redo
// - Histórico de versões
// - Rollback
// - Auditoria
```

### 7. Export System (Otimizado)

**LRU Cache** para performance:

```typescript
const exportCache = new LRUCache({ max: 100 });

function exportToHtml(doc: SiteDocumentV2): string {
  const cacheKey = hashDocument(doc);

  if (exportCache.has(cacheKey)) {
    return exportCache.get(cacheKey); // Cache hit
  }

  const html = generateHtml(doc); // Render
  exportCache.set(cacheKey, html);

  return html;
}
```

**Otimizações:**
- Cache LRU (100 entradas)
- Lazy loading de imagens
- CSS minificado
- HTML compactado
- Inline crítico CSS

## Fluxo de Dados

```
User Action (Editar texto)
    │
    ▼
Editor UI (Input field)
    │
    ▼
PatchBuilder (Criar JSON Patch)
    │
    ▼
Apply Patch (Atualizar documento)
    │
    ├──▶ History Manager (Undo/Redo)
    │
    ├──▶ Validator (Verificar constraints)
    │
    ├──▶ Re-render Preview (React)
    │
    └──▶ Save to Backend (API call)
           │
           ▼
       Database (sites table)
           │
           ▼
       Versioning (site_versions table)
```

## Stack Tecnológico

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|-----------|
| **UI** | React | 19.0 | Editor interativo |
| **Language** | TypeScript | 5.6+ | Type safety |
| **Styling** | CSS Variables | - | Theming dinâmico |
| **State** | Custom Hooks | - | Editor state |
| **Drag & Drop** | @dnd-kit | 6.x-8.x | Reordenar seções |
| **Color Picker** | react-colorful | 5.6 | Seleção de cores |
| **Icons** | lucide-react | 0.447 | Ícones |
| **Validation** | Zod | - | Schema validation |
| **Versioning** | JSON Patch | RFC 6902 | Undo/redo |
| **Cache** | LRU Cache | - | Export performance |

## Design Patterns

### 1. Registry Pattern

Centraliza definições de seções.

```typescript
class ComponentRegistryImpl {
  private definitions: Map<SectionType, SectionDefinition>;

  register(def: SectionDefinition): void;
  get(type: SectionType): SectionDefinition | undefined;
  getAll(): SectionDefinition[];
  getByCategory(cat: string): SectionDefinition[];
}

export const componentRegistry = new ComponentRegistryImpl();
```

### 2. Variation Pattern

Presets reutilizáveis.

```typescript
interface VariationPreset<T> {
  id: string;
  name: string;
  description: string;
  preview: string;
  apply: (block: T) => T;
}
```

### 3. Theme Token Pattern

Design tokens escaláveis.

```typescript
// Define tokens
const tokens: ThemeTokens = { /* ... */ };

// Gera CSS variables
const css = generateThemeCSSVariables(tokens);

// Aplica globalmente
document.documentElement.innerHTML = `<style>${css}</style>`;
```

### 4. Command Pattern (Patches)

Operações reversíveis.

```typescript
interface PatchOperation {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: any;
}

class PatchBuilder {
  replace(path: string, value: any): this;
  add(path: string, value: any): this;
  remove(path: string): this;
  build(): PatchOperation[];
}
```

## Limitações Atuais

### 1. Patch System
- ❌ `applyPatch()` é simulação - precisa biblioteca real (fast-json-patch)
- ✅ **Solução:** Integrar fast-json-patch na próxima sprint

### 2. Dynamic Data
- ❌ Hardcoded para tipo 'avisos' apenas
- ✅ **Solução:** Sistema de Data Providers (Sprint 7-8)

### 3. Variations
- ❌ Apenas Hero e Navbar têm variações
- ✅ **Solução:** Criar variações para todas as seções

### 4. Export CSS
- ❌ CSS inline pode ser grande
- ✅ **Solução:** CSS modules ou Tailwind JIT

### 5. Multi-page Navigation
- ❌ Não há navegação entre páginas no viewer
- ✅ **Solução:** Implementar router no viewer

## Próximos Passos

1. ✅ Documentar arquitetura atual (este doc)
2. ⏭️ Criar variações para todas seções
3. ⏭️ Implementar Data Providers genéricos
4. ⏭️ Sistema de Plugins completo
5. ⏭️ Marketplace de templates

---

**Próximo:** [Registry Pattern →](02-registry-pattern.md)
