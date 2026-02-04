import { cn } from "../../../utils/cn";

interface SelectOption {
  label: string;
  value: string | number | boolean;
}

interface ButtonGroupInputProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  description?: string;
  options: SelectOption[];
}

/**
 * Grupo de botões para selects com 2-3 opções
 * Substitui o dropdown por botões lado a lado
 *
 * Quando o valor selecionado é "outline", o botão mostra estilo de contorno
 * para representar visualmente o conceito
 */
export function ButtonGroupInput({
  value,
  onChange,
  label,
  description,
  options,
}: ButtonGroupInputProps) {
  if (!options || options.length === 0) {
    return null;
  }

  // Determinar se o valor selecionado é "outline" para estilo visual especial
  const isOutlineStyle = value === "outline";

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <div className="flex">
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          // Estilo especial para opção "outline" selecionada
          const useOutlineSelectedStyle = isSelected && isOutlineStyle;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-medium border-2 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:z-10",
                // Border radius
                isFirst && "rounded-l-lg",
                isLast && "rounded-r-lg",
                // Juntar bordas
                !isFirst && "-ml-0.5",
                // Estados
                isSelected
                  ? useOutlineSelectedStyle
                    // Estilo outline: borda azul, fundo transparente, texto azul
                    ? "bg-transparent border-blue-500 text-blue-500 z-10"
                    // Estilo sólido: fundo azul, texto branco
                    : "bg-blue-500 border-blue-500 text-white z-10"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400 hover:z-10"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
