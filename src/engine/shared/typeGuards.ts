/**
 * Type guards para narrowing seguro de blocos
 */
import { Block, BlockType, BlockOfType } from "../schema/siteDocument";

/**
 * Type guard genérico — permite narrowing seguro de Block para tipo específico.
 *
 * @example
 * if (isBlockType(block, "hero")) {
 *   block.props.title; // TS knows this is HeroBlock
 * }
 */
export function isBlockType<T extends BlockType>(
  block: Block,
  type: T,
): block is BlockOfType<T> {
  return block.type === type;
}
