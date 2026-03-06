# Biblioteca Universal de Blocos - Fase 2: Implementacao

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Padronizar nomes dos blocos em portugues, adicionar categorias de usuario, e criar UI de biblioteca para inserir qualquer bloco em qualquer template.

**Architecture:** Fase 2A atualiza metadata nos block definitions (nomes PT, userCategory). Fase 2B cria o modal de biblioteca (substituindo o BlockPalette orfao) e integra com o LeftPanel. Abordagem incremental — cada task e independente.

**Tech Stack:** React, TypeScript, Lucide Icons, Tailwind CSS (via consumer)

**Referencia:** docs/plans/2026-03-06-biblioteca-universal-blocos.md (inventario Fase 1)

---

## Fase 2A — Padronizacao (Tasks 1-3)

### Task 1: Renomear blocos no registry — Layout, Content, Composition

**Files:**
- Modify: `src/engine/registry/blocks/layout/container.ts`
- Modify: `src/engine/registry/blocks/layout/stack.ts`
- Modify: `src/engine/registry/blocks/layout/grid.ts`
- Modify: `src/engine/registry/blocks/layout/box.ts`
- Modify: `src/engine/registry/blocks/layout/spacer.ts`
- Modify: `src/engine/registry/blocks/content/heading.ts`
- Modify: `src/engine/registry/blocks/content/text.ts`
- Modify: `src/engine/registry/blocks/content/image.ts`
- Modify: `src/engine/registry/blocks/content/button.ts`
- Modify: `src/engine/registry/blocks/content/link.ts`
- Modify: `src/engine/registry/blocks/content/divider.ts`
- Modify: `src/engine/registry/blocks/content/badge.ts`
- Modify: `src/engine/registry/blocks/content/icon.ts`
- Modify: `src/engine/registry/blocks/content/avatar.ts`
- Modify: `src/engine/registry/blocks/content/video.ts`
- Modify: `src/engine/registry/blocks/content/socialLinks.ts`
- Modify: `src/engine/registry/blocks/composition/section.ts`
- Modify: `src/engine/registry/blocks/composition/card.ts`

**Mudancas:** Atualizar `name` e `description` em cada block definition:

```
container: name="Container" → "Contêiner", description → "Área com largura máxima e margens"
stack: name="Stack" → "Pilha Flexível", description → "Empilha elementos na vertical ou horizontal"
grid: name="Grid" → "Grade", description → "Layout em colunas responsivo"
box: name="Box" → "Caixa", description → "Área genérica com estilos customizáveis"
spacer: name="Spacer" → "Espaçador", description → "Espaço vazio entre elementos"
heading: name="Heading" → "Título", description → "Título de H1 a H6"
text: name="Text" → "Texto", description → "Parágrafo de texto"
image: name="Image" → "Imagem", description (manter "Imagem")
button: name="Button" → "Botão", description (manter "Botão")
link: name="Link" → "Link", description → "Link de texto"
divider: name="Divider" → "Divisor", description → "Linha horizontal separadora"
badge: name="Badge" → "Etiqueta", description → "Tag colorida com variantes"
icon: name="Icon" → "Ícone", description → "Ícone SVG"
avatar: name="Avatar" → "Avatar", description → "Foto circular com fallback por iniciais"
video: name="Video" → "Vídeo", description → "Embed de vídeo"
socialLinks: name="Social Links" → "Redes Sociais", description → "Links para redes sociais com ícones"
section: name="Section" → "Seção", description → "Container de seção com fundo"
card: name="Card" → "Cartão", description → "Card com cabeçalho, conteúdo e rodapé"
```

**Validacao:**
```bash
npm run build && npm run lint
```

---

### Task 2: Renomear blocos no registry — Sections e Forms

**Files:**
- Modify: `src/engine/registry/blocks/sections/hero.ts`
- Modify: `src/engine/registry/blocks/sections/navbar.ts`
- Modify: `src/engine/registry/blocks/sections/footer.ts`
- Modify: `src/engine/registry/blocks/sections/featureGrid.ts`
- Modify: `src/engine/registry/blocks/sections/feature.ts`
- Modify: `src/engine/registry/blocks/sections/pricing.ts`
- Modify: `src/engine/registry/blocks/sections/pricingCard.ts`
- Modify: `src/engine/registry/blocks/sections/testimonialGrid.ts`
- Modify: `src/engine/registry/blocks/sections/testimonial.ts`
- Modify: `src/engine/registry/blocks/sections/faq.ts`
- Modify: `src/engine/registry/blocks/sections/faqItem.ts`
- Modify: `src/engine/registry/blocks/sections/stats.ts`
- Modify: `src/engine/registry/blocks/sections/statItem.ts`
- Modify: `src/engine/registry/blocks/sections/cta.ts`
- Modify: `src/engine/registry/blocks/sections/logoCloud.ts`
- Modify: `src/engine/registry/blocks/sections/countdown.ts`
- Modify: `src/engine/registry/blocks/sections/carousel.ts`
- Modify: `src/engine/registry/blocks/sections/teamGrid.ts`
- Modify: `src/engine/registry/blocks/sections/teamCard.ts`
- Modify: `src/engine/registry/blocks/sections/productShowcase.ts`
- Modify: `src/engine/registry/blocks/sections/aboutSection.ts`
- Modify: `src/engine/registry/blocks/sections/contactSection.ts`
- Modify: `src/engine/registry/blocks/sections/blogCard.ts`
- Modify: `src/engine/registry/blocks/sections/blogCardGrid.ts`
- Modify: `src/engine/registry/blocks/sections/courseCardGrid.ts`
- Modify: `src/engine/registry/blocks/sections/categoryCardGrid.ts`
- Modify: `src/engine/registry/blocks/sections/blogPostCard.ts`
- Modify: `src/engine/registry/blocks/sections/blogPostGrid.ts`
- Modify: `src/engine/registry/blocks/sections/blogPostDetail.ts`
- Modify: `src/engine/registry/blocks/sections/blogCategoryFilter.ts`
- Modify: `src/engine/registry/blocks/sections/blogSearchBar.ts`
- Modify: `src/engine/registry/blocks/sections/blogRecentPosts.ts`
- Modify: `src/engine/registry/blocks/sections/blogTagCloud.ts`
- Modify: `src/engine/registry/blocks/forms/form.ts`
- Modify: `src/engine/registry/blocks/forms/input.ts`
- Modify: `src/engine/registry/blocks/forms/textarea.ts`
- Modify: `src/engine/registry/blocks/forms/select.ts`

**Mudancas:**

```
hero: name="Hero" → "Banner Principal", description → "Seção de destaque com título, imagem e botões"
navbar: name="Navbar" → "Barra de Navegação", description → "Menu principal do site"
footer: name="Footer" → "Rodapé", description → "Rodapé do site com links e redes sociais"
featureGrid: name="Feature Grid" → "Grade de Recursos", description → "Grid com ícones e descrições de recursos"
feature: name="Feature" → "Recurso", description → "Card individual de recurso"
pricing: name="Pricing" → "Planos e Preços", description → "Tabela de preços com planos"
pricingCard: name="Pricing Card" → "Cartão de Preço", description → "Card individual de plano"
testimonialGrid: name="Testimonial Grid" → "Grade de Depoimentos", description → "Grid com depoimentos de clientes"
testimonial: name="Testimonial" → "Depoimento", description → "Card individual de depoimento"
faq: name="FAQ" → "Perguntas Frequentes", description → "Seção de perguntas e respostas"
faqItem: name="FAQ Item" → "Pergunta", description → "Item individual do FAQ"
stats: name="Stats" → "Estatísticas", description → "Seção com números e indicadores"
statItem: name="Stat Item" → "Indicador", description → "Item individual de estatística"
cta: name="CTA" → "Chamada para Ação", description → "Seção com botão de ação destacado"
logoCloud: name="Logo Cloud" → "Logos de Parceiros", description → "Grid de logos de empresas"
countdown: name="Countdown" → "Contagem Regressiva", description → "Contador para eventos e prazos"
carousel: name="Carousel" → "Carrossel de Slides", description → "Slider com slides de conteúdo"
teamGrid: name="Team Grid" → "Equipe", description → "Grid com membros da equipe"
teamCard: name="Team Card" → "Membro da Equipe", description → "Card individual de membro"
productShowcase: name="Product Showcase" → "Vitrine de Produtos", description → "Produtos com layout alternado imagem/texto"
aboutSection: name="About Section" → "Sobre Nós", description → "Seção institucional com imagem e conquistas"
contactSection: name="Contact Section" → "Contato", description → "Formulário de contato com informações"
blogCard: name="Blog Card" → "Card de Notícia", description → "Card individual de post/notícia"
blogCardGrid: name="Blog Card Grid" → "Grade de Notícias", description → "Grid de cards de blog/notícias"
courseCardGrid: name="Course Card Grid" → "Grade de Cursos", description → "Grid de cards de curso com preço e avaliação"
categoryCardGrid: name="Category Card Grid" → "Grade de Categorias", description → "Grid de categorias com imagem de fundo"
blogPostCard: name="Blog Post Card" → "Card de Post", description → "Card de post do blog (dinâmico)"
blogPostGrid: name="Blog Post Grid" → "Grade de Posts", description → "Grid de posts com dados dinâmicos"
blogPostDetail: name="Blog Post Detail" → "Conteúdo do Post", description → "Página completa de um post"
blogCategoryFilter: name="Blog Category Filter" → "Filtro de Categorias", description → "Sidebar com filtro por categoria"
blogSearchBar: name="Blog Search Bar" → "Busca do Blog", description → "Barra de busca para posts"
blogRecentPosts: (ja em PT "Posts Recentes") — manter
blogTagCloud: (ja em PT "Nuvem de Tags") — manter
form: name="Form" → "Formulário", description → "Container de formulário com envio"
input: name="Input" → "Campo de Texto", description → "Campo de entrada"
textarea: name="Textarea" → "Campo de Texto Longo", description → "Área de texto para mensagens"
formSelect: name="Select" → "Menu Suspenso", description → "Dropdown com opções"
```

**NOTA:** imageGallery ja esta em PT ("Galeria de Imagens") — nao mexer.

**Validacao:**
```bash
npm run build && npm run lint
```

---

### Task 3: Adicionar `userCategory` ao BlockDefinition e popular

**Files:**
- Modify: `src/engine/registry/types.ts:79-95` — Adicionar campo `userCategory`
- Modify: Todos os block definition files — Adicionar `userCategory`

**Step 1: Atualizar interface BlockDefinition**

Em `src/engine/registry/types.ts`, adicionar na interface `BlockDefinition`:

```typescript
export interface BlockDefinition<T extends BlockType = BlockType> {
  type: T;
  name: string;
  description: string;
  icon?: string;
  category: "layout" | "content" | "composition" | "sections" | "forms";
  /** Categoria visivel ao usuario na biblioteca de blocos */
  userCategory?: string;
  /** Bloco filho (nao aparece na biblioteca, apenas dentro de blocos compostos) */
  isChildBlock?: boolean;
  // ... resto igual
}
```

**Step 2: Popular `userCategory` e `isChildBlock` em cada bloco**

Mapeamento completo:

| userCategory | Blocos |
|-------------|--------|
| "Estrutura" | container, stack, grid, box, spacer, section, card |
| "Texto e Mídia" | heading, text, image, button, link, divider, badge, icon, avatar, video, socialLinks |
| "Formulários" | form, input, textarea, formSelect |
| "Banner e Navegação" | navbar, hero, footer |
| "Marketing" | featureGrid, cta, logoCloud, countdown, pricing |
| "Prova Social" | testimonialGrid, stats |
| "Galeria e Mídia" | imageGallery, carousel |
| "Equipe" | teamGrid |
| "Institucional" | productShowcase, aboutSection, contactSection |
| "Blog e Notícias" | blogCard, blogCardGrid |
| "Blog (Plugin)" | blogPostCard, blogPostGrid, blogPostDetail, blogCategoryFilter, blogSearchBar, blogRecentPosts, blogTagCloud |
| "Educação" | courseCardGrid, categoryCardGrid |

Blocos filhos (`isChildBlock: true`): feature, pricingCard, testimonial, faqItem, statItem, teamCard, blogCard (quando usado dentro de blogCardGrid)

**NOTA:** `feature` e `pricingCard` etc. recebem `isChildBlock: true` mas TAMBEM recebem `userCategory` (para uso interno). Eles simplesmente nao aparecem na biblioteca.

**Validacao:**
```bash
npm run build && npm run lint
```

---

## Fase 2B — UI e Logica (Tasks 4-7)

### Task 4: Refatorar BlockPalette para usar userCategory

**Files:**
- Modify: `src/editor/BlockPalette.tsx` — Reescrever para usar `userCategory`

**Context:** BlockPalette existe mas esta orfao (nao usado). Vamos refatora-lo para ser a base da biblioteca.

**Mudancas:**

1. Agrupar blocos por `userCategory` ao inves de `category`
2. Filtrar blocos com `isChildBlock: true`
3. Filtrar blocos de plugin que requerem plugin ativo (verificar `pluginId`)
4. Adicionar campo de busca (filtro por nome/descricao)
5. Adicionar restricoes: navbar e footer so aparecem se nao existem na pagina

```typescript
// Logica de filtragem
const availableBlocks = useMemo(() => {
  return componentRegistry.getAll().filter(def => {
    // Esconder blocos filhos
    if (def.isChildBlock) return false;
    // Esconder blocos de plugin nao ativo
    if (def.pluginId && !activePlugins?.includes(def.pluginId)) return false;
    return true;
  });
}, [activePlugins]);

// Agrupar por userCategory
const blocksByUserCategory = useMemo(() => {
  const groups: Record<string, BlockDefinition[]> = {};
  for (const def of availableBlocks) {
    const cat = def.userCategory || "Outros";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(def);
  }
  return groups;
}, [availableBlocks]);
```

**Props adicionais necessarias:**
```typescript
interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void;
  selectedParentBlockId?: string | null;
  activePlugins?: string[];        // plugins ativos (para filtrar blocos de plugin)
  existingBlockTypes?: BlockType[]; // blocos ja na pagina (para restricoes navbar/footer)
}
```

**Validacao:**
```bash
npm run build && npm run lint
```

---

### Task 5: Integrar BlockPalette no LeftPanel

**Files:**
- Modify: `src/editor/components/LeftPanel.tsx` — Adicionar tab/toggle para paleta
- Modify: `src/editor/LandingPageEditor.tsx` — Passar props necessarias

**Context:** O LeftPanel hoje mostra apenas o BlockSelector (arvore de blocos). Precisamos adicionar acesso a BlockPalette.

**Mudancas no LeftPanel:**

1. Adicionar toggle "Blocos | + Adicionar" no header
2. Quando em modo "Adicionar", mostrar BlockPalette
3. Quando em modo "Blocos", mostrar BlockSelector (atual)

```typescript
interface LeftPanelProps {
  currentPage: any;
  selectedBlockId: string | null;
  isPaletteSelected: boolean;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  // Novos:
  onAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void;
  activePlugins?: string[];
}
```

**Layout:**
```
[Paletas de Cores]  (botao existente)
[Blocos | + Adicionar]  (toggle novo)
[BlockSelector OU BlockPalette]  (conteudo dinamico)
```

**Mudancas no LandingPageEditor:**
- Passar `onAddBlock` e `activePlugins` para LeftPanel
- `onAddBlock` ja existe como `handleAddBlock` no editor

**Validacao:**
```bash
npm run build && npm run lint
```

---

### Task 6: Restricoes de insercao (navbar/footer max 1)

**Files:**
- Modify: `src/editor/BlockPalette.tsx` — Desabilitar navbar/footer se ja existem

**Context:** Navbar e footer devem ter no maximo 1 por pagina.

**Mudancas:**

1. Receber `existingBlockTypes` como prop
2. No render de cada botao, verificar se o tipo ja existe e tem restricao
3. Se ja existe, mostrar botao desabilitado com tooltip "Já existe na página"

```typescript
const UNIQUE_BLOCK_TYPES = new Set(['navbar', 'footer']);

// No render:
const isDisabled = UNIQUE_BLOCK_TYPES.has(def.type) &&
  existingBlockTypes?.includes(def.type);
```

**Validacao:**
```bash
npm run build && npm run lint
```

---

### Task 7: Build final e validacao

**Files:** Nenhum novo

**Step 1: Build completo**
```bash
npm run build && npm run lint
```

**Step 2: Verificacao manual (npm run demo)**
1. Abrir editor
2. Verificar que nomes dos blocos aparecem em PT no BlockSelector (arvore)
3. Verificar que nomes aparecem em PT no painel de propriedades (header)
4. Clicar em "+ Adicionar" no LeftPanel
5. Verificar categorias: Estrutura, Texto e Midia, Marketing, etc.
6. Verificar campo de busca funciona
7. Verificar que blocos filhos (feature, testimonial, etc.) NAO aparecem
8. Verificar que blocos de plugin Blog NAO aparecem se plugin desativado
9. Adicionar um bloco Gallery — deve funcionar
10. Verificar que navbar nao pode ser adicionada se ja existe
11. Voltar para modo "Blocos" — arvore normal

---

## Resumo de Mudancas

| Fase | Task | Arquivos | Linhas (~) |
|------|------|----------|-----------|
| 2A | 1: Nomes PT (layout/content/comp) | 18 files | ~36 linhas (name+desc) |
| 2A | 2: Nomes PT (sections/forms) | 37 files | ~74 linhas |
| 2A | 3: userCategory + isChildBlock | types.ts + 53 files | ~60 linhas |
| 2B | 4: Refatorar BlockPalette | 1 file | ~80 linhas |
| 2B | 5: Integrar no LeftPanel | 2 files | ~40 linhas |
| 2B | 6: Restricoes navbar/footer | 1 file | ~15 linhas |
| 2B | 7: Validacao | 0 files | - |

**Total: ~305 linhas em ~55 arquivos** (maioria sao edits de 2 linhas: name + description)
