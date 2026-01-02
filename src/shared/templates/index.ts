/**
 * Templates estáticos para Landing Pages
 * 
 * Cada template é um SiteDocumentV2 completo pronto para uso
 * Backends podem usar como base para geração por IA
 */

import { landingSaasTemplate } from './landing-saas'
import { landingEscolaTemplate } from './landing-escola'
import { landingPortfolioTemplate } from './landing-portfolio'
import { landingEmpresaTemplate } from './landing-empresa'
import { landingEventoTemplate } from './landing-evento'

// Re-export templates individuais
export { landingSaasTemplate } from './landing-saas'
export { landingEscolaTemplate } from './landing-escola'
export { landingPortfolioTemplate } from './landing-portfolio'
export { landingEmpresaTemplate } from './landing-empresa'
export { landingEventoTemplate } from './landing-evento'

/**
 * Informações sobre templates disponíveis
 */
export interface TemplateInfo {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  preview?: string
}

/**
 * Lista de templates disponíveis com metadados
 */
export const templateList: TemplateInfo[] = [
  {
    id: 'landing-saas',
    name: 'SaaS / Software',
    description: 'Template moderno para produtos digitais, software e apps',
    category: 'business',
    tags: ['saas', 'software', 'startup', 'produto', 'tech'],
    preview: 'https://placehold.co/400x300/6366f1/white?text=SaaS',
  },
  {
    id: 'landing-escola',
    name: 'Escola / Curso',
    description: 'Ideal para escolas, cursos online e instituições de ensino',
    category: 'education',
    tags: ['escola', 'curso', 'educação', 'ensino', 'aprendizado'],
    preview: 'https://placehold.co/400x300/059669/white?text=Escola',
  },
  {
    id: 'landing-portfolio',
    name: 'Portfolio',
    description: 'Para freelancers, designers, desenvolvedores e criativos',
    category: 'personal',
    tags: ['portfolio', 'freelancer', 'designer', 'desenvolvedor', 'criativo'],
    preview: 'https://placehold.co/400x300/0f172a/white?text=Portfolio',
  },
  {
    id: 'landing-empresa',
    name: 'Empresa / Serviços',
    description: 'Para empresas, consultorias, agências e prestadores de serviços',
    category: 'business',
    tags: ['empresa', 'consultoria', 'agência', 'serviços', 'b2b'],
    preview: 'https://placehold.co/400x300/1e40af/white?text=Empresa',
  },
  {
    id: 'landing-evento',
    name: 'Evento',
    description: 'Para conferências, workshops, webinars e eventos',
    category: 'event',
    tags: ['evento', 'conferência', 'workshop', 'webinar', 'meetup'],
    preview: 'https://placehold.co/400x300/7c3aed/white?text=Evento',
  },
]

/**
 * Mapa de templates por ID para acesso rápido
 */
export const templates = {
  'landing-saas': landingSaasTemplate,
  'landing-escola': landingEscolaTemplate,
  'landing-portfolio': landingPortfolioTemplate,
  'landing-empresa': landingEmpresaTemplate,
  'landing-evento': landingEventoTemplate,
} as const

export type TemplateId = keyof typeof templates

/**
 * Retorna um template pelo ID
 */
export function getTemplate(id: TemplateId) {
  return templates[id] || null
}

/**
 * Retorna templates filtrados por categoria
 */
export function getTemplatesByCategory(category: string): TemplateInfo[] {
  return templateList.filter(t => t.category === category)
}

/**
 * Retorna templates filtrados por tag
 */
export function getTemplatesByTag(tag: string): TemplateInfo[] {
  return templateList.filter(t => t.tags.includes(tag.toLowerCase()))
}

/**
 * Busca templates por termo
 */
export function searchTemplates(query: string): TemplateInfo[] {
  const q = query.toLowerCase()
  return templateList.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q))
  )
}
