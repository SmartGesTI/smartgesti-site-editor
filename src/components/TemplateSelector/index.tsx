import { Template } from '../../types'
import { cn } from '../../utils/cn'

const defaultTemplates: Template[] = [
  {
    id: 'landing-basic',
    name: 'Landing Page Básica',
    description: 'Uma landing page simples com hero, sobre e contato',
    category: 'landing',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        slug: 'home',
        components: [
          {
            id: 'hero-1',
            type: 'hero',
            props: {
              title: 'Bem-vindo',
              subtitle: 'Sua mensagem aqui',
              buttonText: 'Começar',
            },
            styles: {},
          },
          {
            id: 'text-1',
            type: 'text',
            props: {
              content: 'Conteúdo da sua landing page...',
            },
            styles: {},
          },
        ],
        metadata: {
          title: 'Home',
        },
      },
    ],
  },
  {
    id: 'portfolio-basic',
    name: 'Portfólio Básico',
    description: 'Template simples para portfólio',
    category: 'portfolio',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        slug: 'home',
        components: [
          {
            id: 'hero-1',
            type: 'hero',
            props: {
              title: 'Meu Portfólio',
              subtitle: 'Trabalhos e projetos',
              buttonText: 'Ver Projetos',
            },
            styles: {},
          },
        ],
        metadata: {
          title: 'Portfólio',
        },
      },
    ],
  },
]

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const categories = {
    landing: defaultTemplates.filter((t) => t.category === 'landing'),
    portfolio: defaultTemplates.filter((t) => t.category === 'portfolio'),
    blog: defaultTemplates.filter((t) => t.category === 'blog'),
    business: defaultTemplates.filter((t) => t.category === 'business'),
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Templates
      </h2>

      {Object.entries(categories).map(([category, templates]) => {
        if (templates.length === 0) return null

        return (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">
              {category === 'landing' && 'Landing Pages'}
              {category === 'portfolio' && 'Portfólios'}
              {category === 'blog' && 'Blogs'}
              {category === 'business' && 'Negócios'}
            </h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border',
                    'border-gray-200 dark:border-gray-700',
                    'hover:border-blue-500 dark:hover:border-blue-500',
                    'hover:bg-blue-50 dark:hover:bg-blue-950/20',
                    'transition-colors'
                  )}
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
