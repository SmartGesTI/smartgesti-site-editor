import { useState } from 'react'
import { cn } from '../../utils/cn'

interface ImageInputProps {
  value?: string
  onChange: (v?: string) => void
  label?: string
  size?: { width: number; height: number }
  showUrlInput?: boolean
  maxSizeMB?: number
}

export function ImageInput({
  value,
  onChange,
  label,
  size,
  showUrlInput = true,
  maxSizeMB = 5,
}: ImageInputProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tamanho
    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'

      const res = await fetch(`${apiUrl}/api/sites/upload-image`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Upload falhou')
      }

      const data = await res.json()
      onChange(data.url)
      setError(null)
    } catch (err) {
      console.error("Erro no upload:", err)
      setError(err instanceof Error ? err.message : "Erro ao fazer upload da imagem")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col gap-1.5 flex-1">
        {/* Campo URL manual - CONDICIONAL */}
        {showUrlInput && (
          <input
            type="text"
            placeholder={label || 'URL da imagem'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value || undefined)}
            className={cn(
              'flex h-11 w-full rounded-lg border-2 bg-background px-4 py-2.5 text-sm transition-all duration-200',
              'placeholder:text-muted-foreground',
              'focus:outline-none',
              'border-input hover:border-blue-400/50 focus:border-blue-500',
              'text-gray-900 dark:text-gray-100',
              'min-w-[220px]'
            )}
          />
        )}

        {/* Botão de upload */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className={cn(
              'text-sm',
              'file:mr-4 file:py-2 file:px-4',
              'file:rounded-lg file:border-0',
              'file:text-sm file:font-medium',
              'file:bg-blue-500 file:text-white file:hover:bg-blue-600',
              'file:cursor-pointer file:transition-all',
              'file:hover:scale-[1.02] file:active:scale-[0.98]',
              uploading && 'opacity-50 cursor-not-allowed'
            )}
          />
          {uploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg pointer-events-none">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Enviando...</span>
            </div>
          )}
        </div>

        {/* Botão remover */}
        {value && !uploading && (
          <button
            onClick={() => onChange(undefined)}
            type="button"
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-left transition-colors"
          >
            Remover imagem
          </button>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
      </div>

      {/* Preview */}
      <div
        className={cn(
          'rounded-lg overflow-hidden border-2',
          value ? 'border-blue-400 dark:border-blue-500' : 'border-gray-200 dark:border-gray-700',
          'flex items-center justify-center',
          'bg-gray-50 dark:bg-gray-800',
          'shrink-0'
        )}
        style={{
          width: size?.width || 120,
          height: size?.height || 80,
        }}
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-xs text-center px-2">
            {uploading ? '...' : 'sem imagem'}
          </div>
        )}
      </div>
    </div>
  )
}
