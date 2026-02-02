import { memo, useCallback, useState, useEffect, useRef } from "react";
import { cn } from "../../../utils/cn";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
}

/**
 * Componente de input de cor com debounce para arrastar
 * Memoizado para performance
 */
export const ColorInput = memo(function ColorInput({
  value,
  onChange,
  label,
  description,
}: ColorInputProps) {
  const colorDebounceRef = useRef<number | null>(null);
  const [localValue, setLocalValue] = useState(value || "#000000");

  useEffect(() => {
    setLocalValue(value || "#000000");
  }, [value]);

  const handleColorPickerChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);

      // Debounce para arrastar a barra de cor
      if (colorDebounceRef.current) {
        clearTimeout(colorDebounceRef.current);
      }

      colorDebounceRef.current = window.setTimeout(() => {
        onChange(newValue);
      }, 50);
    },
    [onChange],
  );

  const handleColorPickerMouseUp = useCallback(
    (newValue: string) => {
      // Garantir atualização final quando soltar o mouse
      if (colorDebounceRef.current) {
        clearTimeout(colorDebounceRef.current);
      }
      onChange(newValue);
    },
    [onChange],
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      // Input de texto atualiza imediatamente
      onChange(newValue);
    },
    [onChange],
  );

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
            "flex h-9 flex-1 rounded-lg border-2 bg-background px-3 py-2 text-sm font-mono",
            "transition-all duration-200 placeholder:text-muted-foreground",
            "focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500",
          )}
          placeholder="#000000"
        />
      </div>
    </div>
  );
});
