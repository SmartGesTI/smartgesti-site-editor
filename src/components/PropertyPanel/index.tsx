import { Component, ComponentType } from '../../types'
import { cn } from '../../utils/cn'
import {
  ColorInput,
  ImageInput,
  SliderInput,
  SelectInput,
  CheckboxInput,
  GradientInput,
  VALUE_FORMATTERS,
} from '../inputs'

interface PropertyPanelProps {
  component: Component | undefined
  onUpdate: (updates: Partial<Component>) => void
}

// Detectar tipo de propriedade baseado no nome e valor
function detectPropertyType(key: string, value: any): 'color' | 'image' | 'number' | 'select' | 'boolean' | 'gradient' | 'text' {
  const keyLower = key.toLowerCase()
  
  // Cores
  if (keyLower.includes('color') || keyLower.includes('colour')) {
    return 'color'
  }
  
  // Imagens
  if (keyLower.includes('image') || keyLower.includes('img') || keyLower.includes('src') || keyLower.includes('url')) {
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:') || value.startsWith('/'))) {
      return 'image'
    }
  }
  
  // Gradientes
  if (keyLower.includes('gradient')) {
    return 'gradient'
  }
  
  // Booleanos
  if (typeof value === 'boolean' || keyLower.includes('enabled') || keyLower.includes('show') || keyLower.includes('visible')) {
    return 'boolean'
  }
  
  // Números
  if (typeof value === 'number' || keyLower.includes('opacity') || keyLower.includes('blur') || keyLower.includes('rounded') || keyLower.includes('width') || keyLower.includes('height') || keyLower.includes('size')) {
    return 'number'
  }
  
  // Selects (variantes)
  if (keyLower.includes('variant') || keyLower.includes('type') || keyLower.includes('style')) {
    return 'select'
  }
  
  return 'text'
}

// Obter opções para selects baseado no tipo de componente e propriedade
function getSelectOptions(componentType: ComponentType, key: string): Array<{ value: string; label: string }> {
  const keyLower = key.toLowerCase()
  
  if (keyLower.includes('variant')) {
    switch (componentType) {
      case 'hero':
        return [
          { value: 'classic', label: 'Clássico' },
          { value: 'spotlight', label: 'Spotlight' },
          { value: 'cinematic', label: 'Cinematic' },
          { value: 'glass', label: 'Glass' },
          { value: 'split', label: 'Split' },
          { value: 'parallax', label: 'Parallax' },
          { value: 'banner', label: 'Banner' },
          { value: 'columns', label: 'Columns' },
          { value: 'neon', label: 'Neon' },
          { value: 'collage', label: 'Collage' },
        ]
      case 'gallery':
        return [
          { value: 'classic', label: 'Clássico' },
          { value: 'overlay', label: 'Overlay' },
          { value: 'stacked', label: 'Stacked' },
        ]
      case 'services':
        return [
          { value: 'classic', label: 'Clássico' },
          { value: 'minimal', label: 'Minimal' },
          { value: 'carousel', label: 'Carrossel' },
        ]
      case 'navbar':
        return [
          { value: 'classic', label: 'Clássico' },
          { value: 'sticky', label: 'Sticky' },
          { value: 'compact', label: 'Compact' },
        ]
      default:
        return []
    }
  }
  
  return []
}

export function PropertyPanel({ component, onUpdate }: PropertyPanelProps) {
  if (!component) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Selecione um componente para editar suas propriedades
        </p>
      </div>
    )
  }

  const handlePropChange = (key: string, value: any) => {
    onUpdate({
      props: {
        ...component.props,
        [key]: value,
      },
    })
  }

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      styles: {
        ...component.styles,
        [key]: value,
      },
    })
  }

  const handleVariantChange = (variant: string) => {
    onUpdate({ variant })
  }

  const handleConfigChange = (key: string, value: any) => {
    onUpdate({
      config: {
        ...component.config,
        [key]: value,
      },
    })
  }

  const renderPropertyInput = (
    key: string,
    value: any,
    onChange: (value: any) => void
  ) => {
    const propType = detectPropertyType(key, value)
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

    switch (propType) {
      case 'color':
        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {label}
            </label>
            <ColorInput
              value={value || '#ffffff'}
              onChange={onChange}
              size="medium"
            />
          </div>
        )

      case 'image':
        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {label}
            </label>
            <ImageInput
              value={value}
              onChange={onChange}
              label={label}
            />
          </div>
        )

      case 'number':
        // Determinar min/max/step baseado na propriedade
        let min = 0
        let max = 100
        let step = 1
        let formatValue = VALUE_FORMATTERS.decimal
        let unit = ''

        if (key.toLowerCase().includes('opacity')) {
          min = 0
          max = 1
          step = 0.01
          formatValue = VALUE_FORMATTERS.percentage
        } else if (key.toLowerCase().includes('blur')) {
          min = 0
          max = 80
          step = 1
          unit = 'px'
          formatValue = VALUE_FORMATTERS.pixels
        } else if (key.toLowerCase().includes('rounded')) {
          min = 0
          max = 32
          step = 1
          unit = 'px'
          formatValue = VALUE_FORMATTERS.pixels
        }

        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {label}
            </label>
            <SliderInput
              value={typeof value === 'number' ? value : 0}
              onChange={onChange}
              min={min}
              max={max}
              step={step}
              unit={unit}
              formatValue={formatValue}
            />
          </div>
        )

      case 'select':
        const options = getSelectOptions(component.type, key)
        if (options.length > 0) {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                {label}
              </label>
              <SelectInput
                value={value || options[0].value}
                onChange={onChange}
                options={options}
                width={200}
              />
            </div>
          )
        }
        // Fallback para text se não houver opções
        break

      case 'boolean':
        return (
          <div key={key}>
            <CheckboxInput
              checked={value === true}
              onChange={onChange}
              label={label}
            />
          </div>
        )

      case 'gradient':
        // Para gradientes, precisamos de configuração especial
        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {label}
            </label>
            <GradientInput
              enabled={value?.enabled || false}
              startColor={value?.startColor || '#ffffff'}
              endColor={value?.endColor || '#000000'}
              onEnabledChange={(enabled) => onChange({ ...value, enabled })}
              onStartColorChange={(color) => onChange({ ...value, startColor: color })}
              onEndColorChange={(color) => onChange({ ...value, endColor: color })}
            />
          </div>
        )

      default:
        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {label}
            </label>
            <input
              type="text"
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'text-sm',
                'border-2 border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-gray-100',
                'focus:outline-none focus:border-blue-500',
                'transition-colors'
              )}
            />
          </div>
        )
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Propriedades
      </h2>

      {/* Variante (se suportado) */}
      {['hero', 'navbar', 'gallery', 'services', 'about', 'testimonials', 'contact', 'footer'].includes(component.type) && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">
            Variante
          </h3>
          <SelectInput
            value={component.variant || 'classic'}
            onChange={handleVariantChange}
            options={getSelectOptions(component.type, 'variant')}
            width={200}
          />
        </div>
      )}

      {/* Propriedades do Componente */}
      {Object.keys(component.props).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">
            Conteúdo
          </h3>
          <div className="space-y-4">
            {Object.entries(component.props).map(([key, value]) =>
              renderPropertyInput(key, value, (val) => handlePropChange(key, val))
            )}
          </div>
        </div>
      )}

      {/* Estilos do Componente */}
      {Object.keys(component.styles).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">
            Estilos
          </h3>
          <div className="space-y-4">
            {Object.entries(component.styles).map(([key, value]) =>
              renderPropertyInput(key, value, (val) => handleStyleChange(key, val))
            )}
          </div>
        </div>
      )}

      {/* Configurações avançadas */}
      {component.config && Object.keys(component.config).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">
            Configurações Avançadas
          </h3>
          <div className="space-y-4">
            {Object.entries(component.config).map(([key, value]) =>
              renderPropertyInput(key, value, (val) => handleConfigChange(key, val))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
