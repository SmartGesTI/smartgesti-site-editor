/**
 * Navbar - Site navigation component with dropdown support
 *
 * Fixed navigation bar with brand, links, dropdowns, and CTA.
 */

import { clsx } from 'clsx';
import { useState } from 'react';
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
  submenu?: Array<{
    text: string;
    href: string;
    description?: string;
  }>;
}

export function Navbar({
  id,
  className,
  brand,
  links = [],
  ctaText,
  ctaHref,
}: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

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
              const hasSubmenu = link.submenu && link.submenu.length > 0;

              if (!hasSubmenu) {
                return (
                  <a
                    key={index}
                    href={link.href}
                    className={navbarLink}
                  >
                    {linkText}
                  </a>
                );
              }

              return (
                <div
                  key={index}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={link.href}
                    className={navbarLink}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {linkText}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ transition: 'transform 0.2s', transform: openDropdown === index ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <path d="M6 8L2 4h8z"/>
                    </svg>
                  </a>

                  {/* Dropdown menu */}
                  {openDropdown === index && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        minWidth: '200px',
                        zIndex: 1000,
                      }}
                    >
                      {link.submenu!.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.href}
                          style={{
                            display: 'block',
                            padding: item.description ? '0.875rem 1rem' : '0.625rem 1rem',
                            textDecoration: 'none',
                            color: '#1f2937',
                            transition: 'background-color 0.2s',
                            borderRadius: '0.375rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {item.description ? (
                            <>
                              <strong style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {item.text}
                              </strong>
                              <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>
                                {item.description}
                              </span>
                            </>
                          ) : (
                            item.text
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
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
