/**
 * HeroNeon - Variante com linhas e brilho neon
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroNeon({ component, site, scrollToSection, navbar }: RenderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const props = component.props || {}
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const theme = site.theme?.colorPalette
  const glowSettings = site.componentGlow?.hero

  const heroTitle = props.heroTitle || props.title || props.name || 'Título Principal'
  const heroSubtitle = props.heroSubtitle || props.subtitle || 'Subtítulo'
  const primary = theme?.primary || '#6d28d9'
  const accent = theme?.accent || '#22d3ee'

  return (
    <section
      id="hero"
      className="site-hero relative overflow-hidden"
      style={{
        background: '#07070a',
        minHeight: isMobile ? 'auto' : '100vh',
      }}
    >
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-30">
          {navbar}
        </div>
      )}

      {/* Neon lines background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(1200px 400px at 10% 10%, ${primary}20, transparent 60%), radial-gradient(1200px 400px at 90% 80%, ${accent}20, transparent 60%)`,
        }}
      />

      {glowSettings?.enabled && (
        <SectionGlow
          variant={glowSettings.variant}
          intensity={glowSettings.intensity}
          colorA={primary}
          colorB={accent}
          style={{ zIndex: 1 }}
        />
      )}

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 flex items-center justify-center"
        style={{
          paddingTop: navbar ? (isMobile ? '6rem' : '7rem') : isMobile ? '5rem' : '6rem',
          minHeight: isMobile ? 'auto' : '100vh',
        }}
      >
        <div className="text-center max-w-3xl">
          <h1
            className="text-5xl md:text-7xl font-black mb-6"
            style={{
              color: 'var(--site-text, #ffffff)',
              textShadow: `0 0 20px ${primary}, 0 0 40px ${primary}40`,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s',
            }}
          >
            {heroTitle}
          </h1>
          <p
            className="text-xl mb-8"
            style={{
              color: 'var(--site-text-secondary, rgba(255,255,255,0.8))',
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
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${primary}, ${accent})`,
                borderColor: `${primary}80`,
                boxShadow: `0 0 20px ${primary}40`,
              }}
            >
              <span>Agende sua Consulta</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection?.('gallery')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border backdrop-blur-sm transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: `${accent}60`,
                boxShadow: `0 0 15px ${accent}30`,
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
