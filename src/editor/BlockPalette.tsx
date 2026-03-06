/**
 * Block Palette
 * Paleta de blocos disponíveis para adicionar, agrupados por userCategory
 */

import { useMemo, useState } from "react";
import { BlockType, BlockDefinition } from "../engine";
import { componentRegistry } from "../engine";
import { cn } from "../utils/cn";
import { getBlockIcon } from "../utils/blockIcons";
import { Search } from "lucide-react";

/** Ordem fixa das categorias na paleta */
const CATEGORY_ORDER = [
  "Banner e Navegação",
  "Marketing",
  "Prova Social",
  "Galeria e Mídia",
  "Equipe",
  "Institucional",
  "Blog e Notícias",
  "Blog (Plugin)",
  "Educação",
  "Texto e Mídia",
  "Estrutura",
  "Formulários",
];

/** Blocos que só podem existir uma vez por página */
const UNIQUE_BLOCK_TYPES = new Set<string>(["navbar", "footer"]);

interface BlockPaletteProps {
  onAddBlock: (
    blockType: BlockType,
    parentBlockId?: string,
    position?: number,
  ) => void;
  selectedParentBlockId?: string | null;
  activePlugins?: string[];
  existingBlockTypes?: string[];
}

export function BlockPalette({
  onAddBlock,
  selectedParentBlockId,
  activePlugins,
  existingBlockTypes,
}: BlockPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar blocos disponíveis
  const availableBlocks = useMemo(() => {
    return componentRegistry.getAll().filter((def) => {
      if (def.isChildBlock) return false;
      if (def.pluginId && !activePlugins?.includes(def.pluginId)) return false;
      return true;
    });
  }, [activePlugins]);

  // Agrupar por userCategory e filtrar por busca
  const blocksByUserCategory = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const groups: Record<string, BlockDefinition[]> = {};

    for (const def of availableBlocks) {
      // Filtrar por busca
      if (query) {
        const matchesName = def.name.toLowerCase().includes(query);
        const matchesDesc = def.description.toLowerCase().includes(query);
        const matchesType = def.type.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesType) continue;
      }

      const cat = def.userCategory || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(def);
    }

    return groups;
  }, [availableBlocks, searchQuery]);

  // Categorias ordenadas
  const sortedCategories = useMemo(() => {
    const cats = Object.keys(blocksByUserCategory);
    return cats.sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a);
      const idxB = CATEGORY_ORDER.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [blocksByUserCategory]);

  const handleAddBlock = (blockType: BlockType) => {
    onAddBlock(blockType, selectedParentBlockId || undefined);
  };

  const totalAvailable = Object.values(blocksByUserCategory).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Adicionar Bloco
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {totalAvailable} blocos disponíveis
        </p>

        {/* Campo de busca */}
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar blocos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-colors",
              "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
              "text-gray-700 dark:text-gray-300 placeholder-gray-400",
            )}
          />
        </div>
      </div>

      {/* Lista de blocos por userCategory */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sortedCategories.map((category) => {
          const blocks = blocksByUserCategory[category];
          if (!blocks || blocks.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {blocks.map((def) => {
                  const isUnique = UNIQUE_BLOCK_TYPES.has(def.type);
                  const alreadyExists =
                    isUnique && existingBlockTypes?.includes(def.type);

                  return (
                    <button
                      key={def.type}
                      onClick={() => !alreadyExists && handleAddBlock(def.type)}
                      disabled={!!alreadyExists}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        alreadyExists
                          ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          : cn(
                              "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer",
                              "hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
                              "hover:scale-[1.02] active:scale-[0.98]",
                            ),
                      )}
                      title={
                        alreadyExists
                          ? `${def.name} já existe na página`
                          : def.description
                      }
                    >
                      <div className="text-2xl">{getBlockIcon(def.type)}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                        {def.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {totalAvailable === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-8">
            {searchQuery
              ? "Nenhum bloco encontrado"
              : "Nenhum bloco disponível"}
          </div>
        )}
      </div>
    </div>
  );
}
