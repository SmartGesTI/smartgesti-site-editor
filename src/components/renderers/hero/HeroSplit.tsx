/**
 * HeroSplit - Variante dividida 50/50
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroSplit({ component, site, scrollToSection, navbar }: RenderProps) {
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
  const invertLayout = config.heroInvertLayout || props.heroInvertLayout || false

  return (
    <section
      id="hero"
      className="site-hero relative"
      style={{
        background: 'var(--site-background, #0a0a0a)',
        minHeight: isMobile ? 'auto' : '100vh',
      }}
    >
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-30">
          {navbar}
        </div>
      )}

      {glowSettings?.enabled && (
        <SectionGlow
          variant={glowSettings.variant}
          intensity={glowSettings.intensity}
          colorA={theme?.primary}
          colorB={theme?.accent}
          style={{ zIndex: 1 }}
        />
      )}

      <div
        className="relative z-2 max-w-7xl mx-auto px-4 py-20 md:py-32 grid gap-8 items-center"
        style={{
          paddingTop: navbar ? '7rem' : '6rem',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateAreas: isMobile
            ? '"content" "media"'
            : invertLayout
              ? '"media content"'
              : '"content media"',
        }}
      >
        {/* Content */}
        <div style={{ gridArea: 'content' }}>
          <h1
            className="text-4xl md:text-6xl font-black mb-4"
            style={{
              color: 'var(--site-text, #ffffff)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
            }}
          >
            {heroTitle}
          </h1>
          <p
            className="text-lg mb-8"
            style={{
              color: 'var(--site-text-secondary, rgba(255,255,255,0.7))',
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border transition-all hover:scale-105"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border backdrop-blur-sm transition-all hover:scale-105"
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

        {/* Media */}
        {heroImage && (
          <div className="flex items-center justify-center" style={{ gridArea: 'media' }}>
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                width: '100%',
                height: isMobile ? '300px' : '500px',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: 'all 0.6s',
                transitionDelay: '0.3s',
              }}
            >
              <img src={heroImage} alt={heroTitle} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
