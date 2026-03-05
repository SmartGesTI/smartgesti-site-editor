# Padrões de Código - SmartGesti Site Editor

## Commits

- **Formato**: `tipo(escopo): descrição`
- **Tipos**: feat, fix, refactor, docs, style, test
- **Idioma**: SEMPRE em português
- **Detalhamento**: Commits descritivos e claros

## Regras Críticas

### Block Variations — NEVER Include Editable Props

**ERRADO** (sobrescreve imagem do usuário):
```typescript
defaultProps: { image: "placeholder.jpg", variant: "split" }
```

**CORRETO** (preserva imagem):
```typescript
defaultProps: { variant: "split", align: "left" }
```

**Por quê**: Variation switching faz merge de `defaultProps`, sobrescrevendo valores customizados. Visual props devem ser reset explicitamente via `HERO_VISUAL_PROPS_TO_RESET` em `VariationSelector.tsx`.

### React Hooks — ALL Before Early Returns

```typescript
// ERRADO
const Component = memo(({ block }) => {
  const data = useMemo(() => ..., [block]);
  if (!block) return null;           // early return
  const handler = useCallback(...);  // QUEBRA REGRAS DOS HOOKS
});

// CORRETO
const Component = memo(({ block }) => {
  const data = useMemo(() => ..., [block]);
  const handler = useCallback(...);  // antes do early return
  if (!block) return null;
});
```

### Adicionar Novos Blocos — Checklist

> Guia completo: [docs/CREATING-BLOCKS.md](docs/CREATING-BLOCKS.md)

1. Definir interface em `src/engine/schema/siteDocument.ts` + adicionar a `BlockType` + `Block` unions
2. Criar definição em `src/engine/registry/blocks/{category}/` com `componentRegistry.register()`
3. Exportar de `src/engine/registry/blocks/{category}/index.ts`
4. Criar React renderer em `src/engine/render/renderers/{category}/`
5. Criar HTML exporter em `src/engine/export/exporters/{category}/`
6. Registrar exporter em `src/engine/export/exporters/{category}/index.ts`
7. Adicionar a `src/index.ts` se for API pública

### Image Upload

Use `inputType: "image-upload"` (não `"image"`) em `inspectorMeta` para upload autenticado:

```typescript
inspectorMeta: {
  myImage: { label: "Image", inputType: "image-upload", group: "Mídia" }
}
```

### XSS Prevention

Sempre use `escapeHtml()` de `src/engine/export/shared/htmlHelpers.ts` ao gerar HTML em exporters.

### Navbar/Footer Special Handling

- Non-home pages podem herdar navbar/footer da home
- Navbar: CSS responsivo complexo (sticky, backdrop-filter blur, floating mode)
- CSS variables para customização (opacity, blur, colors)
- Layout variants: expanded, centered, compact

### renderPropertyInput Multi-Prop Pattern

`src/editor/PropertyEditor/renderPropertyInput.tsx` usa `context.allProps` + `context.onMultiUpdate` para inputs que manipulam múltiplas props simultaneamente (ex: `"image-grid"`).

## File Organization

Ver `.claude/rules/arquitetura.md` para estrutura completa de diretórios.

## Key Files

| Purpose | Path |
|---------|------|
| Schema | `src/engine/schema/siteDocument.ts` |
| Type utilities | `src/engine/schema/siteDocument.ts` (bottom) |
| Block registry | `src/engine/registry/registry.ts` |
| Type guards | `src/engine/shared/typeGuards.ts` |
| Export logic | `src/engine/export/exportHtml.ts` |
| Logger | `src/utils/logger.ts` |
| Vite config | `vite.config.ts` |
| ESLint config | `eslint.config.js` |
