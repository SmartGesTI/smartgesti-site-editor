# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartGesti Site Editor is a shared React component library for building landing pages. Published as `@brunoalz/smartgesti-site-editor` on NPM, it provides:

- **Block-based site editor** (V2 engine) with drag-and-drop interface
- **HTML export** system for static site generation
- **Multi-tenant asset management** with Supabase Storage isolation
- **Responsive preview** with device switching
- **Pre-built templates** for schools and portfolios

**Consumer Projects**: SmartGesti-Ensino, SmartGesti-Portfólios

## Development Commands

### Build and Development
```bash
npm run build          # Production build (creates dist/)
npm run dev            # Watch mode for development
npm run demo           # Start Vite dev server with demo
npm run lint           # ESLint check
```

### Publishing
```bash
npm run version:patch  # Bump patch version, tag, push, publish
npm run version:minor  # Bump minor version, tag, push, publish
npm run version:major  # Bump major version, tag, push, publish
```

### Local Development Workflow
When developing locally alongside consumer projects:

```bash
# In smartgesti-site-editor/
npm run build

# In consumer project (e.g., Frontend-SmartGesti-Ensino)
USE_LOCAL_EDITOR=true npm run setup:editor
npm install
npm run dev
```

## Architecture

### V2 Engine - Block System

The editor uses a **Lovable-like** composable block architecture:

- **Schema**: [siteDocument.ts](src/engine/schema/siteDocument.ts) defines all block types and their props
- **Registry**: [registry.ts](src/engine/registry/registry.ts) - central registry for block definitions with metadata
- **Blocks**: Defined in [src/engine/registry/blocks/](src/engine/registry/blocks/) organized by category:
  - `layout/` - Container, Stack, Grid, Box, Spacer
  - `content/` - Heading, Text, Image, Button, Video, etc.
  - `sections/` - Hero, Navbar, Footer, FeatureGrid, Pricing, etc.
  - `forms/` - Form, Input, Textarea, FormSelect

### Block Definition Structure

Each block has:
- `type` - Unique identifier (matches BlockType in schema)
- `defaultProps` - Default property values
- `inspectorMeta` - Property editor metadata (labels, input types, grouping)
- `variations` - Pre-configured visual variations (optional)
- `constraints` - Validation rules

Example:
```typescript
export const heroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero Section",
  category: "sections",
  defaultProps: {
    title: "Welcome",
    variant: "centered",
  },
  variations: {
    "hero-split": { /* variation config */ },
  },
  inspectorMeta: {
    image: {
      label: "Background Image",
      inputType: "image-upload",  // Enables authenticated upload
      group: "Mídia",
    },
  },
};
```

### Dual Rendering System

The editor has TWO separate rendering pipelines:

1. **Editor Preview** (React components):
   - Path: [src/engine/render/renderers/](src/engine/render/renderers/)
   - Uses `renderRegistry.ts` to map block types to React components
   - Renders blocks in editor with drag-and-drop, selection, etc.

2. **HTML Export** (Static HTML):
   - Path: [src/engine/export/exporters/](src/engine/export/exporters/)
   - Uses `HtmlExporter.ts` registry pattern
   - Generates standalone HTML with inline CSS
   - Entry point: [exportHtml.ts](src/engine/export/exportHtml.ts#L223-L246)

**CRITICAL**: When adding or modifying blocks, you MUST update BOTH rendering systems.

### HTML Export System

Export flow:
1. `exportPageToHtml()` in [exportHtml.ts](src/engine/export/exportHtml.ts) generates full HTML document
2. `blockToHtmlDirect()` uses registry to dispatch to specific exporters
3. Each exporter in [exporters/](src/engine/export/exporters/) handles one block type
4. Theme CSS variables are inlined in `<head>`
5. Navbar-specific styles from `landingPageCSS` constant

**Key files**:
- [exportHtml.ts](src/engine/export/exportHtml.ts) - Main export logic with caching
- [exporters/HtmlExporter.ts](src/engine/export/exporters/HtmlExporter.ts) - Registry
- [shared/htmlHelpers.ts](src/engine/export/shared/htmlHelpers.ts) - HTML escaping, sanitization
- [styleResolver.ts](src/engine/export/styleResolver.ts) - CSS style generation for navbar

### Multi-Tenant Asset System

**Structure**: `tenant-{uuid}/school-{uuid}/site-{uuid}/filename.jpg`

**Upload Flow**:
1. Frontend uses `ImageInput` component with `uploadConfig` prop
2. POST to `/api/site-assets/upload` with JWT auth
3. Backend validates tenant ownership via `TenantAccessGuard`
4. Supabase Storage + RLS policies enforce isolation
5. Metadata stored in `site_assets` table

**Automatic Cleanup**: When saving sites, the system detects removed assets and deletes them in background.

See [docs/ASSETS.md](docs/ASSETS.md) for complete documentation.

### Theme System

- [ThemeTokens](src/engine/schema/themeTokens.ts) - Design tokens (colors, typography, spacing)
- CSS variables generated via `generateThemeCSSVariables()`
- Applied globally in exported HTML and editor preview

## Critical Rules

### Block Variations - NEVER Include Editable Props in defaultProps

When creating block variations, **DO NOT** include user-editable fields like `image`, `logo`, `avatar` in `defaultProps`:

```typescript
// ❌ WRONG - Will overwrite user's image when switching variations
defaultProps: {
  image: "placeholder.jpg",  // BAD
  variant: "split",
}

// ✅ CORRECT - Preserves user's image
defaultProps: {
  variant: "split",
  align: "left",
  // image is NOT here
}
```

**Why**: Variation switching merges `defaultProps` into existing block, overwriting user's custom values.

**Files to check**:
- [heroVariations.ts](src/engine/presets/heroVariations.ts)
- [navbarVariations.ts](src/engine/presets/navbarVariations.ts)

### Adding Image Upload to Blocks

To enable authenticated image upload in any block:

```typescript
inspectorMeta: {
  myImage: {
    label: "Image",
    inputType: "image-upload",  // 👈 This enables upload
    group: "Mídia",
  },
}
```

**Input Types**:
- `"image"` - Simple URL input (no upload)
- `"image-upload"` - File picker with authenticated upload to Supabase

### Export System: Registry Pattern

The HTML export was refactored from a giant 1200-line switch statement to modular exporters:

**Before**: All export logic in `blockToHtmlDirect()` switch
**After**: Separate exporter files per block type

When adding new blocks:
1. Create block definition in `registry/blocks/`
2. Create React renderer in `render/renderers/`
3. Create HTML exporter in `export/exporters/`
4. Register in respective index files

### Navbar Styling Specifics

Navbar has complex responsive styling handled in:
1. Export: [NavbarExporter.ts](src/engine/export/exporters/sections/NavbarExporter.ts) generates HTML + inline styles
2. CSS: Inline `landingPageCSS` in [exportHtml.ts](src/engine/export/exportHtml.ts#L16-L193)
3. Style resolver: [styleResolver.ts](src/engine/export/styleResolver.ts) computes CSS custom properties

**Key features**:
- Sticky positioning with backdrop-filter blur
- Floating mode with margins and rounded corners
- CSS variables for customization (opacity, blur, colors)
- Layout variants: expanded, centered, compact

## File Organization

```
src/
├── components/           # Legacy V1 components (SiteEditor, SiteViewer)
├── editor/              # V2 Editor (LandingPageEditorV2)
│   ├── BlockPalette.tsx
│   ├── BlockPropertyEditor.tsx
│   └── components/RightPanel.tsx
├── viewer/              # V2 Viewer (LandingPageViewerV2)
├── engine/              # Core V2 engine
│   ├── schema/          # Type definitions (siteDocument, themeTokens)
│   ├── registry/        # Block definitions and registry
│   │   └── blocks/      # Block definitions by category
│   ├── render/          # React renderers for editor preview
│   │   └── renderers/   # Renderer components by category
│   ├── export/          # HTML export system
│   │   ├── exporters/   # HTML exporters by category
│   │   └── shared/      # Shared export utilities
│   ├── presets/         # Block variations (hero, navbar)
│   └── theme/           # Theme utilities
├── shared/              # Shared utilities and templates
│   └── templates/       # Pre-built site templates
└── styles/              # Global CSS
```

## Testing and Quality

- **Type checking**: `tsc --noEmit` (run via lint)
- **No test suite**: Manual testing in demo mode
- **Build validation**: Ensure both CJS and ESM builds work

## Common Patterns

### Adding a New Block

1. **Define schema** in [siteDocument.ts](src/engine/schema/siteDocument.ts):
   ```typescript
   export interface MyBlockBlock extends BlockBase {
     type: "myBlock";
     props: { title: string; };
   }
   ```

2. **Add to BlockType union** and **Block union** in same file

3. **Create definition** in `registry/blocks/{category}/myBlock.ts`:
   ```typescript
   export const myBlockBlock: BlockDefinition = { /* ... */ };
   ```

4. **Create React renderer** in `render/renderers/{category}/MyBlockRenderer.tsx`

5. **Create HTML exporter** in `export/exporters/{category}/MyBlockExporter.ts`

6. **Register** in respective `index.ts` files

### Modifying Navbar/Footer

These blocks have special handling:
- **Layout sharing**: Non-home pages can inherit navbar/footer from home page
- **Export logic**: Check [exportHtml.ts](src/engine/export/exportHtml.ts#L318-L337)
- **Styling**: Navbar uses CSS custom properties extensively

## Browser Compatibility

- Modern browsers (ES2020+)
- Uses React 19
- CSS: Flexbox, Grid, CSS Variables, backdrop-filter

## Important Notes

- **Asset URLs**: Always use Supabase public URLs, never local paths
- **XSS Prevention**: Use `escapeHtml()` from [htmlHelpers.ts](src/engine/export/shared/htmlHelpers.ts) in exporters
- **Cache management**: HTML export has LRU cache (max 50 entries), cleared on document changes
- **Version bumping**: Use npm scripts (`version:patch`, etc.) to maintain changelog and tags
