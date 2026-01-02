import { useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Page, Component, Site } from '../../types'
import { cn } from '../../utils/cn'
import { Trash2, GripVertical } from 'lucide-react'
import { ComponentRenderer } from '../renderers/ComponentRenderer'
import { applySiteTheme } from '../../utils/themeApplier'

interface PreviewPanelProps {
  page: Page | null
  site: Site | null
  selectedComponentId: string | null
  onSelectComponent: (id: string | null) => void
  onDeleteComponent: (id: string) => void
  onReorderComponents: (components: Component[]) => void
}

interface SortableComponentProps {
  component: Component
  site: Site | null
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function SortableComponent({
  component,
  site,
  isSelected,
  onSelect,
  onDelete,
}: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const baseClasses = cn(
    'relative group',
    isSelected && 'ring-2 ring-blue-500 ring-offset-2',
    isDragging && 'opacity-50'
  )

  // Usar sistema de renderers se site disponível, senão fallback básico
  const renderContent = () => {
    if (site) {
      return (
        <ComponentRenderer
          componentType={component.type}
          component={component}
          site={site}
        />
      )
    }

    // Fallback básico se site não disponível
    return (
      <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {component.type} {component.variant ? `(${component.variant})` : ''}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <div className="flex items-start gap-2 group">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            'p-1 rounded cursor-grab active:cursor-grabbing',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          )}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div
          className={cn('flex-1', baseClasses)}
          onClick={onSelect}
        >
          {renderContent()}
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function PreviewPanel({
  page,
  site,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  onReorderComponents,
}: PreviewPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Aplicar tema do site quando disponível
  useEffect(() => {
    if (site?.theme?.colorPalette) {
      applySiteTheme(site.theme.colorPalette)
    }
    return () => {
      // Cleanup opcional - remover tema quando componente desmontar
    }
  }, [site?.theme?.colorPalette])

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma página selecionada
        </p>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = page.components.findIndex((c) => c.id === active.id)
      const newIndex = page.components.findIndex((c) => c.id === over.id)

      const newComponents = arrayMove(page.components, oldIndex, newIndex)
      onReorderComponents(newComponents)
    }
  }

  return (
    <div className="max-w-4xl mx-auto site-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 min-h-[600px]">
          <SortableContext
            items={page.components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {page.components.map((component) => (
                <SortableComponent
                  key={component.id}
                  component={component}
                  site={site}
                  isSelected={component.id === selectedComponentId}
                  onSelect={() => onSelectComponent(component.id)}
                  onDelete={() => onDeleteComponent(component.id)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}
