/**
 * HTML Sanitization
 * Remove scripts, event handlers e outros elementos perigosos
 */

/**
 * Lista de tags permitidas
 */
const ALLOWED_TAGS = [
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'img',
  'button',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'main',
  'aside',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'br',
  'hr',
  'blockquote',
  'code',
  'pre',
  // Inline styles (hover effects, responsive CSS)
  'style',
  // SVG (social icons, wave decoration, hover overlays)
  'svg',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'g',
  // Form elements
  'form',
  'input',
  'textarea',
  'select',
  'option',
  'label',
]

/**
 * Lista de atributos permitidos
 */
const ALLOWED_ATTRIBUTES = [
  'id',
  'class',
  'style',
  'href',
  'src',
  'alt',
  'target',
  'rel',
  'width',
  'height',
  'type',
  'role',
  'aria-label',
  'aria-labelledby',
  'data-*',
  // SVG attributes
  'viewBox',
  'preserveAspectRatio',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'd',
  'opacity',
  'xmlns',
  'cx',
  'cy',
  'r',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  // Form attributes
  'name',
  'value',
  'placeholder',
  'required',
  'disabled',
  'for',
  'action',
  'method',
]

/**
 * Remove event handlers de atributos style
 */
function sanitizeStyle(style: string): string {
  // Remove javascript: e data: URLs perigosos
  return style.replace(/javascript:/gi, '').replace(/data:text\/html/gi, '')
}

/**
 * Sanitiza um atributo
 */
function sanitizeAttribute(name: string, value: string): string | null {
  // Bloquear event handlers
  if (name.startsWith('on')) {
    return null
  }

  // Sanitizar href/src
  if ((name === 'href' || name === 'src') && value) {
    // Permitir http, https, /, #, mailto, tel
    if (!/^(https?:\/\/|\/|#|mailto:|tel:)/.test(value)) {
      return '#'
    }
    // Bloquear javascript:
    if (value.toLowerCase().startsWith('javascript:')) {
      return '#'
    }
  }

  // Sanitizar style
  if (name === 'style') {
    return sanitizeStyle(value)
  }

  return value
}

/**
 * Sanitiza HTML removendo elementos perigosos
 */
export function sanitizeHtml(html: string): string {
  // Criar um parser temporário
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remover scripts
  const scripts = doc.querySelectorAll('script')
  scripts.forEach((script) => script.remove())

  // Remover event handlers de todos os elementos
  const allElements = doc.querySelectorAll('*')
  allElements.forEach((el) => {
    // Remover atributos que começam com 'on'
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })

    // Remover tags não permitidas
    if (!ALLOWED_TAGS.includes(el.tagName.toLowerCase())) {
      const parent = el.parentNode
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    }

    // Sanitizar atributos
    Array.from(el.attributes).forEach((attr) => {
      const isAllowed = ALLOWED_ATTRIBUTES.some((allowed) => {
        if (allowed.endsWith('*')) {
          return attr.name.startsWith(allowed.slice(0, -1))
        }
        return attr.name === allowed
      })

      if (!isAllowed) {
        el.removeAttribute(attr.name)
      } else {
        const sanitized = sanitizeAttribute(attr.name, attr.value)
        if (sanitized === null) {
          el.removeAttribute(attr.name)
        } else if (sanitized !== attr.value) {
          el.setAttribute(attr.name, sanitized)
        }
      }
    })
  })

  return doc.body.innerHTML
}

/**
 * Valida se uma URL é segura
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false
  return /^(https?:\/\/|\/|#|mailto:|tel:)/.test(url)
}
