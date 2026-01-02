/**
 * Render Node Implementation
 * Implementação da renderização de blocos
 */

import React from 'react'
import {
  Block,
  ContainerBlock,
  StackBlock,
  GridBlock,
  BoxBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  LinkBlock,
  DividerBlock,
  CardBlock,
  SectionBlock,
} from '../schema/siteDocument'

/**
 * Renderiza um bloco recursivamente
 */
export function renderBlockNode(block: Block, depth: number = 0): React.ReactNode {
  switch (block.type) {
    // Layout básico
    case 'container':
      return renderContainer(block as ContainerBlock, depth)
    case 'stack':
      return renderStack(block as StackBlock, depth)
    case 'grid':
      return renderGrid(block as GridBlock, depth)
    case 'box':
      return renderBox(block as BoxBlock, depth)
    case 'section':
      return renderSection(block as SectionBlock, depth)
    case 'spacer':
      return renderSpacer(block)
    
    // Texto e mídia
    case 'heading':
      return renderHeading(block as HeadingBlock)
    case 'text':
      return renderText(block as TextBlock)
    case 'image':
      return renderImage(block as ImageBlock)
    case 'video':
      return renderVideo(block)
    case 'icon':
      return renderIcon(block)
    
    // Interativos
    case 'button':
      return renderButton(block as ButtonBlock)
    case 'link':
      return renderLink(block as LinkBlock)
    
    // Elementos UI
    case 'divider':
      return renderDivider(block as DividerBlock)
    case 'card':
      return renderCard(block as CardBlock, depth)
    case 'badge':
      return renderBadge(block)
    case 'avatar':
      return renderAvatar(block)
    case 'socialLinks':
      return renderSocialLinks(block)
    
    // Seções compostas
    case 'hero':
      return renderHero(block)
    case 'feature':
      return renderFeature(block)
    case 'featureGrid':
      return renderFeatureGrid(block)
    case 'pricing':
      return renderPricing(block)
    case 'pricingCard':
      return renderPricingCard(block)
    case 'testimonial':
      return renderTestimonial(block)
    case 'testimonialGrid':
      return renderTestimonialGrid(block)
    case 'faq':
      return renderFaq(block)
    case 'faqItem':
      return renderFaqItem(block)
    case 'cta':
      return renderCta(block)
    case 'stats':
      return renderStats(block)
    case 'statItem':
      return renderStatItem(block)
    case 'logoCloud':
      return renderLogoCloud(block)
    case 'navbar':
      return renderNavbar(block)
    
    // Formulários
    case 'form':
      return renderForm(block, depth)
    case 'input':
      return renderInput(block)
    case 'textarea':
      return renderTextarea(block)
    case 'formSelect':
      return renderFormSelect(block)
    
    default:
      console.warn(`Unknown block type: ${(block as any).type}`)
      return null
  }
}

function renderContainer(block: ContainerBlock, depth: number): React.ReactNode {
  const { maxWidth = '1200px', padding = '1rem', children = [] } = block.props

  return (
    <div
      key={block.id}
      style={{
        maxWidth,
        padding,
        margin: '0 auto',
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
    </div>
  )
}

function renderStack(block: StackBlock, depth: number): React.ReactNode {
  const {
    direction = 'col',
    gap = '1rem',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    children = [],
  } = block.props

  const flexDirection = direction === 'row' ? 'row' : 'column'
  const alignItems = align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align === 'center' ? 'center' : 'stretch'
  const justifyContent =
    justify === 'start'
      ? 'flex-start'
      : justify === 'end'
        ? 'flex-end'
        : justify === 'center'
          ? 'center'
          : justify === 'space-between'
            ? 'space-between'
            : 'space-around'

  return (
    <div
      key={block.id}
      style={{
        display: 'flex',
        flexDirection,
        gap,
        alignItems,
        justifyContent,
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
    </div>
  )
}

function renderGrid(block: GridBlock, depth: number): React.ReactNode {
  const { cols = 3, gap = '1rem', children = [] } = block.props

  const gridCols = typeof cols === 'number' ? cols : cols.lg || cols.md || cols.sm || 3

  return (
    <div
      key={block.id}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap,
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
    </div>
  )
}

function renderBox(block: BoxBlock, depth: number): React.ReactNode {
  const { bg, border, radius, shadow, padding = '1rem', children = [] } = block.props

  // Detectar se bg é gradiente ou cor sólida
  const isGradient = bg && (bg.includes('gradient') || bg.includes('linear') || bg.includes('radial'))
  const backgroundStyle = isGradient
    ? { background: bg }
    : { backgroundColor: bg }

  return (
    <div
      key={block.id}
      style={{
        ...backgroundStyle,
        border,
        borderRadius: radius,
        boxShadow: shadow,
        padding,
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
    </div>
  )
}

function renderHeading(block: HeadingBlock): React.ReactNode {
  const { level, text, align = 'left', color } = block.props
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <Tag
      key={block.id}
      style={{
        textAlign: align,
        color: color || 'var(--sg-text, #1f2937)',
      }}
    >
      {text}
    </Tag>
  )
}

function renderText(block: TextBlock): React.ReactNode {
  const { text, align = 'left', color, size = 'md' } = block.props

  const fontSizeMap: Record<string, string> = {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
  }

  return (
    <p
      key={block.id}
      style={{
        textAlign: align,
        color: color || 'var(--sg-text, #1f2937)',
        fontSize: fontSizeMap[size],
      }}
    >
      {text}
    </p>
  )
}

function renderImage(block: ImageBlock): React.ReactNode {
  const { src, alt = '', width, height, objectFit = 'cover' } = block.props

  return (
    <img
      key={block.id}
      src={src}
      alt={alt}
      style={{
        width: width || '100%',
        height: height || 'auto',
        objectFit,
      }}
    />
  )
}

function renderButton(block: ButtonBlock): React.ReactNode {
  const { text, href, variant = 'primary', size = 'md' } = block.props

  const baseStyles: React.CSSProperties = {
    padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.625rem 1.25rem',
    borderRadius: 'var(--sg-radius, 0.5rem)',
    border: 'none',
    cursor: 'pointer',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--sg-primary, #3b82f6)',
      color: 'var(--sg-primary-text, #ffffff)',
    },
    secondary: {
      backgroundColor: 'var(--sg-secondary, #6b7280)',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--sg-primary, #3b82f6)',
      border: '1px solid var(--sg-primary, #3b82f6)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--sg-primary, #3b82f6)',
    },
  }

  const buttonStyle = { ...baseStyles, ...variantStyles[variant] }

  if (href) {
    return (
      <a key={block.id} href={href} style={buttonStyle}>
        {text}
      </a>
    )
  }

  return (
    <button key={block.id} style={buttonStyle}>
      {text}
    </button>
  )
}

function renderLink(block: LinkBlock): React.ReactNode {
  const { text, href, target = '_self' } = block.props

  return (
    <a
      key={block.id}
      href={href}
      target={target}
      style={{
        color: 'var(--sg-primary, #3b82f6)',
        textDecoration: 'underline',
      }}
    >
      {text}
    </a>
  )
}

function renderDivider(block: DividerBlock): React.ReactNode {
  const { color = '#e5e7eb', thickness = '1px' } = block.props

  return (
    <hr
      key={block.id}
      style={{
        border: 'none',
        borderTop: `${thickness} solid ${color}`,
        margin: '1rem 0',
      }}
    />
  )
}

function renderCard(block: CardBlock, depth: number): React.ReactNode {
  const { header = [], content = [], footer = [], padding = '1rem', bg, border, radius, shadow } = block.props

  return (
    <div
      key={block.id}
      style={{
        backgroundColor: bg || 'var(--sg-surface, #f9fafb)',
        border: border || '1px solid var(--sg-border, #e5e7eb)',
        borderRadius: radius || 'var(--sg-radius, 0.5rem)',
        boxShadow: shadow || 'var(--sg-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        padding,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {header.length > 0 && (
        <div>
          {header.map((child) => (
            <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
          ))}
        </div>
      )}
      {content.length > 0 && (
        <div>
          {content.map((child) => (
            <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
          ))}
        </div>
      )}
      {footer.length > 0 && (
        <div>
          {footer.map((child) => (
            <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

function renderSection(block: SectionBlock, depth: number): React.ReactNode {
  const { id, bg, padding = '2rem', children = [] } = block.props

  // Detectar se bg é gradiente ou cor sólida
  const isGradient = bg && (bg.includes('gradient') || bg.includes('linear') || bg.includes('radial'))
  const backgroundStyle = isGradient
    ? { background: bg }
    : { backgroundColor: bg || 'var(--sg-bg, #ffffff)' }

  return (
    <section
      key={block.id}
      id={id}
      style={{
        ...backgroundStyle,
        padding,
      }}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
    </section>
  )
}

// ============================================================================
// NOVOS RENDERIZADORES
// ============================================================================

function renderSpacer(block: any): React.ReactNode {
  const { height = '2rem' } = block.props
  return <div key={block.id} style={{ height }} />
}

function renderBadge(block: any): React.ReactNode {
  const { text, variant = 'default', size = 'md' } = block.props
  
  const variantColors: Record<string, { bg: string; text: string }> = {
    default: { bg: 'var(--sg-surface2, #f3f4f6)', text: 'var(--sg-text, #1f2937)' },
    primary: { bg: 'var(--sg-primary, #3b82f6)', text: 'var(--sg-primary-text, #fff)' },
    secondary: { bg: 'var(--sg-secondary, #6b7280)', text: '#fff' },
    success: { bg: 'var(--sg-success, #10b981)', text: '#fff' },
    warning: { bg: 'var(--sg-warning, #f59e0b)', text: '#fff' },
    danger: { bg: 'var(--sg-danger, #ef4444)', text: '#fff' },
    info: { bg: 'var(--sg-info, #3b82f6)', text: '#fff' },
  }
  
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.125rem 0.5rem', fontSize: '0.625rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    lg: { padding: '0.375rem 1rem', fontSize: '0.875rem' },
  }
  
  const colors = variantColors[variant] || variantColors.default
  
  return (
    <span
      key={block.id}
      style={{
        display: 'inline-block',
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: 'var(--sg-radius-pill, 9999px)',
        fontWeight: 500,
        ...sizeStyles[size],
      }}
    >
      {text}
    </span>
  )
}

function renderIcon(block: any): React.ReactNode {
  const { name, size = 'md', color } = block.props
  
  const sizeMap: Record<string, string> = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  }
  
  // Simple SVG icons
  const icons: Record<string, string> = {
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    check: 'M20 6L9 17l-5-5',
    'arrow-right': 'M5 12h14m-7-7 7 7-7 7',
    heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
    globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    'bar-chart': 'M12 20V10M18 20V4M6 20v-4',
  }
  
  const path = icons[name] || icons.star
  const iconSize = sizeMap[size] || sizeMap.md
  
  return (
    <svg
      key={block.id}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}

function renderAvatar(block: any): React.ReactNode {
  const { src, name, size = 'md' } = block.props
  
  const sizeMap: Record<string, string> = {
    sm: 'var(--sg-avatar-sm, 2rem)',
    md: 'var(--sg-avatar-md, 2.5rem)',
    lg: 'var(--sg-avatar-lg, 3rem)',
    xl: 'var(--sg-avatar-xl, 4rem)',
  }
  
  const avatarSize = sizeMap[size] || sizeMap.md
  const initials = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  
  if (src) {
    return (
      <img
        key={block.id}
        src={src}
        alt={name || 'Avatar'}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    )
  }
  
  return (
    <div
      key={block.id}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: '50%',
        backgroundColor: 'var(--sg-primary, #3b82f6)',
        color: 'var(--sg-primary-text, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: `calc(${avatarSize} / 2.5)`,
      }}
    >
      {initials}
    </div>
  )
}

function renderVideo(block: any): React.ReactNode {
  const { src, poster, controls = true, aspectRatio = '16:9' } = block.props
  
  const ratioMap: Record<string, string> = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '9:16': '177.78%',
  }
  
  // Check if it's a YouTube URL
  const isYouTube = src?.includes('youtube.com') || src?.includes('youtu.be')
  const isVimeo = src?.includes('vimeo.com')
  
  if (isYouTube || isVimeo) {
    let embedUrl = src
    if (isYouTube) {
      const videoId = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)?.[1]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (isVimeo) {
      const videoId = src.match(/vimeo\.com\/([\d]+)/)?.[1]
      embedUrl = `https://player.vimeo.com/video/${videoId}`
    }
    
    return (
      <div
        key={block.id}
        style={{
          position: 'relative',
          paddingBottom: ratioMap[aspectRatio],
          height: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  
  return (
    <video
      key={block.id}
      src={src}
      poster={poster}
      controls={controls}
      style={{ width: '100%', borderRadius: 'var(--sg-radius, 0.5rem)' }}
    />
  )
}

function renderHero(block: any): React.ReactNode {
  const {
    variant = 'centered',
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    image,
    badge,
    align = 'center',
    minHeight = '80vh',
    overlay,
  } = block.props

  const containerStyle: React.CSSProperties = {
    minHeight,
    padding: 'var(--sg-section-padding-lg, 6rem 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--sg-bg, #fff)',
    backgroundImage: variant === 'image-bg' && image ? `url(${image})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    padding: '0 1rem',
    textAlign: align as any,
    position: 'relative',
    zIndex: 1,
  }

  return (
    <section key={block.id} style={containerStyle}>
      {overlay && variant === 'image-bg' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
      <div style={contentStyle}>
        {badge && (
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--sg-primary, #3b82f6)',
              color: '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {badge}
          </span>
        )}
        {title && (
          <h1
            style={{
              fontSize: 'var(--sg-heading-h1, 3rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: variant === 'image-bg' && overlay ? '#fff' : 'var(--sg-text)',
            }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <h2
            style={{
              fontSize: 'var(--sg-heading-h3, 1.5rem)',
              fontWeight: 400,
              marginBottom: '1rem',
              color: variant === 'image-bg' && overlay ? 'rgba(255,255,255,0.9)' : 'var(--sg-muted-text)',
            }}
          >
            {subtitle}
          </h2>
        )}
        {description && (
          <p
            style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: align === 'center' ? '0 auto 2rem' : '0 0 2rem',
              color: variant === 'image-bg' && overlay ? 'rgba(255,255,255,0.8)' : 'var(--sg-muted-text)',
            }}
          >
            {description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          {primaryButton && (
            <a
              href={primaryButton.href || '#'}
              style={{
                padding: 'var(--sg-button-padding-lg, 0.75rem 1.5rem)',
                backgroundColor: 'var(--sg-primary)',
                color: 'var(--sg-primary-text)',
                borderRadius: 'var(--sg-button-radius, 0.5rem)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {primaryButton.text}
            </a>
          )}
          {secondaryButton && (
            <a
              href={secondaryButton.href || '#'}
              style={{
                padding: 'var(--sg-button-padding-lg, 0.75rem 1.5rem)',
                backgroundColor: 'transparent',
                color: variant === 'image-bg' && overlay ? '#fff' : 'var(--sg-primary)',
                border: `1px solid ${variant === 'image-bg' && overlay ? '#fff' : 'var(--sg-primary)'}`,
                borderRadius: 'var(--sg-button-radius, 0.5rem)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {secondaryButton.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function renderFeature(block: any): React.ReactNode {
  const { icon, title, description } = block.props
  
  return (
    <div
      key={block.id}
      style={{
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            width: '3rem',
            height: '3rem',
            backgroundColor: 'var(--sg-primary)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--sg-primary-text)',
          }}
        >
          {renderIcon({ id: `${block.id}-icon`, props: { name: icon, size: 'md', color: '#fff' } })}
        </div>
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--sg-muted-text)', fontSize: '0.875rem' }}>{description}</p>
    </div>
  )
}

function renderFeatureGrid(block: any): React.ReactNode {
  const { title, subtitle, columns = 3, features = [] } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md, 4rem 0)',
        backgroundColor: 'var(--sg-surface)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <h2 style={{ fontSize: 'var(--sg-heading-h2)', marginBottom: '0.5rem' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'var(--sg-muted-text)', fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '2rem',
          }}
        >
          {features.map((feature: any, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--sg-bg)',
                borderRadius: 'var(--sg-card-radius, 0.75rem)',
                padding: '2rem',
                boxShadow: 'var(--sg-card-shadow)',
              }}
            >
              {feature.icon && (
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'var(--sg-primary)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {renderIcon({ id: `${block.id}-feat-${index}-icon`, props: { name: feature.icon, color: '#fff' } })}
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--sg-muted-text)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function renderPricingCard(block: any): React.ReactNode {
  const { name, price, period, description, features = [], buttonText, highlighted, badge } = block.props
  
  return (
    <div
      key={block.id}
      style={{
        backgroundColor: 'var(--sg-bg)',
        borderRadius: 'var(--sg-card-radius, 0.75rem)',
        padding: '2rem',
        boxShadow: highlighted ? 'var(--sg-shadow-strong)' : 'var(--sg-card-shadow)',
        border: highlighted ? '2px solid var(--sg-primary)' : '1px solid var(--sg-border)',
        position: 'relative',
      }}
    >
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '-0.75rem',
            right: '1rem',
            backgroundColor: 'var(--sg-primary)',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
          }}
        >
          {badge}
        </span>
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{name}</h3>
      {description && <p style={{ color: 'var(--sg-muted-text)', marginBottom: '1rem' }}>{description}</p>}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{price}</span>
        {period && <span style={{ color: 'var(--sg-muted-text)' }}>{period}</span>}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
        {features.map((feature: string, index: number) => (
          <li key={index} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--sg-success)' }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {buttonText && (
        <button
          style={{
            width: '100%',
            padding: 'var(--sg-button-padding-md)',
            backgroundColor: highlighted ? 'var(--sg-primary)' : 'transparent',
            color: highlighted ? 'var(--sg-primary-text)' : 'var(--sg-primary)',
            border: highlighted ? 'none' : '1px solid var(--sg-primary)',
            borderRadius: 'var(--sg-button-radius)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

function renderPricing(block: any): React.ReactNode {
  const { title, subtitle, plans = [] } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md)',
        backgroundColor: 'var(--sg-bg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <h2 style={{ fontSize: 'var(--sg-heading-h2)', marginBottom: '0.5rem' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'var(--sg-muted-text)', fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {plans.map((plan: any, index: number) =>
            renderPricingCard({
              id: `${block.id}-plan-${index}`,
              props: plan,
            })
          )}
        </div>
      </div>
    </section>
  )
}

function renderTestimonial(block: any): React.ReactNode {
  const { quote, authorName, authorRole, authorCompany, authorAvatar, rating } = block.props
  
  return (
    <div
      key={block.id}
      style={{
        backgroundColor: 'var(--sg-surface)',
        borderRadius: 'var(--sg-card-radius)',
        padding: '2rem',
      }}
    >
      {rating && (
        <div style={{ marginBottom: '1rem', color: '#fbbf24' }}>
          {'\u2605'.repeat(rating)}
        </div>
      )}
      <blockquote style={{ fontSize: '1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
        "{quote}"
      </blockquote>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {authorAvatar ? (
          <img src={authorAvatar} alt={authorName} style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          renderAvatar({ id: `${block.id}-avatar`, props: { name: authorName, size: 'lg' } })
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{authorName}</div>
          {(authorRole || authorCompany) && (
            <div style={{ color: 'var(--sg-muted-text)', fontSize: '0.875rem' }}>
              {authorRole}{authorRole && authorCompany && ', '}{authorCompany}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function renderTestimonialGrid(block: any): React.ReactNode {
  const { title, subtitle, columns = 3, testimonials = [] } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md)',
        backgroundColor: 'var(--sg-bg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <h2 style={{ fontSize: 'var(--sg-heading-h2)', marginBottom: '0.5rem' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'var(--sg-muted-text)', fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '2rem' }}>
          {testimonials.map((testimonial: any, index: number) =>
            renderTestimonial({ id: `${block.id}-testimonial-${index}`, props: testimonial })
          )}
        </div>
      </div>
    </section>
  )
}

function renderFaqItem(block: any): React.ReactNode {
  const { question, answer } = block.props
  
  return (
    <details
      key={block.id}
      style={{
        borderBottom: '1px solid var(--sg-border)',
        padding: '1rem 0',
      }}
    >
      <summary
        style={{
          fontWeight: 600,
          cursor: 'pointer',
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {question}
        <span style={{ fontSize: '1.25rem' }}>+</span>
      </summary>
      <p style={{ marginTop: '1rem', color: 'var(--sg-muted-text)' }}>{answer}</p>
    </details>
  )
}

function renderFaq(block: any): React.ReactNode {
  const { title, subtitle, items = [] } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md)',
        backgroundColor: 'var(--sg-bg)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <h2 style={{ fontSize: 'var(--sg-heading-h2)', marginBottom: '0.5rem' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'var(--sg-muted-text)', fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        <div>
          {items.map((item: any, index: number) =>
            renderFaqItem({ id: `${block.id}-faq-${index}`, props: item })
          )}
        </div>
      </div>
    </section>
  )
}

function renderCta(block: any): React.ReactNode {
  const { title, description, primaryButton, secondaryButton, variant = 'centered', bg } = block.props
  
  const isGradient = variant === 'gradient'
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md)',
        backgroundColor: isGradient ? 'var(--sg-primary)' : bg || 'var(--sg-surface)',
        background: isGradient ? 'linear-gradient(135deg, var(--sg-primary), var(--sg-accent))' : undefined,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <h2
          style={{
            fontSize: 'var(--sg-heading-h2)',
            marginBottom: '1rem',
            color: isGradient ? '#fff' : 'var(--sg-text)',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              color: isGradient ? 'rgba(255,255,255,0.9)' : 'var(--sg-muted-text)',
            }}
          >
            {description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {primaryButton && (
            <a
              href={primaryButton.href || '#'}
              style={{
                padding: 'var(--sg-button-padding-lg)',
                backgroundColor: isGradient ? '#fff' : 'var(--sg-primary)',
                color: isGradient ? 'var(--sg-primary)' : 'var(--sg-primary-text)',
                borderRadius: 'var(--sg-button-radius)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {primaryButton.text}
            </a>
          )}
          {secondaryButton && (
            <a
              href={secondaryButton.href || '#'}
              style={{
                padding: 'var(--sg-button-padding-lg)',
                backgroundColor: 'transparent',
                color: isGradient ? '#fff' : 'var(--sg-primary)',
                border: `1px solid ${isGradient ? '#fff' : 'var(--sg-primary)'}`,
                borderRadius: 'var(--sg-button-radius)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {secondaryButton.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function renderStats(block: any): React.ReactNode {
  const { title, subtitle, items = [] } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-md)',
        backgroundColor: 'var(--sg-surface)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <h2 style={{ fontSize: 'var(--sg-heading-h2)', marginBottom: '0.5rem' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'var(--sg-muted-text)', fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: '2rem', textAlign: 'center' }}>
          {items.map((item: any, index: number) => (
            <div key={index}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--sg-primary)' }}>
                {item.prefix}{item.value}{item.suffix}
              </div>
              <div style={{ color: 'var(--sg-muted-text)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function renderStatItem(block: any): React.ReactNode {
  const { value, label, prefix, suffix } = block.props
  
  return (
    <div key={block.id} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--sg-primary)' }}>
        {prefix}{value}{suffix}
      </div>
      <div style={{ color: 'var(--sg-muted-text)' }}>{label}</div>
    </div>
  )
}

function renderLogoCloud(block: any): React.ReactNode {
  const { title, logos = [], grayscale } = block.props
  
  return (
    <section
      key={block.id}
      style={{
        padding: 'var(--sg-section-padding-sm)',
        backgroundColor: 'var(--sg-bg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
        {title && (
          <p style={{ color: 'var(--sg-muted-text)', marginBottom: '2rem' }}>{title}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {logos.map((logo: any, index: number) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: '2rem',
                objectFit: 'contain',
                filter: grayscale ? 'grayscale(100%)' : undefined,
                opacity: grayscale ? 0.6 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function renderNavbar(block: any): React.ReactNode {
  const { logo, logoText, links = [], ctaButton, sticky, transparent, bg } = block.props
  
  // Detectar se bg é gradiente ou cor sólida
  const isGradient = bg && (bg.includes('gradient') || bg.includes('linear') || bg.includes('radial'))
  const backgroundStyle = bg 
    ? (isGradient ? { background: bg } : { backgroundColor: bg })
    : { backgroundColor: transparent ? 'transparent' : 'var(--sg-bg)' }
  
  return (
    <nav
      key={block.id}
      style={{
        padding: '1rem 0',
        ...backgroundStyle,
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 100 : undefined,
        borderBottom: transparent ? 'none' : '1px solid var(--sg-border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--sg-primary)' }}>
          {logo ? <img src={logo} alt={logoText || 'Logo'} style={{ height: '2rem' }} /> : logoText}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.href}
              style={{
                color: 'var(--sg-text)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {link.text}
            </a>
          ))}
          {ctaButton && (
            <a
              href={ctaButton.href || '#'}
              style={{
                padding: 'var(--sg-button-padding-md)',
                backgroundColor: 'var(--sg-primary)',
                color: 'var(--sg-primary-text)',
                borderRadius: 'var(--sg-button-radius)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {ctaButton.text}
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}

function renderForm(block: any, depth: number): React.ReactNode {
  const { action, method = 'post', children = [], submitText = 'Enviar' } = block.props
  
  return (
    <form
      key={block.id}
      action={action}
      method={method}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {children.map((child: any) => (
        <React.Fragment key={child.id}>{renderBlockNode(child, depth + 1)}</React.Fragment>
      ))}
      <button
        type="submit"
        style={{
          padding: 'var(--sg-button-padding-md)',
          backgroundColor: 'var(--sg-primary)',
          color: 'var(--sg-primary-text)',
          borderRadius: 'var(--sg-button-radius)',
          border: 'none',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {submitText}
      </button>
    </form>
  )
}

function renderInput(block: any): React.ReactNode {
  const { name, label, placeholder, type = 'text', required } = block.props
  
  return (
    <div key={block.id}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: 'var(--sg-input-padding)',
          borderRadius: 'var(--sg-input-radius)',
          border: 'var(--sg-input-border-width) solid var(--sg-input-border)',
          backgroundColor: 'var(--sg-input-bg)',
        }}
      />
    </div>
  )
}

function renderTextarea(block: any): React.ReactNode {
  const { name, label, placeholder, rows = 4, required } = block.props
  
  return (
    <div key={block.id}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        required={required}
        style={{
          width: '100%',
          padding: 'var(--sg-input-padding)',
          borderRadius: 'var(--sg-input-radius)',
          border: 'var(--sg-input-border-width) solid var(--sg-input-border)',
          backgroundColor: 'var(--sg-input-bg)',
          resize: 'vertical',
        }}
      />
    </div>
  )
}

function renderFormSelect(block: any): React.ReactNode {
  const { name, label, placeholder, options = [], required } = block.props
  
  return (
    <div key={block.id}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <select
        name={name}
        required={required}
        style={{
          width: '100%',
          padding: 'var(--sg-input-padding)',
          borderRadius: 'var(--sg-input-radius)',
          border: 'var(--sg-input-border-width) solid var(--sg-input-border)',
          backgroundColor: 'var(--sg-input-bg)',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option: any, index: number) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function renderSocialLinks(block: any): React.ReactNode {
  const { links = [], size = 'md', variant = 'default' } = block.props
  
  const sizeMap: Record<string, string> = {
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
  }
  
  // SVG paths for social icons
  const socialIcons: Record<string, string> = {
    facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
    instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
    linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    youtube: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z',
    github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
    tiktok: 'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5',
  }
  
  const iconSize = sizeMap[size] || sizeMap.md
  
  return (
    <div
      key={block.id}
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      {links.map((link: any, index: number) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: variant === 'filled' ? `calc(${iconSize} + 0.75rem)` : iconSize,
            height: variant === 'filled' ? `calc(${iconSize} + 0.75rem)` : iconSize,
            backgroundColor: variant === 'filled' ? 'var(--sg-surface)' : 'transparent',
            borderRadius: variant === 'filled' ? '50%' : undefined,
            color: 'var(--sg-muted-text)',
            textDecoration: 'none',
          }}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={socialIcons[link.platform] || socialIcons.github} />
          </svg>
        </a>
      ))}
    </div>
  )
}
