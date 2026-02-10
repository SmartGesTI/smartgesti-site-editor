import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

/**
 * Sample cards for editor preview.
 * In production, these are replaced by ContentProvider data.
 */
const sampleCards = [
  {
    title: "Bem-vindo ao nosso blog!",
    excerpt: "Estamos animados em lançar nosso blog oficial. Acompanhe novidades e dicas.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    category: "Novidades",
    date: "15 Jan 2025",
    linkHref: "/site/p/blog/bem-vindo",
    linkText: "Ler mais",
  },
  {
    title: "5 Dicas para Estudantes de Sucesso",
    excerpt: "Confira as melhores práticas para melhorar seus estudos e alcançar seus objetivos.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
    category: "Educação",
    date: "20 Jan 2025",
    linkHref: "/site/p/blog/dicas-estudantes",
    linkText: "Ler mais",
  },
  {
    title: "Novidades para o Próximo Semestre",
    excerpt: "Novos cursos, eventos e melhorias que estão chegando. Saiba tudo sobre o que vem por aí.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    category: "Institucional",
    date: "01 Fev 2025",
    linkHref: "/site/p/blog/novidades-semestre",
    linkText: "Ler mais",
  },
];

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
    cards: sampleCards,
    variant: "default",
    showViewAll: false,
    viewAllText: "Ver todos",
    viewAllHref: "/site/p/blog",
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
