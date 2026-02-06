import { useState } from 'react'
import { cn } from '../../../utils/cn'
import { logger } from '../../../utils/logger'

interface ImageInputProps {
  value?: string
  onChange: (v?: string) => void
  label?: string
  size?: { width: number; height: number }
  showUrlInput?: boolean
  maxSizeMB?: number
  tenantId?: string
  schoolId?: string
  siteId?: string
  authToken?: string
  assetType?: 'image' | 'video' | 'icon' | 'logo'
  deferUpload?: boolean
  onPendingFile?: (file: File | null) => void
}

export function ImageInput({
  value,
  onChange,
  label,
  size,
  showUrlInput = true,
  maxSizeMB = 5,
  tenantId,
  schoolId,
  siteId,
  authToken,
  assetType = 'image',
  deferUpload = false,
  onPendingFile,
}: ImageInputProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug('[ImageInput] Upload config:', { tenantId, schoolId, siteId, hasAuthToken: !!authToken, assetType })
    const file = e.target.files?.[0]
    if (!file) return

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Apenas imagens e vídeos são permitidos')
      return
    }

    setError(null)

    if (deferUpload) {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          onChange(dataUrl)
          if (onPendingFile) {
            onPendingFile(file)
          }
        }
        reader.onerror = () => {
          setError('Erro ao ler o arquivo')
        }
        reader.readAsDataURL(file)
      } catch (err) {
        logger.error("Erro ao criar preview:", err)
        setError(err instanceof Error ? err.message : "Erro ao processar imagem")
      }
      return
    }

    if (!authToken) {
      setError('Autenticação necessária para upload')
      return
    }

    if (!tenantId) {
      setError('Contexto do tenant é necessário')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = (import.meta as any).env
        ? ((import.meta as any).env as Record<string, string>).VITE_API_URL || 'http://localhost:3001'
        : 'http://localhost:3001'

      const params = new URLSearchParams({ tenantId, assetType })
      if (schoolId) params.append('schoolId', schoolId)
      if (siteId) params.append('siteId', siteId)

      const res = await fetch(`${apiUrl}/api/site-assets/upload?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error((errorData as Record<string, string>).message || 'Upload falhou')
      }

      const data = await res.json()
      onChange((data as Record<string, string>).url)
      setError(null)
    } catch (err) {
      logger.error("Erro no upload:", err)
      setError(err instanceof Error ? err.message : "Erro ao fazer upload da imagem")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2 flex flex-col items-center">
      {label && (
        <label className="block text-xs font-medium text-gray-800 dark:text-gray-100 text-center">
          {label}
        </label>
      )}

      <input
        ref={(el) => {
          if (el) (window as any).__imageInputRef = el;
        }}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        id={`image-input-${Math.random()}`}
      />

      <button
        type="button"
        onClick={() => {
          const input = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
          if (input) {
            input.value = '';
            input.click();
          }
        }}
        disabled={uploading}
        className={cn(
          'rounded-lg overflow-hidden border-2 transition-all duration-200',
          'flex items-center justify-center',
          'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
          value
            ? 'border-blue-400 dark:border-blue-500 hover:border-blue-500'
            : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400',
          uploading && 'opacity-50 cursor-not-allowed',
          !uploading && 'cursor-pointer'
        )}
        style={{
          height: size?.height || 120,
          width: size?.width || 200,
        }}
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {uploading ? 'Enviando...' : 'Clique para selecionar'}
            </span>
          </div>
        )}
      </button>

      {value && !uploading && (
        <button
          onClick={() => onChange(undefined)}
          type="button"
          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-left transition-colors font-medium"
        >
          Remover imagem
        </button>
      )}

      {showUrlInput && (
        <input
          type="text"
          placeholder="URL da imagem"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={cn(
            'flex h-11 w-full rounded-lg border-2 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none',
            'border-gray-300 dark:border-gray-600 hover:border-blue-400/50 focus:border-blue-500',
            'text-gray-900 dark:text-gray-100'
          )}
        />
      )}

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
