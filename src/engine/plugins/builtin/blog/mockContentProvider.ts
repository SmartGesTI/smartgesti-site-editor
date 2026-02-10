/**
 * Mock Blog Content Provider
 * Provides placeholder blog data for editor preview when no real
 * ContentProvider is registered by the consumer.
 */

import type {
  ContentProvider,
  ContentItem,
  ContentListParams,
  ContentListResult,
  DataSchema,
} from "../../types";

const MOCK_POSTS: ContentItem[] = [
  {
    id: "mock-post-1",
    type: "blog-post",
    slug: "bem-vindo-ao-nosso-blog",
    data: {
      title: "Bem-vindo ao nosso blog!",
      excerpt:
        "Estamos animados em lançar nosso blog oficial. Acompanhe as novidades e dicas.",
      content:
        "<p>Estamos animados em lançar nosso blog oficial. Aqui você encontrará notícias, tutoriais e dicas importantes.</p>",
      featuredImage:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
      category: "Novidades",
      tags: ["lançamento", "novidades"],
      authorName: "Equipe Editorial",
      authorAvatar: "",
      readingTime: 3,
    },
    metadata: {
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z",
      publishedAt: "2025-01-15T10:00:00Z",
      status: "published",
    },
  },
  {
    id: "mock-post-2",
    type: "blog-post",
    slug: "dicas-para-estudantes",
    data: {
      title: "5 Dicas para Estudantes de Sucesso",
      excerpt:
        "Confira as melhores práticas para melhorar seus estudos e alcançar seus objetivos acadêmicos.",
      content:
        "<p>Estudar de forma eficiente é uma habilidade que pode ser desenvolvida. Confira nossas dicas.</p>",
      featuredImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
      category: "Educação",
      tags: ["educação", "dicas", "estudos"],
      authorName: "Prof. Maria Silva",
      authorAvatar: "",
      readingTime: 5,
    },
    metadata: {
      createdAt: "2025-01-20T14:30:00Z",
      updatedAt: "2025-01-20T14:30:00Z",
      publishedAt: "2025-01-20T14:30:00Z",
      status: "published",
    },
  },
  {
    id: "mock-post-3",
    type: "blog-post",
    slug: "novidades-do-semestre",
    data: {
      title: "Novidades para o Próximo Semestre",
      excerpt:
        "Novos cursos, eventos e melhorias que estão chegando. Saiba tudo sobre o que vem por aí.",
      content:
        "<p>O próximo semestre traz muitas novidades. Novos cursos, eventos e oportunidades para todos.</p>",
      featuredImage:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
      category: "Institucional",
      tags: ["semestre", "novidades", "cursos"],
      authorName: "Coordenação Acadêmica",
      authorAvatar: "",
      readingTime: 4,
    },
    metadata: {
      createdAt: "2025-02-01T09:00:00Z",
      updatedAt: "2025-02-01T09:00:00Z",
      publishedAt: "2025-02-01T09:00:00Z",
      status: "published",
    },
  },
];

/**
 * Converts a ContentItem to blogPostCard block props
 */
function toBlockProps(item: ContentItem): Record<string, unknown> {
  const d = item.data;
  const meta = item.metadata;

  const publishedDate = meta?.publishedAt
    ? new Date(meta.publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return {
    title: d.title || "",
    excerpt: d.excerpt || "",
    image: d.featuredImage || "",
    date: publishedDate,
    category: d.category || "",
    authorName: d.authorName || "",
    authorAvatar: d.authorAvatar || "",
    readingTime: d.readingTime ? `${d.readingTime} min de leitura` : "",
    linkHref: `/site/p/blog/${item.slug || item.id}`,
    linkText: "Ler mais",
    // Detail-specific props
    content: d.content || "",
    featuredImage: d.featuredImage || "",
    tags: Array.isArray(d.tags) ? d.tags : [],
    // SEO props
    metaTitle: d.metaTitle || d.title || "",
    metaDescription: d.metaDescription || d.excerpt || "",
    ogImage: d.ogImage || d.featuredImage || "",
  };
}

/**
 * Mock ContentProvider for blog posts.
 * Returns placeholder data for editor preview.
 */
export const mockBlogContentProvider: ContentProvider = {
  type: "blog-posts",

  async fetchList(params: ContentListParams): Promise<ContentListResult> {
    const limit = params.limit ?? 10;
    const page = params.page ?? 1;
    const start = (page - 1) * limit;
    const items = MOCK_POSTS.slice(start, start + limit);

    return {
      items,
      total: MOCK_POSTS.length,
      page,
      limit,
      hasMore: start + limit < MOCK_POSTS.length,
    };
  },

  async fetchById(idOrSlug: string): Promise<ContentItem | null> {
    return (
      MOCK_POSTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
    );
  },

  getSchema(): DataSchema {
    return {
      type: "blog-post",
      label: "Blog Post",
      fields: [
        { name: "title", type: "string", required: true, label: "Título" },
        { name: "slug", type: "string", required: true, label: "Slug" },
        { name: "excerpt", type: "string", label: "Resumo" },
        {
          name: "content",
          type: "richtext",
          required: true,
          label: "Conteúdo",
        },
        { name: "featuredImage", type: "image", label: "Imagem de Capa" },
        { name: "category", type: "string", label: "Categoria" },
        { name: "tags", type: "array", label: "Tags" },
        { name: "authorName", type: "string", label: "Autor" },
        { name: "authorAvatar", type: "image", label: "Avatar do Autor" },
        { name: "readingTime", type: "number", label: "Tempo de Leitura" },
      ],
    };
  },

  toBlockProps,
};
