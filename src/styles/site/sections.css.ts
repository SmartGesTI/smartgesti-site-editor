import { style, styleVariants } from '@vanilla-extract/css';
import { siteVars } from './tokens.css';

/**
 * Estilos de seções do site
 *
 * Cada seção é uma unidade completa com padding consistente
 * e estrutura interna flexível.
 */

// Container base de seção
export const section = style({
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
});

// Variantes de padding
export const sectionPadding = styleVariants({
  none: { padding: 0 },
  sm: {
    paddingTop: siteVars.spacing.xl,
    paddingBottom: siteVars.spacing.xl,
  },
  md: {
    paddingTop: siteVars.spacing['2xl'],
    paddingBottom: siteVars.spacing['2xl'],
  },
  lg: {
    paddingTop: siteVars.spacing['3xl'],
    paddingBottom: siteVars.spacing['3xl'],
  },
});

// Container interno (max-width)
export const container = style({
  width: '100%',
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: siteVars.spacing.md,
  paddingRight: siteVars.spacing.md,
  '@media': {
    '(min-width: 768px)': {
      paddingLeft: siteVars.spacing.lg,
      paddingRight: siteVars.spacing.lg,
    },
    '(min-width: 1024px)': {
      paddingLeft: siteVars.spacing.xl,
      paddingRight: siteVars.spacing.xl,
    },
  },
});

// Variantes de largura do container
export const containerWidth = styleVariants({
  sm: { maxWidth: '640px' },
  md: { maxWidth: '768px' },
  lg: { maxWidth: '1024px' },
  xl: { maxWidth: '1280px' },
  full: { maxWidth: 'none' },
});

// === HERO SECTION ===

export const heroSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  '@media': {
    '(min-width: 768px)': {
      minHeight: '90vh',
    },
  },
});

export const heroContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: siteVars.spacing.lg,
  maxWidth: '800px',
});

export const heroTitle = style({
  fontSize: siteVars.typography.fontSize['4xl'],
  fontWeight: siteVars.typography.fontWeight.bold,
  lineHeight: siteVars.typography.lineHeight.tight,
  '@media': {
    '(min-width: 768px)': {
      fontSize: siteVars.typography.fontSize['5xl'],
    },
    '(min-width: 1024px)': {
      fontSize: siteVars.typography.fontSize['6xl'],
    },
  },
});

export const heroSubtitle = style({
  fontSize: siteVars.typography.fontSize.lg,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  lineHeight: siteVars.typography.lineHeight.relaxed,
  '@media': {
    '(min-width: 768px)': {
      fontSize: siteVars.typography.fontSize.xl,
    },
  },
});

export const heroActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: siteVars.spacing.sm,
  marginTop: siteVars.spacing.md,
  '@media': {
    '(min-width: 640px)': {
      flexDirection: 'row',
      gap: siteVars.spacing.md,
    },
  },
});

// === BUTTONS ===

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: siteVars.spacing.sm,
  padding: `${siteVars.spacing.sm} ${siteVars.spacing.lg}`,
  fontSize: siteVars.typography.fontSize.base,
  fontWeight: siteVars.typography.fontWeight.medium,
  borderRadius: siteVars.borderRadius.md,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

export const buttonVariant = styleVariants({
  primary: {
    backgroundColor: `hsl(${siteVars.colors.primary})`,
    color: 'white',
    ':hover': {
      filter: 'brightness(1.1)',
    },
  },
  secondary: {
    backgroundColor: `hsl(${siteVars.colors.muted})`,
    color: `hsl(${siteVars.colors.foreground})`,
    ':hover': {
      backgroundColor: `hsl(${siteVars.colors.border})`,
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: `hsl(${siteVars.colors.primary})`,
    border: `2px solid hsl(${siteVars.colors.primary})`,
    ':hover': {
      backgroundColor: `hsl(${siteVars.colors.primary} / 0.1)`,
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: `hsl(${siteVars.colors.foreground})`,
    ':hover': {
      backgroundColor: `hsl(${siteVars.colors.muted})`,
    },
  },
});

export const buttonSize = styleVariants({
  sm: {
    padding: `${siteVars.spacing.xs} ${siteVars.spacing.md}`,
    fontSize: siteVars.typography.fontSize.sm,
  },
  md: {
    padding: `${siteVars.spacing.sm} ${siteVars.spacing.lg}`,
    fontSize: siteVars.typography.fontSize.base,
  },
  lg: {
    padding: `${siteVars.spacing.md} ${siteVars.spacing.xl}`,
    fontSize: siteVars.typography.fontSize.lg,
  },
});

// === FEATURES SECTION ===

export const featuresGrid = style({
  display: 'grid',
  gap: siteVars.spacing.lg,
  gridTemplateColumns: '1fr',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const featureCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: siteVars.spacing.md,
  padding: siteVars.spacing.lg,
  borderRadius: siteVars.borderRadius.lg,
  backgroundColor: `hsl(${siteVars.colors.background})`,
  border: `1px solid hsl(${siteVars.colors.border})`,
  transition: 'all 0.2s ease',
  ':hover': {
    boxShadow: siteVars.shadows.md,
    transform: 'translateY(-2px)',
  },
});

export const featureIcon = style({
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: siteVars.borderRadius.md,
  backgroundColor: `hsl(${siteVars.colors.primary} / 0.1)`,
  color: `hsl(${siteVars.colors.primary})`,
});

export const featureTitle = style({
  fontSize: siteVars.typography.fontSize.xl,
  fontWeight: siteVars.typography.fontWeight.semibold,
});

export const featureDescription = style({
  fontSize: siteVars.typography.fontSize.base,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  lineHeight: siteVars.typography.lineHeight.relaxed,
});

// === NAVBAR ===

export const navbar = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  backgroundColor: `hsl(${siteVars.colors.background} / 0.95)`,
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid hsl(${siteVars.colors.border})`,
});

export const navbarContent = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '64px',
});

export const navbarBrand = style({
  display: 'flex',
  alignItems: 'center',
  gap: siteVars.spacing.sm,
  fontSize: siteVars.typography.fontSize.xl,
  fontWeight: siteVars.typography.fontWeight.bold,
  color: `hsl(${siteVars.colors.foreground})`,
  textDecoration: 'none',
});

export const navbarLinks = style({
  display: 'none',
  alignItems: 'center',
  gap: siteVars.spacing.lg,
  '@media': {
    '(min-width: 768px)': {
      display: 'flex',
    },
  },
});

export const navbarLink = style({
  fontSize: siteVars.typography.fontSize.sm,
  fontWeight: siteVars.typography.fontWeight.medium,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  ':hover': {
    color: `hsl(${siteVars.colors.foreground})`,
  },
});

// === FOOTER ===

export const footer = style({
  backgroundColor: `hsl(${siteVars.colors.muted})`,
  borderTop: `1px solid hsl(${siteVars.colors.border})`,
});

export const footerContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: siteVars.spacing.lg,
  '@media': {
    '(min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
});

export const footerSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: siteVars.spacing.sm,
});

export const footerTitle = style({
  fontSize: siteVars.typography.fontSize.sm,
  fontWeight: siteVars.typography.fontWeight.semibold,
  color: `hsl(${siteVars.colors.foreground})`,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const footerLink = style({
  fontSize: siteVars.typography.fontSize.sm,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  ':hover': {
    color: `hsl(${siteVars.colors.primary})`,
  },
});

export const footerCopyright = style({
  fontSize: siteVars.typography.fontSize.sm,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  textAlign: 'center',
  paddingTop: siteVars.spacing.lg,
  borderTop: `1px solid hsl(${siteVars.colors.border})`,
});

// === SECTION TITLES ===

export const sectionHeader = style({
  textAlign: 'center',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: siteVars.spacing['2xl'],
});

export const sectionTitle = style({
  fontSize: siteVars.typography.fontSize['3xl'],
  fontWeight: siteVars.typography.fontWeight.bold,
  marginBottom: siteVars.spacing.sm,
  '@media': {
    '(min-width: 768px)': {
      fontSize: siteVars.typography.fontSize['4xl'],
    },
  },
});

export const sectionSubtitle = style({
  fontSize: siteVars.typography.fontSize.lg,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  lineHeight: siteVars.typography.lineHeight.relaxed,
});

// === CARDS ===

export const card = style({
  backgroundColor: `hsl(${siteVars.colors.background})`,
  borderRadius: siteVars.borderRadius.lg,
  border: `1px solid hsl(${siteVars.colors.border})`,
  overflow: 'hidden',
  transition: 'all 0.2s ease',
});

export const cardHoverable = style({
  ':hover': {
    boxShadow: siteVars.shadows.lg,
    transform: 'translateY(-4px)',
  },
});

export const cardImage = style({
  width: '100%',
  aspectRatio: '16/9',
  objectFit: 'cover',
});

export const cardContent = style({
  padding: siteVars.spacing.lg,
});

export const cardTitle = style({
  fontSize: siteVars.typography.fontSize.xl,
  fontWeight: siteVars.typography.fontWeight.semibold,
  marginBottom: siteVars.spacing.sm,
});

export const cardDescription = style({
  fontSize: siteVars.typography.fontSize.base,
  color: `hsl(${siteVars.colors.mutedForeground})`,
  lineHeight: siteVars.typography.lineHeight.relaxed,
});
