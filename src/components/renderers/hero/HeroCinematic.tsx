/**
 * HeroCinematic - Variante com vídeo de fundo opcional e film strip
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroCinematic({ component, site, scrollToSection, navbar }: RenderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const props = component.props || {}
  const config = component.config || {}
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const theme = site.theme?.colorPalette
  const glowSettings = site.componentGlow?.hero

  const heroTitle = props.heroTitle || props.title || props.name || 'Título Principal'
  const heroSubtitle = props.heroSubtitle || props.subtitle || 'Subtítulo'
  const heroImage = props.heroImage || props.image || ''
  const heroVideo = props.heroVideo || config.heroVideo
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 8

  return (
    <section
      id="hero"
      className="site-hero relative overflow-hidden"
      style={{ minHeight: isMobile ? 'auto' : '100vh' }}
    >
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-30">
          {navbar}
        </div>
      )}

      {/* Background: video or image */}
      <div className="absolute inset-0 z-0">
        {heroVideo ? (
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: `brightness(0.35) blur(${bgBlur}px)`,
            }}
          />
        ) : (
          heroImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImage})`,
                filter: `brightness(0.35) blur(${bgBlur}px)`,
              }}
            />
          )
        )}
      </div>

      {glowSettings?.enabled && (
        <SectionGlow
          variant={glowSettings.variant}
          intensity={glowSettings.intensity}
          colorA={theme?.primary}
          colorB={theme?.accent}
          style={{ zIndex: 2 }}
        />
      )}

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32"
        style={{
          paddingTop: navbar ? (isMobile ? '6.5rem' : '7.5rem') : isMobile ? '4.5rem' : '5.5rem',
        }}
      >
        <div className="max-w-3xl">
          <h1
            className="text-5xl md:text-7xl font-black mb-6 text-white"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
            }}
          >
            {heroTitle}
          </h1>
          <p
            className="text-xl mb-8 text-white/80"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
              transitionDelay: '0.2s',
            }}
          >
            {heroSubtitle}
          </p>
          <div
            className="flex gap-4 flex-wrap"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
              transitionDelay: '0.4s',
            }}
          >
            <button
              onClick={() => scrollToSection?.('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white border transition-all hover:scale-105"
              style={{
                background: 'var(--site-primary-gradient)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <span>Agende sua Consulta</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection?.('gallery')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white border backdrop-blur-sm transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Eye size={20} />
              <span>Ver Trabalhos</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
