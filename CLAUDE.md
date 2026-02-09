# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartGesti Site Editor is a shared React component library for building landing pages. Published as `@brunoalz/smartgesti-site-editor` on NPM, it provides a block-based site editor with drag-and-drop, HTML export for static site generation, multi-tenant asset management with Supabase Storage, and pre-built templates for schools and portfolios.

**Consumer Projects**: SmartGesti-Ensino, SmartGesti-Portfólios

## Development Commands

```bash
npm run build          # Production build (Vite library mode → dist/)
npm run dev            # Watch mode for development
npm run demo           # Start Vite dev server with demo app
npm run lint           # ESLint 9 flat config check (ts,tsx)
```

There is no test suite. Validation is manual via `npm run demo`.

### Publishing

```bash
npm run version:patch  # Bump patch, tag, push, publish
npm run version:minor  # Bump minor, tag, push, publish
npm run version:major  # Bump major, tag, push, publish
```

### Local Development with Consumer Projects

```bash
# In smartgesti-site-editor/
npm run build

# In consumer project (e.g., Frontend-SmartGesti-Ensino)
USE_LOCAL_EDITOR=true npm run setup:editor
npm install
npm run dev
```

## Architecture

### Block System

The editor uses a composable block architecture:

- **Schema**: `src/engine/schema/siteDocument.ts` — all block types and their props as TypeScript interfaces
- **Registry**: `src/engine/registry/registry.ts` — central registry mapping block types to definitions
- **Block definitions**: `src/engine/registry/blocks/` organized by category: `layout/`, `content/`, `sections/`, `forms/`, `composition/`
- **Presets/Variations**: `src/engine/presets/` — heroVariations.ts, navbarVariations.ts
- **Type utilities**: `BlockOfType<T>`, `BlockPropsFor<T>` in siteDocument.ts — generic type-safe block access
- **Type guards**: `src/engine/shared/typeGuards.ts` — `isBlockType()` and `getBlockProps()` for runtime narrowing

### Dual Rendering System (CRITICAL)

The editor has **two separate rendering pipelines** that must stay in sync:

1. **Editor Preview** (React): `src/engine/render/renderers/` — React components for live preview in editor
2. **HTML Export** (Static): `src/engine/export/exporters/` — generates standalone HTML with inline CSS

**When adding or modifying blocks, you MUST update BOTH systems.**

### HTML Export Flow

1. `exportPageToHtml()` in `src/engine/export/exportHtml.ts` — generates full HTML document
2. `blockToHtmlDirect()` dispatches to specific exporters via `src/engine/export/exporters/HtmlExporter.ts` registry
3. Theme CSS variables inlined in `<head>`
4. Navbar-specific responsive CSS from `landingPageCSS` constant in exportHtml.ts
5. Style resolver: `src/engine/export/styleResolver.ts` computes CSS custom properties for navbar

### Multi-Tenant Asset System

**Storage path**: `tenant-{uuid}/school-{uuid}/site-{uuid}/filename.jpg`

Upload flow: `ImageInput` component → POST `/api/site-assets/upload` with JWT → Backend validates tenant ownership → Supabase Storage + RLS → Metadata in `site_assets` table.

Automatic cleanup detects removed assets when saving and deletes them in background.

### Theme System

- `src/engine/schema/themeTokens.ts` — design tokens (colors, typography, spacing)
- CSS variables generated via `generateThemeCSSVariables()`
- Applied globally in both exported HTML and editor preview

### Shared Constants

Duplicated constants between renderers and exporters are extracted to `src/engine/shared/`:

- `shadowConstants.ts` — `imageShadowMap` (shared by HeroRenderer/HeroExporter)
- `layoutConstants.ts` — `contentPositionMap`, `blockGapConfig` (shared by Hero renderer/exporter)
- `socialIcons.ts` — `socialIconPaths` (shared by FooterRenderer, FooterExporter, SocialLinksRenderer)

**Note**: `spacingMap` is intentionally different between renderer and exporter (different rem values) — do NOT extract it.

### Build Configuration

- **Vite library mode** with multiple entry points: `index`, `shared`, `site-styles`, `site/index`
- **ESM-only** output with `preserveModules: true`
- **Externals**: All dependencies externalized (react, react-dom, lucide-react, @dnd-kit/*, clsx, tailwind-merge, react-colorful, @vanilla-extract/css)
- React is a **peer dependency only** (not in `dependencies`)
- `@vanilla-extract/vite-plugin` is a **devDependency** (build-time only)
- Path alias: `@/*` → `./src/*`
- Custom Vite plugin copies static CSS files to dist

### sideEffects Configuration (CRITICAL)

The `sideEffects` field in `package.json` uses **glob patterns** to prevent tree-shaking from removing block registration code:

```json
"sideEffects": [
  "*.css",
  "./src/engine/registry/blocks/**",
  "./src/engine/render/renderers/**",
  "./src/engine/export/exporters/**"
]
```

**Why globs, not just index.ts**: Each block file (e.g., `hero.ts`) calls `componentRegistry.register()` as a side effect. With `preserveModules: true`, Rollup evaluates each file independently — if only `index.ts` is marked as side-effectful, individual block files get tree-shaken away because their exports aren't directly consumed.

### Exports Configuration

`src/index.ts` uses **explicit named exports** (not `export *`) for tree-shaking. When adding new public APIs, add them to `src/index.ts` manually.

### Logger Utility

Use `logger` from `src/utils/logger.ts` instead of `console.log/debug`. It silences in production, only keeping `warn` and `error`. ESLint enforces `no-console` rule.

```typescript
import { logger } from '../utils/logger';
logger.debug('dev only');  // Silenced in production
logger.error('always');    // Always visible
```

## Critical Rules

### Block Variations — NEVER Include Editable Props in defaultProps

When creating block variations, **DO NOT** include user-editable fields like `image`, `logo`, `avatar` in `defaultProps`:

```typescript
// WRONG - Will overwrite user's image when switching variations
defaultProps: { image: "placeholder.jpg", variant: "split" }

// CORRECT - Preserves user's image
defaultProps: { variant: "split", align: "left" }
```

**Why**: Variation switching merges `defaultProps` into existing block, overwriting user's custom values. Visual props must be reset explicitly — see `HERO_VISUAL_PROPS_TO_RESET` in `src/editor/PropertyEditor/VariationSelector.tsx`.

### React Hooks — ALL Hooks Before Early Returns

All `useState`, `useMemo`, `useCallback`, etc. must be called **before** any early return statement. React requires hooks to be called in the same order every render.

```typescript
// WRONG - useCallback after early return
const Component = memo(({ block }) => {
  const data = useMemo(() => ..., [block]);
  if (!block) return null;           // early return
  const handler = useCallback(...);  // BREAKS HOOKS RULES
});

// CORRECT - all hooks before returns
const Component = memo(({ block }) => {
  const data = useMemo(() => ..., [block]);
  const handler = useCallback(...);  // before early return
  if (!block) return null;
});
```

### Adding New Blocks — Checklist

> **Guia completo com exemplos de código**: [docs/CREATING-BLOCKS.md](docs/CREATING-BLOCKS.md)

1. Define interface in `src/engine/schema/siteDocument.ts` and add to `BlockType` + `Block` unions
2. Create definition in `src/engine/registry/blocks/{category}/` with `componentRegistry.register()` call
3. Export from `src/engine/registry/blocks/{category}/index.ts`
4. Create React renderer in `src/engine/render/renderers/{category}/`
5. Create HTML exporter in `src/engine/export/exporters/{category}/`
6. Register exporter in `src/engine/export/exporters/{category}/index.ts`
7. Add to `src/index.ts` if it should be part of the public API

### Image Upload in Blocks

Use `inputType: "image-upload"` (not `"image"`) in `inspectorMeta` to enable authenticated upload to Supabase:

```typescript
inspectorMeta: {
  myImage: { label: "Image", inputType: "image-upload", group: "Mídia" }
}
```

### XSS Prevention

Always use `escapeHtml()` from `src/engine/export/shared/htmlHelpers.ts` when generating HTML in exporters.

### Navbar/Footer Special Handling

- Non-home pages can inherit navbar/footer from the home page
- Navbar has complex responsive styling: sticky positioning, backdrop-filter blur, floating mode
- CSS variables for customization (opacity, blur, colors)
- Layout variants: expanded, centered, compact

### renderPropertyInput Multi-Prop Pattern

`src/editor/PropertyEditor/renderPropertyInput.tsx` uses `context.allProps` and `context.onMultiUpdate` for input types that manipulate multiple props simultaneously (e.g., `"image-grid"`).

## File Organization

```
src/
├── editor/                    # Editor UI
│   ├── LandingPageEditor.tsx     # Main editor component
│   ├── components/               # Panel components (Toolbar, LeftPanel, CenterPanel, RightPanel)
│   │   └── LoadingSpinner.tsx    # Shared loading spinner
│   ├── PropertyEditor/           # Block property editing
│   │   ├── inputs/               # Input components (Text, Color, Image, ImageGrid, Typography, etc.)
│   │   ├── renderPropertyInput.tsx
│   │   ├── VariationSelector.tsx
│   │   └── BlockPropertyEditor.tsx
│   ├── BlockSelector.tsx
│   ├── PaletteSelector.tsx
│   ├── PageTabBar.tsx
│   └── TemplatePicker.tsx
├── viewer/                    # Viewer (read-only rendering)
│   └── LandingPageViewer.tsx
├── engine/                    # Core engine
│   ├── schema/                   # Type definitions (siteDocument, themeTokens)
│   ├── registry/                 # Block definitions and registry
│   │   └── blocks/               # Block definitions by category (layout/, content/, sections/, forms/, composition/)
│   ├── render/                   # React renderers for editor preview
│   │   └── renderers/            # Renderer components by category
│   ├── export/                   # HTML export system
│   │   ├── exporters/            # HTML exporters by category
│   │   └── shared/               # Shared export utilities (htmlHelpers, sanitization)
│   ├── preview/                  # Preview (iframe-based preview)
│   ├── patch/                    # JSON patch system (applyPatch, PatchBuilder, history)
│   ├── presets/                  # Block variations (hero, navbar) and theme presets
│   ├── shared/                   # Shared constants and utilities
│   │   ├── shadowConstants.ts       # Image shadow maps
│   │   ├── layoutConstants.ts       # Content position and gap maps
│   │   ├── socialIcons.ts           # Social media SVG icon paths
│   │   ├── typeGuards.ts            # isBlockType(), getBlockProps()
│   │   ├── hoverEffects/            # Button/link hover effect generators
│   │   ├── imageGrid/              # Image grid presets and types
│   │   └── typography/             # Typography config and CSS generation
│   └── theme/                    # Theme utilities
├── hooks/                     # React hooks (useEditorState, useKeyboardShortcuts, useNavbarAutoSync)
├── shared/                    # Shared templates and validators
│   └── templates/                # Pre-built site templates (escola-edvi, escola-premium, escola-zilom)
├── site/                      # Site rendering components (for consumer use)
├── utils/                     # Utility functions
│   ├── logger.ts                 # Production-safe logger (silences debug/log in prod)
│   ├── dataURLUtils.ts           # Data URL → Supabase upload utilities
│   ├── cn.ts                     # className utility (clsx + tailwind-merge)
│   ├── colorUtils.ts             # Color analysis (isLightColor, etc.)
│   ├── blockUtils.ts             # Block structure traversal
│   ├── navbarSync.ts             # Navbar auto-sync across pages
│   ├── changeDetector.ts         # Document change detection for preview
│   ├── documentHash.ts           # Export cache invalidation
│   ├── pageTemplateFactory.ts    # Default page structure generator
│   ├── blockIcons.ts             # Block type icon mapping
│   └── sharedTemplateToEngine.ts # Template format conversion
└── styles/                    # Global CSS files
```

## ClickUp (Gestão de Tarefas)

- **Space**: SmartGesTI (ID: 90174029631)
- **Folder**: SmartGesTI - Editor (ID: 90176447853)
- **Backlog List**: 901710728590
- **PM Agent**: `clickup-pm-editor` (em `.claude/agents/`) — roda automaticamente em background para gerenciar tarefas no ClickUp

### Comunicacao com Atlas (Gerente Global)

**Ao concluir uma feature ou etapa significativa**, notifique o Atlas:
```bash
/home/bruno/GithubPessoal/SmartGesTI/scripts/notify-atlas.sh \
  --from editor --type feature_complete --summary "Descricao" \
  --commits "hash1,hash2" --task "task-id"
```

**Para mudancas que afetam projetos consumidores** (Ensino, Portifolios):
```bash
/home/bruno/GithubPessoal/SmartGesTI/scripts/notify-atlas.sh \
  --from editor --type cross_project_impact \
  --summary "Descricao da mudanca" --affected "ensino,portfolios"
```

**Para consultas rapidas ao ClickUp** (verificar status, buscar task), o PM Agent local (`clickup-pm-editor`) pode ser usado normalmente.

## Key Files

| Purpose | Path |
|---------|------|
| Schema (all block types) | `src/engine/schema/siteDocument.ts` |
| Type utilities (BlockOfType, BlockPropsFor) | `src/engine/schema/siteDocument.ts` (bottom) |
| Block registry | `src/engine/registry/registry.ts` |
| Registry types (BlockDefinition\<T\>) | `src/engine/registry/types.ts` |
| Type guards | `src/engine/shared/typeGuards.ts` |
| Main export logic | `src/engine/export/exportHtml.ts` |
| Export registry | `src/engine/export/exporters/HtmlExporter.ts` |
| HTML helpers (escaping) | `src/engine/export/shared/htmlHelpers.ts` |
| Navbar style resolver | `src/engine/export/styleResolver.ts` |
| Theme tokens | `src/engine/schema/themeTokens.ts` |
| Hero variations | `src/engine/presets/heroVariations.ts` |
| Property input renderer | `src/editor/PropertyEditor/renderPropertyInput.tsx` |
| Variation selector | `src/editor/PropertyEditor/VariationSelector.tsx` |
| Editor entry point | `src/editor/LandingPageEditor.tsx` |
| Viewer entry point | `src/viewer/LandingPageViewer.tsx` |
| Logger utility | `src/utils/logger.ts` |
| Data URL utilities | `src/utils/dataURLUtils.ts` |
| ESLint config | `eslint.config.js` |
| Vite config | `vite.config.ts` |
