/**
 * Landing Page Generator
 * Gera uma landing page completa do zero usando engine V2 (estilo Lovable)
 */

import { SiteDocumentV2, Block, SectionBlock } from '../schema/siteDocument'
import { ThemeTokens, defaultThemeTokens } from '../schema/themeTokens'
import { createReplacePatch } from '../patch/applyPatch'

/**
 * Gera uma landing page completa e profissional
 */
export function generateCompleteLandingPage(options: {
  name?: string
  title?: string
  subtitle?: string
  description?: string
  primaryColor?: string
  theme?: 'light' | 'dark' | 'modern' | 'corporate'
} = {}): SiteDocumentV2 {
  const {
    name = 'Landing Page',
    title = 'Bem-vindo à Nossa Solução',
    subtitle = 'Transforme sua escola com tecnologia de ponta',
    description = 'A solução completa para gestão escolar moderna',
    primaryColor = '#3b82f6',
    theme = 'modern',
  } = options

  // Criar tema baseado nas opções
  const themeTokens = generateThemeForLandingPage(primaryColor, theme)

  // Gerar blocos da landing page
  const structure: Block[] = [
    // Navbar
    generateNavbar(title),
    
    // Hero Section
    generateHeroSection(title, subtitle, description),
    
    // Features Section
    generateFeaturesSection(),
    
    // About Section
    generateAboutSection(),
    
    // Services/Products Section
    generateServicesSection(),
    
    // Testimonials Section
    generateTestimonialsSection(),
    
    // CTA Section
    generateCTASection(),
    
    // Footer
    generateFooter(),
  ]

  return {
    schemaVersion: 2,
    theme: themeTokens,
    pages: [
      {
        id: 'home',
        name: name,
        slug: 'home',
        structure,
      },
    ],
  }
}

/**
 * Gera tema personalizado para a landing page
 */
function generateThemeForLandingPage(primaryColor: string, theme: string): ThemeTokens {
  const baseTheme = { ...defaultThemeTokens }
  
  // Ajustar cores baseado no tema
  if (theme === 'dark') {
    baseTheme.colors.bg = '#0a0a0a'
    baseTheme.colors.surface = '#1a1a1a'
    baseTheme.colors.text = '#ffffff'
    baseTheme.colors.mutedText = '#a0a0a0'
  } else if (theme === 'corporate') {
    baseTheme.colors.bg = '#ffffff'
    baseTheme.colors.surface = '#f8f9fa'
    baseTheme.colors.text = '#212529'
    baseTheme.colors.mutedText = '#6c757d'
    baseTheme.radiusScale = 'sm'
    baseTheme.shadowScale = 'soft'
  } else {
    // modern (default)
    baseTheme.colors.bg = '#ffffff'
    baseTheme.colors.surface = '#f9fafb'
    baseTheme.colors.text = '#1f2937'
    baseTheme.colors.mutedText = '#6b7280'
    baseTheme.radiusScale = 'lg'
    baseTheme.shadowScale = 'md'
  }
  
  // Aplicar cor primária
  baseTheme.colors.primary = primaryColor
  baseTheme.colors.ring = primaryColor
  baseTheme.colors.accent = primaryColor
  
  return baseTheme
}

/**
 * Gera Navbar
 */
function generateNavbar(brandName: string): SectionBlock {
  return {
    id: 'navbar',
    type: 'section',
    props: {
      id: 'navbar',
      bg: 'var(--sg-bg)',
      padding: '1rem 0',
      children: [
        {
          id: 'navbar-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'navbar-content',
                type: 'stack',
                props: {
                  direction: 'row',
                  gap: '2rem',
                  align: 'center',
                  justify: 'space-between',
                  children: [
                    {
                      id: 'navbar-brand',
                      type: 'heading',
                      props: {
                        level: 3,
                        text: brandName,
                        color: 'var(--sg-primary)',
                      },
                    },
                    {
                      id: 'navbar-links',
                      type: 'stack',
                      props: {
                        direction: 'row',
                        gap: '1.5rem',
                        align: 'center',
                        children: [
                          {
                            id: 'nav-link-1',
                            type: 'button',
                            props: {
                              text: 'Início',
                              variant: 'ghost',
                              size: 'md',
                            },
                          },
                          {
                            id: 'nav-link-2',
                            type: 'button',
                            props: {
                              text: 'Sobre',
                              variant: 'ghost',
                              size: 'md',
                            },
                          },
                          {
                            id: 'nav-link-3',
                            type: 'button',
                            props: {
                              text: 'Serviços',
                              variant: 'ghost',
                              size: 'md',
                            },
                          },
                          {
                            id: 'nav-link-4',
                            type: 'button',
                            props: {
                              text: 'Contato',
                              variant: 'ghost',
                              size: 'md',
                            },
                          },
                          {
                            id: 'nav-cta',
                            type: 'button',
                            props: {
                              text: 'Começar Agora',
                              variant: 'primary',
                              size: 'md',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera Hero Section
 */
function generateHeroSection(title: string, subtitle: string, description: string): SectionBlock {
  return {
    id: 'hero',
    type: 'section',
    props: {
      id: 'hero',
      bg: 'var(--sg-bg)',
      padding: '4rem 0',
      children: [
        {
          id: 'hero-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'hero-content',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '2rem',
                  align: 'center',
                  justify: 'center',
                  children: [
                    {
                      id: 'hero-title',
                      type: 'heading',
                      props: {
                        level: 1,
                        text: title,
                        align: 'center',
                        color: 'var(--sg-text)',
                      },
                    },
                    {
                      id: 'hero-subtitle',
                      type: 'heading',
                      props: {
                        level: 2,
                        text: subtitle,
                        align: 'center',
                        color: 'var(--sg-muted-text)',
                      },
                    },
                    {
                      id: 'hero-description',
                      type: 'text',
                      props: {
                        text: description,
                        align: 'center',
                        size: 'lg',
                        color: 'var(--sg-muted-text)',
                      },
                    },
                    {
                      id: 'hero-cta',
                      type: 'stack',
                      props: {
                        direction: 'row',
                        gap: '1rem',
                        align: 'center',
                        justify: 'center',
                        children: [
                          {
                            id: 'hero-button-primary',
                            type: 'button',
                            props: {
                              text: 'Começar Agora',
                              variant: 'primary',
                              size: 'lg',
                            },
                          },
                          {
                            id: 'hero-button-secondary',
                            type: 'button',
                            props: {
                              text: 'Saber Mais',
                              variant: 'outline',
                              size: 'lg',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera Features Section
 */
function generateFeaturesSection(): SectionBlock {
  const features = [
    {
      id: 'feature-1',
      title: 'Gestão Completa',
      description: 'Gerencie todos os aspectos da sua escola em um só lugar',
    },
    {
      id: 'feature-2',
      title: 'Fácil de Usar',
      description: 'Interface intuitiva que qualquer pessoa pode usar',
    },
    {
      id: 'feature-3',
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia de ponta',
    },
  ]

  return {
    id: 'features',
    type: 'section',
    props: {
      id: 'features',
      bg: 'var(--sg-surface)',
      padding: '4rem 0',
      children: [
        {
          id: 'features-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'features-header',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '1rem',
                  align: 'center',
                  children: [
                    {
                      id: 'features-title',
                      type: 'heading',
                      props: {
                        level: 2,
                        text: 'Por Que Escolher Nossa Solução?',
                        align: 'center',
                      },
                    },
                    {
                      id: 'features-subtitle',
                      type: 'text',
                      props: {
                        text: 'Tudo que você precisa para transformar sua escola',
                        align: 'center',
                        size: 'lg',
                        color: 'var(--sg-muted-text)',
                      },
                    },
                  ],
                },
              },
              {
                id: 'features-divider',
                type: 'divider',
                props: {
                  color: 'var(--sg-border)',
                  thickness: '1px',
                },
              },
              {
                id: 'features-grid',
                type: 'grid',
                props: {
                  cols: 3,
                  gap: '2rem',
                  children: features.map((feature) => ({
                    id: feature.id,
                    type: 'box',
                    props: {
                      padding: '2rem',
                      bg: 'var(--sg-bg)',
                      radius: 'var(--sg-radius)',
                      shadow: 'var(--sg-shadow)',
                      children: [
                        {
                          id: `${feature.id}-content`,
                          type: 'stack',
                          props: {
                            direction: 'col',
                            gap: '1rem',
                            children: [
                              {
                                id: `${feature.id}-title`,
                                type: 'heading',
                                props: {
                                  level: 3,
                                  text: feature.title,
                                },
                              },
                              {
                                id: `${feature.id}-description`,
                                type: 'text',
                                props: {
                                  text: feature.description,
                                  size: 'md',
                                  color: 'var(--sg-muted-text)',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera About Section
 */
function generateAboutSection(): SectionBlock {
  return {
    id: 'about',
    type: 'section',
    props: {
      id: 'about',
      bg: 'var(--sg-bg)',
      padding: '4rem 0',
      children: [
        {
          id: 'about-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'about-content',
                type: 'stack',
                props: {
                  direction: 'row',
                  gap: '3rem',
                  align: 'center',
                  wrap: true,
                  children: [
                    {
                      id: 'about-text',
                      type: 'stack',
                      props: {
                        direction: 'col',
                        gap: '1.5rem',
                        children: [
                          {
                            id: 'about-title',
                            type: 'heading',
                            props: {
                              level: 2,
                              text: 'Sobre Nós',
                            },
                          },
                          {
                            id: 'about-description',
                            type: 'text',
                            props: {
                              text: 'Somos uma equipe apaixonada por educação e tecnologia. Nossa missão é ajudar escolas a alcançarem seu potencial máximo através de soluções inovadoras e fáceis de usar.',
                              size: 'md',
                            },
                          },
                          {
                            id: 'about-list',
                            type: 'stack',
                            props: {
                              direction: 'col',
                              gap: '0.5rem',
                              children: [
                                {
                                  id: 'about-item-1',
                                  type: 'text',
                                  props: {
                                    text: '✓ Mais de 1000 escolas confiam em nós',
                                    size: 'md',
                                  },
                                },
                                {
                                  id: 'about-item-2',
                                  type: 'text',
                                  props: {
                                    text: '✓ Suporte 24/7 para nossos clientes',
                                    size: 'md',
                                  },
                                },
                                {
                                  id: 'about-item-3',
                                  type: 'text',
                                  props: {
                                    text: '✓ Atualizações constantes e melhorias',
                                    size: 'md',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      id: 'about-image',
                      type: 'box',
                      props: {
                        padding: '0',
                        radius: 'var(--sg-radius)',
                        shadow: 'var(--sg-shadow)',
                        children: [
                          {
                            id: 'about-img',
                            type: 'image',
                            props: {
                              src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
                              alt: 'Equipe trabalhando',
                              width: '100%',
                              height: '400px',
                              objectFit: 'cover',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera Services Section
 */
function generateServicesSection(): SectionBlock {
  const services = [
    {
      id: 'service-1',
      title: 'Gestão Acadêmica',
      description: 'Controle completo de turmas, alunos e professores',
    },
    {
      id: 'service-2',
      title: 'Gestão Financeira',
      description: 'Organize receitas, despesas e mensalidades',
    },
    {
      id: 'service-3',
      title: 'Comunicação',
      description: 'Mantenha todos informados com notificações e avisos',
    },
    {
      id: 'service-4',
      title: 'Relatórios',
      description: 'Gere relatórios detalhados e insights valiosos',
    },
  ]

  return {
    id: 'services',
    type: 'section',
    props: {
      id: 'services',
      bg: 'var(--sg-surface)',
      padding: '4rem 0',
      children: [
        {
          id: 'services-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'services-header',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '1rem',
                  align: 'center',
                  children: [
                    {
                      id: 'services-title',
                      type: 'heading',
                      props: {
                        level: 2,
                        text: 'Nossos Serviços',
                        align: 'center',
                      },
                    },
                    {
                      id: 'services-subtitle',
                      type: 'text',
                      props: {
                        text: 'Tudo que você precisa em um só lugar',
                        align: 'center',
                        size: 'lg',
                        color: 'var(--sg-muted-text)',
                      },
                    },
                  ],
                },
              },
              {
                id: 'services-grid',
                type: 'grid',
                props: {
                  cols: 4,
                  gap: '2rem',
                  children: services.map((service) => ({
                    id: service.id,
                    type: 'box',
                    props: {
                      padding: '2rem',
                      bg: 'var(--sg-bg)',
                      radius: 'var(--sg-radius)',
                      shadow: 'var(--sg-shadow)',
                      children: [
                        {
                          id: `${service.id}-content`,
                          type: 'stack',
                          props: {
                            direction: 'col',
                            gap: '1rem',
                            children: [
                              {
                                id: `${service.id}-title`,
                                type: 'heading',
                                props: {
                                  level: 3,
                                  text: service.title,
                                },
                              },
                              {
                                id: `${service.id}-description`,
                                type: 'text',
                                props: {
                                  text: service.description,
                                  size: 'sm',
                                  color: 'var(--sg-muted-text)',
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera Testimonials Section
 */
function generateTestimonialsSection(): SectionBlock {
  const testimonials = [
    {
      id: 'testimonial-1',
      text: 'A melhor solução que já usamos! Transformou completamente nossa gestão escolar.',
      author: 'Maria Silva',
      role: 'Diretora',
    },
    {
      id: 'testimonial-2',
      text: 'Interface intuitiva e suporte excepcional. Recomendo para todas as escolas.',
      author: 'João Santos',
      role: 'Coordenador',
    },
    {
      id: 'testimonial-3',
      text: 'Economizamos horas de trabalho todos os dias. Vale cada centavo investido.',
      author: 'Ana Costa',
      role: 'Secretária',
    },
  ]

  return {
    id: 'testimonials',
    type: 'section',
    props: {
      id: 'testimonials',
      bg: 'var(--sg-bg)',
      padding: '4rem 0',
      children: [
        {
          id: 'testimonials-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'testimonials-header',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '1rem',
                  align: 'center',
                  children: [
                    {
                      id: 'testimonials-title',
                      type: 'heading',
                      props: {
                        level: 2,
                        text: 'O Que Nossos Clientes Dizem',
                        align: 'center',
                      },
                    },
                  ],
                },
              },
              {
                id: 'testimonials-grid',
                type: 'grid',
                props: {
                  cols: 3,
                  gap: '2rem',
                  children: testimonials.map((testimonial) => ({
                    id: testimonial.id,
                    type: 'box',
                    props: {
                      padding: '2rem',
                      bg: 'var(--sg-surface)',
                      radius: 'var(--sg-radius)',
                      shadow: 'var(--sg-shadow)',
                      children: [
                        {
                          id: `${testimonial.id}-content`,
                          type: 'stack',
                          props: {
                            direction: 'col',
                            gap: '1rem',
                            children: [
                              {
                                id: `${testimonial.id}-text`,
                                type: 'text',
                                props: {
                                  text: `"${testimonial.text}"`,
                                  size: 'md',
                                  color: 'var(--sg-text)',
                                },
                              },
                              {
                                id: `${testimonial.id}-divider`,
                                type: 'divider',
                                props: {
                                  color: 'var(--sg-border)',
                                  thickness: '1px',
                                },
                              },
                              {
                                id: `${testimonial.id}-author`,
                                type: 'stack',
                                props: {
                                  direction: 'col',
                                  gap: '0.25rem',
                                  children: [
                                    {
                                      id: `${testimonial.id}-author-name`,
                                      type: 'text',
                                      props: {
                                        text: testimonial.author,
                                        size: 'sm',
                                        color: 'var(--sg-text)',
                                      },
                                    },
                                    {
                                      id: `${testimonial.id}-author-role`,
                                      type: 'text',
                                      props: {
                                        text: testimonial.role,
                                        size: 'sm',
                                        color: 'var(--sg-muted-text)',
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera CTA Section
 */
function generateCTASection(): SectionBlock {
  return {
    id: 'cta',
    type: 'section',
    props: {
      id: 'cta',
      bg: 'var(--sg-primary)',
      padding: '4rem 0',
      children: [
        {
          id: 'cta-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'cta-content',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '2rem',
                  align: 'center',
                  justify: 'center',
                  children: [
                    {
                      id: 'cta-title',
                      type: 'heading',
                      props: {
                        level: 2,
                        text: 'Pronto para Transformar Sua Escola?',
                        align: 'center',
                        color: '#ffffff',
                      },
                    },
                    {
                      id: 'cta-description',
                      type: 'text',
                      props: {
                        text: 'Comece hoje mesmo e veja a diferença em sua gestão escolar',
                        align: 'center',
                        size: 'lg',
                        color: 'rgba(255, 255, 255, 0.9)',
                      },
                    },
                    {
                      id: 'cta-button',
                      type: 'button',
                      props: {
                        text: 'Começar Agora - Grátis',
                        variant: 'secondary',
                        size: 'lg',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera Footer
 */
function generateFooter(): SectionBlock {
  return {
    id: 'footer',
    type: 'section',
    props: {
      id: 'footer',
      bg: 'var(--sg-surface)',
      padding: '3rem 0 1rem',
      children: [
        {
          id: 'footer-container',
          type: 'container',
          props: {
            maxWidth: '1200px',
            padding: '0 1rem',
            children: [
              {
                id: 'footer-content',
                type: 'stack',
                props: {
                  direction: 'col',
                  gap: '2rem',
                  children: [
                    {
                      id: 'footer-main',
                      type: 'grid',
                      props: {
                        cols: 4,
                        gap: '2rem',
                        children: [
                          {
                            id: 'footer-col-1',
                            type: 'stack',
                            props: {
                              direction: 'col',
                              gap: '1rem',
                              children: [
                                {
                                  id: 'footer-brand',
                                  type: 'heading',
                                  props: {
                                    level: 4,
                                    text: 'SmartGesti',
                                  },
                                },
                                {
                                  id: 'footer-description',
                                  type: 'text',
                                  props: {
                                    text: 'A solução completa para gestão escolar moderna.',
                                    size: 'sm',
                                    color: 'var(--sg-muted-text)',
                                  },
                                },
                              ],
                            },
                          },
                          {
                            id: 'footer-col-2',
                            type: 'stack',
                            props: {
                              direction: 'col',
                              gap: '1rem',
                              children: [
                                {
                                  id: 'footer-col-2-title',
                                  type: 'heading',
                                  props: {
                                    level: 5,
                                    text: 'Produto',
                                  },
                                },
                                {
                                  id: 'footer-link-1',
                                  type: 'button',
                                  props: {
                                    text: 'Recursos',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                                {
                                  id: 'footer-link-2',
                                  type: 'button',
                                  props: {
                                    text: 'Preços',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                              ],
                            },
                          },
                          {
                            id: 'footer-col-3',
                            type: 'stack',
                            props: {
                              direction: 'col',
                              gap: '1rem',
                              children: [
                                {
                                  id: 'footer-col-3-title',
                                  type: 'heading',
                                  props: {
                                    level: 5,
                                    text: 'Empresa',
                                  },
                                },
                                {
                                  id: 'footer-link-3',
                                  type: 'button',
                                  props: {
                                    text: 'Sobre',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                                {
                                  id: 'footer-link-4',
                                  type: 'button',
                                  props: {
                                    text: 'Contato',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                              ],
                            },
                          },
                          {
                            id: 'footer-col-4',
                            type: 'stack',
                            props: {
                              direction: 'col',
                              gap: '1rem',
                              children: [
                                {
                                  id: 'footer-col-4-title',
                                  type: 'heading',
                                  props: {
                                    level: 5,
                                    text: 'Suporte',
                                  },
                                },
                                {
                                  id: 'footer-link-5',
                                  type: 'button',
                                  props: {
                                    text: 'Documentação',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                                {
                                  id: 'footer-link-6',
                                  type: 'button',
                                  props: {
                                    text: 'Ajuda',
                                    variant: 'ghost',
                                    size: 'sm',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      id: 'footer-divider',
                      type: 'divider',
                      props: {
                        color: 'var(--sg-border)',
                        thickness: '1px',
                      },
                    },
                    {
                      id: 'footer-bottom',
                      type: 'stack',
                      props: {
                        direction: 'row',
                        gap: '1rem',
                        align: 'center',
                        justify: 'space-between',
                        wrap: true,
                        children: [
                          {
                            id: 'footer-copyright',
                            type: 'text',
                            props: {
                              text: `© ${new Date().getFullYear()} SmartGesti. Todos os direitos reservados.`,
                              size: 'sm',
                              color: 'var(--sg-muted-text)',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/**
 * Gera patches para aplicar mudanças (simulando IA)
 */
export function generatePatchesForLandingPage(_document: SiteDocumentV2, changes: {
  title?: string
  subtitle?: string
  primaryColor?: string
}): any[] {
  const patches: any[] = []

  if (changes.title) {
    patches.push(...createReplacePatch('/pages/0/structure/1/props/children/0/props/children/0/props/children/0/props/text', changes.title))
  }

  if (changes.subtitle) {
    patches.push(...createReplacePatch('/pages/0/structure/1/props/children/0/props/children/0/props/children/1/props/text', changes.subtitle))
  }

  if (changes.primaryColor) {
    patches.push(...createReplacePatch('/theme/colors/primary', changes.primaryColor))
    patches.push(...createReplacePatch('/theme/colors/ring', changes.primaryColor))
    patches.push(...createReplacePatch('/theme/colors/accent', changes.primaryColor))
  }

  return patches
}

// ============================================================================
// NOVO GERADOR COM BLOCOS COMPOSTOS
// ============================================================================

/**
 * Gera uma landing page moderna usando os novos blocos compostos
 * Similar ao Lovable - mais simples e poderoso
 */
export function generateModernLandingPage(options: {
  name?: string
  business?: {
    name: string
    tagline: string
    description: string
  }
  primaryColor?: string
  theme?: 'light' | 'dark' | 'gradient' | 'corporate'
} = {}): SiteDocumentV2 {
  const {
    name = 'Landing Page Moderna',
    business = {
      name: 'SuaEmpresa',
      tagline: 'A solução que você precisa',
      description: 'Transforme seu negócio com nossa plataforma intuitiva e poderosa',
    },
    primaryColor = '#3b82f6',
    theme = 'light',
  } = options

  const themeTokens = generateThemeForLandingPage(primaryColor, theme)

  const structure: Block[] = [
    // Navbar usando bloco composto
    {
      id: 'navbar-block',
      type: 'navbar',
      props: {
        logoText: business.name,
        sticky: true,
        links: [
          { text: 'Recursos', href: '#features' },
          { text: 'Preços', href: '#pricing' },
          { text: 'Depoimentos', href: '#testimonials' },
          { text: 'FAQ', href: '#faq' },
        ],
        ctaButton: { text: 'Começar Agora', href: '#cta' },
      },
    } as Block,

    // Hero usando bloco composto
    {
      id: 'hero-block',
      type: 'hero',
      props: {
        variant: 'centered',
        badge: '🚀 Novo',
        title: business.tagline,
        subtitle: 'A plataforma #1 do mercado',
        description: business.description,
        primaryButton: { text: 'Começar Grátis', href: '#signup' },
        secondaryButton: { text: 'Ver Demo', href: '#demo' },
        minHeight: '90vh',
        align: 'center',
      },
    } as Block,

    // Logo Cloud
    {
      id: 'logocloud-block',
      type: 'logoCloud',
      props: {
        title: 'Confiado por mais de 1000 empresas',
        grayscale: true,
        logos: [
          { src: 'https://placehold.co/120x40?text=Empresa1', alt: 'Empresa 1' },
          { src: 'https://placehold.co/120x40?text=Empresa2', alt: 'Empresa 2' },
          { src: 'https://placehold.co/120x40?text=Empresa3', alt: 'Empresa 3' },
          { src: 'https://placehold.co/120x40?text=Empresa4', alt: 'Empresa 4' },
          { src: 'https://placehold.co/120x40?text=Empresa5', alt: 'Empresa 5' },
        ],
      },
    } as Block,

    // Feature Grid usando bloco composto
    {
      id: 'features-block',
      type: 'featureGrid',
      props: {
        title: 'Tudo que você precisa',
        subtitle: 'Recursos poderosos para transformar seu negócio',
        columns: 3,
        features: [
          {
            icon: 'zap',
            title: 'Rápido e Eficiente',
            description: 'Otimize seus processos e economize tempo valioso todos os dias',
          },
          {
            icon: 'shield',
            title: 'Seguro e Confiável',
            description: 'Seus dados protegidos com criptografia de ponta a ponta',
          },
          {
            icon: 'rocket',
            title: 'Escalável',
            description: 'Cresça sem limites - nossa plataforma escala com você',
          },
          {
            icon: 'globe',
            title: 'Acesso Global',
            description: 'Acesse de qualquer lugar, a qualquer momento',
          },
          {
            icon: 'users',
            title: 'Colaborativo',
            description: 'Trabalhe em equipe de forma simples e integrada',
          },
          {
            icon: 'bar-chart',
            title: 'Analytics',
            description: 'Insights poderosos para tomar melhores decisões',
          },
        ],
      },
    } as Block,

    // Stats
    {
      id: 'stats-block',
      type: 'stats',
      props: {
        title: 'Números que falam',
        items: [
          { value: '10K', suffix: '+', label: 'Usuários Ativos' },
          { value: '99.9', suffix: '%', label: 'Uptime' },
          { value: '50', suffix: 'M', label: 'Transações/dia' },
          { value: '4.9', suffix: '★', label: 'Avaliação Média' },
        ],
      },
    } as Block,

    // Pricing usando bloco composto
    {
      id: 'pricing-block',
      type: 'pricing',
      props: {
        title: 'Planos e Preços',
        subtitle: 'Escolha o plano ideal para você',
        plans: [
          {
            name: 'Starter',
            price: 'R$ 49',
            period: '/mês',
            description: 'Ideal para pequenos negócios',
            features: [
              'Até 5 usuários',
              '10GB de armazenamento',
              'Suporte por email',
              'Relatórios básicos',
            ],
            buttonText: 'Começar Agora',
          },
          {
            name: 'Pro',
            price: 'R$ 99',
            period: '/mês',
            description: 'Para empresas em crescimento',
            features: [
              'Até 25 usuários',
              '100GB de armazenamento',
              'Suporte prioritário',
              'Analytics avançado',
              'API access',
            ],
            buttonText: 'Começar Agora',
            highlighted: true,
            badge: 'Mais Popular',
          },
          {
            name: 'Enterprise',
            price: 'Sob Consulta',
            description: 'Para grandes organizações',
            features: [
              'Usuários ilimitados',
              'Armazenamento ilimitado',
              'Suporte 24/7',
              'SLA garantido',
              'Deploy dedicado',
              'Customizações',
            ],
            buttonText: 'Falar com Vendas',
          },
        ],
      },
    } as Block,

    // Testimonials usando bloco composto
    {
      id: 'testimonials-block',
      type: 'testimonialGrid',
      props: {
        title: 'O que nossos clientes dizem',
        subtitle: 'Histórias de sucesso reais',
        columns: 3,
        testimonials: [
          {
            quote: 'A melhor decisão que tomamos foi adotar essa plataforma. Triplicamos nossa produtividade!',
            authorName: 'Maria Silva',
            authorRole: 'CEO',
            authorCompany: 'TechCorp',
            rating: 5,
          },
          {
            quote: 'Interface intuitiva e suporte excepcional. Recomendo para qualquer empresa.',
            authorName: 'João Santos',
            authorRole: 'CTO',
            authorCompany: 'StartupXYZ',
            rating: 5,
          },
          {
            quote: 'Economizamos mais de 40 horas por semana em processos manuais.',
            authorName: 'Ana Costa',
            authorRole: 'COO',
            authorCompany: 'InnovateBR',
            rating: 5,
          },
        ],
      },
    } as Block,

    // FAQ usando bloco composto
    {
      id: 'faq-block',
      type: 'faq',
      props: {
        title: 'Perguntas Frequentes',
        subtitle: 'Tudo que você precisa saber',
        items: [
          {
            question: 'Como funciona o período de teste?',
            answer: 'Você tem 14 dias gratuitos para testar todas as funcionalidades, sem precisar de cartão de crédito.',
          },
          {
            question: 'Posso cancelar a qualquer momento?',
            answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou complicações.',
          },
          {
            question: 'Como funciona o suporte?',
            answer: 'Oferecemos suporte por email para todos os planos, e suporte prioritário 24/7 para planos Pro e Enterprise.',
          },
          {
            question: 'Meus dados estão seguros?',
            answer: 'Sim! Utilizamos criptografia de ponta a ponta e somos certificados ISO 27001.',
          },
          {
            question: 'Há limite de usuários?',
            answer: 'Depende do plano escolhido. O plano Enterprise oferece usuários ilimitados.',
          },
        ],
      },
    } as Block,

    // CTA usando bloco composto
    {
      id: 'cta-block',
      type: 'cta',
      props: {
        variant: 'gradient',
        title: 'Pronto para começar?',
        description: 'Junte-se a milhares de empresas que já transformaram seus negócios',
        primaryButton: { text: 'Criar Conta Grátis', href: '#signup' },
        secondaryButton: { text: 'Agendar Demo', href: '#demo' },
      },
    } as Block,

    // Footer
    generateFooter(),
  ]

  return {
    schemaVersion: 2,
    theme: themeTokens,
    pages: [
      {
        id: 'home',
        name: name,
        slug: 'home',
        structure,
      },
    ],
  }
}
