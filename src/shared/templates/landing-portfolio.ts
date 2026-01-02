/**
 * Template: Landing Page Portfolio
 * Ideal para: Freelancers, designers, desenvolvedores, profissionais criativos
 */

import type { SiteDocumentV2 } from '../schema'

export const landingPortfolioTemplate: SiteDocumentV2 = {
  meta: {
    title: 'Portfolio',
    description: 'Portfolio profissional - Design, desenvolvimento e soluções criativas',
    language: 'pt-BR',
  },
  theme: {
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontFamilyHeading: 'Space Grotesk, system-ui, sans-serif',
      baseFontSize: '16px',
      lineHeight: 1.6,
      headingLineHeight: 1.1,
    },
    spacing: {
      unit: '0.25rem',
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: '0.5rem',
      shadow: '0 1px 2px rgba(0,0,0,0.05)',
      shadowLg: '0 20px 60px rgba(15,23,42,0.15)',
      transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  structure: [
    {
      id: 'navbar-1',
      type: 'navbar',
      props: {
        logo: { src: '/logo.svg', alt: 'Logo', href: '/' },
        links: [
          { text: 'Sobre', href: '#about' },
          { text: 'Projetos', href: '#projects' },
          { text: 'Serviços', href: '#services' },
          { text: 'Contato', href: '#contact' },
        ],
        sticky: true,
        transparent: true,
      },
    },
    {
      id: 'hero-1',
      type: 'hero',
      props: {
        title: 'Olá, sou João Designer',
        subtitle: 'Designer & Desenvolvedor Front-end',
        description: 'Transformo ideias em experiências digitais memoráveis. Especializado em design de interfaces, desenvolvimento web e identidade visual.',
        image: 'https://placehold.co/400x400/0f172a/white?text=Foto',
        primaryButton: { text: 'Ver Projetos', href: '#projects' },
        secondaryButton: { text: 'Fale Comigo', href: '#contact' },
        variant: 'split',
        align: 'left',
      },
    },
    {
      id: 'stats-1',
      type: 'stats',
      props: {
        items: [
          { value: '8+', label: 'Anos de Experiência', description: '' },
          { value: '120+', label: 'Projetos Entregues', description: '' },
          { value: '50+', label: 'Clientes Satisfeitos', description: '' },
          { value: '15', label: 'Prêmios', description: '' },
        ],
      },
    },
    {
      id: 'featureGrid-1',
      type: 'featureGrid',
      props: {
        title: 'Serviços',
        subtitle: 'Soluções completas para seu projeto digital',
        columns: 3,
        features: [
          {
            icon: '🎨',
            title: 'UI/UX Design',
            description: 'Interfaces intuitivas e experiências de usuário que convertem',
          },
          {
            icon: '💻',
            title: 'Desenvolvimento Web',
            description: 'Sites e aplicações rápidos, responsivos e otimizados',
          },
          {
            icon: '✏️',
            title: 'Identidade Visual',
            description: 'Marcas memoráveis que comunicam sua essência',
          },
          {
            icon: '📱',
            title: 'Design Mobile',
            description: 'Apps que encantam usuários em qualquer dispositivo',
          },
          {
            icon: '🚀',
            title: 'Landing Pages',
            description: 'Páginas de alta conversão que geram resultados',
          },
          {
            icon: '🔧',
            title: 'Consultoria',
            description: 'Orientação estratégica para seu produto digital',
          },
        ],
      },
    },
    {
      id: 'section-projects',
      type: 'section',
      props: {
        bg: '#f8fafc',
        padding: '4rem 2rem',
        children: [
          {
            id: 'heading-projects',
            type: 'heading',
            props: {
              level: 2,
              text: 'Projetos em Destaque',
              align: 'center',
            },
          },
          {
            id: 'text-projects',
            type: 'text',
            props: {
              text: 'Uma seleção dos meus trabalhos mais recentes',
              align: 'center',
              color: '#64748b',
            },
          },
          {
            id: 'grid-projects',
            type: 'grid',
            props: {
              cols: 3,
              gap: '2rem',
              children: [
                {
                  id: 'card-project-1',
                  type: 'card',
                  props: {
                    header: [
                      {
                        id: 'img-project-1',
                        type: 'image',
                        props: {
                          src: 'https://placehold.co/400x300/6366f1/white?text=Projeto+1',
                          alt: 'Projeto 1',
                          width: '100%',
                          objectFit: 'cover',
                        },
                      },
                    ],
                    content: [
                      {
                        id: 'title-project-1',
                        type: 'heading',
                        props: { level: 4, text: 'E-commerce Premium' },
                      },
                      {
                        id: 'desc-project-1',
                        type: 'text',
                        props: { text: 'Redesign completo de loja virtual com aumento de 40% nas conversões', size: 'sm' },
                      },
                    ],
                  },
                },
                {
                  id: 'card-project-2',
                  type: 'card',
                  props: {
                    header: [
                      {
                        id: 'img-project-2',
                        type: 'image',
                        props: {
                          src: 'https://placehold.co/400x300/059669/white?text=Projeto+2',
                          alt: 'Projeto 2',
                          width: '100%',
                          objectFit: 'cover',
                        },
                      },
                    ],
                    content: [
                      {
                        id: 'title-project-2',
                        type: 'heading',
                        props: { level: 4, text: 'App Fintech' },
                      },
                      {
                        id: 'desc-project-2',
                        type: 'text',
                        props: { text: 'Design de aplicativo bancário com foco em simplicidade', size: 'sm' },
                      },
                    ],
                  },
                },
                {
                  id: 'card-project-3',
                  type: 'card',
                  props: {
                    header: [
                      {
                        id: 'img-project-3',
                        type: 'image',
                        props: {
                          src: 'https://placehold.co/400x300/f97316/white?text=Projeto+3',
                          alt: 'Projeto 3',
                          width: '100%',
                          objectFit: 'cover',
                        },
                      },
                    ],
                    content: [
                      {
                        id: 'title-project-3',
                        type: 'heading',
                        props: { level: 4, text: 'Brand Identity' },
                      },
                      {
                        id: 'desc-project-3',
                        type: 'text',
                        props: { text: 'Identidade visual completa para startup de tecnologia', size: 'sm' },
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
    {
      id: 'testimonialGrid-1',
      type: 'testimonialGrid',
      props: {
        title: 'O que dizem sobre meu trabalho',
        testimonials: [
          {
            quote: 'Profissional excepcional! Entregou além das expectativas e dentro do prazo. Recomendo fortemente.',
            author: 'Mariana Costa',
            role: 'CEO',
            company: 'TechStart',
            avatar: 'https://placehold.co/80x80/0f172a/white?text=MC',
          },
          {
            quote: 'O melhor designer que já trabalhei. Entende o negócio e traduz em soluções visuais incríveis.',
            author: 'Pedro Henrique',
            role: 'Product Manager',
            company: 'InnovateCo',
            avatar: 'https://placehold.co/80x80/475569/white?text=PH',
          },
          {
            quote: 'Transformou nossa presença digital. Os resultados falam por si - 3x mais leads qualificados.',
            author: 'Camila Torres',
            role: 'Marketing Director',
            company: 'GrowthHub',
            avatar: 'https://placehold.co/80x80/f97316/white?text=CT',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      props: {
        title: 'Vamos criar algo incrível juntos?',
        description: 'Entre em contato para discutirmos seu próximo projeto',
        buttonText: 'Iniciar Conversa',
        buttonHref: '#contact',
        variant: 'centered',
      },
    },
  ],
}

export default landingPortfolioTemplate
