/**
 * Template: Landing Page SaaS
 * Ideal para: Produtos digitais, software, apps
 */

import type { SiteDocumentV2 } from '../schema'

export const landingSaasTemplate: SiteDocumentV2 = {
  meta: {
    title: 'SaaS Product',
    description: 'Software as a Service - Simplifique seu trabalho',
    language: 'pt-BR',
  },
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontFamilyHeading: 'Inter, system-ui, sans-serif',
      baseFontSize: '16px',
      lineHeight: 1.6,
      headingLineHeight: 1.2,
    },
    spacing: {
      unit: '0.25rem',
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: '0.75rem',
      shadow: '0 1px 3px rgba(0,0,0,0.1)',
      shadowLg: '0 10px 40px rgba(99,102,241,0.15)',
      transition: '0.2s ease',
    },
  },
  structure: [
    {
      id: 'navbar-1',
      type: 'navbar',
      props: {
        logo: { src: '/logo.svg', alt: 'Logo', href: '/' },
        links: [
          { text: 'Recursos', href: '#features' },
          { text: 'Preços', href: '#pricing' },
          { text: 'FAQ', href: '#faq' },
          { text: 'Contato', href: '#contact' },
        ],
        sticky: true,
        transparent: false,
      },
    },
    {
      id: 'hero-1',
      type: 'hero',
      props: {
        title: 'Simplifique sua gestão com nossa plataforma',
        subtitle: 'Automatize processos e aumente a produtividade',
        description: 'Nossa solução SaaS ajuda empresas a economizar tempo e recursos com automação inteligente, relatórios em tempo real e integrações poderosas.',
        image: 'https://placehold.co/600x400/6366f1/white?text=Dashboard',
        primaryButton: { text: 'Começar Grátis', href: '#signup' },
        secondaryButton: { text: 'Ver Demo', href: '#demo' },
        variant: 'split',
        align: 'left',
      },
    },
    {
      id: 'stats-1',
      type: 'stats',
      props: {
        items: [
          { value: '10k+', label: 'Usuários Ativos', description: 'Confiança de milhares' },
          { value: '99.9%', label: 'Uptime', description: 'Disponibilidade garantida' },
          { value: '50%', label: 'Economia', description: 'Redução de custos' },
          { value: '24/7', label: 'Suporte', description: 'Sempre disponível' },
        ],
      },
    },
    {
      id: 'featureGrid-1',
      type: 'featureGrid',
      props: {
        title: 'Recursos Poderosos',
        subtitle: 'Tudo que você precisa para escalar seu negócio',
        columns: 3,
        features: [
          {
            icon: '⚡',
            title: 'Automação Inteligente',
            description: 'Automatize tarefas repetitivas e foque no que importa',
          },
          {
            icon: '📊',
            title: 'Relatórios em Tempo Real',
            description: 'Dashboards e métricas atualizadas instantaneamente',
          },
          {
            icon: '🔗',
            title: 'Integrações',
            description: 'Conecte com suas ferramentas favoritas facilmente',
          },
          {
            icon: '🔒',
            title: 'Segurança Avançada',
            description: 'Seus dados protegidos com criptografia de ponta',
          },
          {
            icon: '📱',
            title: 'Mobile First',
            description: 'Acesse de qualquer lugar, em qualquer dispositivo',
          },
          {
            icon: '🎯',
            title: 'Personalização',
            description: 'Adapte a plataforma às suas necessidades',
          },
        ],
      },
    },
    {
      id: 'pricing-1',
      type: 'pricing',
      props: {
        title: 'Planos e Preços',
        subtitle: 'Escolha o plano ideal para seu negócio',
        plans: [
          {
            name: 'Starter',
            price: 'R$ 49',
            period: '/mês',
            description: 'Para pequenos times',
            features: ['Até 5 usuários', '10GB de armazenamento', 'Suporte por email', 'Relatórios básicos'],
            buttonText: 'Começar',
            highlighted: false,
          },
          {
            name: 'Professional',
            price: 'R$ 149',
            period: '/mês',
            description: 'Para empresas em crescimento',
            features: ['Até 25 usuários', '100GB de armazenamento', 'Suporte prioritário', 'Relatórios avançados', 'Integrações ilimitadas', 'API access'],
            buttonText: 'Começar',
            highlighted: true,
          },
          {
            name: 'Enterprise',
            price: 'Sob consulta',
            period: '',
            description: 'Para grandes organizações',
            features: ['Usuários ilimitados', 'Armazenamento ilimitado', 'Suporte 24/7 dedicado', 'SLA garantido', 'Customizações', 'On-premise disponível'],
            buttonText: 'Falar com vendas',
            highlighted: false,
          },
        ],
      },
    },
    {
      id: 'testimonialGrid-1',
      type: 'testimonialGrid',
      props: {
        title: 'O que nossos clientes dizem',
        testimonials: [
          {
            quote: 'A plataforma transformou completamente nossa operação. Reduzimos o tempo de processos em 60%.',
            author: 'Maria Silva',
            role: 'CEO',
            company: 'TechCorp',
            avatar: 'https://placehold.co/80x80/6366f1/white?text=MS',
          },
          {
            quote: 'Suporte excepcional e funcionalidades que realmente fazem diferença no dia a dia.',
            author: 'João Santos',
            role: 'CTO',
            company: 'StartupX',
            avatar: 'https://placehold.co/80x80/8b5cf6/white?text=JS',
          },
          {
            quote: 'Melhor investimento que fizemos. ROI positivo já no primeiro mês de uso.',
            author: 'Ana Costa',
            role: 'Diretora de Operações',
            company: 'MegaStore',
            avatar: 'https://placehold.co/80x80/f59e0b/white?text=AC',
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
            question: 'Posso testar antes de assinar?',
            answer: 'Sim! Oferecemos 14 dias de teste gratuito com acesso a todas as funcionalidades. Não é necessário cartão de crédito.',
          },
          {
            question: 'Como funciona o suporte?',
            answer: 'Todos os planos incluem suporte por email. Planos Professional e Enterprise têm acesso a suporte prioritário e chat ao vivo.',
          },
          {
            question: 'Posso cancelar a qualquer momento?',
            answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento.',
          },
          {
            question: 'Meus dados estão seguros?',
            answer: 'Absolutamente. Utilizamos criptografia de ponta a ponta, backups diários e seguimos as melhores práticas de segurança.',
          },
          {
            question: 'Vocês oferecem treinamento?',
            answer: 'Sim! Oferecemos onboarding gratuito para todos os clientes, além de documentação completa e vídeos tutoriais.',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      props: {
        title: 'Pronto para transformar seu negócio?',
        description: 'Comece agora com 14 dias grátis. Sem cartão de crédito.',
        buttonText: 'Criar Conta Gratuita',
        buttonHref: '#signup',
        variant: 'centered',
      },
    },
  ],
}

export default landingSaasTemplate
