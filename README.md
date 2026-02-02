# SmartGesti Site Editor

Editor de sites compartilhado para os projetos SmartGesti-Ensino e SmartGesti-Portifolios.

**Versão**: 0.1.2
**Publicado como**: `@brunoalz/smartgesti-site-editor`

## ✨ Funcionalidades

- 🎨 **Editor Visual Drag-and-Drop** - Interface intuitiva com blocos arrastáveis
- 📱 **Responsivo** - Preview em tempo real para desktop, tablet e mobile
- 🖼️ **Upload Seguro de Assets** - Sistema integrado com Supabase Storage
- 🔒 **Isolamento Multi-tenant** - Assets isolados por tenant/escola/site
- 🎭 **Variações de Blocos** - Hero, Navbar, Footer com múltiplos estilos
- 🧩 **Sistema de Blocos Extensível** - Adicione novos blocos facilmente
- 🎯 **Temas Customizáveis** - Tokens de design personalizáveis
- 💾 **Auto-limpeza de Assets** - Remove automaticamente imagens não utilizadas

---

## 📦 Instalação

### Via NPM (Recomendado)

```bash
npm install @brunoalz/smartgesti-site-editor
```

### Desenvolvimento Local

```bash
cd smartgesti-site-editor
npm install
npm run build
```

No projeto consumidor:
```bash
npm install file:../smartgesti-site-editor
```

---

## 🚀 Uso Básico

### Editor de Sites (V2)

```tsx
import {
  LandingPageEditorV2,
  SiteDocumentV2,
  createEmptySiteDocumentV2,
} from '@brunoalz/smartgesti-site-editor';
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css';

function CriarSite() {
  const [siteData, setSiteData] = useState<SiteDocumentV2>(
    createEmptySiteDocumentV2('Meu Site')
  );

  return (
    <LandingPageEditorV2
      initialData={siteData}
      onSave={async (data) => {
        // Salvar no backend
        await saveSite(data);
      }}
      onPublish={async (data) => {
        // Publicar site
        await publishSite(data);
      }}
      uploadConfig={{
        tenantId: 'tenant-uuid',
        schoolId: 'school-uuid',
        siteId: 'site-uuid',
        authToken: 'jwt-token',
      }}
    />
  );
}
```

### Visualizador de Sites

```tsx
import { LandingPageViewerV2 } from '@brunoalz/smartgesti-site-editor';

function VerSite({ siteData }) {
  return <LandingPageViewerV2 siteDocument={siteData} />;
}
```

---

## 🖼️ Sistema de Upload de Assets

### Configuração do Upload

O editor agora suporta upload seguro de imagens para o Supabase Storage:

```tsx
<LandingPageEditorV2
  uploadConfig={{
    tenantId: school?.tenant_id,   // UUID do tenant
    schoolId: school?.id,            // UUID da escola (opcional)
    siteId: currentSiteId,           // UUID do site (opcional)
    authToken: session?.access_token, // JWT token
  }}
/>
```

### Backend Necessário

O sistema requer um endpoint no backend:

```
POST /api/site-assets/upload?tenantId={id}&schoolId={id}&siteId={id}&assetType=image
Headers:
  Authorization: Bearer {jwt-token}
  Content-Type: multipart/form-data
Body:
  file: (binary)
```

**Resposta esperada:**
```json
{
  "success": true,
  "asset": {
    "id": "uuid",
    "storage_path": "tenant-xxx/school-yyy/site-zzz/filename.jpg",
    "filename": "filename.jpg",
    "mime_type": "image/jpeg",
    "size_bytes": 123456
  },
  "url": "https://...supabase.co/storage/v1/object/public/site-assets/..."
}
```

### Limpeza Automática

O sistema automaticamente:
- ✅ Detecta assets removidos ao salvar
- ✅ Deleta imagens antigas trocadas
- ✅ Libera espaço no storage
- ✅ Não bloqueia o fluxo de save

---

## 🧩 Adicionando Upload em Novos Blocos

Para adicionar upload de imagem em qualquer bloco, basta adicionar no `inspectorMeta`:

```typescript
// src/engine/registry/blocks/sections/meu-bloco.ts
export const meuBloco: BlockDefinition = {
  type: "meu-bloco",
  name: "Meu Bloco",
  // ...
  inspectorMeta: {
    minhaImagem: {
      label: "Imagem",
      inputType: "image-upload",  // 👈 É só isso!
      group: "Mídia",
    },
    // ... outros campos
  },
};
```

**Pronto!** O sistema automaticamente:
- ✅ Renderiza o input de upload
- ✅ Adiciona autenticação
- ✅ Faz upload para Supabase
- ✅ Retorna URL pública
- ✅ Gerencia cleanup

---

## 📁 Estrutura do Projeto

```
smartgesti-site-editor/
├── src/
│   ├── components/
│   │   ├── inputs/
│   │   │   ├── ImageInput.tsx        # Input de upload (com auth)
│   │   │   ├── ColorInput.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── editor/
│   │   ├── LandingPageEditorV2.tsx   # Editor principal
│   │   ├── BlockPalette.tsx          # Paleta de blocos
│   │   ├── BlockPropertyEditor.tsx   # Editor de propriedades
│   │   ├── PropertyEditor/
│   │   │   ├── renderPropertyInput.tsx  # Renderiza inputs por tipo
│   │   │   └── ...
│   │   └── components/
│   │       └── RightPanel.tsx        # Painel direito
│   ├── engine/
│   │   ├── registry/
│   │   │   ├── blocks/               # Definições de blocos
│   │   │   │   ├── sections/
│   │   │   │   │   ├── hero.ts       # Bloco Hero
│   │   │   │   │   ├── navbar.ts     # Bloco Navbar
│   │   │   │   │   ├── footer.ts     # Bloco Footer
│   │   │   │   │   └── ...
│   │   │   │   └── index.ts
│   │   │   ├── types.ts              # Tipos do registry
│   │   │   └── registry.ts
│   │   ├── presets/
│   │   │   ├── heroVariations.ts     # Variações do Hero
│   │   │   └── navbarVariations.ts   # Variações do Navbar
│   │   ├── render/                   # Sistema de renderização
│   │   ├── preview/                  # Preview do site
│   │   ├── export/                   # Exportar HTML
│   │   └── schema/                   # Schema dos documentos
│   ├── viewer/
│   │   └── LandingPageViewerV2.tsx   # Visualizador público
│   ├── shared/
│   │   ├── templates/                # Templates prontos
│   │   └── schema.ts
│   ├── styles/
│   │   └── landing-page.css          # Estilos globais
│   └── index.ts                      # Entry point
├── package.json
├── vite.config.ts
├── README.md
├── USAGE.md                          # Guia detalhado de uso
├── CHANGELOG.md                      # Histórico de versões
└── docs/
    └── ASSETS.md                     # Documentação do sistema de assets
```

---

## 🎨 Blocos Disponíveis

### Seções
- **Hero** - Banner principal com imagem, título, descrição e botões
- **Navbar** - Barra de navegação com logo, links e CTA
- **Footer** - Rodapé com logo, links e copyright
- **Features** - Grade de recursos/funcionalidades
- **Testimonials** - Depoimentos de clientes
- **Pricing** - Tabelas de preços
- **FAQ** - Perguntas frequentes
- **CTA** - Call-to-action
- **Stats** - Estatísticas e números
- **Team** - Grade de membros da equipe
- **Blog** - Grade de posts de blog
- **Countdown** - Contador regressivo

### Elementos
- **Text** - Parágrafo de texto
- **Heading** - Título (H1-H6)
- **Button** - Botão com link
- **Image** - Imagem
- **Video** - Player de vídeo
- **Spacer** - Espaçador vertical
- **Divider** - Divisor horizontal

---

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Build para produção
npm run build

# Desenvolvimento com watch
npm run dev

# Linting
npm run lint

# Type checking
npm run type-check
```

### Ambiente de Desenvolvimento

O editor usa modo local para desenvolvimento:

```bash
# No Frontend-SmartGesti-Ensino
USE_LOCAL_EDITOR=true npm run setup:editor
npm install
npm run dev
```

### Build e Publicação

```bash
# Build
npm run build

# Publicar no NPM
npm publish --access public
```

---

## 🎯 Variações de Blocos

### Regra Importante

Ao criar variações, **NÃO inclua campos editáveis pelo usuário** (como `image`, `logo`) nos `defaultProps`:

❌ **Errado** (sobrescreve ao trocar variação):
```typescript
defaultProps: {
  image: "placeholder.jpg",  // Vai sobrescrever a imagem do usuário!
  title: "Título padrão"
}
```

✅ **Correto** (preserva personalização do usuário):
```typescript
defaultProps: {
  // image NÃO está aqui
  title: "Título padrão",
  variant: "split",
  align: "left"
}
```

---

## 📚 Documentação Adicional

- **[USAGE.md](./USAGE.md)** - Guia completo de uso e exemplos
- **[docs/ASSETS.md](./docs/ASSETS.md)** - Sistema de assets e storage
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de versões

---

## 🔗 Integração

Este editor foi projetado para ser usado em múltiplos projetos:

- **SmartGesti-Ensino**: Sistema de gestão escolar
- **SmartGesti-Portfólios**: Sistema de portfólios

Cada projeto mantém seus próprios sites, mas compartilha o mesmo código do editor.

---

## 🏗️ Arquitetura

### Multi-tenant com Isolamento

- **Tenant**: Instituição (ex: Rede de escolas)
- **School**: Escola dentro do tenant
- **Site**: Site específico da escola

**Isolamento de Assets:**
```
tenant-{uuid}/
  └── school-{uuid}/
      └── site-{uuid}/
          └── filename.jpg
```

### Fluxo de Upload

```
[ImageInput]
  → POST /api/site-assets/upload
    → [JwtAuthGuard] valida token
      → [TenantAccessGuard] valida tenant
        → [SiteAssetsService] valida arquivo
          → [Supabase Storage] upload
            → [site_assets table] metadata
              → retorna URL pública
```

---

## 🔐 Segurança

- ✅ **JWT Authentication** - Todos os uploads requerem token válido
- ✅ **Tenant Validation** - Guards validam ownership do tenant
- ✅ **RLS Policies** - Row Level Security no Supabase
- ✅ **Path Isolation** - Estrutura de pastas impede cross-tenant access
- ✅ **File Validation** - Validação de tipo MIME e tamanho (max 10MB)
- ✅ **Checksum SHA256** - Integridade dos arquivos

---

## 📝 Licença

Uso interno - SmartGesti

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Execute `npm run build` e teste localmente
4. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe SmartGesti.
