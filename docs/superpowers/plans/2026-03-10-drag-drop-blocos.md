# Drag & Drop de Blocos e Correcao de Insercao — Plano de Implementacao

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar drag & drop de blocos no editor (arrastar do catalogo + reordenar) e corrigir bug de insercao.

**Architecture:** dnd-kit no sidebar (BlockSelector) como sortable list + BlockPalette items como drag sources. DndContext wraps LeftPanel internamente. PatchBuilder.moveBlock() e addBlock(position) ja existem — apenas conectar a UI.

**Tech Stack:** @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, React, TypeScript

---

## Chunk 1: Bug Fix + Infraestrutura D&D

### Task 1: Corrigir bug de insercao via botao Adicionar

**Files:**
- Modify: `src/hooks/useEditorState.ts:205-231`

**Problema:** `handleAddBlock` sempre insere no final da structure. Se o ultimo bloco e um footer, o novo bloco fica invisivel (abaixo do footer).

- [ ] **Step 1: Analisar o fluxo atual**

Verificar em `useEditorState.ts` linha 205-231: `handleAddBlock` chama `PatchBuilder.addBlock(document, pageId, newBlock, parentBlockId, position)` sem passar `position`. O `PatchBuilder.addBlock` usa `page.structure.length` como default — appending ao final.

- [ ] **Step 2: Implementar calculo de position inteligente**

Em `src/hooks/useEditorState.ts`, modificar `handleAddBlock` para calcular position antes do footer:

```typescript
const handleAddBlock = useCallback(
  (blockType: BlockType, parentBlockId?: string, position?: number) => {
    if (!document || !currentPage) return;

    try {
      const newBlock = createBlockFromType(blockType);
      if (!newBlock) {
        logger.error("[handleAddBlock] Failed to create block:", blockType);
        return;
      }

      // Se position nao foi especificada e nao tem parentBlockId,
      // inserir antes do footer (se existir)
      let insertPosition = position;
      if (insertPosition === undefined && !parentBlockId) {
        const structure = currentPage.structure || [];
        const lastBlock = structure[structure.length - 1];
        if (lastBlock?.type === "footer") {
          insertPosition = structure.length - 1;
        }
        // Se nao tem footer, deixa undefined (append ao final)
      }

      const patch = PatchBuilder.addBlock(
        document,
        currentPage.id,
        newBlock,
        parentBlockId,
        insertPosition,
      );

      applyChange(patch, `Add ${blockType} block`);
      setSelectedBlockId(newBlock.id);
    } catch (error) {
      logger.error("[handleAddBlock] Error adding block:", error);
    }
  },
  [currentPage, document, createBlockFromType, applyChange],
);
```

- [ ] **Step 3: Testar manualmente**

Run: `npm run demo`
Verificar: adicionar bloco via BlockPalette — deve aparecer antes do footer.

- [ ] **Step 4: Verificar build**

Run: `npm run build && npm run lint`
Expected: sem erros

---

### Task 2: Criar DndEditorContext (wrapper de D&D)

**Files:**
- Create: `src/editor/dnd/DndEditorContext.tsx`
- Create: `src/editor/dnd/types.ts`
- Create: `src/editor/dnd/index.ts`

- [ ] **Step 1: Criar types de D&D**

```typescript
// src/editor/dnd/types.ts
import { BlockType } from "../../engine";

/** Data attached to a draggable new block from palette */
export interface NewBlockDragData {
  origin: "palette";
  blockType: BlockType;
}

/** Data attached to a draggable existing block */
export interface ExistingBlockDragData {
  origin: "selector";
  blockId: string;
  blockType: BlockType;
  index: number;
}

export type DragData = NewBlockDragData | ExistingBlockDragData;

/** IDs fixos que nao podem ser movidos */
export const FIXED_BLOCK_TYPES = new Set(["navbar", "footer"]);
```

- [ ] **Step 2: Criar DndEditorContext**

```typescript
// src/editor/dnd/DndEditorContext.tsx
import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { BlockType } from "../../engine";
import { componentRegistry } from "../../engine";
import { getBlockIcon } from "../../utils/blockIcons";
import type { DragData } from "./types";

interface DndEditorContextProps {
  children: React.ReactNode;
  onAddBlock: (blockType: BlockType, parentBlockId?: string, position?: number) => void;
  onMoveBlock: (blockId: string, newPosition: number) => void;
}

export function DndEditorContext({
  children,
  onAddBlock,
  onMoveBlock,
}: DndEditorContextProps) {
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData;
    setActiveDrag(data);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (!event.over) {
      setOverIndex(null);
      return;
    }
    const overData = event.over.data.current;
    if (overData && typeof overData.index === "number") {
      setOverIndex(overData.index);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDrag(null);
      setOverIndex(null);

      if (!over) return;

      const dragData = active.data.current as DragData;
      const overData = over.data.current as { index: number } | undefined;
      const targetIndex = overData?.index ?? 0;

      if (dragData.origin === "palette") {
        // Novo bloco do catalogo
        onAddBlock(dragData.blockType, undefined, targetIndex);
      } else if (dragData.origin === "selector") {
        // Reordenar bloco existente
        if (dragData.index !== targetIndex) {
          onMoveBlock(dragData.blockId, targetIndex);
        }
      }
    },
    [onAddBlock, onMoveBlock],
  );

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
    setOverIndex(null);
  }, []);

  // Overlay content durante drag
  const overlayContent = activeDrag ? (
    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-500 text-sm pointer-events-none">
      {activeDrag.origin === "palette" ? (
        <>
          <span className="text-lg">{getBlockIcon(activeDrag.blockType)}</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {componentRegistry.get(activeDrag.blockType)?.name || activeDrag.blockType}
          </span>
        </>
      ) : (
        <>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {componentRegistry.get(activeDrag.blockType)?.name || activeDrag.blockType}
          </span>
        </>
      )}
    </div>
  ) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { overIndex, activeDrag })
          : child
      )}
      <DragOverlay dropAnimation={null}>
        {overlayContent}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 3: Criar barrel export**

```typescript
// src/editor/dnd/index.ts
export { DndEditorContext } from "./DndEditorContext";
export type { DragData, NewBlockDragData, ExistingBlockDragData } from "./types";
export { FIXED_BLOCK_TYPES } from "./types";
```

- [ ] **Step 4: Verificar build**

Run: `npm run build && npm run lint`

---

### Task 3: Criar DraggablePaletteItem

**Files:**
- Create: `src/editor/dnd/DraggablePaletteItem.tsx`
- Modify: `src/editor/BlockPalette.tsx`

- [ ] **Step 1: Criar componente DraggablePaletteItem**

```typescript
// src/editor/dnd/DraggablePaletteItem.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { BlockType } from "../../engine";
import type { NewBlockDragData } from "./types";

interface DraggablePaletteItemProps {
  blockType: BlockType;
  children: React.ReactNode;
  disabled?: boolean;
}

export function DraggablePaletteItem({
  blockType,
  children,
  disabled,
}: DraggablePaletteItemProps) {
  const dragData: NewBlockDragData = {
    origin: "palette",
    blockType,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${blockType}`,
    data: dragData,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: disabled ? "not-allowed" : "grab" }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Exportar de index.ts**

Adicionar em `src/editor/dnd/index.ts`:
```typescript
export { DraggablePaletteItem } from "./DraggablePaletteItem";
```

- [ ] **Step 3: Integrar no BlockPalette**

Modificar `src/editor/BlockPalette.tsx`: envolver cada botao de bloco com `DraggablePaletteItem`. O click continua funcionando como fallback.

Substituir o `<button>` no map de blocks (linhas 151-175) por:

```tsx
import { DraggablePaletteItem } from "./dnd";

// Dentro do map:
<DraggablePaletteItem
  key={def.type}
  blockType={def.type}
  disabled={!!alreadyExists}
>
  <button
    onClick={() => !alreadyExists && handleAddBlock(def.type)}
    disabled={!!alreadyExists}
    className={cn(/* classes existentes */)}
    title={alreadyExists ? `${def.name} ja existe na pagina` : def.description}
  >
    <div className="text-2xl">{getBlockIcon(def.type)}</div>
    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
      {def.name}
    </div>
  </button>
</DraggablePaletteItem>
```

- [ ] **Step 4: Verificar build**

Run: `npm run build && npm run lint`

---

## Chunk 2: Sortable BlockSelector + Drop Indicator

### Task 4: Criar SortableBlockItem e DropIndicator

**Files:**
- Create: `src/editor/dnd/SortableBlockItem.tsx`
- Create: `src/editor/dnd/DropIndicator.tsx`

- [ ] **Step 1: Criar DropIndicator**

```typescript
// src/editor/dnd/DropIndicator.tsx
import React from "react";

interface DropIndicatorProps {
  isVisible: boolean;
}

export function DropIndicator({ isVisible }: DropIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="relative h-1 my-0.5">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 rounded-full" />
      <div className="absolute left-0 top-[-3px] w-2 h-2 bg-blue-500 rounded-full" />
      <div className="absolute right-0 top-[-3px] w-2 h-2 bg-blue-500 rounded-full" />
    </div>
  );
}
```

- [ ] **Step 2: Criar SortableBlockItem**

```typescript
// src/editor/dnd/SortableBlockItem.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "../../utils/cn";
import { FIXED_BLOCK_TYPES } from "./types";
import { DropIndicator } from "./DropIndicator";
import type { ExistingBlockDragData } from "./types";

interface SortableBlockItemProps {
  id: string;
  blockType: string;
  index: number;
  isOver: boolean;
  children: React.ReactNode;
}

export function SortableBlockItem({
  id,
  blockType,
  index,
  isOver,
  children,
}: SortableBlockItemProps) {
  const isFixed = FIXED_BLOCK_TYPES.has(blockType);

  const dragData: ExistingBlockDragData = {
    origin: "selector",
    blockId: id,
    blockType: blockType as any,
    index,
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: dragData,
    disabled: isFixed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DropIndicator isVisible={isOver} />
      <div className="flex items-center group/sortable">
        {/* Drag handle */}
        {!isFixed && (
          <div
            {...attributes}
            {...listeners}
            className={cn(
              "flex-shrink-0 w-5 flex items-center justify-center cursor-grab",
              "opacity-0 group-hover/sortable:opacity-60 hover:!opacity-100 transition-opacity",
            )}
          >
            <GripVertical className="w-3.5 h-3.5 text-gray-400" />
          </div>
        )}
        <div className={cn("flex-1 min-w-0", !isFixed && "ml-0")}>
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Exportar de index.ts**

Atualizar `src/editor/dnd/index.ts`:
```typescript
export { DndEditorContext } from "./DndEditorContext";
export { DraggablePaletteItem } from "./DraggablePaletteItem";
export { SortableBlockItem } from "./SortableBlockItem";
export { DropIndicator } from "./DropIndicator";
export type { DragData, NewBlockDragData, ExistingBlockDragData } from "./types";
export { FIXED_BLOCK_TYPES } from "./types";
```

- [ ] **Step 4: Verificar build**

Run: `npm run build && npm run lint`

---

### Task 5: Integrar SortableContext no BlockSelector

**Files:**
- Modify: `src/editor/BlockSelector.tsx`

- [ ] **Step 1: Refatorar BlockSelector para usar SortableContext**

Modificar `src/editor/BlockSelector.tsx`:

1. Importar `SortableContext` e `verticalListSortingStrategy` de `@dnd-kit/sortable`
2. Importar `useDroppable` de `@dnd-kit/core` (para aceitar drops do palette)
3. Envolver a lista de blocos com `SortableContext`
4. Substituir cada item por `SortableBlockItem`

Mudancas principais:

```tsx
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableBlockItem } from "./dnd";

// No componente BlockSelector, adicionar props:
interface BlockSelectorProps {
  structure: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  overIndex?: number | null; // indice do drop indicator
}

// Dentro do componente:
const blockIds = useMemo(
  () => validStructure.map((b) => b.id),
  [validStructure]
);

// Na lista, usar SortableContext:
<SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
  {validStructure.map((block, index) => (
    <SortableBlockItem
      key={block.id}
      id={block.id}
      blockType={block.type}
      index={index}
      isOver={overIndex === index}
    >
      {/* conteudo existente do renderBlockTree para depth=0 */}
      {renderBlockTree(block, 0, selectedBlockId, onSelectBlock, onDeleteBlock)}
    </SortableBlockItem>
  ))}
</SortableContext>
```

- [ ] **Step 2: Adicionar zona de drop no final da lista**

Usar `useDroppable` para criar uma zona de drop no final da lista (para inserir apos o ultimo bloco):

```tsx
function EndDropZone({ index }: { index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "end-drop-zone",
    data: { index },
  });

  return (
    <div ref={setNodeRef} className="h-8 mt-1">
      {isOver && (
        <div className="h-0.5 bg-blue-500 rounded-full mx-2" />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build && npm run lint`

---

## Chunk 3: Wiring + handleMoveBlock

### Task 6: Adicionar handleMoveBlock e conectar DndContext

**Files:**
- Modify: `src/hooks/useEditorState.ts`
- Modify: `src/editor/components/LeftPanel.tsx`
- Modify: `src/editor/LandingPageEditor.tsx`

- [ ] **Step 1: Adicionar handleMoveBlock ao useEditorState**

Em `src/hooks/useEditorState.ts`, adicionar:

```typescript
// Mover bloco (reordenar)
const handleMoveBlock = useCallback(
  (blockId: string, newPosition: number) => {
    if (!document || !currentPage) return;

    try {
      const patch = PatchBuilder.moveBlock(
        document,
        currentPage.id,
        blockId,
        null, // root level
        newPosition,
      );
      applyChange(patch, "Move block");
    } catch (error) {
      logger.error("[handleMoveBlock] Error moving block:", error);
    }
  },
  [document, currentPage, applyChange],
);
```

Adicionar `handleMoveBlock` ao return do hook e a `UseEditorStateReturn`.

- [ ] **Step 2: Wrappear LeftPanel com DndEditorContext**

Em `src/editor/components/LeftPanel.tsx`:

```tsx
import { DndEditorContext } from "../dnd";

// Adicionar prop:
interface LeftPanelProps {
  // ... existentes ...
  onMoveBlock: (blockId: string, newPosition: number) => void;
}

// No JSX, envolver o conteudo com DndEditorContext:
return (
  <DndEditorContext onAddBlock={onAddBlock} onMoveBlock={onMoveBlock}>
    <div className="w-64 flex-shrink-0 ...">
      {/* conteudo existente */}
    </div>
  </DndEditorContext>
);
```

- [ ] **Step 3: Passar handleMoveBlock do LandingPageEditor**

Em `src/editor/LandingPageEditor.tsx` linha 354-362, adicionar:

```tsx
<LeftPanel
  currentPage={currentPage}
  selectedBlockId={selectedBlockId}
  isPaletteSelected={isPaletteSelected}
  onSelectBlock={(id) => { setSelectedBlockId(id); setFocusedGroup(null); }}
  onDeleteBlock={handleDeleteBlock}
  onAddBlock={handleAddBlock}
  onMoveBlock={handleMoveBlock}  // NOVO
  activePlugins={activePlugins}
/>
```

- [ ] **Step 4: Verificar build e testar**

Run: `npm run build && npm run lint`
Run: `npm run demo`

Testes manuais:
1. Arrastar bloco do catalogo para a lista — deve inserir na posicao correta
2. Arrastar bloco existente para reordenar — deve mover
3. Click no catalogo continua funcionando
4. navbar/footer nao sao arrastavel
5. Undo/redo funciona apos drag operations
6. Drop indicator aparece entre blocos

---

### Task 7: Validacao final e cleanup

**Files:**
- Verify: `src/editor/dnd/*.tsx` — todos os arquivos novos
- Verify: `src/editor/BlockSelector.tsx` — integracao sortable
- Verify: `src/editor/BlockPalette.tsx` — integracao draggable

- [ ] **Step 1: Testar todos os cenarios**

Run: `npm run demo`

Checklist:
- [ ] Insercao via botao funciona para todos os tipos de bloco
- [ ] Bloco inserido aparece antes do footer
- [ ] Drag do catalogo para posicao especifica
- [ ] Drop indicator (linha azul) aparece corretamente
- [ ] Reordenacao de blocos existentes
- [ ] Undo/redo funciona apos drag
- [ ] navbar/footer nao sao arrastavel (drag handle oculto)
- [ ] Blocos unicos respeitam constraints (nao duplicam via drag)

- [ ] **Step 2: Build e lint final**

Run: `npm run build && npm run lint`
Expected: zero errors, zero warnings criticos

- [ ] **Step 3: Commit**

```bash
git add src/editor/dnd/ src/editor/BlockSelector.tsx src/editor/BlockPalette.tsx src/editor/components/LeftPanel.tsx src/hooks/useEditorState.ts src/editor/LandingPageEditor.tsx
git commit -m "feat(editor): drag & drop de blocos e correcao de insercao"
```
