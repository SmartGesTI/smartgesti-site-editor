/**
 * HeroColumns - Variante com 3 colunas: texto, foto, destaques
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'

export function HeroColumns({ component, site, navbar }: RenderProps) {
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
  const heroImage = props.heroImage || props.image || ''

  return (
    <section
      id="hero"
      className="site-hero relative overflow-hidden"
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
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        }}
      >
        {/* Column 1: Text */}
        <div>
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
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
            className="text-base mb-6"
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
        </div>

        {/* Column 2: Image */}
        {heroImage && (
          <div className="flex items-center justify-center">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                width: '100%',
                height: isMobile ? '250px' : '400px',
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

        {/* Column 3: Highlights/Stats */}
        <div>
          {props.stats && Array.isArray(props.stats) && props.stats.length > 0 && (
            <div className="space-y-4">
              {props.stats.slice(0, 3).map((stat: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateX(0)' : 'translateX(30px)',
                    transition: 'all 0.6s',
                    transitionDelay: `${0.4 + i * 0.1}s`,
                  }}
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
