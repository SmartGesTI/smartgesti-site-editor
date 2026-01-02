/**
 * Theme Tokens Schema V2
 * Define tokens semânticos para temas (cores, tipografia, espaçamento, efeitos, layout)
 * Inspirado em design systems modernos (Tailwind, Radix, shadcn/ui)
 */

// ============================================================================
// TIPOS DE ESCALA
// ============================================================================

export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'
export type ShadowScale = 'none' | 'soft' | 'md' | 'strong' | 'glow'
export type SpacingScale = 'compact' | 'normal' | 'comfy' | 'spacious'
export type MotionLevel = 'none' | 'subtle' | 'moderate' | 'bold'
export type BackgroundStyle = 'flat' | 'gradient' | 'glass' | 'texture' | 'mesh'
export type GradientDirection = 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl'

// ============================================================================
// INTERFACES DE TOKENS
// ============================================================================

/**
 * Tokens de Cores - Sistema de cores semânticas expandido
 */
export interface ColorTokens {
  // Backgrounds
  bg: string
  surface: string
  surface2?: string
  surface3?: string
  overlay?: string
  
  // Borders
  border: string
  borderHover?: string
  
  // Text
  text: string
  mutedText: string
  invertedText?: string
  
  // Primary/Accent
  primary: string
  primaryHover?: string
  primaryText: string
  secondary: string
  secondaryHover?: string
  accent: string
  accentHover?: string
  ring: string
  
  // Links
  link?: string
  linkHover?: string
  
  // Inputs
  inputBg?: string
  inputBorder?: string
  inputFocus?: string
  
  // Status
  success?: string
  successLight?: string
  warning?: string
  warningLight?: string
  danger?: string
  dangerLight?: string
  info?: string
  infoLight?: string
  
  // Gradient
  gradient?: {
    start: string
    middle?: string
    end: string
    direction: GradientDirection
  }
}

/**
 * Tokens de Tipografia - Sistema tipográfico expandido
 */
export interface TypographyTokens {
  fontFamily: {
    heading: string
    body: string
    mono?: string
    accent?: string
  }
  baseSize: string
  headingScale: {
    h1: string
    h2: string
    h3: string
    h4: string
    h5: string
    h6: string
  }
  fontWeight?: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight?: {
    tight: string
    normal: string
    relaxed: string
  }
  letterSpacing?: {
    tighter: string
    tight: string
    normal: string
    wide: string
    wider: string
  }
}

/**
 * Tokens de Efeitos - Blur, opacidade, transições
 */
export interface EffectTokens {
  blur?: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  opacity?: {
    overlay: number
    disabled: number
    muted: number
  }
  transition?: {
    fast: string
    normal: string
    slow: string
  }
  animation?: {
    duration: string
    easing: string
  }
}

/**
 * Tokens de Layout - Larguras, paddings, gaps
 */
export interface LayoutTokens {
  maxWidth?: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    full: string
  }
  sectionPadding?: {
    sm: string
    md: string
    lg: string
  }
  containerPadding?: string
}

/**
 * Tokens de Componentes - Estilos específicos por componente
 */
export interface ComponentTokens {
  button?: {
    borderRadius?: string
    fontWeight?: string
    paddingSm?: string
    paddingMd?: string
    paddingLg?: string
  }
  card?: {
    borderRadius?: string
    padding?: string
    shadow?: string
  }
  input?: {
    borderRadius?: string
    padding?: string
    borderWidth?: string
  }
  badge?: {
    borderRadius?: string
    padding?: string
    fontSize?: string
  }
  avatar?: {
    sizeSm?: string
    sizeMd?: string
    sizeLg?: string
    sizeXl?: string
  }
}

/**
 * Theme Tokens - Interface principal expandida
 */
export interface ThemeTokens {
  // Cores semânticas
  colors: ColorTokens
  
  // Escalas de estilo
  radiusScale: RadiusScale
  shadowScale: ShadowScale
  spacingScale: SpacingScale
  motion: MotionLevel
  backgroundStyle: BackgroundStyle
  
  // Tipografia
  typography: TypographyTokens
  
  // Novos tokens (opcionais para retrocompatibilidade)
  effects?: EffectTokens
  layout?: LayoutTokens
  components?: ComponentTokens
}

// ============================================================================
// MAPEAMENTOS DE ESCALA
// ============================================================================

export const radiusScaleMap: Record<RadiusScale, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  pill: '9999px',
}

export const shadowScaleMap: Record<ShadowScale, string> = {
  none: 'none',
  soft: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  glow: '0 0 20px rgba(59, 130, 246, 0.5)',
}

export const spacingScaleMap: Record<SpacingScale, Record<string, string>> = {
  compact: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
  },
  normal: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  comfy: {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  spacious: {
    xs: '1rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
    '2xl': '6rem',
  },
}

export const gradientDirectionMap: Record<GradientDirection, string> = {
  'to-t': 'to top',
  'to-tr': 'to top right',
  'to-r': 'to right',
  'to-br': 'to bottom right',
  'to-b': 'to bottom',
  'to-bl': 'to bottom left',
  'to-l': 'to left',
  'to-tl': 'to top left',
}

// ============================================================================
// VALORES PADRÃO PARA TOKENS OPCIONAIS
// ============================================================================

export const defaultEffectTokens: EffectTokens = {
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  opacity: {
    overlay: 0.5,
    disabled: 0.5,
    muted: 0.7,
  },
  transition: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
  animation: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const defaultLayoutTokens: LayoutTokens = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },
  sectionPadding: {
    sm: '2rem 0',
    md: '4rem 0',
    lg: '6rem 0',
  },
  containerPadding: '1rem',
}

export const defaultComponentTokens: ComponentTokens = {
  button: {
    borderRadius: '0.5rem',
    fontWeight: '500',
    paddingSm: '0.5rem 1rem',
    paddingMd: '0.625rem 1.25rem',
    paddingLg: '0.75rem 1.5rem',
  },
  card: {
    borderRadius: '0.75rem',
    padding: '1.5rem',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  input: {
    borderRadius: '0.5rem',
    padding: '0.625rem 0.875rem',
    borderWidth: '1px',
  },
  badge: {
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
  },
  avatar: {
    sizeSm: '2rem',
    sizeMd: '2.5rem',
    sizeLg: '3rem',
    sizeXl: '4rem',
  },
}

// ============================================================================
// GERADOR DE CSS VARIABLES
// ============================================================================

/**
 * Gera CSS variables a partir dos theme tokens (versão expandida)
 */
export function generateThemeCSSVariables(tokens: ThemeTokens): string {
  const { colors, radiusScale, shadowScale, spacingScale, typography, effects, layout, components } = tokens
  
  const radius = radiusScaleMap[radiusScale]
  const shadow = shadowScaleMap[shadowScale]
  const spacing = spacingScaleMap[spacingScale]
  const fx = effects || defaultEffectTokens
  const lay = layout || defaultLayoutTokens
  const comp = components || defaultComponentTokens
  
  // Gerar gradient CSS se existir
  const gradientCss = colors.gradient 
    ? `linear-gradient(${gradientDirectionMap[colors.gradient.direction]}, ${colors.gradient.start}${colors.gradient.middle ? `, ${colors.gradient.middle}` : ''}, ${colors.gradient.end})`
    : 'none'
  
  return `
    :root {
      /* ===== COLORS ===== */
      --sg-bg: ${colors.bg};
      --sg-surface: ${colors.surface};
      --sg-surface2: ${colors.surface2 || colors.surface};
      --sg-surface3: ${colors.surface3 || colors.surface2 || colors.surface};
      --sg-overlay: ${colors.overlay || 'rgba(0, 0, 0, 0.5)'};
      --sg-border: ${colors.border};
      --sg-border-hover: ${colors.borderHover || colors.border};
      --sg-text: ${colors.text};
      --sg-muted-text: ${colors.mutedText};
      --sg-inverted-text: ${colors.invertedText || '#ffffff'};
      --sg-primary: ${colors.primary};
      --sg-primary-hover: ${colors.primaryHover || colors.primary};
      --sg-primary-text: ${colors.primaryText};
      --sg-secondary: ${colors.secondary};
      --sg-secondary-hover: ${colors.secondaryHover || colors.secondary};
      --sg-accent: ${colors.accent};
      --sg-accent-hover: ${colors.accentHover || colors.accent};
      --sg-ring: ${colors.ring};
      --sg-link: ${colors.link || colors.primary};
      --sg-link-hover: ${colors.linkHover || colors.primary};
      --sg-input-bg: ${colors.inputBg || colors.bg};
      --sg-input-border: ${colors.inputBorder || colors.border};
      --sg-input-focus: ${colors.inputFocus || colors.ring};
      --sg-success: ${colors.success || '#10b981'};
      --sg-success-light: ${colors.successLight || '#d1fae5'};
      --sg-warning: ${colors.warning || '#f59e0b'};
      --sg-warning-light: ${colors.warningLight || '#fef3c7'};
      --sg-danger: ${colors.danger || '#ef4444'};
      --sg-danger-light: ${colors.dangerLight || '#fee2e2'};
      --sg-info: ${colors.info || '#3b82f6'};
      --sg-info-light: ${colors.infoLight || '#dbeafe'};
      --sg-gradient: ${gradientCss};
      
      /* ===== RADIUS ===== */
      --sg-radius: ${radius};
      --sg-radius-sm: ${radiusScaleMap.sm};
      --sg-radius-md: ${radiusScaleMap.md};
      --sg-radius-lg: ${radiusScaleMap.lg};
      --sg-radius-xl: ${radiusScaleMap.xl};
      --sg-radius-pill: ${radiusScaleMap.pill};
      
      /* ===== SHADOW ===== */
      --sg-shadow: ${shadow};
      --sg-shadow-soft: ${shadowScaleMap.soft};
      --sg-shadow-md: ${shadowScaleMap.md};
      --sg-shadow-strong: ${shadowScaleMap.strong};
      --sg-shadow-glow: ${shadowScaleMap.glow};
      
      /* ===== SPACING ===== */
      --sg-spacing-xs: ${spacing.xs};
      --sg-spacing-sm: ${spacing.sm};
      --sg-spacing-md: ${spacing.md};
      --sg-spacing-lg: ${spacing.lg};
      --sg-spacing-xl: ${spacing.xl};
      --sg-spacing-2xl: ${spacing['2xl']};
      
      /* ===== TYPOGRAPHY ===== */
      --sg-font-heading: ${typography.fontFamily.heading};
      --sg-font-body: ${typography.fontFamily.body};
      --sg-font-mono: ${typography.fontFamily.mono || 'ui-monospace, monospace'};
      --sg-font-accent: ${typography.fontFamily.accent || typography.fontFamily.heading};
      --sg-font-size-base: ${typography.baseSize};
      --sg-heading-h1: ${typography.headingScale.h1};
      --sg-heading-h2: ${typography.headingScale.h2};
      --sg-heading-h3: ${typography.headingScale.h3};
      --sg-heading-h4: ${typography.headingScale.h4};
      --sg-heading-h5: ${typography.headingScale.h5};
      --sg-heading-h6: ${typography.headingScale.h6};
      --sg-font-weight-light: ${typography.fontWeight?.light || 300};
      --sg-font-weight-normal: ${typography.fontWeight?.normal || 400};
      --sg-font-weight-medium: ${typography.fontWeight?.medium || 500};
      --sg-font-weight-semibold: ${typography.fontWeight?.semibold || 600};
      --sg-font-weight-bold: ${typography.fontWeight?.bold || 700};
      --sg-line-height-tight: ${typography.lineHeight?.tight || '1.25'};
      --sg-line-height-normal: ${typography.lineHeight?.normal || '1.5'};
      --sg-line-height-relaxed: ${typography.lineHeight?.relaxed || '1.75'};
      --sg-letter-spacing-tight: ${typography.letterSpacing?.tight || '-0.025em'};
      --sg-letter-spacing-normal: ${typography.letterSpacing?.normal || '0'};
      --sg-letter-spacing-wide: ${typography.letterSpacing?.wide || '0.025em'};
      
      /* ===== EFFECTS ===== */
      --sg-blur-sm: ${fx.blur?.sm || '4px'};
      --sg-blur-md: ${fx.blur?.md || '8px'};
      --sg-blur-lg: ${fx.blur?.lg || '16px'};
      --sg-blur-xl: ${fx.blur?.xl || '24px'};
      --sg-opacity-overlay: ${fx.opacity?.overlay || 0.5};
      --sg-opacity-disabled: ${fx.opacity?.disabled || 0.5};
      --sg-opacity-muted: ${fx.opacity?.muted || 0.7};
      --sg-transition-fast: ${fx.transition?.fast || '150ms ease'};
      --sg-transition-normal: ${fx.transition?.normal || '300ms ease'};
      --sg-transition-slow: ${fx.transition?.slow || '500ms ease'};
      --sg-animation-duration: ${fx.animation?.duration || '300ms'};
      --sg-animation-easing: ${fx.animation?.easing || 'cubic-bezier(0.4, 0, 0.2, 1)'};
      
      /* ===== LAYOUT ===== */
      --sg-max-width-sm: ${lay.maxWidth?.sm || '640px'};
      --sg-max-width-md: ${lay.maxWidth?.md || '768px'};
      --sg-max-width-lg: ${lay.maxWidth?.lg || '1024px'};
      --sg-max-width-xl: ${lay.maxWidth?.xl || '1280px'};
      --sg-max-width-2xl: ${lay.maxWidth?.['2xl'] || '1536px'};
      --sg-section-padding-sm: ${lay.sectionPadding?.sm || '2rem 0'};
      --sg-section-padding-md: ${lay.sectionPadding?.md || '4rem 0'};
      --sg-section-padding-lg: ${lay.sectionPadding?.lg || '6rem 0'};
      --sg-container-padding: ${lay.containerPadding || '1rem'};
      
      /* ===== COMPONENT TOKENS ===== */
      --sg-button-radius: ${comp.button?.borderRadius || '0.5rem'};
      --sg-button-font-weight: ${comp.button?.fontWeight || '500'};
      --sg-button-padding-sm: ${comp.button?.paddingSm || '0.5rem 1rem'};
      --sg-button-padding-md: ${comp.button?.paddingMd || '0.625rem 1.25rem'};
      --sg-button-padding-lg: ${comp.button?.paddingLg || '0.75rem 1.5rem'};
      --sg-card-radius: ${comp.card?.borderRadius || '0.75rem'};
      --sg-card-padding: ${comp.card?.padding || '1.5rem'};
      --sg-card-shadow: ${comp.card?.shadow || shadowScaleMap.md};
      --sg-input-radius: ${comp.input?.borderRadius || '0.5rem'};
      --sg-input-padding: ${comp.input?.padding || '0.625rem 0.875rem'};
      --sg-input-border-width: ${comp.input?.borderWidth || '1px'};
      --sg-badge-radius: ${comp.badge?.borderRadius || '9999px'};
      --sg-badge-padding: ${comp.badge?.padding || '0.25rem 0.75rem'};
      --sg-badge-font-size: ${comp.badge?.fontSize || '0.75rem'};
      --sg-avatar-sm: ${comp.avatar?.sizeSm || '2rem'};
      --sg-avatar-md: ${comp.avatar?.sizeMd || '2.5rem'};
      --sg-avatar-lg: ${comp.avatar?.sizeLg || '3rem'};
      --sg-avatar-xl: ${comp.avatar?.sizeXl || '4rem'};
    }
  `.trim()
}

// ============================================================================
// TEMA PADRÃO
// ============================================================================

/**
 * Theme tokens padrão (Light Modern)
 */
export const defaultThemeTokens: ThemeTokens = {
  colors: {
    bg: '#ffffff',
    surface: '#f9fafb',
    surface2: '#f3f4f6',
    surface3: '#e5e7eb',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    text: '#1f2937',
    mutedText: '#6b7280',
    invertedText: '#ffffff',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryText: '#ffffff',
    secondary: '#6b7280',
    secondaryHover: '#4b5563',
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    ring: '#3b82f6',
    link: '#3b82f6',
    linkHover: '#2563eb',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#3b82f6',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  radiusScale: 'md',
  shadowScale: 'soft',
  spacingScale: 'normal',
  motion: 'subtle',
  backgroundStyle: 'flat',
  typography: {
    fontFamily: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, monospace',
    },
    baseSize: '16px',
    headingScale: {
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.875rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  effects: defaultEffectTokens,
  layout: defaultLayoutTokens,
  components: defaultComponentTokens,
}

// ============================================================================
// PRESETS DE TEMAS
// ============================================================================

/**
 * Tema Dark Modern
 */
export const darkThemeTokens: ThemeTokens = {
  ...defaultThemeTokens,
  colors: {
    bg: '#0a0a0a',
    surface: '#171717',
    surface2: '#262626',
    surface3: '#404040',
    overlay: 'rgba(0, 0, 0, 0.7)',
    border: '#404040',
    borderHover: '#525252',
    text: '#fafafa',
    mutedText: '#a3a3a3',
    invertedText: '#0a0a0a',
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryText: '#ffffff',
    secondary: '#737373',
    secondaryHover: '#a3a3a3',
    accent: '#a78bfa',
    accentHover: '#c4b5fd',
    ring: '#3b82f6',
    link: '#60a5fa',
    linkHover: '#93c5fd',
    inputBg: '#171717',
    inputBorder: '#404040',
    inputFocus: '#3b82f6',
    success: '#34d399',
    successLight: '#064e3b',
    warning: '#fbbf24',
    warningLight: '#78350f',
    danger: '#f87171',
    dangerLight: '#7f1d1d',
    info: '#60a5fa',
    infoLight: '#1e3a8a',
  },
}

/**
 * Tema Gradient (com gradiente de fundo)
 */
export const gradientThemeTokens: ThemeTokens = {
  ...defaultThemeTokens,
  backgroundStyle: 'gradient',
  colors: {
    ...defaultThemeTokens.colors,
    gradient: {
      start: '#667eea',
      middle: '#764ba2',
      end: '#f093fb',
      direction: 'to-br',
    },
  },
}

/**
 * Tema Corporate (profissional)
 */
export const corporateThemeTokens: ThemeTokens = {
  ...defaultThemeTokens,
  radiusScale: 'sm',
  shadowScale: 'soft',
  colors: {
    ...defaultThemeTokens.colors,
    primary: '#1e40af',
    primaryHover: '#1e3a8a',
    accent: '#0ea5e9',
    accentHover: '#0284c7',
  },
  typography: {
    ...defaultThemeTokens.typography,
    fontFamily: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
  },
}

/**
 * Tema Playful (vibrante)
 */
export const playfulThemeTokens: ThemeTokens = {
  ...defaultThemeTokens,
  radiusScale: 'lg',
  shadowScale: 'md',
  colors: {
    ...defaultThemeTokens.colors,
    primary: '#ec4899',
    primaryHover: '#db2777',
    accent: '#f59e0b',
    accentHover: '#d97706',
    success: '#22c55e',
  },
  typography: {
    ...defaultThemeTokens.typography,
    fontFamily: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
  },
}
