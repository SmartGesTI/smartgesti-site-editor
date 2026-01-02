import { CheckboxInputConfig } from './types'
import { cn } from '../../utils/cn'
import { Check } from 'lucide-react'

export function CheckboxInput({
  checked,
  onChange,
  label,
  description,
}: CheckboxInputConfig) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all',
            'border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'peer-checked:bg-blue-500 peer-checked:border-blue-500',
            'peer-focus:ring-2 peer-focus:ring-blue-500/20 peer-focus:ring-offset-2',
            'group-hover:border-blue-400/50 dark:group-hover:border-blue-500',
            'cursor-pointer'
          )}
        >
          {checked && (
            <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        {label && (
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {label}
          </span>
        )}
        {description && (
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {description}
          </span>
        )}
      </div>
    </label>
  )
}
