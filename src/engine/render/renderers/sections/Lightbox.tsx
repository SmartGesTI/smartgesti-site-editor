/**
 * Lightbox Component
 * Fullscreen image viewer with zoom, pan, navigation, keyboard shortcuts,
 * touch gestures, thumbnails strip, and adaptive theming.
 * Renders via ReactDOM.createPortal to document.body.
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
} from "react";
import ReactDOM from "react-dom";
import type { GalleryImage, LightboxConfig } from "../../../schema/siteDocument";
import { logger } from "../../../../utils/logger";

// ============================================================================
// Types
// ============================================================================

export interface LightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  config: LightboxConfig;
}

interface ThemeColors {
  backdrop: string;
  text: string;
  icon: string;
  buttonBg: string;
  buttonHover: string;
  thumbnailBorder: string;
  captionBg: string;
}

// ============================================================================
// Constants
// ============================================================================

const ZOOM_STEPS = [1, 1.5, 2, 3, 5] as const;
const SWIPE_THRESHOLD = 50;
const DOUBLE_TAP_DELAY = 300;
const PAN_DEBOUNCE_MS = 16; // ~60fps

/**
 * Clamps pan values to prevent image from being dragged completely off-screen.
 * At 1x zoom, no pan allowed (image fills viewport).
 * At higher zoom, pan range scales proportionally to zoom level.
 */
const clampPan = (x: number, y: number, currentZoom: number) => {
  if (currentZoom <= 1) return { x: 0, y: 0 };

  // Allow panning proportional to zoom level
  // At 2x zoom: can pan +/-50% of viewport
  // At 5x zoom: can pan +/-200% of viewport
  const maxPanX = ((currentZoom - 1) * window.innerWidth) / 2;
  const maxPanY = ((currentZoom - 1) * window.innerHeight) / 2;

  return {
    x: Math.max(-maxPanX, Math.min(maxPanX, x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, y)),
  };
};

// ============================================================================
// Theme Utilities
// ============================================================================

const DARK_THEME: ThemeColors = {
  backdrop: "rgba(0, 0, 0, 0.95)",
  text: "#ffffff",
  icon: "#ffffff",
  buttonBg: "rgba(255, 255, 255, 0.1)",
  buttonHover: "rgba(255, 255, 255, 0.2)",
  thumbnailBorder: "#ffffff",
  captionBg: "rgba(0, 0, 0, 0.6)",
};

const LIGHT_THEME: ThemeColors = {
  backdrop: "rgba(255, 255, 255, 0.97)",
  text: "#1f2937",
  icon: "#374151",
  buttonBg: "rgba(0, 0, 0, 0.05)",
  buttonHover: "rgba(0, 0, 0, 0.1)",
  thumbnailBorder: "#3b82f6",
  captionBg: "rgba(255, 255, 255, 0.8)",
};

const THEME_THEME: ThemeColors = {
  backdrop: "rgba(0, 0, 0, 0.92)",
  text: "var(--sg-text, #ffffff)",
  icon: "var(--sg-primary, #3b82f6)",
  buttonBg: "rgba(255, 255, 255, 0.1)",
  buttonHover: "var(--sg-primary, rgba(59, 130, 246, 0.3))",
  thumbnailBorder: "var(--sg-primary, #3b82f6)",
  captionBg: "rgba(0, 0, 0, 0.6)",
};

/**
 * Detect average luminance of the center region of an image.
 * Returns a value 0-255 (0 = black, 255 = white).
 */
function detectImageLuminance(imgSrc: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        // Sample a small center region for performance
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(128); // fallback to neutral
          return;
        }
        // Draw the center portion of the image
        const sx = Math.max(0, (img.naturalWidth - sampleSize) / 2);
        const sy = Math.max(0, (img.naturalHeight - sampleSize) / 2);
        const sw = Math.min(sampleSize, img.naturalWidth);
        const sh = Math.min(sampleSize, img.naturalHeight);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sampleSize, sampleSize);
        const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let totalLuminance = 0;
        const pixelCount = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          // Relative luminance formula (ITU-R BT.709)
          totalLuminance += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
        resolve(totalLuminance / pixelCount);
      } catch {
        logger.debug("Lightbox: Could not detect image luminance, using fallback");
        resolve(128);
      }
    };
    img.onerror = () => resolve(128);
    img.src = imgSrc;
  });
}

// ============================================================================
// SVG Icons (inline to avoid external deps)
// ============================================================================

const CloseIcon = memo<{ color: string }>(({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));
CloseIcon.displayName = "CloseIcon";

const ChevronLeftIcon = memo<{ color: string }>(({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
));
ChevronLeftIcon.displayName = "ChevronLeftIcon";

const ChevronRightIcon = memo<{ color: string }>(({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
));
ChevronRightIcon.displayName = "ChevronRightIcon";

const ZoomInIcon = memo<{ color: string }>(({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
));
ZoomInIcon.displayName = "ZoomInIcon";

const ZoomOutIcon = memo<{ color: string }>(({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
));
ZoomOutIcon.displayName = "ZoomOutIcon";

// ============================================================================
// Main Lightbox Component
// ============================================================================

const Lightbox: React.FC<LightboxProps> = memo(({
  images,
  initialIndex,
  isOpen,
  onClose,
  config,
}) => {
  // -------------------------------------------------------------------
  // ALL HOOKS BEFORE EARLY RETURNS (React rules of hooks)
  // -------------------------------------------------------------------

  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [adaptiveTheme, setAdaptiveTheme] = useState<"dark" | "light">("dark");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const lastPanUpdateRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const panRef = useRef({ x: 0, y: 0 });

  // Keep pan ref in sync with state (avoids stale closures in drag handlers)
  useEffect(() => {
    panRef.current = { x: panX, y: panY };
  }, [panX, panY]);

  // Derived values
  const currentImage = useMemo(() => images[currentIndex] || null, [images, currentIndex]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  const transitionDuration = useMemo(
    () => config.transitionDuration ?? 300,
    [config.transitionDuration],
  );

  const mode = config.mode ?? "dark";
  const showArrows = config.showArrows !== false;
  const showThumbnails = config.showThumbnails === true;
  const showCounter = config.showCounter !== false;
  const showCaption = config.showCaption !== false;
  const enableZoom = config.enableZoom !== false;
  const closeOnEsc = config.closeOnEsc !== false;
  const closeOnBackdrop = config.closeOnBackdropClick !== false;
  const enableKeyboard = config.enableKeyboard !== false;
  const enableTouch = config.enableTouchGestures !== false;

  // Theme selection
  const theme = useMemo<ThemeColors>(() => {
    switch (mode) {
      case "light":
        return LIGHT_THEME;
      case "theme":
        return THEME_THEME;
      case "adaptive":
        return adaptiveTheme === "light" ? LIGHT_THEME : DARK_THEME;
      case "dark":
      default:
        return DARK_THEME;
    }
  }, [mode, adaptiveTheme]);

  // -------------------------------------------------------------------
  // Adaptive theme detection
  // -------------------------------------------------------------------
  useEffect(() => {
    if (mode !== "adaptive" || !currentImage || !isOpen) return;
    let cancelled = false;
    detectImageLuminance(currentImage.src).then((luminance) => {
      if (!cancelled) {
        // Light images get dark overlay, dark images get light overlay
        setAdaptiveTheme(luminance > 128 ? "dark" : "light");
      }
    });
    return () => { cancelled = true; };
  }, [mode, currentImage, isOpen]);

  // -------------------------------------------------------------------
  // Reset state when index changes or lightbox opens/closes
  // -------------------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setImageLoaded(false);
  }, [currentIndex]);

  // -------------------------------------------------------------------
  // Preload adjacent images
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const toPreload: string[] = [];
    if (currentIndex > 0) toPreload.push(images[currentIndex - 1].src);
    if (currentIndex < images.length - 1) toPreload.push(images[currentIndex + 1].src);
    toPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [isOpen, currentIndex, images]);

  // -------------------------------------------------------------------
  // Lock body scroll when open
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // -------------------------------------------------------------------
  // Focus management - trap focus inside lightbox
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    // Focus the close button when lightbox opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // -------------------------------------------------------------------
  // Auto-scroll thumbnail into view
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !showThumbnails || !thumbnailsRef.current) return;
    const container = thumbnailsRef.current;
    const thumb = container.querySelector<HTMLElement>(`[data-thumb-index="${currentIndex}"]`);
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [isOpen, currentIndex, showThumbnails]);

  // -------------------------------------------------------------------
  // Navigation handlers
  // -------------------------------------------------------------------
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  const goToFirst = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const goToLast = useCallback(() => {
    setCurrentIndex(images.length - 1);
  }, [images.length]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // -------------------------------------------------------------------
  // Zoom handlers
  // -------------------------------------------------------------------
  const zoomIn = useCallback(() => {
    if (!enableZoom) return;
    setZoom((prev) => {
      const currentStepIndex = ZOOM_STEPS.findIndex((s) => s >= prev);
      const nextIndex = currentStepIndex < ZOOM_STEPS.length - 1
        ? currentStepIndex + 1
        : ZOOM_STEPS.length - 1;
      return ZOOM_STEPS[nextIndex];
    });
  }, [enableZoom]);

  const zoomOut = useCallback(() => {
    if (!enableZoom) return;
    setZoom((prev) => {
      const currentStepIndex = ZOOM_STEPS.findIndex((s) => s >= prev);
      const prevIndex = currentStepIndex > 0 ? currentStepIndex - 1 : 0;
      const newZoom = ZOOM_STEPS[prevIndex];
      // Reset pan when going back to 1x
      if (newZoom === 1) {
        setPanX(0);
        setPanY(0);
      }
      return newZoom;
    });
  }, [enableZoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  // -------------------------------------------------------------------
  // Pan handlers (mouse drag)
  // -------------------------------------------------------------------
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
  }, [zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || zoom <= 1) return;
    e.preventDefault();
    // Debounce pan updates to ~60fps
    const now = Date.now();
    if (now - lastPanUpdateRef.current < PAN_DEBOUNCE_MS) return;
    lastPanUpdateRef.current = now;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const newPanX = dragStartRef.current.panX + dx;
    const newPanY = dragStartRef.current.panY + dy;
    const clamped = clampPan(newPanX, newPanY, zoom);
    setPanX(clamped.x);
    setPanY(clamped.y);
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // -------------------------------------------------------------------
  // Touch gesture handlers
  // -------------------------------------------------------------------
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;

    if (e.touches.length === 2) {
      // Pinch start: record initial distance between two fingers
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoomRef.current = zoom;
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Also start pan tracking if zoomed
      if (zoom > 1) {
        dragStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          panX: panRef.current.x,
          panY: panRef.current.y,
        };
      }
    }
  }, [enableTouch, zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;

    // Pinch-to-zoom with 2 fingers
    if (e.touches.length === 2 && pinchStartDistRef.current !== null && enableZoom) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      const scale = currentDist / pinchStartDistRef.current;
      const newZoom = Math.min(5, Math.max(1, pinchStartZoomRef.current * scale));
      setZoom(newZoom);
      if (newZoom === 1) {
        setPanX(0);
        setPanY(0);
      } else {
        const clamped = clampPan(panRef.current.x, panRef.current.y, newZoom);
        setPanX(clamped.x);
        setPanY(clamped.y);
      }
      return;
    }

    // Pan when zoomed (single finger)
    if (e.touches.length === 1 && zoom > 1 && dragStartRef.current) {
      e.preventDefault();
      const now = Date.now();
      if (now - lastPanUpdateRef.current < PAN_DEBOUNCE_MS) return;
      lastPanUpdateRef.current = now;

      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      const newPanX = dragStartRef.current.panX + dx;
      const newPanY = dragStartRef.current.panY + dy;
      const clamped = clampPan(newPanX, newPanY, zoom);
      setPanX(clamped.x);
      setPanY(clamped.y);
    }
  }, [enableTouch, enableZoom, zoom]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enableTouch) return;

    // Clear pinch state
    if (pinchStartDistRef.current !== null) {
      pinchStartDistRef.current = null;
      return;
    }

    // Clear drag state
    dragStartRef.current = null;

    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now(),
    };

    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;
    const timeDelta = touchEnd.time - touchStartRef.current.time;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Double-tap to toggle zoom
    if (absX < 10 && absY < 10 && timeDelta < 300) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        // Double tap detected
        if (enableZoom) {
          if (zoom === 1) {
            setZoom(2);
          } else {
            resetZoom();
          }
        }
        lastTapRef.current = 0; // Reset so triple-tap doesn't trigger
      } else {
        lastTapRef.current = now;
      }
      touchStartRef.current = null;
      return;
    }

    // Swipe to navigate (only when not zoomed)
    if (zoom === 1 && absX > SWIPE_THRESHOLD && absX > absY) {
      if (dx < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartRef.current = null;
  }, [enableTouch, enableZoom, zoom, goToNext, goToPrev, resetZoom]);

  // -------------------------------------------------------------------
  // Keyboard handler
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (closeOnEsc) onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Home":
          e.preventDefault();
          goToFirst();
          break;
        case "End":
          e.preventDefault();
          goToLast();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          resetZoom();
          break;
        case "Tab":
          {
            const focusableElements = document.querySelectorAll<HTMLElement>(
              `[data-sg-lightbox] button:not([disabled]), [data-sg-lightbox] [tabindex]:not([tabindex="-1"])`,
            );
            if (focusableElements.length === 0) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, enableKeyboard, closeOnEsc, onClose, goToPrev, goToNext, goToFirst, goToLast, zoomIn, zoomOut, resetZoom]);

  // -------------------------------------------------------------------
  // Backdrop click handler
  // -------------------------------------------------------------------
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop (not on image or controls)
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  // -------------------------------------------------------------------
  // Thumbnail click handler
  // -------------------------------------------------------------------
  const handleThumbnailKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToIndex(index);
    }
  }, [goToIndex]);

  // -------------------------------------------------------------------
  // Image load handler
  // -------------------------------------------------------------------
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // -------------------------------------------------------------------
  // Cursor style
  // -------------------------------------------------------------------
  const cursorStyle = useMemo(() => {
    if (zoom > 1) {
      return isDragging ? "grabbing" : "grab";
    }
    return "default";
  }, [zoom, isDragging]);

  // -------------------------------------------------------------------
  // EARLY RETURN: Don't render if not open
  // -------------------------------------------------------------------
  if (!isOpen || images.length === 0 || !currentImage) {
    return null;
  }

  // -------------------------------------------------------------------
  // Render via Portal
  // -------------------------------------------------------------------
  const lightboxContent = (
    <div
      ref={dialogRef}
      data-sg-lightbox
      role="dialog"
      aria-modal="true"
      aria-labelledby="sg-lightbox-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: theme.backdrop,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "none",
      }}
      onClick={handleBackdropClick}
      onMouseUp={handleMouseUp}
    >
      {/* Screen-reader only title */}
      <h2
        id="sg-lightbox-title"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        Galeria de Imagens
      </h2>

      {/* Live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        Imagem {currentIndex + 1} de {images.length}: {currentImage.title || currentImage.alt}
      </div>

      {/* Top Bar: Counter (left) + Zoom Controls (center) + Close (right) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Counter */}
        {showCounter ? (
          <span
            style={{
              color: theme.text,
              fontSize: "0.875rem",
              fontWeight: 500,
              opacity: 0.85,
              pointerEvents: "auto",
            }}
          >
            {currentIndex + 1} de {images.length}
          </span>
        ) : (
          <span />
        )}

        {/* Zoom Controls */}
        {enableZoom && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              pointerEvents: "auto",
            }}
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= ZOOM_STEPS[0]}
              aria-label="Diminuir zoom"
              style={{
                background: theme.buttonBg,
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                cursor: zoom <= ZOOM_STEPS[0] ? "not-allowed" : "pointer",
                opacity: zoom <= ZOOM_STEPS[0] ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <ZoomOutIcon color={theme.icon} />
            </button>
            <span
              style={{
                color: theme.text,
                fontSize: "0.8rem",
                fontWeight: 600,
                minWidth: "3rem",
                textAlign: "center",
              }}
            >
              {zoom === 1 ? "1x" : `${zoom}x`}
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
              aria-label="Aumentar zoom"
              style={{
                background: theme.buttonBg,
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                cursor: zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1] ? "not-allowed" : "pointer",
                opacity: zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1] ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <ZoomInIcon color={theme.icon} />
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Fechar galeria"
          style={{
            background: theme.buttonBg,
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            pointerEvents: "auto",
          }}
        >
          <CloseIcon color={theme.icon} />
        </button>
      </div>

      {/* Main Image Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          cursor: cursorStyle,
        }}
        onClick={handleBackdropClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Container (stops propagation so image click doesn't close) */}
        <div
          role="img"
          aria-label={currentImage.alt}
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: isDragging ? "none" : `transform ${transitionDuration}ms ease`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "85vw",
            maxHeight: showThumbnails ? "65vh" : "78vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              maxWidth: "100%",
              maxHeight: showThumbnails ? "65vh" : "78vh",
              objectFit: "contain",
              borderRadius: "4px",
              opacity: imageLoaded ? 1 : 0,
              transition: `opacity ${transitionDuration}ms ease`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Loading indicator (shows until image loads) */}
        {!imageLoaded && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40px",
              height: "40px",
              border: `3px solid ${theme.buttonBg}`,
              borderTop: `3px solid ${theme.icon}`,
              borderRadius: "50%",
              animation: "sgLightboxSpin 0.8s linear infinite",
            }}
          />
        )}
      </div>

      {/* Caption */}
      {showCaption && (currentImage.title || currentImage.description) && (
        <div
          style={{
            textAlign: "center",
            padding: "0.75rem 1.5rem",
            maxWidth: "700px",
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentImage.title && (
            <div
              style={{
                color: theme.text,
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: currentImage.description ? "0.25rem" : 0,
              }}
            >
              {currentImage.title}
            </div>
          )}
          {currentImage.description && (
            <div
              style={{
                color: theme.text,
                fontSize: "0.875rem",
                opacity: 0.75,
              }}
            >
              {currentImage.description}
            </div>
          )}
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            disabled={isFirst}
            aria-label="Anterior"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: theme.buttonBg,
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isFirst ? "not-allowed" : "pointer",
              opacity: isFirst ? 0.3 : 0.8,
              transition: "opacity 0.2s, background 0.2s",
              zIndex: 10,
            }}
          >
            <ChevronLeftIcon color={theme.icon} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            disabled={isLast}
            aria-label="Proxima"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: theme.buttonBg,
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isLast ? "not-allowed" : "pointer",
              opacity: isLast ? 0.3 : 0.8,
              transition: "opacity 0.2s, background 0.2s",
              zIndex: 10,
            }}
          >
            <ChevronRightIcon color={theme.icon} />
          </button>
        </>
      )}

      {/* Thumbnails Strip */}
      {showThumbnails && images.length > 1 && (
        <div
          ref={thumbnailsRef}
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            overflowX: "auto",
            maxWidth: "100%",
            zIndex: 10,
            scrollbarWidth: "thin",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, index) => (
            <button
              key={img.id}
              data-thumb-index={index}
              onClick={() => goToIndex(index)}
              onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
              aria-label={`Ir para imagem ${index + 1}: ${img.alt}`}
              style={{
                flexShrink: 0,
                width: "80px",
                height: "60px",
                borderRadius: "6px",
                overflow: "hidden",
                border: index === currentIndex
                  ? `2px solid ${theme.thumbnailBorder}`
                  : "2px solid transparent",
                opacity: index === currentIndex ? 1 : 0.5,
                cursor: "pointer",
                padding: 0,
                background: "none",
                transition: `opacity ${transitionDuration}ms ease, border-color ${transitionDuration}ms ease`,
              }}
            >
              <img
                src={img.thumbnail || img.src}
                alt={img.alt}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* TODO: Mobile responsive improvements
          - Reduce arrow sizes on <768px
          - Shrink thumbnail items on mobile
      */}

      {/* Inline Styles */}
      <style>{`
        @keyframes sgLightboxSpin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(lightboxContent, document.body);
});

Lightbox.displayName = "Lightbox";

export { Lightbox };
export default Lightbox;
