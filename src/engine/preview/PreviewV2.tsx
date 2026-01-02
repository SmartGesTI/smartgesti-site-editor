/**
 * Preview V2 - REFATORADO
 * Sem dependências circulares, sem reloads desnecessários
 */

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { SiteDocumentV2, Block } from '../schema/siteDocument'
import { exportPageToHtml, exportBlockToHtml } from '../export/exportHtml'
import { detectChangedBlocks } from '../../utils/changeDetector'
import { hashDocument } from '../../utils/documentHash'

export interface PreviewV2Props {
  document: SiteDocumentV2
  pageId?: string
  className?: string
  style?: React.CSSProperties
  onBlockClick?: (blockId: string) => void
  selectedBlockId?: string | null
}

/**
 * Encontra um bloco na estrutura recursivamente
 */
function findBlockInPage(page: any, blockId: string): Block | null {
  const findInBlocks = (blocks: Block[]): Block | null => {
    for (const block of blocks) {
      if (block.id === blockId) return block
      const props = block.props as any
      if (props?.children && Array.isArray(props.children)) {
        const found = findInBlocks(props.children)
        if (found) return found
      }
      if (block.type === 'card') {
        if (props.header && Array.isArray(props.header)) {
          const found = findInBlocks(props.header)
          if (found) return found
        }
        if (props.content && Array.isArray(props.content)) {
          const found = findInBlocks(props.content)
          if (found) return found
        }
        if (props.footer && Array.isArray(props.footer)) {
          const found = findInBlocks(props.footer)
          if (found) return found
        }
      }
    }
    return null
  }
  return findInBlocks(page.structure)
}

/**
 * Componente de preview usando iframe isolado
 */
export function PreviewV2({
  document,
  pageId,
  className,
  style,
  onBlockClick,
  selectedBlockId,
}: PreviewV2Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previousDocRef = useRef<SiteDocumentV2 | null>(null)
  const previousDocHashRef = useRef<string | null>(null)
  const isInitializedRef = useRef<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Usar refs para evitar dependências circulares
  const selectedBlockIdRef = useRef(selectedBlockId)
  const onBlockClickRef = useRef(onBlockClick)
  
  // Atualizar refs quando props mudam
  useEffect(() => {
    selectedBlockIdRef.current = selectedBlockId
  }, [selectedBlockId])
  
  useEffect(() => {
    onBlockClickRef.current = onBlockClick
  }, [onBlockClick])

  const page = useMemo(() => {
    return pageId
      ? document.pages.find((p) => p.id === pageId)
      : document.pages[0]
  }, [document, pageId])

  // Atualizar highlight diretamente no iframe (sem reload)
  const updateHighlight = (blockId: string | null) => {
    if (!iframeRef.current) return
    
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!iframeDoc) return
    
    requestAnimationFrame(() => {
      // Remover highlight anterior
      const oldStyle = iframeDoc.getElementById('block-highlight')
      if (oldStyle) oldStyle.remove()
      
      const allBlocks = iframeDoc.querySelectorAll('[data-block-id]')
      allBlocks.forEach((el) => {
        const htmlEl = el as HTMLElement
        htmlEl.style.outline = ''
        htmlEl.style.outlineOffset = ''
      })
      
      // Adicionar novo highlight
      if (blockId) {
        const highlightStyle = iframeDoc.createElement('style')
        highlightStyle.id = 'block-highlight'
        highlightStyle.textContent = `
          [data-block-id="${blockId}"] {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
            position: relative;
          }
          [data-block-id="${blockId}"]::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: rgba(59, 130, 246, 0.1);
            pointer-events: none;
            z-index: -1;
          }
        `
        iframeDoc.head.appendChild(highlightStyle)
      }
    })
  }

  // Atualizar preview completo (com srcdoc - causa reload)
  const updateFullPreview = (doc: SiteDocumentV2, showLoading: boolean) => {
    if (!iframeRef.current || !page) return
    
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      
      let html = exportPageToHtml(page, doc, true)
      
      // Adicionar click handler
      if (onBlockClickRef.current) {
        const clickHandler = `
          <script>
            document.addEventListener('click', function(e) {
              let element = e.target;
              while (element && !element.dataset.blockId) {
                element = element.parentElement;
              }
              if (element && element.dataset.blockId) {
                window.parent.postMessage({
                  type: 'block-click',
                  blockId: element.dataset.blockId
                }, '*');
              }
            });
          </script>
        `
        html = html.replace('</body>', `${clickHandler}</body>`)
        if (!html.includes('</body>')) {
          html = html + clickHandler
        }
      }
      
      const iframe = iframeRef.current
      
      if (showLoading) {
        iframe.onload = () => {
          setIsLoading(false)
          previousDocRef.current = JSON.parse(JSON.stringify(doc))
          previousDocHashRef.current = hashDocument(doc)
          // Aplicar highlight após carregar
          updateHighlight(selectedBlockIdRef.current || null)
        }
        setTimeout(() => {
          setIsLoading(false)
          previousDocRef.current = JSON.parse(JSON.stringify(doc))
          previousDocHashRef.current = hashDocument(doc)
          updateHighlight(selectedBlockIdRef.current || null)
        }, 1000)
      } else {
        previousDocRef.current = JSON.parse(JSON.stringify(doc))
        previousDocHashRef.current = hashDocument(doc)
        // Aguardar iframe recarregar para aplicar highlight
        iframe.onload = () => {
          updateHighlight(selectedBlockIdRef.current || null)
        }
      }
      
      iframe.srcdoc = html
    } catch (error) {
      console.error('[PreviewV2] Error:', error)
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  // Atualizar apenas um bloco (sem reload)
  const updatePartialPreview = (blockId: string, doc: SiteDocumentV2) => {
    if (!iframeRef.current || !page) return
    
    try {
      const block = findBlockInPage(page, blockId)
      if (!block) {
        updateFullPreview(doc, false)
        return
      }
      
      const blockHtml = exportBlockToHtml(block)
      
      requestAnimationFrame(() => {
        const iframe = iframeRef.current
        if (!iframe) return
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (!iframeDoc) return
        
        const element = iframeDoc.querySelector(`[data-block-id="${blockId}"]`)
        if (element) {
          try {
            const temp = iframeDoc.createElement('div')
            temp.innerHTML = blockHtml
            const newElement = temp.firstElementChild
            
            if (newElement) {
              element.parentNode?.replaceChild(newElement, element)
            } else {
              element.outerHTML = blockHtml
            }
            
            // Atualizar refs
            previousDocRef.current = JSON.parse(JSON.stringify(doc))
            previousDocHashRef.current = hashDocument(doc)
            
            // Reaplicar highlight
            updateHighlight(selectedBlockIdRef.current || null)
          } catch (error) {
            console.error('[PreviewV2] Erro ao atualizar:', error)
            updateFullPreview(doc, false)
          }
        } else {
          updateFullPreview(doc, false)
        }
      })
    } catch (error) {
      console.error('[PreviewV2] Erro:', error)
      updateFullPreview(doc, false)
    }
  }

  // Efeito para mudanças no DOCUMENTO (não no selectedBlockId)
  useEffect(() => {
    if (!page) {
      setIsLoading(false)
      return
    }
    
    const currentDocHash = hashDocument(document)
    
    // Primeira renderização
    if (!isInitializedRef.current) {
      if (iframeRef.current) {
        isInitializedRef.current = true
        updateFullPreview(document, true)
      }
      return
    }
    
    if (!iframeRef.current) return
    
    // Se hash não mudou, não há mudanças no documento
    if (previousDocHashRef.current === currentDocHash) {
      return
    }
    
    // Detectar mudanças
    const changedBlocks = detectChangedBlocks(previousDocRef.current || document, document)
    
    // Se não há mudanças detectadas mas o hash mudou, forçar reload
    if (changedBlocks.length === 0) {
      console.log('[PreviewV2] Hash changed but no changes detected, forcing reload')
      updateFullPreview(document, false)
      return
    }
    
    // Mudança estrutural (bloco adicionado/removido) = reload completo
    if (changedBlocks.some(c => c.blockId === '__structural__' || c.changedProps?.includes('children'))) {
      console.log('[PreviewV2] Structural change detected, full reload')
      updateFullPreview(document, false)
      return
    }
    
    // Mudança de 1 bloco (não estrutural) = atualização parcial
    if (changedBlocks.length === 1) {
      const change = changedBlocks[0]
      const changedProps = change.changedProps || []
      
      const isStructural = changedProps.some(prop =>
        prop === 'children' || prop === 'header' ||
        prop === 'content' || prop === 'footer'
      )
      
      if (!isStructural) {
        updatePartialPreview(change.blockId, document)
        return
      }
    }
    
    // Fallback: reload completo SEM loader
    updateFullPreview(document, false)
  }, [document, page]) // APENAS document e page - sem funções

  // Efeito SEPARADO para highlight (não recarrega o preview)
  useEffect(() => {
    if (!isInitializedRef.current) return
    updateHighlight(selectedBlockId || null)
  }, [selectedBlockId])

  // Listener para cliques
  useEffect(() => {
    if (!onBlockClick) return
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'block-click' && event.data?.blockId) {
        onBlockClick(event.data.blockId)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onBlockClick])

  if (!page) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Página não encontrada
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
          }}
        >
          <div style={{ color: '#6b7280' }}>Carregando preview...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#ffffff',
        }}
        title="Preview do site"
      />
    </div>
  )
}
