/**
 * Block Definitions
 * Registra todas as definições de blocos
 */

import { componentRegistry } from '../registry'
import { BlockDefinition } from '../types'

// Layout Blocks
const containerBlock: BlockDefinition = {
  type: 'container',
  name: 'Container',
  description: 'Container com largura máxima e padding',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    maxWidth: '1200px',
    padding: '1rem',
  },
  inspectorMeta: {
    maxWidth: {
      label: 'Largura Máxima',
      description: 'Largura máxima do container',
      inputType: 'text',
      group: 'Layout',
    },
    padding: {
      label: 'Padding',
      description: 'Espaçamento interno',
      inputType: 'text',
      group: 'Layout',
    },
  },
}

const stackBlock: BlockDefinition = {
  type: 'stack',
  name: 'Stack',
  description: 'Layout flex (linha ou coluna)',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    direction: 'col',
    gap: '1rem',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  inspectorMeta: {
    direction: {
      label: 'Direção',
      inputType: 'select',
      options: [
        { label: 'Coluna', value: 'col' },
        { label: 'Linha', value: 'row' },
      ],
      group: 'Layout',
    },
    gap: {
      label: 'Gap',
      inputType: 'text',
      group: 'Layout',
    },
    align: {
      label: 'Alinhamento',
      inputType: 'select',
      options: [
        { label: 'Início', value: 'start' },
        { label: 'Centro', value: 'center' },
        { label: 'Fim', value: 'end' },
        { label: 'Esticar', value: 'stretch' },
      ],
      group: 'Layout',
    },
    justify: {
      label: 'Justificar',
      inputType: 'select',
      options: [
        { label: 'Início', value: 'start' },
        { label: 'Centro', value: 'center' },
        { label: 'Fim', value: 'end' },
        { label: 'Space Between', value: 'space-between' },
        { label: 'Space Around', value: 'space-around' },
      ],
      group: 'Layout',
    },
  },
}

const gridBlock: BlockDefinition = {
  type: 'grid',
  name: 'Grid',
  description: 'Layout em grid responsivo',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    cols: 3,
    gap: '1rem',
  },
  inspectorMeta: {
    cols: {
      label: 'Colunas',
      description: 'Número de colunas (ou objeto responsivo)',
      inputType: 'number',
      min: 1,
      max: 12,
      group: 'Layout',
    },
    gap: {
      label: 'Gap',
      inputType: 'text',
      group: 'Layout',
    },
  },
}

const boxBlock: BlockDefinition = {
  type: 'box',
  name: 'Box',
  description: 'Container genérico com estilos',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    padding: '1rem',
  },
  inspectorMeta: {
    bg: {
      label: 'Background',
      inputType: 'color',
      group: 'Estilo',
    },
    border: {
      label: 'Borda',
      inputType: 'text',
      group: 'Estilo',
    },
    radius: {
      label: 'Raio',
      inputType: 'text',
      group: 'Estilo',
    },
    shadow: {
      label: 'Sombra',
      inputType: 'text',
      group: 'Estilo',
    },
    padding: {
      label: 'Padding',
      inputType: 'text',
      group: 'Layout',
    },
  },
}

// Content Blocks
const headingBlock: BlockDefinition = {
  type: 'heading',
  name: 'Heading',
  description: 'Título (H1-H6)',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    level: 1,
    text: 'Título',
    align: 'left',
  },
  constraints: {
    required: ['text', 'level'],
  },
  inspectorMeta: {
    level: {
      label: 'Nível',
      inputType: 'select',
      options: [
        { label: 'H1', value: 1 },
        { label: 'H2', value: 2 },
        { label: 'H3', value: 3 },
        { label: 'H4', value: 4 },
        { label: 'H5', value: 5 },
        { label: 'H6', value: 6 },
      ],
      group: 'Conteúdo',
    },
    text: {
      label: 'Texto',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    align: {
      label: 'Alinhamento',
      inputType: 'select',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
      group: 'Estilo',
    },
    color: {
      label: 'Cor',
      inputType: 'color',
      group: 'Estilo',
    },
  },
}

const textBlock: BlockDefinition = {
  type: 'text',
  name: 'Text',
  description: 'Parágrafo de texto',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Texto do parágrafo',
    align: 'left',
    size: 'md',
  },
  constraints: {
    required: ['text'],
  },
  inspectorMeta: {
    text: {
      label: 'Texto',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    align: {
      label: 'Alinhamento',
      inputType: 'select',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
      group: 'Estilo',
    },
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
      ],
      group: 'Estilo',
    },
    color: {
      label: 'Cor',
      inputType: 'color',
      group: 'Estilo',
    },
  },
}

const imageBlock: BlockDefinition = {
  type: 'image',
  name: 'Image',
  description: 'Imagem',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    src: '',
    alt: '',
    objectFit: 'cover',
  },
  constraints: {
    required: ['src'],
    pattern: {
      src: /^https?:\/\/.+|^\/.+|^data:image\/.+/,
    },
  },
  inspectorMeta: {
    src: {
      label: 'URL da Imagem',
      inputType: 'image',
      group: 'Conteúdo',
    },
    alt: {
      label: 'Texto Alternativo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    width: {
      label: 'Largura',
      inputType: 'text',
      group: 'Dimensões',
    },
    height: {
      label: 'Altura',
      inputType: 'text',
      group: 'Dimensões',
    },
    objectFit: {
      label: 'Object Fit',
      inputType: 'select',
      options: [
        { label: 'Contain', value: 'contain' },
        { label: 'Cover', value: 'cover' },
        { label: 'Fill', value: 'fill' },
        { label: 'None', value: 'none' },
        { label: 'Scale Down', value: 'scale-down' },
      ],
      group: 'Dimensões',
    },
  },
}

const buttonBlock: BlockDefinition = {
  type: 'button',
  name: 'Button',
  description: 'Botão',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Clique aqui',
    variant: 'primary',
    size: 'md',
  },
  constraints: {
    required: ['text'],
  },
  inspectorMeta: {
    text: {
      label: 'Texto',
      inputType: 'text',
      group: 'Conteúdo',
    },
    href: {
      label: 'Link',
      inputType: 'text',
      group: 'Conteúdo',
    },
    variant: {
      label: 'Variante',
      inputType: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ],
      group: 'Estilo',
    },
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
      ],
      group: 'Estilo',
    },
  },
}

const linkBlock: BlockDefinition = {
  type: 'link',
  name: 'Link',
  description: 'Link',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Link',
    href: '#',
    target: '_self',
  },
  constraints: {
    required: ['text', 'href'],
  },
  inspectorMeta: {
    text: {
      label: 'Texto',
      inputType: 'text',
      group: 'Conteúdo',
    },
    href: {
      label: 'URL',
      inputType: 'text',
      group: 'Conteúdo',
    },
    target: {
      label: 'Target',
      inputType: 'select',
      options: [
        { label: 'Mesma Janela', value: '_self' },
        { label: 'Nova Janela', value: '_blank' },
      ],
      group: 'Conteúdo',
    },
  },
}

const dividerBlock: BlockDefinition = {
  type: 'divider',
  name: 'Divider',
  description: 'Divisor horizontal',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    color: '#e5e7eb',
    thickness: '1px',
  },
  inspectorMeta: {
    color: {
      label: 'Cor',
      inputType: 'color',
      group: 'Estilo',
    },
    thickness: {
      label: 'Espessura',
      inputType: 'text',
      group: 'Estilo',
    },
  },
}

// Composition Blocks
const cardBlock: BlockDefinition = {
  type: 'card',
  name: 'Card',
  description: 'Card com slots (header/content/footer)',
  category: 'composition',
  canHaveChildren: false,
  defaultProps: {
    padding: '1rem',
  },
  slots: [
    { name: 'header', label: 'Cabeçalho', required: false },
    { name: 'content', label: 'Conteúdo', required: true },
    { name: 'footer', label: 'Rodapé', required: false },
  ],
  inspectorMeta: {
    padding: {
      label: 'Padding',
      inputType: 'text',
      group: 'Layout',
    },
    bg: {
      label: 'Background',
      inputType: 'color',
      group: 'Estilo',
    },
    border: {
      label: 'Borda',
      inputType: 'text',
      group: 'Estilo',
    },
    radius: {
      label: 'Raio',
      inputType: 'text',
      group: 'Estilo',
    },
    shadow: {
      label: 'Sombra',
      inputType: 'text',
      group: 'Estilo',
    },
  },
}

const sectionBlock: BlockDefinition = {
  type: 'section',
  name: 'Section',
  description: 'Seção container',
  category: 'composition',
  canHaveChildren: true,
  defaultProps: {
    padding: '2rem',
  },
  inspectorMeta: {
    id: {
      label: 'ID',
      inputType: 'text',
      group: 'Geral',
    },
    bg: {
      label: 'Background',
      inputType: 'color',
      group: 'Estilo',
    },
    padding: {
      label: 'Padding',
      inputType: 'text',
      group: 'Layout',
    },
  },
}

// ============================================================================
// NOVOS BLOCOS - LAYOUT AVANÇADO
// ============================================================================

const spacerBlock: BlockDefinition = {
  type: 'spacer',
  name: 'Spacer',
  description: 'Espaçador flexível',
  category: 'layout',
  canHaveChildren: false,
  defaultProps: {
    height: '2rem',
  },
  inspectorMeta: {
    height: {
      label: 'Altura',
      inputType: 'text',
      group: 'Layout',
    },
  },
}

// ============================================================================
// NOVOS BLOCOS - CONTEÚDO AVANÇADO
// ============================================================================

const badgeBlock: BlockDefinition = {
  type: 'badge',
  name: 'Badge',
  description: 'Tag/badge com variantes',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Badge',
    variant: 'default',
    size: 'md',
  },
  inspectorMeta: {
    text: {
      label: 'Texto',
      inputType: 'text',
      group: 'Conteúdo',
    },
    variant: {
      label: 'Variante',
      inputType: 'select',
      options: [
        { label: 'Padrão', value: 'default' },
        { label: 'Primário', value: 'primary' },
        { label: 'Secundário', value: 'secondary' },
        { label: 'Sucesso', value: 'success' },
        { label: 'Aviso', value: 'warning' },
        { label: 'Perigo', value: 'danger' },
        { label: 'Info', value: 'info' },
      ],
      group: 'Estilo',
    },
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
      ],
      group: 'Estilo',
    },
  },
}

const iconBlock: BlockDefinition = {
  type: 'icon',
  name: 'Icon',
  description: 'Ícone SVG',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    name: 'star',
    size: 'md',
  },
  inspectorMeta: {
    name: {
      label: 'Ícone',
      inputType: 'select',
      options: [
        { label: 'Estrela', value: 'star' },
        { label: 'Check', value: 'check' },
        { label: 'Seta Direita', value: 'arrow-right' },
        { label: 'Coração', value: 'heart' },
        { label: 'Usuário', value: 'user' },
        { label: 'Email', value: 'mail' },
        { label: 'Telefone', value: 'phone' },
        { label: 'Localização', value: 'map-pin' },
        { label: 'Configurações', value: 'settings' },
        { label: 'Pesquisar', value: 'search' },
        { label: 'Menu', value: 'menu' },
        { label: 'Fechar', value: 'x' },
        { label: 'Mais', value: 'plus' },
        { label: 'Menos', value: 'minus' },
        { label: 'Raio', value: 'zap' },
        { label: 'Escudo', value: 'shield' },
        { label: 'Foguete', value: 'rocket' },
        { label: 'Troféu', value: 'trophy' },
        { label: 'Gráfico', value: 'bar-chart' },
        { label: 'Globo', value: 'globe' },
      ],
      group: 'Conteúdo',
    },
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
      ],
      group: 'Estilo',
    },
    color: {
      label: 'Cor',
      inputType: 'color',
      group: 'Estilo',
    },
  },
}

const avatarBlock: BlockDefinition = {
  type: 'avatar',
  name: 'Avatar',
  description: 'Imagem circular com fallback',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    size: 'md',
  },
  inspectorMeta: {
    src: {
      label: 'URL da Imagem',
      inputType: 'image',
      group: 'Conteúdo',
    },
    name: {
      label: 'Nome (para iniciais)',
      inputType: 'text',
      group: 'Conteúdo',
    },
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
      ],
      group: 'Estilo',
    },
  },
}

const videoBlock: BlockDefinition = {
  type: 'video',
  name: 'Video',
  description: 'Embed de vídeo',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    src: '',
    controls: true,
    aspectRatio: '16:9',
  },
  inspectorMeta: {
    src: {
      label: 'URL do Vídeo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    poster: {
      label: 'Thumbnail',
      inputType: 'image',
      group: 'Conteúdo',
    },
    aspectRatio: {
      label: 'Proporção',
      inputType: 'select',
      options: [
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
        { label: '9:16', value: '9:16' },
      ],
      group: 'Layout',
    },
    autoplay: {
      label: 'Autoplay',
      inputType: 'checkbox',
      group: 'Opções',
    },
    controls: {
      label: 'Controles',
      inputType: 'checkbox',
      group: 'Opções',
    },
  },
}

const socialLinksBlock: BlockDefinition = {
  type: 'socialLinks',
  name: 'Social Links',
  description: 'Links para redes sociais',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    size: 'md',
    variant: 'default',
    links: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
  },
  inspectorMeta: {
    size: {
      label: 'Tamanho',
      inputType: 'select',
      options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
      ],
      group: 'Estilo',
    },
    variant: {
      label: 'Variante',
      inputType: 'select',
      options: [
        { label: 'Padrão', value: 'default' },
        { label: 'Preenchido', value: 'filled' },
      ],
      group: 'Estilo',
    },
  },
}

// ============================================================================
// NOVOS BLOCOS - SEÇÕES COMPOSTAS
// ============================================================================

const heroBlock: BlockDefinition = {
  type: 'hero',
  name: 'Hero',
  description: 'Seção hero completa',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    variant: 'centered',
    title: 'Bem-vindo ao Nosso Site',
    subtitle: 'Subtitulo incrível aqui',
    description: 'Uma descrição breve do seu produto ou serviço.',
    primaryButton: { text: 'Começar Agora' },
    secondaryButton: { text: 'Saber Mais' },
    align: 'center',
  },
  inspectorMeta: {
    variant: {
      label: 'Variante',
      inputType: 'select',
      options: [
        { label: 'Centralizado', value: 'centered' },
        { label: 'Dividido', value: 'split' },
        { label: 'Com Imagem de Fundo', value: 'image-bg' },
      ],
      group: 'Layout',
    },
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    description: {
      label: 'Descrição',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    badge: {
      label: 'Badge',
      inputType: 'text',
      group: 'Conteúdo',
    },
    image: {
      label: 'Imagem',
      inputType: 'image',
      group: 'Mídia',
    },
    align: {
      label: 'Alinhamento',
      inputType: 'select',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
      group: 'Estilo',
    },
  },
}

const featureBlock: BlockDefinition = {
  type: 'feature',
  name: 'Feature',
  description: 'Card de feature individual',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    icon: 'star',
    title: 'Feature',
    description: 'Descrição da feature',
  },
  inspectorMeta: {
    icon: {
      label: 'Ícone',
      inputType: 'select',
      options: [
        { label: 'Estrela', value: 'star' },
        { label: 'Check', value: 'check' },
        { label: 'Raio', value: 'zap' },
        { label: 'Escudo', value: 'shield' },
        { label: 'Foguete', value: 'rocket' },
        { label: 'Globo', value: 'globe' },
        { label: 'Gráfico', value: 'bar-chart' },
        { label: 'Usuários', value: 'users' },
      ],
      group: 'Conteúdo',
    },
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    description: {
      label: 'Descrição',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
  },
}

const featureGridBlock: BlockDefinition = {
  type: 'featureGrid',
  name: 'Feature Grid',
  description: 'Grid de features',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Nossas Features',
    subtitle: 'Tudo que você precisa',
    columns: 3,
    features: [
      { icon: 'zap', title: 'Rápido', description: 'Performance incrível' },
      { icon: 'shield', title: 'Seguro', description: 'Proteção total' },
      { icon: 'rocket', title: 'Escalável', description: 'Cresce com você' },
    ],
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    columns: {
      label: 'Colunas',
      inputType: 'select',
      options: [
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
      ],
      group: 'Layout',
    },
  },
}

const pricingCardBlock: BlockDefinition = {
  type: 'pricingCard',
  name: 'Pricing Card',
  description: 'Card de preço individual',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    name: 'Plano Pro',
    price: 'R$ 99',
    period: '/mês',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    buttonText: 'Começar',
  },
  inspectorMeta: {
    name: {
      label: 'Nome do Plano',
      inputType: 'text',
      group: 'Conteúdo',
    },
    price: {
      label: 'Preço',
      inputType: 'text',
      group: 'Conteúdo',
    },
    period: {
      label: 'Período',
      inputType: 'text',
      group: 'Conteúdo',
    },
    description: {
      label: 'Descrição',
      inputType: 'text',
      group: 'Conteúdo',
    },
    buttonText: {
      label: 'Texto do Botão',
      inputType: 'text',
      group: 'Conteúdo',
    },
    highlighted: {
      label: 'Destacado',
      inputType: 'checkbox',
      group: 'Estilo',
    },
    badge: {
      label: 'Badge',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const pricingBlock: BlockDefinition = {
  type: 'pricing',
  name: 'Pricing',
  description: 'Seção de preços completa',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Planos e Preços',
    subtitle: 'Escolha o plano ideal para você',
    plans: [
      { name: 'Básico', price: 'R$ 29', period: '/mês', features: ['1 Usuário', '10GB Storage', 'Suporte Email'], buttonText: 'Escolher' },
      { name: 'Pro', price: 'R$ 99', period: '/mês', features: ['5 Usuários', '100GB Storage', 'Suporte Prioritário', 'API Access'], buttonText: 'Escolher', highlighted: true, badge: 'Popular' },
      { name: 'Enterprise', price: 'R$ 299', period: '/mês', features: ['Usuários Ilimitados', 'Storage Ilimitado', 'Suporte 24/7', 'API Access', 'SSO'], buttonText: 'Contato' },
    ],
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const testimonialBlock: BlockDefinition = {
  type: 'testimonial',
  name: 'Testimonial',
  description: 'Card de depoimento individual',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    quote: 'Produto incrível! Recomendo a todos.',
    authorName: 'João Silva',
    authorRole: 'CEO',
    authorCompany: 'Empresa X',
    rating: 5,
  },
  inspectorMeta: {
    quote: {
      label: 'Depoimento',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    authorName: {
      label: 'Nome',
      inputType: 'text',
      group: 'Autor',
    },
    authorRole: {
      label: 'Cargo',
      inputType: 'text',
      group: 'Autor',
    },
    authorCompany: {
      label: 'Empresa',
      inputType: 'text',
      group: 'Autor',
    },
    authorAvatar: {
      label: 'Avatar',
      inputType: 'image',
      group: 'Autor',
    },
    rating: {
      label: 'Estrelas',
      inputType: 'number',
      min: 1,
      max: 5,
      group: 'Estilo',
    },
  },
}

const testimonialGridBlock: BlockDefinition = {
  type: 'testimonialGrid',
  name: 'Testimonial Grid',
  description: 'Grid de depoimentos',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'O Que Nossos Clientes Dizem',
    columns: 3,
    testimonials: [
      { quote: 'Excelente produto!', authorName: 'Maria', authorRole: 'Gerente', rating: 5 },
      { quote: 'Recomendo muito!', authorName: 'Pedro', authorRole: 'Diretor', rating: 5 },
      { quote: 'Transformou nosso negócio.', authorName: 'Ana', authorRole: 'CEO', rating: 5 },
    ],
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    columns: {
      label: 'Colunas',
      inputType: 'select',
      options: [
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
      ],
      group: 'Layout',
    },
  },
}

const faqItemBlock: BlockDefinition = {
  type: 'faqItem',
  name: 'FAQ Item',
  description: 'Item individual do FAQ',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    question: 'Pergunta frequente?',
    answer: 'Resposta detalhada aqui.',
  },
  inspectorMeta: {
    question: {
      label: 'Pergunta',
      inputType: 'text',
      group: 'Conteúdo',
    },
    answer: {
      label: 'Resposta',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    defaultOpen: {
      label: 'Aberto por Padrão',
      inputType: 'checkbox',
      group: 'Opções',
    },
  },
}

const faqBlock: BlockDefinition = {
  type: 'faq',
  name: 'FAQ',
  description: 'Seção FAQ completa',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Perguntas Frequentes',
    items: [
      { question: 'Como funciona?', answer: 'Explicamos tudo aqui.' },
      { question: 'Qual o preço?', answer: 'Confira nossa página de preços.' },
      { question: 'Posso cancelar?', answer: 'Sim, a qualquer momento.' },
    ],
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const ctaBlock: BlockDefinition = {
  type: 'cta',
  name: 'CTA',
  description: 'Seção Call-to-Action',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Pronto para começar?',
    description: 'Junte-se a milhares de usuários satisfeitos.',
    primaryButton: { text: 'Começar Agora' },
    variant: 'centered',
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    description: {
      label: 'Descrição',
      inputType: 'textarea',
      group: 'Conteúdo',
    },
    variant: {
      label: 'Variante',
      inputType: 'select',
      options: [
        { label: 'Padrão', value: 'default' },
        { label: 'Centralizado', value: 'centered' },
        { label: 'Dividido', value: 'split' },
        { label: 'Gradiente', value: 'gradient' },
      ],
      group: 'Estilo',
    },
    bg: {
      label: 'Background',
      inputType: 'color',
      group: 'Estilo',
    },
  },
}

const statsBlock: BlockDefinition = {
  type: 'stats',
  name: 'Stats',
  description: 'Seção de estatísticas',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Números que Impressionam',
    items: [
      { value: '10K+', label: 'Usuários' },
      { value: '99%', label: 'Satisfação' },
      { value: '24/7', label: 'Suporte' },
      { value: '50+', label: 'Países' },
    ],
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    subtitle: {
      label: 'Subtítulo',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const statItemBlock: BlockDefinition = {
  type: 'statItem',
  name: 'Stat Item',
  description: 'Item individual de estatística',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    value: '100',
    label: 'Clientes',
  },
  inspectorMeta: {
    value: {
      label: 'Valor',
      inputType: 'text',
      group: 'Conteúdo',
    },
    label: {
      label: 'Label',
      inputType: 'text',
      group: 'Conteúdo',
    },
    prefix: {
      label: 'Prefixo',
      inputType: 'text',
      group: 'Conteúdo',
    },
    suffix: {
      label: 'Sufixo',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const logoCloudBlock: BlockDefinition = {
  type: 'logoCloud',
  name: 'Logo Cloud',
  description: 'Grid de logos de clientes/parceiros',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    title: 'Empresas que confiam em nós',
    logos: [],
    grayscale: true,
  },
  inspectorMeta: {
    title: {
      label: 'Título',
      inputType: 'text',
      group: 'Conteúdo',
    },
    grayscale: {
      label: 'Escala de Cinza',
      inputType: 'checkbox',
      group: 'Estilo',
    },
  },
}

const navbarBlock: BlockDefinition = {
  type: 'navbar',
  name: 'Navbar',
  description: 'Barra de navegação',
  category: 'sections',
  canHaveChildren: false,
  defaultProps: {
    logoText: 'Logo',
    links: [
      { text: 'Início', href: '#' },
      { text: 'Sobre', href: '#about' },
      { text: 'Serviços', href: '#services' },
      { text: 'Contato', href: '#contact' },
    ],
    ctaButton: { text: 'Começar' },
    sticky: true,
  },
  inspectorMeta: {
    logo: {
      label: 'Logo (imagem)',
      inputType: 'image',
      group: 'Logo',
    },
    logoText: {
      label: 'Logo (texto)',
      inputType: 'text',
      group: 'Logo',
    },
    sticky: {
      label: 'Fixo no Topo',
      inputType: 'checkbox',
      group: 'Opções',
    },
    transparent: {
      label: 'Transparente',
      inputType: 'checkbox',
      group: 'Opções',
    },
  },
}

// ============================================================================
// NOVOS BLOCOS - FORMULÁRIOS
// ============================================================================

const formBlock: BlockDefinition = {
  type: 'form',
  name: 'Form',
  description: 'Container de formulário',
  category: 'forms',
  canHaveChildren: true,
  defaultProps: {
    submitText: 'Enviar',
  },
  inspectorMeta: {
    action: {
      label: 'Action URL',
      inputType: 'text',
      group: 'Config',
    },
    method: {
      label: 'Método',
      inputType: 'select',
      options: [
        { label: 'POST', value: 'post' },
        { label: 'GET', value: 'get' },
      ],
      group: 'Config',
    },
    submitText: {
      label: 'Texto do Botão',
      inputType: 'text',
      group: 'Conteúdo',
    },
  },
}

const inputBlock: BlockDefinition = {
  type: 'input',
  name: 'Input',
  description: 'Campo de entrada',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'campo',
    type: 'text',
    placeholder: 'Digite aqui...',
  },
  inspectorMeta: {
    name: {
      label: 'Nome',
      inputType: 'text',
      group: 'Config',
    },
    label: {
      label: 'Label',
      inputType: 'text',
      group: 'Conteúdo',
    },
    placeholder: {
      label: 'Placeholder',
      inputType: 'text',
      group: 'Conteúdo',
    },
    type: {
      label: 'Tipo',
      inputType: 'select',
      options: [
        { label: 'Texto', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Senha', value: 'password' },
        { label: 'Telefone', value: 'tel' },
        { label: 'URL', value: 'url' },
        { label: 'Número', value: 'number' },
      ],
      group: 'Config',
    },
    required: {
      label: 'Obrigatório',
      inputType: 'checkbox',
      group: 'Config',
    },
  },
}

const textareaBlockDef: BlockDefinition = {
  type: 'textarea',
  name: 'Textarea',
  description: 'Campo de texto longo',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'mensagem',
    placeholder: 'Digite sua mensagem...',
    rows: 4,
  },
  inspectorMeta: {
    name: {
      label: 'Nome',
      inputType: 'text',
      group: 'Config',
    },
    label: {
      label: 'Label',
      inputType: 'text',
      group: 'Conteúdo',
    },
    placeholder: {
      label: 'Placeholder',
      inputType: 'text',
      group: 'Conteúdo',
    },
    rows: {
      label: 'Linhas',
      inputType: 'number',
      min: 2,
      max: 20,
      group: 'Layout',
    },
    required: {
      label: 'Obrigatório',
      inputType: 'checkbox',
      group: 'Config',
    },
  },
}

const formSelectBlock: BlockDefinition = {
  type: 'formSelect',
  name: 'Select',
  description: 'Dropdown de formulário',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'opcao',
    placeholder: 'Selecione...',
    options: [
      { value: 'opt1', label: 'Opção 1' },
      { value: 'opt2', label: 'Opção 2' },
      { value: 'opt3', label: 'Opção 3' },
    ],
  },
  inspectorMeta: {
    name: {
      label: 'Nome',
      inputType: 'text',
      group: 'Config',
    },
    label: {
      label: 'Label',
      inputType: 'text',
      group: 'Conteúdo',
    },
    placeholder: {
      label: 'Placeholder',
      inputType: 'text',
      group: 'Conteúdo',
    },
    required: {
      label: 'Obrigatório',
      inputType: 'checkbox',
      group: 'Config',
    },
  },
}

/**
 * Registra todos os blocos
 */
export function registerAllBlocks(): void {
  // Layout
  componentRegistry.register(containerBlock)
  componentRegistry.register(stackBlock)
  componentRegistry.register(gridBlock)
  componentRegistry.register(boxBlock)
  componentRegistry.register(spacerBlock)
  
  // Conteúdo básico
  componentRegistry.register(headingBlock)
  componentRegistry.register(textBlock)
  componentRegistry.register(imageBlock)
  componentRegistry.register(buttonBlock)
  componentRegistry.register(linkBlock)
  componentRegistry.register(dividerBlock)
  
  // Conteúdo avançado
  componentRegistry.register(badgeBlock)
  componentRegistry.register(iconBlock)
  componentRegistry.register(avatarBlock)
  componentRegistry.register(videoBlock)
  componentRegistry.register(socialLinksBlock)
  
  // Composição básica
  componentRegistry.register(cardBlock)
  componentRegistry.register(sectionBlock)
  
  // Seções compostas
  componentRegistry.register(heroBlock)
  componentRegistry.register(featureBlock)
  componentRegistry.register(featureGridBlock)
  componentRegistry.register(pricingCardBlock)
  componentRegistry.register(pricingBlock)
  componentRegistry.register(testimonialBlock)
  componentRegistry.register(testimonialGridBlock)
  componentRegistry.register(faqItemBlock)
  componentRegistry.register(faqBlock)
  componentRegistry.register(ctaBlock)
  componentRegistry.register(statsBlock)
  componentRegistry.register(statItemBlock)
  componentRegistry.register(logoCloudBlock)
  componentRegistry.register(navbarBlock)
  
  // Formulários
  componentRegistry.register(formBlock)
  componentRegistry.register(inputBlock)
  componentRegistry.register(textareaBlockDef)
  componentRegistry.register(formSelectBlock)
}

// Auto-registrar ao importar
registerAllBlocks()
