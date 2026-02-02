# SmartGestI Site Editor - Documentação

> Construtor de sites **user-first** baseado em seções pré-montadas com variações visuais e customização simples.

## 🎯 Visão Geral

O **SmartGestI Site Editor** é um construtor de sites projetado para **usuários leigos** criarem landing pages profissionais sem conhecimento técnico. Ao invés de um builder complexo de blocos individuais, o sistema oferece:

- **Seções completas prontas** (Hero, Features, Pricing, FAQ, etc.)
- **Variações visuais** para cada seção (ex: Hero Minimalista, Hero Dividido, Hero com Vídeo)
- **Templates diversos** com layouts e temas diferentes
- **Mix & Match**: Use navbar de um template + hero de outro - tudo se encaixa perfeitamente
- **Customização simples**: Color pickers, toggles, selects - sem complexidade técnica
- **Temas globais**: Mude cores/estilos e veja refletir em todo o site instantaneamente

## 📚 Índice da Documentação

### 1️⃣ Arquitetura
Entenda como o sistema funciona internamente.

- [01. Visão Geral](01-arquitetura/01-visao-geral.md) - Arquitetura geral do sistema
- [02. Registry Pattern](01-arquitetura/02-registry-pattern.md) - Como seções são registradas
- [03. Dual Rendering](01-arquitetura/03-dual-rendering.md) - React (editor) + HTML (export)
- [04. Theme System](01-arquitetura/04-theme-system.md) - Sistema de temas e tokens CSS
- [05. Patch System](01-arquitetura/05-patch-system.md) - Versionamento com JSON Patch
- [06. Variations](01-arquitetura/06-variations.md) - Sistema de variações de seções
- [07. Export System](01-arquitetura/07-export-system.md) - Exportação HTML otimizada

### 2️⃣ Integração
Como integrar o editor em sua aplicação.

- [01. Overview](02-integracao/01-overview.md) - Modelo de integração
- [02. API Contracts](02-integracao/02-api-contracts.md) - Contratos de API REST
- [03. Database Schema](02-integracao/03-database-schema.md) - Schema do banco de dados
- [04. Multi-tenant](02-integracao/04-multi-tenant.md) - Arquitetura multi-tenant
- [05. SmartGesti-Ensino](02-integracao/05-smartgesti-ensino.md) - Caso real de integração
- [06. Integration Guide](02-integracao/06-integration-guide.md) - Guia passo a passo

### 3️⃣ Desenvolvimento
Crie seções, variações e templates customizados.

- [01. Getting Started](03-desenvolvimento/01-getting-started.md) - Começando
- [02. Criar Seções](03-desenvolvimento/02-criar-blocos.md) - Tutorial de criação de seções
- [03. Criar Variações](03-desenvolvimento/03-criar-variacoes.md) - Variações visuais
- [04. Estender Theme](03-desenvolvimento/04-estender-theme.md) - Customizar temas
- [05. Criar Templates](03-desenvolvimento/05-criar-templates.md) - Templates completos
- [06. Dynamic Data](03-desenvolvimento/06-dynamic-data.md) - Dados dinâmicos do backend

### 4️⃣ Sistema de Plugins ⭐
**CORE** - Torne o editor extensível com módulos plugáveis.

- [01. Design Philosophy](04-sistema-plugins/01-design-philosophy.md) - Filosofia e objetivos
- [02. Plugin Architecture](04-sistema-plugins/02-plugin-architecture.md) - Arquitetura técnica
- [03. Registry Extension](04-sistema-plugins/03-registry-extension.md) - Extensão do registry
- [04. Data Providers](04-sistema-plugins/04-data-providers.md) - Acesso ao banco de dados
- [05. Lifecycle Hooks](04-sistema-plugins/05-lifecycle-hooks.md) - Ciclo de vida
- [06. Exemplo Completo](04-sistema-plugins/06-exemplo-completo.md) - Plugin Contact Forms

### 5️⃣ Refatoração
Roadmap de evolução para sistema plugável.

- [01. Roadmap](05-refatoracao/01-roadmap.md) - Plano de 16 semanas
- [02. Breaking Changes](05-refatoracao/02-breaking-changes.md) - Mudanças incompatíveis
- [03. Migration Guide](05-refatoracao/03-migration-guide.md) - Como migrar
- [04. Versioning Strategy](05-refatoracao/04-versioning-strategy.md) - Semantic versioning

### 6️⃣ Exemplos
Plugins de referência completos.

- [Ecommerce Plugin](06-exemplos/ecommerce-plugin/) - Loja virtual
- [Blog Plugin](06-exemplos/blog-plugin/) - Sistema de blog
- [Contact Plugin](06-exemplos/contact-plugin/) - Formulários de contato
- [Agenda Plugin](06-exemplos/agenda-plugin/) - Sistema de eventos

## 🚀 Quick Start

### Para Usuários (Criar Sites)

```typescript
import { LandingPageEditorV2 } from '@brunoalz/smartgesti-site-editor';
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css';

function MeuEditor() {
  return (
    <LandingPageEditorV2
      onSave={async (doc) => {
        await fetch('/api/sites', {
          method: 'POST',
          body: JSON.stringify({ template: doc }),
        });
      }}
    />
  );
}
```

O editor oferece:
- **Seleção de template** inicial
- **Paleta de seções** (Hero, Features, Pricing, etc.)
- **Variações visuais** para cada seção
- **Customização simples** via painel de propriedades
- **Preview em tempo real**
- **Exportação HTML** estática

### Para Desenvolvedores (Estender o Sistema)

```typescript
// Criar nova variação de Hero
import { HeroVariationPreset } from '@brunoalz/smartgesti-site-editor';

const heroModerno: HeroVariationPreset = {
  id: 'moderno',
  name: 'Hero Moderno',
  description: 'Design clean com gradiente sutil',
  apply: (block) => ({
    ...block,
    props: {
      ...block.props,
      layout: 'center-with-image',
    },
    styles: {
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      padding: 'var(--spacing-xl)',
    },
  }),
};
```

## 🎨 Filosofia de Design

### User-First (Usuário Primeiro)

O sistema é projetado para **usuários leigos**, não desenvolvedores:

- ❌ **NÃO**: Drag-and-drop de componentes individuais
- ✅ **SIM**: Adicionar seções completas pré-montadas

- ❌ **NÃO**: Editar CSS ou código
- ✅ **SIM**: Color pickers, toggles, sliders visuais

- ❌ **NÃO**: Configurações técnicas complexas
- ✅ **SIM**: "Escolha um tema" + "Adicione seções" + "Customize cores"

### Seções ao invés de Blocos

Cada **seção** é uma unidade completa e funcional:

```
Hero Section (completa)
├── Título (h1)
├── Subtítulo (p)
├── CTA Button
├── Imagem/Vídeo
└── Background com gradiente
```

O usuário:
1. Escolhe a seção "Hero"
2. Escolhe variação (Minimalista, Dividido, Com Vídeo, etc.)
3. Customiza: texto, cores, imagem
4. Pronto! ✅

### Variações Visuais

Cada seção tem múltiplas variações:

**Hero Section:**
- Minimalista (texto centralizado, sem imagem)
- Dividido (texto à esquerda, imagem à direita)
- Com Vídeo (background video)
- Parallax (efeito parallax scroll)

**Pricing Section:**
- Cards simples
- Cards com destaque (middle card larger)
- Tabela comparativa
- Toggle mensal/anual

### Temas Globais Escaláveis

Mudar o tema afeta **tudo automaticamente**:

```typescript
// Usuário escolhe "Tema Moderno"
const temaModerno = {
  colors: { primary: '#3b82f6', secondary: '#8b5cf6' },
  radius: 'lg',        // Todas bordas ficam arredondadas
  shadows: 'strong',   // Todas sombras ficam pronunciadas
  spacing: 'spacious', // Todos espaçamentos aumentam
};

// Resultado: TODAS as seções automaticamente adotam esse estilo
```

## 🔧 Tecnologias

- **React 19** - UI framework
- **TypeScript 5.6+** - Type safety
- **CSS Variables** - Theming dinâmico
- **JSON Patch** - Versionamento
- **LRU Cache** - Performance de export
- **Supabase** - Database (multi-tenant)

## 📦 Instalação

```bash
npm install @brunoalz/smartgesti-site-editor
```

```typescript
// Importar componentes
import {
  LandingPageEditorV2,
  LandingPageViewerV2,
  SiteDocumentV2
} from '@brunoalz/smartgesti-site-editor';

// Importar CSS
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css';
```

## 🤝 Contribuindo

Veja [03-desenvolvimento](03-desenvolvimento/) para guias de desenvolvimento.

## 📄 Licença

MIT - SmartGesTI

---

**Versão da Documentação:** 1.0.0
**Última atualização:** 2026-01-30
