/**
 * Hero - Hero section component
 *
 * Full-viewport hero section with title, subtitle, and CTAs.
 */

import { clsx } from 'clsx';
import {
  section,
  heroSection,
  heroContent,
  heroTitle,
  heroSubtitle,
  heroActions,
} from '../../styles/site';
import { Button } from './Button';
import type { HeroProps } from './types';

export function Hero({
  id = 'hero',
  className,
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  backgroundImage,
  alignment = 'center',
}: HeroProps) {
  const alignmentStyles = {
    left: { textAlign: 'left' as const, alignItems: 'flex-start' as const },
    center: { textAlign: 'center' as const, alignItems: 'center' as const },
    right: { textAlign: 'right' as const, alignItems: 'flex-end' as const },
  };

  return (
    <section
      id={id}
      className={clsx(section, heroSection, className)}
      style={{
        ...(backgroundImage && {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
    >
      <div
        className={heroContent}
        style={alignmentStyles[alignment]}
      >
        <h1 className={heroTitle}>{title}</h1>

        {subtitle && (
          <p className={heroSubtitle}>{subtitle}</p>
        )}

        {(ctaText || secondaryCtaText) && (
          <div className={heroActions}>
            {ctaText && (
              <Button variant="primary" size="lg" href={ctaHref}>
                {ctaText}
              </Button>
            )}
            {secondaryCtaText && (
              <Button variant="outline" size="lg" href={secondaryCtaHref}>
                {secondaryCtaText}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
