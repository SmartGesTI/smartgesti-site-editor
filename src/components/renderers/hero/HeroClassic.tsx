/**
 * HeroClassic - Variante clássica do Hero
 * Adaptado do editor antigo, usando variáveis --site-*
 */

import { useState, useEffect } from 'react'
import { RenderProps } from '../types'
import { SectionGlow } from '../../effects/SectionGlow'
import { ArrowRight, Eye } from 'lucide-react'

export function HeroClassic({ component, site, scrollY = 0, scrollToSection, navbar }: RenderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const props = component.props || {}
  const config = component.config || {}
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Extrair dados do componente
  const heroWelcomeText = props.heroWelcome || props.welcomeText || 'Bem-vindo ao meu mundo'
  const heroTitle = props.heroTitle || props.title || props.name || 'Título Principal'
  const heroSpecialty = props.heroSpecialty || props.specialty || 'Especialidade'
  const heroSubtitle = props.heroSubtitle || props.subtitle || 'Transformando sorrisos através da arte da odontologia.'
  const heroImage = props.heroImage || props.image || ''
  const bgBlur = config.heroImageBlur || props.heroImageBlur || 0
  const invertLayout = config.heroInvertLayout || props.heroInvertLayout || false

  // Cores do tema do site
  const theme = site.theme?.colorPalette
  const glowSettings = site.componentGlow?.hero

  return (
    <section
      id="hero"
      className="site-hero relative flex flex-col justify-center overflow-hidden"
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        padding: isMobile ? '6rem 1rem 4rem' : '8rem 0 4rem',
      }}
    >
      {/* Glow effect */}
      {glowSettings?.enabled && (
        <SectionGlow
          variant={glowSettings.variant}
          intensity={glowSettings.intensity}
          colorA={theme?.primary}
          colorB={theme?.accent}
          style={{ zIndex: 6 }}
        />
      )}

      {/* Navbar overlay */}
      {navbar && (
        <div className="absolute top-0 left-0 w-full z-20">
          {navbar}
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden z-1">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              filter: `brightness(0.35) saturate(1.1) blur(${bgBlur}px)`,
              transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
            }}
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.75) 80%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12), transparent 60%)',
            zIndex: 2,
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 grid gap-8 max-w-7xl mx-auto px-4 items-center"
        style={{
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateAreas: isMobile
            ? '"content" "media"'
            : invertLayout
              ? '"media content"'
              : '"content media"',
        }}
      >
        {/* Content area */}
        <div className="max-w-2xl" style={{ gridArea: 'content' }}>
          {/* Welcome badge */}
          <div
            className="inline-flex px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',
              borderColor: 'rgba(255,255,255,0.15)',
              color: props.heroWelcomeColor || 'var(--site-text, #ffffff)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.14s',
            }}
          >
            {heroWelcomeText}
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
            style={{
              color: props.heroTitleColor || 'var(--site-text, #ffffff)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.28s',
            }}
          >
            {heroTitle}
          </h1>

          {/* Specialty badge */}
          <div
            className="inline-block px-5 py-3 rounded-2xl mb-6 border backdrop-blur-sm"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
              borderColor: 'rgba(255,255,255,0.05)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.42s',
            }}
          >
            <span
              className="block text-lg font-extrabold uppercase tracking-wider"
              style={{
                color: props.heroSpecialtyColor || 'var(--site-primary-color, #264653)',
              }}
            >
              {heroSpecialty}
            </span>
          </div>

          {/* Subtitle */}
          <p
            className="text-lg mb-8 max-w-xl"
            style={{
              color: props.heroSubtitleColor || 'rgba(255,255,255,0.75)',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.56s',
            }}
          >
            {heroSubtitle}
          </p>

          {/* Stats */}
          {props.stats && Array.isArray(props.stats) && props.stats.length > 0 && (
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-9"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.7s',
              }}
            >
              {props.stats.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                    {stat.icon && <stat.icon size={20} style={{ color: 'var(--site-text-secondary, #e9c46a)' }} />}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/55">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.84s',
            }}
          >
            <button
              onClick={() => scrollToSection?.('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white border transition-all hover:scale-105 hover:brightness-110"
              style={{
                background: 'var(--site-primary-gradient, linear-gradient(135deg, #264653, #2a9d8f, #e9c46a))',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <span>{props.buttonText || 'Agende sua Consulta'}</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection?.('gallery')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white border backdrop-blur-sm transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Eye size={20} />
              <span>Ver Trabalhos</span>
            </button>
          </div>
        </div>

        {/* Media area */}
        {heroImage && (
          <div className="flex items-center justify-center" style={{ gridArea: 'media' }}>
            <div
              className="relative rounded-3xl overflow-hidden border backdrop-blur-sm"
              style={{
                width: isMobile ? '100%' : '500px',
                height: isMobile ? '300px' : '600px',
                borderColor: 'rgba(255,255,255,0.1)',
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.98s',
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
