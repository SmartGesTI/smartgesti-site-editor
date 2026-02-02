/**
 * SectionHeader - Section header with title and subtitle
 *
 * Centered header for sections.
 */

import { clsx } from 'clsx';
import {
  sectionHeader,
  sectionTitle,
  sectionSubtitle,
} from '../../styles/site';
import type { SectionHeaderProps } from './types';

export function SectionHeader({
  className,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className={clsx(sectionHeader, className)}>
      <h2 className={sectionTitle}>{title}</h2>
      {subtitle && (
        <p className={sectionSubtitle}>{subtitle}</p>
      )}
    </div>
  );
}
