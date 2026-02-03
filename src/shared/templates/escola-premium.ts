/**
 * Template: Escola Premium
 * Design moderno, dinâmico e profissional para instituições de ensino
 *
 * Características:
 * - Navbar com efeito glassmorphism
 * - Hero fullscreen com overlay vibrante
 * - Logo cloud com parceiros/certificações
 * - Estatísticas animadas
 * - Vídeo institucional em destaque
 * - Grid de diferenciais moderno
 * - Níveis de ensino com cards visuais
 * - Depoimentos em grid elegante
 * - FAQ interativo
 * - Seção de contato com formulário
 * - CTA com gradiente impactante
 * - Footer completo multi-colunas
 */

import type { SiteDocumentV2 } from "../schema";

export const escolaPremiumTemplate: SiteDocumentV2 = {
  meta: {
    title: "Colégio Vanguarda",
    description: "Template premium e moderno para escolas e instituições de ensino de excelência",
    language: "pt-BR",
  },
  theme: {
    colors: {
      primary: "#6366f1",      // Indigo vibrante - inovação, tecnologia
      secondary: "#0ea5e9",    // Cyan - frescor, modernidade
      accent: "#f97316",       // Orange - energia, criatividade
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontFamilyHeading: "Plus Jakarta Sans, system-ui, sans-serif",
      baseFontSize: "16px",
      lineHeight: 1.7,
      headingLineHeight: 1.15,
    },
    spacing: {
      unit: "0.25rem",
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: "1rem",
      shadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      shadowLg: "0 25px 50px -12px rgba(0,0,0,0.25)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  structure: [
    // ============================================
    // 1. NAVBAR - Glassmorphism Premium
    // ============================================
    {
      id: "escola-navbar",
      type: "navbar",
      props: {
        variation: "navbar-glass",
        links: [
          { text: "Início", href: "#escola-hero" },
          { text: "Sobre Nós", href: "#escola-video-section" },
          { text: "Diferenciais", href: "#escola-features" },
          { text: "Níveis de Ensino", href: "#escola-levels" },
          { text: "Depoimentos", href: "#escola-testimonials" },
          { text: "Valores", href: "#escola-pricing" },
        ],
        ctaButton: { text: "Agende uma Visita", href: "#escola-cta" },
        sticky: true,
        transparent: true,
        bg: "rgba(255, 255, 255, 0.9)",
      },
    },

    // ============================================
    // 2. HERO - Fullscreen Impactante
    // ============================================
    {
      id: "escola-hero",
      type: "hero",
      props: {
        variation: "hero-overlay",
        title: "Onde o Futuro Começa Hoje",
        subtitle: "Excelência acadêmica aliada à formação humana integral",
        description: "Há mais de 30 anos, o Colégio Vanguarda forma líderes, pensadores e cidadãos globais. Nossa metodologia inovadora prepara seu filho para os desafios do século XXI com tecnologia, valores e muito aprendizado.",
        backgroundImage: "/site-images/escolaweb-capas-artigos-5-maneiras-de-engajar-os-alunos-nas-atividades-escolares-1.jpg",
        overlayColor: "linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(14, 165, 233, 0.85) 100%)",
        badge: "Nota Máxima no ENEM 2024",
        primaryButton: { text: "Conheça Nossa Proposta", href: "/site/p/cursos" },
        secondaryButton: { text: "Faça um Tour Virtual", href: "/site/p/tour" },
        variant: "image-bg",
        align: "center",
        minHeight: "100vh",
        overlay: true,
      },
    },

    // ============================================
    // 3. LOGO CLOUD - Parceiros & Certificações
    // ============================================
    {
      id: "escola-partners",
      type: "logoCloud",
      props: {
        title: "Reconhecimento e Parcerias que Fazem a Diferença",
        logos: [
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=MEC", alt: "MEC - Ministério da Educação" },
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=UNESCO", alt: "UNESCO" },
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=Cambridge", alt: "Cambridge Assessment" },
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=Google+EDU", alt: "Google for Education" },
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=Microsoft", alt: "Microsoft Education" },
          { src: "https://placehold.co/160x60/f1f5f9/64748b?text=INEP", alt: "INEP" },
        ],
        grayscale: true,
      },
    },

    // ============================================
    // 4. STATS - Números Impressionantes
    // ============================================
    {
      id: "escola-stats",
      type: "stats",
      props: {
        title: "Números que Contam Nossa História",
        subtitle: "Três décadas de excelência em educação",
        variant: "cards",
        stats: [
          {
            value: "3.200+",
            label: "Alunos Matriculados",
            icon: "👨‍🎓",
            description: "Estudantes em todos os níveis",
          },
          {
            value: "98,5%",
            label: "Aprovação em Vestibulares",
            icon: "🏆",
            description: "Aprovados nas melhores universidades",
          },
          {
            value: "32",
            label: "Anos de Tradição",
            icon: "📚",
            description: "Formando gerações de sucesso",
          },
          {
            value: "150+",
            label: "Educadores Qualificados",
            icon: "👩‍🏫",
            description: "Mestres e doutores dedicados",
          },
        ],
        columns: 4,
        animated: true,
      },
    },

    // ============================================
    // 5. VIDEO INSTITUCIONAL
    // ============================================
    {
      id: "escola-video-section",
      type: "section",
      props: {
        bg: "#f8fafc",
        padding: "6rem 2rem",
        children: [
          {
            id: "escola-video-content",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0",
              children: [
                {
                  id: "escola-video-heading",
                  type: "heading",
                  props: {
                    level: 2,
                    text: "Conheça o Colégio Vanguarda",
                    align: "center",
                    color: "#0f172a",
                  },
                },
                {
                  id: "escola-video-subtitle",
                  type: "text",
                  props: {
                    text: "Faça um tour pela nossa estrutura e conheça nossa metodologia de ensino",
                    align: "center",
                    color: "#64748b",
                    size: "lg",
                  },
                },
                {
                  id: "escola-video-spacer",
                  type: "spacer",
                  props: { height: "2rem" },
                },
                {
                  id: "escola-video-player",
                  type: "video",
                  props: {
                    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    poster: "https://placehold.co/1200x675/6366f1/ffffff?text=Video+Institucional",
                    aspectRatio: "16:9",
                    controls: true,
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ============================================
    // 6. DIFERENCIAIS - Feature Grid Moderno
    // ============================================
    {
      id: "escola-features",
      type: "featureGrid",
      props: {
        title: "Por que Escolher o Colégio Vanguarda?",
        subtitle: "Uma educação completa que prepara para a vida",
        columns: 3,
        variant: "cards",
        features: [
          {
            icon: "🧠",
            title: "Metodologia STEAM",
            description: "Integração de Ciências, Tecnologia, Engenharia, Artes e Matemática em projetos práticos que desenvolvem o pensamento crítico e a criatividade.",
          },
          {
            icon: "🌍",
            title: "Educação Bilíngue",
            description: "Programa bilíngue completo com certificação Cambridge. Imersão cultural e preparação para o mundo globalizado desde a Educação Infantil.",
          },
          {
            icon: "💻",
            title: "Tecnologia Educacional",
            description: "Laboratórios de robótica, maker space, realidade virtual e plataforma digital própria para aprendizado personalizado.",
          },
          {
            icon: "🎭",
            title: "Formação Integral",
            description: "Atividades extracurriculares em artes, música, teatro, esportes e projetos sociais para desenvolvimento socioemocional completo.",
          },
          {
            icon: "📊",
            title: "Acompanhamento Individualizado",
            description: "Sistema de tutoria com orientação pedagógica e psicológica. Relatórios de desempenho e reuniões periódicas com as famílias.",
          },
          {
            icon: "🚀",
            title: "Preparação para o Futuro",
            description: "Orientação vocacional, feira de profissões, parcerias com universidades e programas de intercâmbio internacional.",
          },
        ],
      },
    },

    // ============================================
    // 7. NÍVEIS DE ENSINO - Cards Premium
    // ============================================
    {
      id: "escola-levels",
      type: "featureGrid",
      props: {
        title: "Jornada Educacional Completa",
        subtitle: "Do berçário ao Ensino Médio, acompanhamos cada etapa do seu filho",
        columns: 4,
        variant: "image-cards",
        features: [
          {
            icon: "🧒",
            title: "Educação Infantil",
            description: "0 a 5 anos • Berçário ao Jardim III. Aprendizado através do brincar, estimulação sensorial e desenvolvimento da autonomia em ambiente acolhedor.",
            image: "https://placehold.co/400x280/6366f1/ffffff?text=Ed.+Infantil",
          },
          {
            icon: "📖",
            title: "Fundamental I",
            description: "6 a 10 anos • 1º ao 5º ano. Alfabetização, letramento matemático e científico com projetos interdisciplinares e ensino bilíngue.",
            image: "https://placehold.co/400x280/0ea5e9/ffffff?text=Fund.+I",
          },
          {
            icon: "🔬",
            title: "Fundamental II",
            description: "11 a 14 anos • 6º ao 9º ano. Aprofundamento acadêmico, iniciação científica, olimpíadas do conhecimento e desenvolvimento do protagonismo.",
            image: "https://placehold.co/400x280/10b981/ffffff?text=Fund.+II",
          },
          {
            icon: "🎯",
            title: "Ensino Médio",
            description: "15 a 17 anos • 1ª à 3ª série. Preparação intensiva para ENEM e vestibulares, itinerários formativos e projetos de pesquisa.",
            image: "https://placehold.co/400x280/f97316/ffffff?text=Ensino+Médio",
          },
        ],
      },
    },

    // ============================================
    // 8. DEPOIMENTOS - Grid Elegante
    // ============================================
    {
      id: "escola-testimonials",
      type: "testimonialGrid",
      props: {
        title: "O que Nossa Comunidade Diz",
        subtitle: "Histórias reais de famílias que fazem parte do Colégio Vanguarda",
        variant: "cards",
        columns: 3,
        testimonials: [
          {
            quote: "O Colégio Vanguarda transformou a forma como minha filha vê o aprendizado. Ela ama ir à escola! O programa bilíngue e as atividades extracurriculares fizeram toda diferença no desenvolvimento dela.",
            author: "Fernanda Mendes",
            role: "Mãe de aluna do 5º ano",
            avatar: "https://placehold.co/80x80/6366f1/ffffff?text=FM",
            rating: 5,
          },
          {
            quote: "Fui aprovado em Engenharia na USP e na UNICAMP. A preparação que recebi foi excepcional. Os professores são dedicados e a metodologia de estudos realmente funciona. Sou muito grato!",
            author: "Lucas Ferreira",
            role: "Ex-aluno, Turma 2024",
            avatar: "https://placehold.co/80x80/0ea5e9/ffffff?text=LF",
            rating: 5,
          },
          {
            quote: "Como pedagoga, reconheço a qualidade do trabalho pedagógico. A escola investe em formação continuada dos professores e isso reflete diretamente no aprendizado dos alunos.",
            author: "Dra. Mariana Costa",
            role: "Mãe e Pedagoga",
            avatar: "https://placehold.co/80x80/10b981/ffffff?text=MC",
            rating: 5,
          },
          {
            quote: "Meus três filhos estudam aqui há 8 anos. O acompanhamento individualizado faz toda diferença. Cada criança é vista e respeitada em sua individualidade.",
            author: "Roberto Almeida",
            role: "Pai de 3 alunos",
            avatar: "https://placehold.co/80x80/f97316/ffffff?text=RA",
            rating: 5,
          },
          {
            quote: "O intercâmbio para o Canadá foi uma experiência transformadora. Voltei fluente em inglês e com uma visão de mundo completamente diferente. A escola abriu portas incríveis!",
            author: "Julia Santos",
            role: "Ex-aluna, Turma 2023",
            avatar: "https://placehold.co/80x80/ec4899/ffffff?text=JS",
            rating: 5,
          },
          {
            quote: "A infraestrutura é impressionante: laboratórios modernos, biblioteca completa, quadras esportivas e espaços de convivência. Nossos filhos têm tudo para se desenvolver plenamente.",
            author: "Casal Silva",
            role: "Pais de alunos do Fundamental",
            avatar: "https://placehold.co/80x80/8b5cf6/ffffff?text=CS",
            rating: 5,
          },
        ],
      },
    },

    // ============================================
    // 9. FAQ - Perguntas Frequentes
    // ============================================
    {
      id: "escola-faq",
      type: "faq",
      props: {
        title: "Perguntas Frequentes",
        subtitle: "Tire suas dúvidas sobre o Colégio Vanguarda",
        items: [
          {
            question: "Qual é o processo de matrícula?",
            answer: "O processo de matrícula começa com o agendamento de uma visita para conhecer nossa estrutura. Após a visita, realizamos uma avaliação diagnóstica (não eliminatória) para conhecer o perfil do aluno. Em seguida, apresentamos nossa proposta pedagógica e valores, e finalizamos com a assinatura do contrato e documentação.",
          },
          {
            question: "O colégio oferece período integral?",
            answer: "Sim! Oferecemos período integral para todas as faixas etárias, da Educação Infantil ao Ensino Médio. O período integral inclui almoço, atividades extracurriculares, reforço escolar, esportes, artes e tempo para estudos dirigidos.",
          },
          {
            question: "Como funciona o programa bilíngue?",
            answer: "Nosso programa bilíngue tem carga horária de 5 a 15 horas semanais em inglês, dependendo do segmento. Utilizamos metodologia CLIL (Content and Language Integrated Learning) e somos centro preparatório Cambridge. Os alunos são preparados para exames internacionais como KET, PET, FCE e CAE.",
          },
          {
            question: "Quais são as opções de atividades extracurriculares?",
            answer: "Oferecemos mais de 30 modalidades: esportes (natação, futebol, vôlei, basquete, judô, ballet, ginástica), artes (teatro, música, dança, artes visuais), tecnologia (robótica, programação, maker) e idiomas (espanhol, francês, mandarim).",
          },
          {
            question: "O colégio oferece bolsas de estudo?",
            answer: "Sim, oferecemos bolsas por mérito acadêmico, bolsas esportivas e bolsas socioeconômicas. Também temos parcerias com empresas para desconto a funcionários. Entre em contato com nossa secretaria para conhecer as opções disponíveis.",
          },
          {
            question: "Como é feito o acompanhamento pedagógico?",
            answer: "Cada turma tem um professor tutor responsável pelo acompanhamento. Realizamos avaliações diagnósticas periódicas, reuniões bimestrais com famílias, plantões de dúvidas semanais e disponibilizamos relatórios de desempenho através do nosso portal. A orientação pedagógica e psicológica está sempre disponível.",
          },
        ],
      },
    },

    // ============================================
    // 10. PLANOS E VALORES
    // ============================================
    {
      id: "escola-pricing",
      type: "pricing",
      props: {
        title: "Planos de Ensino",
        subtitle: "Investimento na educação do seu filho",
        plans: [
          {
            name: "Período Regular",
            price: "Sob consulta",
            period: "",
            description: "Manhã ou Tarde",
            features: [
              "Grade curricular completa",
              "Programa bilíngue incluso",
              "Material didático digital",
              "Acesso ao portal do aluno",
              "Plantões de dúvidas",
              "Eventos e festividades",
            ],
            buttonText: "Consultar Valores",
            buttonHref: "/site/p/contato",
          },
          {
            name: "Período Integral",
            price: "Sob consulta",
            period: "",
            description: "Manhã + Tarde",
            features: [
              "Tudo do período regular",
              "Almoço e lanches inclusos",
              "1 atividade extracurricular",
              "Estudo dirigido",
              "Reforço escolar",
              "Acompanhamento nutricional",
            ],
            buttonText: "Consultar Valores",
            buttonHref: "/site/p/contato",
            highlighted: true,
            badge: "Mais Escolhido",
          },
          {
            name: "Integral Premium",
            price: "Sob consulta",
            period: "",
            description: "Experiência completa",
            features: [
              "Tudo do período integral",
              "3 atividades extracurriculares",
              "Aulas particulares de idiomas",
              "Preparação para olimpíadas",
              "Mentoria individual",
              "Programa de intercâmbio",
            ],
            buttonText: "Consultar Valores",
            buttonHref: "/site/p/contato",
          },
        ],
      },
    },

    // ============================================
    // 11. EVENTOS E AGENDA
    // ============================================
    {
      id: "escola-events",
      type: "featureGrid",
      props: {
        title: "Próximos Eventos",
        subtitle: "Participe da vida escolar do seu filho",
        columns: 3,
        variant: "list",
        features: [
          {
            icon: "🎓",
            title: "Feira de Ciências STEAM",
            description: "22 de Março • 9h às 17h • Exposição de projetos científicos e tecnológicos desenvolvidos pelos alunos. Aberto ao público.",
          },
          {
            icon: "🏆",
            title: "Olimpíada de Matemática",
            description: "15 de Abril • 14h • Competição interna preparatória para OBMEP. Premiação para os melhores classificados de cada série.",
          },
          {
            icon: "🎭",
            title: "Festival de Artes Vanguarda",
            description: "10 de Maio • 19h • Apresentações de teatro, dança e música. Exposição de artes visuais. Presença obrigatória das famílias.",
          },
        ],
      },
    },

    // ============================================
    // 12. CTA FINAL - Impactante
    // ============================================
    {
      id: "escola-cta",
      type: "cta",
      props: {
        title: "Pronto para Fazer Parte da Nossa Família?",
        description: "Agende uma visita e venha conhecer de perto tudo o que o Colégio Vanguarda pode oferecer para o futuro do seu filho. Nossa equipe está pronta para receber você!",
        buttonText: "Agendar Visita Gratuita",
        buttonHref: "/site/p/contato",
        secondaryButtonText: "Falar pelo WhatsApp",
        secondaryButtonHref: "https://wa.me/5511999999999",
        variant: "gradient",
        gradientFrom: "#6366f1",
        gradientTo: "#0ea5e9",
      },
    },

    // ============================================
    // 13. FOOTER - Completo e Profissional
    // ============================================
    {
      id: "escola-footer",
      type: "footer",
      props: {
        description: "Há mais de 30 anos formando líderes, pensadores e cidadãos globais. O Colégio Vanguarda é referência em educação de qualidade, unindo tradição e inovação para preparar alunos para os desafios do futuro.",
        columns: [
          {
            title: "Institucional",
            links: [
              { text: "Nossa História", href: "/site/p/sobre" },
              { text: "Proposta Pedagógica", href: "/site/p/proposta" },
              { text: "Equipe", href: "/site/p/equipe" },
              { text: "Infraestrutura", href: "/site/p/infraestrutura" },
              { text: "Trabalhe Conosco", href: "/site/p/carreiras" },
            ],
          },
          {
            title: "Acadêmico",
            links: [
              { text: "Educação Infantil", href: "/site/p/infantil" },
              { text: "Ensino Fundamental", href: "/site/p/fundamental" },
              { text: "Ensino Médio", href: "/site/p/medio" },
              { text: "Atividades Extras", href: "/site/p/extracurricular" },
              { text: "Calendário Escolar", href: "/site/p/calendario" },
            ],
          },
          {
            title: "Acesso Rápido",
            links: [
              { text: "Portal do Aluno", href: "/portal" },
              { text: "Portal do Professor", href: "/professor" },
              { text: "Matrícula Online", href: "/site/p/matricula" },
              { text: "Segunda Via de Boleto", href: "/financeiro" },
              { text: "Comunicados", href: "/site/p/comunicados" },
            ],
          },
          {
            title: "Contato",
            links: [
              { text: "(11) 3456-7890", href: "tel:1134567890" },
              { text: "(11) 99999-9999 (WhatsApp)", href: "https://wa.me/5511999999999" },
              { text: "contato@colegiovanguarda.edu.br", href: "mailto:contato@colegiovanguarda.edu.br" },
              { text: "Av. da Educação, 1000 - São Paulo/SP", href: "https://maps.google.com" },
            ],
          },
        ],
        social: [
          { platform: "instagram", href: "https://instagram.com/colegiovanguarda" },
          { platform: "facebook", href: "https://facebook.com/colegiovanguarda" },
          { platform: "youtube", href: "https://youtube.com/colegiovanguarda" },
          { platform: "linkedin", href: "https://linkedin.com/company/colegiovanguarda" },
          { platform: "tiktok", href: "https://tiktok.com/@colegiovanguarda" },
        ],
        copyright: "© 2025 Colégio Vanguarda. Todos os direitos reservados. CNPJ: 00.000.000/0001-00",
        variant: "multi-column",
      },
    },
  ],
};
