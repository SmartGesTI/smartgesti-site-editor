/**
 * Render Page
 * Renderiza uma página completa do site
 */

import React from 'react'
import { SitePage, SiteDocumentV2 } from '../schema/siteDocument'
import { renderBlockNode } from './renderNodeImpl'
import { generateThemeCSSVariables } from '../schema/themeTokens'

export interface RenderPageProps {
  page: SitePage
  document?: SiteDocumentV2
  className?: string
}

/**
 * Componente React que renderiza uma página completa
 */
export function RenderPage({ page, document, className }: RenderPageProps) {
  const themeCSS = document ? generateThemeCSSVariables(document.theme) : ''

  return (
    <div className={className} style={{ fontFamily: 'var(--sg-font-body, system-ui)' }}>
      {themeCSS && <style>{themeCSS}</style>}
      {page.structure.map((block) => (
        <React.Fragment key={block.id}>{renderBlockNode(block)}</React.Fragment>
      ))}
    </div>
  )
}

/**
 * Função que renderiza uma página e retorna JSX
 */
export function renderPage(page: SitePage, document?: SiteDocumentV2): React.ReactNode {
  return <RenderPage page={page} document={document} />
}
