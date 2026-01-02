import { Site, Component } from '../types'

/**
 * Exporta um site para HTML estático
 */
export function exportSiteToHtml(site: Site): string {
  const page = site.pages[0]
  if (!page) return ''

  let html = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n'
  html += `  <meta charset="UTF-8">\n`
  html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`
  html += `  <title>${page.metadata.title || site.name}</title>\n`
  
  if (page.metadata.description) {
    html += `  <meta name="description" content="${escapeHtml(page.metadata.description)}">\n`
  }
  
  if (page.metadata.ogImage) {
    html += `  <meta property="og:image" content="${escapeHtml(page.metadata.ogImage)}">\n`
  }

  html += `  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  </style>\n`
  html += '</head>\n<body>\n'

  page.components.forEach((component) => {
    html += renderComponent(component)
  })

  html += '</body>\n</html>'
  return html
}

function renderComponent(component: Component): string {
  const styles = buildStyles(component.styles)

  switch (component.type) {
    case 'hero':
      return `
  <section class="hero"${styles}>
    <div class="container">
      <h1>${escapeHtml(component.props.title || '')}</h1>
      <p>${escapeHtml(component.props.subtitle || '')}</p>
      ${component.props.buttonText ? `<a href="${escapeHtml(component.props.href || '#')}" class="button">${escapeHtml(component.props.buttonText)}</a>` : ''}
    </div>
  </section>
`

    case 'text':
      return `
  <div class="text"${styles}>
    <div class="container">
      <p>${escapeHtml(component.props.content || '')}</p>
    </div>
  </div>
`

    case 'heading':
      const level = component.props.level || 2
      return `
  <div class="heading"${styles}>
    <div class="container">
      <h${level}>${escapeHtml(component.props.text || '')}</h${level}>
    </div>
  </div>
`

    case 'button':
      return `
  <div class="button-wrapper"${styles}>
    <div class="container">
      <a href="${escapeHtml(component.props.href || '#')}" class="button">${escapeHtml(component.props.text || '')}</a>
    </div>
  </div>
`

    case 'spacer':
      const height = component.props.height || 40
      return `
  <div class="spacer" style="height: ${height}px;"></div>
`

    default:
      return ''
  }
}

function buildStyles(styles: Record<string, any>): string {
  if (!styles || Object.keys(styles).length === 0) return ''
  
  const styleString = Object.entries(styles)
    .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
    .join(' ')
  
  return styleString ? ` style="${escapeHtml(styleString)}"` : ''
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
