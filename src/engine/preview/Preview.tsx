/**
 * Preview
 * Sem dependências circulares, sem reloads desnecessários
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { SiteDocument, Block } from "../schema/siteDocument";
import { componentRegistry } from "../registry/registry";
import { exportPageToHtml, exportBlockToHtml } from "../export/exportHtml";
import { detectChangedBlocks } from "../../utils/changeDetector";
import { hashDocument } from "../../utils/documentHash";
import { logger } from "../../utils/logger";

export interface PreviewProps {
  document: SiteDocument;
  pageId?: string;
  className?: string;
  style?: React.CSSProperties;
  onBlockClick?: (blockId: string, group?: string) => void;
  selectedBlockId?: string | null;
  /** Exibe hover e label de seleção nos blocos do preview */
  showSelectionOverlay?: boolean;
  /** Grupo focado para indicador visual no preview */
  focusedGroup?: string | null;
}

/**
 * Encontra um bloco na estrutura recursivamente
 */
function findBlockInPage(page: any, blockId: string): Block | null {
  const findInBlocks = (blocks: Block[]): Block | null => {
    for (const block of blocks) {
      if (block.id === blockId) return block;
      const props = block.props as Record<string, any>;
      if (props?.children && Array.isArray(props.children)) {
        const found = findInBlocks(props.children);
        if (found) return found;
      }
      if (block.type === "card") {
        if (props.header && Array.isArray(props.header)) {
          const found = findInBlocks(props.header);
          if (found) return found;
        }
        if (props.content && Array.isArray(props.content)) {
          const found = findInBlocks(props.content);
          if (found) return found;
        }
        if (props.footer && Array.isArray(props.footer)) {
          const found = findInBlocks(props.footer);
          if (found) return found;
        }
      }
    }
    return null;
  };
  return findInBlocks(page.structure);
}

/**
 * Monta mapa blockId → nome legível (da registry)
 */
function buildBlockNameMap(page: any): Record<string, string> {
  const map: Record<string, string> = {};
  const walk = (blocks: Block[]) => {
    for (const block of blocks) {
      const def = componentRegistry.get(block.type);
      map[block.id] = def?.name || block.type;
      const props = block.props as Record<string, any>;
      if (props?.children && Array.isArray(props.children)) walk(props.children);
      if (block.type === "card") {
        if (Array.isArray(props?.header)) walk(props.header);
        if (Array.isArray(props?.content)) walk(props.content);
        if (Array.isArray(props?.footer)) walk(props.footer);
      }
    }
  };
  if (page?.structure) walk(page.structure);
  return map;
}

/**
 * Componente de preview usando iframe isolado
 */
export function Preview({
  document,
  pageId,
  className,
  style,
  onBlockClick,
  selectedBlockId,
  showSelectionOverlay = false,
  focusedGroup = null,
}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previousDocRef = useRef<SiteDocument | null>(null);
  const previousDocHashRef = useRef<string | null>(null);
  const previousPageIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Usar ref para selectedBlockId (necessário para highlight assíncrono)
  const selectedBlockIdRef = useRef(selectedBlockId);
  const showSelectionOverlayRef = useRef(showSelectionOverlay);
  const focusedGroupRef = useRef(focusedGroup);

  // Atualizar refs quando props mudam
  useEffect(() => {
    selectedBlockIdRef.current = selectedBlockId;
  }, [selectedBlockId]);

  useEffect(() => {
    showSelectionOverlayRef.current = showSelectionOverlay;
  }, [showSelectionOverlay]);

  useEffect(() => {
    focusedGroupRef.current = focusedGroup;
  }, [focusedGroup]);

  const page = useMemo(() => {
    return pageId
      ? document.pages.find((p) => p.id === pageId)
      : document.pages[0];
  }, [document, pageId]);

  // Mapa blockId → nome legível para labels
  const blockNameMapRef = useRef<Record<string, string>>({});
  useEffect(() => {
    blockNameMapRef.current = buildBlockNameMap(page);
  }, [page]);

  // Atualizar highlight + selection overlay diretamente no iframe (sem reload)
  const updateHighlight = (blockId: string | null) => {
    if (!iframeRef.current) return;

    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    const overlayEnabled = showSelectionOverlayRef.current;
    const group = focusedGroupRef.current;

    requestAnimationFrame(() => {
      // Remover highlight anterior
      const oldStyle = iframeDoc.getElementById("block-highlight");
      if (oldStyle) oldStyle.remove();

      const allBlocks = iframeDoc.querySelectorAll("[data-block-id]");
      allBlocks.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.outline = "";
        htmlEl.style.outlineOffset = "";
      });

      // Remover labels anteriores
      const oldLabel = iframeDoc.getElementById("sg-block-label");
      if (oldLabel) oldLabel.remove();
      const oldGroupStyle = iframeDoc.getElementById("sg-group-highlight");
      if (oldGroupStyle) oldGroupStyle.remove();
      const oldGroupLabel = iframeDoc.getElementById("sg-group-label");
      if (oldGroupLabel) oldGroupLabel.remove();

      // Adicionar novo highlight
      if (blockId) {
        const highlightStyle = iframeDoc.createElement("style");
        highlightStyle.id = "block-highlight";
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
        `;
        iframeDoc.head.appendChild(highlightStyle);

        // Selection label (only when overlay is enabled)
        if (overlayEnabled) {
          const selectedEl = iframeDoc.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement;
          if (selectedEl) {
            const blockName = blockNameMapRef.current[blockId] || blockId;
            const label = iframeDoc.createElement("div");
            label.id = "sg-block-label";
            label.textContent = blockName;
            label.style.cssText = "position:absolute;top:-22px;left:0;background:#3b82f6;color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px 4px 0 0;z-index:10000;pointer-events:none;font-family:system-ui,sans-serif;white-space:nowrap;line-height:16px;";
            const pos = getComputedStyle(selectedEl).position;
            if (pos === "static") selectedEl.style.position = "relative";
            selectedEl.appendChild(label);
          }
        }

        // Indicador de grupo — mostra qual sub-seção foi clicada (purple)
        if (group) {
          const blockEl = iframeDoc.querySelector(`[data-block-id="${blockId}"]`);
          const groupEl = blockEl?.querySelector(`[data-block-group="${group}"]`) as HTMLElement;
          if (groupEl) {
            const ghStyle = iframeDoc.createElement("style");
            ghStyle.id = "sg-group-highlight";
            ghStyle.textContent = `
              [data-block-id="${blockId}"] [data-block-group="${group}"] {
                outline: 2px solid #8b5cf6 !important;
                outline-offset: 2px !important;
                position: relative;
              }
            `;
            iframeDoc.head.appendChild(ghStyle);

            const gLabel = iframeDoc.createElement("div");
            gLabel.id = "sg-group-label";
            gLabel.textContent = group;
            gLabel.style.cssText = "position:absolute;top:-20px;right:0;background:#8b5cf6;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px 4px 0 0;z-index:10001;pointer-events:none;font-family:system-ui,sans-serif;white-space:nowrap;line-height:14px;";
            const gPos = getComputedStyle(groupEl).position;
            if (gPos === "static") groupEl.style.position = "relative";
            groupEl.appendChild(gLabel);
          }
        }
      }
    });
  };

  // Enviar mapa de nomes para o iframe
  const sendBlockNamesToIframe = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({
      type: "sg-set-block-names",
      names: blockNameMapRef.current,
    }, "*");
  };

  // Atualizar hover overlay (injetar/remover CSS de hover nos blocos)
  const updateSelectionOverlay = (enabled: boolean) => {
    if (!iframeRef.current) return;

    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    const existingStyle = iframeDoc.getElementById("sg-hover-overlay");
    if (existingStyle) existingStyle.remove();

    // Remove tooltip when disabling
    if (!enabled) {
      const tooltip = iframeDoc.getElementById("sg-hover-tooltip");
      if (tooltip) tooltip.style.opacity = "0";
    }

    if (enabled) {
      const hoverStyle = iframeDoc.createElement("style");
      hoverStyle.id = "sg-hover-overlay";
      hoverStyle.textContent = `
        [data-block-id] {
          cursor: pointer;
          transition: outline 0.15s ease, outline-offset 0.15s ease;
        }
        [data-block-id]:hover {
          outline: 2px dashed #94a3b8 !important;
          outline-offset: 2px !important;
        }
        [data-block-group] {
          cursor: pointer;
          transition: outline 0.15s ease, background 0.15s ease;
        }
        [data-block-group]:hover {
          outline: 1.5px dashed #a78bfa !important;
          outline-offset: 1px !important;
          background: rgba(139, 92, 246, 0.04);
        }
      `;
      iframeDoc.head.appendChild(hoverStyle);
      sendBlockNamesToIframe();
    }

    // Re-apply highlight (recalcula label)
    updateHighlight(selectedBlockIdRef.current || null);
  };

  // Atualizar preview completo (com srcdoc - causa reload)
  const updateFullPreview = (doc: SiteDocument, showLoading: boolean) => {
    if (!iframeRef.current || !page) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }

      let html = exportPageToHtml(page, doc, true);

      // Adicionar click handler + hover handler: links não navegam, enviam editor-navigate; outros cliques enviam block-click
      const clickHandler = `
          <script>
            (function() {
              // Click handler
              document.addEventListener('click', function(e) {
                var target = e.target;
                var anchor = target;
                while (anchor && anchor.tagName !== 'A') {
                  anchor = anchor.parentElement;
                }
                if (anchor && anchor.tagName === 'A' && anchor.href) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.parent.postMessage({
                    type: 'editor-navigate',
                    href: anchor.getAttribute('href') || anchor.href
                  }, '*');
                  return;
                }
                var element = target;
                var group = null;
                while (element && !element.dataset.blockId) {
                  if (element.dataset && element.dataset.blockGroup && !group) {
                    group = element.dataset.blockGroup;
                  }
                  element = element.parentElement;
                }
                if (element && element.dataset.blockId) {
                  window.parent.postMessage({
                    type: 'block-click',
                    blockId: element.dataset.blockId,
                    group: group
                  }, '*');
                }
              }, true);

              // Hover tooltip — block name map injected from parent via postMessage
              var _blockNames = {};
              var _hoverTooltip = null;

              window.addEventListener('message', function(e) {
                if (e.data && e.data.type === 'sg-set-block-names') {
                  _blockNames = e.data.names || {};
                }
              });

              function getTooltip() {
                if (_hoverTooltip) return _hoverTooltip;
                _hoverTooltip = document.createElement('div');
                _hoverTooltip.id = 'sg-hover-tooltip';
                _hoverTooltip.style.cssText = 'position:fixed;top:0;left:0;background:#334155;color:#fff;font-size:11px;font-weight:500;padding:3px 8px;border-radius:4px;z-index:99999;pointer-events:none;font-family:system-ui,sans-serif;white-space:nowrap;line-height:16px;opacity:0;transition:opacity 0.12s ease;box-shadow:0 2px 6px rgba(0,0,0,0.2);';
                document.body.appendChild(_hoverTooltip);
                return _hoverTooltip;
              }

              var _currentHoveredBlock = null;
              var _currentHoveredGroup = null;

              document.addEventListener('mouseover', function(e) {
                // Check if hover overlay is active
                if (!document.getElementById('sg-hover-overlay')) return;
                var el = e.target;
                var groupName = null;
                while (el && !el.dataset.blockId) {
                  if (el.dataset && el.dataset.blockGroup && !groupName) {
                    groupName = el.dataset.blockGroup;
                  }
                  el = el.parentElement;
                }
                if (el && el.dataset.blockId) {
                  if (el !== _currentHoveredBlock || groupName !== _currentHoveredGroup) {
                    _currentHoveredBlock = el;
                    _currentHoveredGroup = groupName;
                    var tt = getTooltip();
                    var blockName = _blockNames[el.dataset.blockId] || el.dataset.blockId;
                    tt.textContent = groupName ? (blockName + ' \\u203A ' + groupName) : blockName;
                    tt.style.opacity = '1';
                  }
                }
              }, true);

              document.addEventListener('mousemove', function(e) {
                if (_hoverTooltip && _hoverTooltip.style.opacity === '1') {
                  _hoverTooltip.style.left = (e.clientX + 12) + 'px';
                  _hoverTooltip.style.top = (e.clientY - 28) + 'px';
                }
              }, true);

              document.addEventListener('mouseout', function(e) {
                var el = e.target;
                while (el && !el.dataset.blockId) el = el.parentElement;
                if (el === _currentHoveredBlock) {
                  var related = e.relatedTarget;
                  while (related && related !== el) related = related.parentElement;
                  if (!related) {
                    _currentHoveredBlock = null;
                    _currentHoveredGroup = null;
                    if (_hoverTooltip) _hoverTooltip.style.opacity = '0';
                  }
                }
              }, true);
            })();
          </script>
        `;
      html = html.replace("</body>", `${clickHandler}</body>`);
      if (!html.includes("</body>")) {
        html = html + clickHandler;
      }

      const iframe = iframeRef.current;

      const applyOverlayAfterLoad = () => {
        updateHighlight(selectedBlockIdRef.current || null);
        if (showSelectionOverlayRef.current) {
          updateSelectionOverlay(true);
        }
      };

      if (showLoading) {
        iframe.onload = () => {
          setIsLoading(false);
          previousDocRef.current = JSON.parse(JSON.stringify(doc));
          previousDocHashRef.current = hashDocument(doc);
          applyOverlayAfterLoad();
        };
        setTimeout(() => {
          setIsLoading(false);
          previousDocRef.current = JSON.parse(JSON.stringify(doc));
          previousDocHashRef.current = hashDocument(doc);
          applyOverlayAfterLoad();
        }, 1000);
      } else {
        previousDocRef.current = JSON.parse(JSON.stringify(doc));
        previousDocHashRef.current = hashDocument(doc);
        iframe.onload = () => {
          applyOverlayAfterLoad();
        };
      }

      iframe.srcdoc = html;
    } catch (error) {
      logger.error("[Preview] Error:", error);
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Atualizar apenas um bloco (sem reload)
  const updatePartialPreview = (blockId: string, doc: SiteDocument) => {
    if (!iframeRef.current || !page) return;

    try {
      const block = findBlockInPage(page, blockId);
      if (!block) {
        updateFullPreview(doc, false);
        return;
      }

      const blockHtml = exportBlockToHtml(block, undefined, doc.theme);

      requestAnimationFrame(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        const element = iframeDoc.querySelector(`[data-block-id="${blockId}"]`);
        if (element) {
          try {
            // Remover <style> tags antigas associadas a este bloco
            const oldStyles = iframeDoc.querySelectorAll(`style[data-block-style="${blockId}"]`);
            oldStyles.forEach(s => s.remove());

            const temp = iframeDoc.createElement("div");
            temp.innerHTML = blockHtml;

            // Marcar e extrair <style> tags para inserção separada
            const styleTags = temp.querySelectorAll("style");
            styleTags.forEach(style => {
              style.setAttribute("data-block-style", blockId);
            });

            // Usar DocumentFragment para substituir com múltiplos elementos irmãos
            // (ex: <style>hover CSS</style><button>text</button>)
            const fragment = iframeDoc.createDocumentFragment();
            while (temp.firstChild) {
              fragment.appendChild(temp.firstChild);
            }

            if (fragment.childNodes.length > 0) {
              element.parentNode?.replaceChild(fragment, element);
            } else {
              element.outerHTML = blockHtml;
            }

            // Atualizar refs
            previousDocRef.current = JSON.parse(JSON.stringify(doc));
            previousDocHashRef.current = hashDocument(doc);

            // Reaplicar highlight
            updateHighlight(selectedBlockIdRef.current || null);
          } catch (error) {
            logger.error("[Preview] Erro ao atualizar:", error);
            updateFullPreview(doc, false);
          }
        } else {
          updateFullPreview(doc, false);
        }
      });
    } catch (error) {
      logger.error("[Preview] Erro:", error);
      updateFullPreview(doc, false);
    }
  };

  // Efeito para mudanças no DOCUMENTO (não no selectedBlockId)
  useEffect(() => {
    if (!page) {
      setIsLoading(false);
      return;
    }

    const currentDocHash = hashDocument(document);

    // Primeira renderização
    if (!isInitializedRef.current) {
      if (iframeRef.current) {
        isInitializedRef.current = true;
        previousPageIdRef.current = page?.id ?? null;
        updateFullPreview(document, true);
      }
      return;
    }

    if (!iframeRef.current) return;

    // Detectar troca de página (pageId mudou)
    const currentPageId = page?.id ?? null;
    if (previousPageIdRef.current !== currentPageId) {
      previousPageIdRef.current = currentPageId;
      updateFullPreview(document, false);
      return;
    }

    // Se hash não mudou, não há mudanças no documento
    if (previousDocHashRef.current === currentDocHash) {
      return;
    }

    // Se o theme mudou, forçar reload completo (CSS variables precisam ser regeneradas)
    const prevThemeJson = previousDocRef.current ? JSON.stringify(previousDocRef.current.theme) : null;
    const currThemeJson = JSON.stringify(document.theme);
    if (prevThemeJson !== currThemeJson) {
      updateFullPreview(document, false);
      return;
    }

    // Detectar mudanças na página atual
    const changedBlocks = detectChangedBlocks(
      previousDocRef.current || document,
      document,
      page?.id,
    );

    // Se não há mudanças detectadas mas o hash mudou, forçar reload
    if (changedBlocks.length === 0) {
      logger.debug(
        "[Preview] Hash changed but no changes detected, forcing reload",
      );
      updateFullPreview(document, false);
      return;
    }

    // Mudança estrutural (bloco adicionado/removido) = reload completo
    if (
      changedBlocks.some(
        (c) =>
          c.blockId === "__structural__" ||
          c.changedProps?.includes("children"),
      )
    ) {
      updateFullPreview(document, false);
      return;
    }

    // Mudança de 1 bloco (não estrutural) = atualização parcial
    if (changedBlocks.length === 1) {
      const change = changedBlocks[0];
      const changedProps = change.changedProps || [];

      const isStructural = changedProps.some(
        (prop) =>
          prop === "children" ||
          prop === "header" ||
          prop === "content" ||
          prop === "footer",
      );

      if (!isStructural) {
        updatePartialPreview(change.blockId, document);
        return;
      }
    }

    // Fallback: reload completo SEM loader
    updateFullPreview(document, false);
  }, [document, page]); // APENAS document e page - sem funções

  // Efeito SEPARADO para highlight (não recarrega o preview)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    updateHighlight(selectedBlockId || null);
  }, [selectedBlockId, focusedGroup]); // eslint-disable-line react-hooks/exhaustive-deps -- updateHighlight reads focusedGroupRef

  // Efeito para toggle do selection overlay
  useEffect(() => {
    if (!isInitializedRef.current) return;
    updateSelectionOverlay(showSelectionOverlay);
  }, [showSelectionOverlay]); // eslint-disable-line react-hooks/exhaustive-deps -- same pattern as updateFullPreview

  // Listener para cliques
  useEffect(() => {
    if (!onBlockClick) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "block-click" && event.data?.blockId) {
        onBlockClick(event.data.blockId, event.data.group || undefined);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onBlockClick]);

  if (!page) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
          Página não encontrada
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
          }}
        >
          <div style={{ color: "#6b7280" }}>Carregando preview...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "#ffffff",
        }}
        title="Preview do site"
      />
    </div>
  );
}
