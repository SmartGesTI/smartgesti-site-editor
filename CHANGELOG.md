# Changelog

## [0.1.0] - 2025-01-XX

### Adicionado
- Estrutura base do editor de sites compartilhado
- Componente `SiteEditor` principal
- Sistema de drag & drop com @dnd-kit
- Paleta de componentes (Hero, Text, Heading, Button, Spacer, etc.)
- Painel de propriedades para edição de componentes
- Preview em tempo real
- Sistema de templates pré-definidos
- Componente `SiteViewer` para visualização pública
- Exportação de sites para HTML estático
- Tipos TypeScript compartilhados
- Suporte a múltiplos projetos (ensino, portifolio)

### Estrutura
- `/src/components` - Componentes do editor
- `/src/hooks` - Hooks customizados
- `/src/types` - TypeScript types
- `/src/utils` - Utilitários (cn, htmlExporter)

### Dependências
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities - Drag & drop
- react, react-dom - Framework
- clsx, tailwind-merge - Utilitários CSS
