/**
 * Templates estáticos para Landing Pages de Escolas
 *
 * Cada template é um SiteDocument completo pronto para uso
 */

import { escolaPremiumTemplate } from "./escola-premium";
import { escolaEdviTemplate } from "./escola-edvi";
import { escolaZilomTemplate } from "./escola-zilom";
import { escolaBlogTemplate } from "./escola-blog";
import { smartgestiAdminTemplate } from "./smartgesti-admin";

// Re-export templates
export { escolaPremiumTemplate } from "./escola-premium";
export { escolaEdviTemplate } from "./escola-edvi";
export { escolaZilomTemplate } from "./escola-zilom";
export { escolaBlogTemplate } from "./escola-blog";
export { smartgestiAdminTemplate } from "./smartgesti-admin";

/**
 * Informações sobre templates disponíveis
 */
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview?: string;
}

/**
 * Lista de templates disponíveis com metadados
 */
export const templateList: TemplateInfo[] = [
  {
    id: "escola-premium",
    name: "Colégio Vanguarda",
    description:
      "Landing page moderna e profissional com hero fullscreen, vídeo institucional, FAQ, pricing, depoimentos e seções completas para escolas de excelência",
    category: "education",
    tags: [
      "escola",
      "colégio",
      "premium",
      "moderno",
      "profissional",
      "bilíngue",
      "steam",
      "educação",
      "landing page",
    ],
    preview: "https://placehold.co/400x300/6366f1/white?text=Colégio+Vanguarda",
  },
  {
    id: "escola-edvi",
    name: "Edvi",
    description:
      "Template Edvi para escolas – hero com overlay azul, countdown de admissão, carousel, blog, equipe e formulário de contato",
    category: "education",
    tags: [
      "edvi",
      "escola",
      "educação",
      "countdown",
      "carousel",
      "blog",
      "equipe",
      "landing page",
    ],
    preview: "https://placehold.co/400x300/2563eb/white?text=Edvi",
  },
  {
    id: "escola-zilom",
    name: "Template Chat",
    description:
      "Template Zilom para ensino online – hero split com gradiente, cursos populares, categorias, depoimentos, newsletter e formulário de registro",
    category: "education",
    tags: [
      "zilom",
      "cursos",
      "ensino online",
      "course card",
      "category card",
      "newsletter",
      "landing page",
    ],
    preview: "https://placehold.co/400x300/6366f1/white?text=Zilom",
  },
  {
    id: "escola-blog",
    name: "Escola Blog",
    description:
      "Template simples com blog integrado — ideal para testar o sistema de plugins. Ative o plugin Blog no editor para páginas dinâmicas.",
    category: "education",
    tags: [
      "escola",
      "blog",
      "plugin",
      "simples",
      "notícias",
      "landing page",
    ],
    preview: "https://placehold.co/400x300/4f46e5/white?text=Escola+Blog",
  },
  {
    id: "smartgesti-admin",
    name: "SmartGesti Admin",
    description:
      "Landing page profissional para sistema de gestão administrativa – módulos, benefícios, contato e depoimentos",
    category: "business",
    tags: [
      "gestão",
      "administrativo",
      "saas",
      "software",
      "profissional",
      "corporativo",
      "landing page",
    ],
    preview: "https://placehold.co/400x300/6366f1/white?text=SmartGesti+Admin",
  },
];

/**
 * Mapa de templates por ID para acesso rápido
 */
export const templates = {
  "escola-premium": escolaPremiumTemplate,
  "escola-edvi": escolaEdviTemplate,
  "escola-zilom": escolaZilomTemplate,
  "escola-blog": escolaBlogTemplate,
  "smartgesti-admin": smartgestiAdminTemplate,
} as const;

export type TemplateId = keyof typeof templates;

/**
 * Mapa de template → nome da paleta default correspondente
 */
export const templateDefaultPalette: Record<TemplateId, string> = {
  "escola-premium": "Indigo & Cyan",
  "escola-edvi": "Blue Academy",
  "escola-zilom": "Blue Academy",
  "escola-blog": "Indigo Amber",
  "smartgesti-admin": "Indigo Pro",
};

/**
 * Retorna um template pelo ID
 */
export function getTemplate(id: TemplateId) {
  return templates[id] || null;
}

/**
 * Retorna templates filtrados por categoria
 */
export function getTemplatesByCategory(category: string): TemplateInfo[] {
  return templateList.filter((t) => t.category === category);
}

/**
 * Retorna templates filtrados por tag
 */
export function getTemplatesByTag(tag: string): TemplateInfo[] {
  return templateList.filter((t) => t.tags.includes(tag.toLowerCase()));
}

/**
 * Busca templates por termo
 */
export function searchTemplates(query: string): TemplateInfo[] {
  const q = query.toLowerCase();
  return templateList.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)),
  );
}
