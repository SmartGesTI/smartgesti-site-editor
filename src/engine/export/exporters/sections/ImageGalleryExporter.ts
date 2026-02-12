/**
 * ImageGallery Exporter
 * Exports gallery grid + fullscreen lightbox as standalone HTML/CSS/JS
 * with zero external dependencies.
 *
 * Features:
 * - Responsive grid (4 -> 3 -> 2 -> 1 columns at breakpoints)
 * - 4 hover effects: zoom-overlay, glow, scale, caption-reveal
 * - 3 enter animations: fade-scale, stagger, slide-up
 * - Fullscreen lightbox with zoom, pan, keyboard, touch gestures
 * - Dark/light/theme/adaptive lightbox themes
 * - Thumbnails strip, counter, captions
 * - ARIA accessible, native lazy loading
 * - IIFE JavaScript (no globals pollution)
 */

import type { Block, GalleryImage, LightboxConfig } from "../../../schema/siteDocument";
import type { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, blockIdAttr, escapeHtml } from "../../shared/htmlHelpers";
import { generateScopedId } from "../../shared/idGenerator";
import { imageShadowMap } from "../../../shared/shadowConstants";

// ============================================================================
// CSS Generation
// ============================================================================

function generateGalleryCSS(scope: string, columns: number): string {
  return `
/* Gallery base */
#${scope} .sg-ig-header { text-align: center; margin-bottom: 2rem; }
#${scope} .sg-ig-header h2 {
  font-size: var(--sg-heading-h2, 2rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--sg-heading, var(--sg-text));
}
#${scope} .sg-ig-header p {
  font-size: 1.125rem;
  color: var(--sg-muted-text, #6b7280);
  margin: 0;
}
#${scope} .sg-ig-warning {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fefce8;
  border-left: 4px solid #facc15;
  color: #854d0e;
  border-radius: 0 0.5rem 0.5rem 0;
}
#${scope} .sg-ig-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--sg-muted-text, #6b7280);
}
#${scope} .sg-ig-empty svg {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  opacity: 0.5;
}
#${scope} .sg-ig-empty p { margin: 0.25rem 0; }

/* Grid */
#${scope} .sg-ig-grid {
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
}

/* Image items */
#${scope} .sg-ig-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}
#${scope} .sg-ig-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease;
  background-color: #f3f4f6;
}

/* Hover: zoom-overlay */
#${scope} .sg-ig-item--zoom-overlay:hover img { transform: scale(1.1); }
#${scope} .sg-ig-item--zoom-overlay .sg-ig-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
#${scope} .sg-ig-item--zoom-overlay:hover .sg-ig-overlay { opacity: 1; }

/* Hover: glow */
#${scope} .sg-ig-item--glow { transition: box-shadow 0.3s ease; }
#${scope} .sg-ig-item--glow:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6) !important;
}

/* Hover: scale */
#${scope} .sg-ig-item--scale:hover img { transform: scale(1.05); }

/* Hover: caption-reveal */
#${scope} .sg-ig-item--caption-reveal .sg-ig-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  pointer-events: none;
}
#${scope} .sg-ig-item--caption-reveal:hover .sg-ig-caption {
  transform: translateY(0);
}
#${scope} .sg-ig-caption-title {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}
#${scope} .sg-ig-caption-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Enter Animations */
@keyframes sgIgFadeScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes sgIgSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

#${scope} .sg-ig-grid--fade-scale .sg-ig-item { animation: sgIgFadeScale 0.5s ease-out both; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(1) { animation-delay: 0.05s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(2) { animation-delay: 0.1s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(3) { animation-delay: 0.15s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(4) { animation-delay: 0.2s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(5) { animation-delay: 0.25s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(6) { animation-delay: 0.3s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(7) { animation-delay: 0.35s; }
#${scope} .sg-ig-grid--fade-scale .sg-ig-item:nth-child(8) { animation-delay: 0.4s; }

#${scope} .sg-ig-grid--slide-up .sg-ig-item { animation: sgIgSlideUp 0.5s ease-out both; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(1) { animation-delay: 0.05s; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(2) { animation-delay: 0.1s; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(3) { animation-delay: 0.15s; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(4) { animation-delay: 0.2s; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(5) { animation-delay: 0.25s; }
#${scope} .sg-ig-grid--slide-up .sg-ig-item:nth-child(6) { animation-delay: 0.3s; }

#${scope} .sg-ig-grid--stagger .sg-ig-item { animation: sgIgFadeScale 0.5s ease-out both; }
#${scope} .sg-ig-grid--stagger .sg-ig-item:nth-child(odd) { animation-delay: 0.1s; }
#${scope} .sg-ig-grid--stagger .sg-ig-item:nth-child(even) { animation-delay: 0.2s; }

/* Responsive Grid */
@media (max-width: 1024px) {
  #${scope} .sg-ig-grid--cols-${columns >= 4 ? "4" : "x"} {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
@media (max-width: 768px) {
  #${scope} .sg-ig-grid--cols-4,
  #${scope} .sg-ig-grid--cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 640px) {
  #${scope} .sg-ig-grid {
    grid-template-columns: 1fr !important;
  }
}
`.trim();
}

function generateLightboxCSS(scope: string): string {
  return `
/* Lightbox */
#${scope} .sg-lb {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: none;
}
#${scope} .sg-lb.sg-lb--open { display: flex; }

/* Screen-reader only */
#${scope} .sg-lb .sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}

/* Top bar */
#${scope} .sg-lb-topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  z-index: 10;
  pointer-events: none;
}
#${scope} .sg-lb-topbar > * { pointer-events: auto; }
#${scope} .sg-lb-counter {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.85;
}

/* Zoom controls */
#${scope} .sg-lb-zoom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
#${scope} .sg-lb-zoom-label {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 3rem;
  text-align: center;
}

/* Buttons (shared) */
#${scope} .sg-lb-btn {
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, opacity 0.2s;
}
#${scope} .sg-lb-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

/* Navigation arrows */
#${scope} .sg-lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  z-index: 10;
  opacity: 0.8;
}
#${scope} .sg-lb-nav:disabled { opacity: 0.3; }
#${scope} .sg-lb-nav--prev { left: 1rem; }
#${scope} .sg-lb-nav--next { right: 1rem; }

/* Main image area */
#${scope} .sg-lb-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
}
#${scope} .sg-lb-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 85vw;
}
#${scope} .sg-lb-img-wrap img {
  max-width: 100%;
  object-fit: contain;
  border-radius: 4px;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Loading spinner */
@keyframes sgLbSpin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
#${scope} .sg-lb-spinner {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: sgLbSpin 0.8s linear infinite;
}

/* Caption */
#${scope} .sg-lb-caption {
  text-align: center;
  padding: 0.75rem 1.5rem;
  max-width: 700px;
  z-index: 10;
}
#${scope} .sg-lb-caption-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
#${scope} .sg-lb-caption-desc {
  font-size: 0.875rem;
  opacity: 0.75;
}

/* Thumbnails */
#${scope} .sg-lb-thumbs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  max-width: 100%;
  z-index: 10;
  scrollbar-width: thin;
}
#${scope} .sg-lb-thumb {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: opacity 0.3s ease, border-color 0.3s ease;
}
#${scope} .sg-lb-thumb--active {
  opacity: 1;
}
#${scope} .sg-lb-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`.trim();
}

// ============================================================================
// HTML Generation
// ============================================================================

function generateGalleryHTML(
  scope: string,
  blockId: string,
  images: GalleryImage[],
  props: {
    title?: string;
    subtitle?: string;
    columns: number;
    gap: number;
    aspectRatio?: string;
    imageBorderRadius: number;
    imageShadow: string;
    hoverEffect: string;
    enterAnimation: string;
    lazyLoad: boolean;
    showWarningAt: number;
    bg?: string;
    lightbox: LightboxConfig;
  },
): string {
  const {
    title,
    subtitle,
    columns,
    gap,
    aspectRatio,
    imageBorderRadius,
    imageShadow,
    hoverEffect,
    enterAnimation,
    lazyLoad,
    showWarningAt,
    bg,
  } = props;

  const shadow = imageShadowMap[imageShadow] || "none";

  // Animation class
  let animClass = "";
  if (enterAnimation === "fade-scale") animClass = "sg-ig-grid--fade-scale";
  else if (enterAnimation === "stagger") animClass = "sg-ig-grid--stagger";
  else if (enterAnimation === "slide-up") animClass = "sg-ig-grid--slide-up";

  // Hover class
  let hoverClass = "";
  if (hoverEffect === "zoom-overlay") hoverClass = "sg-ig-item--zoom-overlay";
  else if (hoverEffect === "glow") hoverClass = "sg-ig-item--glow";
  else if (hoverEffect === "scale") hoverClass = "sg-ig-item--scale";
  else if (hoverEffect === "caption-reveal") hoverClass = "sg-ig-item--caption-reveal";

  // Header
  let headerHTML = "";
  if (title || subtitle) {
    headerHTML = `<div class="sg-ig-header">`;
    if (title) headerHTML += `<h2>${escapeHtml(title)}</h2>`;
    if (subtitle) headerHTML += `<p>${escapeHtml(subtitle)}</p>`;
    headerHTML += `</div>`;
  }

  // Performance warning
  let warningHTML = "";
  if (images.length > showWarningAt) {
    warningHTML = `
      <div class="sg-ig-warning">
        <strong>Aten\u00e7\u00e3o:</strong> Esta galeria possui ${images.length} imagens.
        Para melhor performance, considere reduzir o n\u00famero de imagens.
      </div>`;
  }

  // Empty state
  if (images.length === 0) {
    return `
    <section ${dataBlockIdAttr(blockId)} ${blockIdAttr(blockId)} data-block-group="Galeria"
             style="padding: var(--sg-section-padding-md, 3rem 0); background-color: ${bg || "transparent"};">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        ${headerHTML}
        <div class="sg-ig-empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p style="font-size: 1.125rem;">Nenhuma imagem adicionada</p>
          <p style="font-size: 0.875rem;">Clique em &quot;Adicionar&quot; para come\u00e7ar sua galeria</p>
        </div>
      </div>
    </section>`;
  }

  // Image items
  const itemsHTML = images
    .map((img, i) => {
      let overlayHTML = "";
      if (hoverEffect === "zoom-overlay") {
        overlayHTML = `
          <div class="sg-ig-overlay">
            <svg style="width:3rem;height:3rem;color:white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>`;
      }

      let captionHTML = "";
      if (hoverEffect === "caption-reveal" && (img.title || img.description)) {
        captionHTML = `<div class="sg-ig-caption">`;
        if (img.title) captionHTML += `<div class="sg-ig-caption-title">${escapeHtml(img.title)}</div>`;
        if (img.description) captionHTML += `<div class="sg-ig-caption-desc">${escapeHtml(img.description)}</div>`;
        captionHTML += `</div>`;
      }

      return `
        <div class="sg-ig-item ${hoverClass}"
             data-gallery-index="${i}"
             role="button" tabindex="0"
             aria-label="Ver imagem: ${escapeHtml(img.alt)}"
             style="border-radius: ${imageBorderRadius}px; aspect-ratio: ${aspectRatio || "auto"}; box-shadow: ${shadow};">
          <img src="${escapeHtml(img.src)}"
               alt="${escapeHtml(img.alt)}"
               ${lazyLoad ? 'loading="lazy"' : 'loading="eager"'} />
          ${overlayHTML}${captionHTML}
        </div>`;
    })
    .join("");

  // Lightbox DOM
  const lightboxHTML = generateLightboxHTML(scope, images, props.lightbox);

  return `
  <section id="${scope}" ${dataBlockIdAttr(blockId)} ${blockIdAttr(blockId)} data-block-group="Galeria"
           style="padding: var(--sg-section-padding-md, 3rem 0); background-color: ${bg || "transparent"};">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
      ${headerHTML}
      ${warningHTML}
      <div class="sg-ig-grid sg-ig-grid--cols-${columns} ${animClass}"
           style="grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}rem;">
        ${itemsHTML}
      </div>
    </div>
    ${lightboxHTML}
  </section>`;
}

function generateLightboxHTML(
  scope: string,
  images: GalleryImage[],
  config: LightboxConfig,
): string {
  const showArrows = config.showArrows !== false;
  const showThumbnails = config.showThumbnails === true;
  const showCounter = config.showCounter !== false;
  const showCaption = config.showCaption !== false;
  const enableZoom = config.enableZoom !== false;

  // SVG icons
  const closeIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const chevronLeftSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

  const chevronRightSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  const zoomOutSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

  const zoomInSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

  // Zoom controls
  let zoomHTML = "";
  if (enableZoom) {
    zoomHTML = `
      <div class="sg-lb-zoom">
        <button class="sg-lb-btn sg-lb-zoom-out" aria-label="Diminuir zoom">${zoomOutSVG}</button>
        <span class="sg-lb-zoom-label">1x</span>
        <button class="sg-lb-btn sg-lb-zoom-in" aria-label="Aumentar zoom">${zoomInSVG}</button>
      </div>`;
  }

  // Navigation arrows
  let arrowsHTML = "";
  if (showArrows && images.length > 1) {
    arrowsHTML = `
      <button class="sg-lb-btn sg-lb-nav sg-lb-nav--prev" aria-label="Anterior">${chevronLeftSVG}</button>
      <button class="sg-lb-btn sg-lb-nav sg-lb-nav--next" aria-label="Pr\u00f3xima">${chevronRightSVG}</button>`;
  }

  // Thumbnails
  let thumbsHTML = "";
  if (showThumbnails && images.length > 1) {
    const thumbItems = images
      .map(
        (img, i) =>
          `<button class="sg-lb-thumb" data-thumb-index="${i}" aria-label="Ir para imagem ${i + 1}: ${escapeHtml(img.alt)}"><img src="${escapeHtml(img.thumbnail || img.src)}" alt="${escapeHtml(img.alt)}" draggable="false" /></button>`,
      )
      .join("");
    thumbsHTML = `<div class="sg-lb-thumbs">${thumbItems}</div>`;
  }

  // Caption placeholder
  const captionHTML = showCaption
    ? `<div class="sg-lb-caption" style="display:none;">
        <div class="sg-lb-caption-title"></div>
        <div class="sg-lb-caption-desc"></div>
       </div>`
    : "";

  // Counter placeholder
  const counterHTML = showCounter
    ? `<span class="sg-lb-counter"></span>`
    : `<span></span>`;

  // Max height for image depends on whether thumbnails are shown
  const maxH = showThumbnails ? "65vh" : "78vh";

  return `
    <div class="sg-lb" role="dialog" aria-modal="true" aria-labelledby="${scope}-lb-title" data-sg-lightbox>
      <h2 id="${scope}-lb-title" class="sr-only">Galeria de Imagens</h2>
      <div aria-live="polite" aria-atomic="true" class="sr-only sg-lb-live"></div>

      <div class="sg-lb-topbar">
        ${counterHTML}
        ${zoomHTML}
        <button class="sg-lb-btn sg-lb-close" aria-label="Fechar galeria">${closeIconSVG}</button>
      </div>

      <div class="sg-lb-main">
        <div class="sg-lb-img-wrap" style="max-height: ${maxH};">
          <img src="" alt="" draggable="false" style="max-height: ${maxH}; opacity: 0;" />
        </div>
        <div class="sg-lb-spinner"></div>
      </div>

      ${captionHTML}
      ${arrowsHTML}
      ${thumbsHTML}
    </div>`;
}

// ============================================================================
// JavaScript Generation
// ============================================================================

function generateGalleryJS(
  scope: string,
  images: GalleryImage[],
  config: LightboxConfig,
): string {
  // Serialize images for JS (only the fields we need)
  const jsImages = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    title: img.title || "",
    description: img.description || "",
    thumbnail: img.thumbnail || "",
  }));

  const showArrows = config.showArrows !== false;
  const showThumbnails = config.showThumbnails === true;
  const showCounter = config.showCounter !== false;
  const showCaption = config.showCaption !== false;
  const enableZoom = config.enableZoom !== false;
  const closeOnEsc = config.closeOnEsc !== false;
  const closeOnBackdrop = config.closeOnBackdropClick !== false;
  const enableKeyboard = config.enableKeyboard !== false;
  const enableTouch = config.enableTouchGestures !== false;
  const transitionDuration = config.transitionDuration ?? 300;
  const mode = config.mode ?? "dark";

  return `
(function() {
  'use strict';

  var root = document.getElementById('${scope}');
  if (!root) return;

  // ---------- Images data ----------
  var images = ${JSON.stringify(jsImages)};
  if (images.length === 0) return;

  // ---------- Config ----------
  var CFG = {
    showArrows: ${showArrows},
    showThumbnails: ${showThumbnails},
    showCounter: ${showCounter},
    showCaption: ${showCaption},
    enableZoom: ${enableZoom},
    closeOnEsc: ${closeOnEsc},
    closeOnBackdrop: ${closeOnBackdrop},
    enableKeyboard: ${enableKeyboard},
    enableTouch: ${enableTouch},
    transitionDuration: ${transitionDuration},
    mode: '${mode}'
  };

  // ---------- Theme colors ----------
  var DARK = {
    backdrop: 'rgba(0,0,0,0.95)', text: '#fff', icon: '#fff',
    btnBg: 'rgba(255,255,255,0.1)', btnHover: 'rgba(255,255,255,0.2)',
    thumbBorder: '#fff', spinnerBg: 'rgba(255,255,255,0.1)', spinnerTop: '#fff'
  };
  var LIGHT = {
    backdrop: 'rgba(255,255,255,0.97)', text: '#1f2937', icon: '#374151',
    btnBg: 'rgba(0,0,0,0.05)', btnHover: 'rgba(0,0,0,0.1)',
    thumbBorder: '#3b82f6', spinnerBg: 'rgba(0,0,0,0.05)', spinnerTop: '#374151'
  };
  var THEME_COLORS = {
    backdrop: 'rgba(0,0,0,0.92)', text: '#fff', icon: '#3b82f6',
    btnBg: 'rgba(255,255,255,0.1)', btnHover: 'rgba(59,130,246,0.3)',
    thumbBorder: '#3b82f6', spinnerBg: 'rgba(255,255,255,0.1)', spinnerTop: '#3b82f6'
  };

  function getTheme(adaptiveHint) {
    if (CFG.mode === 'light') return LIGHT;
    if (CFG.mode === 'theme') return THEME_COLORS;
    if (CFG.mode === 'adaptive') return adaptiveHint === 'light' ? LIGHT : DARK;
    return DARK;
  }

  // ---------- State ----------
  var currentIndex = 0;
  var zoom = 1;
  var panX = 0;
  var panY = 0;
  var isDragging = false;
  var dragStart = null;
  var adaptiveHint = 'dark';
  var imageLoaded = false;

  // Zoom steps
  var ZOOM_STEPS = [1, 1.5, 2, 3, 5];

  // ---------- DOM refs ----------
  var lb = root.querySelector('.sg-lb');
  if (!lb) return;
  var lbMain = lb.querySelector('.sg-lb-main');
  var imgWrap = lb.querySelector('.sg-lb-img-wrap');
  var lbImg = imgWrap ? imgWrap.querySelector('img') : null;
  var spinner = lb.querySelector('.sg-lb-spinner');
  var closeBtn = lb.querySelector('.sg-lb-close');
  var prevBtn = lb.querySelector('.sg-lb-nav--prev');
  var nextBtn = lb.querySelector('.sg-lb-nav--next');
  var counterEl = lb.querySelector('.sg-lb-counter');
  var captionEl = lb.querySelector('.sg-lb-caption');
  var captionTitle = captionEl ? captionEl.querySelector('.sg-lb-caption-title') : null;
  var captionDesc = captionEl ? captionEl.querySelector('.sg-lb-caption-desc') : null;
  var thumbsContainer = lb.querySelector('.sg-lb-thumbs');
  var zoomOutBtn = lb.querySelector('.sg-lb-zoom-out');
  var zoomInBtn = lb.querySelector('.sg-lb-zoom-in');
  var zoomLabel = lb.querySelector('.sg-lb-zoom-label');
  var liveRegion = lb.querySelector('.sg-lb-live');

  // ---------- Theme application ----------
  function applyTheme() {
    var t = getTheme(adaptiveHint);
    lb.style.backgroundColor = t.backdrop;
    // Set color on text elements
    if (counterEl) counterEl.style.color = t.text;
    if (zoomLabel) zoomLabel.style.color = t.text;
    if (captionTitle) captionTitle.style.color = t.text;
    if (captionDesc) { captionDesc.style.color = t.text; captionDesc.style.opacity = '0.75'; }
    // Buttons
    var allBtns = lb.querySelectorAll('.sg-lb-btn');
    for (var b = 0; b < allBtns.length; b++) {
      allBtns[b].style.background = t.btnBg;
    }
    // SVG icons color
    var svgs = lb.querySelectorAll('.sg-lb-btn svg');
    for (var s = 0; s < svgs.length; s++) {
      svgs[s].style.stroke = t.icon;
    }
    // Thumbnails border
    if (thumbsContainer) {
      var thumbs = thumbsContainer.querySelectorAll('.sg-lb-thumb');
      for (var th = 0; th < thumbs.length; th++) {
        thumbs[th].style.borderColor = (th === currentIndex) ? t.thumbBorder : 'transparent';
      }
    }
    // Spinner
    if (spinner) {
      spinner.style.borderColor = t.spinnerBg;
      spinner.style.borderTopColor = t.spinnerTop;
    }
  }

  // ---------- Adaptive luminance detection ----------
  function detectLuminance(src, callback) {
    if (CFG.mode !== 'adaptive') { callback('dark'); return; }
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      try {
        var canvas = document.createElement('canvas');
        var sz = 50;
        canvas.width = sz; canvas.height = sz;
        var ctx = canvas.getContext('2d');
        if (!ctx) { callback('dark'); return; }
        var sx = Math.max(0, (img.naturalWidth - sz) / 2);
        var sy = Math.max(0, (img.naturalHeight - sz) / 2);
        var sw = Math.min(sz, img.naturalWidth);
        var sh = Math.min(sz, img.naturalHeight);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sz, sz);
        var data = ctx.getImageData(0, 0, sz, sz).data;
        var total = 0;
        var count = data.length / 4;
        for (var i = 0; i < data.length; i += 4) {
          total += 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
        }
        callback((total / count) > 128 ? 'dark' : 'light');
      } catch(e) {
        callback('dark');
      }
    };
    img.onerror = function() { callback('dark'); };
    img.src = src;
  }

  // ---------- Pan clamping ----------
  function clampPan(x, y, z) {
    if (z <= 1) return { x: 0, y: 0 };
    var maxX = ((z - 1) * window.innerWidth) / 2;
    var maxY = ((z - 1) * window.innerHeight) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }

  // ---------- Transform ----------
  function applyTransform(skipTransition) {
    if (!lbImg) return;
    lbImg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
    lbImg.style.transition = skipTransition ? 'none' : 'transform ' + CFG.transitionDuration + 'ms ease, opacity ' + CFG.transitionDuration + 'ms ease';
    if (lbMain) lbMain.style.cursor = zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
  }

  // ---------- Zoom functions ----------
  function zoomIn() {
    if (!CFG.enableZoom) return;
    var idx = -1;
    for (var i = 0; i < ZOOM_STEPS.length; i++) {
      if (ZOOM_STEPS[i] >= zoom) { idx = i; break; }
    }
    if (idx === -1) idx = ZOOM_STEPS.length - 1;
    if (idx < ZOOM_STEPS.length - 1) {
      zoom = ZOOM_STEPS[idx + 1];
      applyTransform();
      updateZoomUI();
    }
  }

  function zoomOut() {
    if (!CFG.enableZoom) return;
    var idx = -1;
    for (var i = 0; i < ZOOM_STEPS.length; i++) {
      if (ZOOM_STEPS[i] >= zoom) { idx = i; break; }
    }
    if (idx === -1) idx = ZOOM_STEPS.length - 1;
    if (idx > 0) {
      zoom = ZOOM_STEPS[idx - 1];
      if (zoom === 1) { panX = 0; panY = 0; }
      applyTransform();
      updateZoomUI();
    }
  }

  function resetZoomPan() {
    zoom = 1; panX = 0; panY = 0;
    applyTransform();
    updateZoomUI();
  }

  function updateZoomUI() {
    if (zoomLabel) zoomLabel.textContent = zoom === 1 ? '1x' : zoom + 'x';
    if (zoomOutBtn) {
      zoomOutBtn.disabled = zoom <= ZOOM_STEPS[0];
      zoomOutBtn.style.opacity = zoom <= ZOOM_STEPS[0] ? '0.3' : '1';
    }
    if (zoomInBtn) {
      zoomInBtn.disabled = zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1];
      zoomInBtn.style.opacity = zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1] ? '0.3' : '1';
    }
  }

  // ---------- Update lightbox state ----------
  function updateLightbox() {
    if (!lbImg) return;
    var img = images[currentIndex];

    // Image loading
    imageLoaded = false;
    lbImg.style.opacity = '0';
    if (spinner) spinner.style.display = 'block';

    lbImg.onload = function() {
      imageLoaded = true;
      lbImg.style.opacity = '1';
      if (spinner) spinner.style.display = 'none';
      // Adaptive theme detection
      detectLuminance(img.src, function(hint) {
        adaptiveHint = hint;
        applyTheme();
      });
    };
    lbImg.onerror = function() {
      if (spinner) spinner.style.display = 'none';
    };
    lbImg.src = img.src;
    lbImg.alt = img.alt;

    // Counter
    if (counterEl && CFG.showCounter) {
      counterEl.textContent = (currentIndex + 1) + ' de ' + images.length;
    }

    // Caption
    if (captionEl && CFG.showCaption) {
      var hasCaption = img.title || img.description;
      captionEl.style.display = hasCaption ? 'block' : 'none';
      if (captionTitle) captionTitle.textContent = img.title || '';
      if (captionDesc) {
        captionDesc.textContent = img.description || '';
        captionDesc.style.marginTop = img.title && img.description ? '0.25rem' : '0';
      }
    }

    // Navigation buttons
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '0.8';
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === images.length - 1;
      nextBtn.style.opacity = currentIndex === images.length - 1 ? '0.3' : '0.8';
    }

    // Thumbnails highlight
    if (thumbsContainer) {
      var t = getTheme(adaptiveHint);
      var thumbs = thumbsContainer.querySelectorAll('.sg-lb-thumb');
      for (var i = 0; i < thumbs.length; i++) {
        var isActive = i === currentIndex;
        thumbs[i].classList.toggle('sg-lb-thumb--active', isActive);
        thumbs[i].style.borderColor = isActive ? t.thumbBorder : 'transparent';
      }
      // Scroll active thumb into view
      var activeThumb = thumbsContainer.querySelector('.sg-lb-thumb--active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Live region for screen readers
    if (liveRegion) {
      liveRegion.textContent = 'Imagem ' + (currentIndex + 1) + ' de ' + images.length + ': ' + (img.title || img.alt);
    }

    // Zoom reset
    resetZoomPan();

    // Preload adjacent images
    if (currentIndex > 0) { var p = new Image(); p.src = images[currentIndex - 1].src; }
    if (currentIndex < images.length - 1) { var n = new Image(); n.src = images[currentIndex + 1].src; }
  }

  // ---------- Open / Close ----------
  function openLightbox(index) {
    currentIndex = index;
    lb.classList.add('sg-lb--open');
    document.body.style.overflow = 'hidden';
    applyTheme();
    updateLightbox();
    // Focus close button
    setTimeout(function() {
      if (closeBtn) closeBtn.focus();
    }, 50);
  }

  function closeLightbox() {
    lb.classList.remove('sg-lb--open');
    document.body.style.overflow = '';
    resetZoomPan();
  }

  // ---------- Navigation ----------
  function navigate(direction) {
    if (direction === 'next' && currentIndex < images.length - 1) currentIndex++;
    else if (direction === 'prev' && currentIndex > 0) currentIndex--;
    else if (direction === 'first') currentIndex = 0;
    else if (direction === 'last') currentIndex = images.length - 1;
    else return;
    resetZoomPan();
    updateLightbox();
  }

  // ---------- Gallery image clicks ----------
  var galleryItems = root.querySelectorAll('.sg-ig-item');
  for (var gi = 0; gi < galleryItems.length; gi++) {
    (function(item) {
      item.addEventListener('click', function() {
        var idx = parseInt(item.getAttribute('data-gallery-index'), 10);
        if (!isNaN(idx)) openLightbox(idx);
      });
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var idx = parseInt(item.getAttribute('data-gallery-index'), 10);
          if (!isNaN(idx)) openLightbox(idx);
        }
      });
    })(galleryItems[gi]);
  }

  // ---------- Lightbox button clicks ----------
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); navigate('prev'); });
  if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); navigate('next'); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', function(e) { e.stopPropagation(); zoomOut(); });
  if (zoomInBtn) zoomInBtn.addEventListener('click', function(e) { e.stopPropagation(); zoomIn(); });

  // ---------- Thumbnail clicks ----------
  if (thumbsContainer) {
    var thumbBtns = thumbsContainer.querySelectorAll('.sg-lb-thumb');
    for (var ti = 0; ti < thumbBtns.length; ti++) {
      (function(thumb) {
        thumb.addEventListener('click', function(e) {
          e.stopPropagation();
          var idx = parseInt(thumb.getAttribute('data-thumb-index'), 10);
          if (!isNaN(idx)) {
            currentIndex = idx;
            resetZoomPan();
            updateLightbox();
          }
        });
      })(thumbBtns[ti]);
    }
  }

  // ---------- Backdrop click to close ----------
  if (CFG.closeOnBackdrop && lbMain) {
    lbMain.addEventListener('click', function(e) {
      if (e.target === lbMain) closeLightbox();
    });
  }

  // ---------- Keyboard ----------
  if (CFG.enableKeyboard) {
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('sg-lb--open')) return;

      switch (e.key) {
        case 'Escape':
          if (CFG.closeOnEsc) closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigate('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigate('next');
          break;
        case 'Home':
          e.preventDefault();
          navigate('first');
          break;
        case 'End':
          e.preventDefault();
          navigate('last');
          break;
        case '+': case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoomPan();
          break;
        case 'Tab':
          // Focus trap
          var focusable = lb.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (focusable.length === 0) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
      }
    });
  }

  // ---------- Mouse drag (pan when zoomed) ----------
  if (lbImg) {
    lbMain.addEventListener('mousedown', function(e) {
      if (zoom <= 1) return;
      e.preventDefault();
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY, panX: panX, panY: panY };
      applyTransform(true);
    });
  }

  document.addEventListener('mousemove', function(e) {
    if (!isDragging || !dragStart || zoom <= 1) return;
    e.preventDefault();
    var dx = e.clientX - dragStart.x;
    var dy = e.clientY - dragStart.y;
    var clamped = clampPan(dragStart.panX + dx, dragStart.panY + dy, zoom);
    panX = clamped.x;
    panY = clamped.y;
    applyTransform(true);
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      dragStart = null;
      applyTransform();
    }
  });

  // ---------- Touch gestures ----------
  if (CFG.enableTouch && lbMain) {
    var touchStart = null;
    var lastTap = 0;
    var pinchStartDist = null;
    var pinchStartZoom = 1;

    lbMain.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2 && CFG.enableZoom) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDist = Math.sqrt(dx * dx + dy * dy);
        pinchStartZoom = zoom;
        return;
      }
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
        if (zoom > 1) {
          dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: panX, panY: panY };
        }
      }
    }, { passive: true });

    lbMain.addEventListener('touchmove', function(e) {
      // Pinch-to-zoom
      if (e.touches.length === 2 && pinchStartDist !== null && CFG.enableZoom) {
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var scale = dist / pinchStartDist;
        zoom = Math.max(1, Math.min(5, pinchStartZoom * scale));
        if (zoom === 1) { panX = 0; panY = 0; }
        else {
          var clamped = clampPan(panX, panY, zoom);
          panX = clamped.x; panY = clamped.y;
        }
        applyTransform(true);
        updateZoomUI();
        return;
      }
      // Pan when zoomed (single finger)
      if (e.touches.length === 1 && zoom > 1 && dragStart) {
        e.preventDefault();
        var touch = e.touches[0];
        var ddx = touch.clientX - dragStart.x;
        var ddy = touch.clientY - dragStart.y;
        var cl = clampPan(dragStart.panX + ddx, dragStart.panY + ddy, zoom);
        panX = cl.x; panY = cl.y;
        applyTransform(true);
      }
    }, { passive: false });

    lbMain.addEventListener('touchend', function(e) {
      // Clear pinch
      if (pinchStartDist !== null) {
        pinchStartDist = null;
        applyTransform();
        return;
      }
      dragStart = null;

      if (!touchStart) return;
      var te = e.changedTouches[0];
      var dx = te.clientX - touchStart.x;
      var dy = te.clientY - touchStart.y;
      var dt = Date.now() - touchStart.time;
      var ax = Math.abs(dx);
      var ay = Math.abs(dy);

      // Double-tap to toggle zoom
      if (ax < 10 && ay < 10 && dt < 300) {
        var now = Date.now();
        if (now - lastTap < 300 && CFG.enableZoom) {
          if (zoom === 1) { zoom = 2; applyTransform(); updateZoomUI(); }
          else { resetZoomPan(); }
          lastTap = 0;
        } else {
          lastTap = now;
        }
        touchStart = null;
        return;
      }

      // Swipe to navigate (only at 1x)
      if (zoom === 1 && ax > 50 && ax > ay) {
        if (dx < 0) navigate('next');
        else navigate('prev');
      }

      touchStart = null;
    }, { passive: true });
  }
})();
`.trim();
}

// ============================================================================
// Main Export Function
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exportImageGallery(block: Block, _depth: number, _basePath?: string, _theme?: ThemeTokens): string {
  const { props, id: blockId } = block as { props: Record<string, unknown>; id: string };

  // Extract props with defaults
  const title = (props.title as string) || "";
  const subtitle = (props.subtitle as string) || "";
  const images: GalleryImage[] = (props.images as GalleryImage[]) || [];
  const columns = (props.columns as number) || 4;
  const gap = (props.gap as number) || 1;
  const aspectRatio = (props.aspectRatio as string) || "auto";
  const imageBorderRadius = (props.imageBorderRadius as number) ?? 8;
  const imageShadow = (props.imageShadow as string) || "md";
  const hoverEffect = (props.hoverEffect as string) || "zoom-overlay";
  const enterAnimation = (props.enterAnimation as string) || "fade-scale";
  const lazyLoad = props.lazyLoad !== false;
  const showWarningAt = (props.showWarningAt as number) || 50;
  const bg = (props.bg as string) || "";
  const lightbox: LightboxConfig = (props.lightbox as LightboxConfig) || {};

  const scope = generateScopedId(blockId, "sg-ig");

  // Generate CSS
  const galleryCSS = generateGalleryCSS(scope, columns);
  const lightboxCSS = generateLightboxCSS(scope);

  // Generate HTML
  const html = generateGalleryHTML(scope, blockId, images, {
    title,
    subtitle,
    columns,
    gap,
    aspectRatio,
    imageBorderRadius,
    imageShadow,
    hoverEffect,
    enterAnimation,
    lazyLoad,
    showWarningAt,
    bg,
    lightbox,
  });

  // Generate JS (only if there are images)
  let jsBlock = "";
  if (images.length > 0) {
    const js = generateGalleryJS(scope, images, lightbox);
    jsBlock = `<script>${js}</script>`;
  }

  return `<style>${galleryCSS}\n${lightboxCSS}</style>\n${html}\n${jsBlock}`;
}
