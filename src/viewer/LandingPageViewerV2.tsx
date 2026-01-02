/**
 * Landing Page Viewer V2
 * Visualização pública da landing page usando engine V2
 */

import { useState, useEffect } from 'react'
import { SiteDocumentV2 } from '../engine'
import { exportPageToHtml } from '../engine'

interface LandingPageViewerV2Props {
  siteId: string
  apiBaseUrl: string
  projectId: string
}

export function LandingPageViewerV2({ siteId, apiBaseUrl, projectId }: LandingPageViewerV2Props) {
  const [document, setDocument] = useState<SiteDocumentV2 | null>(null)
  const [publishedHtml, setPublishedHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLandingPage()
  }, [siteId])

  const loadLandingPage = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/sites/${siteId}?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error('Landing page não encontrada')
      }

      const data = await response.json()
      
      // Se tiver publishedHtml, usar HTML publicado (estático)
      if (data.publishedHtml) {
        setPublishedHtml(data.publishedHtml)
        setDocument(null)
      } else if (data.template) {
        // Verificar se é V2 ou V1 (legado)
        if (data.template.schemaVersion === 2) {
          setDocument(data.template as SiteDocumentV2)
          setPublishedHtml(null)
        } else {
          // V1 legado - tentar converter ou mostrar erro
          throw new Error('Formato de template legado não suportado. Por favor, recrie o site.')
        }
      } else {
        throw new Error('Template não encontrado')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar landing page')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div>{error || 'Landing page não encontrada'}</div>
      </div>
    )
  }

  // Se tiver HTML publicado, renderizar diretamente
  if (publishedHtml) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: publishedHtml }}
        style={{ minHeight: '100vh' }}
      />
    )
  }

  // Caso contrário, renderizar documento V2
  if (!document) {
    return null
  }

  // Obter página home
  const page = document.pages.find((p) => p.id === 'home') || document.pages[0]
  if (!page) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Página não encontrada</div>
      </div>
    )
  }

  // Gerar HTML da página
  const html = exportPageToHtml(page, document, true)

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ minHeight: '100vh' }}
    />
  )
}
