/**
 * Navbar - Site navigation component
 *
 * Fixed navigation bar with brand, links, and CTA.
 */

import { clsx } from 'clsx';
import {
  navbar,
  navbarContent,
  navbarBrand,
  navbarLinks,
  navbarLink,
  container,
} from '../../styles/site';
import { Button } from './Button';
import type { NavbarProps } from './types';

interface NavLink {
  label?: string;
  text?: string;
  href: string;
}

export function Navbar({
  id,
  className,
  brand,
  links = [],
  ctaText,
  ctaHref,
}: NavbarProps) {
  return (
    <nav id={id} className={clsx(navbar, className)}>
      <div className={clsx(container, navbarContent)}>
        {/* Brand */}
        <a href="/" className={navbarBrand}>
          {brand}
        </a>

        {/* Navigation links */}
        {links.length > 0 && (
          <div className={navbarLinks}>
            {links.map((link: NavLink, index) => {
              const linkText = link.label || link.text || '';
              return (
                <a
                  key={index}
                  href={link.href}
                  className={navbarLink}
                >
                  {linkText}
                </a>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        {ctaText && (
          <Button variant="primary" size="sm" href={ctaHref}>
            {ctaText}
          </Button>
        )}
      </div>
    </nav>
  );
}
