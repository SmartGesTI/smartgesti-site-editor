import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const blogPostGridBlock: BlockDefinition<"blogPostGrid"> = {
  type: "blogPostGrid",
  name: "Blog Post Grid",
  description: "Grid de posts do blog com suporte a dados dinâmicos (plugin Blog)",
  category: "sections",
  pluginId: "blog",
  canHaveChildren: false,
  defaultProps: {
    title: "Blog",
    subtitle: "Últimas publicações",
    columns: 3,
    cards: [],
    variant: "default",
    showViewAll: false,
    viewAllText: "Ver todos",
    viewAllHref: "/blog",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Cabeçalho" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Cabeçalho" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Destaque", value: "featured" },
        { label: "Minimal", value: "minimal" },
      ],
      group: "Aparência",
    },
    showViewAll: { label: "Mostrar 'Ver Todos'", inputType: "checkbox", group: "Rodapé" },
    viewAllText: {
      label: "Texto do Link",
      inputType: "text",
      group: "Rodapé",
      showWhen: { field: "showViewAll", equals: true },
    },
    viewAllHref: {
      label: "URL do Link",
      inputType: "text",
      group: "Rodapé",
      showWhen: { field: "showViewAll", equals: true },
    },
  },
};

// Auto-registro
componentRegistry.register(blogPostGridBlock);
