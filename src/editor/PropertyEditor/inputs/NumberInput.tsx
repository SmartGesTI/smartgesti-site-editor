import { cn } from "../../../utils/cn";

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label: string;
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Componente de input numérico
 */
export function NumberInput({
  value,
  onChange,
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
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
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
        min={min}
        max={max}
        step={step}
        className={cn(
          "flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm",
          "transition-all duration-200 placeholder:text-muted-foreground",
          "focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500",
        )}
        placeholder={placeholder || label}
      />
    </div>
  );
}
