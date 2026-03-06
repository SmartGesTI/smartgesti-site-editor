# Gallery Layouts (Masonry, Featured, Carousel, Alternating) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar os 4 layouts de galeria que faltam no bloco ImageGallery: Masonry, Destaque (Featured), Carrossel e Alternado. Cada layout precisa de dual rendering (React + HTML export).

**Architecture:** O bloco ImageGallery ja existe com variacao `gallery-grid` funcional. O renderer (`ImageGalleryRenderer.tsx`) e o exporter (`ImageGalleryExporter.ts`) ignoram a prop `variation` e sempre renderizam como grid. A estrategia e adicionar um switch por `variation` no componente principal, delegando para sub-componentes/funcoes especificos por layout. O Lightbox existente sera reutilizado por todos os layouts.

**Tech Stack:** React 18, TypeScript, CSS Grid, CSS Columns (masonry), CSS Scroll Snap (carousel), Vanilla JS (export)

**Workflow:** Implement -> `npm run build` -> `npm run lint` -> User tests -> Commit

---

## Task 1: Masonry Layout - React Renderer

**Objective:** Adicionar layout Masonry (CSS columns) ao ImageGalleryRenderer

**Files to modify:**
- `src/engine/render/renderers/sections/ImageGalleryRenderer.tsx`

**Implementation:**

O renderer atual tem um componente `ImageGalleryComponent` que sempre renderiza um CSS Grid. Precisamos:

1. Extrair o grid atual para uma funcao `renderGridLayout`
2. Criar funcao `renderMasonryLayout` que usa CSS `columns` (nao CSS Grid)
3. Adicionar switch no JSX principal baseado em `props.variation`

**Masonry Layout:**
- Usa `column-count: N` e `column-gap` em vez de CSS Grid
- Cada item usa `break-inside: avoid` para nao quebrar entre colunas
- Mantém o mesmo `LazyImage` component
- Responsivo: 3 cols desktop -> 2 tablet -> 1 mobile

**Codigo a adicionar no ImageGalleryComponent (apos o header e warning, substituir o bloco "Gallery Grid"):**

```tsx
{/* Gallery Layout - switch by variation */}
{images.length > 0 && (
  props.variation === 'gallery-masonry' ? (
    <div
      className={`sg-gallery__masonry ${enterAnimationClass}`}
      style={{
        columnCount: columns,
        columnGap: `${gap}rem`,
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {images.map((image, index) => (
        <div key={image.id} style={{ breakInside: 'avoid', marginBottom: `${gap}rem` }}>
          <LazyImage
            image={image}
            onClick={() => handleImageClick(index)}
            borderRadius={props.imageBorderRadius || 8}
            shadow={props.imageShadow || 'md'}
            hoverEffect={props.hoverEffect || 'zoom-overlay'}
            aspectRatio={undefined} // masonry preserva aspecto original
          />
        </div>
      ))}
    </div>
  ) : (
    // Grid classico (default)
    <div
      className={`sg-gallery__grid ${enterAnimationClass}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
      }}
    >
      {images.map((image, index) => (
        <LazyImage
          key={image.id}
          image={image}
          onClick={() => handleImageClick(index)}
          borderRadius={props.imageBorderRadius || 8}
          shadow={props.imageShadow || 'md'}
          hoverEffect={props.hoverEffect || 'zoom-overlay'}
          aspectRatio={props.aspectRatio}
        />
      ))}
    </div>
  )
)}
```

**CSS responsivo a adicionar no bloco `<style>` existente:**

```css
/* Masonry Responsive */
@media (max-width: 1024px) {
  .sg-gallery__masonry {
    column-count: 3 !important;
  }
}
@media (max-width: 768px) {
  .sg-gallery__masonry {
    column-count: 2 !important;
  }
}
@media (max-width: 640px) {
  .sg-gallery__masonry {
    column-count: 1 !important;
  }
}
```

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS, Lint PASS

**User testing:**

1. `npm run demo`
2. Adicionar bloco ImageGallery
3. Mudar variation para "Mosaico" no painel
4. **Expected:** Imagens em layout masonry (alturas variadas, tipo Pinterest)
5. Redimensionar janela
6. **Expected:** Colunas se adaptam (3->2->1)
7. Clicar numa imagem
8. **Expected:** Lightbox abre normalmente

**Commit:**

```bash
git add src/engine/render/renderers/sections/ImageGalleryRenderer.tsx
git commit -m "feat(gallery): layout Masonry no renderer React

- CSS columns para layout tipo Pinterest
- Preserva aspecto original das imagens
- Responsivo: N cols -> 3 -> 2 -> 1
- Reutiliza LazyImage e Lightbox existentes"
```

---

## Task 2: Featured Layout - React Renderer

**Objective:** Adicionar layout Destaque (1 imagem grande + grid de miniaturas)

**Files to modify:**
- `src/engine/render/renderers/sections/ImageGalleryRenderer.tsx`

**Implementation:**

O layout Featured mostra a primeira imagem ocupando area maior, com as demais em grid menor abaixo/ao lado.

**Adicionar mais um branch no switch de variation:**

```tsx
props.variation === 'gallery-featured' ? (
  <div className={`sg-gallery__featured ${enterAnimationClass}`}>
    {/* Imagem destaque (primeira) */}
    <div className="sg-gallery__featured-main">
      <LazyImage
        image={images[0]}
        onClick={() => handleImageClick(0)}
        borderRadius={props.imageBorderRadius || 8}
        shadow={props.imageShadow || 'md'}
        hoverEffect={props.hoverEffect || 'zoom-overlay'}
        aspectRatio="16/9"
      />
    </div>
    {/* Grid de miniaturas (restante) */}
    {images.length > 1 && (
      <div
        className="sg-gallery__featured-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(columns, images.length - 1)}, 1fr)`,
          gap: `${gap}rem`,
          marginTop: `${gap}rem`,
        }}
      >
        {images.slice(1).map((image, index) => (
          <LazyImage
            key={image.id}
            image={image}
            onClick={() => handleImageClick(index + 1)}
            borderRadius={props.imageBorderRadius || 8}
            shadow={props.imageShadow || 'md'}
            hoverEffect={props.hoverEffect || 'zoom-overlay'}
            aspectRatio={props.aspectRatio}
          />
        ))}
      </div>
    )}
  </div>
)
```

**CSS responsivo:**

```css
/* Featured Layout */
.sg-gallery__featured-main {
  width: 100%;
}
@media (max-width: 768px) {
  .sg-gallery__featured-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 640px) {
  .sg-gallery__featured-grid {
    grid-template-columns: 1fr !important;
  }
}
```

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**User testing:**

1. `npm run demo`
2. Mudar variation para "Destaque"
3. **Expected:** Primeira imagem grande (16:9), demais em grid abaixo
4. Clicar na imagem grande -> Lightbox abre no index 0
5. Clicar em miniatura -> Lightbox abre no index correto

**Commit:**

```bash
git add src/engine/render/renderers/sections/ImageGalleryRenderer.tsx
git commit -m "feat(gallery): layout Destaque no renderer React

- Primeira imagem em destaque (16:9)
- Grid de miniaturas abaixo
- Responsivo: N cols -> 2 -> 1
- Lightbox com indice correto para cada imagem"
```

---

## Task 3: Carousel Layout - React Renderer

**Objective:** Adicionar layout Carrossel com navegacao horizontal, dots e autoplay

**Files to modify:**
- `src/engine/render/renderers/sections/ImageGalleryRenderer.tsx`

**Implementation:**

O carousel usa CSS scroll-snap para scroll nativo + botoes prev/next + dots de navegacao. Estado de slide atual via useState.

**Hooks a adicionar no ImageGalleryComponent (antes dos early returns, junto com os outros hooks):**

```tsx
const [carouselIndex, setCarouselIndex] = useState(0);
const carouselRef = useRef<HTMLDivElement>(null);

const handleCarouselPrev = useCallback(() => {
  setCarouselIndex((prev) => Math.max(0, prev - 1));
}, []);

const handleCarouselNext = useCallback(() => {
  setCarouselIndex((prev) => Math.min(images.length - 1, prev + 1));
}, [images.length]);

// Scroll to current slide
useEffect(() => {
  if (props.variation !== 'gallery-carousel' || !carouselRef.current) return;
  const container = carouselRef.current;
  const slideWidth = container.offsetWidth;
  container.scrollTo({ left: carouselIndex * slideWidth, behavior: 'smooth' });
}, [carouselIndex, props.variation]);

// Autoplay
useEffect(() => {
  if (props.variation !== 'gallery-carousel') return;
  if (!props.lightbox?.enableAutoplay) return;
  const interval = (props.lightbox?.autoplayInterval || 5) * 1000;
  const timer = setInterval(() => {
    setCarouselIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  }, interval);
  return () => clearInterval(timer);
}, [props.variation, props.lightbox?.enableAutoplay, props.lightbox?.autoplayInterval, images.length]);
```

**NOTA:** Os hooks `carouselRef`, `carouselIndex`, `handleCarouselPrev`, `handleCarouselNext` e os 2 useEffect acima devem ser declarados ANTES de qualquer early return (regra de hooks React). Coloca-los logo apos `handleCloseLightbox`.

**JSX do carousel (novo branch no switch):**

```tsx
props.variation === 'gallery-carousel' ? (
  <div className={`sg-gallery__carousel ${enterAnimationClass}`} style={{ position: 'relative' }}>
    {/* Slides container */}
    <div
      ref={carouselRef}
      className="sg-gallery__carousel-track"
      style={{
        display: 'flex',
        overflowX: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        borderRadius: `${props.imageBorderRadius || 8}px`,
      }}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className="sg-gallery__carousel-slide"
          style={{
            flex: '0 0 100%',
            scrollSnapAlign: 'start',
            aspectRatio: props.aspectRatio || '16/9',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => handleImageClick(index)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleImageClick(index);
            }
          }}
          aria-label={`Ver imagem: ${image.alt}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading={index > 2 ? 'lazy' : 'eager'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Caption overlay */}
          {(image.title || image.description) && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                padding: '2rem 1.5rem 1.5rem',
                color: 'white',
              }}
            >
              {image.title && (
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {image.title}
                </div>
              )}
              {image.description && (
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  {image.description}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Navigation arrows */}
    {images.length > 1 && (
      <>
        <button
          onClick={handleCarouselPrev}
          disabled={carouselIndex === 0}
          aria-label="Slide anterior"
          className="sg-gallery__carousel-nav sg-gallery__carousel-nav--prev"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: carouselIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: carouselIndex === 0 ? 0.3 : 0.8,
            transition: 'opacity 0.2s',
            zIndex: 2,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={handleCarouselNext}
          disabled={carouselIndex === images.length - 1}
          aria-label="Proximo slide"
          className="sg-gallery__carousel-nav sg-gallery__carousel-nav--next"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: carouselIndex === images.length - 1 ? 'not-allowed' : 'pointer',
            opacity: carouselIndex === images.length - 1 ? 0.3 : 0.8,
            transition: 'opacity 0.2s',
            zIndex: 2,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </>
    )}

    {/* Dots */}
    {images.length > 1 && (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCarouselIndex(index)}
            aria-label={`Ir para slide ${index + 1}`}
            style={{
              width: carouselIndex === index ? '2rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '999px',
              border: 'none',
              background: carouselIndex === index
                ? 'var(--sg-primary, #3b82f6)'
                : 'var(--sg-muted-text, #d1d5db)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    )}
  </div>
)
```

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**User testing:**

1. `npm run demo`
2. Mudar variation para "Carrossel"
3. **Expected:** Slider horizontal com imagem 16:9
4. Clicar setas prev/next -> slides mudam
5. Clicar dots -> vai para slide especifico
6. Ativar autoplay no painel -> slides passam automaticamente
7. Clicar na imagem -> Lightbox abre

**Commit:**

```bash
git add src/engine/render/renderers/sections/ImageGalleryRenderer.tsx
git commit -m "feat(gallery): layout Carrossel no renderer React

- Slider horizontal com CSS scroll-snap
- Setas prev/next e dots de navegacao
- Autoplay opcional com intervalo configuravel
- Caption overlay com titulo e descricao
- Click abre Lightbox no slide correto"
```

---

## Task 4: Alternating Layout - React Renderer

**Objective:** Adicionar layout Alternado (zigue-zague imagem+texto)

**Files to modify:**
- `src/engine/render/renderers/sections/ImageGalleryRenderer.tsx`

**Implementation:**

Layout em zigue-zague: cada imagem alterna lado (esquerda/direita) com titulo e descricao ao lado. Em mobile, empilha verticalmente.

**JSX (novo branch no switch):**

```tsx
props.variation === 'gallery-alternating' ? (
  <div className={`sg-gallery__alternating ${enterAnimationClass}`}>
    {images.map((image, index) => {
      const isReversed = index % 2 === 1;
      return (
        <div
          key={image.id}
          className="sg-gallery__alternating-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: `${gap}rem`,
            marginBottom: `${gap * 2}rem`,
            direction: isReversed ? 'rtl' : 'ltr',
          }}
        >
          {/* Imagem */}
          <div style={{ direction: 'ltr' }}>
            <LazyImage
              image={image}
              onClick={() => handleImageClick(index)}
              borderRadius={props.imageBorderRadius || 8}
              shadow={props.imageShadow || 'md'}
              hoverEffect={props.hoverEffect || 'zoom-overlay'}
              aspectRatio={props.aspectRatio || '4/3'}
            />
          </div>
          {/* Texto */}
          <div
            style={{
              direction: 'ltr',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            {image.title && (
              <h3
                style={{
                  fontSize: 'var(--sg-heading-h3, 1.5rem)',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: 'var(--sg-heading, var(--sg-text))',
                }}
              >
                {image.title}
              </h3>
            )}
            {image.description && (
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--sg-muted-text, #6b7280)',
                }}
              >
                {image.description}
              </p>
            )}
            {!image.title && !image.description && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--sg-muted-text, #9ca3af)',
                  fontStyle: 'italic',
                }}
              >
                Adicione titulo e descricao a esta imagem
              </p>
            )}
          </div>
        </div>
      );
    })}
  </div>
)
```

**CSS responsivo:**

```css
/* Alternating Responsive */
@media (max-width: 768px) {
  .sg-gallery__alternating-row {
    grid-template-columns: 1fr !important;
    direction: ltr !important;
  }
}
```

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**User testing:**

1. `npm run demo`
2. Mudar variation para "Alternado"
3. **Expected:** Imagens alternando esquerda/direita com texto ao lado
4. Em mobile -> empilha verticalmente
5. Clicar imagem -> Lightbox abre

**Commit:**

```bash
git add src/engine/render/renderers/sections/ImageGalleryRenderer.tsx
git commit -m "feat(gallery): layout Alternado no renderer React

- Zigue-zague com imagem e texto alternando lados
- Mostra titulo e descricao de cada imagem
- Placeholder quando sem texto
- Responsivo: empilha em mobile"
```

---

## Task 5: Masonry Layout - HTML Exporter

**Objective:** Adicionar layout Masonry ao exportador HTML

**Files to modify:**
- `src/engine/export/exporters/sections/ImageGalleryExporter.ts`

**Implementation:**

No exporter, precisamos:

1. Na funcao `generateGalleryCSS`: adicionar regras CSS para masonry
2. Na funcao `generateGalleryHTML`: switch por variation para gerar HTML diferente
3. Na funcao `generateGalleryJS`: o JS do lightbox ja funciona (usa `data-gallery-index`)

**CSS a adicionar em `generateGalleryCSS`:**

```css
/* Masonry layout */
#${scope} .sg-ig-masonry {
  column-gap: inherit;
}
#${scope} .sg-ig-masonry .sg-ig-item {
  break-inside: avoid;
  display: inline-block;
  width: 100%;
}
@media (max-width: 1024px) {
  #${scope} .sg-ig-masonry { column-count: 3 !important; }
}
@media (max-width: 768px) {
  #${scope} .sg-ig-masonry { column-count: 2 !important; }
}
@media (max-width: 640px) {
  #${scope} .sg-ig-masonry { column-count: 1 !important; }
}
```

**HTML: trocar o wrapper `.sg-ig-grid` por `.sg-ig-masonry` quando variation === 'gallery-masonry':**

```html
<div class="sg-ig-masonry"
     style="column-count: ${columns}; column-gap: ${gap}rem;">
  <!-- items com margin-bottom em vez de gap -->
</div>
```

Cada item masonry precisa de `style="margin-bottom: ${gap}rem"` em volta.

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**User testing:**

1. Exportar pagina HTML com galeria masonry
2. Abrir HTML no browser
3. **Expected:** Layout masonry funcional
4. Clicar imagem -> Lightbox abre
5. Responsivo funciona

**Commit:**

```bash
git add src/engine/export/exporters/sections/ImageGalleryExporter.ts
git commit -m "feat(gallery): layout Masonry no exporter HTML

- CSS columns para masonry layout
- Responsivo: N -> 3 -> 2 -> 1 colunas
- Lightbox funcional via Vanilla JS"
```

---

## Task 6: Featured Layout - HTML Exporter

**Objective:** Adicionar layout Destaque ao exportador HTML

**Files to modify:**
- `src/engine/export/exporters/sections/ImageGalleryExporter.ts`

**Implementation:**

**CSS:**

```css
/* Featured layout */
#${scope} .sg-ig-featured-main {
  width: 100%;
  margin-bottom: ${gap}rem;
}
#${scope} .sg-ig-featured-grid {
  display: grid;
}
@media (max-width: 768px) {
  #${scope} .sg-ig-featured-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 640px) {
  #${scope} .sg-ig-featured-grid {
    grid-template-columns: 1fr !important;
  }
}
```

**HTML:** Primeira imagem em div `.sg-ig-featured-main` (aspect-ratio 16/9), restante em `.sg-ig-featured-grid`.

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**Commit:**

```bash
git add src/engine/export/exporters/sections/ImageGalleryExporter.ts
git commit -m "feat(gallery): layout Destaque no exporter HTML

- Primeira imagem em destaque (16:9)
- Grid de miniaturas abaixo
- Responsivo"
```

---

## Task 7: Carousel Layout - HTML Exporter

**Objective:** Adicionar layout Carrossel ao exportador HTML com Vanilla JS

**Files to modify:**
- `src/engine/export/exporters/sections/ImageGalleryExporter.ts`

**Implementation:**

O carousel no export e mais complexo pois precisa de JS para:
- Scroll para slide especifico
- Setas prev/next
- Dots clicaveis
- Autoplay (se habilitado)

**CSS:**

```css
/* Carousel layout */
#${scope} .sg-ig-carousel { position: relative; }
#${scope} .sg-ig-carousel-track {
  display: flex;
  overflow-x: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
#${scope} .sg-ig-carousel-slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
#${scope} .sg-ig-carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
#${scope} .sg-ig-carousel-caption {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}
#${scope} .sg-ig-carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: opacity 0.2s;
}
#${scope} .sg-ig-carousel-nav--prev { left: 1rem; }
#${scope} .sg-ig-carousel-nav--next { right: 1rem; }
#${scope} .sg-ig-carousel-nav:disabled { opacity: 0.3; cursor: not-allowed; }
#${scope} .sg-ig-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
#${scope} .sg-ig-dot {
  height: 0.5rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}
#${scope} .sg-ig-dot--active {
  width: 2rem;
  background: var(--sg-primary, #3b82f6);
}
#${scope} .sg-ig-dot--inactive {
  width: 0.5rem;
  background: var(--sg-muted-text, #d1d5db);
}
```

**JS para carousel (adicionar ao IIFE existente, so quando variation === carousel):**

```javascript
// Carousel logic
var track = root.querySelector('.sg-ig-carousel-track');
var slides = root.querySelectorAll('.sg-ig-carousel-slide');
var prevBtn = root.querySelector('.sg-ig-carousel-nav--prev');
var nextBtn = root.querySelector('.sg-ig-carousel-nav--next');
var dots = root.querySelectorAll('.sg-ig-dot');
var carouselIdx = 0;

function goToSlide(idx) {
  carouselIdx = Math.max(0, Math.min(slides.length - 1, idx));
  track.scrollTo({ left: carouselIdx * track.offsetWidth, behavior: 'smooth' });
  // Update dots
  for (var d = 0; d < dots.length; d++) {
    dots[d].className = 'sg-ig-dot ' + (d === carouselIdx ? 'sg-ig-dot--active' : 'sg-ig-dot--inactive');
  }
  // Update arrows
  if (prevBtn) prevBtn.disabled = carouselIdx === 0;
  if (nextBtn) nextBtn.disabled = carouselIdx === slides.length - 1;
}

if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goToSlide(carouselIdx - 1); });
if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goToSlide(carouselIdx + 1); });
for (var di = 0; di < dots.length; di++) {
  (function(i) {
    dots[i].addEventListener('click', function() { goToSlide(i); });
  })(di);
}

// Autoplay
if (CFG.enableAutoplay) {
  var autoInterval = (CFG.autoplayInterval || 5) * 1000;
  setInterval(function() {
    goToSlide(carouselIdx >= slides.length - 1 ? 0 : carouselIdx + 1);
  }, autoInterval);
}
```

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**Commit:**

```bash
git add src/engine/export/exporters/sections/ImageGalleryExporter.ts
git commit -m "feat(gallery): layout Carrossel no exporter HTML

- Slider horizontal com CSS scroll-snap
- Setas prev/next em Vanilla JS
- Dots clicaveis
- Autoplay opcional
- Caption overlay"
```

---

## Task 8: Alternating Layout - HTML Exporter

**Objective:** Adicionar layout Alternado ao exportador HTML

**Files to modify:**
- `src/engine/export/exporters/sections/ImageGalleryExporter.ts`

**Implementation:**

**CSS:**

```css
/* Alternating layout */
#${scope} .sg-ig-alt-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
#${scope} .sg-ig-alt-row--reverse {
  direction: rtl;
}
#${scope} .sg-ig-alt-row--reverse > * {
  direction: ltr;
}
#${scope} .sg-ig-alt-text {
  padding: 1rem;
}
#${scope} .sg-ig-alt-text h3 {
  font-size: var(--sg-heading-h3, 1.5rem);
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--sg-heading, var(--sg-text));
}
#${scope} .sg-ig-alt-text p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--sg-muted-text, #6b7280);
  margin: 0;
}
@media (max-width: 768px) {
  #${scope} .sg-ig-alt-row {
    grid-template-columns: 1fr !important;
    direction: ltr !important;
  }
}
```

**HTML:** Cada imagem em uma row com 2 colunas. Rows impares tem `--reverse`.

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**Commit:**

```bash
git add src/engine/export/exporters/sections/ImageGalleryExporter.ts
git commit -m "feat(gallery): layout Alternado no exporter HTML

- Zigue-zague com imagem e texto
- direction: rtl para alternar lados
- Responsivo: empilha em mobile"
```

---

## Task 9: Type Export - GalleryVariation

**Objective:** Exportar tipo `GalleryVariation` do schema (atualmente referenciado mas nao definido como type alias)

**Files to modify:**
- `src/engine/schema/siteDocument.ts`
- `src/index.ts`

**Implementation:**

Em `siteDocument.ts`, adicionar apos `GalleryHoverEffect` (linha ~1344):

```typescript
/**
 * Variacao de layout da galeria
 */
export type GalleryVariation =
  | "gallery-grid"
  | "gallery-masonry"
  | "gallery-featured"
  | "gallery-carousel"
  | "gallery-alternating";
```

Na interface `ImageGalleryBlock`, atualizar o campo `variation` para usar o tipo:

```typescript
variation?: GalleryVariation;
```

Em `src/index.ts`, adicionar `GalleryVariation` ao export de types de `siteDocument`.

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS (resolve o import em galleryVariations.ts)

**Commit:**

```bash
git add src/engine/schema/siteDocument.ts src/index.ts
git commit -m "feat(schema): exportar tipo GalleryVariation

- Type alias para as 5 variacoes de galeria
- Usado em galleryVariations.ts e ImageGalleryBlock
- Exportado em index.ts"
```

---

## Task 10: Ocultar props irrelevantes por variacao

**Objective:** Esconder campo "Colunas" quando variation = carousel (nao faz sentido)

**Files to modify:**
- `src/engine/registry/blocks/sections/imageGallery.ts`

**Implementation:**

Adicionar `hideWhen` ao campo `columns` no `inspectorMeta`:

```typescript
columns: {
  label: "Colunas",
  inputType: "number",
  min: 2,
  max: 12,
  group: "Layout",
  description: "Numero de colunas no desktop (responsivo: 4->3->2->1)",
  hideWhen: (props: Record<string, unknown>) =>
    props.variation === 'gallery-carousel' || props.variation === 'gallery-alternating',
},
aspectRatio: {
  label: "Proporcao",
  inputType: "select",
  options: [...],
  group: "Layout",
  hideWhen: (props: Record<string, unknown>) =>
    props.variation === 'gallery-masonry', // masonry preserva aspecto original
},
```

**NOTA:** Verificar se `hideWhen` ja e suportado pelo PropertyEditor. Se nao for, pular este task e registrar como melhoria futura.

**Build command:**

```bash
npm run build && npm run lint
```

**Expected:** Build SUCCESS

**Commit:**

```bash
git add src/engine/registry/blocks/sections/imageGallery.ts
git commit -m "fix(gallery): ocultar props irrelevantes por variacao

- Esconder Colunas no Carrossel e Alternado
- Esconder Proporcao no Masonry"
```

---

## Task 11: Build Final + Validacao

**Objective:** Build final, lint, e validacao completa

**Files:** Nenhum novo

**Steps:**

```bash
npm run build
npm run lint
```

**Expected:** Zero errors, zero warnings criticos

**User testing completo (todos os layouts):**

1. Grid Classico: grid N colunas, responsivo, lightbox
2. Masonry: colunas com alturas variadas, responsivo, lightbox
3. Destaque: imagem grande + grid miniaturas, lightbox com indice correto
4. Carrossel: slider, setas, dots, autoplay, lightbox
5. Alternado: zigue-zague, texto ao lado, responsivo, lightbox
6. Exportar HTML e testar os 5 layouts no browser (sem React)

**Commit final (se houver ajustes):**

```bash
git add -A
git commit -m "fix(gallery): ajustes finais nos layouts de galeria"
```

---

## Success Criteria

- Build passa (`npm run build`)
- Lint passa (`npm run lint`)
- 5 layouts funcionais no editor (React preview)
- 5 layouts funcionais no export (HTML standalone)
- Lightbox funciona em todos os layouts
- Responsividade em todos os layouts
- Autoplay do carousel funciona
- Dots e setas do carousel funcionam

---

## Resumo de Tasks

| Task | Descricao | Arquivo |
|------|-----------|---------|
| 1 | Masonry - React | ImageGalleryRenderer.tsx |
| 2 | Featured - React | ImageGalleryRenderer.tsx |
| 3 | Carousel - React | ImageGalleryRenderer.tsx |
| 4 | Alternating - React | ImageGalleryRenderer.tsx |
| 5 | Masonry - HTML Export | ImageGalleryExporter.ts |
| 6 | Featured - HTML Export | ImageGalleryExporter.ts |
| 7 | Carousel - HTML Export | ImageGalleryExporter.ts |
| 8 | Alternating - HTML Export | ImageGalleryExporter.ts |
| 9 | GalleryVariation type | siteDocument.ts + index.ts |
| 10 | hideWhen props | imageGallery.ts |
| 11 | Build final + validacao | - |

---

**Ready to execute with superpowers:subagent-driven-development**
