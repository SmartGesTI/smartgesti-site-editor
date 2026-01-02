import { GradientInputConfig } from './types'
import { ColorInput } from './ColorInput'
import { CheckboxInput } from './CheckboxInput'
import { cn } from '../../utils/cn'

interface GradientInputProps extends GradientInputConfig {
  onClear?: () => void
}

export function GradientInput({
  enabled = false,
  startColor,
  endColor,
  onEnabledChange,
  onStartColorChange,
  onEndColorChange,
  onClear,
}: GradientInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <CheckboxInput
        checked={enabled}
        onChange={(checked) => onEnabledChange?.(checked)}
        label="Ativar Gradiente"
      />

      {enabled && (
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Cor Inicial
            </label>
            <ColorInput
              value={startColor}
              onChange={(color) => onStartColorChange?.(color)}
              size="medium"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Cor Final
            </label>
            <ColorInput
              value={endColor}
              onChange={(color) => onEndColorChange?.(color)}
              size="medium"
            />
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'px-3 py-2 text-xs font-medium rounded-md',
                'border border-gray-300 dark:border-gray-600',
                'bg-gray-50 dark:bg-gray-800',
                'text-gray-600 dark:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'transition-colors',
                'self-end'
              )}
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {enabled && (
        <div
          className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
          style={{
            background: `linear-gradient(90deg, ${startColor}, ${endColor})`,
          }}
        />
      )}
    </div>
  )
}
