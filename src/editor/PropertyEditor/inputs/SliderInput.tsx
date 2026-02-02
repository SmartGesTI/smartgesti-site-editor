
interface SliderInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Componente de input slider/range
 */
export function SliderInput({
  value,
  onChange,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
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
  );
}
