/**
 * Template: Zilom
 * Layout inspirado na plataforma Zilom (ensino online)
 *
 * Características:
 * - Navbar com logo Zilom, Sign Up
 * - Hero split com gradiente, "Ready to learn?" / "Learn new things daily", imagem à direita
 * - Três cards com ícones (person+book, graduation cap, chat)
 * - Welcome (imagem + texto + Read More)
 * - Popular Courses (courseCardGrid)
 * - Register (fundo escuro + formulário)
 * - Top Categories (categoryCardGrid)
 * - What They Say? (testimonials, fundo azul)
 * - Benefits of Learning (texto + imagem)
 * - Latest Articles (blogCardGrid)
 * - Newsletter (fundo azul + email + Subscribe)
 * - Footer multi-colunas
 */

import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

export const escolaZilomTemplate: SiteDocument = {
  meta: {
    title: "Zilom",
    description:
      "Template Zilom para plataforma de ensino online – cursos, categorias, depoimentos e newsletter",
    language: "pt-BR",
  },
  theme: {
    colors: {
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#3b82f6",
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
      shadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      shadowLg: "0 25px 50px -12px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
    },
  },
  structure: [
    // 1. NAVBAR
    {
      id: "zilom-navbar",
      type: "navbar",
      props: {
        ...NAVBAR_DEFAULT_PROPS,
        // Sobrescrever apenas valores específicos do template
        links: [
          { text: "Home", href: "/site/p/home" },
          { text: "About", href: "/site/p/sobre" },
          { text: "Pages", href: "/site/p/cursos" },
          { text: "Courses", href: "/site/p/cursos" },
          { text: "Events", href: "/site/p/avisos" },
          { text: "Blog", href: "/site/p/avisos" },
          { text: "Shop", href: "/site/p/cursos" },
          { text: "Contact", href: "/site/p/contato" },
        ],
        ctaButton: { text: "Sign Up", href: "/site/p/contato" },
        bg: "#ffffff",
      },
    },

    // 2. HERO (split com gradiente, "Ready to learn?" / "Learn new things daily")
    {
      id: "zilom-hero",
      type: "hero",
      props: {
        variation: "hero-split",
        variant: "split",
        badge: "Ready to learn?",
        title: "Learn new things daily",
        description:
          "Join thousands of learners and access 60.000+ online courses. Start your journey today with expert instructors and flexible schedules.",
        primaryButton: { text: "View Courses", href: "/site/p/cursos" },
        image: "https://placehold.co/600x500/e0e7ff/4f46e5?text=Learning",
        align: "left",
        minHeight: "85vh",
        background:
          "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 50%, #c7d2fe 100%)",
      },
    },

    // 3. TRÊS CARDS COM ÍCONES
    {
      id: "zilom-features",
      type: "featureGrid",
      props: {
        title: "",
        subtitle: "",
        columns: 3,
        variant: "default",
        features: [
          {
            icon: "user",
            title: "Expert Instructors",
            description:
              "Learn from industry professionals with years of experience in their fields.",
          },
          {
            icon: "trophy",
            title: "Certified Courses",
            description:
              "Earn certificates and credentials recognized by employers worldwide.",
          },
          {
            icon: "heart",
            title: "Community Support",
            description:
              "Join a vibrant community of learners and get help when you need it.",
          },
        ],
      },
    },

    // 4. WELCOME (imagem esquerda, texto direita)
    {
      id: "zilom-welcome",
      type: "section",
      props: {
        bg: "#ffffff",
        padding: "6rem 2rem",
        children: [
          {
            id: "zilom-welcome-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "zilom-welcome-grid",
                  type: "grid",
                  props: {
                    cols: 2,
                    gap: "3rem",
                    children: [
                      {
                        id: "zilom-welcome-image",
                        type: "image",
                        props: {
                          src: "https://placehold.co/600x400/6366f1/fff?text=Welcome",
                          alt: "Welcome to the Online Learning Center",
                        },
                      },
                      {
                        id: "zilom-welcome-content",
                        type: "stack",
                        props: {
                          direction: "col",
                          gap: "1rem",
                          children: [
                            {
                              id: "zilom-welcome-heading",
                              type: "heading",
                              props: {
                                level: 2,
                                text: "Welcome To The Online Learning Center",
                              },
                            },
                            {
                              id: "zilom-welcome-text",
                              type: "text",
                              props: {
                                text: "We offer a wide range of courses designed to help you achieve your goals. Whether you're looking to advance your career or explore new interests, our platform provides the tools and support you need to succeed.",
                                size: "md",
                              },
                            },
                            {
                              id: "zilom-welcome-btn",
                              type: "button",
                              props: {
                                text: "Read More",
                                href: "/site/p/sobre",
                                variant: "primary",
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
    },

    // 5. POPULAR COURSES
    {
      id: "zilom-courses",
      type: "courseCardGrid",
      props: {
        title: "Popular Courses",
        subtitle: "Discover our most enrolled courses",
        columns: 3,
        cards: [
          {
            image: "https://placehold.co/400x220/2563eb/fff?text=Course+1",
            title: "Introduction to Web Development",
            price: "$29.00",
            rating: 5,
            meta: ["4h", "1.2k students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/1d4ed8/fff?text=Course+2",
            title: "Digital Marketing Fundamentals",
            price: "$39.00",
            rating: 4,
            meta: ["6h", "850 students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/3b82f6/fff?text=Course+3",
            title: "Data Science for Beginners",
            price: "$49.00",
            rating: 5,
            meta: ["8h", "2.1k students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/60a5fa/fff?text=Course+4",
            title: "UI/UX Design Masterclass",
            price: "$35.00",
            rating: 4,
            meta: ["5h", "920 students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/818cf8/fff?text=Course+5",
            title: "Python Programming",
            price: "$44.00",
            rating: 5,
            meta: ["10h", "3k students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/a78bfa/fff?text=Course+6",
            title: "Business Analytics",
            price: "$54.00",
            rating: 4,
            meta: ["7h", "1.5k students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/c084fc/fff?text=Course+7",
            title: "Photography Basics",
            price: "$25.00",
            rating: 5,
            meta: ["3h", "600 students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/d8b4fe/fff?text=Course+8",
            title: "Content Writing",
            price: "$32.00",
            rating: 4,
            meta: ["4h", "780 students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x220/e9d5ff/fff?text=Course+9",
            title: "Mobile App Development",
            price: "$59.00",
            rating: 5,
            meta: ["12h", "1.8k students"],
            buttonText: "View Course",
            buttonHref: "/site/p/cursos",
          },
        ],
      },
    },

    // 6. REGISTER (fundo escuro + formulário)
    {
      id: "zilom-register",
      type: "section",
      props: {
        bg: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)",
        padding: "6rem 2rem",
        children: [
          {
            id: "zilom-register-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "zilom-register-grid",
                  type: "grid",
                  props: {
                    cols: 2,
                    gap: "4rem",
                    children: [
                      {
                        id: "zilom-register-text",
                        type: "stack",
                        props: {
                          direction: "col",
                          gap: "1rem",
                          children: [
                            {
                              id: "zilom-register-heading",
                              type: "heading",
                              props: {
                                level: 2,
                                text: "Register Your Account Get Free Access To 60.000 Online Courses",
                              },
                            },
                            {
                              id: "zilom-register-desc",
                              type: "text",
                              props: {
                                text: "Join our community of learners and start your journey today. Create your free account in seconds.",
                                size: "md",
                              },
                            },
                          ],
                        },
                      },
                      {
                        id: "zilom-register-form-wrap",
                        type: "box",
                        props: {
                          bg: "#ffffff",
                          padding: "2rem",
                          radius: "var(--sg-card-radius)",
                          shadow: "var(--sg-shadow-lg)",
                          children: [
                            {
                              id: "zilom-register-form",
                              type: "form",
                              props: {
                                action: "#",
                                method: "post",
                                submitText: "Register Now",
                                children: [
                                  {
                                    id: "zilom-f-name",
                                    type: "input",
                                    props: {
                                      name: "fullname",
                                      placeholder: "Full Name",
                                      type: "text",
                                      required: true,
                                    },
                                  },
                                  {
                                    id: "zilom-f-email",
                                    type: "input",
                                    props: {
                                      name: "email",
                                      placeholder: "Email Address",
                                      type: "email",
                                      required: true,
                                    },
                                  },
                                  {
                                    id: "zilom-f-password",
                                    type: "input",
                                    props: {
                                      name: "password",
                                      placeholder: "Password",
                                      type: "password",
                                      required: true,
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
          },
        ],
      },
    },

    // 7. TOP CATEGORIES
    {
      id: "zilom-categories",
      type: "categoryCardGrid",
      props: {
        title: "Top Categories",
        subtitle: "Browse by category",
        columns: 4,
        categories: [
          {
            image: "https://placehold.co/400x240/6366f1/fff?text=Art+Design",
            title: "Art & Design",
            href: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x240/8b5cf6/fff?text=Business",
            title: "Business",
            href: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x240/a855f7/fff?text=Development",
            title: "Development",
            href: "/site/p/cursos",
          },
          {
            image: "https://placehold.co/400x240/d946ef/fff?text=Marketing",
            title: "Marketing",
            href: "/site/p/cursos",
          },
        ],
      },
    },

    // 8. WHAT THEY SAY? (testimonials, fundo azul)
    {
      id: "zilom-testimonials-section",
      type: "section",
      props: {
        bg: "var(--sg-primary)",
        padding: "6rem 2rem",
        children: [
          {
            id: "zilom-testimonials-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "zilom-testimonials",
                  type: "testimonialGrid",
                  props: {
                    title: "What They Say?",
                    subtitle: "Hear from our students",
                    columns: 3,
                    testimonials: [
                      {
                        quote:
                          "Zilom transformed my career. The courses are well-structured and the instructors are incredibly supportive. I landed my dream job within 6 months!",
                        authorName: "Sarah Mitchell",
                        authorRole: "Software Developer",
                        authorAvatar:
                          "https://placehold.co/80x80/1d4ed8/fff?text=SM",
                        rating: 5,
                      },
                      {
                        quote:
                          "The best online learning platform I've used. Flexible schedules and high-quality content. I've completed 5 courses and each one exceeded my expectations.",
                        authorName: "James Chen",
                        authorRole: "Marketing Manager",
                        authorAvatar:
                          "https://placehold.co/80x80/1d4ed8/fff?text=JC",
                        rating: 5,
                      },
                      {
                        quote:
                          "From beginner to certified professional. The community and support here are amazing. I recommend Zilom to everyone looking to learn new skills.",
                        authorName: "Emma Wilson",
                        authorRole: "Data Analyst",
                        authorAvatar:
                          "https://placehold.co/80x80/1d4ed8/fff?text=EW",
                        rating: 5,
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

    // 9. BENEFITS OF LEARNING
    {
      id: "zilom-benefits",
      type: "section",
      props: {
        bg: "#ffffff",
        padding: "6rem 2rem",
        children: [
          {
            id: "zilom-benefits-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "zilom-benefits-grid",
                  type: "grid",
                  props: {
                    cols: 2,
                    gap: "3rem",
                    children: [
                      {
                        id: "zilom-benefits-content",
                        type: "stack",
                        props: {
                          direction: "col",
                          gap: "1rem",
                          children: [
                            {
                              id: "zilom-benefits-badge",
                              type: "text",
                              props: {
                                text: "Why Choose Us",
                                size: "sm",
                              },
                            },
                            {
                              id: "zilom-benefits-heading",
                              type: "heading",
                              props: {
                                level: 2,
                                text: "Benefits Of Learning From Zilom",
                              },
                            },
                            {
                              id: "zilom-benefits-list",
                              type: "text",
                              props: {
                                text: "• Learn at your own pace with 24/7 access to course materials\n• Expert instructors with real-world experience\n• Earn certificates recognized by employers\n• Join a global community of learners\n• Affordable pricing with money-back guarantee",
                                size: "md",
                              },
                            },
                            {
                              id: "zilom-benefits-btn",
                              type: "button",
                              props: {
                                text: "Explore More",
                                href: "/site/p/cursos",
                                variant: "primary",
                              },
                            },
                          ],
                        },
                      },
                      {
                        id: "zilom-benefits-image",
                        type: "image",
                        props: {
                          src: "https://placehold.co/600x400/4f46e5/fff?text=Benefits",
                          alt: "Benefits of learning",
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

    // 10. LATEST ARTICLES
    {
      id: "zilom-blog",
      type: "blogCardGrid",
      props: {
        title: "Latest Articles",
        subtitle: "Tips, insights and updates from our blog",
        columns: 3,
        cards: [
          {
            image: "https://placehold.co/400x220/2563eb/fff?text=Article+1",
            date: "January 26, 2026",
            category: "Learning",
            title: "5 Ways to Stay Motivated While Learning Online",
            excerpt:
              "Practical tips to keep your motivation high and complete your courses successfully.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
          {
            image: "https://placehold.co/400x220/1d4ed8/fff?text=Article+2",
            date: "January 24, 2026",
            category: "Career",
            title: "How Online Certificates Boost Your Resume",
            excerpt:
              "Learn how to showcase your online learning achievements to employers.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
          {
            image: "https://placehold.co/400x220/3b82f6/fff?text=Article+3",
            date: "January 22, 2026",
            category: "Tips",
            title: "Best Practices for Time Management in Self-Paced Courses",
            excerpt:
              "Manage your time effectively and get the most out of your learning experience.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
        ],
      },
    },

    // 11. NEWSLETTER (fundo azul)
    {
      id: "zilom-newsletter-section",
      type: "section",
      props: {
        bg: "var(--sg-primary)",
        padding: "6rem 2rem",
        children: [
          {
            id: "zilom-newsletter-container",
            type: "container",
            props: {
              maxWidth: "900px",
              padding: "0 1rem",
              children: [
                {
                  id: "zilom-newsletter-inner",
                  type: "stack",
                  props: {
                    direction: "row",
                    gap: "2rem",
                    align: "center",
                    justify: "space-between",
                    wrap: true,
                    children: [
                      {
                        id: "zilom-newsletter-heading",
                        type: "heading",
                        props: {
                          level: 2,
                          text: "Subscribe To Our Newsletter To Get Daily Content",
                        },
                      },
                      {
                        id: "zilom-newsletter-form",
                        type: "form",
                        props: {
                          action: "#",
                          method: "post",
                          submitText: "Subscribe",
                          children: [
                            {
                              id: "zilom-newsletter-email",
                              type: "input",
                              props: {
                                name: "email",
                                placeholder: "Your email address",
                                type: "email",
                                required: true,
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
    },

    // 12. FOOTER
    {
      id: "zilom-footer",
      type: "footer",
      props: {
        logoText: "Zilom",
        description:
          "Your trusted platform for online learning. Access thousands of courses and start your journey today.",
        columns: [
          {
            title: "Company",
            links: [
              { text: "About Us", href: "/site/p/sobre" },
              { text: "Contact Us", href: "/site/p/contato" },
              { text: "Terms & Conditions", href: "#" },
            ],
          },
          {
            title: "Links",
            links: [
              { text: "Courses", href: "/site/p/cursos" },
              { text: "Events", href: "/site/p/avisos" },
              { text: "Gallery", href: "#" },
            ],
          },
          {
            title: "Support",
            links: [
              { text: "FAQs", href: "#" },
              { text: "Help Center", href: "#" },
              { text: "Privacy Policy", href: "#" },
            ],
          },
        ],
        social: [
          { platform: "facebook", href: "#" },
          { platform: "twitter", href: "#" },
          { platform: "instagram", href: "#" },
          { platform: "linkedin", href: "#" },
        ],
        copyright: "Copyright © 2023 Zilom. All Right Reserved",
      },
    },
  ],
};
