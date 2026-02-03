import { useState } from 'react'
import { cn } from '../../utils/cn'

interface ImageInputProps {
  value?: string
  onChange: (v?: string) => void
  label?: string
  size?: { width: number; height: number }
  showUrlInput?: boolean
  maxSizeMB?: number
  // Novos: Contexto para upload seguro
  tenantId?: string
  schoolId?: string
  siteId?: string
  authToken?: string
  assetType?: 'image' | 'video' | 'icon' | 'logo'
  // Novo: Modo de preview (Data URL) sem upload imediato
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
    console.log('[ImageInput] Upload config:', { tenantId, schoolId, siteId, hasAuthToken: !!authToken, assetType })
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tamanho
    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }

    // Validação de tipo
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Apenas imagens e vídeos são permitidos')
      return
    }

    setError(null)

    // MODO PREVIEW: Usar Data URL sem fazer upload imediato
    if (deferUpload) {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          onChange(dataUrl) // Passa Data URL para preview
          if (onPendingFile) {
            onPendingFile(file) // Notifica que há upload pendente
          }
        }
        reader.onerror = () => {
          setError('Erro ao ler o arquivo')
        }
        reader.readAsDataURL(file)
      } catch (err) {
        console.error("Erro ao criar preview:", err)
        setError(err instanceof Error ? err.message : "Erro ao processar imagem")
      }
      return
    }

    // MODO NORMAL: Upload imediato (comportamento original)
    // Verificar se tem autenticação (novo endpoint requer)
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

      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'

      // Construir query parameters
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
        throw new Error(errorData.message || 'Upload falhou')
      }

      const data = await res.json()
      // Usar a URL pública retornada do Supabase Storage
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
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
          {label}
        </label>
      )}

      {/* Input file oculto */}
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

      {/* Preview clicável - Funciona como botão */}
      <button
        type="button"
        onClick={() => {
          const input = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
          if (input) {
            input.value = ''; // Limpar valor para permitir selecionar o mesmo arquivo novamente
            input.click();
          }
        }}
        disabled={uploading}
        className={cn(
          'rounded-lg overflow-hidden border-2 transition-all duration-200',
          'flex items-center justify-center w-full',
          'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
          value
            ? 'border-blue-400 dark:border-blue-500 hover:border-blue-500'
            : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400',
          uploading && 'opacity-50 cursor-not-allowed',
          !uploading && 'cursor-pointer'
        )}
        style={{
          height: size?.height || 120,
          maxWidth: size?.width || 200,
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

      {/* Botão remover - APENAS SE HOUVER IMAGEM */}
      {value && !uploading && (
        <button
          onClick={() => onChange(undefined)}
          type="button"
          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-left transition-colors font-medium"
        >
          Remover imagem
        </button>
      )}

      {/* Campo URL manual - CONDICIONAL */}
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

      {/* Mensagem de erro */}
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
