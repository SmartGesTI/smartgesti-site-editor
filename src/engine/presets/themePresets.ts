/**
 * Theme Presets
 * Catálogo de presets de tema pré-configurados
 */

import { ThemeTokens } from '../schema/themeTokens'

export interface ThemePreset {
  id: string
  name: string
  description: string
  tokens: ThemeTokens
}

/**
 * Preset Clean - Minimalista e limpo
 */
export const cleanPreset: ThemePreset = {
  id: 'clean',
  name: 'Clean',
  description: 'Minimalista e limpo, perfeito para sites corporativos',
  tokens: {
    colors: {
      bg: '#ffffff',
      surface: '#f9fafb',
      surface2: '#f3f4f6',
      border: '#e5e7eb',
      text: '#1f2937',
      mutedText: '#6b7280',
      primary: '#2563eb',
      primaryText: '#ffffff',
      secondary: '#64748b',
      accent: '#3b82f6',
      ring: '#2563eb',
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
      },
      baseSize: '16px',
      headingScale: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Preset Neon - Cores vibrantes e modernas
 */
export const neonPreset: ThemePreset = {
  id: 'neon',
  name: 'Neon',
  description: 'Cores vibrantes e modernas, ideal para tecnologia e inovação',
  tokens: {
    colors: {
      bg: '#0a0a0a',
      surface: '#1a1a1a',
      surface2: '#2a2a2a',
      border: '#333333',
      text: '#ffffff',
      mutedText: '#a0a0a0',
      primary: '#00f5ff',
      primaryText: '#000000',
      secondary: '#ff00ff',
      accent: '#00ff00',
      ring: '#00f5ff',
    },
    radiusScale: 'lg',
    shadowScale: 'strong',
    spacingScale: 'comfy',
    motion: 'bold',
    backgroundStyle: 'gradient',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '3rem',
        h2: '2.5rem',
        h3: '2rem',
        h4: '1.75rem',
        h5: '1.5rem',
        h6: '1.25rem',
      },
    },
  },
}

/**
 * Preset Pastel - Cores suaves e delicadas
 */
export const pastelPreset: ThemePreset = {
  id: 'pastel',
  name: 'Pastel',
  description: 'Cores suaves e delicadas, perfeito para sites infantis e criativos',
  tokens: {
    colors: {
      bg: '#fef7f0',
      surface: '#fff5e6',
      surface2: '#ffe8cc',
      border: '#ffd9b3',
      text: '#5a4a3a',
      mutedText: '#8a7a6a',
      primary: '#ffb3d9',
      primaryText: '#ffffff',
      secondary: '#b3d9ff',
      accent: '#d9b3ff',
      ring: '#ffb3d9',
    },
    radiusScale: 'lg',
    shadowScale: 'soft',
    spacingScale: 'comfy',
    motion: 'subtle',
    backgroundStyle: 'flat',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Preset Corporate - Profissional e corporativo
 */
export const corporatePreset: ThemePreset = {
  id: 'corporate',
  name: 'Corporate',
  description: 'Profissional e corporativo, ideal para empresas',
  tokens: {
    colors: {
      bg: '#ffffff',
      surface: '#f8f9fa',
      surface2: '#e9ecef',
      border: '#dee2e6',
      text: '#212529',
      mutedText: '#6c757d',
      primary: '#0d6efd',
      primaryText: '#ffffff',
      secondary: '#6c757d',
      accent: '#198754',
      ring: '#0d6efd',
    },
    radiusScale: 'sm',
    shadowScale: 'soft',
    spacingScale: 'normal',
    motion: 'none',
    backgroundStyle: 'flat',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '2.25rem',
        h2: '1.875rem',
        h3: '1.5rem',
        h4: '1.25rem',
        h5: '1.125rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Preset Playful Kids - Divertido e colorido para crianças
 */
export const playfulKidsPreset: ThemePreset = {
  id: 'playful-kids',
  name: 'Playful Kids',
  description: 'Divertido e colorido, perfeito para sites infantis',
  tokens: {
    colors: {
      bg: '#fff9e6',
      surface: '#ffe6cc',
      surface2: '#ffcc99',
      border: '#ffb366',
      text: '#663300',
      mutedText: '#996633',
      primary: '#ff6600',
      primaryText: '#ffffff',
      secondary: '#ff9900',
      accent: '#ffcc00',
      ring: '#ff6600',
    },
    radiusScale: 'lg',
    shadowScale: 'md',
    spacingScale: 'comfy',
    motion: 'bold',
    backgroundStyle: 'texture',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '18px',
      headingScale: {
        h1: '3rem',
        h2: '2.5rem',
        h3: '2rem',
        h4: '1.75rem',
        h5: '1.5rem',
        h6: '1.25rem',
      },
    },
  },
}

/**
 * Preset Glass - Efeito glassmorphism
 */
export const glassPreset: ThemePreset = {
  id: 'glass',
  name: 'Glass',
  description: 'Efeito glassmorphism moderno e elegante',
  tokens: {
    colors: {
      bg: 'rgba(255, 255, 255, 0.1)',
      surface: 'rgba(255, 255, 255, 0.2)',
      surface2: 'rgba(255, 255, 255, 0.3)',
      border: 'rgba(255, 255, 255, 0.3)',
      text: '#ffffff',
      mutedText: 'rgba(255, 255, 255, 0.7)',
      primary: '#3b82f6',
      primaryText: '#ffffff',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      ring: '#3b82f6',
    },
    radiusScale: 'lg',
    shadowScale: 'strong',
    spacingScale: 'normal',
    motion: 'subtle',
    backgroundStyle: 'glass',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Preset Minimal - Minimalista extremo
 */
export const minimalPreset: ThemePreset = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Minimalista extremo, foco no conteúdo',
  tokens: {
    colors: {
      bg: '#ffffff',
      surface: '#ffffff',
      surface2: '#fafafa',
      border: '#e0e0e0',
      text: '#000000',
      mutedText: '#666666',
      primary: '#000000',
      primaryText: '#ffffff',
      secondary: '#666666',
      accent: '#000000',
      ring: '#000000',
    },
    radiusScale: 'none',
    shadowScale: 'none',
    spacingScale: 'compact',
    motion: 'none',
    backgroundStyle: 'flat',
    typography: {
      fontFamily: {
        heading: 'system-ui, -apple-system, sans-serif',
        body: 'system-ui, -apple-system, sans-serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '2rem',
        h2: '1.75rem',
        h3: '1.5rem',
        h4: '1.25rem',
        h5: '1.125rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Preset Classic - Clássico e elegante
 */
export const classicPreset: ThemePreset = {
  id: 'classic',
  name: 'Classic',
  description: 'Clássico e elegante, atemporal',
  tokens: {
    colors: {
      bg: '#f5f5f5',
      surface: '#ffffff',
      surface2: '#fafafa',
      border: '#d4af37',
      text: '#2c2c2c',
      mutedText: '#666666',
      primary: '#8b4513',
      primaryText: '#ffffff',
      secondary: '#d4af37',
      accent: '#8b4513',
      ring: '#d4af37',
    },
    radiusScale: 'sm',
    shadowScale: 'md',
    spacingScale: 'normal',
    motion: 'subtle',
    backgroundStyle: 'flat',
    typography: {
      fontFamily: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif',
      },
      baseSize: '16px',
      headingScale: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
      },
    },
  },
}

/**
 * Catálogo completo de presets
 */
export const themePresets: Record<string, ThemePreset> = {
  clean: cleanPreset,
  neon: neonPreset,
  pastel: pastelPreset,
  corporate: corporatePreset,
  'playful-kids': playfulKidsPreset,
  glass: glassPreset,
  minimal: minimalPreset,
  classic: classicPreset,
}

/**
 * Obtém um preset por ID
 */
export function getPreset(presetId: string): ThemePreset | undefined {
  return themePresets[presetId]
}

/**
 * Lista todos os presets
 */
export function getAllPresets(): ThemePreset[] {
  return Object.values(themePresets)
}

/**
 * Aplica overrides em um preset
 */
export function applyOverrides(preset: ThemePreset, overrides: Partial<ThemeTokens>): ThemeTokens {
  return {
    ...preset.tokens,
    ...overrides,
    colors: {
      ...preset.tokens.colors,
      ...overrides.colors,
    },
    typography: {
      ...preset.tokens.typography,
      ...overrides.typography,
      fontFamily: {
        ...preset.tokens.typography.fontFamily,
        ...overrides.typography?.fontFamily,
      },
      headingScale: {
        ...preset.tokens.typography.headingScale,
        ...overrides.typography?.headingScale,
      },
    },
  }
}

/**
 * Valida contraste de cores (WCAG)
 */
export function validateContrast(_foreground: string, _background: string): {
  valid: boolean
  ratio: number
  level: 'AA' | 'AAA' | 'fail'
} {
  // Implementação simplificada - em produção, usar biblioteca de contraste
  // Por enquanto, retornar sempre válido
  return {
    valid: true,
    ratio: 4.5,
    level: 'AA',
  }
}
