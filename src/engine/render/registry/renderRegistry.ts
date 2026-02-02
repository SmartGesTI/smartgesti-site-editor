/**
 * Render Registry
 * Sistema de registro de renderizadores de blocos
 */

import { Block, BlockType } from "../../schema/siteDocument";

export type BlockRenderer = (block: any, depth: number) => React.ReactNode;

/**
 * Registry de renderizadores
 * Lookup O(1) via Map
 */
class RenderRegistryImpl {
  private renderers = new Map<BlockType, BlockRenderer>();

  register(type: BlockType, renderer: BlockRenderer): void {
    if (this.renderers.has(type)) {
      console.warn(`Renderer for ${type} already registered. Overwriting.`);
    }
    this.renderers.set(type, renderer);
  }

  get(type: BlockType): BlockRenderer | undefined {
    return this.renderers.get(type);
  }

  getAll(): Array<[BlockType, BlockRenderer]> {
    return Array.from(this.renderers.entries());
  }

  has(type: BlockType): boolean {
    return this.renderers.has(type);
  }

  clear(): void {
    this.renderers.clear();
  }
}

export const renderRegistry = new RenderRegistryImpl();
