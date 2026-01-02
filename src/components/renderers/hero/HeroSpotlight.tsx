/**
 * HeroSpotlight - Variante com foco na foto com círculo/spot
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroSpotlight({ component, site, scrollY = 0, scrollToSection, navbar }: RenderProps) {
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
  const heroSpecialty = props.heroSpecialty || props.specialty || 'Especialidade'
  const heroSubtitle = props.heroSubtitle || props.subtitle || 'Cuidado moderno e humano com seu sorriso.'
  const heroImage = props.heroImage || props.image || ''
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 0
  const invertLayout = config.heroInvertLayout || props.heroInvertLayout || false

  return (
    <section
      id="hero"
      className="site-hero relative flex items-center overflow-hidden"
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.9))',
      }}
    >
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-20">
          {navbar}
        </div>
      )}

      {/* Background image */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: `brightness(0.35) blur(${bgBlur}px)`,
            transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0004})`,
          }}
        />
      )}

      {/* Spotlight circle */}
      <div
        className="absolute rounded-full"
        style={{
          top: isMobile ? '24%' : '18%',
          left: '50%',
          transform: `translate(-50%, 0) translateY(${scrollY * 0.15}px)`,
          width: isMobile ? 520 : 800,
          height: isMobile ? 520 : 800,
          background: `radial-gradient(circle, var(--site-primary-color, #264653), transparent 55%)`,
          filter: 'blur(90px)',
          opacity: 0.25,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

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
        className="relative z-10 w-full max-w-7xl mx-auto px-4 grid gap-8 items-center"
        style={{
          paddingTop: navbar ? (isMobile ? '7rem' : '5rem') : isMobile ? '5rem' : '6rem',
          paddingBottom: '3rem',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gridTemplateAreas: isMobile
            ? '"content" "media"'
            : invertLayout
              ? '"media content"'
              : '"content media"',
        }}
      >
        <div style={{ gridArea: 'content' }}>
          <div
            className="inline-flex px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border"
            style={{
              borderColor: 'rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: props.heroWelcomeColor || '#fff',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s',
              transitionDelay: '0.14s',
            }}
          >
            {props.heroWelcome || 'Bem-vindo'}
          </div>

          <h1
            className="text-4xl md:text-6xl font-black mb-2"
            style={{
              letterSpacing: '-1.5px',
              color: props.heroTitleColor || '#fff',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
              transition: 'all 0.5s',
              transitionDelay: '0.28s',
            }}
          >
            {heroTitle}
          </h1>

          <div
            className="inline-block px-3.5 py-2 rounded-xl mb-3 border"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: props.heroSpecialtyColor || 'var(--site-text-secondary, #e9c46a)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'all 0.5s',
              transitionDelay: '0.42s',
            }}
          >
            <span className="text-sm font-extrabold uppercase tracking-wide">
              {heroSpecialty}
            </span>
          </div>

          <p
            className="mt-3 max-w-xl"
            style={{
              color: props.heroSubtitleColor || 'rgba(255,255,255,0.8)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
              transition: 'all 0.5s',
              transitionDelay: '0.56s',
            }}
          >
            {heroSubtitle}
          </p>

          <div
            className="flex gap-2.5 mt-4 flex-wrap"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s',
              transitionDelay: '0.7s',
            }}
          >
            <button
              onClick={() => scrollToSection?.('contact')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white border transition-all hover:scale-105"
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white border backdrop-blur-sm transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.22)',
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
              className="relative rounded-3xl overflow-hidden"
              style={{
                width: isMobile ? '100%' : '450px',
                height: isMobile ? '350px' : '550px',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: 'all 0.6s',
                transitionDelay: '0.84s',
              }}
            >
              <img
                src={heroImage}
                alt={heroTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
