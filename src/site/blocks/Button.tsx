/**
 * Button - Site button component
 *
 * Supports multiple variants and sizes.
 */

import { clsx } from 'clsx';
import { button, buttonVariant, buttonSize } from '../../styles/site';
import type { SiteButtonProps } from './types';

export function Button({
  className,
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
}: SiteButtonProps) {
  const classes = clsx(
    button,
    buttonVariant[variant],
    buttonSize[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
