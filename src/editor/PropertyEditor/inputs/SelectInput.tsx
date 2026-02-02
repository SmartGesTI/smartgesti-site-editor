import { cn } from "../../../utils/cn";

interface SelectOption {
  label: string;
  value: string | number | boolean;
}

interface SelectInputProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  description?: string;
  options: SelectOption[];
}

/**
 * Componente de select/dropdown
 */
export function SelectInput({
  value,
  onChange,
  label,
  description,
  options,
}: SelectInputProps) {
  if (!options || options.length === 0) {
    return null;
  }

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
      <select
        value={value ?? options[0]?.value}
        onChange={(e) => {
          const selectedOption = options.find(
            (opt) => String(opt.value) === e.target.value,
          );
          onChange(selectedOption ? selectedOption.value : e.target.value);
        }}
        className={cn(
          "flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm",
          "transition-all duration-200",
          "focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500",
          "cursor-pointer",
        )}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
