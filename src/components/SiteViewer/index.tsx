import { useState, useEffect } from 'react'
import { SiteViewerProps, Site } from '../../types'
import { ComponentRenderer } from '../renderers/ComponentRenderer'
import { applySiteTheme } from '../../utils/themeApplier'
// CSS será importado pelo consumidor ou via import dinâmico

export function SiteViewer({ siteId, apiBaseUrl, projectId }: SiteViewerProps) {
  const [site, setSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSite()
  }, [siteId])

  // Aplicar tema do site quando disponível
  useEffect(() => {
    if (site?.theme?.colorPalette) {
      applySiteTheme(site.theme.colorPalette)
    }
  }, [site?.theme?.colorPalette])

  const loadSite = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/sites/${siteId}?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error('Site não encontrado')
      }

      const data = await response.json()
      setSite(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar site')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-300">Carregando site...</div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {error || 'Site não encontrado'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            O site que você está procurando não existe ou não está disponível.
          </p>
        </div>
      </div>
    )
  }

  // Se o site tem HTML publicado, renderizar diretamente
  if (site.publishedHtml) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: site.publishedHtml }}
        className="site-container site-viewer"
      />
    )
  }

  // Caso contrário, renderizar a primeira página usando sistema de renderers
  const currentPage = site.pages[0]
  if (!currentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">
          Este site não possui páginas.
        </p>
      </div>
    )
  }

  // Renderizar componentes da página usando sistema de renderers
  return (
    <div className="site-container min-h-screen" style={{ background: 'var(--site-background, #0a0a0a)' }}>
      {currentPage.components.map((component) => (
        <ComponentRenderer
          key={component.id}
          componentType={component.type}
          component={component}
          site={site}
        />
      ))}
    </div>
  )
}
