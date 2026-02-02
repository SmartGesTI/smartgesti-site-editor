/**
 * Footer - Site footer component
 *
 * Footer with link groups and copyright.
 */

import { clsx } from 'clsx';
import {
  footer,
  footerContent,
  footerSection,
  footerTitle,
  footerLink,
  footerCopyright,
  section,
  sectionPadding,
  container,
  navbarBrand,
} from '../../styles/site';
import type { FooterProps } from './types';

export function Footer({
  id = 'footer',
  className,
  brand,
  linkGroups = [],
  copyright,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} All rights reserved.`;

  return (
    <footer
      id={id}
      className={clsx(footer, section, sectionPadding.lg, className)}
    >
      <div className={container}>
        <div className={footerContent}>
          {/* Brand column */}
          {brand && (
            <div className={footerSection}>
              <a href="/" className={navbarBrand}>
                {brand}
              </a>
            </div>
          )}

          {/* Link groups */}
          {linkGroups.map((group, index) => (
            <div key={index} className={footerSection}>
              <span className={footerTitle}>{group.title}</span>
              {group.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className={footerLink}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <p className={footerCopyright}>
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
