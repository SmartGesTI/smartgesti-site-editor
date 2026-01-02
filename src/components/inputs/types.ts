/**
 * Tipos para inputs customizados do editor
 */

export interface ColorInputConfig {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

export interface SliderInputConfig {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  unit?: string
  formatValue?: (value: number) => string
}

export interface SelectInputConfig<T = string> {
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}

export interface CheckboxInputConfig {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export interface GradientInputConfig {
  startColor: string
  endColor: string
  enabled: boolean
  onStartColorChange: (color: string) => void
  onEndColorChange: (color: string) => void
  onEnabledChange: (enabled: boolean) => void
}

// Formatadores de valores
export const VALUE_FORMATTERS = {
  percentage: (value: number) => `${Math.round(value * 100)}%`,
  pixels: (value: number) => `${value}px`,
  decimal: (value: number) => value.toFixed(2),
} as const
