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
  onAddBlock: (
    blockType: BlockType,
    parentBlockId?: string,
    position?: number,
  ) => void;
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
        onAddBlock(dragData.blockType, undefined, targetIndex);
      } else if (dragData.origin === "selector") {
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

  const overlayContent = activeDrag ? (
    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-500 text-sm pointer-events-none">
      <span className="text-lg">
        {getBlockIcon(activeDrag.blockType)}
      </span>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {componentRegistry.get(activeDrag.blockType)?.name ||
          activeDrag.blockType}
      </span>
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
          ? React.cloneElement(
              child as React.ReactElement<Record<string, unknown>>,
              { overIndex, activeDrag },
            )
          : child,
      )}
      <DragOverlay dropAnimation={null}>{overlayContent}</DragOverlay>
    </DndContext>
  );
}
