/**
 * Input Components
 * Componentes de input reutilizáveis para o editor
 */

import React, { useCallback, useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

// ============================================================================
// TextInput
// ============================================================================

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
  placeholder?: string
}

export function TextInput({ value, onChange, label, description, placeholder }: TextInputProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        className={cn(
          'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder={placeholder || label}
      />
    </div>
  )
}

// ============================================================================
// TextAreaInput
// ============================================================================

interface TextAreaInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
  placeholder?: string
  rows?: number
}

export function TextAreaInput({ 
  value, 
  onChange, 
  label, 
  description, 
  placeholder, 
  rows = 3 
}: TextAreaInputProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        rows={rows}
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground resize-y',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder={placeholder || label}
      />
    </div>
  )
}

// ============================================================================
// ColorInput
// ============================================================================

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
}

export function ColorInput({ value, onChange, label, description }: ColorInputProps) {
  const colorDebounceRef = useRef<number | null>(null)
  const [localValue, setLocalValue] = useState(value || '#000000')

  useEffect(() => {
    setLocalValue(value || '#000000')
  }, [value])

  const handleColorPickerChange = useCallback((newValue: string) => {
    setLocalValue(newValue)
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current)
    }
    colorDebounceRef.current = window.setTimeout(() => {
      onChange(newValue)
    }, 50)
  }, [onChange])

  const handleColorPickerMouseUp = useCallback((newValue: string) => {
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current)
    }
    onChange(newValue)
  }, [onChange])

  const handleTextChange = useCallback((newValue: string) => {
    setLocalValue(newValue)
    onChange(newValue)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={localValue}
          onChange={(e) => handleColorPickerChange(e.target.value)}
          onMouseUp={(e) => handleColorPickerMouseUp(e.currentTarget.value)}
          className="h-9 w-16 rounded-lg border-2 border-input cursor-pointer"
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleTextChange(e.target.value)}
          className={cn(
            'flex h-9 flex-1 rounded-lg border-2 bg-background px-3 py-2 text-sm font-mono',
            'transition-all duration-200 placeholder:text-muted-foreground',
            'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
          )}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

// ============================================================================
// NumberInput
// ============================================================================

interface NumberInputProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  label: string
  description?: string
  min?: number
  max?: number
  step?: number
}

export function NumberInput({ 
  value, 
  onChange, 
  label, 
  description, 
  min, 
  max, 
  step = 1 
}: NumberInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        min={min}
        max={max}
        step={step}
        className={cn(
          'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder={label}
      />
    </div>
  )
}

// ============================================================================
// SelectInput
// ============================================================================

interface SelectOption {
  value: string | number
  label: string
}

interface SelectInputProps {
  value: string | number | undefined
  onChange: (value: any) => void
  label: string
  description?: string
  options: SelectOption[]
}

export function SelectInput({ value, onChange, label, description, options }: SelectInputProps) {
  if (!options?.length) return null

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <select
        value={value ?? options[0]?.value}
        onChange={(e) => {
          const selectedOption = options.find((opt) => String(opt.value) === e.target.value)
          onChange(selectedOption ? selectedOption.value : e.target.value)
        }}
        className={cn(
          'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500',
          'cursor-pointer'
        )}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ============================================================================
// SliderInput
// ============================================================================

interface SliderInputProps {
  value: number | undefined
  onChange: (value: number) => void
  label: string
  description?: string
  min?: number
  max?: number
  step?: number
}

export function SliderInput({ 
  value, 
  onChange, 
  label, 
  description, 
  min = 0, 
  max = 100, 
  step = 1 
}: SliderInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
          {label}
          {description && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
              {description}
            </span>
          )}
        </label>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {value ?? min}
        </span>
      </div>
      <input
        type="range"
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )
}

// ============================================================================
// ImageInput
// ============================================================================

interface ImageInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
}

export function ImageInput({ value, onChange, label, description }: ImageInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder="URL da imagem"
      />
      {value && (
        <img
          src={value}
          alt="Preview"
          className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )}
    </div>
  )
}
