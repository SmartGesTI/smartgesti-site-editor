/**
 * Template: Landing Page Escola/Curso
 * Ideal para: Escolas, cursos online, instituições de ensino
 */

import type { SiteDocumentV2 } from '../schema'

export const landingEscolaTemplate: SiteDocumentV2 = {
  meta: {
    title: 'Escola de Cursos',
    description: 'Aprenda com os melhores professores e transforme sua carreira',
    language: 'pt-BR',
  },
  theme: {
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#d1fae5',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontFamilyHeading: 'Poppins, system-ui, sans-serif',
      baseFontSize: '16px',
      lineHeight: 1.7,
      headingLineHeight: 1.3,
    },
    spacing: {
      unit: '0.25rem',
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: '1rem',
      shadow: '0 2px 8px rgba(5,150,105,0.08)',
      shadowLg: '0 15px 50px rgba(5,150,105,0.12)',
      transition: '0.3s ease',
    },
  },
  structure: [
    {
      id: 'navbar-1',
      type: 'navbar',
      props: {
        logo: { src: '/logo.svg', alt: 'Logo Escola', href: '/' },
        links: [
          { text: 'Cursos', href: '#courses' },
          { text: 'Metodologia', href: '#methodology' },
          { text: 'Depoimentos', href: '#testimonials' },
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
        title: 'Transforme sua carreira com nossos cursos',
        subtitle: 'Aprenda com especialistas do mercado',
        description: 'Cursos práticos e atualizados para você dominar as habilidades mais requisitadas. Certificado reconhecido e suporte dedicado durante todo o aprendizado.',
        image: 'https://placehold.co/600x400/059669/white?text=Estudantes',
        primaryButton: { text: 'Ver Cursos', href: '#courses' },
        secondaryButton: { text: 'Aula Grátis', href: '#free-class' },
        variant: 'split',
        align: 'left',
      },
    },
    {
      id: 'stats-1',
      type: 'stats',
      props: {
        items: [
          { value: '15.000+', label: 'Alunos Formados', description: 'Desde 2018' },
          { value: '98%', label: 'Aprovação', description: 'Taxa de conclusão' },
          { value: '50+', label: 'Cursos', description: 'Disponíveis' },
          { value: '4.9', label: 'Avaliação', description: 'Média dos alunos' },
        ],
      },
    },
    {
      id: 'featureGrid-1',
      type: 'featureGrid',
      props: {
        title: 'Por que escolher nossa escola?',
        subtitle: 'Diferenciais que fazem a diferença no seu aprendizado',
        columns: 3,
        features: [
          {
            icon: '🎓',
            title: 'Professores Especialistas',
            description: 'Aprenda com profissionais atuantes no mercado',
          },
          {
            icon: '📚',
            title: 'Conteúdo Atualizado',
            description: 'Material revisado constantemente com as novidades',
          },
          {
            icon: '🏆',
            title: 'Certificado Reconhecido',
            description: 'Certificação válida em todo o território nacional',
          },
          {
            icon: '💬',
            title: 'Suporte Dedicado',
            description: 'Tire suas dúvidas diretamente com os professores',
          },
          {
            icon: '⏰',
            title: 'Estude no Seu Ritmo',
            description: 'Acesso vitalício para assistir quando e onde quiser',
          },
          {
            icon: '🎯',
            title: 'Projetos Práticos',
            description: 'Aprenda fazendo com projetos reais do mercado',
          },
        ],
      },
    },
    {
      id: 'pricing-1',
      type: 'pricing',
      props: {
        title: 'Nossos Cursos',
        subtitle: 'Escolha o curso ideal para seus objetivos',
        plans: [
          {
            name: 'Curso Básico',
            price: 'R$ 197',
            period: '',
            description: 'Ideal para iniciantes',
            features: ['40 horas de conteúdo', 'Certificado digital', 'Acesso por 1 ano', 'Comunidade de alunos', 'Material complementar'],
            buttonText: 'Matricular',
            highlighted: false,
          },
          {
            name: 'Curso Completo',
            price: 'R$ 497',
            period: '',
            description: 'Formação completa',
            features: ['120 horas de conteúdo', 'Certificado digital', 'Acesso vitalício', 'Mentoria em grupo', 'Projetos práticos', 'Bônus exclusivos'],
            buttonText: 'Matricular',
            highlighted: true,
          },
          {
            name: 'Formação Pro',
            price: 'R$ 997',
            period: '',
            description: 'Para quem quer se destacar',
            features: ['200+ horas de conteúdo', 'Certificado premium', 'Acesso vitalício', 'Mentoria individual', 'Estágio garantido', 'Networking exclusivo'],
            buttonText: 'Matricular',
            highlighted: false,
          },
        ],
      },
    },
    {
      id: 'testimonialGrid-1',
      type: 'testimonialGrid',
      props: {
        title: 'Histórias de Sucesso',
        testimonials: [
          {
            quote: 'Consegui minha primeira vaga na área apenas 3 meses após concluir o curso. A metodologia prática fez toda diferença!',
            author: 'Lucas Mendes',
            role: 'Desenvolvedor Jr.',
            company: 'TechStartup',
            avatar: 'https://placehold.co/80x80/059669/white?text=LM',
          },
          {
            quote: 'Melhor investimento em educação que já fiz. Os professores são incríveis e o conteúdo é muito atual.',
            author: 'Carla Oliveira',
            role: 'UX Designer',
            company: 'Agency Plus',
            avatar: 'https://placehold.co/80x80/0d9488/white?text=CO',
          },
          {
            quote: 'Mudei completamente de carreira aos 35 anos. O suporte da escola foi fundamental nessa transição.',
            author: 'Roberto Alves',
            role: 'Product Manager',
            company: 'BigTech',
            avatar: 'https://placehold.co/80x80/f59e0b/white?text=RA',
          },
        ],
      },
    },
    {
      id: 'faq-1',
      type: 'faq',
      props: {
        title: 'Dúvidas Frequentes',
        items: [
          {
            question: 'Preciso ter conhecimento prévio?',
            answer: 'Não! Nossos cursos básicos são pensados para iniciantes completos. Você aprenderá desde o zero.',
          },
          {
            question: 'Como funciona o certificado?',
            answer: 'Ao concluir o curso com aproveitamento mínimo de 70%, você recebe o certificado digital automaticamente.',
          },
          {
            question: 'Posso parcelar o pagamento?',
            answer: 'Sim! Parcelamos em até 12x no cartão de crédito. Também aceitamos PIX e boleto.',
          },
          {
            question: 'E se eu não gostar do curso?',
            answer: 'Oferecemos garantia de 7 dias. Se não gostar, devolvemos 100% do valor investido.',
          },
          {
            question: 'Quanto tempo tenho para concluir?',
            answer: 'Os cursos Completo e Pro têm acesso vitalício. O curso Básico tem acesso por 1 ano.',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      props: {
        title: 'Pronto para dar o próximo passo?',
        description: 'Junte-se a mais de 15.000 alunos que transformaram suas carreiras.',
        buttonText: 'Começar Agora',
        buttonHref: '#courses',
        variant: 'centered',
      },
    },
  ],
}

export default landingEscolaTemplate
