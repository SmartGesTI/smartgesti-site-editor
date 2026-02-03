/**
 * Template: Edvi
 * Layout inspirado no tema Edvi para instituições de ensino
 *
 * Características:
 * - Navbar flutuante com logo Edvi
 * - Hero com imagem e overlay azul
 * - Três caixas informativas (Day Care, Activities, Contacts)
 * - Our Regular Courses (cards com imagem)
 * - Why Choose Us (duas colunas)
 * - Countdown banner (Admission on Going)
 * - Our Special Classes (grid de imagens)
 * - Carousel Natural Programs
 * - Recently News & Blogs
 * - Meet Our Teachers
 * - Formulário de contato
 * - Footer multi-colunas
 */

import type { SiteDocumentV2 } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

export const escolaEdviTemplate: SiteDocumentV2 = {
  meta: {
    title: "Edvi",
    description:
      "Template Edvi para escolas e instituições de ensino – foco no desenvolvimento das crianças",
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
      id: "edvi-navbar",
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
        ctaButton: { text: "Enroll Now", href: "/site/p/contato" },
        bg: "#ffffff",
      },
    },

    // 2. HERO
    {
      id: "edvi-hero",
      type: "hero",
      props: {
        variation: "hero-overlay",
        variant: "image-bg",
        title: "We Focus on Your Children's Development",
        description:
          "Quality education and care in a nurturing environment. Join our community and give your child the best start in life.",
        image: "/site-images/20221121_00_ensino_ciencias_molecula.jpg",
        overlay: true,
        overlayColor:
          "linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.85) 100%)",
        primaryButton: { text: "About Us", href: "/site/p/sobre" },
        secondaryButton: { text: "Read More", href: "/site/p/cursos" },
        align: "center",
        minHeight: "85vh",
      },
    },

    // 3. TRÊS CAIXAS (Our Day Care, Our Activities, Our Contacts)
    {
      id: "edvi-info-boxes",
      type: "featureGrid",
      props: {
        title: "",
        subtitle: "",
        columns: 3,
        variant: "cards",
        features: [
          {
            icon: "clock",
            title: "Our Day Care",
            description:
              "Safe and nurturing environment for your little ones throughout the day.",
          },
          {
            icon: "pencil",
            title: "Our Activities",
            description:
              "Creative and educational activities designed for every age group.",
          },
          {
            icon: "phone",
            title: "Our Contacts",
            description:
              "We are here to answer your questions. Get in touch anytime.",
          },
        ],
      },
    },

    // 4. OUR REGULAR COURSES
    {
      id: "edvi-courses",
      type: "featureGrid",
      props: {
        title: "Our Regular Courses",
        subtitle:
          "Explore our range of programs designed for every stage of learning",
        columns: 3,
        variant: "image-cards",
        features: [
          {
            title: "Class I-XII",
            description:
              "Comprehensive curriculum from primary to senior secondary education.",
            image: "https://placehold.co/400x240/2563eb/fff?text=Class+I-XII",
            link: { text: "Read More", href: "/site/p/cursos" },
          },
          {
            title: "Science Lab",
            description: "Hands-on experiments and discovery-based learning.",
            image: "https://placehold.co/400x240/1d4ed8/fff?text=Science+Lab",
            link: { text: "Read More", href: "/site/p/cursos" },
          },
          {
            title: "Arts & Music",
            description:
              "Creative expression and musical education for all ages.",
            image: "https://placehold.co/400x240/3b82f6/fff?text=Arts+Music",
            link: { text: "Read More", href: "/site/p/cursos" },
          },
        ],
      },
    },

    // 5. WHY CHOOSE US
    {
      id: "edvi-why",
      type: "section",
      props: {
        bg: "#ffffff",
        padding: "6rem 2rem",
        children: [
          {
            id: "edvi-why-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "edvi-why-grid",
                  type: "grid",
                  props: {
                    cols: 2,
                    gap: "3rem",
                    children: [
                      {
                        id: "edvi-why-image",
                        type: "image",
                        props: {
                          src: "https://placehold.co/600x400/1e40af/fff?text=Why+Choose+Us",
                          alt: "Why choose us",
                        },
                      },
                      {
                        id: "edvi-why-content",
                        type: "stack",
                        props: {
                          direction: "col",
                          gap: "1rem",
                          children: [
                            {
                              id: "edvi-why-heading",
                              type: "heading",
                              props: { level: 2, text: "Why choose us?" },
                            },
                            {
                              id: "edvi-why-text",
                              type: "text",
                              props: {
                                text: "a) Experienced educators • b) Safe environment • c) Modern facilities • d) Individual attention • e) Holistic development • f) Parent partnership",
                                size: "md",
                              },
                            },
                            {
                              id: "edvi-why-btn",
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

    // 6. ADMISSION ON GOING (Countdown banner)
    {
      id: "edvi-countdown",
      type: "countdown",
      props: {
        title: "Spring 2024 Admission is Now Open!",
        description: "Secure your child's place for the new semester.",
        showPlaceholders: true,
        buttonText: "Apply Now",
        buttonHref: "/site/p/contato",
        variant: "banner",
        badgeText: "Admission on Going",
        bg: "var(--sg-primary)",
      },
    },

    // 7. OUR SPECIAL CLASSES
    {
      id: "edvi-special",
      type: "section",
      props: {
        bg: "#f8fafc",
        padding: "6rem 2rem",
        children: [
          {
            id: "edvi-special-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "edvi-special-heading",
                  type: "heading",
                  props: {
                    level: 2,
                    text: "Our Special Classes",
                    align: "center",
                  },
                },
                {
                  id: "edvi-special-sub",
                  type: "text",
                  props: {
                    text: "Discover our unique programs",
                    align: "center",
                    size: "lg",
                  },
                },
                {
                  id: "edvi-special-spacer",
                  type: "spacer",
                  props: { height: "2rem" },
                },
                {
                  id: "edvi-special-grid",
                  type: "grid",
                  props: {
                    cols: 4,
                    gap: "1.5rem",
                    children: [
                      {
                        id: "edvi-special-1",
                        type: "image",
                        props: {
                          src: "https://placehold.co/280x200/2563eb/fff?text=Drawing+Painting",
                          alt: "Drawing & Painting",
                        },
                      },
                      {
                        id: "edvi-special-2",
                        type: "image",
                        props: {
                          src: "https://placehold.co/280x200/1d4ed8/fff?text=Science+Lab",
                          alt: "Science Lab",
                        },
                      },
                      {
                        id: "edvi-special-3",
                        type: "image",
                        props: {
                          src: "https://placehold.co/280x200/3b82f6/fff?text=Music",
                          alt: "Music",
                        },
                      },
                      {
                        id: "edvi-special-4",
                        type: "image",
                        props: {
                          src: "https://placehold.co/280x200/60a5fa/fff?text=Sports",
                          alt: "Sports",
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

    // 8. NATURAL PROGRAMS (Carousel)
    {
      id: "edvi-carousel",
      type: "carousel",
      props: {
        slides: [
          {
            image:
              "https://placehold.co/600x400/1e40af/fff?text=Natural+Programs",
            title: "Natural Programs for Children",
            description:
              "Programs that nurture curiosity and growth in a natural, supportive setting. Explore our offerings and find the perfect fit for your child.",
            primaryButton: { text: "Explore More", href: "/site/p/cursos" },
            secondaryButton: { text: "View Courses", href: "/site/p/cursos" },
          },
        ],
        showArrows: true,
        showDots: false,
      },
    },

    // 9. RECENTLY NEWS & BLOGS
    {
      id: "edvi-blog",
      type: "blogCardGrid",
      props: {
        title: "Recently News & Blogs",
        subtitle: "Latest updates and articles from our school",
        columns: 3,
        cards: [
          {
            image: "https://placehold.co/400x220/2563eb/fff?text=News+1",
            date: "24 January, 2024",
            category: "By Admin",
            title: "How to Engage Students in Classroom Activities",
            excerpt:
              "Five proven ways to increase participation and make learning fun for every child.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
          {
            image: "https://placehold.co/400x220/1d4ed8/fff?text=News+2",
            date: "20 January, 2024",
            category: "By Admin",
            title: "The Importance of Early Childhood Education",
            excerpt:
              "Why the first years of school set the foundation for a lifetime of learning.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
          {
            image: "https://placehold.co/400x220/3b82f6/fff?text=News+3",
            date: "15 January, 2024",
            category: "By Admin",
            title: "Parent-Teacher Collaboration Tips",
            excerpt: "Working together for the best outcomes for your child.",
            linkText: "Read More",
            linkHref: "/site/p/avisos",
          },
        ],
      },
    },

    // 10. MEET OUR TEACHERS
    {
      id: "edvi-teachers",
      type: "teamGrid",
      props: {
        title: "Meet Our Teachers",
        subtitle: "Dedicated educators who inspire and support every student",
        columns: 4,
        members: [
          {
            name: "Sarah Johnson",
            role: "Creative Teacher",
            avatar: "https://placehold.co/120x120/2563eb/fff?text=SJ",
          },
          {
            name: "Michael Brown",
            role: "Math Teacher",
            avatar: "https://placehold.co/120x120/1d4ed8/fff?text=MB",
          },
          {
            name: "Emily Davis",
            role: "Science Teacher",
            avatar: "https://placehold.co/120x120/3b82f6/fff?text=ED",
          },
          {
            name: "James Wilson",
            role: "Art Teacher",
            avatar: "https://placehold.co/120x120/60a5fa/fff?text=JW",
          },
        ],
      },
    },

    // 11. WHAT DO YOU WANT TO KNOW (Contact form)
    {
      id: "edvi-contact-section",
      type: "section",
      props: {
        bg: "#ffffff",
        padding: "6rem 2rem",
        children: [
          {
            id: "edvi-contact-container",
            type: "container",
            props: {
              maxWidth: "1200px",
              padding: "0 1rem",
              children: [
                {
                  id: "edvi-contact-grid",
                  type: "grid",
                  props: {
                    cols: 2,
                    gap: "3rem",
                    children: [
                      {
                        id: "edvi-contact-image",
                        type: "image",
                        props: {
                          src: "https://placehold.co/600x400/e2e8f0/64748b?text=Contact+Us",
                          alt: "Contact",
                        },
                      },
                      {
                        id: "edvi-contact-form-wrap",
                        type: "stack",
                        props: {
                          direction: "col",
                          gap: "1rem",
                          children: [
                            {
                              id: "edvi-contact-heading",
                              type: "heading",
                              props: {
                                level: 2,
                                text: "What Do You Want to Know?",
                              },
                            },
                            {
                              id: "edvi-contact-form",
                              type: "form",
                              props: {
                                action: "#",
                                method: "post",
                                submitText: "Send Message",
                                children: [
                                  {
                                    id: "edvi-inp-name",
                                    type: "input",
                                    props: {
                                      name: "name",
                                      label: "Your Name",
                                      placeholder: "Your Name",
                                      type: "text",
                                    },
                                  },
                                  {
                                    id: "edvi-inp-email",
                                    type: "input",
                                    props: {
                                      name: "email",
                                      label: "Your Email",
                                      placeholder: "Your Email",
                                      type: "email",
                                    },
                                  },
                                  {
                                    id: "edvi-inp-phone",
                                    type: "input",
                                    props: {
                                      name: "phone",
                                      label: "Your Phone",
                                      placeholder: "Your Phone",
                                      type: "tel",
                                    },
                                  },
                                  {
                                    id: "edvi-inp-subject",
                                    type: "formSelect",
                                    props: {
                                      name: "subject",
                                      label: "Your Subject",
                                      placeholder: "Select subject",
                                      options: [
                                        {
                                          value: "admission",
                                          label: "Admission",
                                        },
                                        {
                                          value: "info",
                                          label: "General Info",
                                        },
                                        {
                                          value: "feedback",
                                          label: "Feedback",
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    id: "edvi-inp-message",
                                    type: "textarea",
                                    props: {
                                      name: "message",
                                      label: "Your Message",
                                      placeholder: "Your Message",
                                      rows: 4,
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

    // 12. FOOTER
    {
      id: "edvi-footer",
      type: "footer",
      props: {
        logoText: "Edvi",
        description:
          "Quality education and care for your children. Join the Edvi community today.",
        columns: [
          {
            title: "Useful Links",
            links: [
              { text: "Home", href: "/site/p/home" },
              { text: "About Us", href: "/site/p/sobre" },
              { text: "Courses", href: "/site/p/cursos" },
              { text: "Events", href: "/site/p/avisos" },
              { text: "Teachers", href: "/site/p/sobre" },
            ],
          },
          {
            title: "Quick Links",
            links: [
              { text: "Gallery", href: "/site/p/cursos" },
              { text: "Blog", href: "/site/p/avisos" },
              { text: "Pricing", href: "/site/p/contato" },
              { text: "Contact Us", href: "/site/p/contato" },
              { text: "Privacy Policy", href: "/site/p/sobre" },
            ],
          },
          {
            title: "Contact Info",
            links: [
              { text: "123 Education St, City", href: "#" },
              { text: "+1 234 567 890", href: "tel:+1234567890" },
              { text: "info@edvi.edu", href: "mailto:info@edvi.edu" },
            ],
          },
        ],
        social: [
          { platform: "facebook", href: "#" },
          { platform: "twitter", href: "#" },
          { platform: "linkedin", href: "#" },
          { platform: "instagram", href: "#" },
        ],
        copyright: "Copyright © 2024 Edvi. All Rights Reserved.",
        variant: "multi-column",
      },
    },
  ],
};
