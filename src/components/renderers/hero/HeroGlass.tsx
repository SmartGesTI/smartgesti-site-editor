/**
 * HeroGlass - Variante com card de texto vidro fosco
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroGlass({ component, site, scrollY = 0, scrollToSection, navbar }: RenderProps) {
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
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 6
  const invertLayout = config.heroInvertLayout || props.heroInvertLayout || false

  return (
    <section id="hero" className="site-hero relative overflow-hidden" style={{ minHeight: isMobile ? 'auto' : '100vh' }}>
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-30">
          {navbar}
        </div>
      )}

      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: `brightness(0.45) blur(${bgBlur}px)`,
            transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0004})`,
          }}
        />
      )}

      {glowSettings?.enabled && (
        <SectionGlow
          variant={glowSettings.variant}
          intensity={glowSettings.intensity}
          colorA={theme?.primary}
          colorB={theme?.accent}
          style={{ zIndex: 2 }}
        />
      )}

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 grid gap-8 items-center"
        style={{
          paddingTop: navbar ? (isMobile ? '6rem' : '7rem') : isMobile ? '5rem' : '6rem',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateAreas: isMobile
            ? '"content" "media"'
            : invertLayout
              ? '"media content"'
              : '"content media"',
        }}
      >
        {/* Glass card */}
        <div
          className="p-8 md:p-12 rounded-3xl backdrop-blur-xl border"
          style={{
            gridArea: 'content',
            background: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s',
          }}
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white">{heroTitle}</h1>
          <p className="text-lg mb-8 text-white/80">{heroSubtitle}</p>
          <div className="flex gap-4 flex-wrap">
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
                width: isMobile ? '100%' : '500px',
                height: isMobile ? '300px' : '600px',
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
