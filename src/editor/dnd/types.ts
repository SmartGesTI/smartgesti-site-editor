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

/** Block types with fixed positions (not draggable) */
export const FIXED_BLOCK_TYPES = new Set(["navbar", "footer"]);
