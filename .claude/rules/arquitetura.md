# Arquitetura - SmartGesti Site Editor

## Sistema de Blocos

Editor composable block-based:

### Schema & Registry

- **Schema**: `src/engine/schema/siteDocument.ts` — Todas interfaces de blocos
- **Registry**: `src/engine/registry/registry.ts` — Central registry (tipo → definição)
- **Definições**: `src/engine/registry/blocks/` (por categoria: layout/, content/, sections/, forms/, composition/)
- **Presets/Variations**: `src/engine/presets/` — heroVariations.ts, navbarVariations.ts
- **Type Utilities**: `BlockOfType<T>`, `BlockPropsFor<T>` para type-safe access
- **Type Guards**: `src/engine/shared/typeGuards.ts` — `isBlockType()`, `getBlockProps()`

### Dual Rendering (CRÍTICO)

Dois pipelines de renderização **DEVEM** estar em sync:

1. **Editor Preview** (React): `src/engine/render/renderers/` — Componentes React para preview
2. **HTML Export** (Static): `src/engine/export/exporters/` — HTML standalone com CSS inline

**Ao adicionar/modificar blocos**: Atualizar AMBOS sistemas.

### HTML Export Flow

1. `exportPageToHtml()` em `src/engine/export/exportHtml.ts` → Documento HTML completo
2. `blockToHtmlDirect()` → Dispatch para exporters via `src/engine/export/exporters/HtmlExporter.ts`
3. Theme CSS variables inline no `<head>`
4. Navbar CSS responsivo de `landingPageCSS` constant
5. Style resolver: `src/engine/export/styleResolver.ts` → CSS custom properties para navbar

## Multi-Tenant Assets

**Path**: `tenant-{uuid}/school-{uuid}/site-{uuid}/filename.jpg`

**Upload Flow**: ImageInput → POST `/api/site-assets/upload` + JWT → Backend valida tenant → Supabase Storage + RLS → Metadata em `site_assets`

**Cleanup**: Automático ao detectar assets removidos no save (background).

## Theme System

- `src/engine/schema/themeTokens.ts` — Design tokens (colors, typography, spacing)
- CSS variables via `generateThemeCSSVariables()`
- Aplicado em exported HTML e editor preview

## Shared Constants

Duplicação entre renderers/exporters extraída para `src/engine/shared/`:

- `shadowConstants.ts` — `imageShadowMap` (Hero)
- `layoutConstants.ts` — `contentPositionMap`, `blockGapConfig`
- `socialIcons.ts` — `socialIconPaths` (Footer, SocialLinks)

**NOTA**: `spacingMap` é diferente entre renderer/exporter (diferentes rem values) — NÃO extrair.

## Build Configuration

- **Vite library mode**: Múltiplos entry points (index, shared, site-styles, site/index)
- **ESM-only**: `preserveModules: true`
- **Externals**: Todas deps externalizadas
- React: **peer dependency** only (não em `dependencies`)
- `@vanilla-extract/vite-plugin`: **devDependency** (build-time only)
- Path alias: `@/*` → `./src/*`
- Plugin custom: Copia static CSS files para dist

## sideEffects (CRÍTICO)

```json
"sideEffects": [
  "*.css",
  "./src/engine/registry/blocks/**",
  "./src/engine/render/renderers/**",
  "./src/engine/export/exporters/**"
]
```

**Por quê globs?** Cada bloco chama `componentRegistry.register()` como side effect. Com `preserveModules: true`, Rollup avalia cada arquivo independentemente. Se só `index.ts` for side-effectful, blocos individuais são tree-shaken.

## Exports Configuration

`src/index.ts` usa **named exports explícitos** (não `export *`) para tree-shaking. Ao adicionar APIs públicas, adicionar manualmente em `src/index.ts`.

## Logger Utility

Use `logger` de `src/utils/logger.ts` em vez de `console.log/debug`. Silencia em produção (só `warn`/`error`). ESLint força `no-console` rule.
