/**
 * HeroParallax - Variante com efeito parallax forte
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroParallax({ component, site, scrollY = 0, scrollToSection, navbar }: RenderProps) {
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
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 2

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

      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: `brightness(0.4) blur(${bgBlur}px)`,
            transform: `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.0006})`,
            willChange: 'transform',
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 flex items-center justify-center" style={{ minHeight: isMobile ? 'auto' : '100vh' }}>
        <div
          className="p-8 md:p-12 rounded-3xl backdrop-blur-xl border max-w-2xl"
          style={{
            background: 'rgba(0,0,0,0.4)',
            borderColor: 'rgba(255,255,255,0.2)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s',
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
      </div>
    </section>
  )
}
