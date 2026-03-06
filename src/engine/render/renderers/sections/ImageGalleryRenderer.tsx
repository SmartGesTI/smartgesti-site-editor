/**
 * ImageGallery Renderer
 * Renderiza galeria de imagens com grid responsivo, lazy loading,
 * efeitos de hover e lightbox fullscreen.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { ImageGalleryBlock, GalleryImage } from "../../../schema/siteDocument";
import { Lightbox } from "./Lightbox";

// ============================================================================
// LazyImage Sub-Component
// ============================================================================

interface LazyImageProps {
  image: GalleryImage;
  onClick: () => void;
  borderRadius: number;
  shadow: string;
  hoverEffect: string;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  image,
  onClick,
  borderRadius,
  shadow,
  hoverEffect,
  aspectRatio,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const shadowStyle = useMemo<string>(() => {
    const map: Record<string, string> = {
      none: "none",
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 4px 6px rgba(0,0,0,0.1)",
      lg: "0 10px 15px rgba(0,0,0,0.1)",
      xl: "0 20px 25px rgba(0,0,0,0.15)",
    };
    return map[shadow] || "none";
  }, [shadow]);

  const hoverClass = useMemo<string>(() => {
    switch (hoverEffect) {
      case "zoom-overlay":
        return "sg-gallery__hover-zoom-overlay";
      case "glow":
        return "sg-gallery__hover-glow";
      case "scale":
        return "sg-gallery__hover-scale";
      case "caption-reveal":
        return "sg-gallery__hover-caption-reveal";
      default:
        return "";
    }
  }, [hoverEffect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  return (
    <div
      ref={imgRef}
      className={`sg-gallery__image-item ${hoverClass}`}
      style={{
        borderRadius: `${borderRadius}px`,
        aspectRatio: aspectRatio || "auto",
        boxShadow: shadowStyle,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Ver imagem: ${image.alt}`}
    >
      {isVisible ? (
        <>
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: isLoaded ? 1 : 0,
              backgroundColor: "#f3f4f6",
              display: "block",
            }}
          />
          {/* Overlay icon for zoom-overlay effect */}
          {hoverEffect === "zoom-overlay" && (
            <div className="sg-gallery__overlay-content">
              <svg
                style={{ width: "3rem", height: "3rem", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          )}
          {/* Caption reveal for caption-reveal effect */}
          {hoverEffect === "caption-reveal" && (image.title || image.description) && (
            <div className="sg-gallery__caption-content">
              {image.title && (
                <div className="sg-gallery__caption-title">{image.title}</div>
              )}
              {image.description && (
                <div className="sg-gallery__caption-desc">{image.description}</div>
              )}
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "200px",
            backgroundColor: "#e5e7eb",
            animation: "sgGalleryPulse 1.5s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// Main ImageGallery Component (with hooks for lightbox state)
// ============================================================================

const ImageGalleryComponent: React.FC<{ block: ImageGalleryBlock }> = ({ block }) => {
  const { props } = block;

  // All hooks before any early returns
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Move images/columns/gap up so carousel hooks can reference them
  const images = props.images || [];
  const columns = props.columns || 4;
  const gap = props.gap || 1;

  // Carousel hooks (must be before any early returns)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCarouselPrev = useCallback(() => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleCarouselNext = useCallback(() => {
    setCarouselIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  // Carousel: scroll to current slide
  useEffect(() => {
    if (props.variation !== 'gallery-carousel' || !carouselRef.current) return;
    const container = carouselRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: carouselIndex * slideWidth, behavior: 'smooth' });
  }, [carouselIndex, props.variation]);

  // Carousel: autoplay
  useEffect(() => {
    if (props.variation !== 'gallery-carousel') return;
    if (!props.lightbox?.enableAutoplay) return;
    const interval = (props.lightbox?.autoplayInterval || 5) * 1000;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [props.variation, props.lightbox?.enableAutoplay, props.lightbox?.autoplayInterval, images.length]);

  const enterAnimationClass = useMemo<string>(() => {
    switch (props.enterAnimation) {
      case "fade-scale":
        return "sg-gallery__animate-fade-scale";
      case "stagger":
        return "sg-gallery__animate-stagger";
      case "slide-up":
        return "sg-gallery__animate-slide-up";
      default:
        return "";
    }
  }, [props.enterAnimation]);

  const showWarningAt = props.showWarningAt || 50;

  // ---- Layout render functions ----

  const renderGridLayout = () => (
    <div
      className={`sg-gallery__grid ${enterAnimationClass}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
      }}
    >
      {images.map((image, index) => (
        <LazyImage
          key={image.id}
          image={image}
          onClick={() => handleImageClick(index)}
          borderRadius={props.imageBorderRadius || 8}
          shadow={props.imageShadow || "md"}
          hoverEffect={props.hoverEffect || "zoom-overlay"}
          aspectRatio={props.aspectRatio}
        />
      ))}
    </div>
  );

  const renderMasonryLayout = () => (
    <div
      className={`sg-gallery__masonry ${enterAnimationClass}`}
      style={{
        columnCount: columns,
        columnGap: `${gap}rem`,
      }}
    >
      {images.map((image, index) => (
        <div key={image.id} style={{ breakInside: "avoid", marginBottom: `${gap}rem` }}>
          <LazyImage
            image={image}
            onClick={() => handleImageClick(index)}
            borderRadius={props.imageBorderRadius || 8}
            shadow={props.imageShadow || "md"}
            hoverEffect={props.hoverEffect || "zoom-overlay"}
            aspectRatio={undefined}
          />
        </div>
      ))}
    </div>
  );

  const renderFeaturedLayout = () => (
    <div className={`sg-gallery__featured ${enterAnimationClass}`}>
      <div className="sg-gallery__featured-main">
        <LazyImage
          image={images[0]}
          onClick={() => handleImageClick(0)}
          borderRadius={props.imageBorderRadius || 8}
          shadow={props.imageShadow || "md"}
          hoverEffect={props.hoverEffect || "zoom-overlay"}
          aspectRatio="16/9"
        />
      </div>
      {images.length > 1 && (
        <div
          className="sg-gallery__featured-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(columns, images.length - 1)}, 1fr)`,
            gap: `${gap}rem`,
            marginTop: `${gap}rem`,
          }}
        >
          {images.slice(1).map((image, index) => (
            <LazyImage
              key={image.id}
              image={image}
              onClick={() => handleImageClick(index + 1)}
              borderRadius={props.imageBorderRadius || 8}
              shadow={props.imageShadow || "md"}
              hoverEffect={props.hoverEffect || "zoom-overlay"}
              aspectRatio={props.aspectRatio}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className={`sg-gallery__carousel ${enterAnimationClass}`} style={{ position: "relative" }}>
      <div
        ref={carouselRef}
        className="sg-gallery__carousel-track"
        style={{
          display: "flex",
          overflowX: "hidden",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          borderRadius: `${props.imageBorderRadius || 8}px`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="sg-gallery__carousel-slide"
            style={{
              flex: "0 0 100%",
              scrollSnapAlign: "start",
              aspectRatio: props.aspectRatio || "16/9",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => handleImageClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(index);
              }
            }}
            aria-label={`Ver imagem: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index > 2 ? "lazy" : "eager"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {(image.title || image.description) && (
              <div className="sg-gallery__carousel-caption">
                {image.title && (
                  <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {image.title}
                  </div>
                )}
                {image.description && (
                  <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                    {image.description}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handleCarouselPrev}
            disabled={carouselIndex === 0}
            aria-label="Slide anterior"
            className="sg-gallery__carousel-nav sg-gallery__carousel-nav--prev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleCarouselNext}
            disabled={carouselIndex === images.length - 1}
            aria-label="Próximo slide"
            className="sg-gallery__carousel-nav sg-gallery__carousel-nav--next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="sg-gallery__carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={`sg-gallery__carousel-dot ${carouselIndex === index ? "sg-gallery__carousel-dot--active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderAlternatingLayout = () => (
    <div className={`sg-gallery__alternating ${enterAnimationClass}`}>
      {images.map((image, index) => {
        const isReversed = index % 2 === 1;
        return (
          <div
            key={image.id}
            className={`sg-gallery__alternating-row ${isReversed ? "sg-gallery__alternating-row--reverse" : ""}`}
            style={{ marginBottom: `${gap * 2}rem` }}
          >
            <div className="sg-gallery__alternating-image">
              <LazyImage
                image={image}
                onClick={() => handleImageClick(index)}
                borderRadius={props.imageBorderRadius || 8}
                shadow={props.imageShadow || "md"}
                hoverEffect={props.hoverEffect || "zoom-overlay"}
                aspectRatio={props.aspectRatio || "4/3"}
              />
            </div>
            <div className="sg-gallery__alternating-text">
              {image.title && (
                <h3 style={{
                  fontSize: "var(--sg-heading-h3, 1.5rem)",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: "var(--sg-heading, var(--sg-text))",
                }}>
                  {image.title}
                </h3>
              )}
              {image.description && (
                <p style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "var(--sg-muted-text, #6b7280)",
                  margin: 0,
                }}>
                  {image.description}
                </p>
              )}
              {!image.title && !image.description && (
                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--sg-muted-text, #9ca3af)",
                  fontStyle: "italic",
                  margin: 0,
                }}>
                  Adicione título e descrição a esta imagem
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGalleryLayout = () => {
    const variation = props.variation || "gallery-grid";

    switch (variation) {
      case "gallery-masonry":
        return renderMasonryLayout();
      case "gallery-featured":
        return renderFeaturedLayout();
      case "gallery-carousel":
        return renderCarouselLayout();
      case "gallery-alternating":
        return renderAlternatingLayout();
      case "gallery-grid":
      default:
        return renderGridLayout();
    }
  };

  return (
    <section
      data-block-id={block.id}
      data-block-group="Galeria"
      style={{
        padding: "var(--sg-section-padding-md, 3rem 0)",
        backgroundColor: props.bg || "transparent",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        {(props.title || props.subtitle) && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            {props.title && (
              <h2
                style={{
                  fontSize: "var(--sg-heading-h2, 2rem)",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--sg-heading, var(--sg-text))",
                }}
              >
                {props.title}
              </h2>
            )}
            {props.subtitle && (
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--sg-muted-text, #6b7280)",
                }}
              >
                {props.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Performance Warning */}
        {images.length > showWarningAt && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#fefce8",
              borderLeft: "4px solid #facc15",
              color: "#854d0e",
              borderRadius: "0 0.5rem 0.5rem 0",
            }}
          >
            <strong>Atenção:</strong> Esta galeria possui {images.length} imagens.
            Para melhor performance, considere reduzir o número de imagens.
          </div>
        )}

        {/* Gallery Layout */}
        {images.length > 0 && renderGalleryLayout()}

        {/* Empty State */}
        {images.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              color: "var(--sg-muted-text, #6b7280)",
            }}
          >
            <svg
              style={{
                width: "4rem",
                height: "4rem",
                margin: "0 auto 1rem",
                opacity: 0.5,
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>
              Nenhuma imagem adicionada
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Clique em &quot;Adicionar&quot; para começar sua galeria
            </p>
          </div>
        )}
      </div>

      {/* Inline Styles for Hover Effects & Animations */}
      <style>{`
        /* Pulse animation for loading placeholder */
        @keyframes sgGalleryPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Hover Effects */
        .sg-gallery__hover-zoom-overlay img {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .sg-gallery__hover-zoom-overlay:hover img {
          transform: scale(1.1);
        }
        .sg-gallery__hover-zoom-overlay .sg-gallery__overlay-content {
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
        .sg-gallery__hover-zoom-overlay:hover .sg-gallery__overlay-content {
          opacity: 1;
        }

        .sg-gallery__hover-glow {
          transition: box-shadow 0.3s ease !important;
        }
        .sg-gallery__hover-glow:hover {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.6) !important;
        }

        .sg-gallery__hover-scale img {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .sg-gallery__hover-scale:hover img {
          transform: scale(1.05);
        }

        .sg-gallery__hover-caption-reveal .sg-gallery__caption-content {
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
        .sg-gallery__hover-caption-reveal:hover .sg-gallery__caption-content {
          transform: translateY(0);
        }
        .sg-gallery__caption-title {
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }
        .sg-gallery__caption-desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Enter Animations */
        @keyframes sgGalleryFadeScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sgGallerySlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sg-gallery__animate-fade-scale .sg-gallery__image-item {
          animation: sgGalleryFadeScale 0.5s ease-out both;
        }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(1) { animation-delay: 0.05s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(2) { animation-delay: 0.1s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(3) { animation-delay: 0.15s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(4) { animation-delay: 0.2s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(5) { animation-delay: 0.25s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(6) { animation-delay: 0.3s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(7) { animation-delay: 0.35s; }
        .sg-gallery__animate-fade-scale .sg-gallery__image-item:nth-child(8) { animation-delay: 0.4s; }

        .sg-gallery__animate-slide-up .sg-gallery__image-item {
          animation: sgGallerySlideUp 0.5s ease-out both;
        }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(1) { animation-delay: 0.05s; }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(2) { animation-delay: 0.1s; }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(3) { animation-delay: 0.15s; }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(4) { animation-delay: 0.2s; }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(5) { animation-delay: 0.25s; }
        .sg-gallery__animate-slide-up .sg-gallery__image-item:nth-child(6) { animation-delay: 0.3s; }

        .sg-gallery__animate-stagger .sg-gallery__image-item {
          animation: sgGalleryFadeScale 0.5s ease-out both;
        }
        .sg-gallery__animate-stagger .sg-gallery__image-item:nth-child(odd) { animation-delay: 0.1s; }
        .sg-gallery__animate-stagger .sg-gallery__image-item:nth-child(even) { animation-delay: 0.2s; }

        /* Responsive Grid */
        @media (max-width: 1024px) {
          .sg-gallery__grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .sg-gallery__grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .sg-gallery__grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Masonry Responsive */
        @media (max-width: 1024px) {
          .sg-gallery__masonry { column-count: 3 !important; }
        }
        @media (max-width: 768px) {
          .sg-gallery__masonry { column-count: 2 !important; }
        }
        @media (max-width: 640px) {
          .sg-gallery__masonry { column-count: 1 !important; }
        }

        /* Featured Layout */
        .sg-gallery__featured-main { width: 100%; }
        @media (max-width: 768px) {
          .sg-gallery__featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .sg-gallery__featured-grid { grid-template-columns: 1fr !important; }
        }

        /* Carousel Layout */
        .sg-gallery__carousel-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 2rem 1.5rem 1.5rem;
          color: white;
        }
        .sg-gallery__carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          transition: opacity 0.2s;
        }
        .sg-gallery__carousel-nav--prev { left: 1rem; }
        .sg-gallery__carousel-nav--next { right: 1rem; }
        .sg-gallery__carousel-nav:disabled { opacity: 0.3; cursor: not-allowed; }
        .sg-gallery__carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .sg-gallery__carousel-dot {
          height: 0.5rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
          width: 0.5rem;
          background: var(--sg-muted-text, #d1d5db);
        }
        .sg-gallery__carousel-dot--active {
          width: 2rem;
          background: var(--sg-primary, #3b82f6);
        }

        /* Alternating Layout */
        .sg-gallery__alternating-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        .sg-gallery__alternating-row--reverse {
          direction: rtl;
        }
        .sg-gallery__alternating-row--reverse > * {
          direction: ltr;
        }
        .sg-gallery__alternating-text {
          padding: 1rem;
        }
        @media (max-width: 768px) {
          .sg-gallery__alternating-row {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
      `}</style>

      {/* Fullscreen Lightbox */}
      <Lightbox
        images={images}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        config={props.lightbox}
      />
    </section>
  );
};

// ============================================================================
// Render Function (matches registry pattern)
// ============================================================================

export function renderImageGallery(block: any): React.ReactNode {
  return <ImageGalleryComponent block={block as ImageGalleryBlock} />;
}
