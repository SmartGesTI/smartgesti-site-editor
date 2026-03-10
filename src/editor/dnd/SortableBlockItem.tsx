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
    blockType: blockType as ExistingBlockDragData["blockType"],
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
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
