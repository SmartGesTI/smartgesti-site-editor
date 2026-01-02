import { useState, useRef, useEffect } from 'react'
import { SelectInputConfig } from './types'
import { cn } from '../../utils/cn'
import { ChevronDown } from 'lucide-react'

interface SelectInputProps<T = string> extends SelectInputConfig<T> {
  width?: number
}

export function SelectInput<T = string>({
  value,
  onChange,
  options,
  width = 160,
}: SelectInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const selectedOption = options.find((opt) => opt.value === value)
  const selectedLabel = selectedOption?.label || ''

  const handleSelect = (optionValue: T) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" style={{ width }} ref={containerRef}>
      {/* Trigger - Seguindo exatamente as classes do SelectTrigger do projeto SmartGesti-Ensino */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg',
          'border-2 border-input',
          'bg-background',
          'px-4 py-2.5 text-sm',
          'text-gray-900 dark:text-gray-100',
          'ring-offset-background',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'hover:border-blue-400/50 focus:border-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          isOpen && 'ring-2 ring-blue-500 ring-offset-2 border-blue-500'
        )}
      >
        <span className="line-clamp-1 text-left flex-1">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 opacity-50 flex-shrink-0 ml-2 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Content - Seguindo exatamente as classes do SelectContent do projeto SmartGesti-Ensino */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full',
            'max-h-96 min-w-[8rem] overflow-hidden rounded-lg',
            'border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'text-gray-900 dark:text-gray-100',
            'shadow-lg',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'
          )}
        >
          <div className="p-1">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm',
                    'py-1.5 pl-2 pr-2 text-sm outline-none',
                    'transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:bg-gray-100 dark:focus:bg-gray-800',
                    isSelected && 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  )}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
