/**
 * Tipos compartilhados para o editor de sites
 */

// Sistema de Paleta de Cores
export interface ColorPalette {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  gradient: string[]
}

export interface SiteTheme {
  colorPalette: ColorPalette
  // Outras configurações de tema podem ser adicionadas aqui
}

// Sistema de Glow
export type GlowVariant = 'corners' | 'vignette' | 'aurora' | 'beams'

export interface GlowSettings {
  enabled: boolean
  variant: GlowVariant
  intensity: number // 0..1
}

export interface ComponentGlow {
  hero?: GlowSettings
  about?: GlowSettings
  gallery?: GlowSettings
  services?: GlowSettings
  testimonials?: GlowSettings
  contact?: GlowSettings
  footer?: GlowSettings
}

export interface Site {
  id: string
  projectId: string // 'ensino' ou 'portifolio'
  name: string
  slug: string
  pages: Page[]
  published: boolean
  publishedHtml?: string
  theme?: SiteTheme // Paleta de cores do site
  componentGlow?: ComponentGlow // Efeitos glow por seção
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  name: string
  slug: string
  components: Component[]
  metadata: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface Component {
  id: string
  type: ComponentType
  variant?: string // Ex: 'classic', 'spotlight', 'minimal'
  props: Record<string, any>
  styles: Record<string, any>
  children?: Component[]
  // Configurações específicas por tipo
  config?: Record<string, any>
}

export type ComponentType =
  | 'hero'
  | 'navbar'
  | 'about'
  | 'gallery'
  | 'services'
  | 'testimonials'
  | 'contact'
  | 'footer'
  | 'section'
  | 'container'
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'grid'
  | 'card'
  | 'spacer'
  | 'divider'
  | 'list'
  | 'form'
  | 'video'
  | 'map'

export interface ComponentDefinition {
  type: ComponentType
  name: string
  icon?: string
  category: 'layout' | 'content' | 'media' | 'form'
  defaultProps: Record<string, any>
  defaultStyles: Record<string, any>
  editableProps: string[]
  editableStyles: string[]
}

export interface Template {
  id: string
  name: string
  description: string
  category: 'landing' | 'portfolio' | 'blog' | 'business'
  thumbnail?: string
  pages: Page[]
}

export interface SiteEditorProps {
  projectId: string
  apiBaseUrl: string
  siteId?: string
  onSave?: (data: Site) => void | Promise<void>
  onPublish?: (data: Site) => void | Promise<void>
  initialData?: Site
  previewUrl?: (siteId: string) => string
}

export interface SiteViewerProps {
  siteId: string
  apiBaseUrl: string
  projectId: string
}
