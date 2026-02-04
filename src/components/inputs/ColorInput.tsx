import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HexColorPicker } from 'react-colorful'
import { ColorInputConfig } from './types'
import { cn } from '../../utils/cn'

interface ColorInputProps extends ColorInputConfig {
  onClear?: () => void
}

/**
 * Normaliza uma cor para garantir que é um hex válido
 */
function normalizeColor(color: string | undefined, fallback: string): string {
  if (!color || color === '') return fallback
  // Se já é um hex válido, retorna
  if (/^#[0-9A-Fa-f]{6}$/i.test(color)) return color
  // Se é hex curto, expande
  if (/^#[0-9A-Fa-f]{3}$/i.test(color)) {
    const hex = color.slice(1)
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  return fallback
}

export function ColorInput({
  value,
  onChange,
  onClear,
  label,
  placeholder = '#ffffff',
  size = 'medium',
}: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<number | null>(null)

  // Cor efetiva - sempre normalizada
  const effectiveColor = normalizeColor(value, placeholder)

  // Estado local para feedback visual imediato durante drag
  const [localColor, setLocalColor] = useState(effectiveColor)

  // Sincronizar estado local quando o value externo mudar
  useEffect(() => {
    const normalized = normalizeColor(value, placeholder)
    setLocalColor(normalized)
  }, [value, placeholder])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const computePickerPosition = () => {
    if (!containerRef.current) return { top: 0, left: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + window.scrollY + 8,
      left: Math.max(8, rect.left + window.scrollX),
    }
  }

  const [pickerPos, setPickerPos] = useState(computePickerPosition())

  useEffect(() => {
    if (!isOpen) return
    const update = () => setPickerPos(computePickerPosition())
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [isOpen])

  const handleColorChange = (color: string) => {
    // Atualizar o estado local imediatamente para feedback visual
    setLocalColor(color)

    // Debounce para chamar o onChange
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    debounceRef.current = window.setTimeout(() => {
      onChange(color)
    }, 50) as unknown as number
  }

  const handleTextChange = (val: string) => {
    // Permitir digitação parcial
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || val === '#' || val === '') {
      setLocalColor(val || '#')
      // Só chamar onChange quando for um hex completo
      if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
        onChange(val)
      }
    }
  }

  // Cor a ser exibida (usa localColor para feedback imediato)
  const displayColor = localColor

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
          {label}
        </label>
      )}

      {/* Color swatch com hex */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={label || 'Selecionar cor'}
          className={cn(
            'relative cursor-pointer transition-all rounded-lg border-2 flex-shrink-0',
            'hover:scale-[1.02] active:scale-[0.98]',
            isOpen
              ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
              : 'border-gray-300 dark:border-gray-600',
            size === 'small' && 'w-10 h-8',
            size === 'medium' && 'w-12 h-9',
            size === 'large' && 'w-16 h-10'
          )}
        >
          {/* Checkerboard pattern for transparency */}
          <div
            className="absolute inset-0.5 rounded-md"
            style={{
              background: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                           linear-gradient(-45deg, #ccc 25%, transparent 25%),
                           linear-gradient(45deg, transparent 75%, #ccc 75%),
                           linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            }}
          />
          <div
            className="absolute inset-0.5 rounded-md"
            style={{ backgroundColor: displayColor }}
          />
        </button>

        {/* Hex value display */}
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">
          {displayColor}
        </span>

        {onClear && (
          <button
            type="button"
            onClick={() => {
              onClear()
              setIsOpen(false)
            }}
            className="ml-auto text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Color picker portal - z-index muito alto para ficar acima de tudo */}
      {isOpen &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
            style={{
              top: pickerPos.top,
              left: pickerPos.left,
              zIndex: 2147483647, // Máximo z-index possível
            }}
          >
            <style>{`
              .react-colorful {
                width: 220px !important;
                height: 160px !important;
              }
              .react-colorful__saturation {
                border-radius: 8px 8px 0 0;
              }
              .react-colorful__hue {
                height: 20px;
                border-radius: 0 0 8px 8px;
              }
              .react-colorful__pointer {
                width: 18px;
                height: 18px;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              }
            `}</style>
            <HexColorPicker
              color={displayColor}
              onChange={handleColorChange}
            />

            {/* Hex value input */}
            <div className="mt-3 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex-shrink-0"
                style={{ backgroundColor: displayColor }}
              />
              <input
                type="text"
                value={displayColor.toUpperCase()}
                onChange={(e) => handleTextChange(e.target.value)}
                className="flex-1 px-2 py-1.5 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
