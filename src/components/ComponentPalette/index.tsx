import { ComponentType } from '../../types'
import { cn } from '../../utils/cn'
import { 
  Layout, 
  Type, 
  Heading, 
  Image, 
  Images,
  MousePointerClick, 
  Grid3x3, 
  Square,
  Minus,
  List,
  Navigation,
  User,
  Briefcase,
  Star,
  Phone,
  FileText
} from 'lucide-react'
import { componentDefinitions } from './definitions'
import React from 'react'

const iconMap: Record<ComponentType, React.ElementType> = {
  hero: Layout,
  navbar: Navigation,
  about: User,
  gallery: Images,
  services: Briefcase,
  testimonials: Star,
  contact: Phone,
  footer: FileText,
  section: Layout,
  text: Type,
  heading: Heading,
  image: Image,
  button: MousePointerClick,
  grid: Grid3x3,
  card: Square,
  spacer: Minus,
  divider: Minus,
  container: Layout,
  list: List,
  form: Layout,
  video: Image,
  map: Image,
}

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void
}

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const categories = {
    layout: componentDefinitions.filter((c) => c.category === 'layout'),
    content: componentDefinitions.filter((c) => c.category === 'content'),
    media: componentDefinitions.filter((c) => c.category === 'media'),
    form: componentDefinitions.filter((c) => c.category === 'form'),
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Componentes
      </h2>

      {Object.entries(categories).map(([category, components]) => {
        if (components.length === 0) return null

        return (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase">
              {category === 'layout' && 'Layout'}
              {category === 'content' && 'Conteúdo'}
              {category === 'media' && 'Mídia'}
              {category === 'form' && 'Formulário'}
            </h3>
            <div className="space-y-1">
              {components.map((def) => {
                const Icon = iconMap[def.type] || Layout
                return (
                  <button
                    key={def.type}
                    onClick={() => onAddComponent(def.type)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg',
                      'text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'transition-colors flex items-center gap-2'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {def.name}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
