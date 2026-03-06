# Fix Controles do Lightbox — Dot-Notation Props Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fazer os controles do Lightbox (setas, miniaturas, zoom, etc.) respeitarem as configuracoes do painel de propriedades do editor.

**Architecture:** O inspectorMeta do imageGallery usa dot-notation para props aninhadas (ex: `"lightbox.showArrows"`), mas o BlockPropertyEditor le/escreve props como chaves flat. O fix adiciona suporte a dot-notation em dois pontos: leitura de valores (getter) e escrita via PatchBuilder (setter). Abordagem minimalista — helper functions inline, sem abstractions desnecessarias.

**Tech Stack:** React, TypeScript, JSON Patch

**Root Cause:**
1. `BlockPropertyEditor.tsx:131` — `props[propName]` le `props["lightbox.showArrows"]` = undefined (deveria ler `props.lightbox.showArrows`)
2. `BlockPropertyEditor.tsx:161` — `onUpdate({ [propName]: value })` envia `{ "lightbox.showArrows": false }` como chave flat
3. `PatchBuilder.ts:117` — cria path `props/lightbox.showArrows` ao inves de `props/lightbox/showArrows`
4. Lightbox recebe `config={props.lightbox}` — objeto nested nunca atualizado

---

### Task 1: Fix leitura de dot-notation no BlockPropertyEditor

**Files:**
- Modify: `src/editor/PropertyEditor/BlockPropertyEditor.tsx:104-155`

**Context:**
O `groupedProps` useMemo itera `blockDefinition.inspectorMeta` e le valores com `props[propName]`. Quando `propName` e `"lightbox.showArrows"`, isso retorna `undefined` porque a prop real esta em `props.lightbox.showArrows`.

**Step 1: Adicionar helper `getNestedValue` dentro do useMemo**

No bloco `groupedProps` (linha ~105), antes do loop `for`, adicionar:

```typescript
// Helper para ler props com dot-notation (ex: "lightbox.showArrows" → props.lightbox.showArrows)
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  if (!path.includes('.')) return obj[path];
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
};
```

**Step 2: Atualizar leitura de `currentValue` e `defaultValue`**

Substituir a linha 131:
```typescript
// ANTES:
const currentValue = props[propName];
```

Por:
```typescript
// DEPOIS:
const currentValue = getNestedValue(props, propName);
```

E substituir o fallback na linha 135:
```typescript
// ANTES:
let value = shouldUseFallback ? defaultProps[propName] : currentValue;
```

Por:
```typescript
// DEPOIS:
let value = shouldUseFallback ? getNestedValue(defaultProps, propName) : currentValue;
```

**Step 3: Validar build**

```bash
npm run build && npm run lint
```

Esperado: Build sem erros. O editor agora LE os valores corretos das props aninhadas do Lightbox.

---

### Task 2: Fix escrita de dot-notation no PatchBuilder

**Files:**
- Modify: `src/engine/patch/PatchBuilder.ts:100-128`

**Context:**
`updateBlockProps` itera `Object.entries(updates)` e cria patch paths com `${blockInfo.path}/props/${propName}`. Quando `propName` e `"lightbox.showArrows"`, gera path `props/lightbox.showArrows` (literal) ao inves de `props/lightbox/showArrows` (nested).

O JSON Patch RFC 6901 usa `/` como separador de path. Basta converter `.` em `/` no propName para paths aninhados.

**Step 1: Atualizar `updateBlockProps` para expandir dot-notation**

Na linha 116-124, substituir:

```typescript
// ANTES:
for (const [propName, value] of Object.entries(updates)) {
  const propPath = `${blockInfo.path}/props/${propName}`

  // Se a propriedade ja existe, usar replace; caso contrario, usar add
  if (propName in existingProps) {
    patches.push({ op: 'replace', path: propPath, value })
  } else {
    patches.push({ op: 'add', path: propPath, value })
  }
}
```

Por:

```typescript
// DEPOIS:
for (const [propName, value] of Object.entries(updates)) {
  // Expandir dot-notation: "lightbox.showArrows" → "lightbox/showArrows"
  const expandedName = propName.replace(/\./g, '/')
  const propPath = `${blockInfo.path}/props/${expandedName}`

  // Verificar existencia considerando nested path
  const parts = propName.split('.')
  let exists = true
  let current: any = existingProps
  for (const part of parts) {
    if (current == null || !(part in current)) {
      exists = false
      break
    }
    current = current[part]
  }

  if (exists) {
    patches.push({ op: 'replace', path: propPath, value })
  } else {
    patches.push({ op: 'add', path: propPath, value })
  }
}
```

**Step 2: Aplicar mesma logica em `updateBlockProp` (singular)**

Na linha 81-95, o metodo `updateBlockProp` tambem precisa do fix:

```typescript
// ANTES (linha 93):
const propPath = `${blockInfo.path}/props/${propName}`
```

```typescript
// DEPOIS:
const propPath = `${blockInfo.path}/props/${propName.replace(/\./g, '/')}`
```

**Step 3: Validar build**

```bash
npm run build && npm run lint
```

Esperado: Build sem erros. O PatchBuilder agora gera JSON Patch paths corretos para props aninhadas.

---

### Task 3: Fix escrita de dot-notation no BlockPropertyEditor (handlePropChange)

**Files:**
- Modify: `src/editor/PropertyEditor/BlockPropertyEditor.tsx:161-168`

**Context:**
Alem do PatchBuilder, o `handlePropChange` passa `{ [propName]: value }` para `onUpdate`. Quando `propName` e `"lightbox.showArrows"`, isso cria `{ "lightbox.showArrows": false }` — uma chave flat.

O `onUpdate` chama `handleUpdateBlockById` que passa esse objeto para `PatchBuilder.updateBlockProps`. Com o fix da Task 2, o PatchBuilder ja sabe expandir dot-notation. Entao **esta task e apenas uma verificacao** — o fluxo ja funciona com as mudancas anteriores.

**Step 1: Verificar que o fluxo funciona end-to-end**

O `handlePropChange` envia:
```typescript
onUpdate({ "lightbox.showArrows": false })
```

Isso chega em `PatchBuilder.updateBlockProps(doc, pageId, blockId, { "lightbox.showArrows": false })`.

Com o fix da Task 2, o PatchBuilder converte `"lightbox.showArrows"` em path `props/lightbox/showArrows`.

**Nenhuma mudanca necessaria nesta task** — o fix do PatchBuilder cobre o fluxo.

---

### Task 4: Build final e validacao

**Files:**
- Verificar: `src/editor/PropertyEditor/BlockPropertyEditor.tsx`
- Verificar: `src/engine/patch/PatchBuilder.ts`

**Step 1: Build completo**

```bash
npm run build && npm run lint
```

Esperado: Zero erros de build, zero novos warnings de lint.

**Step 2: Verificacao manual (npm run demo)**

1. Adicionar bloco ImageGallery
2. No painel de propriedades, abrir grupo "Lightbox - Navegacao"
3. Desmarcar "Mostrar Setas" (lightbox.showArrows)
4. Desmarcar "Mostrar Miniaturas" (lightbox.showThumbnails)
5. Desmarcar "Mostrar Contador" (lightbox.showCounter)
6. Clicar em uma imagem para abrir o Lightbox
7. Verificar que setas, miniaturas e contador NAO aparecem
8. Reativar "Mostrar Setas"
9. Verificar que setas APARECEM no Lightbox

**Step 3: Verificar export HTML**

1. No demo, exportar a pagina como HTML
2. Abrir o HTML exportado
3. Verificar que as configuracoes do Lightbox sao respeitadas no HTML standalone

---

## Resumo de Mudancas

| Arquivo | Mudanca | Linhas |
|---------|---------|--------|
| `BlockPropertyEditor.tsx` | Helper `getNestedValue` + uso na leitura | ~15 linhas |
| `PatchBuilder.ts` | Expansao dot-notation em `updateBlockProps` e `updateBlockProp` | ~15 linhas |

**Total: ~30 linhas de codigo**. Fix cirurgico, sem refactoring desnecessario.
