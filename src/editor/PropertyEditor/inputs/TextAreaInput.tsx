import React, { useCallback } from "react";
import { cn } from "../../../utils/cn";

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  placeholder?: string;
  rows?: number;
}

/**
 * Componente de textarea - atualização instantânea em tempo real
 */
export function TextAreaInput({
  value,
  onChange,
  label,
  description,
  placeholder,
  rows = 3,
}: TextAreaInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        value={value || ""}
        onChange={handleChange}
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border-2 bg-background px-3 py-2 text-sm",
          "transition-all duration-200 placeholder:text-muted-foreground resize-y",
          "focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500",
        )}
        placeholder={placeholder || label}
      />
    </div>
  );
}
