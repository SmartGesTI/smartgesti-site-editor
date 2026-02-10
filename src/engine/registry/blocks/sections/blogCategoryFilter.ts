import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogCategoryFilterBlock: BlockDefinition<"blogCategoryFilter"> = {
  type: "blogCategoryFilter",
  name: "Blog Category Filter",
  description: "Filtro de categorias para listagem do blog (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    title: "Categorias",
    categories: [
      { name: "Novidades", slug: "novidades", count: 5 },
      { name: "Educação", slug: "educacao", count: 8 },
      { name: "Eventos", slug: "eventos", count: 3 },
      { name: "Institucional", slug: "institucional", count: 4 },
      { name: "Dicas", slug: "dicas", count: 6 },
    ],
    variant: "chips",
    showCount: true,
    showAll: true,
    allLabel: "Todas",
    filterUrl: "/site/p/blog",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    categories: { label: "Categorias", inputType: "text", group: "Conteúdo", readOnly: true },
    variant: {
      label: "Variante",
      inputType: "select",
      group: "Aparência",
      options: [
        { value: "chips", label: "Chips (pills)" },
        { value: "buttons", label: "Botões" },
        { value: "list", label: "Lista vertical" },
      ],
    },
    showCount: { label: "Mostrar Contagem", inputType: "checkbox", group: "Aparência" },
    showAll: { label: "Mostrar 'Todas'", inputType: "checkbox", group: "Comportamento" },
    allLabel: {
      label: "Label 'Todas'",
      inputType: "text",
      group: "Comportamento",
      showWhen: { field: "showAll", equals: true },
    },
    activeCategory: { label: "Categoria Ativa", inputType: "text", group: "Comportamento" },
    filterUrl: { label: "URL Base do Filtro", inputType: "text", group: "Comportamento" },
  },
};

// Auto-registro
componentRegistry.register(blogCategoryFilterBlock);
