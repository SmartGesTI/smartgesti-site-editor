import { cn } from "../../../utils/cn";

interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

/**
 * Botão toggle para valores booleanos
 * OFF: outline cinza
 * ON: preenchido azul
 */
export function ToggleButton({
  value,
  onChange,
  label,
  description,
}: ToggleButtonProps) {
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          value
            ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600"
            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400"
        )}
      >
        {label}
      </button>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
          {description}
        </p>
      )}
    </div>
  );
}
