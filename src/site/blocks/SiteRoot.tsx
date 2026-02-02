/**
 * SiteRoot - Root container for sites
 *
 * Applies base styles and theme variables.
 */

import { clsx } from 'clsx';
import type { ReactNode, CSSProperties } from 'react';
import { siteRoot } from '../../styles/site';
import type { SiteThemeTokens, PartialSiteThemeTokens } from '../../engine/theme';
import { generateSiteCSSVariablesObject, mergeSiteThemeTokens } from '../../engine/theme';

export interface SiteRootProps {
  children: ReactNode;
  className?: string;
  theme?: SiteThemeTokens | PartialSiteThemeTokens;
  style?: CSSProperties;
}

export function SiteRoot({
  children,
  className,
  theme,
  style,
}: SiteRootProps) {
  // Generate CSS variables from theme if provided
  const themeVariables = theme
    ? generateSiteCSSVariablesObject(
        'name' in theme ? theme : mergeSiteThemeTokens(theme)
      )
    : {};

  return (
    <div
      className={clsx(siteRoot, className)}
      style={{
        ...themeVariables,
        ...style,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
