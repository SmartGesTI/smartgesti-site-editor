import { globalStyle, style } from '@vanilla-extract/css';
import { siteVars } from './tokens.css';

/**
 * Reset e estilos base para sites
 *
 * Aplicado dentro do container .site-root para isolar
 * os estilos do site do host application.
 */

// Container raiz do site
export const siteRoot = style({
  fontFamily: siteVars.typography.fontFamily,
  fontSize: siteVars.typography.fontSize.base,
  lineHeight: siteVars.typography.lineHeight.normal,
  color: `hsl(${siteVars.colors.foreground})`,
  backgroundColor: `hsl(${siteVars.colors.background})`,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  minHeight: '100vh',
});

// Reset básico dentro do site
globalStyle(`${siteRoot} *`, {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle(`${siteRoot} *::before, ${siteRoot} *::after`, {
  boxSizing: 'border-box',
});

// Tipografia base
globalStyle(`${siteRoot} h1, ${siteRoot} h2, ${siteRoot} h3, ${siteRoot} h4, ${siteRoot} h5, ${siteRoot} h6`, {
  fontFamily: siteVars.typography.fontFamilyHeading,
  fontWeight: siteVars.typography.fontWeight.bold,
  lineHeight: siteVars.typography.lineHeight.tight,
  color: `hsl(${siteVars.colors.foreground})`,
});

globalStyle(`${siteRoot} h1`, {
  fontSize: siteVars.typography.fontSize['5xl'],
});

globalStyle(`${siteRoot} h2`, {
  fontSize: siteVars.typography.fontSize['4xl'],
});

globalStyle(`${siteRoot} h3`, {
  fontSize: siteVars.typography.fontSize['3xl'],
});

globalStyle(`${siteRoot} h4`, {
  fontSize: siteVars.typography.fontSize['2xl'],
});

globalStyle(`${siteRoot} h5`, {
  fontSize: siteVars.typography.fontSize.xl,
});

globalStyle(`${siteRoot} h6`, {
  fontSize: siteVars.typography.fontSize.lg,
});

globalStyle(`${siteRoot} p`, {
  lineHeight: siteVars.typography.lineHeight.relaxed,
});

globalStyle(`${siteRoot} a`, {
  color: `hsl(${siteVars.colors.primary})`,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
});

globalStyle(`${siteRoot} a:hover`, {
  textDecoration: 'underline',
});

// Imagens responsivas
globalStyle(`${siteRoot} img`, {
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
});

// Listas
globalStyle(`${siteRoot} ul, ${siteRoot} ol`, {
  paddingLeft: siteVars.spacing.lg,
});

globalStyle(`${siteRoot} li`, {
  marginBottom: siteVars.spacing.xs,
});

// Botões base
globalStyle(`${siteRoot} button`, {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
});

// Inputs base
globalStyle(`${siteRoot} input, ${siteRoot} textarea, ${siteRoot} select`, {
  fontFamily: 'inherit',
  fontSize: 'inherit',
});
