/**
 * Template: Landing Page Evento
 * Ideal para: Conferências, workshops, webinars, eventos presenciais e online
 */

import type { SiteDocumentV2 } from '../schema'

export const landingEventoTemplate: SiteDocumentV2 = {
  meta: {
    title: 'Evento Tech Summit 2024',
    description: 'O maior evento de tecnologia do Brasil. Palestras, networking e muito conteúdo exclusivo.',
    language: 'pt-BR',
  },
  theme: {
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#fbbf24',
      background: '#0f0a1e',
      surface: '#1a1333',
      text: '#f8fafc',
      textMuted: '#a1a1aa',
      border: '#3f3f46',
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
      borderRadius: '0.75rem',
      shadow: '0 4px 20px rgba(124,58,237,0.2)',
      shadowLg: '0 20px 60px rgba(124,58,237,0.3)',
      transition: '0.3s ease',
    },
  },
  structure: [
    {
      id: 'navbar-1',
      type: 'navbar',
      props: {
        logo: { src: '/logo.svg', alt: 'Tech Summit', href: '/' },
        links: [
          { text: 'Sobre', href: '#about' },
          { text: 'Palestrantes', href: '#speakers' },
          { text: 'Programação', href: '#schedule' },
          { text: 'Ingressos', href: '#tickets' },
        ],
        sticky: true,
        transparent: true,
      },
    },
    {
      id: 'hero-1',
      type: 'hero',
      props: {
        title: 'Tech Summit 2024',
        subtitle: '15 e 16 de Março • São Paulo',
        description: 'Dois dias de imersão com os maiores nomes da tecnologia. Palestras inspiradoras, workshops práticos e networking de alto nível.',
        image: 'https://placehold.co/600x400/7c3aed/white?text=Tech+Summit',
        primaryButton: { text: 'Garantir Ingresso', href: '#tickets' },
        secondaryButton: { text: 'Ver Programação', href: '#schedule' },
        variant: 'centered',
        align: 'center',
      },
    },
    {
      id: 'stats-1',
      type: 'stats',
      props: {
        items: [
          { value: '2.000+', label: 'Participantes', description: 'esperados' },
          { value: '30+', label: 'Palestrantes', description: 'confirmados' },
          { value: '50+', label: 'Horas', description: 'de conteúdo' },
          { value: '3', label: 'Trilhas', description: 'temáticas' },
        ],
      },
    },
    {
      id: 'featureGrid-1',
      type: 'featureGrid',
      props: {
        title: 'O que você vai encontrar',
        subtitle: 'Uma experiência completa para profissionais de tecnologia',
        columns: 3,
        features: [
          {
            icon: '🎤',
            title: 'Palestras Keynote',
            description: 'Insights de líderes da indústria sobre tendências e inovação',
          },
          {
            icon: '💡',
            title: 'Workshops Práticos',
            description: 'Sessões hands-on para aprender novas tecnologias',
          },
          {
            icon: '🤝',
            title: 'Networking Premium',
            description: 'Conecte-se com profissionais e empresas do setor',
          },
          {
            icon: '🎯',
            title: 'Cases de Sucesso',
            description: 'Aprenda com quem já implementou soluções reais',
          },
          {
            icon: '🏆',
            title: 'Startup Competition',
            description: 'Pitch de startups inovadoras com premiação',
          },
          {
            icon: '🎁',
            title: 'Brindes Exclusivos',
            description: 'Kit participante e sorteios durante o evento',
          },
        ],
      },
    },
    {
      id: 'section-speakers',
      type: 'section',
      props: {
        bg: '#1a1333',
        padding: '4rem 2rem',
        children: [
          {
            id: 'heading-speakers',
            type: 'heading',
            props: {
              level: 2,
              text: 'Palestrantes Confirmados',
              align: 'center',
              color: '#f8fafc',
            },
          },
          {
            id: 'text-speakers',
            type: 'text',
            props: {
              text: 'Aprenda com os melhores profissionais do mercado',
              align: 'center',
              color: '#a1a1aa',
            },
          },
          {
            id: 'grid-speakers',
            type: 'grid',
            props: {
              cols: 4,
              gap: '2rem',
              children: [
                {
                  id: 'speaker-1',
                  type: 'stack',
                  props: {
                    direction: 'col',
                    align: 'center',
                    gap: '1rem',
                    children: [
                      {
                        id: 'avatar-speaker-1',
                        type: 'avatar',
                        props: {
                          src: 'https://placehold.co/120x120/7c3aed/white?text=AL',
                          name: 'Ana Lima',
                          size: 'xl',
                        },
                      },
                      {
                        id: 'name-speaker-1',
                        type: 'heading',
                        props: { level: 4, text: 'Ana Lima', align: 'center', color: '#f8fafc' },
                      },
                      {
                        id: 'role-speaker-1',
                        type: 'text',
                        props: { text: 'CTO @ BigTech', align: 'center', color: '#a1a1aa', size: 'sm' },
                      },
                    ],
                  },
                },
                {
                  id: 'speaker-2',
                  type: 'stack',
                  props: {
                    direction: 'col',
                    align: 'center',
                    gap: '1rem',
                    children: [
                      {
                        id: 'avatar-speaker-2',
                        type: 'avatar',
                        props: {
                          src: 'https://placehold.co/120x120/a855f7/white?text=PM',
                          name: 'Pedro Mendes',
                          size: 'xl',
                        },
                      },
                      {
                        id: 'name-speaker-2',
                        type: 'heading',
                        props: { level: 4, text: 'Pedro Mendes', align: 'center', color: '#f8fafc' },
                      },
                      {
                        id: 'role-speaker-2',
                        type: 'text',
                        props: { text: 'VP Engineering @ StartupY', align: 'center', color: '#a1a1aa', size: 'sm' },
                      },
                    ],
                  },
                },
                {
                  id: 'speaker-3',
                  type: 'stack',
                  props: {
                    direction: 'col',
                    align: 'center',
                    gap: '1rem',
                    children: [
                      {
                        id: 'avatar-speaker-3',
                        type: 'avatar',
                        props: {
                          src: 'https://placehold.co/120x120/fbbf24/1a1333?text=MC',
                          name: 'Marina Costa',
                          size: 'xl',
                        },
                      },
                      {
                        id: 'name-speaker-3',
                        type: 'heading',
                        props: { level: 4, text: 'Marina Costa', align: 'center', color: '#f8fafc' },
                      },
                      {
                        id: 'role-speaker-3',
                        type: 'text',
                        props: { text: 'AI Lead @ ResearchLab', align: 'center', color: '#a1a1aa', size: 'sm' },
                      },
                    ],
                  },
                },
                {
                  id: 'speaker-4',
                  type: 'stack',
                  props: {
                    direction: 'col',
                    align: 'center',
                    gap: '1rem',
                    children: [
                      {
                        id: 'avatar-speaker-4',
                        type: 'avatar',
                        props: {
                          src: 'https://placehold.co/120x120/22c55e/white?text=RS',
                          name: 'Ricardo Santos',
                          size: 'xl',
                        },
                      },
                      {
                        id: 'name-speaker-4',
                        type: 'heading',
                        props: { level: 4, text: 'Ricardo Santos', align: 'center', color: '#f8fafc' },
                      },
                      {
                        id: 'role-speaker-4',
                        type: 'text',
                        props: { text: 'Founder @ CloudScale', align: 'center', color: '#a1a1aa', size: 'sm' },
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
      id: 'pricing-1',
      type: 'pricing',
      props: {
        title: 'Ingressos',
        subtitle: 'Escolha a experiência ideal para você',
        plans: [
          {
            name: 'Individual',
            price: 'R$ 297',
            period: '',
            description: 'Acesso básico',
            features: ['Acesso às palestras', 'Coffee break incluso', 'Certificado digital', 'Acesso à área de exposição'],
            buttonText: 'Comprar',
            highlighted: false,
          },
          {
            name: 'VIP',
            price: 'R$ 597',
            period: '',
            description: 'Experiência completa',
            features: ['Tudo do Individual', 'Acesso aos workshops', 'Networking exclusivo', 'Almoço incluso', 'Área VIP', 'Gravações das palestras'],
            buttonText: 'Comprar',
            highlighted: true,
          },
          {
            name: 'Corporativo',
            price: 'R$ 2.497',
            period: '/ 5 pessoas',
            description: 'Para equipes',
            features: ['5 ingressos VIP', 'Stand na área de exposição', 'Logo no site do evento', 'Sessão de networking privada', 'Relatório pós-evento'],
            buttonText: 'Solicitar',
            highlighted: false,
          },
        ],
      },
    },
    {
      id: 'faq-1',
      type: 'faq',
      props: {
        title: 'Perguntas Frequentes',
        items: [
          {
            question: 'Onde será o evento?',
            answer: 'O evento será realizado no Centro de Convenções São Paulo, localizado na Av. Paulista, 1000. Fácil acesso por metrô e estacionamento disponível.',
          },
          {
            question: 'Posso transferir meu ingresso?',
            answer: 'Sim! A transferência pode ser feita até 48h antes do evento através da nossa plataforma de ingressos.',
          },
          {
            question: 'Haverá transmissão online?',
            answer: 'As palestras keynote serão transmitidas online apenas para participantes VIP. O acesso ficará disponível por 30 dias após o evento.',
          },
          {
            question: 'Qual a política de cancelamento?',
            answer: 'Cancelamentos até 15 dias antes: reembolso integral. Até 7 dias: 50% em crédito. Após: sem reembolso, mas com transferência permitida.',
          },
          {
            question: 'Tem estacionamento no local?',
            answer: 'Sim, o centro de convenções possui estacionamento conveniado com tarifa especial para participantes do evento.',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      props: {
        title: 'Não perca essa oportunidade!',
        description: 'Vagas limitadas. Garanta seu lugar no maior evento de tecnologia do ano.',
        buttonText: 'Garantir Meu Ingresso',
        buttonHref: '#tickets',
        variant: 'centered',
      },
    },
  ],
}

export default landingEventoTemplate
