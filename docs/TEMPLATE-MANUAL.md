# Template Manual — SmartGesti Site Editor

> Manual completo para criacao de templates. Projetado para ser consumido por uma IA geradora de templates.
> Ultima atualizacao: 2026-02-09

---

## Indice

1. [Estrutura de um Template](#1-estrutura-de-um-template)
2. [Sistema de Temas](#2-sistema-de-temas)
3. [Blocos Disponiveis — Referencia Completa](#3-blocos-disponiveis--referencia-completa)
4. [Sistema de Variacoes](#4-sistema-de-variacoes)
5. [Sistema de Hover Effects](#5-sistema-de-hover-effects)
6. [Sistema de Tipografia](#6-sistema-de-tipografia)
7. [Sistema de Image Grid](#7-sistema-de-image-grid)
8. [Props Condicionais (showWhen)](#8-props-condicionais-showwhen)
9. [Padroes e Boas Praticas](#9-padroes-e-boas-praticas)
10. [Referencia de CSS Variables](#10-referencia-de-css-variables)

---

## 1. Estrutura de um Template

### Formato Basico

```typescript
import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

export const meuTemplate: SiteDocument = {
  meta: {
    title: "Nome do Template",
    description: "Descricao para SEO",
    language: "pt-BR",
  },
  theme: { /* ThemeTokens - ver secao 2 */ },
  structure: [ /* Array de blocos - ver secao 3 */ ],
};
```

### Campos Obrigatorios

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `meta.title` | string | Nome exibido no TemplatePicker |
| `meta.description` | string | Descricao do template |
| `meta.language` | string | Idioma (ex: "pt-BR") |
| `theme` | ThemeTokens | Tokens de tema completos |
| `structure` | Block[] | Array de blocos da pagina |

### Registro do Template

Apos criar o arquivo, registrar em `src/shared/templates/index.ts`:

```typescript
import { meuTemplate } from "./meu-template";

export const templates = {
  // ... templates existentes
  "meu-template": meuTemplate,
} as const;
```

### Convencao de IDs

Todos os blocos no template devem ter IDs unicos com prefixo do template:

```
{prefixo-template}-{nome-bloco}
```

Exemplos: `admin-navbar`, `escola-hero`, `zilom-courses`

---

## 2. Sistema de Temas

### Estrutura Completa do Theme

```typescript
theme: {
  colors: {
    primary: "#6366f1",      // Cor principal da marca
    secondary: "#4f46e5",    // Cor secundaria
    accent: "#8b5cf6",       // Cor de destaque
    background: "#ffffff",   // Fundo da pagina
    surface: "#f8fafc",      // Fundo de cards/paineis
    text: "#0f172a",         // Cor do texto principal
    textMuted: "#64748b",    // Cor do texto secundario
    border: "#e2e8f0",       // Cor das bordas
    success: "#10b981",      // Estado de sucesso
    warning: "#f59e0b",      // Estado de alerta
    error: "#ef4444",        // Estado de erro
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
}
```

### Paletas de Cores Recomendadas

| Estilo | Primary | Secondary | Accent | Background | Surface |
|--------|---------|-----------|--------|------------|---------|
| Corporativo | `#1e40af` | `#1d4ed8` | `#0ea5e9` | `#ffffff` | `#f8fafc` |
| Moderno | `#6366f1` | `#4f46e5` | `#8b5cf6` | `#ffffff` | `#f8fafc` |
| Educacional | `#2563eb` | `#1d4ed8` | `#3b82f6` | `#ffffff` | `#f0f9ff` |
| Vibrante | `#ec4899` | `#db2777` | `#f59e0b` | `#ffffff` | `#fdf2f8` |
| Natureza | `#059669` | `#047857` | `#10b981` | `#ffffff` | `#f0fdf4` |
| Escuro | `#6366f1` | `#4f46e5` | `#a78bfa` | `#0f172a` | `#1e293b` |

### Fontes Populares

| Fonte | Estilo | Uso Recomendado |
|-------|--------|-----------------|
| `Inter, system-ui, sans-serif` | Neutro/Moderno | Body e headings (padrao) |
| `Plus Jakarta Sans, system-ui, sans-serif` | Premium | Headings (educacional premium) |
| `Poppins, system-ui, sans-serif` | Arredondado | Headings (lúdico) |
| `Merriweather, Georgia, serif` | Classico | Headings (institucional) |

---

## 3. Blocos Disponiveis — Referencia Completa

### 3.1 Navbar

**Tipo:** `navbar` | **Categoria:** sections

O navbar suporta variacoes (ver secao 4) e extensiva personalizacao visual.

```typescript
{
  id: "meu-navbar",
  type: "navbar",
  props: {
    ...NAVBAR_DEFAULT_PROPS,  // SEMPRE fazer spread dos defaults

    // === Conteudo ===
    links: [
      { text: "Home", href: "/site/p/home" },
      { text: "Sobre", href: "#about" },
      { text: "Servicos", href: "#services" },
      { text: "Contato", href: "#contact" },
    ],
    ctaButton: { text: "Comecar", href: "#contact" },
    logo: "https://url-do-logo.png",    // opcional
    logoText: "Minha Marca",             // texto se nao tiver logo
    logoHeight: 70,                      // 40-130px

    // === Posicionamento ===
    layout: "expanded",        // "expanded" | "centered" | "compact"
    sticky: true,              // fixar no topo ao rolar
    floating: false,           // flutuar sobre o conteudo

    // === Aparencia ===
    bg: "#ffffff",             // cor de fundo
    opacity: 100,              // 0-100 (transparencia)
    blurOpacity: 0,            // 0-100 (efeito blur/glassmorphism)
    borderRadius: 0,           // 0-32px (cantos arredondados)
    shadow: "sm",              // "none" | "sm" | "md" | "lg" | "xl"
    borderPosition: "none",    // "none" | "all" | "top" | "bottom" | "left" | "right"
    borderWidth: 1,            // 1-4px
    borderColor: "#e5e7eb",

    // === Links ===
    linkColor: "#374151",
    linkHoverColor: "#2563eb",
    linkFontSize: "md",        // "sm" | "md" | "lg"
    linkHoverEffect: "background",  // ver secao 5
    linkHoverIntensity: 50,

    // === Botao CTA ===
    buttonVariant: "solid",          // "solid" | "outline" | "ghost"
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    buttonBorderRadius: 8,           // 0-32px
    buttonSize: "md",                // "sm" | "md" | "lg"
    buttonHoverEffect: "darken",     // ver secao 5
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "none",      // ver secao 5
    buttonHoverIconName: "arrow-right",
  },
}
```

**Variacoes disponiveis:** `navbar-simples`, `navbar-moderno`, `navbar-glass`, `navbar-elegante`, `navbar-pill`

---

### 3.2 Hero

**Tipo:** `hero` | **Categoria:** sections

O bloco mais complexo do sistema com 40+ props editaveis e 7 variacoes.

```typescript
{
  id: "meu-hero",
  type: "hero",
  props: {
    // === Variacao (define o layout base) ===
    variation: "hero-split",     // ver secao 4 para todas as variacoes
    variant: "split",            // "centered" | "split" | "image-bg"

    // === Conteudo ===
    title: "Titulo Principal",
    subtitle: "Subtitulo ou tagline",
    description: "Descricao detalhada do produto ou servico.",
    badge: "Lancamento",         // badge acima do titulo (opcional)

    // === Botoes ===
    primaryButton: { text: "Comecar Agora", href: "#contact" },
    secondaryButton: { text: "Saiba Mais", href: "#about" },

    // === Midia ===
    image: "https://placehold.co/600x500/6366f1/fff?text=Hero",
    imagePosition: "right",      // "right" | "left" (so p/ variant split)
    imageRadius: 16,             // 0-32px
    imageShadow: "lg",           // "none" | "sm" | "md" | "lg" | "xl"

    // === Image Grid (alternativa a imagem unica) ===
    imageGridEnabled: false,     // true ativa o grid de imagens
    // Se imageGridEnabled: true, usar imageGridConfig (ver secao 7)

    // === Layout ===
    align: "left",               // "left" | "center" | "right"
    contentPosition: "center",   // "left" | "center" | "right"
    contentSpacing: "default",   // "compact" | "default" | "spacious"
    blockGap: "default",         // "default" | "wide" | "x-wide"
    minHeight: "85vh",           // "70vh" | "85vh" | "100vh"
    contentMaxWidth: "700px",    // "700px" | "900px" | "1200px"
    paddingY: "100px",           // padding vertical

    // === Aparencia ===
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",  // cor ou gradiente
    overlay: false,              // ativar overlay sobre imagem de fundo
    overlayColor: "rgba(0,0,0,0.5)",  // cor do overlay (suporta gradientes CSS)
    showWave: false,             // onda decorativa no rodape da secao
    waveColor: "rgba(255,255,255,0.1)",

    // === Cores do Texto ===
    titleColor: "#ffffff",
    subtitleColor: "#e0e7ff",
    descriptionColor: "#c7d2fe",

    // === Tipografia Avancada ===
    titleTypography: {           // ver secao 6
      fontSize: 48,
      fontWeight: "bold",
      effect: "none",
    },
    subtitleTypography: { fontSize: 24, fontWeight: "medium" },
    descriptionTypography: { fontSize: 16, fontWeight: "normal" },

    // === Badge ===
    badgeColor: "#3b82f6",       // cor de fundo do badge
    badgeTextColor: "#ffffff",   // cor do texto do badge

    // === Botao Primario ===
    primaryButtonVariant: "solid",     // "solid" | "outline" | "ghost"
    primaryButtonColor: "#6366f1",     // cor de fundo (opcional, usa --sg-primary)
    primaryButtonTextColor: "#ffffff",
    primaryButtonRadius: 8,            // 0-50px

    // === Botao Secundario ===
    secondaryButtonVariant: "outline",
    secondaryButtonColor: "#ffffff",
    secondaryButtonTextColor: "#ffffff",
    secondaryButtonRadius: 8,

    // === Tamanho dos Botoes ===
    buttonSize: "md",            // "sm" | "md" | "lg"

    // === Hover Effects ===
    buttonHoverEffect: "glow",         // ver secao 5
    buttonHoverIntensity: 60,          // 10-100
    buttonHoverOverlay: "shine",       // ver secao 5
    buttonHoverIconName: "arrow-right",

    // === Carrossel (so para variation hero-carousel) ===
    carouselImages: [
      "https://placehold.co/1920x1080/1e3a5f/fff?text=Slide+1",
      "https://placehold.co/1920x1080/2d5016/fff?text=Slide+2",
    ],
    carouselInterval: 5,         // 3-10 segundos
    carouselTransition: "crossfade",
  },
}
```

**Variacoes disponiveis:** `hero-split`, `hero-parallax`, `hero-overlay`, `hero-gradient`, `hero-minimal`, `hero-card`, `hero-carousel`

---

### 3.3 Footer

**Tipo:** `footer` | **Categoria:** sections

```typescript
{
  id: "meu-footer",
  type: "footer",
  props: {
    logo: "https://url-do-logo.png",
    logoText: "Minha Marca",
    description: "Descricao curta da empresa.",
    variant: "multi-column",   // "simple" | "multi-column"
    columns: [
      {
        title: "Produto",
        links: [
          { text: "Features", href: "#features" },
          { text: "Precos", href: "#pricing" },
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
    copyright: "(c) 2025 Empresa. Todos os direitos reservados.",

    // === Link Hover Effects ===
    linkHoverEffect: "underline-center",   // ver secao 5
    linkHoverIntensity: 50,
    linkHoverColor: "#818cf8",
  },
}
```

---

### 3.4 Stats

**Tipo:** `stats` | **Categoria:** sections

```typescript
{
  id: "meu-stats",
  type: "stats",
  props: {
    title: "Numeros que Falam",
    subtitle: "Resultados reais",
    items: [
      { value: "500+", label: "Clientes Atendidos" },
      { value: "99.9%", label: "Uptime Garantido" },
      { value: "50k+", label: "Usuarios Ativos" },
      { value: "4.9", label: "Nota dos Clientes", suffix: "/5" },
    ],
  },
}
```

---

### 3.5 Feature Grid

**Tipo:** `featureGrid` | **Categoria:** sections

O bloco mais versatil — usado para features, beneficios, servicos, etapas, etc.

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
        icon: "shield",        // nome do icone Lucide
        title: "Seguranca Total",
        description: "Dados criptografados e backups automaticos.",
        image: "url",          // so para variant "image-cards"
        link: { text: "Saiba mais", href: "#" },  // opcional
      },
      // ... mais features
    ],
  },
}
```

**Icones disponiveis:** `star`, `check`, `zap`, `shield`, `rocket`, `globe`, `bar-chart`, `users`, `heart`, `mail`, `phone`, `map-pin`, `settings`, `search`, `menu`, `plus`, `minus`, `trophy`, `arrow-right`, `user`

**Variantes visuais:**
- `default` — Icone + titulo + descricao (simples, sem card)
- `cards` — Card elevado com sombra + icone + titulo + descricao
- `image-cards` — Imagem no topo + titulo + descricao + link

---

### 3.6 CTA (Call-to-Action)

**Tipo:** `cta` | **Categoria:** sections

```typescript
{
  id: "meu-cta",
  type: "cta",
  props: {
    title: "Pronto para comecar?",
    description: "Junte-se a milhares de usuarios satisfeitos.",
    primaryButton: { text: "Comecar Agora", href: "#contact" },
    secondaryButton: { text: "Ver Planos", href: "#pricing" },
    variant: "gradient",       // "default" | "centered" | "split" | "gradient"
    bg: "#f0f0ff",             // cor de fundo (ignorado se gradient)
    buttonSize: "md",          // "sm" | "md" | "lg"

    // === Hover Effects ===
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
    buttonHoverIconName: "arrow-right",
  },
}
```

**Variantes visuais:**
- `default` — Fundo solido, botoes lado a lado
- `centered` — Texto e botoes centralizados
- `split` — Texto a esquerda, botoes a direita
- `gradient` — Fundo com gradiente vibrante baseado na cor primaria

---

### 3.7 Product Showcase

**Tipo:** `productShowcase` | **Categoria:** sections

```typescript
{
  id: "meu-produtos",
  type: "productShowcase",
  props: {
    title: "Nossos Modulos",
    subtitle: "Solucoes Completas",
    variant: "alternating",    // "alternating" | "grid" | "stacked"
    bg: "#ffffff",

    products: [
      {
        name: "Modulo X",
        description: "Descricao curta.",
        longDescription: "Descricao detalhada para layout alternado.",
        icon: "icone-emoji",       // emoji decorativo
        badge: "Mais Popular",     // badge opcional
        image: "https://url",      // imagem do produto
        features: [                // lista de features com check
          "Feature 1",
          "Feature 2",
        ],
        primaryButton: { text: "Saiba Mais", href: "#contact" },
        secondaryButton: { text: "Ver Precos", href: "#pricing" },
      },
      // ... mais produtos
    ],

    // === Hover Effects ===
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
  },
}
```

**Variantes visuais:**
- `alternating` — Produtos alternam imagem esquerda/direita (ideal para 2-4 produtos)
- `grid` — Cards em grid 2-3 colunas (ideal para 3-6 produtos)
- `stacked` — Todos com imagem a esquerda (lista vertical)

---

### 3.8 About Section

**Tipo:** `aboutSection` | **Categoria:** sections

```typescript
{
  id: "meu-about",
  type: "aboutSection",
  props: {
    title: "Sobre Nos",
    subtitle: "Quem Somos",          // badge acima do titulo
    description: "Paragrafo principal sobre a empresa.",
    secondaryDescription: "Paragrafo secundario complementar.",
    variant: "image-left",           // "image-left" | "image-right" | "centered"
    image: "https://placehold.co/600x400/e0e7ff/6366f1?text=Equipe",
    bg: "#ffffff",

    achievements: [
      { text: "Equipe 100% brasileira" },
      { text: "Suporte humanizado" },
      { text: "Implantacao em ate 7 dias" },
    ],

    primaryButton: { text: "Conheca Nossa Historia", href: "#contact" },

    stats: [                         // stats flutuantes sobre a imagem
      { value: "500+", label: "Clientes" },
      { value: "8+", label: "Anos" },
    ],

    // === Hover Effects ===
    buttonHoverEffect: "glow",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
  },
}
```

**Variantes visuais:**
- `image-left` — Imagem a esquerda, conteudo a direita (stats posicionados no canto inferior direito da imagem)
- `image-right` — Invertido (stats no canto inferior esquerdo)
- `centered` — Imagem acima, texto centralizado abaixo

---

### 3.9 Contact Section

**Tipo:** `contactSection` | **Categoria:** sections

```typescript
{
  id: "meu-contact",
  type: "contactSection",
  props: {
    title: "Fale Conosco",
    subtitle: "Contato",             // badge
    description: "Texto descritivo.",
    variant: "split",                // "split" | "stacked" | "form-only"
    bg: "#ffffff",

    contactInfo: [
      { icon: "mail", label: "Email", value: "contato@empresa.com" },
      { icon: "phone", label: "Telefone", value: "(11) 3456-7890" },
      { icon: "map-pin", label: "Endereco", value: "Av. Paulista, 1000" },
      { icon: "clock", label: "Horario", value: "Seg a Sex, 8h as 18h" },
      { icon: "globe", label: "Website", value: "www.empresa.com" },
    ],

    formTitle: "Solicite uma demonstracao",
    formFields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Seu nome", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "email@empresa.com", required: true },
      { name: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" },
      { name: "message", label: "Mensagem", type: "textarea", placeholder: "Sua mensagem...", required: true },
    ],
    submitText: "Enviar Mensagem",

    // === Hover Effects ===
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
  },
}
```

**Icones de contato disponiveis:** `mail`, `phone`, `map-pin`, `clock`, `globe`

**Tipos de campo do formulario:** `text`, `email`, `tel`, `textarea`

**Variantes visuais:**
- `split` — Info cards a esquerda (40%), formulario a direita (60%)
- `stacked` — Info acima, formulario abaixo
- `form-only` — Apenas formulario centralizado (max 600px)

---

### 3.10 Testimonial Grid

**Tipo:** `testimonialGrid` | **Categoria:** sections

```typescript
{
  id: "meu-testimonials",
  type: "testimonialGrid",
  props: {
    title: "O que Nossos Clientes Dizem",
    subtitle: "Depoimentos reais",
    columns: 3,                // 2 | 3 | 4
    testimonials: [
      {
        quote: "Texto do depoimento completo.",
        authorName: "Maria Silva",
        authorRole: "Diretora",
        authorCompany: "Colegio Sao Paulo",
        authorAvatar: "https://url-avatar.jpg",  // opcional
        rating: 5,             // 1-5 estrelas
      },
      // ... mais depoimentos
    ],
  },
}
```

---

### 3.11 FAQ

**Tipo:** `faq` | **Categoria:** sections

```typescript
{
  id: "meu-faq",
  type: "faq",
  props: {
    title: "Perguntas Frequentes",
    subtitle: "Tire suas duvidas",
    items: [
      {
        question: "Quanto tempo leva para implementar?",
        answer: "Resposta detalhada aqui.",
      },
      // ... mais perguntas (recomendado: 4-6)
    ],
  },
}
```

---

### 3.12 Pricing

**Tipo:** `pricing` | **Categoria:** sections

```typescript
{
  id: "meu-pricing",
  type: "pricing",
  props: {
    title: "Planos e Precos",
    subtitle: "Escolha o plano ideal",
    plans: [
      {
        name: "Basico",
        price: "R$ 49",
        period: "/mes",
        description: "Para pequenas equipes",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        buttonText: "Comecar",
        highlighted: false,
        badge: "",
      },
      {
        name: "Profissional",
        price: "R$ 99",
        period: "/mes",
        description: "Para empresas em crescimento",
        features: ["Tudo do Basico", "Feature 4", "Feature 5"],
        buttonText: "Assinar",
        highlighted: true,       // destaca este plano
        badge: "Mais Popular",   // badge no topo
      },
      {
        name: "Enterprise",
        price: "Consulte",
        period: "",
        description: "Solucao personalizada",
        features: ["Tudo do Pro", "Feature 6", "Suporte dedicado"],
        buttonText: "Falar com Vendas",
        highlighted: false,
      },
    ],
  },
}
```

---

### 3.13 Logo Cloud

**Tipo:** `logoCloud` | **Categoria:** sections

```typescript
{
  id: "meu-logos",
  type: "logoCloud",
  props: {
    title: "Empresas que confiam em nos",
    logos: [
      { src: "https://url-logo1.png", alt: "Empresa X" },
      { src: "https://url-logo2.png", alt: "Empresa Y" },
    ],
    grayscale: true,   // exibe logos em escala de cinza (elegante)
  },
}
```

---

### 3.14 Team Grid

**Tipo:** `teamGrid` | **Categoria:** sections

```typescript
{
  id: "meu-team",
  type: "teamGrid",
  props: {
    title: "Nossa Equipe",
    subtitle: "Conheca o time",
    columns: 4,            // 2 | 3 | 4
    members: [
      {
        avatar: "https://url-foto.jpg",
        name: "Joao Silva",
        role: "CEO",
        social: [
          { platform: "linkedin", href: "https://..." },
        ],
      },
      // ... mais membros
    ],
  },
}
```

---

### 3.15 Blog Card Grid

**Tipo:** `blogCardGrid` | **Categoria:** sections

```typescript
{
  id: "meu-blog",
  type: "blogCardGrid",
  props: {
    title: "Ultimas Noticias",
    subtitle: "Blog e atualizacoes",
    columns: 3,            // 2 | 3 | 4
    cards: [
      {
        image: "https://placehold.co/400x250/6366f1/fff?text=Post+1",
        date: "10 Jan 2025",
        category: "Educacao",
        title: "Titulo do Post",
        excerpt: "Resumo do post...",
        linkText: "Ler Mais",
        linkHref: "#",
      },
      // ... mais cards
    ],
  },
}
```

---

### 3.16 Course Card Grid

**Tipo:** `courseCardGrid` | **Categoria:** sections

```typescript
{
  id: "meu-courses",
  type: "courseCardGrid",
  props: {
    title: "Cursos Populares",
    subtitle: "Explore nossos cursos",
    columns: 3,
    cards: [
      {
        image: "https://url-thumb.jpg",
        title: "Nome do Curso",
        price: "R$ 199",
        rating: 4.8,
        meta: "24 Aulas | 12h",
        buttonText: "Ver Curso",
        buttonHref: "#",
      },
    ],
  },
}
```

---

### 3.17 Category Card Grid

**Tipo:** `categoryCardGrid` | **Categoria:** sections

```typescript
{
  id: "meu-categories",
  type: "categoryCardGrid",
  props: {
    title: "Categorias",
    subtitle: "Navegue por categoria",
    columns: 4,
    categories: [
      { image: "https://url.jpg", title: "Tecnologia", href: "#" },
      { image: "https://url.jpg", title: "Design", href: "#" },
    ],
  },
}
```

---

### 3.18 Countdown

**Tipo:** `countdown` | **Categoria:** sections

```typescript
{
  id: "meu-countdown",
  type: "countdown",
  props: {
    title: "Matriculas Abertas!",
    description: "Vagas limitadas",
    endDate: "2025-12-31T23:59:59",  // ISO date
    showPlaceholders: true,           // exibir 00:00:00 quando nao tem data
    buttonText: "Inscreva-se",
    buttonHref: "#contact",
    variant: "banner",                // "default" | "banner"
    badgeText: "Matriculas Abertas",  // texto no circulo decorativo
    bg: "var(--sg-primary)",
  },
}
```

---

### 3.19 Carousel

**Tipo:** `carousel` | **Categoria:** sections

```typescript
{
  id: "meu-carousel",
  type: "carousel",
  props: {
    showArrows: true,
    showDots: false,
    autoplay: false,
    slides: [
      {
        image: "https://placehold.co/1200x500/6366f1/fff?text=Slide+1",
        title: "Titulo do Slide",
        description: "Descricao do slide.",
        primaryButton: { text: "Saiba Mais", href: "#" },
        secondaryButton: { text: "Ver Todos", href: "#" },
      },
    ],
  },
}
```

---

### 3.20 Blocos de Layout (Composicao)

Para layouts customizados que nao se encaixam em nenhum bloco pre-fabricado:

#### Section + Container + Grid

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
                        { id: "h", type: "heading", props: { level: 2, text: "Titulo" } },
                        { id: "p", type: "text", props: { text: "Paragrafo..." } },
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

#### Blocos Primitivos Disponiveis

| Tipo | Props Principais | Descricao |
|------|-----------------|-----------|
| `section` | `bg`, `padding`, `children` | Wrapper de secao |
| `container` | `maxWidth`, `padding`, `children` | Limita largura |
| `grid` | `cols` (1-12), `gap`, `children` | CSS Grid |
| `stack` | `direction` (col/row), `gap`, `align`, `justify`, `children` | Flexbox |
| `box` | `bg`, `border`, `radius`, `shadow`, `padding`, `children` | Div estilizado |
| `spacer` | `height` | Espaco vertical |
| `heading` | `level` (1-6), `text`, `align`, `color` | Titulo H1-H6 |
| `text` | `text`, `align`, `size` (sm/md/lg), `color` | Paragrafo |
| `image` | `src`, `alt`, `width`, `height`, `objectFit` | Imagem |
| `button` | `text`, `href`, `variant`, `size`, hover effects | Botao CTA |
| `link` | `text`, `href`, `target`, hover effects | Link |
| `divider` | `color`, `thickness` | Linha divisoria |
| `icon` | `name`, `size`, `color` | Icone Lucide |
| `badge` | `text`, `variant`, `size` | Badge/tag |
| `avatar` | `src`, `name`, `size` | Avatar circular |
| `video` | `src`, `poster`, `aspectRatio`, `autoplay`, `controls` | Video |

---

## 4. Sistema de Variacoes

### 4.1 Variacoes do Hero (7)

| ID | Nome | Layout | Imagem | Altura | Caracteristicas |
|----|------|--------|--------|--------|-----------------|
| `hero-split` | Dividido | 2 colunas | Direita | 600px | Conteudo esquerda, imagem direita |
| `hero-parallax` | Parallax | Fullwidth | Fundo | 85vh | Imagem fixa, overlay gradiente diagonal |
| `hero-overlay` | Fullscreen | Fullwidth | Fundo | 100vh | Overlay pesado, badge, botoes pill (50px) |
| `hero-gradient` | Gradiente | Centralizado | Nenhuma | 90vh | Gradiente vibrante, onda decorativa |
| `hero-card` | Card | Card flutuante | Fundo | 70vh | Card branco sobre imagem, badge verde |
| `hero-minimal` | Minimal | Centralizado | Nenhuma | 70vh | Fundo cinza, 1 botao, design limpo |
| `hero-carousel` | Carrossel | Fullwidth | Slideshow | 90vh | 3+ imagens com crossfade |

#### Detalhes por Variacao

**hero-split:**
- `variant: "split"`, `align: "left"`, `imagePosition: "right"`
- Botoes: solid + outline, 8px radius
- Ideal para: paginas de produto, landing pages de servico

**hero-parallax:**
- `variant: "image-bg"`, `overlay: true`
- `overlayColor: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)"`
- Texto branco, botao secundario com borda branca
- Ideal para: sites institucionais, portfolios

**hero-overlay:**
- `variant: "image-bg"`, `minHeight: "100vh"`
- `overlayColor: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)"`
- Badge azul, botoes totalmente arredondados (50px), ghost secondary
- Ideal para: blogs, artigos em destaque

**hero-gradient:**
- `variant: "centered"`, `background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"`
- Badge semi-transparente, botoes brancos arredondados, onda decorativa
- Ideal para: SaaS, apps, startups

**hero-minimal:**
- `variant: "centered"`, `background: "#fafafa"`
- Texto escuro, 1 botao preto grande, sem imagem
- Ideal para: portfolios, sites minimalistas

**hero-card:**
- `variant: "image-bg"`, `contentMaxWidth: "450px"`
- Card branco sobre imagem, badge verde, overlay leve (0.3)
- Ideal para: escolas, eventos, matriculas

**hero-carousel:**
- `variant: "image-bg"`, `carouselImages: [3 URLs]`
- Transicao crossfade 5s, overlay gradiente vertical
- Ideal para: universidades, eventos com multiplas fotos

### 4.2 Variacoes do Navbar (5)

| ID | Nome | Floating | Radius | Shadow | Opacity | Blur | Botao |
|----|------|----------|--------|--------|---------|------|-------|
| `navbar-simples` | Simples | Nao | 0 | none | 100 | 0 | solid, 4px |
| `navbar-moderno` | Moderno | Nao | 0 | md | 100 | 0 | solid, 8px |
| `navbar-glass` | Glass | Sim | 16px | lg | 75 | 60 | solid, 10px |
| `navbar-elegante` | Elegante | Nao | 0 | sm | 100 | 0 | outline, 6px |
| `navbar-pill` | Pill | Sim | 32px | xl | 100 | 0 | solid, 20px |

**Notas:**
- Navbars flutuantes (`floating: true`) sobrepoe o conteudo do hero
- Glass usa transparencia (opacity 75%) + blur (60%) para efeito glassmorphism
- Pill tem cantos muito arredondados (32px) criando formato de pilula

---

## 5. Sistema de Hover Effects

### 5.1 Efeitos de Hover em Links

**Blocos que suportam:** navbar, footer, link

| Efeito | Valor | Descricao Visual |
|--------|-------|-----------------|
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

### 5.2 Efeitos de Hover em Botoes

**Blocos que suportam:** hero, navbar, cta, productShowcase, aboutSection, contactSection, button

| Efeito | Valor | Descricao Visual |
|--------|-------|-----------------|
| Nenhum | `"none"` | Sem efeito |
| Escurecer | `"darken"` | Escurece a cor + eleva o botao |
| Clarear | `"lighten"` | Clareia a cor + eleva o botao |
| Escala | `"scale"` | Botao aumenta de tamanho (1.05x-1.12x) |
| Brilho Neon | `"glow"` | Halo luminoso ao redor do botao |
| Sombra | `"shadow"` | Sombra dramatica + elevacao |
| Pulso | `"pulse"` | Animacao de pulso infinita |

**Props:**
```typescript
buttonHoverEffect: "scale",      // efeito principal
buttonHoverIntensity: 50,        // 10-100 (intensidade)
```

### 5.3 Efeitos Overlay em Botoes (Adicional)

Sobrepostos ao efeito principal, adicionam um efeito visual extra.

| Overlay | Valor | Descricao Visual |
|---------|-------|-----------------|
| Nenhum | `"none"` | Sem overlay |
| Brilho | `"shine"` | Faixa de luz branca desliza pelo botao |
| Preenchimento | `"fill"` | Cor preenche da esquerda para direita |
| Salto | `"bounce"` | Botao faz pequeno salto animado |
| Icone | `"icon"` | Icone aparece com fade+slide |
| Borda Glow | `"border-glow"` | Borda pulsa com brilho |

**Props:**
```typescript
buttonHoverOverlay: "shine",           // overlay escolhido
buttonHoverIconName: "arrow-right",    // so para overlay "icon"
```

**Icones disponiveis para overlay "icon":**
`arrow-right`, `chevron-right`, `external-link`, `plus`, `check`, `download`, `send`, `play`, `star`, `heart`, `zap`, `sparkles`, `rocket`, `fire`, `gift`, `trophy`, `mail`, `phone`, `cart`, `tag`, `eye`, `lock`, `user`, `settings`

### 5.4 Combinacoes Recomendadas

| Estilo | buttonHoverEffect | Intensidade | buttonHoverOverlay |
|--------|------------------|-------------|-------------------|
| Sutil | `"darken"` | 30 | `"none"` |
| Profissional | `"scale"` | 50 | `"shine"` |
| Moderno | `"glow"` | 60 | `"shine"` |
| Energetico | `"pulse"` | 70 | `"border-glow"` |
| Interativo | `"scale"` | 50 | `"icon"` (arrow-right) |
| Premium | `"shadow"` | 50 | `"shine"` |

---

## 6. Sistema de Tipografia

### 6.1 Configuracao por Elemento

Aplicavel ao hero (titulo, subtitulo, descricao):

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

### 6.2 Efeitos de Texto

| Efeito | Valor | Descricao |
|--------|-------|-----------|
| Nenhum | `"none"` | Texto normal |
| Sombra | `"shadow"` | Drop shadow (blur 4-12px) |
| Brilho | `"glow"` | Brilho neon luminoso (blur 8-24px) |
| Contorno | `"outline"` | Borda ao redor do texto (1-3px) |
| Gradiente | `"gradient"` | Texto com preenchimento gradiente |

### 6.3 Pesos de Fonte

| Peso | Valor | Uso Recomendado |
|------|-------|-----------------|
| Light | `"light"` (300) | Subtitulos, textos longos |
| Normal | `"normal"` (400) | Corpo de texto |
| Medium | `"medium"` (500) | Labels, botoes |
| Semibold | `"semibold"` (600) | Subtitulos, titulos secundarios |
| Bold | `"bold"` (700) | Titulos principais, H1 |

---

## 7. Sistema de Image Grid

### 7.1 Presets Disponiveis

Alternativa a imagem unica no Hero. Ativado com `imageGridEnabled: true`.

| Preset | Max Imagens | Layout Visual |
|--------|-------------|---------------|
| `"single"` | 1 | Uma imagem ocupando todo o espaco |
| `"two-horizontal"` | 2 | Duas imagens lado a lado |
| `"two-vertical"` | 2 | Duas imagens empilhadas |
| `"three-left"` | 3 | Uma grande a esquerda + duas pequenas a direita |
| `"three-right"` | 3 | Duas pequenas a esquerda + uma grande a direita |
| `"three-top"` | 3 | Uma grande no topo + duas pequenas embaixo |
| `"four-equal"` | 4 | Grid 2x2 com imagens iguais |

### 7.2 Exemplo de Uso

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

## 8. Props Condicionais (showWhen)

Algumas props so sao editaveis no inspector quando outra prop tem um valor especifico.

### Hero

| Prop | Condicao |
|------|----------|
| `image` | `imageGridEnabled !== true` |
| `imageRadius` | `image && !imageGridEnabled` |
| `imageShadow` | `image && !imageGridEnabled` |
| `imageGridConfig` | `imageGridEnabled === true` |
| `imagePosition` | `image \|\| imageGridEnabled` |
| `blockGap` | `image \|\| imageGridEnabled` |
| `contentMaxWidth` | `variant !== "split"` |
| `overlayColor` | implicitamente quando `overlay === true` |
| `waveColor` | `showWave === true` |
| `carouselImages` | `variation === "hero-carousel"` |
| `buttonHoverIconName` | `buttonHoverOverlay === "icon"` |

### Navbar

| Prop | Condicao |
|------|----------|
| `logoHeight` | `logo` (imagem carregada) |
| `buttonHoverIconName` | `buttonHoverOverlay === "icon"` |

### Blog Post Grid

| Prop | Condicao |
|------|----------|
| `viewAllText` | `showViewAll === true` |
| `viewAllHref` | `showViewAll === true` |

### Todos Blocos com Hover

| Prop | Condicao |
|------|----------|
| `buttonHoverIconName` | `buttonHoverOverlay === "icon"` |

---

## 9. Padroes e Boas Praticas

### 9.1 Estrutura Recomendada de Pagina

```
1. Navbar          — Navegacao + CTA
2. Hero            — Abertura impactante
3. Stats/LogoCloud — Prova social (opcional)
4. Features        — Diferenciais / beneficios
5. ProductShowcase — Produtos / modulos (se aplicavel)
6. About           — Historia / equipe (opcional)
7. Testimonials    — Depoimentos
8. FAQ             — Perguntas frequentes
9. CTA             — Call-to-action final
10. Contact        — Formulario (opcional)
11. Footer         — Navegacao + social
```

### 9.2 Sequencia Minima (5 blocos)

```
Navbar → Hero → Features → CTA → Footer
```

### 9.3 Sequencia Completa (11 blocos)

```
Navbar → Hero → Stats → ProductShowcase → About → Features → Testimonials → FAQ → Contact → CTA → Footer
```

### 9.4 Regras de IDs

- Prefixar com o nome do template: `admin-hero`, `escola-features`
- Usar kebab-case: `meu-template-contact`
- IDs devem ser unicos dentro do template

### 9.5 Spread de Defaults

SEMPRE usar spread para navbar:
```typescript
props: {
  ...NAVBAR_DEFAULT_PROPS,
  // overrides aqui
}
```

### 9.6 Imagens Placeholder

Usar `placehold.co` para imagens que o usuario substituira:
```
https://placehold.co/{W}x{H}/{bgColor}/{textColor}?text={Texto}
```

Exemplo:
```
https://placehold.co/600x400/6366f1/ffffff?text=Equipe
```

### 9.7 Hover Effects — Coerencia

Manter efeitos consistentes dentro de um template:
- Links: mesmo efeito em navbar e footer
- Botoes: mesmo efeito em hero, CTA, e blocos de secao
- Intensidade uniforme (geralmente 50-60)

### 9.8 URLs Internas

Links de navegacao entre paginas usam o formato:
```
/site/p/{slug-da-pagina}
```

Links para secoes na mesma pagina usam anchor:
```
#{id-do-bloco}
```

### 9.9 Colunas por Tipo de Conteudo

| Tipo | Colunas Recomendadas |
|------|---------------------|
| Features/Beneficios | 3 |
| Depoimentos | 3 |
| Equipe (poucos) | 3-4 |
| Equipe (muitos) | 4 |
| Cursos | 3 |
| Categorias | 4 |
| Planos de preco | 3 |
| Blog cards | 3 |

### 9.10 Estilos de Botao

| Variante | Quando Usar |
|----------|-------------|
| `"solid"` | Acao principal (CTA, "Comecar Agora") |
| `"outline"` | Acao secundaria ("Saiba Mais") |
| `"ghost"` | Acao terciaria, sobre fundos escuros |

### 9.11 Alturas do Hero

| Valor | Quando Usar |
|-------|-------------|
| `"70vh"` | Pagina com muito conteudo abaixo |
| `"85vh"` | Padrao equilibrado |
| `"100vh"` | Fullscreen (overlay, impacto maximo) |
| `"600px"` | Quando viewport-based nao e desejado |

---

## 10. Referencia de CSS Variables

O sistema gera 80+ CSS variables automaticamente a partir do `theme`. Os blocos usam essas variables para se adaptar ao tema.

### Cores

```css
--sg-bg               /* background */
--sg-surface          /* surface (cards) */
--sg-text             /* texto principal */
--sg-muted-text       /* texto secundario */
--sg-primary          /* cor primaria */
--sg-primary-hover    /* primaria no hover */
--sg-primary-text     /* texto sobre primaria */
--sg-secondary        /* cor secundaria */
--sg-accent           /* cor de destaque */
--sg-border           /* bordas */
--sg-success          /* sucesso */
--sg-warning          /* alerta */
--sg-danger           /* erro */
--sg-link             /* links */
--sg-link-hover       /* links no hover */
```

### Tipografia

```css
--sg-font-heading     /* fonte dos titulos */
--sg-font-body        /* fonte do corpo */
--sg-heading-h1       /* tamanho H1 (3rem) */
--sg-heading-h2       /* tamanho H2 (2.25rem) */
--sg-heading-h3       /* tamanho H3 (1.875rem) */
--sg-heading-h4       /* tamanho H4 (1.5rem) */
--sg-heading-h5       /* tamanho H5 (1.25rem) */
--sg-heading-h6       /* tamanho H6 (1rem) */
```

### Layout

```css
--sg-section-padding-sm   /* 2rem 0 */
--sg-section-padding-md   /* 4rem 0 */
--sg-section-padding-lg   /* 6rem 0 */
--sg-container-padding    /* 1rem */
--sg-max-width-lg         /* 1024px */
--sg-max-width-xl         /* 1280px */
```

### Componentes

```css
--sg-button-radius     /* raio dos botoes (0.5rem) */
--sg-card-radius       /* raio dos cards (0.75rem) */
--sg-card-shadow       /* sombra dos cards */
--sg-card-padding      /* padding dos cards (1.5rem) */
--sg-badge-radius      /* raio dos badges (9999px) */
--sg-input-radius      /* raio dos inputs (0.5rem) */
```

### Efeitos

```css
--sg-shadow            /* sombra padrao */
--sg-shadow-soft       /* sombra suave */
--sg-shadow-md         /* sombra media */
--sg-shadow-strong     /* sombra forte */
--sg-transition-fast   /* 150ms ease */
--sg-transition-normal /* 300ms ease */
```

### Espacamento

```css
--sg-spacing-xs        /* extra small */
--sg-spacing-sm        /* small */
--sg-spacing-md        /* medium */
--sg-spacing-lg        /* large */
--sg-spacing-xl        /* extra large */
--sg-spacing-2xl       /* double extra large */
```

---

## Apendice A: Tabela Resumo de Todos os Blocos

| Tipo | Categoria | Hover Buttons | Hover Links | Variacoes | Grid Cols |
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
| `box` | layout | - | - | - | - |
| `spacer` | layout | - | - | - | - |
| `heading` | content | - | - | - | - |
| `text` | content | - | - | - | - |
| `image` | content | - | - | - | - |
| `divider` | content | - | - | - | - |
| `icon` | content | - | - | - | - |
| `badge` | content | - | - | - | - |
| `avatar` | content | - | - | - | - |
| `video` | content | - | - | - | - |
| `form` | forms | - | - | - | - |
| `input` | forms | - | - | - | - |
| `textarea` | forms | - | - | - | - |
| `formSelect` | forms | - | - | - | - |

## Apendice B: Blocos do Plugin Blog

> Requerem ativacao do plugin Blog. Nao usar em templates normais.

| Tipo | Descricao |
|------|-----------|
| `blogPostCard` | Card individual de post (variants: default/horizontal/minimal) |
| `blogPostGrid` | Grid de posts (variants: default/featured/minimal) |
| `blogPostDetail` | Pagina de detalhe do post (authorVariant: inline/card/minimal) |

---

*Este manual cobre 100% das opcoes de personalizacao disponiveis no SmartGesti Site Editor v1.2.x.*
