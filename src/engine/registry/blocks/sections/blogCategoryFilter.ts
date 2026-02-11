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
    linkColor: "#374151",
    linkHoverColor: "#2563eb",
    linkHoverEffect: "background",
    linkHoverIntensity: 50,
    borderRadius: "0.75rem",
    shadow: "none",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
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
    linkColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "Links",
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "Links",
    },
    linkHoverEffect: {
      label: "Efeito Hover",
      inputType: "select",
      options: [
        { label: "Fundo", value: "background" },
        { label: "Sublinhado", value: "underline" },
        { label: "Sublinhado Centro", value: "underline-center" },
        { label: "Fundo Subindo", value: "slide-bg" },
        { label: "Escala", value: "scale" },
        { label: "Brilho Neon", value: "glow" },
      ],
      group: "Links",
    },
    linkHoverIntensity: {
      label: "Intensidade",
      inputType: "slider",
      min: 10,
      max: 100,
      step: 10,
      group: "Links",
    },
    borderRadius: {
      label: "Arredondamento",
      inputType: "select",
      options: [
        { label: "Nenhum", value: "0" },
        { label: "Padrão", value: "0.75rem" },
        { label: "Grande", value: "1.25rem" },
      ],
      group: "Aparência",
    },
    shadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Suave", value: "sm" },
        { label: "Média", value: "md" },
      ],
      group: "Aparência",
    },
  },
};

// Auto-registro
componentRegistry.register(blogCategoryFilterBlock);
