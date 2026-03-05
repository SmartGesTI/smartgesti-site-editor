# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

---

## [1.10.1] - 2026-02-12

### 🔧 Corrigido

- **ImageGallery Inspector UX** - 4 melhorias na experiência do inspetor (labels, grupos, inputs)
- **Preview Scripts** - Re-execução de scripts após atualizações parciais de bloco (partial block updates)

---

## [1.10.0] - 2026-02-12

### ✨ Adicionado

- **ImageGallery API Pública** - Exportados todos os tipos, componentes e presets (`GalleryImage`, `LightboxConfig`, `ImageGalleryBlock`, `galleryVariations`, `exportImageGallery`)
- **Gallery Variations** - Arquivo `galleryVariations.ts` com variação `gallery-grid` (MVP); roadmap: masonry, featured, carousel, alternating
- **Documentação** - ImageGallery adicionado como exemplo avançado em `CREATING-BLOCKS.md`

---

## [1.9.1] - 2026-02-12

### ✨ Adicionado

- **Bloco ImageGallery** - Galeria de imagens profissional com:
  - Schema TypeScript completo (`ImageGalleryBlock`, `GalleryImage`, `LightboxConfig`, enums)
  - Block definition com 25+ props em 8 grupos de inspetor
  - React Renderer com grid responsivo (4→3→2→1 colunas), `LazyImage` com Intersection Observer
  - 4 hover effects: zoom-overlay, glow, scale, caption-reveal
  - 3 animações de entrada: fade-scale, stagger, slide-up
- **Lightbox Fullscreen** - Componente via React Portal com:
  - Zoom 1x–5x com pan (drag)
  - Navegação prev/next com setas e teclado (ESC, Arrows, +/-/0)
  - Touch gestures: swipe, pinch-zoom, double-tap
  - Thumbnails navegáveis, caption, contador
  - Tema adaptável (dark/light/theme/adaptive)
  - ARIA completo (dialog, live regions)
- **HTML Exporter Vanilla JS** - Export standalone com zero dependências:
  - CSS inline com grid responsivo, hover effects, animações e lightbox UI
  - JavaScript IIFE com zoom, pan, navegação, teclado e touch gestures
  - Lazy loading nativo (`loading="lazy"`)
- **Template Admin** - ImageGallery adicionado ao template SmartGesti Admin

### 🔧 Corrigido

- Schema: campos `variation` e `LightboxConfig` tornados opcionais
- Lightbox: qualidade de código revisada
- Exporter: vulnerabilidades XSS resolvidas (uso de `escapeHtml()`)

---

## [1.9.0] - 2026-02-11

### ✨ Adicionado

- **Blog Plugin — Card Customization** - Sistema completo de customização de cards:
  - Controles de conteúdo do card (layout badge/avatar)
  - Efeitos globais em card/imagem/botão
  - Hover effects com variantes completas (border, scale, overlay, etc.)
  - Click-to-edit direto no card
  - Controle dinâmico de quantidade de cards
- **Sistema Global de Ícones em Links** - Ícones inline opcionais em qualquer link
- **Blog — Icon Overlay** - Selector de ícone para botões CTA com efeito overlay

### 🔧 Corrigido

- Blog: seleção de card (removido seleção de botão CTA — mantido apenas seleção do card)
- Navbar: sticky behavior corrigido no blogPostGrid

---

## [1.8.0] - 2026-02-10

### ✨ Adicionado

- **Blog — Variante Magazine** - Nova variante para `blogPostGrid` com layout tipo revista
- **Blog — Sidebar Hydration Fix** - Correção da hidratação de sidebars

---

## [1.7.0] - 2026-02-10

*(bump de versão — mudanças incluídas na v1.6.0)*

---

## [1.6.0] - 2026-02-10

### ✨ Adicionado

- **Blog — Sidebar Widgets Avançados** - Widgets com grid bg effects, sistema de hover e integração com paleta
- **Layout — Button-Group Controls** - Controles de grupos de botões para grid/stack (padrão Hero split variant)

---

## [1.5.2] - 2026-02-10

### 🔧 Corrigido

- **Layout Inspector** - Controles ricos para grid/stack (seletores, toggles) + `paddingTop` para navbar fixo

---

## [1.5.1] - 2026-02-10

### ✨ Adicionado

- **Layout — Sidebar Props** - Espaçamento de sidebar, posicionamento sticky e grid container props

---

## [1.5.0] - 2026-02-10

### ✨ Adicionado

- **Blog Plugin — Sidebar Widgets** - Widgets de sidebar com grid colTemplate e sistema de autores

---

## [1.4.3] - 2026-02-10

### ✨ Adicionado

- **Blog — Paginação** - Paginação para `blogPostGrid` (Fase 2 do roadmap)

---

## [1.4.2] - 2026-02-10

### 🔧 Corrigido

- Blog: links do navbar preservados ao ativar plugin + rotas padronizadas

---

## [1.4.1] - 2026-02-10

### ✨ Adicionado

- **Blog — Search & Filters** - Busca full-stack, filtros por categoria, passthrough de SEO e correções de hidratação
- **Blocos Blog** - `blogCategoryFilter` e `blogSearchBar`
- **SEO** - Meta tags para páginas do blog

---

## [1.4.0] - 2026-02-09

### ✨ Adicionado

- **Editor — Default Palette por Template** - Cada template tem paleta padrão
- **Editor — Palette-Aware Color Derivation** - Cores derivadas de forma inteligente da paleta ativa

---

## [1.3.0] - 2026-02-09

### ✨ Adicionado

- **3 Blocos Admin** - Novos blocos para template SmartGesti Admin
- **Template SmartGesti Admin** - Template completo para interface administrativa
- **Editor — Palette Colors** - Cores da paleta aplicadas a links do navbar e botões

### 🔧 Corrigido

- Preview: full reload forçado quando o tema muda junto com blocos (theme change = regenerar CSS variables no iframe)
- Viewer: bypass do cache de export HTML para renders de blog hidratados

---

## [1.2.0] - 2026-02-08

*(bump de versão — mudanças incluídas na v1.1.0)*

---

## [1.1.0] - 2026-02-08

### ✨ Adicionado

- **Sistema de Plugins** (Sprints 0–3):
  - `PluginManifest`, `PluginRegistration`, `ContentProvider` interfaces
  - `pluginRegistry` singleton com activate/deactivate imutável
  - **Blog Plugin Builtin** — blocos `blogPostCard`, `blogPostGrid`, `blogPostDetail`
  - Dual rendering: React renderers + HTML exporters para todos os blocos de blog
  - `BlockDefinition.pluginId` — badge 🧩 no editor
  - `SitePage.pluginId` — páginas de plugin não deletáveis
  - `getEditorRestrictions()` — union de lockedFields, intersection de editableFields
  - `PluginPanel` no LeftPanel com toggle switches
  - Plugin badges no BlockSelector (🧩 purple)
  - Plugin pages no PageTabBar (🧩 icon, sem delete)
  - `hydratePageWithContent()` — hidratação de blocos com dados de ContentProvider
  - `matchDynamicPage()` — resolve URL patterns dinâmicos (blog/:slug)
  - `mockBlogContentProvider` com 3 posts placeholder
  - `LandingPageViewer`: nova prop `contentProviders?: ContentProvider[]`
  - Blog plugin `onActivate` cria páginas pré-configuradas

- **Editor — Click-to-Scroll** - Clique no preview rola o painel de inspetor até o bloco correspondente; `data-block-group` em 10 blocos; overlay de seleção e indicador de grupo

- **Editor — showWhen** - Sistema avançado de visibilidade condicional de campos do inspetor

- **Hero — Variação Carrossel** - Crossfade CSS com indicadores

- **Image Grid** - Escala individual por imagem + UI do editor redesenhada

### 🔧 Corrigido

- Blog: footer duplicado, navegação e links corrigidos
- Preview: flash e scroll reset ao editar páginas não-home
- Viewer: race condition na hidratação do `LandingPageViewer`
- Blog: autor dinâmico com variantes no `blogPostDetail`

---

## [1.0.0] - 2026-02-06

### 💥 Breaking Changes

- **Remoção completa do V1** — código legado (`types/`, `modules/`, `utils V1`, backups) removido (~9.000 linhas)
- **Sufixo V2 removido** — todos os componentes, importações e referências renomeados
- **ESM-only** — `preserveModules: true`, sem bundle CJS

### ✨ Adicionado

- **Refatoração Completa v0.2.x** (fases 1–6):
  - **Fase 1 — Qualidade**: ESLint 9 flat config, Logger utility (`src/utils/logger.ts`), `sideEffects` com globs no `package.json`
  - **Fase 2 — Duplicação**: Constantes extraídas (`shadowConstants.ts`, `layoutConstants.ts`, `socialIcons.ts`), barrel exports → 330+ named exports explícitos em `src/index.ts`
  - **Fase 3 — Type Safety**: `BlockDefinition<T>` e `BlockVariation<T>` genéricos, `BlockOfType<T>` / `BlockPropsFor<T>` utility types, type guards `isBlockType()` / `getBlockProps()`
  - **Fase 4 — Performance**: `React.memo` em 6 componentes de painel, `useCallback` nos handlers críticos, data URL utilities extraídas
  - **Fase 5 — Limpeza**: `ImageInput` e `LoadingSpinner` movidos para locais definitivos
  - **Fase 6 — Build**: todas as deps externalizadas no Vite, React removido de `dependencies` (mantido em `peerDependencies`), `@vanilla-extract/vite-plugin` movido para `devDependencies`

### 🔧 Corrigido

- Hover effects não aplicados no site publicado

---

## [0.2.2] - 2026-02-05

### ✨ Adicionado

- **Sistema de Tipografia** - Customização completa de fontes: família, tamanho, peso, espaçamento
- **Hero — Image Grid** - Substituição do Canvas Layout por sistema de Image Grid
- **Hero — Controles de Espaçamento** - Props para controlar margens e padding

### 🔧 Corrigido / Refatorado

- Hero: opções de Largura do Conteúdo simplificadas
- Hero: separação entre alinhamento de texto e posição do container
- Hero: UX da opção de inverter layout melhorada

---

## [0.2.1] - 2026-02-04

### ✨ Adicionado

- **Hover Effects System** - Sistema de hover effects reutilizável aplicado em todos os componentes:
  - Módulo `hoverEffects` centralizado
  - Efeitos overlay separados dos efeitos principais
  - Aplicado em Footer, Hero, Cards e outros blocos
- **Navbar — Hover Effects** - Sistema avançado de efeitos para links e botões do navbar
- **Navbar — Bordas e Posição do Logo** - Suporte a bordas e controle da posição do logo
- **Buttons — Tamanho Configurável** - Controle de tamanho (sm, md, lg) para botões
- **PropertyEditor UI** - Refatoração com novos componentes padronizados
- **Navbar — Dropdowns** - Suporte a menus dropdown com estilos e variações

---

## [0.2.0] - 2026-02-03

### ✨ Adicionado

- **Responsividade Completa** (6 fases):
  - Fase 1: Infraestrutura de grid responsivo
  - Fase 2: Layouts responsivos para Container, Stack e Box
  - Fase 3: Sidebar de navegação mobile no NavbarExporter
  - Fase 4: Grids responsivos nos MarketingExporters
  - Fase 5: Layouts responsivos para Hero e Footer
  - Fase 6: Responsividade completa para Content Grids e Forms
- **Navbar — Transparência e Desfoque em Dropdowns** - Efeito backdrop-filter aplicado a dropdowns

### 🔧 Corrigido

- Navbar: valores padrão completos aplicados em templates e factories
- Navbar: centralização do navbar flutuante com `position: fixed`

---

## [0.1.2] - 2026-02-02

### ✨ Adicionado

#### Sistema de Assets Completo
- **Upload Seguro de Imagens** — Sistema integrado com Supabase Storage
  - Autenticação JWT obrigatória
  - Isolamento multi-tenant (`tenant-{uuid}/school-{uuid}/site-{uuid}/`)
  - Suporte a imagens (JPG, PNG, WebP, GIF, SVG) e vídeos (MP4, WebM, MOV)
  - Limite de 10MB por arquivo
  - Validação de tipo MIME e tamanho

- **Backend API**
  - `POST /api/site-assets/upload` — Upload com autenticação
  - `GET /api/site-assets` — Listar assets com filtros
  - `DELETE /api/site-assets/:id` — Deletar por ID
  - `DELETE /api/site-assets/by-url/cleanup` — Deletar por URL (cleanup automático)

- **Database**
  - Bucket `site-assets` no Supabase Storage com RLS policies
  - Tabela `site_assets` para metadata tracking
  - Soft delete pattern com audit trail
  - Checksum SHA256 para integridade

- **Frontend**
  - Input `image-upload` com botão de upload autenticado
  - Propagação automática de `uploadConfig`
  - Limpeza automática de assets não utilizados ao salvar

- **Blocos com Upload** — Navbar (logo), Footer (logo), Hero (image de fundo)

### 🔧 Corrigido

- **Variações de Blocos** — Imagens persistem ao trocar variação (removido `image` dos `defaultProps` das variações do Hero)

---

## [0.1.1] - 2026-02-02

### ✨ Adicionado
- Sistema de blocos e componentes
- Editor visual drag-and-drop
- Preview responsivo (desktop, tablet, mobile)
- Variações de blocos (Hero, Navbar)
- Temas customizáveis

---

## [0.1.0] - 2026-01-XX

### ✨ Adicionado
- Versão inicial do SmartGesti Site Editor
- Editor de sites compartilhado
- Suporte para múltiplos projetos (Ensino, Portfólios)
- Blocos básicos: Hero, Text, Button, Image
- Sistema de templates
- Exportação para HTML

---

## Tipos de Mudanças

- `Adicionado` — para novas funcionalidades
- `Corrigido` — para correções de bugs
- `Alterado` — para mudanças em funcionalidades existentes
- `Depreciado` — para funcionalidades que serão removidas
- `Removido` — para funcionalidades removidas
- `Segurança` — para correções de vulnerabilidades

---

**Links de Versões:**
- [1.10.1]: https://github.com/smartgesti/site-editor/releases/tag/v1.10.1
- [1.10.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.10.0
- [1.9.1]: https://github.com/smartgesti/site-editor/releases/tag/v1.9.1
- [1.9.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.9.0
- [1.8.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.8.0
- [1.7.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.7.0
- [1.6.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.6.0
- [1.5.2]: https://github.com/smartgesti/site-editor/releases/tag/v1.5.2
- [1.5.1]: https://github.com/smartgesti/site-editor/releases/tag/v1.5.1
- [1.5.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.5.0
- [1.4.3]: https://github.com/smartgesti/site-editor/releases/tag/v1.4.3
- [1.4.2]: https://github.com/smartgesti/site-editor/releases/tag/v1.4.2
- [1.4.1]: https://github.com/smartgesti/site-editor/releases/tag/v1.4.1
- [1.4.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.4.0
- [1.3.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.3.0
- [1.2.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.2.0
- [1.1.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.1.0
- [1.0.0]: https://github.com/smartgesti/site-editor/releases/tag/v1.0.0
- [0.2.2]: https://github.com/smartgesti/site-editor/releases/tag/v0.2.2
- [0.2.1]: https://github.com/smartgesti/site-editor/releases/tag/v0.2.1
- [0.2.0]: https://github.com/smartgesti/site-editor/releases/tag/v0.2.0
- [0.1.2]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.2
- [0.1.1]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.1
- [0.1.0]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.0
