# Guia de Uso - SmartGesti Site Editor

## Instalação

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

## Uso Básico

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

## API Backend

O backend precisa implementar os seguintes endpoints:

### GET /api/sites
Lista todos os sites do projeto

**Query params:**
- `projectId` (required): 'ensino' ou 'portifolio'
- `schoolId` (optional): ID da escola

### GET /api/sites/:id
Obtém um site específico

**Query params:**
- `projectId` (required)

### POST /api/sites
Cria um novo site

**Body:**
```json
{
  "projectId": "ensino",
  "name": "Nome do Site",
  "slug": "nome-do-site",
  "schoolId": "uuid",
  "pages": [...]
}
```

### PUT /api/sites/:id
Atualiza um site

**Query params:**
- `projectId` (required)

**Body:**
```json
{
  "name": "Nome Atualizado",
  "pages": [...]
}
```

### DELETE /api/sites/:id
Deleta um site

**Query params:**
- `projectId` (required)

### POST /api/sites/:id/publish
Publica um site (gera HTML estático)

**Query params:**
- `projectId` (required)

## Estrutura de Dados

### Site
```typescript
interface Site {
  id: string
  projectId: 'ensino' | 'portifolio'
  name: string
  slug: string
  schoolId?: string
  pages: Page[]
  published: boolean
  publishedHtml?: string
  createdAt: Date
  updatedAt: Date
}
```

### Page
```typescript
interface Page {
  id: string
  name: string
  slug: string
  components: Component[]
  metadata: {
    title?: string
    description?: string
    ogImage?: string
  }
}
```

### Component
```typescript
interface Component {
  id: string
  type: 'hero' | 'text' | 'heading' | 'button' | ...
  props: Record<string, any>
  styles: Record<string, any>
  children?: Component[]
}
```

## Componentes Disponíveis

- **Hero**: Seção hero com título, subtítulo e botão
- **Text**: Parágrafo de texto
- **Heading**: Título (H1-H6)
- **Button**: Botão com link
- **Image**: Imagem
- **Spacer**: Espaçador vertical
- **Divider**: Divisor horizontal
- **Grid**: Layout em grid
- **Card**: Card com conteúdo

## Customização

O editor usa Tailwind CSS e segue o design system do projeto consumidor. As classes CSS são compartilhadas através do Tailwind.

Para adicionar novos componentes, edite:
- `src/components/ComponentPalette/index.tsx` - Adicionar definição
- `src/components/PreviewPanel/index.tsx` - Adicionar renderização
