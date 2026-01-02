import { useState, useEffect } from 'react'
import { SiteEditorProps, Site, Page, Template, ComponentType, Component, ComponentDefinition } from '../../types'
import { ComponentPalette } from '../ComponentPalette'
import { PropertyPanel } from '../PropertyPanel'
import { PreviewPanel } from '../PreviewPanel'
import { Toolbar } from '../Toolbar'
import { TemplateSelector } from '../TemplateSelector'
import { cn } from '../../utils/cn'
import { componentDefinitions } from '../ComponentPalette/definitions'

export function SiteEditor({
  projectId,
  apiBaseUrl,
  siteId,
  onSave,
  onPublish,
  initialData,
  previewUrl,
}: SiteEditorProps) {
  const [site, setSite] = useState<Site | null>(initialData || null)
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(!initialData)

  // Carregar site se siteId for fornecido
  useEffect(() => {
    if (siteId && !initialData) {
      loadSite(siteId)
    } else if (initialData) {
      setSite(initialData)
      if (initialData.pages.length > 0) {
        setCurrentPage(initialData.pages[0])
      }
    }
  }, [siteId, initialData])

  const loadSite = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/sites/${id}`)
      if (!response.ok) throw new Error('Failed to load site')
      const data = await response.json()
      setSite(data)
      if (data.pages.length > 0) {
        setCurrentPage(data.pages[0])
      }
    } catch (error) {
      console.error('Error loading site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!site) return

    setIsLoading(true)
    try {
      if (onSave) {
        await onSave(site)
      } else {
        // Fallback para API padrão
        const method = site.id ? 'PUT' : 'POST'
        const url = site.id
          ? `${apiBaseUrl}/sites/${site.id}`
          : `${apiBaseUrl}/sites`

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(site),
        })

        if (!response.ok) throw new Error('Failed to save site')
        const saved = await response.json()
        setSite(saved)
      }
    } catch (error) {
      console.error('Error saving site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!site) return

    setIsLoading(true)
    try {
      if (onPublish) {
        await onPublish(site)
      } else {
        const response = await fetch(`${apiBaseUrl}/sites/${site.id}/publish`, {
          method: 'POST',
        })

        if (!response.ok) throw new Error('Failed to publish site')
        const published = await response.json()
        setSite(published)
      }
    } catch (error) {
      console.error('Error publishing site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComponent = (componentType: string, variant?: string) => {
    if (!currentPage) return

    // Obter definição do componente para props padrão
    const componentDef = componentDefinitions.find((def: ComponentDefinition) => def.type === componentType)
    
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type: componentType as ComponentType,
      variant: variant || getDefaultVariant(componentType as ComponentType),
      props: componentDef?.defaultProps || {},
      styles: componentDef?.defaultStyles || {},
      config: {},
    }

    const updatedPage: Page = {
      ...currentPage,
      components: [...currentPage.components, newComponent],
    }

    const updatedPages = site!.pages.map((p) =>
      p.id === currentPage.id ? updatedPage : p
    )

    setSite({ ...site!, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

  // Helper para obter variante padrão
  const getDefaultVariant = (type: ComponentType): string => {
    const defaultVariants: Record<ComponentType, string> = {
      hero: 'classic',
      navbar: 'classic',
      gallery: 'classic',
      services: 'classic',
      about: 'classic',
      testimonials: 'classic',
      contact: 'classic',
      footer: 'classic',
      section: 'default',
      container: 'default',
      text: 'default',
      heading: 'default',
      image: 'default',
      button: 'default',
      grid: 'default',
      card: 'default',
      spacer: 'default',
      divider: 'default',
      list: 'default',
      form: 'default',
      video: 'default',
      map: 'default',
    }
    return defaultVariants[type] || 'default'
  }

  const handleUpdateComponent = (componentId: string, updates: Partial<any>) => {
    if (!currentPage) return

    const updatedComponents = currentPage.components.map((comp) =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    )

    const updatedPage: Page = {
      ...currentPage,
      components: updatedComponents,
    }

    const updatedPages = site!.pages.map((p) =>
      p.id === currentPage.id ? updatedPage : p
    )

    setSite({ ...site!, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

  const handleDeleteComponent = (componentId: string) => {
    if (!currentPage) return

    const updatedComponents = currentPage.components.filter(
      (comp) => comp.id !== componentId
    )

    const updatedPage: Page = {
      ...currentPage,
      components: updatedComponents,
    }

    const updatedPages = site!.pages.map((p) =>
      p.id === currentPage.id ? updatedPage : p
    )

    setSite({ ...site!, pages: updatedPages })
    setCurrentPage(updatedPage)
    setSelectedComponentId(null)
  }

  const handleReorderComponents = (components: any[]) => {
    if (!currentPage) return

    const updatedPage: Page = {
      ...currentPage,
      components,
    }

    const updatedPages = site!.pages.map((p) =>
      p.id === currentPage.id ? updatedPage : p
    )

    setSite({ ...site!, pages: updatedPages })
    setCurrentPage(updatedPage)
  }

  const handleSelectTemplate = (template: Template) => {
    const newSite: Site = {
      id: '',
      projectId,
      name: template.name,
      slug: template.name.toLowerCase().replace(/\s+/g, '-'),
      pages: template.pages,
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSite(newSite)
    if (template.pages.length > 0) {
      setCurrentPage(template.pages[0])
    }
    setShowTemplates(false)
  }

  const handleCreateNewSite = () => {
    const newSite: Site = {
      id: '',
      projectId,
      name: 'Novo Site',
      slug: 'novo-site',
      pages: [
        {
          id: 'page-1',
          name: 'Home',
          slug: 'home',
          components: [],
          metadata: {},
        },
      ],
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSite(newSite)
    setCurrentPage(newSite.pages[0])
    setShowTemplates(false)
  }

  if (isLoading && !site) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-300">Carregando editor...</div>
      </div>
    )
  }

  if (showTemplates || !site) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Criar Novo Site
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha um template ou comece do zero
              </p>
            </div>

            <div className="mb-6">
              <button
                onClick={handleCreateNewSite}
                className={cn(
                  'w-full p-6 rounded-lg border-2 border-dashed',
                  'border-gray-300 dark:border-gray-600',
                  'hover:border-blue-500 dark:hover:border-blue-500',
                  'hover:bg-blue-50 dark:hover:bg-blue-950/20',
                  'transition-colors text-center'
                )}
              >
                <div className="text-2xl mb-2">+</div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  Começar do Zero
                </div>
              </button>
            </div>

            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>
        </div>
      </div>
    )
  }

  const selectedComponent = currentPage?.components.find(
    (c) => c.id === selectedComponentId
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Esquerda - Paleta de Componentes */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-card">
        <ComponentPalette onAddComponent={handleAddComponent} />
      </div>

      {/* Área Central - Preview */}
      <div className="flex-1 flex flex-col">
        <Toolbar
          site={site}
          onSave={handleSave}
          onPublish={handlePublish}
          isLoading={isLoading}
          onPreview={() => {
            if (site.id && previewUrl) {
              window.open(previewUrl(site.id), '_blank')
            }
          }}
        />
        <div className="flex-1 overflow-auto p-4">
          <PreviewPanel
            page={currentPage}
            site={site}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            onDeleteComponent={handleDeleteComponent}
            onReorderComponents={handleReorderComponents}
          />
        </div>
      </div>

      {/* Sidebar Direita - Painel de Propriedades */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-card">
        <PropertyPanel
          component={selectedComponent}
          onUpdate={(updates) => {
            if (selectedComponentId) {
              handleUpdateComponent(selectedComponentId, updates)
            }
          }}
        />
      </div>
    </div>
  )
}
