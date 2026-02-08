/**
 * PageTabBar - Barra de abas para navegação entre páginas e ativação de plugins
 *
 * Layout expandido:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  [Home]  [🧩 Blog]  [🧩 Post]                   [+ Adicionar] │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * O botão [+ Adicionar] abre um dropdown com:
 * - Nova Página (cria página em branco)
 * - Seção Plugins com toggles para ativar/desativar
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { SitePage } from "@/engine/schema/siteDocument";
import { pluginRegistry } from "../engine";

export interface PageTabBarProps {
  pages: SitePage[];
  currentPageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onRemovePage: (id: string) => void;
  canRemovePage: (id: string) => boolean;
  activePlugins: string[];
  onActivatePlugin: (pluginId: string) => void;
  onDeactivatePlugin: (pluginId: string) => void;
}

export function PageTabBar({
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
  activePlugins,
  onActivatePlugin,
  onDeactivatePlugin,
}: PageTabBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  const availablePlugins = useMemo(() => pluginRegistry.getAll(), []);

  // Separar páginas: regulares vs plugins
  const regularPages = useMemo(
    () => pages.filter((p) => !p.pluginId),
    [pages],
  );
  const pluginPages = useMemo(
    () => pages.filter((p) => !!p.pluginId),
    [pages],
  );

  const handleTogglePlugin = useCallback(
    (pluginId: string, isActive: boolean) => {
      if (isActive) {
        onDeactivatePlugin(pluginId);
      } else {
        onActivatePlugin(pluginId);
      }
    },
    [onActivatePlugin, onDeactivatePlugin],
  );

  return (
    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5">
      {/* ── Área scrollável: tabs de páginas ── */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-2">
        {/* Páginas regulares */}
        {regularPages.map((page) => {
          const isActive = page.id === currentPageId;
          return (
            <div
              key={page.id}
              className={`
                group relative flex items-center gap-2 px-4 py-2
                rounded-lg cursor-pointer transition-all duration-150 flex-shrink-0
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => onSelectPage(page.id)}
              title={`${page.name} (/${page.slug})`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M2 6h12M6 2v12" />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap">
                {page.name}
              </span>

              {/* Botão de remover (hover) */}
              {canRemovePage(page.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePage(page.id);
                  }}
                  className={`
                    flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
                    transition-all duration-150
                    ${
                      isActive
                        ? "opacity-60 hover:opacity-100 hover:bg-white/20"
                        : "opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-red-500 hover:text-white"
                    }
                  `}
                  title={`Remover ${page.name}`}
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

        {/* Páginas de plugins ativos */}
        {pluginPages.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            {pluginPages.map((page) => {
              const isActive = page.id === currentPageId;
              return (
                <div
                  key={page.id}
                  className={`
                    flex items-center gap-2 px-4 py-2
                    rounded-lg cursor-pointer transition-all duration-150 flex-shrink-0
                    ${
                      isActive
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/25"
                        : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                    }
                  `}
                  onClick={() => onSelectPage(page.id)}
                  title={`Plugin: ${page.name} (/${page.slug})`}
                >
                  <span className="text-sm flex-shrink-0">🧩</span>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {page.name}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── Botão "+ Adicionar" fixo no canto direito ── */}
      <div className="flex-shrink-0 ml-3 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className={`
            flex items-center gap-2 px-4 py-2
            text-sm font-medium rounded-lg transition-all duration-150
            bg-blue-500 text-white hover:bg-blue-600
            shadow-sm hover:shadow-md
          `}
          title="Adicionar página ou ativar plugin"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 3V13M3 8H13" />
          </svg>
          <span className="whitespace-nowrap">Adicionar</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${showMenu ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* Nova Página */}
            <button
              onClick={() => {
                setShowMenu(false);
                onAddPage();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-blue-600 dark:text-blue-400"
                >
                  <path d="M8 3V13M3 8H13" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Nova Página
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Criar uma página em branco
                </p>
              </div>
            </button>

            {/* Plugins */}
            {availablePlugins.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700" />
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Plugins
                  </p>
                </div>
                {availablePlugins.map((plugin) => {
                  const { id, name, description } = plugin.manifest;
                  const isActive = activePlugins.includes(id);

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive
                            ? "bg-purple-100 dark:bg-purple-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <span className="text-base">🧩</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {name}
                        </p>
                        {description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {description}
                          </p>
                        )}
                      </div>
                      {/* Toggle switch */}
                      <button
                        onClick={() => handleTogglePlugin(id, isActive)}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
                          ${
                            isActive
                              ? "bg-purple-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }
                        `}
                        role="switch"
                        aria-checked={isActive}
                        aria-label={`${isActive ? "Desativar" : "Ativar"} ${name}`}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform
                            ${isActive ? "translate-x-5" : "translate-x-0"}
                          `}
                        />
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
