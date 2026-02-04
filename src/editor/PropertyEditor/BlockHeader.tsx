import { memo } from "react";
import { BlockType } from "../../engine";
import { getBlockIcon } from "../../utils/blockIcons";

interface BlockHeaderProps {
  type: BlockType;
  name: string;
  description?: string;
}

/**
 * Header do bloco com ícone centralizado, título e subtítulo
 */
export const BlockHeader = memo(function BlockHeader({
  type,
  name,
  description,
}: BlockHeaderProps) {
  const icon = getBlockIcon(type);

  return (
    <div className="flex flex-col items-center text-center pb-3 border-b border-gray-200 dark:border-gray-700">
      {/* Ícone em container circular */}
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Título */}
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
        {name}
      </h3>

      {/* Subtítulo/Descrição */}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
});
