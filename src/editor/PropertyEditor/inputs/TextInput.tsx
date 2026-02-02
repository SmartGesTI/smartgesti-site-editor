import React, { useCallback } from "react";
import { cn } from "../../../utils/cn";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  placeholder?: string;
}

/**
 * Componente de input de texto - atualização instantânea em tempo real
 */
export function TextInput({
  value,
  onChange,
  label,
  description,
  placeholder,
}: TextInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Atualização instantânea - tempo real
      onChange(e.target.value);
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
      <input
        type="text"
        value={value || ""}
        onChange={handleChange}
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
