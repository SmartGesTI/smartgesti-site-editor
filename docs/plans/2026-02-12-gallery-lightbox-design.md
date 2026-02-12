# Image Gallery com Lightbox - Design Document

**Data:** 2026-02-12
**Autor:** Dev Editor (Claude)
**Status:** Aprovado
**Versão:** 1.0 (MVP)

---

## 📋 Sumário Executivo

Implementação de um bloco **Image Gallery** profissional com **Lightbox** completo para o SmartGesti Site Editor. O bloco seguirá o padrão estabelecido (Schema → Definition → Renderer → Exporter) e terá 5 variações de layout, sendo o **Grid Clássico** implementado no MVP.

**Principais características:**
- ✅ Gallery Grid responsivo (4→3→2→1 colunas)
- ✅ Lightbox fullscreen com zoom, navegação e touch gestures
- ✅ Gerenciamento avançado de imagens (upload/URL + metadata)
- ✅ Animações e hover effects customizáveis
- ✅ Tema adaptável (dark/light/theme/adaptive)
- ✅ Performance otimizada (lazy loading, warnings)
- ✅ Acessibilidade completa (ARIA, keyboard, screen readers)
- ✅ SEO otimizado (Schema.org, alt obrigatório)

---

## 🎯 Objetivos e Requisitos

### Objetivo Principal
Criar uma galeria de imagens de **uso geral** com lightbox profissional que sirva para múltiplos casos de uso (portfolio, institucional, produtos, etc.) através de variações especializadas.

### Casos de Uso
1. **Portfolio/Trabalhos** - Mostrar projetos, fotos de produtos
2. **Galeria de Arte** - Exibir arte, ilustrações, fotografia
3. **Institucional** - Fotos da empresa, equipe, instalações, eventos
4. **Showcase de Produtos** - Galeria de produtos com detalhes
5. **Uso Geral** - Versátil para qualquer tipo de imagem

### Requisitos Funcionais

**MVP (v1.0):**
- Grid clássico 2/3/4 colunas
- Lightbox com zoom, navegação, thumbnails, caption, contador
- Upload ou URL de imagens
- Modal avançado de gerenciamento
- Lazy loading
- Responsive adaptativo
- Animações e hover effects customizáveis
- Tema adaptável
- Keyboard + touch navigation
- ARIA completo

**Roadmap Futuro:**
- v1.1: Masonry layout + Download button
- v1.2: Featured layout + Social share
- v1.3: Carousel layout + Autoplay
- v1.4: Alternating layout + Dual images
- v2.0: Lightbox reutilizável (Abordagem 2)
- v3.0: Plugin system (Abordagem 3)

---

## 🏗️ Arquitetura

### Abordagem Escolhida
**Abordagem 1: Bloco Único com Variações** (padrão Hero/Navbar)

**Por quê?**
- ✅ Comprovada (padrão Hero/Navbar funciona perfeitamente)
- ✅ Rápida (MVP em 1-2 dias)
- ✅ Documentada (CREATING-BLOCKS.md completo)
- ✅ Familiar (usuários já entendem variações)
- ✅ Extensível (fácil adicionar features depois)

### Estrutura de Arquivos

```
src/
├── engine/
│   ├── schema/
│   │   └── siteDocument.ts
│   │       ↳ ImageGalleryBlock interface
│   │       ↳ GalleryImage interface
│   │       ↳ LightboxConfig interface
│   │       ↳ Enums (GalleryEnterAnimation, GalleryHoverEffect)
│   │
│   ├── registry/blocks/sections/
│   │   └── imageGallery.ts
│   │       ↳ BlockDefinition<ImageGalleryBlock>
│   │       ↳ defaultProps (25+ props)
│   │       ↳ inspectorMeta (8 grupos)
│   │
│   ├── presets/
│   │   └── galleryVariations.ts
│   │       ↳ gallery-grid (MVP)
│   │       ↳ gallery-masonry (v1.1)
│   │       ↳ gallery-featured (v1.2)
│   │       ↳ gallery-carousel (v1.3)
│   │       ↳ gallery-alternating (v1.4)
│   │
│   ├── render/renderers/sections/
│   │   ├── ImageGalleryRenderer.tsx
│   │   │   ↳ Grid layout (responsive)
│   │   │   ↳ LazyImage component (Intersection Observer)
│   │   │   ↳ Hover effects
│   │   │   ↳ Click handler
│   │   │
│   │   └── Lightbox.tsx
│   │       ↳ Fullscreen overlay (Portal)
│   │       ↳ Image display + zoom
│   │       ↳ Navigation (prev/next)
│   │       ↳ Touch gestures
│   │       ↳ Keyboard shortcuts
│   │       ↳ Thumbnails
│   │       ↳ Adaptive theme
│   │
│   └── export/exporters/sections/
│       └── ImageGalleryExporter.ts
│           ↳ HTML structure
│           ↳ Inline CSS (responsive)
│           ↳ Vanilla JS lightbox (zero deps)
│           ↳ Touch/keyboard handlers
│
└── editor/PropertyEditor/inputs/
    └── GalleryImagesInput.tsx
        ↳ Advanced modal
        ↳ Upload/URL
        ↳ Drag-to-reorder
        ↳ Preview + metadata
        ↳ Título, descrição, alt, tags
```

### Princípios Arquiteturais
1. **Dual Rendering System** - React Renderer + HTML Exporter
2. **CSS Variables** - Integração com tema (`--sg-primary`, etc.)
3. **Lazy Loading** - Intersection Observer API
4. **Zero Dependencies** - Vanilla JS no export
5. **Progressive Enhancement** - Funciona sem JS (imagens visíveis)
6. **Mobile-First** - Touch gestures prioritários

---

## 📐 Schema TypeScript

### Interfaces Principais

```typescript
/**
 * Imagem individual da galeria
 */
export interface GalleryImage {
  id: string;                    // UUID
  src: string;                   // URL (upload ou externa)
  thumbnail?: string;            // v2 - Dual images
  alt: string;                   // Obrigatório (a11y)
  title?: string;                // Título opcional
  description?: string;          // Legenda opcional
  tags?: string[];               // Tags (filtro futuro)
  width?: number;                // Metadata
  height?: number;               // Metadata
  aspectRatio?: number;          // Calculado auto
}

/**
 * Configuração do Lightbox
 */
export interface LightboxConfig {
  // Tema
  mode: "dark" | "light" | "theme" | "adaptive";

  // Navegação
  showArrows: boolean;
  showThumbnails: boolean;
  showCounter: boolean;
  showCaption: boolean;

  // Funcionalidades
  enableZoom: boolean;
  enableDownload: boolean;       // v1.1
  enableAutoplay: boolean;       // v1.2
  autoplayInterval: number;

  // UX
  closeOnBackdropClick: boolean;
  closeOnEsc: boolean;
  enableKeyboard: boolean;
  enableTouchGestures: boolean;

  // Animação
  transitionDuration: number;    // ms
}

/**
 * Bloco Image Gallery
 */
export interface ImageGalleryBlock extends BlockBase {
  type: "imageGallery";
  props: {
    // Conteúdo
    title?: string;
    subtitle?: string;
    images: GalleryImage[];

    // Layout
    variation: "gallery-grid" | "gallery-masonry" | "gallery-featured"
             | "gallery-carousel" | "gallery-alternating";
    columns: 2 | 3 | 4;
    gap: number;                 // rem
    aspectRatio?: "1/1" | "4/3" | "16/9" | "3/2" | "auto";

    // Aparência (Híbrido)
    bg?: string;
    imageBorderRadius: number;   // px
    imageShadow: "none" | "sm" | "md" | "lg" | "xl";

    // Animações
    enterAnimation: GalleryEnterAnimation;
    hoverEffect: GalleryHoverEffect;
    hoverIntensity: number;      // 0-100

    // Lightbox
    lightbox: LightboxConfig;

    // Performance
    lazyLoad: boolean;
    showWarningAt: number;       // Default: 50
  };
}
```

### Enums

```typescript
export type GalleryEnterAnimation =
  | "fade-scale"      // Fade + zoom (padrão)
  | "stagger"         // Cascata
  | "slide-up"        // Desliza de baixo
  | "none";

export type GalleryHoverEffect =
  | "zoom-overlay"    // Zoom + overlay + ícone (padrão)
  | "glow"            // Brilho
  | "scale"           // Apenas aumenta
  | "caption-reveal"  // Mostra legenda
  | "none";
```

---

## 🎨 Block Definition

### defaultProps (MVP - Grid)

```typescript
defaultProps: {
  // Conteúdo
  title: "Nossa Galeria",
  subtitle: "Confira nossas imagens",
  images: [
    // 4 imagens placeholder (placehold.co)
  ],

  // Layout
  variation: "gallery-grid",
  columns: 4,
  gap: 1,
  aspectRatio: "auto",

  // Aparência
  imageBorderRadius: 8,
  imageShadow: "md",

  // Animações
  enterAnimation: "fade-scale",
  hoverEffect: "zoom-overlay",
  hoverIntensity: 50,

  // Lightbox
  lightbox: {
    mode: "adaptive",
    showArrows: true,
    showThumbnails: true,
    showCounter: true,
    showCaption: true,
    enableZoom: true,
    enableDownload: false,
    enableAutoplay: false,
    autoplayInterval: 5,
    closeOnBackdropClick: true,
    closeOnEsc: true,
    enableKeyboard: true,
    enableTouchGestures: true,
    transitionDuration: 300,
  },

  // Performance
  lazyLoad: true,
  showWarningAt: 50,
}
```

### inspectorMeta (8 Grupos)

**Grupos:**
1. Conteúdo (title, subtitle, images)
2. Layout (variation, columns, gap, aspectRatio)
3. Aparência (bg, borderRadius, shadow)
4. Animações (enterAnimation, hoverEffect, hoverIntensity)
5. Lightbox - Tema (mode)
6. Lightbox - Navegação (arrows, thumbnails, counter, caption)
7. Lightbox - Funcionalidades (zoom, backdrop, ESC, keyboard, touch)
8. Performance (lazyLoad, showWarningAt)

**Novo Input Type:**
- `"gallery-images"` → Abre modal avançado de gestão (GalleryImagesInput)

---

## 🧩 Componentes React

### ImageGalleryRenderer

**Responsabilidades:**
- Renderizar header (título + subtítulo)
- Renderizar grid responsivo (CSS Grid)
- Gerenciar estado do lightbox (aberto/fechado, índice atual)
- Lazy loading via Intersection Observer
- Hover effects via CSS classes
- Click handler → abre lightbox

**Hooks principais:**
- `useState` - lightboxOpen, currentImageIndex
- `useRef` - gridRef
- `useMemo` - gridStyles (CSS-in-JS)
- `useCallback` - handleImageClick, handleCloseLightbox, handleNavigate

**Sub-componentes:**
- `LazyImage` - Imagem individual com lazy loading + hover effects
- `PerformanceWarning` - Alerta se > 50 imagens

### Lightbox

**Responsabilidades:**
- Renderizar overlay fullscreen (Portal)
- Display da imagem atual
- Navegação prev/next
- Zoom in/out/reset
- Pan quando zoomed
- Touch gestures (swipe, pinch, double-tap)
- Keyboard navigation
- Thumbnails navegáveis
- Caption dinâmica
- Tema adaptável (detecta brightness)

**Hooks principais:**
- `useState` - zoomLevel, panOffset, isDragging
- `useRef` - imageRef, containerRef
- `useMemo` - theme (adaptive mode)
- `useEffect` - keyboard listeners
- `useLayoutEffect` - FLIP animation (smooth expand)
- `useTouchGestures` - Custom hook para gestures

**Features especiais:**
- **FLIP Animation** - Expande do thumbnail até fullscreen
- **Adaptive Theme** - Detecta brightness da imagem via canvas
- **Pinch-Zoom** - Detecta multi-touch para zoom
- **Swipe Navigation** - Touch gesture para prev/next

---

## 📤 HTML Exporter

### Desafio
Replicar TODA a funcionalidade do React Renderer usando apenas **Vanilla JS** (zero dependências).

### Estrutura do Export

**CSS (~200 linhas):**
- Grid responsivo (media queries inline)
- Animações keyframes (fade-scale, stagger, slide-up)
- Hover effects (zoom-overlay, glow, scale, caption-reveal)
- Lightbox completo (overlay, arrows, thumbnails, caption, zoom controls)
- Responsive mobile (<768px)

**HTML (~150 linhas):**
- Section com grid de imagens
- Cada imagem com data-attributes (index, src, alt, title, desc)
- Lightbox structure (header, arrows, image, caption, thumbnails, zoom controls)
- Performance warning (se > 50 imagens)

**JavaScript (~500 linhas):**
- IIFE auto-executável (sem poluir global scope)
- Funções: openLightbox, closeLightbox, updateLightbox, navigate, zoom
- Event listeners:
  - Gallery items click
  - Close button + backdrop click
  - Arrow buttons
  - Zoom buttons
  - Keyboard (ESC, Arrows, +/-/0)
  - Touch gestures (swipe detection)
- Sem dependências externas (Vanilla JS puro)

### Features Implementadas no Export
✅ Lazy loading (loading="lazy" nativo)
✅ Lightbox fullscreen
✅ Zoom (CSS transform scale)
✅ Navegação prev/next
✅ Thumbnails
✅ Caption
✅ Contador
✅ Keyboard (ESC, Arrows, +/-/0)
✅ Touch gestures (swipe)
✅ Adaptive theme (via classe CSS)
✅ ARIA completo

---

## ✨ Features Detalhadas

### MVP (v1.0)

**Layout:**
- Grid clássico 2/3/4 colunas
- Responsive adaptativo (4→3→2→1)
- Gap customizável (0.5-3rem)
- Aspect ratio configurável
- Border radius (0-32px)
- Shadows (5 níveis)

**Animações:**
- Entrada: Fade+Scale / Stagger / Slide-up / None
- Hover: Zoom+Overlay / Glow / Scale / Caption / None
- Intensidade customizável (0-100%)

**Lightbox - Navegação:**
- Fullscreen overlay
- Setas prev/next
- Thumbnails navegáveis
- Contador "3 de 12"
- Caption (título + descrição)

**Lightbox - Funcionalidades:**
- Zoom (1x-5x) + pan
- Double-tap para zoom
- Pinch-to-zoom
- Swipe para navegar
- Smooth expand animation

**Lightbox - Tema:**
- Adaptável (detecta brightness)
- Dark mode
- Light mode
- Segue tema do site

**Lightbox - Interação:**
- Fechar: ESC / X / Backdrop click
- Teclado: Arrows / +/- / 0
- Touch: Swipe / Pinch / Double-tap

**Gerenciamento:**
- Modal avançado
- Upload (Supabase) OU URL
- Drag-to-reorder
- Preview + metadados
- Título, descrição, alt (obrigatório), tags

**Performance:**
- Lazy loading (Intersection Observer)
- Warning aos 50+ imagens
- CSS transforms (GPU)
- RequestAnimationFrame

**Acessibilidade:**
- ARIA roles completo
- Live regions
- Keyboard navigation full
- Alt text obrigatório
- Focus management
- High contrast support

**SEO:**
- Schema.org ImageGallery
- Alt text validado
- Semantic HTML

### Roadmap Futuro

**v1.1 - Masonry:**
- Layout tipo Pinterest
- Botão Download no lightbox
- Crop/resize no modal

**v1.2 - Featured:**
- 1 grande + grid de pequenas
- Social share buttons

**v1.3 - Carousel:**
- Carrossel horizontal
- Autoplay slideshow

**v1.4 - Alternating:**
- Alterna grande-pequeno
- Dual images (thumb + full)

**v2.0 - Lightbox Reutilizável:**
- Refactor para Abordagem 2
- Usado em Hero, ProductShowcase, etc.

**v3.0 - Plugin System:**
- Gallery como plugin
- Backend integration
- Páginas dinâmicas /gallery/album-1
- Integração Unsplash/Pexels

---

## 🧪 Testing & Quality

### Checklist de Testes

**Funcionalidade:**
- [ ] Gallery grid renderiza
- [ ] Lazy loading funciona
- [ ] Hover effects aplicam
- [ ] Enter animations funcionam
- [ ] Click abre lightbox
- [ ] Navegação prev/next
- [ ] Zoom in/out/reset
- [ ] Fechar (ESC/X/backdrop)

**Responsividade:**
- [ ] Desktop (1280px+): 4 cols
- [ ] Tablet (768-1024px): 3 cols
- [ ] Mobile (640-768px): 2 cols
- [ ] Mobile (<640px): 1 col
- [ ] Touch gestures funcionam

**Teclado:**
- [ ] ESC fecha
- [ ] Arrows navegam
- [ ] +/-/0 para zoom
- [ ] Tab navega elementos

**Acessibilidade:**
- [ ] Screen reader funciona
- [ ] ARIA roles corretos
- [ ] Alt text obrigatório
- [ ] Focus management
- [ ] Live regions anunciam

**Performance:**
- [ ] Lazy loading só visíveis
- [ ] Warning aos 50+
- [ ] CSS transforms (GPU)
- [ ] FCP <2s, TTI <3s

**Export:**
- [ ] HTML funciona standalone
- [ ] Vanilla JS funciona
- [ ] CSS inline aplica
- [ ] Lightbox funciona no export

**Browsers:**
- [ ] Chrome (últimas 2)
- [ ] Firefox (últimas 2)
- [ ] Safari (últimas 2)
- [ ] Edge (últimas 2)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Android

### Testes Manuais

1. `npm run demo`
2. Adicionar bloco ImageGallery
3. Upload 12 imagens
4. Configurar metadados
5. Testar todas as props
6. Testar lightbox (4 modos)
7. Exportar e testar HTML
8. Mobile responsive
9. Keyboard navigation
10. Screen reader (NVDA/JAWS/VoiceOver)
11. Lighthouse (score > 90)
12. WebPageTest

---

## 📊 Estimativas

### Tamanho do Código

| Componente | Linhas | Complexidade |
|------------|--------|--------------|
| Schema | ~150 | Baixa |
| Definition | ~300 | Média |
| Renderer | ~400 | Alta |
| Lightbox | ~300 | Muito Alta |
| Exporter | ~500 | Muito Alta |
| GalleryImagesInput | ~400 | Alta |
| **TOTAL** | **~2.050** | **Alta** |

### Tempo Estimado (MVP)

| Fase | Tempo | Descrição |
|------|-------|-----------|
| Schema + Definition | 2-3h | Interfaces + defaultProps + inspectorMeta |
| Renderer (Grid) | 3-4h | Grid responsivo + LazyImage + hover effects |
| Lightbox (React) | 6-8h | Overlay + zoom + gestures + keyboard + theme |
| Exporter | 6-8h | Vanilla JS + CSS inline + touch handlers |
| GalleryImagesInput | 4-5h | Modal avançado + upload + drag-to-reorder |
| Testing & QA | 4-6h | Testes manuais + fixes + responsividade |
| **TOTAL** | **25-34h** | **~3-4 dias de trabalho** |

---

## 🚀 Próximos Passos

1. ✅ **Design aprovado** - Documento escrito
2. 🔄 **Plano de implementação** - Invocar `writing-plans` skill
3. ⏳ **Implementação MVP** - Seguir plano passo-a-passo
4. ⏳ **Testing & QA** - Checklist completo
5. ⏳ **Commit & Publish** - `npm run version:minor` (v1.10.0)
6. ⏳ **Documentação** - Atualizar CREATING-BLOCKS.md e TEMPLATE-MANUAL.md
7. ⏳ **Roadmap v1.1** - Masonry layout

---

## 📚 Referências

- [CREATING-BLOCKS.md](../CREATING-BLOCKS.md) - Guia de criação de blocos
- [TEMPLATE-MANUAL.md](../TEMPLATE-MANUAL.md) - Manual de templates
- [Hero Block](../../src/engine/registry/blocks/sections/hero.ts) - Exemplo de bloco com variações
- [Image Grid System](../../src/engine/shared/imageGrid/) - Sistema existente de image grid
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Lazy loading
- [FLIP Technique](https://aerotwist.com/blog/flip-your-animations/) - Smooth expand animation
- [Schema.org ImageGallery](https://schema.org/ImageGallery) - SEO markup

---

**Fim do Design Document**

*Este documento será usado como base para o plano de implementação detalhado.*
