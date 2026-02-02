/**
 * PageTabBar - Barra de abas para navegação entre páginas
 * Componente inspirado em abas de browser para switching entre páginas do site
 */

import { SitePage } from "@/engine/schema/siteDocument";

export interface PageTabBarProps {
  pages: SitePage[];
  currentPageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onRemovePage: (id: string) => void;
  canRemovePage: (id: string) => boolean;
}

export function PageTabBar({
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
}: PageTabBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Módulos:
      </div>

      {/* Container com scroll horizontal para módulos */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {pages.map((page) => {
          const isActive = page.id === currentPageId;

          return (
            <div
              key={page.id}
              className={`
                group relative flex items-center gap-2 px-3 py-1.5
                rounded-md cursor-pointer transition-all duration-150 flex-shrink-0
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => onSelectPage(page.id)}
              title={`Módulo: ${page.name} (${page.slug})`}
            >
              {/* Ícone de módulo */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M2 6h12M6 2v12" />
              </svg>

              {/* Nome da página */}
              <span className="text-xs font-medium whitespace-nowrap">
                {page.name}
              </span>

              {/* Botão de remover (apenas para páginas removíveis) */}
              {canRemovePage(page.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePage(page.id);
                  }}
                  className={`
                    flex-shrink-0 w-4 h-4 rounded flex items-center justify-center
                    transition-all duration-150
                    ${
                      isActive
                        ? "opacity-70 hover:opacity-100 hover:bg-red-600"
                        : "opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:bg-red-500 hover:text-white"
                    }
                  `}
                  title={`Remover módulo ${page.name}`}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 2L10 10M10 2L2 10" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}

        {/* Botão de adicionar módulo */}
        <button
          onClick={onAddPage}
          className="
            flex items-center justify-center gap-1.5 px-3 py-1.5
            text-xs font-medium text-gray-600 dark:text-gray-400
            bg-gray-100 dark:bg-gray-800
            hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400
            border border-dashed border-gray-300 dark:border-gray-600
            rounded-md transition-all duration-150 flex-shrink-0
          "
          title="Adicionar novo módulo"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 3V13M3 8H13" />
          </svg>
          <span className="whitespace-nowrap">Novo Módulo</span>
        </button>
      </div>
    </div>
  );
}
