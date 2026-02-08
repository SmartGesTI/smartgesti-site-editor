/**
 * Template: Escola Blog
 * Template de escola com suporte ao Plugin Blog.
 *
 * Características:
 * - Navbar limpa com links para Home, Blog, Sobre, Contato
 * - Hero minimalista com call-to-action
 * - Seção de features da escola
 * - CTA para inscrição
 * - Footer multi-colunas
 *
 * Para testar o Plugin Blog:
 * 1. Selecione este template no editor
 * 2. No topbar, clique em "+ Adicionar" e ative o plugin "Blog"
 * 3. Uma seção de blog será injetada na landing page
 * 4. Novas páginas "Blog" e "Post" aparecerão no PageTabBar
 */

import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

export const escolaBlogTemplate: SiteDocument = {
  meta: {
    title: "Escola Blog",
    description:
      "Template simples com blog integrado — ideal para testar o sistema de plugins",
    language: "pt-BR",
  },
  theme: {
    colors: {
      primary: "#4f46e5",
      secondary: "#6366f1",
      accent: "#f59e0b",
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      textMuted: "#6b7280",
      border: "#e5e7eb",
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
    // ─── NAVBAR ───
    {
      id: "blog-navbar",
      type: "navbar",
      props: {
        ...NAVBAR_DEFAULT_PROPS,
        links: [
          { text: "Home", href: "/site/p/home" },
          { text: "Sobre", href: "/site/p/sobre" },
          { text: "Cursos", href: "/site/p/cursos" },
          { text: "Blog", href: "/site/p/blog" },
          { text: "Contato", href: "/site/p/contato" },
        ],
        ctaButton: { text: "Matricule-se", href: "/site/p/contato" },
        bg: "#ffffff",
        linkColor: "#374151",
        linkHoverColor: "#4f46e5",
        buttonColor: "#4f46e5",
        buttonTextColor: "#ffffff",
      },
    },

    // ─── HERO ───
    {
      id: "blog-hero",
      type: "hero",
      props: {
        title: "Educação que Transforma",
        subtitle: "Bem-vindo à nossa escola",
        description:
          "Acompanhe nossas novidades, eventos e conquistas no blog da escola. Uma educação de qualidade começa com informação.",
        variant: "centered",
        align: "center",
        overlay: true,
        overlayColor: "rgba(79, 70, 229, 0.85)",
        background: "#4f46e5",
        primaryButton: { text: "Conheça o Blog", href: "/site/p/blog" },
        secondaryButton: { text: "Fale Conosco", href: "/site/p/contato" },
      },
    },

    // ─── FEATURES ───
    {
      id: "blog-features",
      type: "featureGrid",
      props: {
        title: "Por que nossa escola?",
        subtitle:
          "Oferecemos uma experiência educacional completa e moderna",
        columns: 3,
        variant: "cards",
        features: [
          {
            icon: "GraduationCap",
            title: "Ensino de Excelência",
            description:
              "Professores qualificados e metodologia comprovada para o melhor aprendizado.",
          },
          {
            icon: "Users",
            title: "Comunidade Ativa",
            description:
              "Eventos, palestras e encontros que fortalecem a relação escola-família.",
          },
          {
            icon: "BookOpen",
            title: "Blog Informativo",
            description:
              "Fique por dentro de tudo que acontece na escola através do nosso blog.",
          },
        ],
      },
    },

    // ─── CTA ───
    {
      id: "blog-cta",
      type: "cta",
      props: {
        title: "Venha fazer parte da nossa história",
        description:
          "Agende uma visita e conheça de perto a escola que vai transformar o futuro do seu filho.",
        buttonText: "Agendar Visita",
        buttonHref: "/site/p/contato",
        variant: "centered",
      },
    },

    // ─── FOOTER ───
    {
      id: "blog-footer",
      type: "footer",
      props: {
        variant: "multi-column",
        columns: [
          {
            title: "Escola Blog",
            content:
              "Educação de qualidade com informação transparente. Acompanhe nosso blog!",
          },
          {
            title: "Links Rápidos",
            links: [
              { text: "Home", href: "/site/p/home" },
              { text: "Sobre", href: "/site/p/sobre" },
              { text: "Cursos", href: "/site/p/cursos" },
              { text: "Blog", href: "/site/p/blog" },
              { text: "Contato", href: "/site/p/contato" },
            ],
          },
          {
            title: "Contato",
            content:
              "contato@escolablog.com.br\n(11) 1234-5678\nRua da Educação, 100",
          },
        ],
        copyright: "© 2026 Escola Blog. Todos os direitos reservados.",
        socialLinks: [
          { platform: "facebook", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "youtube", url: "#" },
        ],
      },
    },
  ],
};
