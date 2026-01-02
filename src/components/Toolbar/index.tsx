import { Save, Eye, Globe, Loader2, Undo2, Redo2 } from 'lucide-react'
import { Site } from '../../types'
import { cn } from '../../utils/cn'

interface ToolbarProps {
  site: Site
  onSave: () => void
  onPublish: () => void
  onPreview?: () => void
  isLoading: boolean
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

export function Toolbar({ 
  site, 
  onSave, 
  onPublish, 
  onPreview,
  isLoading,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {site.name || 'Novo Site'}
        </h1>
        {site.published && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
            Publicado
          </span>
        )}
        {(canUndo || canRedo) && (
          <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={cn(
                'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={cn(
                'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
              title="Refazer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium',
            'bg-blue-500 hover:bg-blue-600 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-2 transition-colors'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar
        </button>

        <button
          onClick={onPublish}
          disabled={isLoading || !site.id}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium',
            'bg-emerald-500 hover:bg-emerald-600 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-2 transition-colors'
          )}
        >
          <Globe className="w-4 h-4" />
          Publicar
        </button>

        {onPreview && (
          <button
            onClick={onPreview}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'border border-gray-300 dark:border-gray-600',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'text-gray-700 dark:text-gray-300',
              'flex items-center gap-2 transition-colors'
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        )}
      </div>
    </div>
  )
}
