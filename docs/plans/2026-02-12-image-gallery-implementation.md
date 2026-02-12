# Image Gallery com Lightbox - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar bloco ImageGallery profissional com lightbox fullscreen, grid responsivo, lazy loading, zoom, touch gestures e acessibilidade completa.

**Architecture:** Dual rendering (React Renderer + Vanilla JS Exporter), Schema → Definition → Renderer → Lightbox → Exporter → Input. Grid responsivo (4→3→2→1 colunas), Intersection Observer para lazy loading, Portal para lightbox, zero dependências no export.

**Tech Stack:** React 18, TypeScript, Intersection Observer API, React Portal, CSS Grid, Vanilla JS (export), CSS Variables (theme integration)

**Workflow:** Implement → `npm run build` → User tests → Commit

---

## Task 1: Schema & Types

**Objective:** Add all TypeScript interfaces for ImageGalleryBlock to siteDocument.ts

**Files to modify:**
- `src/engine/schema/siteDocument.ts`

**Implementation:**

1. Add `GalleryImage` interface (id, src, alt, title, description, tags, metadata)
2. Add `LightboxConfig` interface (theme, navigation, UX settings)
3. Add `GalleryEnterAnimation` enum (fade-scale, stagger, slide-up, none)
4. Add `GalleryHoverEffect` enum (zoom-overlay, glow, scale, caption-reveal, none)
5. Add `ImageGalleryBlock` interface with 25+ props
6. Add `"imageGallery"` to `BlockType` union
7. Add `ImageGalleryBlock` to `Block` union

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS (TypeScript compiles without errors)

**User testing:** Not needed (schema only, no visual changes yet)

**Commit:**

```bash
git add src/engine/schema/siteDocument.ts
git commit -m "feat(schema): add ImageGalleryBlock with GalleryImage and LightboxConfig

- Add GalleryImage interface (id, src, alt, title, description, tags, metadata)
- Add LightboxConfig interface (theme, navigation, UX, animations)
- Add GalleryEnterAnimation and GalleryHoverEffect enums
- Add ImageGalleryBlock interface with 25+ props in 8 groups
- Add imageGallery to BlockType and Block unions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Block Definition

**Objective:** Create imageGallery.ts with defaultProps + inspectorMeta

**Files:**
- Create: `src/engine/registry/blocks/sections/imageGallery.ts`
- Modify: `src/engine/registry/blocks/sections/index.ts`

**Implementation:**

1. Create block definition file with:
   - `componentRegistry.register()` call
   - `defaultProps` with 4 placeholder images (placehold.co)
   - `inspectorMeta` with 25+ props organized in 8 groups
   - New input type: `"gallery-images"` for advanced modal
2. Export from barrel (`sections/index.ts`)

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Open editor
3. Try to add ImageGallery block from BlockSelector
4. **Expected:** Block appears in list (may show error when clicked - that's ok, renderer not ready yet)

**Commit:**

```bash
git add src/engine/registry/blocks/sections/imageGallery.ts src/engine/registry/blocks/sections/index.ts
git commit -m "feat(registry): add ImageGallery block definition

- 25+ customizable props organized in 8 groups
- 4 placeholder images (placehold.co)
- New input type: gallery-images for advanced modal
- Complete inspectorMeta with descriptions
- MVP: gallery-grid variation only

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: GalleryImagesInput Component

**Objective:** Advanced modal for image management (upload/URL, drag-to-reorder, metadata)

**Files:**
- Create: `src/editor/PropertyEditor/inputs/GalleryImagesInput.tsx`
- Modify: `src/editor/PropertyEditor/renderPropertyInput.tsx`

**Implementation:**

1. Create `GalleryImagesInput.tsx`:
   - Preview grid (4 cols) with drag-to-reorder
   - "Adicionar" button opens modal
   - Modal with upload/URL input
   - Alt text field (required)
   - Title, description, tags fields
   - Save/Cancel buttons
   - Performance warning at 50+ images
2. Register in `renderPropertyInput.tsx`:
   - Add import
   - Add case `"gallery-images"` in switch statement

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Add ImageGallery block
3. Click on "Imagens" property
4. **Expected:** Modal opens with upload/URL interface
5. Test upload (if Supabase configured) OR add URL
6. Add alt text (required)
7. Save
8. **Expected:** Image appears in preview grid
9. Try drag-to-reorder
10. **Expected:** Order changes

**Commit:**

```bash
git add src/editor/PropertyEditor/inputs/GalleryImagesInput.tsx src/editor/PropertyEditor/renderPropertyInput.tsx
git commit -m "feat(input): add GalleryImagesInput with advanced modal

- Upload via Supabase or external URL
- Drag-and-drop reordering
- Preview grid (4 cols)
- Edit modal with metadata fields
- Alt text validation (required)
- Title, description, tags fields
- Performance warning at 50+ images
- Responsive modal UI

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: ImageGalleryRenderer (Grid + LazyImage)

**Objective:** React renderer with responsive grid, lazy loading, hover effects

**Files:**
- Create: `src/engine/render/renderers/sections/ImageGalleryRenderer.tsx`
- Modify: `src/engine/render/renderers/sections/index.ts`

**Implementation:**

1. Create `ImageGalleryRenderer.tsx`:
   - Responsive grid (4→3→2→1 columns via CSS)
   - `LazyImage` component with Intersection Observer
   - 4 hover effects (zoom-overlay, glow, scale, caption-reveal)
   - 3 enter animations (fade-scale, stagger, slide-up)
   - Performance warning at 50+ images
   - Empty state when no images
   - Click handler to open lightbox (state management)
   - Inline `<style>` for animations and hover effects
2. Export from `sections/index.ts`

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Add ImageGallery block with images
3. **Expected:** Grid displays with 4 columns
4. Hover over images
5. **Expected:** Zoom + overlay effect (or configured effect)
6. Resize browser to <768px
7. **Expected:** 2 columns (responsive)
8. Resize to <640px
9. **Expected:** 1 column
10. Scroll down (if many images)
11. **Expected:** Images lazy load as you scroll
12. Click an image
13. **Expected:** Lightbox should attempt to open (may error - lightbox not ready yet)

**Commit:**

```bash
git add src/engine/render/renderers/sections/ImageGalleryRenderer.tsx src/engine/render/renderers/sections/index.ts
git commit -m "feat(renderer): add ImageGalleryRenderer with LazyImage

- Responsive grid (4→3→2→1 columns)
- LazyImage with Intersection Observer
- 4 hover effects (zoom-overlay, glow, scale, caption-reveal)
- 3 enter animations (fade-scale, stagger, slide-up)
- Performance warning at 50+ images
- Empty state when no images
- Inline CSS for animations and hover effects
- Keyboard navigation (Enter/Space to open)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Lightbox Component

**Objective:** Fullscreen lightbox with zoom, navigation, keyboard, touch gestures

**Files:**
- Create: `src/engine/render/renderers/sections/Lightbox.tsx`

**Implementation:**

1. Create `Lightbox.tsx`:
   - Fullscreen overlay via `ReactDOM.createPortal`
   - Image display with zoom (1x-5x)
   - Pan when zoomed (drag to move)
   - Navigation arrows (prev/next)
   - Keyboard support (ESC, Arrows, +/-/0)
   - Touch gestures (swipe, double-tap to zoom)
   - Thumbnails strip at bottom
   - Caption (title + description)
   - Counter ("3 de 12")
   - Adaptive theme (dark/light/theme/adaptive)
   - Close button + backdrop click
   - ARIA complete (dialog, live regions)
   - Inline `<style>` for lightbox UI

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Click any gallery image
3. **Expected:** Lightbox opens fullscreen with image
4. Click next arrow
5. **Expected:** Next image loads, counter updates
6. Press Arrow keys (left/right)
7. **Expected:** Navigate images
8. Press + key
9. **Expected:** Zoom in
10. Drag image when zoomed
11. **Expected:** Pan around
12. Press - key
13. **Expected:** Zoom out
14. Press 0 key
15. **Expected:** Reset zoom to 1x
16. Press ESC
17. **Expected:** Lightbox closes
18. Reopen on mobile/tablet emulator
19. Swipe left/right
20. **Expected:** Navigate images
21. Double-tap image
22. **Expected:** Toggle zoom

**Commit:**

```bash
git add src/engine/render/renderers/sections/Lightbox.tsx
git commit -m "feat(lightbox): add fullscreen Lightbox component with zoom and gestures

- Fullscreen overlay via React Portal
- Zoom in/out/reset (1x-5x)
- Pan when zoomed (drag to move)
- Keyboard navigation (ESC, Arrows, +/-/0)
- Touch gestures (swipe, pinch, double-tap)
- Adaptive theme (dark/light/theme/adaptive)
- Navigation arrows
- Thumbnails strip
- Caption display
- Counter (3 de 12)
- ARIA complete (dialog, live regions)
- Mobile responsive
- Smooth animations

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: HTML Exporter (Vanilla JS)

**Objective:** Replicate TODA a funcionalidade do React Renderer usando Vanilla JS (zero deps)

**Files:**
- Create: `src/engine/export/exporters/sections/ImageGalleryExporter.ts`
- Modify: `src/engine/export/exporters/sections/index.ts`

**Implementation:**

1. Create `ImageGalleryExporter.ts`:
   - `exportImageGallery()` main function
   - Generate CSS (~200 lines):
     - Grid responsivo (media queries)
     - Hover effects
     - Enter animations
     - Lightbox UI
   - Generate HTML (~150 lines):
     - Gallery grid with data-attributes
     - Lightbox DOM structure (hidden by default)
     - Performance warning if needed
   - Generate JavaScript (~500 lines):
     - IIFE (sem poluir global scope)
     - `openLightbox()`, `closeLightbox()`, `navigate()`
     - Zoom functions
     - Keyboard event listeners
     - Touch gesture detection
     - Drag to pan
     - Update thumbnails
     - Sem dependências externas
2. Register in `index.ts`

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Create a page with ImageGallery
3. Export page (there should be an export button or feature in demo)
4. Open exported HTML file in browser
5. **Expected:** Gallery displays correctly
6. Click an image
7. **Expected:** Lightbox opens (Vanilla JS)
8. Test all lightbox features:
   - Navigation (arrows, keyboard)
   - Zoom (+/-/0 keys)
   - Close (ESC, X button, backdrop click)
   - Swipe on mobile
9. **Expected:** All features work WITHOUT React
10. Open browser console
11. **Expected:** No errors

**Commit:**

```bash
git add src/engine/export/exporters/sections/ImageGalleryExporter.ts src/engine/export/exporters/sections/index.ts
git commit -m "feat(exporter): add ImageGallery HTML exporter with Vanilla JS lightbox

- Standalone HTML export (~850 lines total)
- CSS: Grid responsive, hover effects, animations, lightbox UI
- HTML: Gallery structure + lightbox DOM
- JavaScript: Full lightbox functionality in Vanilla JS
  - Zoom, pan, navigation, keyboard, touch gestures
  - IIFE (no global pollution)
  - Zero dependencies
- Native lazy loading (loading='lazy')
- ARIA completo
- Mobile responsive

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Gallery Variations

**Objective:** Create variations file (MVP: grid only, future: masonry, featured, carousel, alternating)

**Files:**
- Create: `src/engine/presets/galleryVariations.ts`
- Modify: `src/engine/registry/blocks/sections/imageGallery.ts`

**Implementation:**

1. Create `galleryVariations.ts`:
   - Export array with `gallery-grid` variation
   - Include thumbnail, description
   - Set defaultProps for variation
2. Import and add `variations` field in block definition

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS

**User testing:**

1. Run `npm run demo`
2. Add ImageGallery block
3. Look for variation selector in properties panel
4. **Expected:** "Grid Clássico" appears as variation
5. (Future variations will appear here in v1.1-v1.4)

**Commit:**

```bash
git add src/engine/presets/galleryVariations.ts src/engine/registry/blocks/sections/imageGallery.ts
git commit -m "feat(presets): add gallery variations (MVP: grid only)

- gallery-grid variation with 4 cols default
- Future: masonry, featured, carousel, alternating (v1.1-v1.4)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Integration & Public Exports

**Objective:** Wire everything up and expose public API

**Files:**
- Modify: `src/engine/export/exporters/sections/index.ts`
- Modify: `src/index.ts`

**Implementation:**

1. Register exporter in `HtmlExporter.ts` or `index.ts` (wherever registry is)
2. Add all types, components, presets to `src/index.ts` public exports:
   - Types: `GalleryImage`, `LightboxConfig`, `ImageGalleryBlock`, enums
   - Components: `GalleryImagesInput`, `ImageGalleryRenderer`, `Lightbox`
   - Presets: `galleryVariations`
   - Exporters: `exportImageGallery`

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS with no errors

**User testing:**

1. Run `npm run demo`
2. Full end-to-end test:
   - Add ImageGallery block ✅
   - Add images via modal ✅
   - Configure all props ✅
   - Test grid rendering ✅
   - Test lightbox ✅
   - Export page ✅
   - Open exported HTML ✅
   - Test exported lightbox ✅

**Commit:**

```bash
git add src/engine/export/exporters/sections/index.ts src/index.ts
git commit -m "feat(exports): add ImageGallery to public API

- Register exporter in HtmlExporter
- Export all types, components, presets
- Ready for NPM package

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Comprehensive Manual Testing

**Objective:** Run through full test checklist (35 test cases)

**No code changes** - pure manual testing phase

**Test checklist:**

### Functional (12 tests)

1. ✅ Gallery grid renders with 4 cols
2. ✅ Add image via modal (upload or URL)
3. ✅ Drag-to-reorder images
4. ✅ Click opens lightbox
5. ✅ Lightbox navigation (prev/next arrows)
6. ✅ Zoom in/out/reset
7. ✅ Pan when zoomed
8. ✅ Close lightbox (ESC/X/backdrop)
9. ✅ Keyboard navigation (arrows)
10. ✅ Touch swipe navigation
11. ✅ Double-tap to zoom
12. ✅ Thumbnails clickable

### Responsive (4 tests)

13. ✅ Desktop 1280px: 4 columns
14. ✅ Tablet 768px: 2-3 columns
15. ✅ Mobile 640px: 2 columns
16. ✅ Mobile 375px: 1 column

### Props Configuration (9 tests)

17. ✅ Change columns (2, 3, 4)
18. ✅ Change gap (0.5-3rem)
19. ✅ Change aspect ratio (1/1, 16/9, auto)
20. ✅ Change border radius (0-32px)
21. ✅ Change shadow (none, sm, md, lg, xl)
22. ✅ Change hover effect (glow, scale, caption-reveal)
23. ✅ Change enter animation (stagger, slide-up)
24. ✅ Change lightbox theme (dark, light)
25. ✅ Toggle lightbox features (arrows, thumbnails, counter)

### Accessibility (3 tests)

26. ✅ Tab navigation works
27. ✅ ARIA labels present (inspect with DevTools)
28. ✅ Alt text required and displayed

### Export (2 tests)

29. ✅ Export HTML renders gallery
30. ✅ Export lightbox works (Vanilla JS)

### Performance (2 tests)

31. ✅ Lazy loading works (check Network tab)
32. ✅ Warning shows at 50+ images

### Browser Compatibility (3 tests)

33. ✅ Chrome: all features work
34. ✅ Firefox: all features work
35. ✅ Safari: all features work

**If ALL tests pass:**

```bash
git add .
git commit -m "test(gallery): complete manual QA checklist (35 tests)

Verified:
- ✅ Functional (12 tests)
- ✅ Responsive (4 breakpoints)
- ✅ Props (9 configurations)
- ✅ Accessibility (keyboard, ARIA, alt)
- ✅ Export (HTML + Vanilla JS)
- ✅ Performance (lazy load, warnings)
- ✅ Browser compatibility (Chrome, Firefox, Safari)

All 35 tests PASSING ✅

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**If ANY test fails:** Fix the issue, rebuild, retest, then commit the fix.

---

## Task 10: Version Bump & Publish

**Objective:** Bump to v1.10.0 and publish to NPM

**Steps:**

1. Verify final build:
   ```bash
   npm run build
   ```
   **Expected:** ✅ SUCCESS

2. Version bump (minor - new feature):
   ```bash
   npm run version:minor
   ```
   **Expected:**
   - Version bumped (e.g., 1.9.0 → 1.10.0)
   - Git tag created (v1.10.0)
   - Pushed to remote
   - Published to NPM

3. Verify NPM publication:
   ```bash
   npm view @brunoalz/smartgesti-site-editor version
   ```
   **Expected:** Shows 1.10.0 (or new version)

4. Notify Atlas:
   ```bash
   /home/bruno/GithubPessoal/SmartGesTI-Atlas/scripts/notify-atlas.sh \
     --from editor \
     --type feature_complete \
     --summary "Image Gallery com Lightbox (MVP v1.0) - 25+ props, grid responsivo, lightbox fullscreen, zoom, touch gestures, lazy load, ARIA completo" \
     --commits "$(git log --oneline -10 --pretty=format:'%h' | tr '\n' ',')"
   ```

**No code changes** - publishing only

---

## Task 11: Documentation

**Objective:** Update docs with ImageGallery examples and reference

**Files:**
- Modify: `docs/CREATING-BLOCKS.md`
- Modify: `docs/TEMPLATE-MANUAL.md`

**Implementation:**

1. Add "Example 2: ImageGallery Block" section in CREATING-BLOCKS.md
2. Add `imageGallery` to block reference in TEMPLATE-MANUAL.md

**Build command:**

```bash
npm run build
```

**Expected:** ✅ Build SUCCESS (no code changes, just docs)

**Commit:**

```bash
git add docs/CREATING-BLOCKS.md docs/TEMPLATE-MANUAL.md
git commit -m "docs: add ImageGallery block documentation

- Add Example 2 in CREATING-BLOCKS.md
- Add imageGallery to block reference in TEMPLATE-MANUAL.md
- Document 25+ props and lightbox features

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Success Criteria

✅ All tasks completed (1-11)
✅ Build passes (`npm run build`)
✅ Demo works (`npm run demo`)
✅ 35 manual tests pass
✅ Published to NPM (v1.10.0)
✅ Atlas notified
✅ Documentation updated

---

## Timeline Estimate

| Task | Description | Time |
|------|-------------|------|
| 1 | Schema & Types | 30 min |
| 2 | Block Definition | 45 min |
| 3 | GalleryImagesInput | 2-3h |
| 4 | ImageGalleryRenderer | 2-3h |
| 5 | Lightbox | 4-5h |
| 6 | HTML Exporter | 4-5h |
| 7 | Gallery Variations | 30 min |
| 8 | Integration | 30 min |
| 9 | Manual Testing (35 tests) | 3-4h |
| 10 | Publish | 30 min |
| 11 | Docs | 1h |
| **TOTAL** | | **19-25h** (~3-4 days) |

---

## Notes

- **No TDD** - Direct implementation → build → manual test → commit
- **MVP scope** - Only `gallery-grid` variation in v1.0
- **Manual QA critical** - 35 test cases before publish
- **11 commits** - Clean, incremental history
- **Atlas notification** - Required after publish

---

**Ready to execute with superpowers:executing-plans or superpowers:subagent-driven-development**
