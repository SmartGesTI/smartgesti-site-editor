/**
 * Features - Features section component
 *
 * Grid of feature cards with icons.
 */

import { clsx } from 'clsx';
import {
  section,
  sectionPadding,
  container,
  sectionHeader,
  sectionTitle,
  sectionSubtitle,
  featuresGrid,
  featureCard,
  featureIcon,
  featureTitle,
  featureDescription,
} from '../../styles/site';
import type { FeaturesProps } from './types';

export function Features({
  id = 'features',
  className,
  title,
  subtitle,
  features,
  columns = 3,
}: FeaturesProps) {
  return (
    <section
      id={id}
      className={clsx(section, sectionPadding.lg, className)}
    >
      <div className={container}>
        {(title || subtitle) && (
          <div className={sectionHeader}>
            {title && <h2 className={sectionTitle}>{title}</h2>}
            {subtitle && <p className={sectionSubtitle}>{subtitle}</p>}
          </div>
        )}

        <div
          className={featuresGrid}
          style={{
            gridTemplateColumns: `repeat(${Math.min(columns, features.length)}, minmax(0, 1fr))`,
          }}
        >
          {features.map((feature, index) => (
            <div key={index} className={featureCard}>
              {feature.icon && (
                <div className={featureIcon}>
                  {feature.icon}
                </div>
              )}
              <h3 className={featureTitle}>{feature.title}</h3>
              <p className={featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
