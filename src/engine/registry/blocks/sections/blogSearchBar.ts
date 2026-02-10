import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogSearchBarBlock: BlockDefinition<"blogSearchBar"> = {
  type: "blogSearchBar",
  name: "Blog Search Bar",
  description: "Barra de busca para o blog (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    placeholder: "Buscar posts...",
    variant: "simple",
    showIcon: true,
    searchUrl: "/site/p/blog",
    filterCategories: false,
    filterTags: false,
    filterDate: false,
  },
  inspectorMeta: {
    placeholder: { label: "Placeholder", inputType: "text", group: "Conteúdo" },
    variant: {
      label: "Variante",
      inputType: "select",
      group: "Aparência",
      options: [
        { value: "simple", label: "Simples" },
        { value: "expanded", label: "Expandida" },
        { value: "with-filters", label: "Com filtros" },
      ],
    },
    showIcon: { label: "Mostrar Ícone", inputType: "checkbox", group: "Aparência" },
    searchUrl: { label: "URL de Busca", inputType: "text", group: "Comportamento" },
    filterCategories: {
      label: "Filtro por Categoria",
      inputType: "checkbox",
      group: "Filtros",
      showWhen: { field: "variant", equals: "with-filters" },
    },
    filterTags: {
      label: "Filtro por Tag",
      inputType: "checkbox",
      group: "Filtros",
      showWhen: { field: "variant", equals: "with-filters" },
    },
    filterDate: {
      label: "Filtro por Período",
      inputType: "checkbox",
      group: "Filtros",
      showWhen: { field: "variant", equals: "with-filters" },
    },
  },
};

// Auto-registro
componentRegistry.register(blogSearchBarBlock);
