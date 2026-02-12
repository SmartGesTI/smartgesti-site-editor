# Template Manual — SmartGesti Site Editor

> Manual completo e didático para criação de templates profissionais.
> Última atualização: 2026-02-11

---

## 📚 Índice

1. [O que é um Template?](#1-o-que-é-um-template)
2. [Como Templates Funcionam](#2-como-templates-funcionam)
3. [Criando seu Primeiro Template](#3-criando-seu-primeiro-template)
4. [Sistema de Temas e Paletas](#4-sistema-de-temas-e-paletas)
5. [Blocos Disponíveis — Referência Completa](#5-blocos-disponíveis--referência-completa)
6. [Sistema de Variações](#6-sistema-de-variações)
7. [Hover Effects e Interatividade](#7-hover-effects-e-interatividade)
8. [Tipografia Avançada](#8-tipografia-avançada)
9. [Image Grid e Layouts Especiais](#9-image-grid-e-layouts-especiais)
10. [Responsividade e Mobile](#10-responsividade-e-mobile)
11. [Usando Blocos Customizados](#11-usando-blocos-customizados)
12. [Troubleshooting](#12-troubleshooting)
13. [Checklist de Qualidade](#13-checklist-de-qualidade)
14. [Referência Rápida](#14-referência-rápida)

---

## 1. O que é um Template?

### 1.1 Definição

Um **template** é um **documento completo pré-configurado** que define:

```
┌─────────────────────────────────────────┐
│          TEMPLATE                       │
├─────────────────────────────────────────┤
│  • Metadados (título, descrição, SEO)  │
│  • Tema (cores, fontes, espaçamentos)  │
│  • Estrutura (blocos organizados)      │
└─────────────────────────────────────────┘
```

**Templates ≠ Blocos:**
- **Bloco** = componente individual (navbar, hero, footer)
- **Template** = conjunto completo de blocos + tema + config

### 1.2 Casos de Uso

| Template | Público | Blocos Típicos |
|----------|---------|----------------|
| `escola-premium` | Instituições de ensino | Navbar, Hero carousel, Courses, Testimonials, Contact, Footer |
| `admin-moderna` | SaaS, apps | Navbar glass, Hero gradient, Features, Pricing, CTA, Footer |
| `portfolio-minimalista` | Freelancers, agências | Navbar pill, Hero minimal, Projects grid, About, Contact, Footer |
| `landing-produto` | Produtos digitais | Navbar, Hero split, Product showcase, Stats, FAQ, CTA, Footer |

### 1.3 Fluxo de Uso

```
Template criado           Template registrado       Usuário seleciona        Documento criado
   (você)          →       (src/shared/templates)  →  (TemplatePicker)    →   (SiteDocument)
                                                                                      ↓
                                                                            Usuário customiza
                                                                            (cores, textos, imagens)
```

---

## 2. Como Templates Funcionam

### 2.1 Arquitetura Interna

```typescript
┌─────────────────────────────────────────────────────────────┐
│                   SiteDocument                              │
├─────────────────────────────────────────────────────────────┤
│  meta: {                                                    │
│    title: "Nome do Template"        ← Exibido no picker    │
│    description: "Descrição curta"   ← Tooltip no picker    │
│    language: "pt-BR"                ← SEO e i18n            │
│  }                                                          │
│                                                             │
│  theme: {                                                   │
│    colors: { primary, secondary, ... }  ← Gera CSS vars    │
│    typography: { fontFamily, sizes }                        │
│    spacing: { unit, scale }                                 │
│    effects: { borderRadius, shadow }                        │
│  }                                                          │
│                                                             │
│  structure: [                         ← Array de blocos    │
│    { id: "navbar", type: "navbar", props: {...} },         │
│    { id: "hero", type: "hero", props: {...} },             │
│    { id: "footer", type: "footer", props: {...} },         │
│  ]                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Geração de CSS Variables

O tema é automaticamente convertido em **80+ CSS variables**:

```typescript
// Tema definido:
theme: {
  colors: {
    primary: "#6366f1",
    background: "#ffffff",
    text: "#0f172a",
  }
}

// Gera automaticamente:
// --sg-primary: #6366f1
// --sg-primary-hover: #5558e3  (escurecido)
// --sg-primary-text: #ffffff   (contraste automático)
// --sg-bg: #ffffff
// --sg-text: #0f172a
// ... +75 variáveis
```

**Por que isso importa?**
- Blocos usam `var(--sg-primary)` em vez de cores hardcoded
- Trocar paleta do template **atualiza automaticamente TODOS os blocos**
- Nenhum bloco precisa ser editado manualmente

### 2.3 Como Blocos Acessam o Tema

**❌ ERRADO (cor hardcoded):**
```typescript
<button style={{ backgroundColor: "#6366f1" }}>
  Clique Aqui
</button>
```

**✅ CORRETO (usa CSS variable):**
```typescript
<button style={{ backgroundColor: "var(--sg-primary)" }}>
  Clique Aqui
</button>
```

---

## 3. Criando seu Primeiro Template

### 3.1 Workflow Passo-a-Passo

```
┌────────────────┐
│ 1. Planejar    │  Definir objetivo, público, blocos necessários
└────┬───────────┘
     │
┌────▼───────────┐
│ 2. Criar       │  Arquivo TS em src/shared/templates/
└────┬───────────┘
     │
┌────▼───────────┐
│ 3. Definir     │  Theme (cores, fontes) + structure (blocos)
└────┬───────────┘
     │
┌────▼───────────┐
│ 4. Registrar   │  Adicionar ao index.ts
└────┬───────────┘
     │
┌────▼───────────┐
│ 5. Testar      │  npm run demo → TemplatePicker
└────┬───────────┘
     │
┌────▼───────────┐
│ 6. Refinar     │  Ajustar espaçamentos, cores, textos
└────────────────┘
```

### 3.2 Exemplo Completo: Template Minimalista

**Arquivo:** `src/shared/templates/portfolio-minimal.ts`

```typescript
import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

/**
 * Template: Portfolio Minimalista
 * Público: Freelancers, designers, fotógrafos
 * Estilo: Clean, muito espaço em branco, tipografia grande
 */
export const portfolioMinimal: SiteDocument = {
  // ============================================================================
  // METADADOS
  // ============================================================================
  meta: {
    title: "Portfolio Minimalista",
    description: "Design limpo e elegante para profissionais criativos",
    language: "pt-BR",
  },

  // ============================================================================
  // TEMA
  // ============================================================================
  theme: {
    colors: {
      primary: "#000000",       // Preto puro
      secondary: "#333333",     // Cinza escuro
      accent: "#000000",        // Preto (accent igual a primary)
      background: "#ffffff",    // Branco puro
      surface: "#fafafa",       // Cinza clarinho
      text: "#0f172a",          // Quase preto
      textMuted: "#64748b",     // Cinza médio
      border: "#e2e8f0",        // Borda sutil
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontFamilyHeading: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      lineHeight: 1.7,          // Mais arejado
      headingLineHeight: 1.1,
    },
    spacing: {
      unit: "0.25rem",
      scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    effects: {
      borderRadius: "0",        // Sem arredondamento (minimalista)
      shadow: "none",           // Sem sombras
      shadowLg: "none",
      transition: "all 0.2s ease",
    },
  },

  // ============================================================================
  // ESTRUTURA
  // ============================================================================
  structure: [
    // ──────────────────────────────────────────────────────────────────────
    // NAVBAR — Pill flutuante, totalmente minimalista
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-navbar",
      type: "navbar",
      props: {
        ...NAVBAR_DEFAULT_PROPS,

        // Conteúdo
        logoText: "Seu Nome",
        links: [
          { text: "Projetos", href: "#projetos" },
          { text: "Sobre", href: "#sobre" },
          { text: "Contato", href: "#contato" },
        ],
        ctaButton: { text: "Fale Comigo", href: "#contato" },

        // Layout
        layout: "centered",
        sticky: true,
        floating: true,

        // Aparência minimalista
        bg: "#ffffff",
        opacity: 100,
        blurOpacity: 0,
        borderRadius: 32,        // Pill shape
        shadow: "md",
        borderPosition: "all",
        borderWidth: 1,
        borderColor: "#e5e7eb",

        // Links
        linkColor: "#374151",
        linkHoverColor: "#000000",
        linkFontSize: "sm",
        linkHoverEffect: "underline",
        linkHoverIntensity: 50,

        // Botão CTA
        buttonVariant: "solid",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
        buttonBorderRadius: 20,
        buttonSize: "sm",
        buttonHoverEffect: "darken",
        buttonHoverIntensity: 20,
        buttonHoverOverlay: "none",
      },
    },

    // ──────────────────────────────────────────────────────────────────────
    // HERO — Minimal, texto gigante, 1 botão
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-hero",
      type: "hero",
      props: {
        variation: "hero-minimal",
        variant: "centered",

        // Conteúdo (minimalista = menos é mais)
        title: "Designer & Desenvolvedor",
        description: "Criando experiências digitais memoráveis desde 2015.",
        // Sem subtitle, sem badge, sem secondary button

        // Botão único
        primaryButton: { text: "Ver Projetos", href: "#projetos" },

        // Layout
        align: "center",
        minHeight: "85vh",
        contentMaxWidth: "800px",
        paddingY: "120px",

        // Aparência
        background: "#fafafa",

        // Cores do texto
        titleColor: "#000000",
        descriptionColor: "#64748b",

        // Tipografia grande e impactante
        titleTypography: {
          fontSize: 72,
          fontWeight: "bold",
          effect: "none",
        },
        descriptionTypography: {
          fontSize: 20,
          fontWeight: "normal",
        },

        // Botão
        primaryButtonVariant: "solid",
        primaryButtonColor: "#000000",
        primaryButtonTextColor: "#ffffff",
        primaryButtonRadius: 0,      // Cantos retos (minimalista)
        buttonSize: "lg",
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "none",
      },
    },

    // ──────────────────────────────────────────────────────────────────────
    // PROJECTS — Grid de projetos com imagens
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-projects",
      type: "featureGrid",
      props: {
        title: "Projetos Selecionados",
        subtitle: "",
        columns: 3,
        variant: "image-cards",
        features: [
          {
            image: "https://placehold.co/600x400/000000/ffffff?text=Projeto+1",
            title: "Nome do Projeto",
            description: "Branding e desenvolvimento web para startup de tecnologia.",
            link: { text: "Ver Detalhes", href: "#" },
          },
          {
            image: "https://placehold.co/600x400/000000/ffffff?text=Projeto+2",
            title: "E-commerce de Moda",
            description: "Design de interface e experiência do usuário.",
            link: { text: "Ver Detalhes", href: "#" },
          },
          {
            image: "https://placehold.co/600x400/000000/ffffff?text=Projeto+3",
            title: "App Mobile Fitness",
            description: "Design UI/UX e prototipagem interativa.",
            link: { text: "Ver Detalhes", href: "#" },
          },
        ],
      },
    },

    // ──────────────────────────────────────────────────────────────────────
    // ABOUT — Sobre você
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-about",
      type: "aboutSection",
      props: {
        title: "Sobre Mim",
        subtitle: "Quem Sou",
        description: "Designer e desenvolvedor full-stack apaixonado por criar experiências digitais que fazem a diferença.",
        secondaryDescription: "Com mais de 8 anos de experiência, já ajudei dezenas de empresas a transformar suas ideias em produtos digitais de sucesso.",
        variant: "centered",
        image: "https://placehold.co/600x600/fafafa/000000?text=Sua+Foto",
        bg: "#ffffff",

        achievements: [
          { text: "50+ projetos entregues" },
          { text: "100% satisfação dos clientes" },
          { text: "Premiado em 2024" },
        ],

        primaryButton: { text: "Baixar CV", href: "#" },
        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "none",
      },
    },

    // ──────────────────────────────────────────────────────────────────────
    // CONTACT — Minimalista, form-only
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-contact",
      type: "contactSection",
      props: {
        title: "Vamos Conversar?",
        subtitle: "Contato",
        description: "Estou sempre aberto a novos projetos e colaborações.",
        variant: "form-only",
        bg: "#fafafa",

        formTitle: "Envie uma Mensagem",
        formFields: [
          { name: "name", label: "Nome", type: "text", placeholder: "Seu nome", required: true },
          { name: "email", label: "Email", type: "email", placeholder: "email@exemplo.com", required: true },
          { name: "message", label: "Mensagem", type: "textarea", placeholder: "Conte-me sobre seu projeto...", required: true },
        ],
        submitText: "Enviar",

        buttonHoverEffect: "scale",
        buttonHoverIntensity: 50,
        buttonHoverOverlay: "none",
      },
    },

    // ──────────────────────────────────────────────────────────────────────
    // FOOTER — Simples, centralizado
    // ──────────────────────────────────────────────────────────────────────
    {
      id: "portfolio-footer",
      type: "footer",
      props: {
        logoText: "Seu Nome",
        description: "Designer & Desenvolvedor",
        variant: "simple",
        social: [
          { platform: "linkedin", href: "https://linkedin.com/in/seuperfil" },
          { platform: "instagram", href: "https://instagram.com/seuperfil" },
          { platform: "twitter", href: "https://twitter.com/seuperfil" },
        ],
        copyright: "© 2025 Seu Nome. Todos os direitos reservados.",

        linkHoverEffect: "underline",
        linkHoverIntensity: 50,
        linkHoverColor: "#000000",
      },
    },
  ],
};
```

### 3.3 Registrando o Template

**Arquivo:** `src/shared/templates/index.ts`

```typescript
import { escolaEdvi } from "./escola-edvi";
import { escolaPremium } from "./escola-premium";
import { escolaZilom } from "./escola-zilom";
import { portfolioMinimal } from "./portfolio-minimal";  // ← NOVO

export const templates = {
  "escola-edvi": escolaEdvi,
  "escola-premium": escolaPremium,
  "escola-zilom": escolaZilom,
  "portfolio-minimal": portfolioMinimal,  // ← NOVO
} as const;

export type TemplateId = keyof typeof templates;
```

### 3.4 Testando o Template

```bash
# 1. Build do editor
npm run build

# 2. Rodar demo
npm run demo

# 3. Abrir navegador em http://localhost:5173
# 4. Clicar em "Novo Template"
# 5. Seu template deve aparecer no TemplatePicker
```

---

## 4. Sistema de Temas e Paletas

### 4.1 Estrutura Completa do Theme

```typescript
theme: {
  // ════════════════════════════════════════════════════════════════════
  // CORES (11 obrigatórias)
  // ════════════════════════════════════════════════════════════════════
  colors: {
    primary: "#6366f1",       // Cor principal da marca
    secondary: "#4f46e5",     // Cor secundária
    accent: "#8b5cf6",        // Cor de destaque (CTAs especiais)
    background: "#ffffff",    // Fundo da página
    surface: "#f8fafc",       // Fundo de cards/painéis
    text: "#0f172a",          // Cor do texto principal
    textMuted: "#64748b",     // Cor do texto secundário
    border: "#e2e8f0",        // Cor das bordas
    success: "#10b981",       // Estado de sucesso
    warning: "#f59e0b",       // Estado de alerta
    error: "#ef4444",         // Estado de erro
  },

  // ════════════════════════════════════════════════════════════════════
  // TIPOGRAFIA
  // ════════════════════════════════════════════════════════════════════
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontFamilyHeading: "Inter, system-ui, sans-serif",  // Pode ser diferente
    baseFontSize: "16px",
    lineHeight: 1.6,          // 1.5-1.7 recomendado para leitura
    headingLineHeight: 1.2,   // 1.1-1.3 para títulos
  },

  // ════════════════════════════════════════════════════════════════════
  // ESPAÇAMENTO
  // ════════════════════════════════════════════════════════════════════
  spacing: {
    unit: "0.25rem",          // Unidade base (4px)
    scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64],  // Multiplicadores
  },

  // ════════════════════════════════════════════════════════════════════
  // EFEITOS
  // ════════════════════════════════════════════════════════════════════
  effects: {
    borderRadius: "0.75rem",  // 12px padrão
    shadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    shadowLg: "0 25px 50px -12px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
  },
}
```

### 4.2 Paletas Pré-Configuradas

#### 🏢 Corporativo (Azul Profissional)

```typescript
colors: {
  primary: "#1e40af",       // Azul escuro
  secondary: "#1d4ed8",     // Azul royal
  accent: "#0ea5e9",        // Azul claro
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** Sites institucionais, B2B, consultorias, escritórios

---

#### 🎨 Moderno (Índigo Vibrante)

```typescript
colors: {
  primary: "#6366f1",       // Índigo moderno
  secondary: "#4f46e5",     // Índigo escuro
  accent: "#8b5cf6",        // Roxo claro
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** SaaS, startups, tech, apps modernos

---

#### 🎓 Educacional (Azul Confiável)

```typescript
colors: {
  primary: "#2563eb",       // Azul educação
  secondary: "#1d4ed8",     // Azul escuro
  accent: "#3b82f6",        // Azul médio
  background: "#ffffff",
  surface: "#f0f9ff",       // Azul muito claro
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** Escolas, universidades, cursos online, educação

---

#### 💖 Vibrante (Rosa Energia)

```typescript
colors: {
  primary: "#ec4899",       // Rosa pink
  secondary: "#db2777",     // Rosa escuro
  accent: "#f59e0b",        // Laranja
  background: "#ffffff",
  surface: "#fdf2f8",       // Rosa muito claro
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** Moda, beleza, eventos, criatividade

---

#### 🌿 Natureza (Verde Sustentável)

```typescript
colors: {
  primary: "#059669",       // Verde esmeralda
  secondary: "#047857",     // Verde escuro
  accent: "#10b981",        // Verde claro
  background: "#ffffff",
  surface: "#f0fdf4",       // Verde muito claro
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** Sustentabilidade, saúde, orgânicos, bem-estar

---

#### 🌑 Dark Mode (Escuro Elegante)

```typescript
colors: {
  primary: "#6366f1",       // Índigo brilhante
  secondary: "#4f46e5",     // Índigo escuro
  accent: "#a78bfa",        // Roxo suave
  background: "#0f172a",    // Quase preto
  surface: "#1e293b",       // Cinza escuro
  text: "#f1f5f9",          // Branco suave
  textMuted: "#94a3b8",     // Cinza claro
  border: "#334155",        // Borda cinza
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}
```

**Quando usar:** Tech, gaming, produtos premium, dark mode nativo

---

### 4.3 Fontes e Combinações

#### Inter (Neutro Universal)

```typescript
typography: {
  fontFamily: "Inter, system-ui, sans-serif",
  fontFamilyHeading: "Inter, system-ui, sans-serif",
}
```

**Características:**
- Neutro e moderno
- Excelente legibilidade
- Funciona em qualquer contexto
- **Recomendado para:** Corpo de texto + Headings (padrão do sistema)

---

#### Plus Jakarta Sans (Premium Educacional)

```typescript
typography: {
  fontFamily: "Inter, system-ui, sans-serif",           // Body
  fontFamilyHeading: "Plus Jakarta Sans, system-ui, sans-serif",  // Headings
}
```

**Características:**
- Geométrica e elegante
- Transmite profissionalismo
- **Recomendado para:** Escolas premium, instituições

---

#### Poppins (Amigável e Lúdico)

```typescript
typography: {
  fontFamily: "Inter, system-ui, sans-serif",
  fontFamilyHeading: "Poppins, system-ui, sans-serif",
}
```

**Características:**
- Arredondada e amigável
- Transmite acessibilidade
- **Recomendado para:** Educação infantil, produtos jovens

---

#### Merriweather (Clássico Institucional)

```typescript
typography: {
  fontFamily: "Inter, system-ui, sans-serif",
  fontFamilyHeading: "Merriweather, Georgia, serif",
}
```

**Características:**
- Serif clássica
- Transmite tradição e confiança
- **Recomendado para:** Universidades, instituições antigas

---

### 4.4 Como o Tema se Torna CSS Variables

```typescript
// Theme definido no template:
theme: {
  colors: {
    primary: "#6366f1",
    background: "#ffffff",
    text: "#0f172a",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
  effects: {
    borderRadius: "0.75rem",
    shadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  }
}

// ↓ Gera automaticamente (via generateThemeCSSVariables)

:root {
  /* Cores primárias */
  --sg-primary: #6366f1;
  --sg-primary-hover: #5558e3;         /* Escurecido 10% */
  --sg-primary-text: #ffffff;          /* Contraste automático */

  /* Cores de fundo */
  --sg-bg: #ffffff;
  --sg-surface: #f8fafc;

  /* Texto */
  --sg-text: #0f172a;
  --sg-muted-text: #64748b;

  /* Tipografia */
  --sg-font-body: Inter, system-ui, sans-serif;
  --sg-font-heading: Inter, system-ui, sans-serif;
  --sg-heading-h1: 3rem;
  --sg-heading-h2: 2.25rem;
  --sg-heading-h3: 1.875rem;

  /* Efeitos */
  --sg-card-radius: 0.75rem;
  --sg-card-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  --sg-button-radius: 0.5rem;

  /* + 60 variáveis adicionais */
}
```

**Como blocos usam:**

```typescript
// Navbar usa:
backgroundColor: "var(--sg-surface)"
color: "var(--sg-text)"

// Button usa:
backgroundColor: "var(--sg-primary)"
color: "var(--sg-primary-text)"

// Card usa:
borderRadius: "var(--sg-card-radius)"
boxShadow: "var(--sg-card-shadow)"
```

---

## 5. Blocos Disponíveis — Referência Completa

### 5.1 Navbar

**Tipo:** `navbar` | **Categoria:** sections

O bloco de navegação suporta **5 variações** (ver seção 6) e personalização visual extensiva.

```typescript
{
  id: "meu-navbar",
  type: "navbar",
  props: {
    ...NAVBAR_DEFAULT_PROPS,  // ⚠️ SEMPRE fazer spread dos defaults

    // ═══════════════════════════════════════════════════════════════
    // CONTEÚDO
    // ═══════════════════════════════════════════════════════════════
    links: [
      { text: "Home", href: "/site/p/home" },
      { text: "Sobre", href: "#about" },
      { text: "Serviços", href: "#services" },
      { text: "Contato", href: "#contact" },
    ],
    ctaButton: { text: "Começar", href: "#contact" },
    logo: "https://url-do-logo.png",    // opcional
    logoText: "Minha Marca",             // texto se não tiver logo
    logoHeight: 70,                      // 40-130px

    // ═══════════════════════════════════════════════════════════════
    // POSICIONAMENTO
    // ═══════════════════════════════════════════════════════════════
    layout: "expanded",        // "expanded" | "centered" | "compact"
    sticky: true,              // fixar no topo ao rolar
    floating: false,           // flutuar sobre o conteúdo (tipo glassmorphism)

    // ═══════════════════════════════════════════════════════════════
    // APARÊNCIA
    // ═══════════════════════════════════════════════════════════════
    bg: "#ffffff",             // cor de fundo
    opacity: 100,              // 0-100 (transparência)
    blurOpacity: 0,            // 0-100 (efeito blur/glassmorphism)
    borderRadius: 0,           // 0-32px (cantos arredondados)
    shadow: "sm",              // "none" | "sm" | "md" | "lg" | "xl"
    borderPosition: "none",    // "none" | "all" | "top" | "bottom" | "left" | "right"
    borderWidth: 1,            // 1-4px
    borderColor: "#e5e7eb",

    // ═══════════════════════════════════════════════════════════════
    // LINKS
    // ═══════════════════════════════════════════════════════════════
    linkColor: "#374151",
    linkHoverColor: "#2563eb",
    linkFontSize: "md",        // "sm" | "md" | "lg"
    linkHoverEffect: "background",  // ver seção 7 (Hover Effects)
    linkHoverIntensity: 50,

    // ═══════════════════════════════════════════════════════════════
    // BOTÃO CTA
    // ═══════════════════════════════════════════════════════════════
    buttonVariant: "solid",          // "solid" | "outline" | "ghost"
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    buttonBorderRadius: 8,           // 0-32px
    buttonSize: "md",                // "sm" | "md" | "lg"
    buttonHoverEffect: "darken",     // ver seção 7
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",      // "none" | "shine" | "fill" | etc
    buttonHoverIconName: "arrow-right",
  },
}
```

**Variações disponíveis:** `navbar-simples`, `navbar-moderno`, `navbar-glass`, `navbar-elegante`, `navbar-pill`

---

### 5.2 Hero

**Tipo:** `hero` | **Categoria:** sections

O bloco mais complexo do sistema com **40+ props editáveis** e **7 variações**.

```typescript
{
  id: "meu-hero",
  type: "hero",
  props: {
    // ═══════════════════════════════════════════════════════════════
    // VARIAÇÃO (define o layout base)
    // ═══════════════════════════════════════════════════════════════
    variation: "hero-split",     // ver seção 6 para todas as variações
    variant: "split",            // "centered" | "split" | "image-bg"

    // ═══════════════════════════════════════════════════════════════
    // CONTEÚDO
    // ═══════════════════════════════════════════════════════════════
    title: "Título Principal",
    subtitle: "Subtítulo ou tagline",
    description: "Descrição detalhada do produto ou serviço.",
    badge: "Lançamento",         // badge acima do título (opcional)

    // ═══════════════════════════════════════════════════════════════
    // BOTÕES
    // ═══════════════════════════════════════════════════════════════
    primaryButton: { text: "Começar Agora", href: "#contact" },
    secondaryButton: { text: "Saiba Mais", href: "#about" },

    // ═══════════════════════════════════════════════════════════════
    // MÍDIA (imagem única)
    // ═══════════════════════════════════════════════════════════════
    image: "https://placehold.co/600x500/6366f1/fff?text=Hero",
    imagePosition: "right",      // "right" | "left" (só p/ variant split)
    imageRadius: 16,             // 0-32px
    imageShadow: "lg",           // "none" | "sm" | "md" | "lg" | "xl"

    // ═══════════════════════════════════════════════════════════════
    // IMAGE GRID (alternativa à imagem única) — ver seção 9
    // ═══════════════════════════════════════════════════════════════
    imageGridEnabled: false,     // true ativa o grid de imagens
    imageGridPreset: "three-left",
    imageGridGap: "0.5rem",
    imageGridImages: [
      { src: "url1.jpg", alt: "Img 1" },
      { src: "url2.jpg", alt: "Img 2" },
      { src: "url3.jpg", alt: "Img 3" },
    ],

    // ═══════════════════════════════════════════════════════════════
    // LAYOUT
    // ═══════════════════════════════════════════════════════════════
    align: "left",               // "left" | "center" | "right"
    contentPosition: "center",   // "left" | "center" | "right"
    contentSpacing: "default",   // "compact" | "default" | "spacious"
    blockGap: "default",         // "default" | "wide" | "x-wide"
    minHeight: "85vh",           // "70vh" | "85vh" | "100vh" | "600px"
    contentMaxWidth: "700px",    // "700px" | "900px" | "1200px"
    paddingY: "100px",           // padding vertical

    // ═══════════════════════════════════════════════════════════════
    // APARÊNCIA
    // ═══════════════════════════════════════════════════════════════
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    overlay: false,              // ativar overlay sobre imagem de fundo
    overlayColor: "rgba(0,0,0,0.5)",  // cor do overlay (suporta gradientes CSS)
    showWave: false,             // onda decorativa no rodapé da seção
    waveColor: "rgba(255,255,255,0.1)",

    // ═══════════════════════════════════════════════════════════════
    // CORES DO TEXTO
    // ═══════════════════════════════════════════════════════════════
    titleColor: "#ffffff",
    subtitleColor: "#e0e7ff",
    descriptionColor: "#c7d2fe",

    // ═══════════════════════════════════════════════════════════════
    // TIPOGRAFIA AVANÇADA (ver seção 8)
    // ═══════════════════════════════════════════════════════════════
    titleTypography: {
      fontSize: 48,
      fontWeight: "bold",
      effect: "none",
    },
    subtitleTypography: { fontSize: 24, fontWeight: "medium" },
    descriptionTypography: { fontSize: 16, fontWeight: "normal" },

    // ═══════════════════════════════════════════════════════════════
    // BADGE
    // ═══════════════════════════════════════════════════════════════
    badgeColor: "#3b82f6",       // cor de fundo do badge
    badgeTextColor: "#ffffff",   // cor do texto do badge

    // ═══════════════════════════════════════════════════════════════
    // BOTÃO PRIMÁRIO
    // ═══════════════════════════════════════════════════════════════
    primaryButtonVariant: "solid",     // "solid" | "outline" | "ghost"
    primaryButtonColor: "#6366f1",     // cor de fundo (opcional, usa --sg-primary)
    primaryButtonTextColor: "#ffffff",
    primaryButtonRadius: 8,            // 0-50px

    // ═══════════════════════════════════════════════════════════════
    // BOTÃO SECUNDÁRIO
    // ═══════════════════════════════════════════════════════════════
    secondaryButtonVariant: "outline",
    secondaryButtonColor: "#ffffff",
    secondaryButtonTextColor: "#ffffff",
    secondaryButtonRadius: 8,

    // ═══════════════════════════════════════════════════════════════
    // TAMANHO DOS BOTÕES
    // ═══════════════════════════════════════════════════════════════
    buttonSize: "md",            // "sm" | "md" | "lg"

    // ═══════════════════════════════════════════════════════════════
    // HOVER EFFECTS (ver seção 7)
    // ═══════════════════════════════════════════════════════════════
    buttonHoverEffect: "glow",         // ver seção 7
    buttonHoverIntensity: 60,          // 10-100
    buttonHoverOverlay: "shine",       // ver seção 7
    buttonHoverIconName: "arrow-right",

    // ═══════════════════════════════════════════════════════════════
    // CARROSSEL (só para variation hero-carousel)
    // ═══════════════════════════════════════════════════════════════
    carouselImages: [
      "https://placehold.co/1920x1080/1e3a5f/fff?text=Slide+1",
      "https://placehold.co/1920x1080/2d5016/fff?text=Slide+2",
    ],
    carouselInterval: 5,         // 3-10 segundos
    carouselTransition: "crossfade",
  },
}
```

**Variações disponíveis:** `hero-split`, `hero-parallax`, `hero-overlay`, `hero-gradient`, `hero-minimal`, `hero-card`, `hero-carousel`

---

### 5.3 Footer

**Tipo:** `footer` | **Categoria:** sections

```typescript
{
  id: "meu-footer",
  type: "footer",
  props: {
    logo: "https://url-do-logo.png",
    logoText: "Minha Marca",
    description: "Descrição curta da empresa.",
    variant: "multi-column",   // "simple" | "multi-column"
    columns: [
      {
        title: "Produto",
        links: [
          { text: "Features", href: "#features" },
          { text: "Preços", href: "#pricing" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { text: "Sobre", href: "#about" },
          { text: "Contato", href: "#contact" },
        ],
      },
    ],
    social: [
      { platform: "instagram", href: "https://instagram.com/..." },
      { platform: "linkedin", href: "https://linkedin.com/..." },
      { platform: "youtube", href: "https://youtube.com/..." },
      { platform: "whatsapp", href: "https://wa.me/..." },
      { platform: "facebook", href: "https://facebook.com/..." },
      { platform: "twitter", href: "https://twitter.com/..." },
    ],
    copyright: "© 2025 Empresa. Todos os direitos reservados.",

    // Hover Effects
    linkHoverEffect: "underline-center",
    linkHoverIntensity: 50,
    linkHoverColor: "#818cf8",
  },
}
```

---

### 5.4 Stats

**Tipo:** `stats` | **Categoria:** sections

Exibe métricas e números impactantes.

```typescript
{
  id: "meu-stats",
  type: "stats",
  props: {
    title: "Números que Falam",
    subtitle: "Resultados reais",
    items: [
      { value: "500+", label: "Clientes Atendidos" },
      { value: "99.9%", label: "Uptime Garantido" },
      { value: "50k+", label: "Usuários Ativos" },
      { value: "4.9", label: "Nota dos Clientes", suffix: "/5" },
    ],
  },
}
```

---

### 5.5 Feature Grid

**Tipo:** `featureGrid` | **Categoria:** sections

O bloco mais versátil — usado para features, benefícios, serviços, etapas, etc.

```typescript
{
  id: "meu-features",
  type: "featureGrid",
  props: {
    title: "Nossos Diferenciais",
    subtitle: "Por que nos escolher",
    columns: 3,                // 2 | 3 | 4
    variant: "cards",          // "default" | "cards" | "image-cards"
    features: [
      {
        icon: "shield",        // nome do ícone Lucide
        title: "Segurança Total",
        description: "Dados criptografados e backups automáticos.",
        image: "url",          // só para variant "image-cards"
        link: { text: "Saiba mais", href: "#" },  // opcional
      },
      // ... mais features
    ],
  },
}
```

**Ícones disponíveis:** `star`, `check`, `zap`, `shield`, `rocket`, `globe`, `bar-chart`, `users`, `heart`, `mail`, `phone`, `map-pin`, `settings`, `search`, `menu`, `plus`, `minus`, `trophy`, `arrow-right`, `user`

**Variantes:**
- `default` — Ícone + título + descrição (simples, sem card)
- `cards` — Card elevado com sombra + ícone + título + descrição
- `image-cards` — Imagem no topo + título + descrição + link

---

### 5.6 CTA (Call-to-Action)

**Tipo:** `cta` | **Categoria:** sections

```typescript
{
  id: "meu-cta",
  type: "cta",
  props: {
    title: "Pronto para começar?",
    description: "Junte-se a milhares de usuários satisfeitos.",
    primaryButton: { text: "Começar Agora", href: "#contact" },
    secondaryButton: { text: "Ver Planos", href: "#pricing" },
    variant: "gradient",       // "default" | "centered" | "split" | "gradient"
    bg: "#f0f0ff",             // cor de fundo (ignorado se gradient)
    buttonSize: "md",

    // Hover Effects
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
    buttonHoverIconName: "arrow-right",
  },
}
```

**Variantes:**
- `default` — Fundo sólido, botões lado a lado
- `centered` — Texto e botões centralizados
- `split` — Texto à esquerda, botões à direita
- `gradient` — Fundo com gradiente vibrante

---

### 5.7 Outros Blocos Comuns

| Bloco | Uso | Props Principais |
|-------|-----|------------------|
| `productShowcase` | Mostrar produtos/módulos | `products`, `variant` (alternating/grid/stacked) |
| `aboutSection` | Seção "Sobre Nós" | `variant` (image-left/image-right/centered), `achievements`, `stats` |
| `contactSection` | Formulário de contato | `variant` (split/stacked/form-only), `formFields`, `contactInfo` |
| `testimonialGrid` | Depoimentos de clientes | `testimonials`, `columns` (2/3/4) |
| `faq` | Perguntas frequentes | `items` (array de {question, answer}) |
| `pricing` | Tabela de preços | `plans` (array de planos), `highlighted` |
| `logoCloud` | Logos de clientes/parceiros | `logos`, `grayscale` |
| `teamGrid` | Membros da equipe | `members`, `columns` (2/3/4) |
| `blogCardGrid` | Grid de posts do blog | `cards`, `columns` (2/3/4) |
| `courseCardGrid` | Grid de cursos | `cards`, `columns` (2/3/4) |
| `categoryCardGrid` | Grid de categorias | `categories`, `columns` (2/3/4) |
| `countdown` | Contador regressivo | `endDate`, `variant` (default/banner) |
| `carousel` | Carrossel de imagens | `slides`, `showArrows`, `autoplay` |

---

### 5.8 Blocos de Layout (Composição)

Para layouts customizados que não se encaixam em nenhum bloco pré-fabricado:

```typescript
{
  id: "custom-section",
  type: "section",
  props: {
    bg: "#f0f4ff",
    padding: "6rem 2rem",
    children: [
      {
        id: "custom-container",
        type: "container",
        props: {
          maxWidth: "1200px",
          children: [
            {
              id: "custom-grid",
              type: "grid",
              props: {
                cols: 2,
                gap: "3rem",
                children: [
                  { id: "col1", type: "image", props: { src: "url", alt: "..." } },
                  {
                    id: "col2",
                    type: "stack",
                    props: {
                      direction: "col",
                      gap: "1rem",
                      children: [
                        { id: "h", type: "heading", props: { level: 2, text: "Título" } },
                        { id: "p", type: "text", props: { text: "Parágrafo..." } },
                        { id: "b", type: "button", props: { text: "CTA", href: "#", variant: "primary" } },
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
}
```

**Blocos primitivos:**

| Tipo | Props | Descrição |
|------|-------|-----------|
| `section` | `bg`, `padding`, `children` | Wrapper de seção |
| `container` | `maxWidth`, `padding`, `children` | Limita largura (centraliza conteúdo) |
| `grid` | `cols` (1-12), `gap`, `children` | CSS Grid |
| `stack` | `direction` (col/row), `gap`, `align`, `justify`, `children` | Flexbox |
| `box` | `bg`, `border`, `radius`, `shadow`, `padding`, `children` | Div estilizado |
| `spacer` | `height` | Espaço vertical |
| `heading` | `level` (1-6), `text`, `align`, `color` | Título H1-H6 |
| `text` | `text`, `align`, `size`, `color` | Parágrafo |
| `image` | `src`, `alt`, `width`, `height`, `objectFit` | Imagem |
| `button` | `text`, `href`, `variant`, `size`, hover effects | Botão CTA |
| `link` | `text`, `href`, `target`, hover effects | Link |
| `divider` | `color`, `thickness` | Linha divisória |
| `icon` | `name`, `size`, `color` | Ícone Lucide |
| `badge` | `text`, `variant`, `size` | Badge/tag |
| `avatar` | `src`, `name`, `size` | Avatar circular |
| `video` | `src`, `poster`, `aspectRatio`, `autoplay`, `controls` | Vídeo |

---

## 6. Sistema de Variações

### 6.1 Variações do Hero (7)

| ID | Nome | Layout | Imagem | Altura | Características |
|----|------|--------|--------|--------|-----------------|
| `hero-split` | Dividido | 2 colunas | Direita | 600px | Conteúdo esquerda, imagem direita |
| `hero-parallax` | Parallax | Fullwidth | Fundo | 85vh | Imagem fixa, overlay gradiente diagonal |
| `hero-overlay` | Fullscreen | Fullwidth | Fundo | 100vh | Overlay pesado, badge, botões pill (50px) |
| `hero-gradient` | Gradiente | Centralizado | Nenhuma | 90vh | Gradiente vibrante, onda decorativa |
| `hero-card` | Card | Card flutuante | Fundo | 70vh | Card branco sobre imagem, badge verde |
| `hero-minimal` | Minimal | Centralizado | Nenhuma | 70vh | Fundo cinza, 1 botão, design limpo |
| `hero-carousel` | Carrossel | Fullwidth | Slideshow | 90vh | 3+ imagens com crossfade |

#### Detalhes por Variação

**hero-split:**
- `variant: "split"`, `align: "left"`, `imagePosition: "right"`
- Botões: solid + outline, 8px radius
- Ideal para: páginas de produto, landing pages de serviço

**hero-parallax:**
- `variant: "image-bg"`, `overlay: true`
- `overlayColor: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)"`
- Texto branco, botão secundário com borda branca
- Ideal para: sites institucionais, portfólios

**hero-overlay:**
- `variant: "image-bg"`, `minHeight: "100vh"`
- `overlayColor: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)"`
- Badge azul, botões totalmente arredondados (50px), ghost secondary
- Ideal para: blogs, artigos em destaque

**hero-gradient:**
- `variant: "centered"`, `background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"`
- Badge semi-transparente, botões brancos arredondados, onda decorativa
- Ideal para: SaaS, apps, startups

**hero-minimal:**
- `variant: "centered"`, `background: "#fafafa"`
- Texto escuro, 1 botão preto grande, sem imagem
- Ideal para: portfólios, sites minimalistas

**hero-card:**
- `variant: "image-bg"`, `contentMaxWidth: "450px"`
- Card branco sobre imagem, badge verde, overlay leve (0.3)
- Ideal para: escolas, eventos, matrículas

**hero-carousel:**
- `variant: "image-bg"`, `carouselImages: [3 URLs]`
- Transição crossfade 5s, overlay gradiente vertical
- Ideal para: universidades, eventos com múltiplas fotos

---

### 6.2 Variações do Navbar (5)

| ID | Nome | Floating | Radius | Shadow | Opacity | Blur | Botão |
|----|------|----------|--------|--------|---------|------|-------|
| `navbar-simples` | Simples | Não | 0 | none | 100 | 0 | solid, 4px |
| `navbar-moderno` | Moderno | Não | 0 | md | 100 | 0 | solid, 8px |
| `navbar-glass` | Glass | Sim | 16px | lg | 75 | 60 | solid, 10px |
| `navbar-elegante` | Elegante | Não | 0 | sm | 100 | 0 | outline, 6px |
| `navbar-pill` | Pill | Sim | 32px | xl | 100 | 0 | solid, 20px |

**Notas:**
- Navbars flutuantes (`floating: true`) sobrepõe o conteúdo do hero
- Glass usa transparência (opacity 75%) + blur (60%) para efeito glassmorphism
- Pill tem cantos muito arredondados (32px) criando formato de pílula

---

## 7. Hover Effects e Interatividade

### 7.1 Efeitos de Hover em Links

**Blocos que suportam:** navbar, footer, link

| Efeito | Valor | Descrição Visual |
|--------|-------|------------------|
| Nenhum | `"none"` | Sem efeito |
| Background | `"background"` | Fundo colorido aparece (com opacidade) |
| Underline | `"underline"` | Sublinhado desliza da esquerda para direita |
| Underline Center | `"underline-center"` | Sublinhado cresce do centro para fora |
| Slide BG | `"slide-bg"` | Fundo desliza de baixo para cima |
| Scale | `"scale"` | Texto aumenta de tamanho (1.05x-1.15x) |
| Glow | `"glow"` | Brilho neon ao redor do texto |

**Props:**
```typescript
linkHoverEffect: "underline",    // efeito escolhido
linkHoverIntensity: 50,          // 10-100
linkHoverColor: "#6366f1",       // cor do efeito
```

---

### 7.2 Efeitos de Hover em Botões

**Blocos que suportam:** hero, navbar, cta, productShowcase, aboutSection, contactSection, button

| Efeito | Valor | Descrição Visual |
|--------|-------|------------------|
| Nenhum | `"none"` | Sem efeito |
| Escurecer | `"darken"` | Escurece a cor + eleva o botão |
| Clarear | `"lighten"` | Clareia a cor + eleva o botão |
| Escala | `"scale"` | Botão aumenta de tamanho (1.05x-1.12x) |
| Brilho Neon | `"glow"` | Halo luminoso ao redor do botão |
| Sombra | `"shadow"` | Sombra dramática + elevação |
| Pulso | `"pulse"` | Animação de pulso infinita |

**Props:**
```typescript
buttonHoverEffect: "scale",      // efeito principal
buttonHoverIntensity: 50,        // 10-100 (intensidade)
```

---

### 7.3 Efeitos Overlay em Botões (Adicional)

Sobrepostos ao efeito principal, adicionam um efeito visual extra.

| Overlay | Valor | Descrição Visual |
|---------|-------|------------------|
| Nenhum | `"none"` | Sem overlay |
| Brilho | `"shine"` | Faixa de luz branca desliza pelo botão |
| Preenchimento | `"fill"` | Cor preenche da esquerda para direita |
| Salto | `"bounce"` | Botão faz pequeno salto animado |
| Ícone | `"icon"` | Ícone aparece com fade+slide |
| Borda Glow | `"border-glow"` | Borda pulsa com brilho |

**Props:**
```typescript
buttonHoverOverlay: "shine",           // overlay escolhido
buttonHoverIconName: "arrow-right",    // só para overlay "icon"
```

**Ícones disponíveis para overlay "icon":**
`arrow-right`, `chevron-right`, `external-link`, `plus`, `check`, `download`, `send`, `play`, `star`, `heart`, `zap`, `sparkles`, `rocket`, `fire`, `gift`, `trophy`, `mail`, `phone`, `cart`, `tag`, `eye`, `lock`, `user`, `settings`

---

### 7.4 Combinações Recomendadas

| Estilo | buttonHoverEffect | Intensidade | buttonHoverOverlay |
|--------|------------------|-------------|-------------------|
| Sutil | `"darken"` | 30 | `"none"` |
| Profissional | `"scale"` | 50 | `"shine"` |
| Moderno | `"glow"` | 60 | `"shine"` |
| Energético | `"pulse"` | 70 | `"border-glow"` |
| Interativo | `"scale"` | 50 | `"icon"` (arrow-right) |
| Premium | `"shadow"` | 50 | `"shine"` |

---

## 8. Tipografia Avançada

### 8.1 Configuração por Elemento

Aplicável ao hero (título, subtítulo, descrição):

```typescript
titleTypography: {
  fontSize: 48,              // em pixels (12-120)
  fontWeight: "bold",        // "light" | "normal" | "medium" | "semibold" | "bold"
  color: "#ffffff",          // cor do texto
  effect: "none",            // efeito visual (ver abaixo)
  effectColor: "#6366f1",    // cor do efeito
  effectIntensity: 50,       // 0-100
}
```

### 8.2 Efeitos de Texto

| Efeito | Valor | Descrição |
|--------|-------|-----------|
| Nenhum | `"none"` | Texto normal |
| Sombra | `"shadow"` | Drop shadow (blur 4-12px) |
| Brilho | `"glow"` | Brilho neon luminoso (blur 8-24px) |
| Contorno | `"outline"` | Borda ao redor do texto (1-3px) |
| Gradiente | `"gradient"` | Texto com preenchimento gradiente |

### 8.3 Pesos de Fonte

| Peso | Valor | Uso Recomendado |
|------|-------|-----------------|
| Light | `"light"` (300) | Subtítulos, textos longos |
| Normal | `"normal"` (400) | Corpo de texto |
| Medium | `"medium"` (500) | Labels, botões |
| Semibold | `"semibold"` (600) | Subtítulos, títulos secundários |
| Bold | `"bold"` (700) | Títulos principais, H1 |

---

## 9. Image Grid e Layouts Especiais

### 9.1 Presets Disponíveis

Alternativa à imagem única no Hero. Ativado com `imageGridEnabled: true`.

| Preset | Max Imagens | Layout Visual |
|--------|-------------|---------------|
| `"single"` | 1 | Uma imagem ocupando todo o espaço |
| `"two-horizontal"` | 2 | Duas imagens lado a lado |
| `"two-vertical"` | 2 | Duas imagens empilhadas |
| `"three-left"` | 3 | Uma grande à esquerda + duas pequenas à direita |
| `"three-right"` | 3 | Duas pequenas à esquerda + uma grande à direita |
| `"three-top"` | 3 | Uma grande no topo + duas pequenas embaixo |
| `"four-equal"` | 4 | Grid 2x2 com imagens iguais |

### 9.2 Exemplo de Uso

```typescript
// No hero props:
imageGridEnabled: true,
imageGridPreset: "three-left",
imageGridGap: "0.5rem",
imageGridImages: [
  { src: "https://url1.jpg", alt: "Img 1" },
  { src: "https://url2.jpg", alt: "Img 2" },
  { src: "https://url3.jpg", alt: "Img 3" },
],
```

---

## 10. Responsividade e Mobile

### 10.1 Breakpoints do Sistema

O editor usa breakpoints padrão Tailwind:

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 10.2 Responsividade Automática

**✅ Blocos já são responsivos por padrão:**

| Bloco | Comportamento Mobile |
|-------|---------------------|
| Navbar | Menu hambúrguer em < 768px |
| Hero split | Vira vertical (imagem acima do texto) em < 768px |
| Grid (cols: 3) | Vira 1 coluna em < 640px, 2 colunas em 640px-1024px |
| Footer multi-column | Colunas empilham em < 768px |

### 10.3 Testando Responsividade

```bash
# 1. Rodar demo
npm run demo

# 2. Abrir DevTools (F12)
# 3. Toggle device toolbar (Ctrl+Shift+M)
# 4. Testar diferentes tamanhos:
#    - iPhone SE (375px)
#    - iPad (768px)
#    - Desktop (1280px)
```

### 10.4 Boas Práticas para Mobile

**❌ EVITAR:**
- Textos muito longos em títulos (max 60 caracteres)
- Imagens muito pesadas (> 500KB)
- Mais de 4 colunas em grids (max 3 em mobile)

**✅ RECOMENDADO:**
- Hero com `minHeight: "85vh"` (não "100vh" que esconde conteúdo)
- Botões com `buttonSize: "md"` ou `"lg"` (fácil de tocar)
- Formulários com campos grandes (touch-friendly)

---

## 11. Usando Blocos Customizados

### 11.1 Quando Criar um Bloco Custom

Você criou um novo bloco seguindo [CREATING-BLOCKS.md](./CREATING-BLOCKS.md)? Aqui está como usá-lo em templates.

**Cenário:** Você criou um bloco `testimonialCarousel` (carrossel de depoimentos).

### 11.2 Importando o Bloco

```typescript
// src/shared/templates/meu-template.ts

import type { SiteDocument } from "../schema";
// ↓ NÃO precisa importar explicitamente — o registro já foi feito
// O bloco foi registrado via componentRegistry.register() no arquivo de definição
```

### 11.3 Usando no Template

```typescript
structure: [
  // ... navbar, hero ...

  {
    id: "meu-testimonials",
    type: "testimonialCarousel",  // ← Seu bloco custom
    props: {
      // Props definidas no seu BlockDefinition
      title: "Depoimentos",
      autoplay: true,
      interval: 5,
      testimonials: [
        { quote: "...", author: "..." },
      ],
    },
  },

  // ... footer ...
]
```

### 11.4 TypeScript Autocomplete

Se o TypeScript não reconhecer o tipo:

```typescript
// 1. Adicione ao union BlockType em src/engine/schema/siteDocument.ts:
export type BlockType =
  | "navbar"
  | "hero"
  | "testimonialCarousel"  // ← ADICIONAR
  | ...

// 2. Adicione ao union Block:
export type Block =
  | NavbarBlock
  | HeroBlock
  | TestimonialCarouselBlock  // ← ADICIONAR (sua interface)
  | ...
```

---

## 12. Troubleshooting

### 12.1 Template não aparece no TemplatePicker

**Sintomas:**
- Criou template novo
- Registrou em `index.ts`
- Rodou `npm run demo`
- Template não aparece na lista

**Soluções:**

1. **Build incompleto:**
```bash
npm run build
npm run demo  # Restart do servidor
```

2. **Nome duplicado:**
```typescript
// ❌ ERRADO (nome já existe)
export const templates = {
  "escola-premium": meuTemplate,  // Sobrescreve o original
}

// ✅ CORRETO (nome único)
export const templates = {
  "meu-template-custom": meuTemplate,
}
```

3. **Export missing:**
```typescript
// Verificar se está exportando:
export const meuTemplate: SiteDocument = { ... }
//      ↑ export é necessário
```

---

### 12.2 Tema não aplica corretamente

**Sintomas:**
- Definiu `theme.colors.primary: "#ff0000"`
- Blocos ainda aparecem com cor azul padrão

**Soluções:**

1. **Spread dos defaults esquecido:**
```typescript
// ❌ ERRADO (sem spread)
{
  type: "navbar",
  props: {
    logo: "...",  // NAVBAR_DEFAULT_PROPS não foi incluído
  }
}

// ✅ CORRETO
{
  type: "navbar",
  props: {
    ...NAVBAR_DEFAULT_PROPS,  // ← Sempre fazer spread primeiro
    logo: "...",
  }
}
```

2. **Cor hardcoded no bloco custom:**
```typescript
// Se você criou um bloco custom:

// ❌ ERRADO (hardcoded)
backgroundColor: "#6366f1"

// ✅ CORRETO (usa CSS variable)
backgroundColor: "var(--sg-primary)"
```

3. **Cache do navegador:**
```bash
# Limpar cache:
Ctrl+Shift+Delete → Limpar cache
# Ou testar em janela anônima
```

---

### 12.3 IDs duplicados causando problemas

**Sintomas:**
- Editar um bloco afeta outro bloco
- Bugs estranhos no editor

**Solução:**

**TODOS os IDs no template devem ser únicos:**

```typescript
// ❌ ERRADO (IDs iguais)
structure: [
  { id: "hero", type: "hero", ... },
  { id: "hero", type: "cta", ... },  // ID duplicado!
]

// ✅ CORRETO (IDs únicos com prefixo)
structure: [
  { id: "meu-template-hero", type: "hero", ... },
  { id: "meu-template-cta", type: "cta", ... },
]
```

**Convenção recomendada:**
```
{prefixo-template}-{nome-bloco}
```

Exemplos: `admin-navbar`, `escola-hero`, `portfolio-contact`

---

### 12.4 Imagens não carregam

**Sintomas:**
- Definiu `image: "minha-imagem.jpg"`
- Preview mostra imagem quebrada

**Solução:**

**SEMPRE usar URLs absolutas:**

```typescript
// ❌ ERRADO (URL relativa)
image: "assets/hero.jpg"

// ✅ CORRETO (URL absoluta pública)
image: "https://placehold.co/600x400/6366f1/fff?text=Hero"

// ✅ CORRETO (Unsplash)
image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"
```

**Imagens placeholder recomendadas:**
```
https://placehold.co/{W}x{H}/{bgColor}/{textColor}?text={Texto}
```

Exemplo:
```
https://placehold.co/600x400/6366f1/ffffff?text=Equipe
```

---

### 12.5 Hover effects não funcionam

**Sintomas:**
- Definiu `buttonHoverEffect: "glow"`
- No preview, hover não faz nada

**Soluções:**

1. **Falta de props relacionadas:**
```typescript
// ❌ INCOMPLETO
buttonHoverEffect: "glow"
// Falta buttonHoverIntensity

// ✅ CORRETO
buttonHoverEffect: "glow",
buttonHoverIntensity: 60,  // ← Obrigatório
```

2. **Overlay "icon" sem ícone:**
```typescript
// ❌ INCOMPLETO
buttonHoverOverlay: "icon"
// Falta buttonHoverIconName

// ✅ CORRETO
buttonHoverOverlay: "icon",
buttonHoverIconName: "arrow-right",  // ← Obrigatório
```

---

### 12.6 Variação não muda o visual

**Sintomas:**
- Definiu `variation: "hero-gradient"`
- Hero continua com layout padrão

**Solução:**

**Variação é apenas um preset de valores padrão.** Se você sobrescrever props, elas têm prioridade.

```typescript
// ❌ PROBLEMA (props sobrescrevem variação)
{
  variation: "hero-minimal",  // Define background: "#fafafa"
  background: "#ffffff",      // ← Sobrescreve a variação
  // Resultado: fundo branco (não cinza)
}

// ✅ SOLUÇÃO 1 (remover override)
{
  variation: "hero-minimal",
  // Remover 'background' → usa o valor da variação
}

// ✅ SOLUÇÃO 2 (não usar variação)
{
  // Definir TODAS as props manualmente sem variation
  variant: "centered",
  background: "#fafafa",
  // ... todas as outras props
}
```

---

## 13. Checklist de Qualidade

### 13.1 Antes de Publicar o Template

- [ ] **Build sem erros:** `npm run build` passou
- [ ] **Template aparece no picker:** Testado em `npm run demo`
- [ ] **IDs únicos:** Todos os blocos têm IDs com prefixo do template
- [ ] **Theme completo:** 11 cores + tipografia + spacing + effects definidos
- [ ] **Imagens válidas:** Todas as URLs são absolutas e carregam
- [ ] **Spread defaults:** Navbar tem `...NAVBAR_DEFAULT_PROPS`
- [ ] **Textos placeholder:** "Seu Nome", "Sua Empresa" (usuário substituirá)
- [ ] **Links internos:** Usam `/site/p/{slug}` ou `#{anchor}`
- [ ] **Hover effects consistentes:** Mesma intensidade em todo o template
- [ ] **Responsivo:** Testado em mobile (375px), tablet (768px), desktop (1280px)

---

### 13.2 Checklist de UX

- [ ] **Hierarquia clara:** Hero → Features → CTA → Footer
- [ ] **Contraste adequado:** Texto legível sobre fundos
- [ ] **Botões touch-friendly:** Tamanho mínimo `md` (40px altura)
- [ ] **Espaçamento respirável:** Não muito apertado
- [ ] **Máximo 7 seções:** Evitar páginas muito longas
- [ ] **CTA visível:** Pelo menos 2 CTAs na página (hero + footer)
- [ ] **Social links:** Pelo menos 2 plataformas no footer

---

### 13.3 Checklist de Performance

- [ ] **Imagens otimizadas:** Preferencialmente WebP, max 500KB
- [ ] **Imagens com dimensões corretas:** Não usar 4K para thumbnails
- [ ] **Evitar muitas animações:** Max 2 hover effects complexos simultâneos
- [ ] **Limitar carrosseis:** Max 5 imagens no carousel
- [ ] **Grid razoável:** Max 4 colunas (3 recomendado)

---

## 14. Referência Rápida

### 14.1 CSS Variables Mais Usadas

```css
/* Cores */
--sg-primary              /* Cor primária */
--sg-primary-hover        /* Primária escurecida */
--sg-primary-text         /* Texto sobre primária */
--sg-bg                   /* Fundo da página */
--sg-surface              /* Fundo de cards */
--sg-text                 /* Texto principal */
--sg-muted-text           /* Texto secundário */
--sg-border               /* Bordas */

/* Tipografia */
--sg-font-body            /* Fonte do corpo */
--sg-font-heading         /* Fonte dos títulos */
--sg-heading-h1           /* Tamanho H1 (3rem) */
--sg-heading-h2           /* Tamanho H2 (2.25rem) */

/* Layout */
--sg-section-padding-md   /* Padding de seção (4rem 0) */
--sg-container-padding    /* Padding do container (1rem) */
--sg-max-width-xl         /* Largura máxima (1280px) */

/* Componentes */
--sg-button-radius        /* Raio dos botões (0.5rem) */
--sg-card-radius          /* Raio dos cards (0.75rem) */
--sg-card-shadow          /* Sombra dos cards */

/* Efeitos */
--sg-shadow               /* Sombra padrão */
--sg-transition-normal    /* Transição (300ms ease) */
```

---

### 14.2 Estruturas de Página Comuns

#### Landing Page Minimalista (5 blocos)
```
Navbar → Hero → Features → CTA → Footer
```

#### Site Institucional (7 blocos)
```
Navbar → Hero → Stats → About → Features → Testimonials → Contact → Footer
```

#### Produto/SaaS (9 blocos)
```
Navbar → Hero → LogoCloud → Features → ProductShowcase → Pricing → FAQ → CTA → Footer
```

#### Portfolio (6 blocos)
```
Navbar → Hero → Projects (featureGrid) → About → Testimonials → Contact → Footer
```

#### Escola/Educação (10 blocos)
```
Navbar → Hero → Stats → Courses → About → Features → Testimonials → FAQ → Contact → CTA → Footer
```

---

### 14.3 Tabela Resumo de Todos os Blocos

| Tipo | Categoria | Hover Buttons | Hover Links | Variações | Grid Cols |
|------|-----------|---------------|-------------|-----------|-----------|
| `navbar` | sections | Sim | Sim | 5 | - |
| `hero` | sections | Sim | - | 7 | - |
| `footer` | sections | - | Sim | 2 | - |
| `stats` | sections | - | - | - | - |
| `featureGrid` | sections | - | - | 3 | 2/3/4 |
| `cta` | sections | Sim | - | 4 | - |
| `productShowcase` | sections | Sim | - | 3 | - |
| `aboutSection` | sections | Sim | - | 3 | - |
| `contactSection` | sections | Sim | - | 3 | - |
| `testimonialGrid` | sections | - | - | - | 2/3/4 |
| `faq` | sections | - | - | - | - |
| `pricing` | sections | - | - | - | - |
| `logoCloud` | sections | - | - | - | - |
| `teamGrid` | sections | - | - | - | 2/3/4 |
| `blogCardGrid` | sections | - | - | - | 2/3/4 |
| `courseCardGrid` | sections | - | - | - | 2/3/4 |
| `categoryCardGrid` | sections | - | - | - | 2/3/4 |
| `countdown` | sections | - | - | 2 | - |
| `carousel` | sections | - | - | - | - |
| `button` | content | Sim | - | - | - |
| `link` | content | - | Sim | - | - |
| `section` | composition | - | - | - | - |
| `container` | layout | - | - | - | - |
| `grid` | layout | - | - | - | 1-12 |
| `stack` | layout | - | - | - | - |

---

### 14.4 Atalhos e Comandos

```bash
# Build do editor
npm run build

# Rodar demo (testa templates)
npm run demo

# Publicar versão patch (bugfix)
npm run version:patch

# Publicar versão minor (novo template)
npm run version:minor

# Publicar versão major (breaking change)
npm run version:major
```

---

## Apêndice: Exemplo de Template Completo Comentado

Ver seção [3.2 Exemplo Completo: Template Minimalista](#32-exemplo-completo-template-minimalista) para um template completo com todos os comentários e boas práticas.

---

**Fim do Template Manual**

*Este manual cobre 100% das opções de personalização disponíveis no SmartGesti Site Editor v1.9.x.*

*Para criação de blocos customizados, consulte [CREATING-BLOCKS.md](./CREATING-BLOCKS.md).*
