/**
 * Types for Site Blocks
 *
 * Define the props and interfaces for site section blocks.
 */

import type { ReactNode } from 'react';

/**
 * Base props for all site blocks
 */
export interface SiteBlockProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Section padding options
 */
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Container width options
 */
export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Section block props
 */
export interface SectionProps extends SiteBlockProps {
  padding?: SectionPadding;
  containerWidth?: ContainerWidth;
  background?: string;
}

/**
 * Hero section props
 */
export interface HeroProps extends SiteBlockProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Button props
 */
export interface SiteButtonProps extends SiteBlockProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Feature item props
 */
export interface FeatureItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

/**
 * Features section props
 */
export interface FeaturesProps extends SiteBlockProps {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

/**
 * Navbar link item
 */
export interface NavbarLink {
  label: string;
  href: string;
}

/**
 * Navbar props
 */
export interface NavbarProps extends SiteBlockProps {
  brand: string | ReactNode;
  links?: NavbarLink[];
  ctaText?: string;
  ctaHref?: string;
}

/**
 * Footer link group
 */
export interface FooterLinkGroup {
  title: string;
  links: NavbarLink[];
}

/**
 * Footer props
 */
export interface FooterProps extends SiteBlockProps {
  brand?: string | ReactNode;
  linkGroups?: FooterLinkGroup[];
  copyright?: string;
}

/**
 * Card props
 */
export interface CardProps extends SiteBlockProps {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  hoverable?: boolean;
}

/**
 * Section header props
 */
export interface SectionHeaderProps extends SiteBlockProps {
  title: string;
  subtitle?: string;
}
