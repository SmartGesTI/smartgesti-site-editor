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
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "grab",
      }}
    >
      {children}
    </div>
  );
}
