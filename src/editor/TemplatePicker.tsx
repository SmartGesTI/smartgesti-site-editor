/**
 * TemplatePicker - Grid de templates para o usuário escolher
 */

import { templateList, templates } from "../shared/templates";
import type { TemplateId } from "../shared/templates";
import { cn } from "../utils/cn";

interface TemplatePickerProps {
  onSelectTemplate: (templateId: TemplateId) => void;
}

/** Lista de templates exibida: sempre derivada do mapa templates para não perder nenhum. */
function getPickerTemplates() {
  const ids = Object.keys(templates) as TemplateId[];
  const byId = new Map(templateList.map((t) => [t.id, t]));
  return ids.map(
    (id) =>
      byId.get(id) ?? {
        id,
        name: id.replace(/^escola-/, "").replace(/-/g, " "),
        description: "",
        category: "education",
        tags: [],
      },
  );
}

export function TemplatePicker({ onSelectTemplate }: TemplatePickerProps) {
  const pickerList = getPickerTemplates();
  return (
    <div className="flex flex-col min-h-0 flex-1 w-full bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Escolha um template para sua escola
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Todos os modelos são pensados para instituições de ensino. Depois você
          pode editar textos, cores e imagens.
        </p>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pickerList.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id as TemplateId)}
              className={cn(
                "flex flex-col rounded-xl border-2 border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800 overflow-hidden text-left cursor-pointer",
                "hover:border-blue-500 hover:shadow-lg dark:hover:border-blue-500",
                "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              )}
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {template.preview ? (
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">📄</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {template.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
