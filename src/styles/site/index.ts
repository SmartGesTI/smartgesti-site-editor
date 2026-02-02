/**
 * Site Styles - Vanilla Extract
 *
 * Estilos isolados para os sites gerados pelo editor.
 * Usam CSS Variables que são injetadas pelo host application.
 */

// Token contract e tema base
export { siteVars } from './tokens.css';

// Base styles e reset
export { siteRoot } from './base.css';

// Section styles
export {
  // Layout
  section,
  sectionPadding,
  container,
  containerWidth,
  // Hero
  heroSection,
  heroContent,
  heroTitle,
  heroSubtitle,
  heroActions,
  // Buttons
  button,
  buttonVariant,
  buttonSize,
  // Features
  featuresGrid,
  featureCard,
  featureIcon,
  featureTitle,
  featureDescription,
  // Navbar
  navbar,
  navbarContent,
  navbarBrand,
  navbarLinks,
  navbarLink,
  // Footer
  footer,
  footerContent,
  footerSection,
  footerTitle,
  footerLink,
  footerCopyright,
  // Section Headers
  sectionHeader,
  sectionTitle,
  sectionSubtitle,
  // Cards
  card,
  cardHoverable,
  cardImage,
  cardContent,
  cardTitle,
  cardDescription,
} from './sections.css';
