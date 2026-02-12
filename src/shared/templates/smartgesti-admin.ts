/**
 * Template: SmartGesti Administrativo
 * Landing page profissional para software de gestão administrativa
 *
 * Características:
 * - Navbar elegante com CTA
 * - Hero split com gradiente escuro
 * - Stats de impacto (clientes, uptime, etc.)
 * - Product Showcase alternado (módulos do sistema)
 * - About Section com achievements e stats flutuantes
 * - Feature Grid de benefícios
 * - Testimonials de clientes
 * - FAQ
 * - Contact Section com formulário
 * - CTA final
 * - Footer multi-colunas
 */

import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";
import { IMAGE_GALLERY_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/imageGallery";

export const smartgestiAdminTemplate: SiteDocument = {
  meta: {
    title: "SmartGesti Admin",
    description:
      "Landing page profissional para sistema de gestão administrativa – módulos, benefícios, contato e depoimentos",
    language: "pt-BR",
  },
  theme: {
    colors: {
      primary: "#6366f1",
      secondary: "#4f46e5",
      accent: "#8b5cf6",
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
      fontFamilyHeading: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      lineHeight: 1.6,
      headingLineHeight: 1.2,
    },
    spacing: {
      unit: "0.25rem",
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: "0.75rem",
      shadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      shadowLg: "0 25px 50px -12px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
    },
  },
  structure: [
    // 1. NAVBAR
    {
      id: "admin-navbar",
      type: "navbar",
      props: {
        ...NAVBAR_DEFAULT_PROPS,
        links: [
          { text: "Home", href: "/site/p/home" },
          { text: "Produtos", href: "#admin-products" },
          { text: "Sobre", href: "#admin-about" },
          { text: "Depoimentos", href: "#admin-testimonials" },
          { text: "FAQ", href: "#admin-faq" },
          { text: "Contato", href: "#admin-contact" },
        ],
        ctaButton: { text: "Solicitar Demo", href: "#admin-contact" },
        bg: "#ffffff",
        // Link hover effects
        linkHoverEffect: "underline",
        linkHoverIntensity: 60,
        linkHoverColor: "#6366f1",
        // CTA button hover effects
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "shine",
      },
    },

    // 2. HERO
    {
      id: "admin-hero",
      type: "hero",
      props: {
        variation: "hero-split",
        variant: "split",
        badge: "Gestão Inteligente",
        title: "Simplifique a gestão da sua instituição",
        description:
          "Plataforma completa para gestão administrativa, acadêmica e financeira. Automatize processos, reduza custos e tome decisões baseadas em dados.",
        primaryButton: { text: "Começar Agora", href: "#admin-contact" },
        secondaryButton: { text: "Ver Demonstração", href: "#admin-products" },
        image: "https://placehold.co/600x500/6366f1/ffffff?text=SmartGesti",
        align: "left",
        minHeight: "85vh",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        // Button hover effects
        buttonHoverEffect: "glow",
        buttonHoverIntensity: 60,
        buttonHoverOverlay: "shine",
      },
    },

    // 3. STATS
    {
      id: "admin-stats",
      type: "stats",
      props: {
        title: "Números que Falam",
        subtitle: "Resultados reais de quem usa o SmartGesti",
        items: [
          { value: "500+", label: "Instituições Atendidas" },
          { value: "99.9%", label: "Uptime Garantido" },
          { value: "50k+", label: "Usuários Ativos" },
          { value: "4.9", label: "Nota dos Clientes", suffix: "/5" },
        ],
      },
    },

    // 4. PRODUCT SHOWCASE
    {
      id: "admin-products",
      type: "productShowcase",
      props: {
        title: "Nossos Módulos",
        subtitle: "Soluções Completas",
        variant: "alternating",
        products: [
          {
            name: "Gestão Acadêmica",
            description: "Controle total do fluxo acadêmico.",
            longDescription:
              "Gerencie matrículas, turmas, notas, frequências e boletins em uma única plataforma. Acompanhe o desempenho dos alunos em tempo real.",
            icon: "📚",
            badge: "Mais Popular",
            features: [
              "Matrículas online",
              "Diário de classe digital",
              "Boletins automáticos",
              "Portal do aluno e responsável",
            ],
            primaryButton: { text: "Saiba Mais", href: "#admin-contact" },
          },
          {
            name: "Gestão Financeira",
            description: "Finanças sob controle total.",
            longDescription:
              "Controle mensalidades, gere boletos, acompanhe inadimplência e tenha relatórios financeiros completos para tomar decisões estratégicas.",
            icon: "💰",
            features: [
              "Emissão de boletos",
              "Controle de inadimplência",
              "Relatórios financeiros",
              "Integração bancária",
            ],
            primaryButton: { text: "Saiba Mais", href: "#admin-contact" },
            secondaryButton: { text: "Ver Preços", href: "#admin-faq" },
          },
          {
            name: "Comunicação Integrada",
            description: "Conecte escola, família e alunos.",
            longDescription:
              "Envie comunicados, agende reuniões, compartilhe documentos e mantenha todos informados através de notificações push, email e SMS.",
            icon: "💬",
            features: [
              "Comunicados instantâneos",
              "Agenda de eventos",
              "Chat escola-família",
              "Notificações push",
            ],
            primaryButton: { text: "Saiba Mais", href: "#admin-contact" },
          },
        ],
        // Button hover effects
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "shine",
      },
    },

    // 5. ABOUT SECTION
    {
      id: "admin-about",
      type: "aboutSection",
      props: {
        title: "Por que escolher o SmartGesti?",
        subtitle: "Sobre Nós",
        description:
          "Desde 2015, ajudamos instituições de ensino a modernizar seus processos. Nossa plataforma foi desenvolvida em parceria com gestores escolares para resolver problemas reais do dia a dia.",
        secondaryDescription:
          "Acreditamos que tecnologia de qualidade deve ser acessível a todas as instituições, independente do tamanho.",
        variant: "image-left",
        image: "https://placehold.co/600x400/e0e7ff/6366f1?text=Equipe+SmartGesti",
        achievements: [
          { text: "Equipe 100% brasileira" },
          { text: "Suporte humanizado em português" },
          { text: "Implantação em até 7 dias" },
          { text: "Sem taxa de adesão" },
        ],
        primaryButton: { text: "Conheça Nossa História", href: "#admin-contact" },
        stats: [
          { value: "500+", label: "Clientes" },
          { value: "8+", label: "Anos" },
        ],
        // Button hover effects
        buttonHoverEffect: "glow",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "shine",
      },
    },

    // 6. IMAGE GALLERY
    {
      id: "admin-gallery",
      type: "imageGallery",
      props: {
        title: "Nossa Equipe e Escritório",
        subtitle: "Conheça Quem Faz Acontecer",
        images: [
          {
            id: "1",
            src: "https://placehold.co/800x600/6366f1/ffffff?text=Equipe+SmartGesti",
            alt: "Equipe SmartGesti reunida no escritório",
            title: "Nossa Equipe",
            description: "Time dedicado a transformar a gestão educacional",
          },
          {
            id: "2",
            src: "https://placehold.co/800x600/8b5cf6/ffffff?text=Escritório+Moderno",
            alt: "Escritório moderno do SmartGesti",
            title: "Nosso Espaço",
            description: "Ambiente colaborativo e inovador",
          },
          {
            id: "3",
            src: "https://placehold.co/800x600/ec4899/ffffff?text=Atendimento+Cliente",
            alt: "Equipe de suporte atendendo cliente",
            title: "Suporte Dedicado",
            description: "Atendimento humanizado e eficiente",
          },
          {
            id: "4",
            src: "https://placehold.co/800x600/10b981/ffffff?text=Tecnologia",
            alt: "Infraestrutura tecnológica SmartGesti",
            title: "Infraestrutura",
            description: "Servidores de ponta para máxima performance",
          },
          {
            id: "5",
            src: "https://placehold.co/800x600/f59e0b/ffffff?text=Treinamento",
            alt: "Treinamento de clientes SmartGesti",
            title: "Capacitação",
            description: "Treinamos sua equipe para o sucesso",
          },
          {
            id: "6",
            src: "https://placehold.co/800x600/ef4444/ffffff?text=Eventos",
            alt: "Evento SmartGesti com clientes",
            title: "Comunidade",
            description: "Eventos e networking com gestores educacionais",
          },
        ],
        variation: "gallery-grid",
        columns: 3,
        gap: 1.5,
        aspectRatio: "4/3",
        imageBorderRadius: 12,
        imageShadow: "lg",
        enterAnimation: "fade-scale",
        hoverEffect: "zoom-overlay",
        hoverIntensity: 60,
        lightbox: {
          mode: "adaptive",
          showArrows: true,
          showThumbnails: true,
          showCounter: true,
          showCaption: true,
          enableZoom: true,
          enableDownload: false,
          enableAutoplay: false,
          autoplayInterval: 5,
          closeOnBackdropClick: true,
          closeOnEsc: true,
          enableKeyboard: true,
          enableTouchGestures: true,
          transitionDuration: 300,
        },
        lazyLoad: true,
        showWarningAt: 50,
      },
    },

    // 7. FEATURE GRID
    {
      id: "admin-features",
      type: "featureGrid",
      props: {
        title: "Benefícios da Plataforma",
        subtitle: "Tudo que sua instituição precisa em um só lugar",
        columns: 3,
        variant: "cards",
        features: [
          {
            icon: "shield",
            title: "Segurança Total",
            description:
              "Dados criptografados, backups automáticos e conformidade com LGPD.",
          },
          {
            icon: "zap",
            title: "Alta Performance",
            description:
              "Sistema rápido e estável, mesmo com milhares de acessos simultâneos.",
          },
          {
            icon: "smartphone",
            title: "100% Responsivo",
            description:
              "Acesse de qualquer dispositivo – desktop, tablet ou celular.",
          },
          {
            icon: "bar-chart",
            title: "Dashboards Inteligentes",
            description:
              "Visualize dados em tempo real com gráficos e relatórios personalizados.",
          },
          {
            icon: "users",
            title: "Multi-Unidade",
            description:
              "Gerencie múltiplas unidades a partir de uma única conta administrativa.",
          },
          {
            icon: "headphones",
            title: "Suporte Premium",
            description:
              "Atendimento via chat, email e telefone com tempo de resposta garantido.",
          },
        ],
      },
    },

    // 8. TESTIMONIALS
    {
      id: "admin-testimonials",
      type: "testimonialGrid",
      props: {
        title: "O que Nossos Clientes Dizem",
        subtitle: "Depoimentos reais de gestores que transformaram suas instituições",
        columns: 3,
        testimonials: [
          {
            quote:
              "O SmartGesti revolucionou nossa gestão. Reduzimos em 60% o tempo gasto com processos administrativos.",
            authorName: "Maria Silva",
            authorRole: "Diretora",
            authorCompany: "Colégio São Paulo",
            rating: 5,
          },
          {
            quote:
              "A integração financeira é impecável. Finalmente temos controle total da inadimplência.",
            authorName: "João Santos",
            authorRole: "Gestor Financeiro",
            authorCompany: "Escola Nova Era",
            rating: 5,
          },
          {
            quote:
              "O suporte é excepcional. Sempre que precisamos, a equipe está pronta para ajudar.",
            authorName: "Ana Oliveira",
            authorRole: "Coordenadora",
            authorCompany: "Instituto Futuro",
            rating: 5,
          },
        ],
      },
    },

    // 9. FAQ
    {
      id: "admin-faq",
      type: "faq",
      props: {
        title: "Perguntas Frequentes",
        subtitle: "Tire suas dúvidas sobre o SmartGesti",
        items: [
          {
            question: "Quanto tempo leva para implementar?",
            answer:
              "A implantação completa leva em média 7 dias úteis. Nossa equipe cuida de toda a migração de dados e treinamento da equipe.",
          },
          {
            question: "O sistema funciona offline?",
            answer:
              "O SmartGesti é 100% online (cloud), garantindo acesso de qualquer lugar. Em caso de queda de internet, os dados são sincronizados automaticamente ao reconectar.",
          },
          {
            question: "Existe taxa de adesão?",
            answer:
              "Não cobramos taxa de adesão, implementação ou treinamento. O valor mensal inclui tudo: sistema, suporte, atualizações e backups.",
          },
          {
            question: "Posso cancelar a qualquer momento?",
            answer:
              "Sim, não há fidelidade. Você pode cancelar a qualquer momento e exportar todos os seus dados.",
          },
          {
            question: "O sistema é seguro?",
            answer:
              "Absolutamente. Utilizamos criptografia de ponta, backups diários, servidores redundantes e somos 100% conformes com a LGPD.",
          },
        ],
      },
    },

    // 10. CONTACT SECTION
    {
      id: "admin-contact",
      type: "contactSection",
      props: {
        title: "Fale Conosco",
        subtitle: "Contato",
        description: "Solicite uma demonstração gratuita ou tire suas dúvidas com nossa equipe.",
        variant: "split",
        contactInfo: [
          { icon: "mail", label: "Email", value: "contato@smartgesti.com.br" },
          { icon: "phone", label: "Telefone", value: "(11) 3456-7890" },
          {
            icon: "map-pin",
            label: "Endereço",
            value: "Av. Paulista, 1000 - São Paulo, SP",
          },
          { icon: "clock", label: "Horário", value: "Seg a Sex, 8h às 18h" },
        ],
        formTitle: "Solicite uma demonstração",
        formFields: [
          {
            name: "name",
            label: "Nome Completo",
            type: "text",
            placeholder: "Seu nome",
            required: true,
          },
          {
            name: "email",
            label: "Email Institucional",
            type: "email",
            placeholder: "email@instituicao.com.br",
            required: true,
          },
          {
            name: "phone",
            label: "Telefone",
            type: "tel",
            placeholder: "(00) 00000-0000",
          },
          {
            name: "message",
            label: "Mensagem",
            type: "textarea",
            placeholder: "Conte-nos sobre sua instituição e suas necessidades...",
            required: true,
          },
        ],
        submitText: "Solicitar Demonstração",
        // Button hover effects
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "shine",
      },
    },

    // 11. CTA
    {
      id: "admin-cta",
      type: "cta",
      props: {
        title: "Pronto para transformar sua gestão?",
        description:
          "Junte-se a mais de 500 instituições que já simplificaram seus processos com o SmartGesti.",
        primaryButton: { text: "Começar Agora", href: "#admin-contact" },
        secondaryButton: { text: "Ver Planos" },
        variant: "gradient",
        // Button hover effects
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "shine",
      },
    },

    // 12. FOOTER
    {
      id: "admin-footer",
      type: "footer",
      props: {
        logoText: "SmartGesti",
        description:
          "Plataforma de gestão inteligente para instituições de ensino.",
        variant: "multi-column",
        columns: [
          {
            title: "Produto",
            links: [
              { text: "Gestão Acadêmica", href: "#admin-products" },
              { text: "Gestão Financeira", href: "#admin-products" },
              { text: "Comunicação", href: "#admin-products" },
              { text: "Relatórios", href: "#admin-products" },
            ],
          },
          {
            title: "Empresa",
            links: [
              { text: "Sobre Nós", href: "#admin-about" },
              { text: "Carreiras", href: "#" },
              { text: "Blog", href: "#" },
              { text: "Contato", href: "#admin-contact" },
            ],
          },
          {
            title: "Suporte",
            links: [
              { text: "Central de Ajuda", href: "#" },
              { text: "Documentação", href: "#" },
              { text: "Status", href: "#" },
              { text: "Termos de Uso", href: "#" },
            ],
          },
        ],
        social: [
          { platform: "instagram", href: "https://instagram.com/smartgesti" },
          { platform: "linkedin", href: "https://linkedin.com/company/smartgesti" },
          { platform: "youtube", href: "https://youtube.com/smartgesti" },
          { platform: "whatsapp", href: "https://wa.me/5511999999999" },
        ],
        copyright: "© 2025 SmartGesti. Todos os direitos reservados.",
        // Link hover effects
        linkHoverEffect: "underline-center",
        linkHoverIntensity: 50,
        linkHoverColor: "#a5b4fc",
      },
    },
  ],
};
