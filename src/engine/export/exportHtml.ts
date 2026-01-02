/**
 * HTML Exporter
 * Exporta SiteDocumentV2 para HTML estático
 */

import { SiteDocumentV2, SitePage, Block } from '../schema/siteDocument'
import { generateThemeCSSVariables } from '../schema/themeTokens'
import { sanitizeHtml } from './sanitizeHtml'
import { hashDocument } from '../../utils/documentHash'

/**
 * Cache de HTML com limite LRU (Last Recently Used)
 * Limite de 50 entradas para evitar memory leak
 */
const htmlCache = new Map<string, { html: string; timestamp: number }>()
const MAX_CACHE_SIZE = 50

/**
 * Limpa entradas antigas do cache quando excede o limite
 */
function cleanCache() {
  if (htmlCache.size <= MAX_CACHE_SIZE) return

  // Ordenar por timestamp e remover os mais antigos
  const entries = Array.from(htmlCache.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp)

  const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE)
  toRemove.forEach(([key]) => htmlCache.delete(key))
}

/**
 * Renderiza um bloco diretamente para HTML (sem React)
 */
function blockToHtmlDirect(block: Block, depth: number = 0): string {
  const dataBlockId = `data-block-id="${escapeHtml(block.id)}"`
  
  switch (block.type) {
    case 'container': {
      const { maxWidth = '1200px', padding = '1rem', children = [] } = (block as any).props
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      return `<div ${dataBlockId} style="max-width: ${maxWidth}; padding: ${padding}; margin: 0 auto;">${childrenHtml}</div>`
    }
    case 'stack': {
      const {
        direction = 'col',
        gap = '1rem',
        align = 'stretch',
        justify = 'start',
        wrap = false,
        children = [],
      } = (block as any).props
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
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      return `<div ${dataBlockId} style="display: flex; flex-direction: ${flexDirection}; gap: ${gap}; align-items: ${alignItems}; justify-content: ${justifyContent}; flex-wrap: ${wrap ? 'wrap' : 'nowrap'};">${childrenHtml}</div>`
    }
    case 'grid': {
      const { cols = 3, gap = '1rem', children = [] } = (block as any).props
      const gridCols = typeof cols === 'number' ? cols : cols.lg || cols.md || cols.sm || 3
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      return `<div ${dataBlockId} style="display: grid; grid-template-columns: repeat(${gridCols}, 1fr); gap: ${gap};">${childrenHtml}</div>`
    }
    case 'box': {
      const { bg, border, radius, shadow, padding = '1rem', children = [] } = (block as any).props
      const style = [
        bg ? `background-color: ${bg}` : '',
        border ? `border: ${border}` : '',
        radius ? `border-radius: ${radius}` : '',
        shadow ? `box-shadow: ${shadow}` : '',
        padding ? `padding: ${padding}` : '',
      ]
        .filter(Boolean)
        .join('; ')
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      return `<div ${dataBlockId} style="${style}">${childrenHtml}</div>`
    }
    case 'heading': {
      const { level, text, align = 'left', color } = (block as any).props
      const style = [
        `text-align: ${align}`,
        color ? `color: ${color}` : 'color: var(--sg-text, #1f2937)',
      ]
        .filter(Boolean)
        .join('; ')
      return `<h${level} ${dataBlockId} style="${style}">${escapeHtml(text)}</h${level}>`
    }
    case 'text': {
      const { text, align = 'left', color, size = 'md' } = (block as any).props
      const fontSizeMap: Record<string, string> = {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
      }
      const style = [
        `text-align: ${align}`,
        color ? `color: ${color}` : 'color: var(--sg-text, #1f2937)',
        `font-size: ${fontSizeMap[size]}`,
      ]
        .filter(Boolean)
        .join('; ')
      return `<p ${dataBlockId} style="${style}">${escapeHtml(text)}</p>`
    }
    case 'image': {
      const { src, alt = '', width, height, objectFit = 'cover' } = (block as any).props
      const style = [
        width ? `width: ${width}` : 'width: 100%',
        height ? `height: ${height}` : 'height: auto',
        `object-fit: ${objectFit}`,
      ]
        .filter(Boolean)
        .join('; ')
      return `<img ${dataBlockId} src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="${style}" />`
    }
    case 'button': {
      const { text, href, variant = 'primary', size = 'md' } = (block as any).props
      const padding = size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.625rem 1.25rem'
      const fontSize = size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem'
      
      const variantStyles: Record<string, string> = {
        primary: 'background-color: var(--sg-primary, #3b82f6); color: var(--sg-primary-text, #ffffff);',
        secondary: 'background-color: var(--sg-secondary, #6b7280); color: #ffffff;',
        outline: 'background-color: transparent; color: var(--sg-primary, #3b82f6); border: 1px solid var(--sg-primary, #3b82f6);',
        ghost: 'background-color: transparent; color: var(--sg-primary, #3b82f6);',
      }
      
      const style = [
        `padding: ${padding}`,
        'border-radius: var(--sg-radius, 0.5rem)',
        'border: none',
        'cursor: pointer',
        `font-size: ${fontSize}`,
        'font-weight: 500',
        'transition: all 0.2s',
        variantStyles[variant],
      ]
        .filter(Boolean)
        .join('; ')
      
      if (href) {
        return `<a ${dataBlockId} href="${escapeHtml(href)}" style="${style}">${escapeHtml(text)}</a>`
      }
      return `<button ${dataBlockId} style="${style}">${escapeHtml(text)}</button>`
    }
    case 'link': {
      const { text, href, target = '_self' } = (block as any).props
      return `<a ${dataBlockId} href="${escapeHtml(href)}" target="${target}" style="color: var(--sg-primary, #3b82f6); text-decoration: underline;">${escapeHtml(text)}</a>`
    }
    case 'divider': {
      const { color = '#e5e7eb', thickness = '1px' } = (block as any).props
      return `<hr ${dataBlockId} style="border: none; border-top: ${thickness} solid ${color}; margin: 1rem 0;" />`
    }
    case 'card': {
      const { header = [], content = [], footer = [], padding = '1rem', bg, border, radius, shadow } = (block as any).props
      const style = [
        bg ? `background-color: ${bg}` : 'background-color: var(--sg-surface, #f9fafb)',
        border ? `border: ${border}` : 'border: 1px solid var(--sg-border, #e5e7eb)',
        radius ? `border-radius: ${radius}` : 'border-radius: var(--sg-radius, 0.5rem)',
        shadow ? `box-shadow: ${shadow}` : 'box-shadow: var(--sg-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        `padding: ${padding}`,
        'display: flex',
        'flex-direction: column',
        'gap: 0.5rem',
      ]
        .filter(Boolean)
        .join('; ')
      const headerHtml = header.length > 0 ? `<div>${header.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')}</div>` : ''
      const contentHtml = content.length > 0 ? `<div>${content.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')}</div>` : ''
      const footerHtml = footer.length > 0 ? `<div>${footer.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')}</div>` : ''
      return `<div ${dataBlockId} style="${style}">${headerHtml}${contentHtml}${footerHtml}</div>`
    }
    case 'section': {
      const { id, bg, padding = '2rem', children = [] } = (block as any).props
      const style = [
        bg ? `background-color: ${bg}` : 'background-color: var(--sg-bg, #ffffff)',
        `padding: ${padding}`,
      ]
        .filter(Boolean)
        .join('; ')
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      const idAttr = id ? `id="${escapeHtml(id)}"` : ''
      return `<section ${dataBlockId} ${idAttr} style="${style}">${childrenHtml}</section>`
    }
    
    // ========== NOVOS BLOCOS ==========
    
    case 'spacer': {
      const { height = '2rem' } = (block as any).props
      return `<div ${dataBlockId} style="height: ${height};"></div>`
    }
    
    case 'badge': {
      const { text, variant = 'default', size = 'md' } = (block as any).props
      const variantColors: Record<string, { bg: string; text: string }> = {
        default: { bg: 'var(--sg-surface2, #f3f4f6)', text: 'var(--sg-text, #1f2937)' },
        primary: { bg: 'var(--sg-primary, #3b82f6)', text: '#fff' },
        secondary: { bg: 'var(--sg-secondary, #6b7280)', text: '#fff' },
        success: { bg: 'var(--sg-success, #10b981)', text: '#fff' },
        warning: { bg: 'var(--sg-warning, #f59e0b)', text: '#fff' },
        danger: { bg: 'var(--sg-danger, #ef4444)', text: '#fff' },
      }
      const sizeStyles: Record<string, string> = {
        sm: 'padding: 0.125rem 0.5rem; font-size: 0.625rem;',
        md: 'padding: 0.25rem 0.75rem; font-size: 0.75rem;',
        lg: 'padding: 0.375rem 1rem; font-size: 0.875rem;',
      }
      const colors = variantColors[variant] || variantColors.default
      return `<span ${dataBlockId} style="display: inline-block; background-color: ${colors.bg}; color: ${colors.text}; border-radius: 9999px; font-weight: 500; ${sizeStyles[size] || sizeStyles.md}">${escapeHtml(text)}</span>`
    }
    
    case 'icon': {
      const { name: _iconName, size = 'md', color } = (block as any).props
      const sizeMap: Record<string, string> = { sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem' }
      const iconSize = sizeMap[size] || sizeMap.md
      return `<span ${dataBlockId} style="display: inline-flex; width: ${iconSize}; height: ${iconSize}; color: ${color || 'currentColor'};">[\u2605]</span>`
    }
    
    case 'avatar': {
      const { src, name, size = 'md' } = (block as any).props
      const sizeMap: Record<string, string> = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '4rem' }
      const avatarSize = sizeMap[size] || sizeMap.md
      const initials = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'
      if (src) {
        return `<img ${dataBlockId} src="${escapeHtml(src)}" alt="${escapeHtml(name || 'Avatar')}" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; object-fit: cover;" />`
      }
      return `<div ${dataBlockId} style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; background-color: var(--sg-primary, #3b82f6); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: calc(${avatarSize} / 2.5);">${initials}</div>`
    }
    
    case 'video': {
      const { src, poster, controls = true, aspectRatio = '16:9' } = (block as any).props
      const ratioMap: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%', '9:16': '177.78%' }
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
        return `<div ${dataBlockId} style="position: relative; padding-bottom: ${ratioMap[aspectRatio]}; height: 0; overflow: hidden;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>`
      }
      return `<video ${dataBlockId} src="${escapeHtml(src)}" ${poster ? `poster="${escapeHtml(poster)}"` : ''} ${controls ? 'controls' : ''} style="width: 100%; border-radius: var(--sg-radius, 0.5rem);"></video>`
    }
    
    case 'hero': {
      const { variant = 'centered', title, subtitle, description, primaryButton, secondaryButton, badge, align = 'center', minHeight = '80vh', image, overlay } = (block as any).props
      const isImageBg = variant === 'image-bg' && image
      const textColor = isImageBg && overlay ? '#fff' : 'var(--sg-text)'
      const mutedColor = isImageBg && overlay ? 'rgba(255,255,255,0.9)' : 'var(--sg-muted-text)'
      let bgStyle = 'background-color: var(--sg-bg, #fff);'
      if (isImageBg) {
        bgStyle = `background-image: url(${image}); background-size: cover; background-position: center;`
      }
      const overlayHtml = overlay && isImageBg ? `<div style="position: absolute; inset: 0; background-color: rgba(0,0,0,0.5);"></div>` : ''
      const badgeHtml = badge ? `<span style="display: inline-block; background-color: var(--sg-primary); color: #fff; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; margin-bottom: 1rem;">${escapeHtml(badge)}</span>` : ''
      const titleHtml = title ? `<h1 style="font-size: var(--sg-heading-h1, 3rem); font-weight: 700; margin-bottom: 1rem; color: ${textColor};">${escapeHtml(title)}</h1>` : ''
      const subtitleHtml = subtitle ? `<h2 style="font-size: var(--sg-heading-h3, 1.5rem); font-weight: 400; margin-bottom: 1rem; color: ${mutedColor};">${escapeHtml(subtitle)}</h2>` : ''
      const descHtml = description ? `<p style="font-size: 1.125rem; margin-bottom: 2rem; max-width: 600px; margin-left: ${align === 'center' ? 'auto' : '0'}; margin-right: ${align === 'center' ? 'auto' : '0'}; color: ${mutedColor};">${escapeHtml(description)}</p>` : ''
      const primaryBtnHtml = primaryButton ? `<a href="${primaryButton.href || '#'}" style="padding: 0.75rem 1.5rem; background-color: var(--sg-primary); color: var(--sg-primary-text, #fff); border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500;">${escapeHtml(primaryButton.text)}</a>` : ''
      const secondaryBtnHtml = secondaryButton ? `<a href="${secondaryButton.href || '#'}" style="padding: 0.75rem 1.5rem; background-color: transparent; color: ${isImageBg && overlay ? '#fff' : 'var(--sg-primary)'}; border: 1px solid ${isImageBg && overlay ? '#fff' : 'var(--sg-primary)'}; border-radius: var(--sg-button-radius, 0.5rem); text-decoration: none; font-weight: 500;">${escapeHtml(secondaryButton.text)}</a>` : ''
      const buttonsHtml = (primaryButton || secondaryButton) ? `<div style="display: flex; gap: 1rem; justify-content: ${align === 'center' ? 'center' : 'flex-start'};">${primaryBtnHtml}${secondaryBtnHtml}</div>` : ''
      return `<section ${dataBlockId} style="min-height: ${minHeight}; padding: 6rem 0; display: flex; align-items: center; justify-content: center; ${bgStyle} position: relative;">${overlayHtml}<div style="max-width: 1200px; padding: 0 1rem; text-align: ${align}; position: relative; z-index: 1;">${badgeHtml}${titleHtml}${subtitleHtml}${descHtml}${buttonsHtml}</div></section>`
    }
    
    case 'feature': {
      const { icon, title, description } = (block as any).props
      const iconHtml = icon ? `<div style="width: 3rem; height: 3rem; background-color: var(--sg-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #fff;">[★]</div>` : ''
      return `<div ${dataBlockId} style="padding: 1.5rem; text-align: center;">${iconHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3><p style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(description)}</p></div>`
    }
    
    case 'featureGrid': {
      const { title, subtitle, columns = 3, features = [] } = (block as any).props
      const headerHtml = (title || subtitle) ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ''}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ''}</div>` : ''
      const featuresHtml = features.map((f: any) => `<div style="background-color: var(--sg-bg); border-radius: 0.75rem; padding: 2rem; box-shadow: var(--sg-card-shadow);">${f.icon ? `<div style="width: 3rem; height: 3rem; background-color: var(--sg-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: #fff;">[★]</div>` : ''}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(f.title)}</h3><p style="color: var(--sg-muted-text);">${escapeHtml(f.description)}</p></div>`).join('')
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${featuresHtml}</div></div></section>`
    }
    
    case 'pricingCard': {
      const { name, price, period, description: desc, features = [], buttonText, highlighted, badge: pBadge } = (block as any).props
      const badgeHtml = pBadge ? `<span style="position: absolute; top: -0.75rem; right: 1rem; background-color: var(--sg-primary); color: #fff; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">${escapeHtml(pBadge)}</span>` : ''
      const featuresHtml = features.map((f: string) => `<li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--sg-success);">\u2713</span>${escapeHtml(f)}</li>`).join('')
      const buttonStyle = highlighted ? 'background-color: var(--sg-primary); color: var(--sg-primary-text); border: none;' : 'background-color: transparent; color: var(--sg-primary); border: 1px solid var(--sg-primary);'
      return `<div ${dataBlockId} style="background-color: var(--sg-bg); border-radius: 0.75rem; padding: 2rem; box-shadow: ${highlighted ? 'var(--sg-shadow-strong)' : 'var(--sg-card-shadow)'}; border: ${highlighted ? '2px solid var(--sg-primary)' : '1px solid var(--sg-border)'}; position: relative;">${badgeHtml}<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(name)}</h3>${desc ? `<p style="color: var(--sg-muted-text); margin-bottom: 1rem;">${escapeHtml(desc)}</p>` : ''}<div style="margin-bottom: 1.5rem;"><span style="font-size: 2.5rem; font-weight: 700;">${escapeHtml(price)}</span>${period ? `<span style="color: var(--sg-muted-text);">${escapeHtml(period)}</span>` : ''}</div><ul style="list-style: none; padding: 0; margin-bottom: 1.5rem;">${featuresHtml}</ul>${buttonText ? `<button style="width: 100%; padding: 0.625rem 1.25rem; ${buttonStyle} border-radius: var(--sg-button-radius); font-weight: 500; cursor: pointer;">${escapeHtml(buttonText)}</button>` : ''}</div>`
    }
    
    case 'pricing': {
      const { title, subtitle, plans = [] } = (block as any).props
      const headerHtml = (title || subtitle) ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ''}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ''}</div>` : ''
      const plansHtml = plans.map((p: any) => blockToHtmlDirect({ id: `${block.id}-plan`, type: 'pricingCard', props: p } as Block, depth + 1)).join('')
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${plans.length}, 1fr); gap: 2rem; align-items: start;">${plansHtml}</div></div></section>`
    }
    
    case 'testimonial': {
      const { quote, authorName, authorRole, authorCompany, authorAvatar, rating } = (block as any).props
      const ratingHtml = rating ? `<div style="margin-bottom: 1rem; color: #fbbf24;">${'\u2605'.repeat(rating)}</div>` : ''
      const avatarHtml = authorAvatar ? `<img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" style="width: 3rem; height: 3rem; border-radius: 50%; object-fit: cover;" />` : `<div style="width: 3rem; height: 3rem; border-radius: 50%; background-color: var(--sg-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">${authorName ? authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'}</div>`
      return `<div ${dataBlockId} style="background-color: var(--sg-surface); border-radius: var(--sg-card-radius); padding: 2rem;">${ratingHtml}<blockquote style="font-size: 1rem; margin-bottom: 1.5rem; font-style: italic;">"${escapeHtml(quote)}"</blockquote><div style="display: flex; align-items: center; gap: 1rem;">${avatarHtml}<div><div style="font-weight: 600;">${escapeHtml(authorName)}</div>${(authorRole || authorCompany) ? `<div style="color: var(--sg-muted-text); font-size: 0.875rem;">${escapeHtml(authorRole || '')}${authorRole && authorCompany ? ', ' : ''}${escapeHtml(authorCompany || '')}</div>` : ''}</div></div></div>`
    }
    
    case 'testimonialGrid': {
      const { title, subtitle, columns = 3, testimonials = [] } = (block as any).props
      const headerHtml = (title || subtitle) ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ''}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ''}</div>` : ''
      const testimonialsHtml = testimonials.map((t: any) => blockToHtmlDirect({ id: `${block.id}-t`, type: 'testimonial', props: t } as Block, depth + 1)).join('')
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;">${testimonialsHtml}</div></div></section>`
    }
    
    case 'faqItem': {
      const { question, answer } = (block as any).props
      return `<details ${dataBlockId} style="border-bottom: 1px solid var(--sg-border); padding: 1rem 0;"><summary style="font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">${escapeHtml(question)}<span>+</span></summary><p style="margin-top: 1rem; color: var(--sg-muted-text);">${escapeHtml(answer)}</p></details>`
    }
    
    case 'faq': {
      const { title, subtitle, items = [] } = (block as any).props
      const headerHtml = (title || subtitle) ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ''}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ''}</div>` : ''
      const itemsHtml = items.map((i: any) => blockToHtmlDirect({ id: `${block.id}-faq`, type: 'faqItem', props: i } as Block, depth + 1)).join('')
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-bg);"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div>${itemsHtml}</div></div></section>`
    }
    
    case 'cta': {
      const { title, description: ctaDesc, primaryButton, secondaryButton, variant = 'centered' } = (block as any).props
      const isGradient = variant === 'gradient'
      const bgStyle = isGradient ? 'background: linear-gradient(135deg, var(--sg-primary), var(--sg-accent));' : 'background-color: var(--sg-surface);'
      const textColor = isGradient ? '#fff' : 'var(--sg-text)'
      const mutedColor = isGradient ? 'rgba(255,255,255,0.9)' : 'var(--sg-muted-text)'
      const primaryBtnHtml = primaryButton ? `<a href="${primaryButton.href || '#'}" style="padding: 0.75rem 1.5rem; background-color: ${isGradient ? '#fff' : 'var(--sg-primary)'}; color: ${isGradient ? 'var(--sg-primary)' : 'var(--sg-primary-text)'}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500;">${escapeHtml(primaryButton.text)}</a>` : ''
      const secondaryBtnHtml = secondaryButton ? `<a href="${secondaryButton.href || '#'}" style="padding: 0.75rem 1.5rem; background-color: transparent; color: ${isGradient ? '#fff' : 'var(--sg-primary)'}; border: 1px solid ${isGradient ? '#fff' : 'var(--sg-primary)'}; border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500;">${escapeHtml(secondaryButton.text)}</a>` : ''
      return `<section ${dataBlockId} style="padding: 4rem 0; ${bgStyle} text-align: center;"><div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;"><h2 style="font-size: var(--sg-heading-h2); margin-bottom: 1rem; color: ${textColor};">${escapeHtml(title)}</h2>${ctaDesc ? `<p style="font-size: 1.125rem; margin-bottom: 2rem; color: ${mutedColor};">${escapeHtml(ctaDesc)}</p>` : ''}<div style="display: flex; gap: 1rem; justify-content: center;">${primaryBtnHtml}${secondaryBtnHtml}</div></div></section>`
    }
    
    case 'stats': {
      const { title, subtitle, items = [] } = (block as any).props
      const headerHtml = (title || subtitle) ? `<div style="text-align: center; margin-bottom: 3rem;">${title ? `<h2 style="font-size: var(--sg-heading-h2); margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>` : ''}${subtitle ? `<p style="color: var(--sg-muted-text); font-size: 1.125rem;">${escapeHtml(subtitle)}</p>` : ''}</div>` : ''
      const itemsHtml = items.map((i: any) => `<div style="text-align: center;"><div style="font-size: 3rem; font-weight: 700; color: var(--sg-primary);">${escapeHtml(i.prefix || '')}${escapeHtml(i.value)}${escapeHtml(i.suffix || '')}</div><div style="color: var(--sg-muted-text);">${escapeHtml(i.label)}</div></div>`).join('')
      return `<section ${dataBlockId} style="padding: 4rem 0; background-color: var(--sg-surface);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">${headerHtml}<div style="display: grid; grid-template-columns: repeat(${items.length}, 1fr); gap: 2rem; text-align: center;">${itemsHtml}</div></div></section>`
    }
    
    case 'statItem': {
      const { value, label, prefix, suffix } = (block as any).props
      return `<div ${dataBlockId} style="text-align: center;"><div style="font-size: 2.5rem; font-weight: 700; color: var(--sg-primary);">${escapeHtml(prefix || '')}${escapeHtml(value)}${escapeHtml(suffix || '')}</div><div style="color: var(--sg-muted-text);">${escapeHtml(label)}</div></div>`
    }
    
    case 'logoCloud': {
      const { title, logos = [], grayscale } = (block as any).props
      const titleHtml = title ? `<p style="color: var(--sg-muted-text); margin-bottom: 2rem;">${escapeHtml(title)}</p>` : ''
      const logosHtml = logos.map((l: any) => `<img src="${escapeHtml(l.src)}" alt="${escapeHtml(l.alt)}" style="height: 2rem; object-fit: contain; ${grayscale ? 'filter: grayscale(100%); opacity: 0.6;' : ''}" />`).join('')
      return `<section ${dataBlockId} style="padding: 2rem 0; background-color: var(--sg-bg);"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">${titleHtml}<div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap;">${logosHtml}</div></div></section>`
    }
    
    case 'navbar': {
      const { logo, logoText, links = [], ctaButton, sticky, transparent } = (block as any).props
      const logoHtml = logo ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(logoText || 'Logo')}" style="height: 2rem;" />` : `<span style="font-weight: 700; font-size: 1.25rem; color: var(--sg-primary);">${escapeHtml(logoText || '')}</span>`
      const linksHtml = links.map((l: any) => `<a href="${escapeHtml(l.href)}" style="color: var(--sg-text); text-decoration: none; font-weight: 500;">${escapeHtml(l.text)}</a>`).join('')
      const ctaBtnHtml = ctaButton ? `<a href="${ctaButton.href || '#'}" style="padding: 0.625rem 1.25rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius); text-decoration: none; font-weight: 500;">${escapeHtml(ctaButton.text)}</a>` : ''
      return `<nav ${dataBlockId} style="padding: 1rem 0; background-color: ${transparent ? 'transparent' : 'var(--sg-bg)'}; ${sticky ? 'position: sticky; top: 0; z-index: 100;' : ''} border-bottom: ${transparent ? 'none' : '1px solid var(--sg-border)'}"><div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center;"><div>${logoHtml}</div><div style="display: flex; align-items: center; gap: 2rem;">${linksHtml}${ctaBtnHtml}</div></div></nav>`
    }
    
    case 'form': {
      const { action, method = 'post', children = [], submitText = 'Enviar' } = (block as any).props
      const childrenHtml = children.map((c: Block) => blockToHtmlDirect(c, depth + 1)).join('')
      return `<form ${dataBlockId} action="${escapeHtml(action || '')}" method="${method}" style="display: flex; flex-direction: column; gap: 1rem;">${childrenHtml}<button type="submit" style="padding: 0.625rem 1.25rem; background-color: var(--sg-primary); color: var(--sg-primary-text); border-radius: var(--sg-button-radius); border: none; font-weight: 500; cursor: pointer;">${escapeHtml(submitText)}</button></form>`
    }
    
    case 'input': {
      const { name, label, placeholder, type = 'text', required } = (block as any).props
      const labelHtml = label ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>` : ''
      return `<div ${dataBlockId}>${labelHtml}<input name="${escapeHtml(name)}" type="${type}" placeholder="${escapeHtml(placeholder || '')}" ${required ? 'required' : ''} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);" /></div>`
    }
    
    case 'textarea': {
      const { name, label, placeholder, rows = 4, required } = (block as any).props
      const labelHtml = label ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>` : ''
      return `<div ${dataBlockId}>${labelHtml}<textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder || '')}" rows="${rows}" ${required ? 'required' : ''} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff); resize: vertical;"></textarea></div>`
    }
    
    case 'formSelect': {
      const { name, label, placeholder, options = [], required } = (block as any).props
      const labelHtml = label ? `<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${escapeHtml(label)}</label>` : ''
      const optionsHtml = (placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : '') + options.map((o: any) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('')
      return `<div ${dataBlockId}>${labelHtml}<select name="${escapeHtml(name)}" ${required ? 'required' : ''} style="width: 100%; padding: var(--sg-input-padding, 0.625rem 0.75rem); border-radius: var(--sg-input-radius, 0.375rem); border: 1px solid var(--sg-input-border, #d1d5db); background-color: var(--sg-input-bg, #fff);">${optionsHtml}</select></div>`
    }
    
    case 'socialLinks': {
      const { links = [], size = 'md', variant = 'default' } = (block as any).props
      const sizeMap: Record<string, string> = { sm: '1.25rem', md: '1.5rem', lg: '2rem' }
      const iconSize = sizeMap[size] || sizeMap.md
      const linksHtml = links.map((l: any) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; width: ${variant === 'filled' ? `calc(${iconSize} + 0.75rem)` : iconSize}; height: ${variant === 'filled' ? `calc(${iconSize} + 0.75rem)` : iconSize}; background-color: ${variant === 'filled' ? 'var(--sg-surface)' : 'transparent'}; border-radius: ${variant === 'filled' ? '50%' : '0'}; color: var(--sg-muted-text); text-decoration: none;">[${escapeHtml(l.platform)}]</a>`).join('')
      return `<div ${dataBlockId} style="display: flex; gap: 1rem; align-items: center;">${linksHtml}</div>`
    }
    
    default:
      console.warn(`[exportHtml] Unknown block type: ${(block as any).type}`)
      return `<div ${dataBlockId} style="padding: 1rem; background: #fee2e2; color: #dc2626; border-radius: 0.5rem;">Bloco desconhecido: ${escapeHtml((block as any).type)}</div>`
  }
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text: string): string {
  if (!text) return ''
  // Sempre usar fallback para evitar problemas com document
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Exporta uma página para HTML (com cache)
 */
export function exportPageToHtml(page: SitePage, document: SiteDocumentV2, useCache: boolean = true): string {
  // Gerar hash do documento para cache
  const docHash = hashDocument(document)
  const cacheKey = `${docHash}-${page.id}`

  // Verificar cache
  if (useCache && htmlCache.has(cacheKey)) {
    const cached = htmlCache.get(cacheKey)!
    // Atualizar timestamp (LRU)
    cached.timestamp = Date.now()
    return cached.html
  }

  // Gerar HTML
  const themeCSS = generateThemeCSSVariables(document.theme)
  const bodyHtml = page.structure.map((block) => blockToHtmlDirect(block)).join('')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.name)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: var(--sg-font-body, system-ui, -apple-system, sans-serif);
      line-height: 1.6;
      color: var(--sg-text, #1f2937);
    }
    ${themeCSS}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`

  // Armazenar no cache
  if (useCache) {
    htmlCache.set(cacheKey, { html, timestamp: Date.now() })
    cleanCache()
  }

  return html
}

/**
 * Exporta apenas um bloco para HTML (para atualização parcial)
 */
export function exportBlockToHtml(block: Block): string {
  return blockToHtmlDirect(block)
}

/**
 * Limpa o cache de HTML
 */
export function clearHtmlCache(): void {
  htmlCache.clear()
}

/**
 * Exporta documento completo para HTML (sanitizado)
 */
export function exportDocumentToHtml(document: SiteDocumentV2, pageId?: string): string {
  const page = pageId
    ? document.pages.find((p) => p.id === pageId)
    : document.pages[0]

  if (!page) {
    throw new Error('Page not found')
  }

  const html = exportPageToHtml(page, document)
  return sanitizeHtml(html)
}

/**
 * Gera manifest de assets (imagens, fontes, etc)
 */
export function generateAssetsManifest(document: SiteDocumentV2): Array<{ type: string; url: string }> {
  const assets: Array<{ type: string; url: string }> = []

  function extractAssetsFromBlock(block: Block) {
    if (block.type === 'image') {
      const src = (block as any).props.src
      if (src) {
        assets.push({ type: 'image', url: src })
      }
    }

    // Recursivamente extrair de children
    const children = (block as any).props?.children || []
    children.forEach(extractAssetsFromBlock)
  }

  document.pages.forEach((page) => {
    page.structure.forEach(extractAssetsFromBlock)
  })

  return assets
}
