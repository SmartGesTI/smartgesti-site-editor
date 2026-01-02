/**
 * SectionGlow - Componente de efeito visual para seções
 * Usa variáveis --site-* para isolamento de cores
 */

import { GlowVariant } from '../../types'
import { cn } from '../../utils/cn'

export interface SectionGlowProps {
  variant: GlowVariant
  intensity?: number // 0..1
  colorA?: string // Ex: theme primary
  colorB?: string // Ex: theme accent
  edgeFade?: number // 0..0.45 fração da altura para suavizar topo/base (default 0.12)
  className?: string
  style?: React.CSSProperties
}

export function SectionGlow({
  variant,
  intensity = 0.3,
  colorA,
  colorB,
  edgeFade,
  className,
  style,
}: SectionGlowProps) {
  // Usar variáveis CSS do site ou cores fornecidas
  const ca = colorA || 'var(--site-primary-color, #264653)'
  const cb = colorB || 'var(--site-accent-color, #e9c46a)'
  const clamp = (v: number) => Math.max(0, Math.min(1, v))
  const op = clamp(intensity)

  const ef = Math.max(0, Math.min(0.45, edgeFade ?? 0.12))
  const topStop = `${(ef * 100).toFixed(2)}%`
  const bottomStart = `${(100 - ef * 100).toFixed(2)}%`

  const maskStyle: React.CSSProperties = {
    // Suaviza o glow no topo e base
    maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #fff ${topStop}, #fff ${bottomStart}, rgba(0,0,0,0) 100%)`,
    WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #fff ${topStop}, #fff ${bottomStart}, rgba(0,0,0,0) 100%)`,
    maskMode: 'luminance',
  } as React.CSSProperties

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
    ...maskStyle,
    ...style,
  }

  if (variant === 'corners') {
    return (
      <div className={cn('site-glow-corners', className)} style={base} aria-hidden>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-15%',
            width: '55%',
            height: '55%',
            filter: 'blur(90px)',
            background: `radial-gradient(closest-side, ${ca}, transparent 70%)`,
            opacity: op,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-22%',
            right: '-18%',
            width: '58%',
            height: '58%',
            filter: 'blur(95px)',
            background: `radial-gradient(closest-side, ${cb}, transparent 70%)`,
            opacity: clamp(op * 0.9),
          }}
        />
      </div>
    )
  }

  if (variant === 'vignette') {
    return (
      <div className={cn('site-glow-vignette', className)} style={base} aria-hidden>
        <div
          style={{
            position: 'absolute',
            inset: '-20%',
            filter: 'blur(80px)',
            background: `radial-gradient(ellipse at center, ${ca}, transparent 60%)`,
            opacity: clamp(op * 0.35),
          }}
        />
      </div>
    )
  }

  if (variant === 'aurora') {
    return (
      <div className={cn('site-glow-aurora', className)} style={base} aria-hidden>
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '70%',
            height: '60%',
            filter: 'blur(90px)',
            transform: 'rotate(-8deg)',
            background: `linear-gradient(90deg, ${ca}, ${cb})`,
            opacity: clamp(op * 0.5),
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-18%',
            right: '-12%',
            width: '65%',
            height: '55%',
            filter: 'blur(90px)',
            transform: 'rotate(10deg)',
            background: `linear-gradient(90deg, ${cb}, ${ca})`,
            opacity: clamp(op * 0.45),
          }}
        />
      </div>
    )
  }

  // beams (faixas diagonais por padrão)
  return (
    <div className={cn('site-glow-beams', className)} style={base} aria-hidden>
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-20%',
          width: '140%',
          height: '40%',
          filter: 'blur(90px)',
          transform: 'rotate(-15deg)',
          background: `linear-gradient(90deg, transparent, ${ca}, transparent)`,
          opacity: clamp(op * 0.45),
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-25%',
          width: '150%',
          height: '40%',
          filter: 'blur(90px)',
          transform: 'rotate(12deg)',
          background: `linear-gradient(90deg, transparent, ${cb}, transparent)`,
          opacity: clamp(op * 0.4),
        }}
      />
    </div>
  )
}
