/**
 * Block Definitions
 * Registra todas as definições de blocos
 */

import { componentRegistry } from "../registry";
import { BlockDefinition } from "../types";
import { heroVariations, heroVariationIds } from "../../presets/heroVariations";
import {
  navbarVariations,
  navbarVariationIds,
} from "../../presets/navbarVariations";

// Layout Blocks
const containerBlock: BlockDefinition = {
  type: "container",
  name: "Container",
  description: "Container com largura máxima e padding",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    maxWidth: "1200px",
    padding: "1rem",
  },
  inspectorMeta: {
    maxWidth: {
      label: "Largura Máxima",
      description: "Largura máxima do container",
      inputType: "text",
      group: "Layout",
    },
    padding: {
      label: "Padding",
      description: "Espaçamento interno",
      inputType: "text",
      group: "Layout",
    },
  },
};

const stackBlock: BlockDefinition = {
  type: "stack",
  name: "Stack",
  description: "Layout flex (linha ou coluna)",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    direction: "col",
    gap: "1rem",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
  inspectorMeta: {
    direction: {
      label: "Direção",
      inputType: "select",
      options: [
        { label: "Coluna", value: "col" },
        { label: "Linha", value: "row" },
      ],
      group: "Layout",
    },
    gap: {
      label: "Gap",
      inputType: "text",
      group: "Layout",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Fim", value: "end" },
        { label: "Esticar", value: "stretch" },
      ],
      group: "Layout",
    },
    justify: {
      label: "Justificar",
      inputType: "select",
      options: [
        { label: "Início", value: "start" },
        { label: "Centro", value: "center" },
        { label: "Fim", value: "end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
      ],
      group: "Layout",
    },
  },
};

const gridBlock: BlockDefinition = {
  type: "grid",
  name: "Grid",
  description: "Layout em grid responsivo",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    cols: 3,
    gap: "1rem",
  },
  inspectorMeta: {
    cols: {
      label: "Colunas",
      description: "Número de colunas (ou objeto responsivo)",
      inputType: "number",
      min: 1,
      max: 12,
      group: "Layout",
    },
    gap: {
      label: "Gap",
      inputType: "text",
      group: "Layout",
    },
  },
};

const boxBlock: BlockDefinition = {
  type: "box",
  name: "Box",
  description: "Container genérico com estilos",
  category: "layout",
  canHaveChildren: true,
  defaultProps: {
    padding: "1rem",
  },
  inspectorMeta: {
    bg: {
      label: "Background",
      inputType: "color",
      group: "Estilo",
    },
    border: {
      label: "Borda",
      inputType: "text",
      group: "Estilo",
    },
    radius: {
      label: "Raio",
      inputType: "text",
      group: "Estilo",
    },
    shadow: {
      label: "Sombra",
      inputType: "text",
      group: "Estilo",
    },
    padding: {
      label: "Padding",
      inputType: "text",
      group: "Layout",
    },
  },
};

// Content Blocks
const headingBlock: BlockDefinition = {
  type: "heading",
  name: "Heading",
  description: "Título (H1-H6)",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    level: 1,
    text: "Título",
    align: "left",
  },
  constraints: {
    required: ["text", "level"],
  },
  inspectorMeta: {
    level: {
      label: "Nível",
      inputType: "select",
      options: [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 },
        { label: "H4", value: 4 },
        { label: "H5", value: 5 },
        { label: "H6", value: 6 },
      ],
      group: "Conteúdo",
    },
    text: {
      label: "Texto",
      inputType: "textarea",
      group: "Conteúdo",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Estilo",
    },
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

const textBlock: BlockDefinition = {
  type: "text",
  name: "Text",
  description: "Parágrafo de texto",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Texto do parágrafo",
    align: "left",
    size: "md",
  },
  constraints: {
    required: ["text"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "textarea",
      group: "Conteúdo",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Estilo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

const imageBlock: BlockDefinition = {
  type: "image",
  name: "Image",
  description: "Imagem",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    src: "",
    alt: "",
    objectFit: "cover",
  },
  constraints: {
    required: ["src"],
    pattern: {
      src: /^https?:\/\/.+|^\/.+|^data:image\/.+/,
    },
  },
  inspectorMeta: {
    src: {
      label: "Imagem",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    alt: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "Conteúdo",
    },
    width: {
      label: "Largura",
      inputType: "text",
      group: "Dimensões",
    },
    height: {
      label: "Altura",
      inputType: "text",
      group: "Dimensões",
    },
    objectFit: {
      label: "Object Fit",
      inputType: "select",
      options: [
        { label: "Contain", value: "contain" },
        { label: "Cover", value: "cover" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
        { label: "Scale Down", value: "scale-down" },
      ],
      group: "Dimensões",
    },
  },
};

const buttonBlock: BlockDefinition = {
  type: "button",
  name: "Button",
  description: "Botão",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Clique aqui",
    variant: "primary",
    size: "md",
  },
  constraints: {
    required: ["text"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    href: {
      label: "Link",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Estilo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
  },
};

const linkBlock: BlockDefinition = {
  type: "link",
  name: "Link",
  description: "Link",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Link",
    href: "#",
    target: "_self",
  },
  constraints: {
    required: ["text", "href"],
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    href: {
      label: "URL",
      inputType: "text",
      group: "Conteúdo",
    },
    target: {
      label: "Target",
      inputType: "select",
      options: [
        { label: "Mesma Janela", value: "_self" },
        { label: "Nova Janela", value: "_blank" },
      ],
      group: "Conteúdo",
    },
  },
};

const dividerBlock: BlockDefinition = {
  type: "divider",
  name: "Divider",
  description: "Divisor horizontal",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    color: "#e5e7eb",
    thickness: "1px",
  },
  inspectorMeta: {
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
    thickness: {
      label: "Espessura",
      inputType: "text",
      group: "Estilo",
    },
  },
};

// Composition Blocks
const cardBlock: BlockDefinition = {
  type: "card",
  name: "Card",
  description: "Card com slots (header/content/footer)",
  category: "composition",
  canHaveChildren: false,
  defaultProps: {
    padding: "1rem",
  },
  slots: [
    { name: "header", label: "Cabeçalho", required: false },
    { name: "content", label: "Conteúdo", required: true },
    { name: "footer", label: "Rodapé", required: false },
  ],
  inspectorMeta: {
    padding: {
      label: "Padding",
      inputType: "text",
      group: "Layout",
    },
    bg: {
      label: "Background",
      inputType: "color",
      group: "Estilo",
    },
    border: {
      label: "Borda",
      inputType: "text",
      group: "Estilo",
    },
    radius: {
      label: "Raio",
      inputType: "text",
      group: "Estilo",
    },
    shadow: {
      label: "Sombra",
      inputType: "text",
      group: "Estilo",
    },
  },
};

const sectionBlock: BlockDefinition = {
  type: "section",
  name: "Section",
  description: "Seção container",
  category: "composition",
  canHaveChildren: true,
  defaultProps: {
    padding: "2rem",
  },
  inspectorMeta: {
    id: {
      label: "ID",
      inputType: "text",
      group: "Geral",
    },
    bg: {
      label: "Background",
      inputType: "color",
      group: "Estilo",
    },
    padding: {
      label: "Padding",
      inputType: "text",
      group: "Layout",
    },
  },
};

// ============================================================================
// NOVOS BLOCOS - LAYOUT AVANÇADO
// ============================================================================

const spacerBlock: BlockDefinition = {
  type: "spacer",
  name: "Spacer",
  description: "Espaçador flexível",
  category: "layout",
  canHaveChildren: false,
  defaultProps: {
    height: "2rem",
  },
  inspectorMeta: {
    height: {
      label: "Altura",
      inputType: "text",
      group: "Layout",
    },
  },
};

// ============================================================================
// NOVOS BLOCOS - CONTEÚDO AVANÇADO
// ============================================================================

const badgeBlock: BlockDefinition = {
  type: "badge",
  name: "Badge",
  description: "Tag/badge com variantes",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Badge",
    variant: "default",
    size: "md",
  },
  inspectorMeta: {
    text: {
      label: "Texto",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Primário", value: "primary" },
        { label: "Secundário", value: "secondary" },
        { label: "Sucesso", value: "success" },
        { label: "Aviso", value: "warning" },
        { label: "Perigo", value: "danger" },
        { label: "Info", value: "info" },
      ],
      group: "Estilo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
  },
};

const iconBlock: BlockDefinition = {
  type: "icon",
  name: "Icon",
  description: "Ícone SVG",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    name: "star",
    size: "md",
  },
  inspectorMeta: {
    name: {
      label: "Ícone",
      inputType: "select",
      options: [
        { label: "Estrela", value: "star" },
        { label: "Check", value: "check" },
        { label: "Seta Direita", value: "arrow-right" },
        { label: "Coração", value: "heart" },
        { label: "Usuário", value: "user" },
        { label: "Email", value: "mail" },
        { label: "Telefone", value: "phone" },
        { label: "Localização", value: "map-pin" },
        { label: "Configurações", value: "settings" },
        { label: "Pesquisar", value: "search" },
        { label: "Menu", value: "menu" },
        { label: "Fechar", value: "x" },
        { label: "Mais", value: "plus" },
        { label: "Menos", value: "minus" },
        { label: "Raio", value: "zap" },
        { label: "Escudo", value: "shield" },
        { label: "Foguete", value: "rocket" },
        { label: "Troféu", value: "trophy" },
        { label: "Gráfico", value: "bar-chart" },
        { label: "Globo", value: "globe" },
      ],
      group: "Conteúdo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Estilo",
    },
    color: {
      label: "Cor",
      inputType: "color",
      group: "Estilo",
    },
  },
};

const avatarBlock: BlockDefinition = {
  type: "avatar",
  name: "Avatar",
  description: "Imagem circular com fallback",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    size: "md",
  },
  inspectorMeta: {
    src: {
      label: "Imagem do Avatar",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    name: {
      label: "Nome (para iniciais)",
      inputType: "text",
      group: "Conteúdo",
    },
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "Estilo",
    },
  },
};

const videoBlock: BlockDefinition = {
  type: "video",
  name: "Video",
  description: "Embed de vídeo",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    src: "",
    controls: true,
    aspectRatio: "16:9",
  },
  inspectorMeta: {
    src: {
      label: "URL do Vídeo",
      inputType: "text",
      group: "Conteúdo",
    },
    poster: {
      label: "Thumbnail (Imagem de Capa)",
      inputType: "image-upload",
      group: "Conteúdo",
    },
    aspectRatio: {
      label: "Proporção",
      inputType: "select",
      options: [
        { label: "16:9", value: "16:9" },
        { label: "4:3", value: "4:3" },
        { label: "1:1", value: "1:1" },
        { label: "9:16", value: "9:16" },
      ],
      group: "Layout",
    },
    autoplay: {
      label: "Autoplay",
      inputType: "checkbox",
      group: "Opções",
    },
    controls: {
      label: "Controles",
      inputType: "checkbox",
      group: "Opções",
    },
  },
};

const socialLinksBlock: BlockDefinition = {
  type: "socialLinks",
  name: "Social Links",
  description: "Links para redes sociais",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    size: "md",
    variant: "default",
    links: [
      { platform: "facebook", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "instagram", url: "#" },
    ],
  },
  inspectorMeta: {
    size: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "Estilo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Preenchido", value: "filled" },
      ],
      group: "Estilo",
    },
  },
};

// ============================================================================
// NOVOS BLOCOS - SEÇÕES COMPOSTAS
// ============================================================================

const heroBlock: BlockDefinition = {
  type: "hero",
  name: "Hero",
  description: "Seção hero completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    variant: "centered",
    title: "Bem-vindo ao Nosso Site",
    subtitle: "Subtitulo incrível aqui",
    description: "Uma descrição breve do seu produto ou serviço.",
    primaryButton: { text: "Começar Agora" },
    secondaryButton: { text: "Saber Mais" },
    align: "center",
  },
  variations: heroVariationIds.reduce(
    (acc, id) => {
      const v = heroVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    variation: {
      label: "Variação",
      inputType: "select",
      options: heroVariationIds.map((id) => ({
        label: heroVariations[id].name,
        value: id,
      })),
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Centralizado", value: "centered" },
        { label: "Dividido", value: "split" },
        { label: "Com Imagem de Fundo", value: "image-bg" },
      ],
      group: "Layout",
    },
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
    image: {
      label: "Imagem de Fundo",
      inputType: "image-upload",
      group: "Mídia",
      description: "Upload de imagem para o hero (recomendado: 1920x1080px)",
    },
    overlay: {
      label: "Overlay sobre a imagem",
      inputType: "checkbox",
      group: "Estilo",
    },
    overlayColor: {
      label: "Cor do Overlay",
      inputType: "text",
      group: "Estilo",
      description:
        "Ex.: linear-gradient(135deg, rgba(37,99,235,0.9), rgba(29,78,216,0.85))",
    },
    background: {
      label: "Background (cor ou gradiente)",
      inputType: "text",
      group: "Estilo",
      description: "Layout split: cor ou gradiente no lado do conteúdo",
    },
    align: {
      label: "Alinhamento",
      inputType: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
      group: "Estilo",
    },
  },
};

const featureBlock: BlockDefinition = {
  type: "feature",
  name: "Feature",
  description: "Card de feature individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    icon: "star",
    title: "Feature",
    description: "Descrição da feature",
  },
  inspectorMeta: {
    icon: {
      label: "Ícone",
      inputType: "select",
      options: [
        { label: "Estrela", value: "star" },
        { label: "Check", value: "check" },
        { label: "Raio", value: "zap" },
        { label: "Escudo", value: "shield" },
        { label: "Foguete", value: "rocket" },
        { label: "Globo", value: "globe" },
        { label: "Gráfico", value: "bar-chart" },
        { label: "Usuários", value: "users" },
      ],
      group: "Conteúdo",
    },
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
  },
};

const featureGridBlock: BlockDefinition = {
  type: "featureGrid",
  name: "Feature Grid",
  description: "Grid de features (ícones, cards ou cards com imagem)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Nossas Features",
    subtitle: "Tudo que você precisa",
    columns: 3,
    variant: "default",
    features: [
      { icon: "zap", title: "Rápido", description: "Performance incrível" },
      { icon: "shield", title: "Seguro", description: "Proteção total" },
      { icon: "rocket", title: "Escalável", description: "Cresce com você" },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2 Colunas", value: 2 },
        { label: "3 Colunas", value: 3 },
        { label: "4 Colunas", value: 4 },
      ],
      group: "Layout",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Cards", value: "cards" },
        { label: "Cards com Imagem", value: "image-cards" },
      ],
      group: "Layout",
    },
  },
};

const pricingCardBlock: BlockDefinition = {
  type: "pricingCard",
  name: "Pricing Card",
  description: "Card de preço individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    name: "Plano Pro",
    price: "R$ 99",
    period: "/mês",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    buttonText: "Começar",
  },
  inspectorMeta: {
    name: {
      label: "Nome do Plano",
      inputType: "text",
      group: "Conteúdo",
    },
    price: {
      label: "Preço",
      inputType: "text",
      group: "Conteúdo",
    },
    period: {
      label: "Período",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "text",
      group: "Conteúdo",
    },
    buttonText: {
      label: "Texto do Botão",
      inputType: "text",
      group: "Conteúdo",
    },
    highlighted: {
      label: "Destacado",
      inputType: "checkbox",
      group: "Estilo",
    },
    badge: {
      label: "Badge",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const pricingBlock: BlockDefinition = {
  type: "pricing",
  name: "Pricing",
  description: "Seção de preços completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Planos e Preços",
    subtitle: "Escolha o plano ideal para você",
    plans: [
      {
        name: "Básico",
        price: "R$ 29",
        period: "/mês",
        features: ["1 Usuário", "10GB Storage", "Suporte Email"],
        buttonText: "Escolher",
      },
      {
        name: "Pro",
        price: "R$ 99",
        period: "/mês",
        features: [
          "5 Usuários",
          "100GB Storage",
          "Suporte Prioritário",
          "API Access",
        ],
        buttonText: "Escolher",
        highlighted: true,
        badge: "Popular",
      },
      {
        name: "Enterprise",
        price: "R$ 299",
        period: "/mês",
        features: [
          "Usuários Ilimitados",
          "Storage Ilimitado",
          "Suporte 24/7",
          "API Access",
          "SSO",
        ],
        buttonText: "Contato",
      },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const testimonialBlock: BlockDefinition = {
  type: "testimonial",
  name: "Testimonial",
  description: "Card de depoimento individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    quote: "Produto incrível! Recomendo a todos.",
    authorName: "João Silva",
    authorRole: "CEO",
    authorCompany: "Empresa X",
    rating: 5,
  },
  inspectorMeta: {
    quote: {
      label: "Depoimento",
      inputType: "textarea",
      group: "Conteúdo",
    },
    authorName: {
      label: "Nome",
      inputType: "text",
      group: "Autor",
    },
    authorRole: {
      label: "Cargo",
      inputType: "text",
      group: "Autor",
    },
    authorCompany: {
      label: "Empresa",
      inputType: "text",
      group: "Autor",
    },
    authorAvatar: {
      label: "Avatar do Autor",
      inputType: "image-upload",
      group: "Autor",
    },
    rating: {
      label: "Estrelas",
      inputType: "number",
      min: 1,
      max: 5,
      group: "Estilo",
    },
  },
};

const testimonialGridBlock: BlockDefinition = {
  type: "testimonialGrid",
  name: "Testimonial Grid",
  description: "Grid de depoimentos",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "O Que Nossos Clientes Dizem",
    columns: 3,
    testimonials: [
      {
        quote: "Excelente produto!",
        authorName: "Maria",
        authorRole: "Gerente",
        rating: 5,
      },
      {
        quote: "Recomendo muito!",
        authorName: "Pedro",
        authorRole: "Diretor",
        rating: 5,
      },
      {
        quote: "Transformou nosso negócio.",
        authorName: "Ana",
        authorRole: "CEO",
        rating: 5,
      },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2 Colunas", value: 2 },
        { label: "3 Colunas", value: 3 },
        { label: "4 Colunas", value: 4 },
      ],
      group: "Layout",
    },
  },
};

const faqItemBlock: BlockDefinition = {
  type: "faqItem",
  name: "FAQ Item",
  description: "Item individual do FAQ",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    question: "Pergunta frequente?",
    answer: "Resposta detalhada aqui.",
  },
  inspectorMeta: {
    question: {
      label: "Pergunta",
      inputType: "text",
      group: "Conteúdo",
    },
    answer: {
      label: "Resposta",
      inputType: "textarea",
      group: "Conteúdo",
    },
    defaultOpen: {
      label: "Aberto por Padrão",
      inputType: "checkbox",
      group: "Opções",
    },
  },
};

const faqBlock: BlockDefinition = {
  type: "faq",
  name: "FAQ",
  description: "Seção FAQ completa",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Perguntas Frequentes",
    items: [
      { question: "Como funciona?", answer: "Explicamos tudo aqui." },
      { question: "Qual o preço?", answer: "Confira nossa página de preços." },
      { question: "Posso cancelar?", answer: "Sim, a qualquer momento." },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const ctaBlock: BlockDefinition = {
  type: "cta",
  name: "CTA",
  description: "Seção Call-to-Action",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Pronto para começar?",
    description: "Junte-se a milhares de usuários satisfeitos.",
    primaryButton: { text: "Começar Agora" },
    variant: "centered",
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Centralizado", value: "centered" },
        { label: "Dividido", value: "split" },
        { label: "Gradiente", value: "gradient" },
      ],
      group: "Estilo",
    },
    bg: {
      label: "Background",
      inputType: "color",
      group: "Estilo",
    },
  },
};

const statsBlock: BlockDefinition = {
  type: "stats",
  name: "Stats",
  description: "Seção de estatísticas",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Números que Impressionam",
    items: [
      { value: "10K+", label: "Usuários" },
      { value: "99%", label: "Satisfação" },
      { value: "24/7", label: "Suporte" },
      { value: "50+", label: "Países" },
    ],
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    subtitle: {
      label: "Subtítulo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const statItemBlock: BlockDefinition = {
  type: "statItem",
  name: "Stat Item",
  description: "Item individual de estatística",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    value: "100",
    label: "Clientes",
  },
  inspectorMeta: {
    value: {
      label: "Valor",
      inputType: "text",
      group: "Conteúdo",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    prefix: {
      label: "Prefixo",
      inputType: "text",
      group: "Conteúdo",
    },
    suffix: {
      label: "Sufixo",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const logoCloudBlock: BlockDefinition = {
  type: "logoCloud",
  name: "Logo Cloud",
  description: "Grid de logos de clientes/parceiros",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Empresas que confiam em nós",
    logos: [],
    grayscale: true,
  },
  inspectorMeta: {
    title: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
    grayscale: {
      label: "Escala de Cinza",
      inputType: "checkbox",
      group: "Estilo",
    },
  },
};

const navbarBlock: BlockDefinition = {
  type: "navbar",
  name: "Navbar",
  description: "Barra de navegação customizável com suporte a dropdowns",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    variation: "navbar-classic",
    logoText: "Logo",
    links: [
      { text: "Início", href: "/site/p/home" },
      {
        text: "Serviços",
        href: "#",
        submenu: [
          {
            text: "Web Design",
            href: "/site/p/web-design",
            description: "Criação de sites modernos",
          },
          {
            text: "SEO",
            href: "/site/p/seo",
            description: "Otimização para motores de busca",
          },
          {
            text: "Marketing Digital",
            href: "/site/p/marketing",
            description: "Estratégias de marketing online",
          },
        ],
      },
      {
        text: "Produtos",
        href: "#",
        submenu: [
          { text: "Software", href: "/site/p/software" },
          { text: "Consultoria", href: "/site/p/consultoria" },
          { text: "Treinamento", href: "/site/p/treinamento" },
        ],
      },
      { text: "Contato", href: "/site/p/contato" },
    ] as any, // Estrutura dinâmica com suporte a submenus
    ctaButton: { text: "Começar", href: "/site/p/contato" },
    sticky: true,
    floating: false,
    layout: "expanded",
    borderRadius: 0,
    shadow: "sm",
    opacity: 100,
    linkFontSize: "md",
    buttonVariant: "solid",
    buttonBorderRadius: 8,
  },
  variations: navbarVariationIds.reduce(
    (acc, id) => {
      const v = navbarVariations[id];
      acc[id] = { id: v.id, name: v.name, defaultProps: v.defaultProps };
      return acc;
    },
    {} as Record<
      string,
      { id: string; name: string; defaultProps: Record<string, unknown> }
    >,
  ),
  inspectorMeta: {
    // === GRUPO: 🎨 Aparência ===
    bg: {
      label: "Cor de Fundo",
      inputType: "color-advanced",
      group: "🎨 Aparência",
    },
    opacity: {
      label: "Opacidade",
      inputType: "slider",
      min: 0,
      max: 100,
      step: 5,
      group: "🎨 Aparência",
    },
    borderRadius: {
      label: "Arredondamento",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "🎨 Aparência",
    },
    shadow: {
      label: "Sombra",
      inputType: "select",
      options: [
        { label: "Nenhuma", value: "none" },
        { label: "Pequena", value: "sm" },
        { label: "Média", value: "md" },
        { label: "Grande", value: "lg" },
        { label: "Extra Grande", value: "xl" },
      ],
      group: "🎨 Aparência",
    },

    // === GRUPO: 📐 Layout ===
    layout: {
      label: "Distribuição",
      inputType: "select",
      options: [
        { label: "Expandido", value: "expanded" },
        { label: "Centralizado", value: "centered" },
        { label: "Compacto", value: "compact" },
      ],
      group: "📐 Layout",
    },
    sticky: {
      label: "Fixo no Topo",
      inputType: "checkbox",
      group: "📐 Layout",
    },
    floating: {
      label: "Modo Flutuante",
      inputType: "checkbox",
      group: "📐 Layout",
    },

    // === GRUPO: 🖼️ Logo ===
    logo: {
      label: "Logo (Imagem)",
      inputType: "image-upload",
      group: "🖼️ Logo",
    },
    logoText: {
      label: "Texto Alternativo",
      inputType: "text",
      group: "🖼️ Logo",
    },

    // === GRUPO: 🔗 Links ===
    linkColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "🔗 Links",
    },
    linkHoverColor: {
      label: "Cor (Hover)",
      inputType: "color-advanced",
      group: "🔗 Links",
    },
    linkFontSize: {
      label: "Tamanho",
      inputType: "select",
      options: [
        { label: "Pequeno", value: "sm" },
        { label: "Médio", value: "md" },
        { label: "Grande", value: "lg" },
      ],
      group: "🔗 Links",
    },

    // === GRUPO: 🎯 Botão CTA ===
    buttonVariant: {
      label: "Estilo",
      inputType: "select",
      options: [
        { label: "Sólido", value: "solid" },
        { label: "Contorno", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "🎯 Botão CTA",
    },
    buttonColor: {
      label: "Cor",
      inputType: "color-advanced",
      group: "🎯 Botão CTA",
    },
    buttonTextColor: {
      label: "Cor do Texto",
      inputType: "color-advanced",
      group: "🎯 Botão CTA",
    },
    buttonBorderRadius: {
      label: "Arredondamento",
      inputType: "slider",
      min: 0,
      max: 32,
      step: 2,
      group: "🎯 Botão CTA",
    },
  },
};

const footerBlock: BlockDefinition = {
  type: "footer",
  name: "Footer",
  description: "Rodapé do site",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    logoText: "Logo",
    description: "Descrição do site",
    columns: [
      {
        title: "Links",
        links: [
          { text: "Home", href: "/" },
          { text: "Sobre", href: "/sobre" },
        ],
      },
    ],
    social: [],
    copyright: "© 2025. Todos os direitos reservados.",
    variant: "simple",
  },
  inspectorMeta: {
    logoText: {
      label: "Logo (texto)",
      inputType: "text",
      group: "Logo",
    },
    description: {
      label: "Descrição",
      inputType: "textarea",
      group: "Conteúdo",
    },
    copyright: {
      label: "Copyright",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Simples", value: "simple" },
        { label: "Multi-colunas", value: "multi-column" },
      ],
      group: "Layout",
    },
  },
};

// ============================================================================
// NOVOS BLOCOS REUTILIZÁVEIS
// ============================================================================

const countdownBlock: BlockDefinition = {
  type: "countdown",
  name: "Countdown",
  description: "Contador regressivo (eventos, matrículas, promoções)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Spring 2024 Admission is Now Open!",
    showPlaceholders: true,
    buttonText: "Apply Now",
    buttonHref: "#",
    variant: "banner",
    badgeText: "Admission on Going",
    bg: "var(--sg-primary)",
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    description: { label: "Descrição", inputType: "text", group: "Conteúdo" },
    endDate: {
      label: "Data final (ISO)",
      inputType: "text",
      group: "Conteúdo",
    },
    showPlaceholders: {
      label: "Exibir placeholders",
      inputType: "checkbox",
      group: "Conteúdo",
    },
    buttonText: {
      label: "Texto do botão",
      inputType: "text",
      group: "Conteúdo",
    },
    buttonHref: {
      label: "Link do botão",
      inputType: "text",
      group: "Conteúdo",
    },
    variant: {
      label: "Variante",
      inputType: "select",
      options: [
        { label: "Padrão", value: "default" },
        { label: "Banner", value: "banner" },
      ],
      group: "Layout",
    },
    badgeText: {
      label: "Texto do badge (círculo)",
      inputType: "text",
      group: "Conteúdo",
    },
    bg: { label: "Cor de fundo", inputType: "text", group: "Estilo" },
  },
};

const carouselBlock: BlockDefinition = {
  type: "carousel",
  name: "Carousel",
  description: "Slider de slides (programas, destaques)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    slides: [
      {
        image: "https://placehold.co/600x400/1e40af/fff?text=Program",
        title: "Natural Programs for Children",
        description: "Programas que desenvolvem habilidades naturais.",
        primaryButton: { text: "Explore More", href: "#" },
        secondaryButton: { text: "View Courses", href: "#" },
      },
    ],
    showArrows: true,
    showDots: false,
  },
  inspectorMeta: {
    showArrows: { label: "Setas", inputType: "checkbox", group: "Layout" },
    showDots: { label: "Dots", inputType: "checkbox", group: "Layout" },
    autoplay: { label: "Autoplay", inputType: "checkbox", group: "Layout" },
  },
};

const blogCardBlock: BlockDefinition = {
  type: "blogCard",
  name: "Blog Card",
  description: "Card de post/notícia individual",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Post Title",
    excerpt: "Excerpt text here.",
    linkText: "Read More",
    linkHref: "#",
  },
  inspectorMeta: {
    image: { label: "Imagem", inputType: "image-upload", group: "Conteúdo" },
    date: { label: "Data", inputType: "text", group: "Conteúdo" },
    category: { label: "Categoria", inputType: "text", group: "Conteúdo" },
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    excerpt: { label: "Resumo", inputType: "textarea", group: "Conteúdo" },
    linkText: { label: "Texto do link", inputType: "text", group: "Conteúdo" },
    linkHref: { label: "URL do link", inputType: "text", group: "Conteúdo" },
  },
};

const blogCardGridBlock: BlockDefinition = {
  type: "blogCardGrid",
  name: "Blog Card Grid",
  description: "Grid de cards de blog/notícias",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Recently News & Blogs",
    subtitle: "Latest updates and articles",
    columns: 3,
    cards: [
      {
        title: "Post 1",
        excerpt: "Excerpt 1",
        linkText: "Read More",
        linkHref: "#",
      },
      {
        title: "Post 2",
        excerpt: "Excerpt 2",
        linkText: "Read More",
        linkHref: "#",
      },
      {
        title: "Post 3",
        excerpt: "Excerpt 3",
        linkText: "Read More",
        linkHref: "#",
      },
    ],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Conteúdo" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
  },
};

const teamCardBlock: BlockDefinition = {
  type: "teamCard",
  name: "Team Card",
  description: "Card de membro da equipe/professor",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    name: "John Doe",
    role: "Creative Teacher",
  },
  inspectorMeta: {
    avatar: { label: "Foto", inputType: "image-upload", group: "Conteúdo" },
    name: { label: "Nome", inputType: "text", group: "Conteúdo" },
    role: { label: "Cargo", inputType: "text", group: "Conteúdo" },
  },
};

const teamGridBlock: BlockDefinition = {
  type: "teamGrid",
  name: "Team Grid",
  description: "Grid de membros da equipe/professores",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Meet Our Teachers",
    subtitle: "Our dedicated team",
    columns: 4,
    members: [
      { name: "Teacher 1", role: "Creative Teacher" },
      { name: "Teacher 2", role: "Math Teacher" },
      { name: "Teacher 3", role: "Science Teacher" },
      { name: "Teacher 4", role: "Art Teacher" },
    ],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Conteúdo" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
  },
};

const courseCardGridBlock: BlockDefinition = {
  type: "courseCardGrid",
  name: "Course Card Grid",
  description: "Grid de cards de curso (thumbnail, preço, rating, View Course)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Popular Courses",
    subtitle: "Explore our courses",
    columns: 3,
    cards: [
      {
        title: "Course 1",
        price: "$29.00",
        rating: 5,
        meta: ["2h", "120 students"],
        buttonText: "View Course",
        buttonHref: "#",
      },
      {
        title: "Course 2",
        price: "$39.00",
        rating: 4,
        meta: ["3h", "85 students"],
        buttonText: "View Course",
        buttonHref: "#",
      },
      {
        title: "Course 3",
        price: "$49.00",
        rating: 5,
        meta: ["4h", "200 students"],
        buttonText: "View Course",
        buttonHref: "#",
      },
    ],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Conteúdo" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
  },
};

const categoryCardGridBlock: BlockDefinition = {
  type: "categoryCardGrid",
  name: "Category Card Grid",
  description: "Grid de categorias (imagem de fundo + título overlay + link)",
  category: "sections",
  canHaveChildren: false,
  defaultProps: {
    title: "Top Categories",
    subtitle: "Browse by category",
    columns: 4,
    categories: [
      {
        image: "https://placehold.co/400x240/6366f1/fff?text=Art",
        title: "Art & Design",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/8b5cf6/fff?text=Business",
        title: "Business",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/a855f7/fff?text=Dev",
        title: "Development",
        href: "#",
      },
      {
        image: "https://placehold.co/400x240/d946ef/fff?text=Marketing",
        title: "Marketing",
        href: "#",
      },
    ],
  },
  inspectorMeta: {
    title: { label: "Título", inputType: "text", group: "Conteúdo" },
    subtitle: { label: "Subtítulo", inputType: "text", group: "Conteúdo" },
    columns: {
      label: "Colunas",
      inputType: "select",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      group: "Layout",
    },
  },
};

// ============================================================================
// NOVOS BLOCOS - FORMULÁRIOS
// ============================================================================

const formBlock: BlockDefinition = {
  type: "form",
  name: "Form",
  description: "Container de formulário",
  category: "forms",
  canHaveChildren: true,
  defaultProps: {
    submitText: "Enviar",
  },
  inspectorMeta: {
    action: {
      label: "Action URL",
      inputType: "text",
      group: "Config",
    },
    method: {
      label: "Método",
      inputType: "select",
      options: [
        { label: "POST", value: "post" },
        { label: "GET", value: "get" },
      ],
      group: "Config",
    },
    submitText: {
      label: "Texto do Botão",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};

const inputBlock: BlockDefinition = {
  type: "input",
  name: "Input",
  description: "Campo de entrada",
  category: "forms",
  canHaveChildren: false,
  defaultProps: {
    name: "campo",
    type: "text",
    placeholder: "Digite aqui...",
  },
  inspectorMeta: {
    name: {
      label: "Nome",
      inputType: "text",
      group: "Config",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    placeholder: {
      label: "Placeholder",
      inputType: "text",
      group: "Conteúdo",
    },
    type: {
      label: "Tipo",
      inputType: "select",
      options: [
        { label: "Texto", value: "text" },
        { label: "Email", value: "email" },
        { label: "Senha", value: "password" },
        { label: "Telefone", value: "tel" },
        { label: "URL", value: "url" },
        { label: "Número", value: "number" },
      ],
      group: "Config",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

const textareaBlockDef: BlockDefinition = {
  type: "textarea",
  name: "Textarea",
  description: "Campo de texto longo",
  category: "forms",
  canHaveChildren: false,
  defaultProps: {
    name: "mensagem",
    placeholder: "Digite sua mensagem...",
    rows: 4,
  },
  inspectorMeta: {
    name: {
      label: "Nome",
      inputType: "text",
      group: "Config",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    placeholder: {
      label: "Placeholder",
      inputType: "text",
      group: "Conteúdo",
    },
    rows: {
      label: "Linhas",
      inputType: "number",
      min: 2,
      max: 20,
      group: "Layout",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

const formSelectBlock: BlockDefinition = {
  type: "formSelect",
  name: "Select",
  description: "Dropdown de formulário",
  category: "forms",
  canHaveChildren: false,
  defaultProps: {
    name: "opcao",
    placeholder: "Selecione...",
    options: [
      { value: "opt1", label: "Opção 1" },
      { value: "opt2", label: "Opção 2" },
      { value: "opt3", label: "Opção 3" },
    ],
  },
  inspectorMeta: {
    name: {
      label: "Nome",
      inputType: "text",
      group: "Config",
    },
    label: {
      label: "Label",
      inputType: "text",
      group: "Conteúdo",
    },
    placeholder: {
      label: "Placeholder",
      inputType: "text",
      group: "Conteúdo",
    },
    required: {
      label: "Obrigatório",
      inputType: "checkbox",
      group: "Config",
    },
  },
};

/**
 * Registra todos os blocos
 */
export function registerAllBlocks(): void {
  // Layout
  componentRegistry.register(containerBlock);
  componentRegistry.register(stackBlock);
  componentRegistry.register(gridBlock);
  componentRegistry.register(boxBlock);
  componentRegistry.register(spacerBlock);

  // Conteúdo básico
  componentRegistry.register(headingBlock);
  componentRegistry.register(textBlock);
  componentRegistry.register(imageBlock);
  componentRegistry.register(buttonBlock);
  componentRegistry.register(linkBlock);
  componentRegistry.register(dividerBlock);

  // Conteúdo avançado
  componentRegistry.register(badgeBlock);
  componentRegistry.register(iconBlock);
  componentRegistry.register(avatarBlock);
  componentRegistry.register(videoBlock);
  componentRegistry.register(socialLinksBlock);

  // Composição básica
  componentRegistry.register(cardBlock);
  componentRegistry.register(sectionBlock);

  // Seções compostas
  componentRegistry.register(heroBlock);
  componentRegistry.register(featureBlock);
  componentRegistry.register(featureGridBlock);
  componentRegistry.register(pricingCardBlock);
  componentRegistry.register(pricingBlock);
  componentRegistry.register(testimonialBlock);
  componentRegistry.register(testimonialGridBlock);
  componentRegistry.register(faqItemBlock);
  componentRegistry.register(faqBlock);
  componentRegistry.register(ctaBlock);
  componentRegistry.register(statsBlock);
  componentRegistry.register(statItemBlock);
  componentRegistry.register(logoCloudBlock);
  componentRegistry.register(navbarBlock);
  componentRegistry.register(footerBlock);

  // Novos blocos reutilizáveis
  componentRegistry.register(countdownBlock);
  componentRegistry.register(carouselBlock);
  componentRegistry.register(blogCardBlock);
  componentRegistry.register(blogCardGridBlock);
  componentRegistry.register(teamCardBlock);
  componentRegistry.register(teamGridBlock);
  componentRegistry.register(courseCardGridBlock);
  componentRegistry.register(categoryCardGridBlock);

  // Formulários
  componentRegistry.register(formBlock);
  componentRegistry.register(inputBlock);
  componentRegistry.register(textareaBlockDef);
  componentRegistry.register(formSelectBlock);
}

// Auto-registrar ao importar
registerAllBlocks();
