import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HexColorPicker } from 'react-colorful'
import { ColorInputConfig } from './types'
import { cn } from '../../utils/cn'

interface ColorInputProps extends ColorInputConfig {
  onClear?: () => void
}

const QUICK_COLORS = [
  '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af',
  '#6b7280', '#374151', '#1f2937', '#000000',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const debounceRef = useRef<number | null>(null)

  const currentColor = value || placeholder

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const sizeConfig = {
    small: { width: 32, height: 24, pickerSize: 180 },
    medium: { width: 48, height: 32, pickerSize: 200 },
    large: { width: 64, height: 40, pickerSize: 220 },
  }

  const config = sizeConfig[size]

  const computePickerPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 }
    const rect = buttonRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
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

  return (
    <div className="relative flex items-center gap-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label || 'Selecionar cor'}
        className={cn(
          'relative cursor-pointer transition-all rounded-lg border-2',
          'hover:scale-105 active:scale-95',
          isOpen
            ? 'ring-2 ring-blue-500 ring-offset-2'
            : 'border-gray-300 dark:border-gray-600',
          size === 'small' && 'w-8 h-6',
          size === 'medium' && 'w-12 h-8',
          size === 'large' && 'w-16 h-10'
        )}
        style={{ backgroundColor: currentColor }}
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
          style={{ backgroundColor: currentColor }}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed z-[2147483000] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3"
            style={{
              top: pickerPos.top,
              left: pickerPos.left,
            }}
          >
            <style>{`
              .react-colorful {
                width: ${config.pickerSize}px !important;
                height: ${config.pickerSize * 0.75}px !important;
              }
              .react-colorful__saturation {
                border-radius: 8px 8px 0 0;
              }
              .react-colorful__hue {
                height: 24px;
                border-radius: 0 0 8px 8px;
              }
              .react-colorful__pointer {
                width: 20px;
                height: 20px;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
              }
            `}</style>
            <HexColorPicker
              color={currentColor}
              onChange={(c) => {
                if (debounceRef.current) {
                  window.clearTimeout(debounceRef.current)
                }
                debounceRef.current = window.setTimeout(() => {
                  onChange(c)
                }, 50) as unknown as number
              }}
            />
            <div className="mt-2.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-center">
              <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                {currentColor.toUpperCase()}
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Cores Rápidas
              </div>
              <div className="grid grid-cols-8 gap-1">
                {QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={cn(
                      'w-5 h-5 rounded border transition-all cursor-pointer',
                      'hover:scale-110',
                      currentColor === color
                        ? 'border-2 border-blue-500'
                        : 'border border-gray-300 dark:border-gray-600'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}

      {onClear && (
        <button
          type="button"
          onClick={() => {
            onClear()
            setIsOpen(false)
          }}
          className="h-8 rounded-md px-3 text-xs font-medium border border-input bg-background text-gray-600 dark:text-gray-300 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
