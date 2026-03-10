# Design: Drag & Drop de Blocos e Correcao de Insercao

**Data**: 2026-03-10
**Feature**: cf43eeb3-911e-493d-ad2e-c4af66b02de8
**Status**: Aprovado pelo Atlas

## Contexto

O editor tem 53+ blocos mas nenhum drag & drop implementado. dnd-kit esta instalado (`@dnd-kit/core@6.1.0`, `@dnd-kit/sortable@8.0.0`, `@dnd-kit/utilities@3.2.2`) mas sem uso. Blocos sao adicionados via click no BlockPalette e a insercao as vezes falha.

## Abordagem: dnd-kit no Sidebar (BlockSelector)

O Preview e um iframe isolado — cross-iframe D&D e impratico. O BlockSelector (sidebar) ja mostra a hierarquia exata dos blocos e e o local natural para reordenar.

## Componentes

### 1. Bug Fix — Insercao via Botao Adicionar

- `handleAddBlock` nao passa `position` — bloco sempre vai ao final
- Problema: navbar/footer no final da structure fazem o novo bloco aparecer depois do footer
- Fix: inserir antes do footer (calcular position adequada)

### 2. DndContext — Wrapping

- `DndContext` + `DragOverlay` envolvem o LeftPanel
- Permite drag entre BlockPalette -> BlockSelector
- Contexto interno ao editor (consumer nao precisa fazer wrapping)

### 3. BlockPalette — Drag Source

- Cada botao de bloco usa `useDraggable` com `data: { type: 'new-block', blockType }`
- Click continua funcionando (fallback)
- Visual: cursor grab, opacity 0.5 durante drag

### 4. BlockSelector — Sortable List + Drop Target

- `SortableContext` com `useSortable` em cada item
- Blocos existentes sao draggable + droppable (reordenar)
- Aceita drops de novos blocos do BlockPalette
- Constraints: navbar sempre primeiro, footer sempre ultimo (nao-moviveis)

### 5. Drop Indicator

- Linha horizontal azul (2px solid #3b82f6) entre blocos
- Aparece durante dragOver no gap mais proximo do cursor
- Desaparece ao sair ou cancelar

### 6. Drag Handle

- Icone GripVertical (lucide-react) no hover de cada bloco
- navbar/footer nao mostram handle (posicao fixa)

## Fluxo de Dados

```
Drag from BlockPalette:
  onDragEnd -> detectar blockType -> createBlockFromType -> PatchBuilder.addBlock(position) -> applyChange

Drag to reorder in BlockSelector:
  onDragEnd -> calcular newPosition -> PatchBuilder.moveBlock() -> applyChange
```

## Arquivos

| Arquivo | Acao |
|---------|------|
| `src/editor/dnd/DndEditorContext.tsx` | Novo — DndContext + DragOverlay wrapper |
| `src/editor/dnd/SortableBlock.tsx` | Novo — Item sortable do BlockSelector |
| `src/editor/dnd/DraggablePaletteItem.tsx` | Novo — Item draggable do BlockPalette |
| `src/editor/dnd/DropIndicator.tsx` | Novo — Linha visual de drop |
| `src/editor/BlockSelector.tsx` | Modificar — Integrar SortableContext |
| `src/editor/BlockPalette.tsx` | Modificar — Tornar items draggable |
| `src/editor/components/LeftPanel.tsx` | Modificar — Wrap com DndEditorContext |
| `src/hooks/useEditorState.ts` | Modificar — Adicionar handleMoveBlock + fix insertion |

## Restricoes

- navbar/footer: posicao fixa, nao-draggable
- Blocos unicos: nao duplicaveis via drag
- Undo/redo funciona naturalmente (patches passam pelo history)
- Sem mudancas no Preview/iframe — D&D e 100% no sidebar
