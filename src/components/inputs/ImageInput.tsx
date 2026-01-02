import { cn } from '../../utils/cn'

interface ImageInputProps {
  value?: string
  onChange: (v?: string) => void
  label?: string
  size?: { width: number; height: number }
}

export function ImageInput({
  value,
  onChange,
  label,
  size,
}: ImageInputProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex flex-col gap-1.5 flex-1">
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = (ev) => onChange(ev.target?.result as string)
            reader.readAsDataURL(file)
          }}
          className={cn(
            'text-sm',
            'file:mr-4 file:py-2 file:px-4',
            'file:rounded-lg file:border-0',
            'file:text-sm file:font-medium',
            'file:bg-blue-500 file:text-white file:hover:bg-blue-600',
            'file:cursor-pointer file:transition-all',
            'file:hover:scale-[1.02] file:active:scale-[0.98]'
          )}
        />
      </div>

      <div
        className={cn(
          'rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700',
          'flex items-center justify-center',
          'bg-gray-50 dark:bg-gray-800'
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
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-xs">
            sem imagem
          </div>
        )}
      </div>
    </div>
  )
}
