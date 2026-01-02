/**
 * Template: Landing Page Empresa/Serviços
 * Ideal para: Empresas, consultorias, agências, prestadores de serviços
 */

import type { SiteDocumentV2 } from '../schema'

export const landingEmpresaTemplate: SiteDocumentV2 = {
  meta: {
    title: 'Empresa de Serviços',
    description: 'Soluções profissionais para o seu negócio crescer',
    language: 'pt-BR',
  },
  theme: {
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f1f5f9',
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
      borderRadius: '0.5rem',
      shadow: '0 1px 3px rgba(0,0,0,0.08)',
      shadowLg: '0 15px 50px rgba(30,64,175,0.1)',
      transition: '0.25s ease',
    },
  },
  structure: [
    {
      id: 'navbar-1',
      type: 'navbar',
      props: {
        logo: { src: '/logo.svg', alt: 'Logo Empresa', href: '/' },
        links: [
          { text: 'Serviços', href: '#services' },
          { text: 'Sobre', href: '#about' },
          { text: 'Clientes', href: '#clients' },
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
        title: 'Soluções que impulsionam seu negócio',
        subtitle: 'Consultoria e Serviços Especializados',
        description: 'Há mais de 10 anos ajudando empresas a alcançar resultados extraordinários com estratégia, tecnologia e inovação.',
        image: 'https://placehold.co/600x400/1e40af/white?text=Equipe',
        primaryButton: { text: 'Solicitar Orçamento', href: '#contact' },
        secondaryButton: { text: 'Conhecer Serviços', href: '#services' },
        variant: 'split',
        align: 'left',
      },
    },
    {
      id: 'logoCloud-1',
      type: 'logoCloud',
      props: {
        title: 'Empresas que confiam em nosso trabalho',
        logos: [
          { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Cliente+1', alt: 'Cliente 1', href: '#' },
          { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Cliente+2', alt: 'Cliente 2', href: '#' },
          { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Cliente+3', alt: 'Cliente 3', href: '#' },
          { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Cliente+4', alt: 'Cliente 4', href: '#' },
          { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Cliente+5', alt: 'Cliente 5', href: '#' },
        ],
      },
    },
    {
      id: 'stats-1',
      type: 'stats',
      props: {
        items: [
          { value: '10+', label: 'Anos de Mercado', description: 'Experiência consolidada' },
          { value: '500+', label: 'Projetos Entregues', description: 'Em diversos setores' },
          { value: '98%', label: 'Satisfação', description: 'Clientes recomendam' },
          { value: '50+', label: 'Especialistas', description: 'Equipe qualificada' },
        ],
      },
    },
    {
      id: 'featureGrid-1',
      type: 'featureGrid',
      props: {
        title: 'Nossos Serviços',
        subtitle: 'Soluções completas para diferentes necessidades',
        columns: 3,
        features: [
          {
            icon: '📋',
            title: 'Consultoria Estratégica',
            description: 'Análise e planejamento para otimizar processos e aumentar resultados',
          },
          {
            icon: '💻',
            title: 'Transformação Digital',
            description: 'Modernize sua empresa com tecnologia de ponta e automação',
          },
          {
            icon: '📈',
            title: 'Marketing Digital',
            description: 'Estratégias para aumentar sua presença online e gerar leads',
          },
          {
            icon: '🔧',
            title: 'Desenvolvimento de Software',
            description: 'Sistemas personalizados para necessidades específicas do seu negócio',
          },
          {
            icon: '📊',
            title: 'Business Intelligence',
            description: 'Transforme dados em insights para decisões mais assertivas',
          },
          {
            icon: '🤝',
            title: 'Treinamento Corporativo',
            description: 'Capacitação de equipes com metodologias práticas e eficazes',
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
            quote: 'A parceria transformou completamente nossa operação. Aumentamos a eficiência em 45% no primeiro ano.',
            author: 'Carlos Eduardo',
            role: 'Diretor de Operações',
            company: 'IndustriaX',
            avatar: 'https://placehold.co/80x80/1e40af/white?text=CE',
          },
          {
            quote: 'Profissionalismo e comprometimento em cada etapa do projeto. Resultado superou nossas expectativas.',
            author: 'Fernanda Lima',
            role: 'CEO',
            company: 'RetailCorp',
            avatar: 'https://placehold.co/80x80/3b82f6/white?text=FL',
          },
          {
            quote: 'Equipe extremamente qualificada. Conseguimos implementar a transformação digital em tempo recorde.',
            author: 'Rodrigo Martins',
            role: 'CTO',
            company: 'LogiTech',
            avatar: 'https://placehold.co/80x80/10b981/white?text=RM',
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
            question: 'Como funciona o processo de consultoria?',
            answer: 'Iniciamos com um diagnóstico completo da sua empresa, identificamos oportunidades de melhoria e elaboramos um plano de ação personalizado com cronograma e metas claras.',
          },
          {
            question: 'Qual o prazo médio dos projetos?',
            answer: 'Depende da complexidade e escopo. Projetos menores levam de 2 a 4 semanas, enquanto transformações digitais completas podem levar de 3 a 6 meses.',
          },
          {
            question: 'Vocês atendem empresas de todos os tamanhos?',
            answer: 'Sim! Temos soluções escaláveis que atendem desde startups até grandes corporações, adaptando metodologia e investimento à realidade de cada cliente.',
          },
          {
            question: 'Como solicitar um orçamento?',
            answer: 'Basta preencher nosso formulário de contato ou ligar para nossa central. Um consultor entrará em contato em até 24 horas úteis.',
          },
          {
            question: 'Oferecem suporte após a entrega?',
            answer: 'Sim! Todos os nossos projetos incluem período de suporte pós-implementação e oferecemos contratos de manutenção contínua.',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      props: {
        title: 'Pronto para transformar seu negócio?',
        description: 'Entre em contato e receba uma proposta personalizada em até 48 horas',
        buttonText: 'Solicitar Proposta',
        buttonHref: '#contact',
        variant: 'centered',
      },
    },
  ],
}

export default landingEmpresaTemplate
