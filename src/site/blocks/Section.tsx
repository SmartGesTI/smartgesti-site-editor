/**
 * Section - Base container for site sections
 *
 * Provides consistent padding and container widths.
 */

import { clsx } from 'clsx';
import {
  section,
  sectionPadding,
  container,
  containerWidth,
} from '../../styles/site';
import type { SectionProps } from './types';

export function Section({
  id,
  className,
  children,
  padding = 'md',
  containerWidth: width = 'xl',
  background,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(section, sectionPadding[padding], className)}
      style={background ? { background } : undefined}
    >
      <div className={clsx(container, containerWidth[width])}>
        {children}
      </div>
    </section>
  );
}
