/**
 * Block Property Editor
 * Editor dinâmico de propriedades baseado em inspectorMeta
 */

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { Block, SiteDocumentV2 } from '../engine'
import { componentRegistry } from '../engine'
import { InspectorMeta } from '../engine'
import { cn } from '../utils/cn'

// Importar componentes de input (usar versões simplificadas se necessário)
// Por enquanto, vamos criar inputs básicos inline

interface BlockPropertyEditorProps {
  block: Block | null
  document?: SiteDocumentV2
  currentPageId?: string
  onUpdate: (updates: Record<string, any>) => void
}

/**
 * Componente de input de texto - atualização instantânea em tempo real
 */
function TextInput({
  value,
  onChange,
  label,
  description,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
  placeholder?: string
}) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Atualização instantânea - tempo real
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        className={cn(
          'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder={placeholder || label}
      />
    </div>
  )
}

/**
 * Componente de textarea - atualização instantânea em tempo real
 */
function TextAreaInput({
  value,
  onChange,
  label,
  description,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
  placeholder?: string
  rows?: number
}) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Atualização instantânea - tempo real
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        rows={rows}
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
          'transition-all duration-200 placeholder:text-muted-foreground resize-y',
          'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
        )}
        placeholder={placeholder || label}
      />
    </div>
  )
}

/**
 * Componente de input de cor com debounce para arrastar
 */
function ColorInput({
  value,
  onChange,
  label,
  description,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  description?: string
}) {
  const colorDebounceRef = useRef<number | null>(null)
  const [localValue, setLocalValue] = useState(value || '#000000')

  useEffect(() => {
    setLocalValue(value || '#000000')
  }, [value])

  const handleColorPickerChange = useCallback((newValue: string) => {
    setLocalValue(newValue)
    
    // Debounce para arrastar a barra de cor
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current)
    }
    
    colorDebounceRef.current = window.setTimeout(() => {
      onChange(newValue)
    }, 50)
  }, [onChange])

  const handleColorPickerMouseUp = useCallback((newValue: string) => {
    // Garantir atualização final quando soltar o mouse
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current)
    }
    onChange(newValue)
  }, [onChange])

  const handleTextChange = useCallback((newValue: string) => {
    setLocalValue(newValue)
    // Input de texto atualiza imediatamente
    onChange(newValue)
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
        {label}
        {description && (
          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
            {description}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={localValue}
          onChange={(e) => handleColorPickerChange(e.target.value)}
          onMouseUp={(e) => handleColorPickerMouseUp(e.currentTarget.value)}
          className="h-9 w-16 rounded-lg border-2 border-input cursor-pointer"
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleTextChange(e.target.value)}
          className={cn(
            'flex h-9 flex-1 rounded-lg border-2 bg-background px-3 py-2 text-sm font-mono',
            'transition-all duration-200 placeholder:text-muted-foreground',
            'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
          )}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

/**
 * Renderiza um input baseado no tipo especificado em inspectorMeta
 */
function renderInput(
  propName: string,
  meta: InspectorMeta,
  value: any,
  onChange: (value: any) => void
): React.ReactNode {
  const { label, description, inputType, options, min, max, step } = meta

  switch (inputType) {
    case 'text':
      return (
        <TextInput
          key={propName}
          value={value || ''}
          onChange={onChange}
          label={label}
          description={description}
          placeholder={label}
        />
      )

    case 'textarea':
      return (
        <TextAreaInput
          key={propName}
          value={value || ''}
          onChange={onChange}
          label={label}
          description={description}
          placeholder={label}
          rows={3}
        />
      )

    case 'number':
      return (
        <div key={propName} className="space-y-1">
          <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
            {label}
            {description && (
              <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
                {description}
              </span>
            )}
          </label>
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            min={min}
            max={max}
            step={step || 1}
            className={cn(
              'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
              'transition-all duration-200 placeholder:text-muted-foreground',
              'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
            )}
            placeholder={label}
          />
        </div>
      )

    case 'color':
      return (
        <ColorInput
          key={propName}
          value={value || '#000000'}
          onChange={onChange}
          label={label}
          description={description}
        />
      )

    case 'select':
      if (!options || options.length === 0) {
        // Fallback para text input
        return renderInput(propName, { ...meta, inputType: 'text' }, value, onChange)
      }
      return (
        <div key={propName} className="space-y-1">
          <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
            {label}
            {description && (
              <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
                {description}
              </span>
            )}
          </label>
          <select
            value={value ?? options[0]?.value}
            onChange={(e) => {
              const selectedOption = options.find((opt) => String(opt.value) === e.target.value)
              onChange(selectedOption ? selectedOption.value : e.target.value)
            }}
            className={cn(
              'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
              'transition-all duration-200',
              'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500',
              'cursor-pointer'
            )}
          >
            {options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )

    case 'slider':
      return (
        <div key={propName} className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
              {label}
              {description && (
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
                  {description}
                </span>
              )}
            </label>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {value ?? min ?? 0}
            </span>
          </div>
          <input
            type="range"
            value={value ?? min ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min ?? 0}
            max={max ?? 100}
            step={step || 1}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )

    case 'image':
      return (
        <div key={propName} className="space-y-1">
          <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
            {label}
            {description && (
              <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
                {description}
              </span>
            )}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'flex h-9 w-full rounded-lg border-2 bg-background px-3 py-2 text-sm',
              'transition-all duration-200 placeholder:text-muted-foreground',
              'focus:outline-none border-input hover:border-blue-400/50 focus:border-blue-500'
            )}
            placeholder="URL da imagem"
          />
          {value && (
            <img
              src={value}
              alt="Preview"
              className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
        </div>
      )

    default:
      // Fallback para text input
      return renderInput(propName, { ...meta, inputType: 'text' }, value, onChange)
  }
}

export function BlockPropertyEditor({
  block,
  onUpdate,
}: BlockPropertyEditorProps) {
  // Obter definição do bloco do registry
  const blockDefinition = useMemo(() => {
    if (!block) return null
    return componentRegistry.get(block.type)
  }, [block])

  // Agrupar propriedades por grupo
  const groupedProps = useMemo(() => {
    if (!block || !blockDefinition?.inspectorMeta) return {}

    const props = block.props as Record<string, any>
    const groups: Record<string, Array<{ propName: string; meta: InspectorMeta; value: any }>> = {}

    for (const [propName, meta] of Object.entries(blockDefinition.inspectorMeta)) {
      const group = meta.group || 'Geral'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push({
        propName,
        meta,
        value: props[propName],
      })
    }

    return groups
  }, [block, blockDefinition])

  if (!block) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        Selecione um bloco para editar
      </div>
    )
  }

  if (!blockDefinition) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        Tipo de bloco desconhecido: {block.type}
      </div>
    )
  }

  const handlePropChange = (propName: string, value: any) => {
    onUpdate({ [propName]: value })
  }

  return (
    <div className="p-3 space-y-4">
      {/* Header com nome do bloco */}
      <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {blockDefinition.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {blockDefinition.description}
        </p>
      </div>

      {/* Propriedades agrupadas */}
      {Object.keys(groupedProps).length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-4">
          Nenhuma propriedade configurável
        </div>
      ) : (
        Object.entries(groupedProps).map(([groupName, props]) => (
          <div key={groupName} className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {groupName}
            </h4>
            <div className="space-y-3">
              {props.map(({ propName, meta, value }) =>
                renderInput(propName, meta, value, (newValue) =>
                  handlePropChange(propName, newValue)
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
