import { SliderInputConfig, VALUE_FORMATTERS } from './types'
import { cn } from '../../utils/cn'

interface SliderInputProps extends SliderInputConfig {
  onClear?: () => void
  hideValue?: boolean
}

export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  formatValue = VALUE_FORMATTERS.decimal,
  onClear,
  hideValue = false,
}: SliderInputProps) {
  const displayValue = formatValue(value)
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="flex items-center gap-4">
      <div className={cn('flex-1 relative', !hideValue && 'min-w-[180px]')}>
        {/* Track */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Filled track */}
          <div
            className="absolute h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Input range */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'absolute inset-0 w-full h-2 cursor-pointer appearance-none',
            'bg-transparent',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500',
            '[&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:transition-all',
            '[&::-moz-range-thumb]:hover:scale-110',
            '[&::-moz-range-track]:bg-transparent'
          )}
        />
      </div>

      {!hideValue && (
        <div className="min-w-[72px] text-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
            {displayValue}
            {unit}
          </span>
        </div>
      )}

      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
