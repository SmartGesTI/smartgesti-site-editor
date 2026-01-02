/**
 * HeroBanner - Variante estilo faixa com CTA evidente
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroBanner({ component, site, scrollY = 0, scrollToSection, navbar }: RenderProps) {
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
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 4

  return (
    <section id="hero" className="site-hero relative overflow-hidden" style={{ minHeight: isMobile ? '400px' : '500px' }}>
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
            transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0003})`,
          }}
        />
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
        className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16 flex items-center justify-center"
        style={{
          paddingTop: navbar ? (isMobile ? '5rem' : '6rem') : isMobile ? '4rem' : '5rem',
          minHeight: isMobile ? '400px' : '500px',
        }}
      >
        <div className="text-center max-w-3xl">
          <h1
            className="text-4xl md:text-6xl font-black mb-4 text-white"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
            }}
          >
            {heroTitle}
          </h1>
          <p
            className="text-lg mb-8 text-white/80"
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
            className="flex gap-4 justify-center flex-wrap"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
              transitionDelay: '0.4s',
            }}
          >
            <button
              onClick={() => scrollToSection?.('contact')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border transition-all hover:scale-105 text-lg"
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border backdrop-blur-sm transition-all hover:scale-105 text-lg"
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderColor: 'rgba(255,255,255,0.3)',
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
