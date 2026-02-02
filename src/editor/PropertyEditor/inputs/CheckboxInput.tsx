
interface CheckboxInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  propName: string;
}

/**
 * Componente de checkbox
 */
export function CheckboxInput({
  value,
  onChange,
  label,
  description,
  propName,
}: CheckboxInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          id={`checkbox-${propName}`}
        />
        <label
          htmlFor={`checkbox-${propName}`}
          className="text-sm font-medium text-gray-800 dark:text-gray-100 cursor-pointer"
        >
          {label}
          {description && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
              {description}
            </span>
          )}
        </label>
      </div>
    </div>
  );
}
