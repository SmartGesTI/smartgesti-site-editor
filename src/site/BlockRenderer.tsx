/**
 * BlockRenderer - Renders site blocks dynamically
 *
 * Maps block types to their React components and renders them
 * with the appropriate props.
 */

import type { ComponentType } from 'react';
import { Hero, Features, Navbar, Footer, Section, Card } from './blocks';

/**
 * Block data structure from the site document
 */
export interface BlockData {
  id: string;
  type: string;
  props: Record<string, any>;
}

/**
 * Registry of block type to component mapping
 */
const blockComponents: Record<string, ComponentType<any>> = {
  hero: Hero,
  features: Features,
  navbar: Navbar,
  footer: Footer,
  section: Section,
  card: Card,
};

/**
 * Register a custom block component
 */
export function registerBlockComponent(
  type: string,
  component: ComponentType<any>
): void {
  blockComponents[type] = component;
}

/**
 * Get a block component by type
 */
export function getBlockComponent(type: string): ComponentType<any> | undefined {
  return blockComponents[type];
}

/**
 * BlockRenderer props
 */
export interface BlockRendererProps {
  block: BlockData;
  fallback?: ComponentType<{ block: BlockData }>;
}

/**
 * Default fallback component for unknown block types
 */
function DefaultFallback({ block }: { block: BlockData }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          padding: '1rem',
          border: '1px dashed #ccc',
          borderRadius: '0.5rem',
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        Unknown block type: <strong>{block.type}</strong>
        <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          {JSON.stringify(block.props, null, 2)}
        </pre>
      </div>
    );
  }
  return null;
}

/**
 * BlockRenderer - Renders a single block
 *
 * @example
 * ```tsx
 * <BlockRenderer
 *   block={{
 *     id: 'hero-1',
 *     type: 'hero',
 *     props: {
 *       title: 'Welcome',
 *       subtitle: 'To our site',
 *     },
 *   }}
 * />
 * ```
 */
export function BlockRenderer({
  block,
  fallback: Fallback = DefaultFallback,
}: BlockRendererProps) {
  const Component = blockComponents[block.type];

  if (!Component) {
    return <Fallback block={block} />;
  }

  return <Component id={block.id} {...block.props} />;
}

/**
 * BlockListRenderer - Renders a list of blocks
 */
export interface BlockListRendererProps {
  blocks: BlockData[];
  fallback?: ComponentType<{ block: BlockData }>;
}

export function BlockListRenderer({
  blocks,
  fallback,
}: BlockListRendererProps) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} fallback={fallback} />
      ))}
    </>
  );
}
