# Stack Técnica - SmartGesti Site Editor

## Overview

Biblioteca React NPM (`@brunoalz/smartgesti-site-editor`) para editor de landing pages block-based.

## Core

- **React** + **TypeScript**
- **Vite** library mode (build tool)
- **ESLint** 9 flat config
- **NPM** public package

## Dependencies

### Core (peer dependencies)
- `react`, `react-dom` (18.x)

### UI & Interaction
- `lucide-react` — Icons
- `@dnd-kit/*` — Drag and drop
- `react-colorful` — Color picker
- `clsx`, `tailwind-merge` — Class utilities

### Styling
- `@vanilla-extract/css` — CSS-in-JS (devDependency, build-time only)
- Tailwind CSS (consumer responsability)

### Build
- `@vanilla-extract/vite-plugin` — Vite integration (devDependency)
- `preserveModules: true` — ESM-only, tree-shakeable

## Comandos

```bash
npm run build          # Production build (dist/)
npm run dev            # Watch mode
npm run demo           # Dev server com demo app
npm run lint           # ESLint check

# Publishing
npm run version:patch  # Bump patch, tag, push, publish
npm run version:minor  # Bump minor
npm run version:major  # Bump major
```

## Desenvolvimento Local (Consumer)

```bash
# No editor/
npm run build

# No consumer (Ensino/Portfolios)
USE_LOCAL_EDITOR=true npm run setup:editor
npm install
npm run dev
```

## Validação

- **Testes**: Não há suite. Validação manual via `npm run demo`
- **Lint**: `npm run lint` antes de publicar
- **Build**: `npm run build` deve passar sem erros

## Versionamento

- **Semantic Versioning**: patch/minor/major
- **Tag Git**: Automático via `npm run version:*`
- **NPM**: Publicação automática após tag
