# SmartGesti Site Editor

Editor de sites compartilhado para os projetos SmartGesti-Ensino e SmartGesti-Portifolios.

## 📦 Instalação

### 1. Instalar dependências do editor

```bash
cd smartgesti-site-editor
npm install
```

### 2. Build do editor

```bash
npm run build
```

### 3. Instalar no projeto consumidor

No `package.json` do projeto (Ensino ou Portifolios):

```json
{
  "dependencies": {
    "@smartgesti/site-editor": "file:../smartgesti-site-editor"
  }
}
```

Depois execute:
```bash
npm install
```

### 4. Configurar Vite (se necessário)

No `vite.config.ts`:

```typescript
resolve: {
  alias: {
    '@smartgesti/site-editor': path.resolve(__dirname, '../../smartgesti-site-editor/src'),
  },
}
```

## 🚀 Uso

### Criar/Editar Site

```tsx
import { SiteEditor } from '@smartgesti/site-editor'

function CriarSite() {
  return (
    <SiteEditor
      projectId="ensino"
      apiBaseUrl="/api"
      onSave={async (site) => {
        // Salvar via API
      }}
      onPublish={async (site) => {
        // Publicar site
      }}
      previewUrl={(siteId) => `/escola/${slug}/site?id=${siteId}`}
    />
  )
}
```

### Visualizar Site Publicado

```tsx
import { SiteViewer } from '@smartgesti/site-editor'

function VerSite() {
  return (
    <SiteViewer
      siteId="site-id"
      apiBaseUrl="/api"
      projectId="ensino"
    />
  )
}
```

## 📁 Estrutura

```
smartgesti-site-editor/
├── src/
│   ├── components/
│   │   ├── SiteEditor/       # Editor principal
│   │   ├── ComponentPalette/ # Paleta de componentes
│   │   ├── PropertyPanel/    # Painel de propriedades
│   │   ├── PreviewPanel/     # Preview em tempo real
│   │   ├── Toolbar/          # Barra de ferramentas
│   │   ├── TemplateSelector/ # Seletor de templates
│   │   └── SiteViewer/       # Visualizador público
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilitários
│   └── index.ts              # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Componentes Disponíveis

- **Hero**: Seção hero com título, subtítulo e botão
- **Text**: Parágrafo de texto
- **Heading**: Título (H1-H6)
- **Button**: Botão com link
- **Image**: Imagem
- **Spacer**: Espaçador vertical
- **Divider**: Divisor horizontal
- **Grid**: Layout em grid
- **Card**: Card com conteúdo

## 🔧 Desenvolvimento

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

## 📚 Documentação

- [USAGE.md](./USAGE.md) - Guia de uso detalhado
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Detalhes da implementação
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de mudanças

## 🔗 Integração

Este editor foi projetado para ser usado em múltiplos projetos:

- **SmartGesti-Ensino**: `projectId: "ensino"`
- **SmartGesti-Portifolios**: `projectId: "portifolio"`

Cada projeto mantém seus próprios sites, mas compartilha o mesmo código do editor.

## 📝 Licença

Uso interno - SmartGesti
