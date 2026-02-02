# Sistema de Assets - SmartGesti Site Editor

Documentação completa do sistema de upload e gerenciamento de assets (imagens e vídeos) com isolamento multi-tenant.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Integration](#frontend-integration)
5. [Security](#security)
6. [Asset Cleanup](#asset-cleanup)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

### O Problema

Antes do sistema de assets:
- ❌ Upload público sem autenticação
- ❌ Armazenamento local em `/public/uploads/`
- ❌ Sem isolamento por tenant/escola
- ❌ URLs sem contexto
- ❌ Risco de vazamento de dados

### A Solução

Sistema completo de assets:
- ✅ Bucket `site-assets` no Supabase Storage
- ✅ Autenticação JWT obrigatória
- ✅ Isolamento completo por tenant/escola/site
- ✅ RLS policies para segurança
- ✅ Tabela de metadata para tracking
- ✅ Limpeza automática de assets não utilizados

---

## Arquitetura

### Estrutura de Armazenamento

```
site-assets/
├── tenant-{uuid}/
│   ├── school-{uuid}/
│   │   ├── site-{uuid}/
│   │   │   ├── 1738485129184-123456789.jpg
│   │   │   └── 1738485234567-987654321.png
│   │   └── site-{uuid2}/
│   │       └── ...
│   └── school-{uuid2}/
│       └── ...
└── tenant-{uuid2}/
    └── ...
```

### Database Schema

#### Tabela: `site_assets`

```sql
CREATE TABLE public.site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,

  storage_bucket TEXT NOT NULL DEFAULT 'site-assets',
  storage_path TEXT NOT NULL,

  filename TEXT NOT NULL,
  original_filename TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER,
  checksum_sha256 TEXT,

  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'icon', 'logo')),
  used_in_blocks JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id),

  CONSTRAINT unique_storage_path UNIQUE (storage_bucket, storage_path)
);
```

#### Bucket: `site-assets`

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true, -- Leitura pública para sites publicados
  10485760, -- 10MB
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
);
```

### RLS Policies

**Upload (INSERT)**:
```sql
CREATE POLICY "Usuários podem fazer upload para seu tenant"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-assets'
  AND (storage.foldername(name))[1] = CONCAT('tenant-', (
    SELECT tenant_id FROM users WHERE auth0_id = auth.uid()::text
  ))
);
```

**Leitura (SELECT)**:
```sql
CREATE POLICY "Leitura pública de assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'site-assets');
```

---

## Backend Implementation

### Estrutura de Arquivos

```
Backend-SmartGesti-Ensino/
└── src/
    ├── site-assets/
    │   ├── dto/
    │   │   └── upload-asset.dto.ts
    │   ├── site-assets.controller.ts
    │   ├── site-assets.service.ts
    │   └── site-assets.module.ts
    └── app.module.ts
```

### Endpoints

#### 1. Upload Asset

```http
POST /api/site-assets/upload
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

Query Parameters:
  - tenantId: string (required)
  - schoolId: string (optional)
  - siteId: string (optional)
  - assetType: 'image' | 'video' | 'icon' | 'logo' (required)

Body:
  - file: binary (max 10MB)
```

**Response:**
```json
{
  "success": true,
  "asset": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tenant_id": "...",
    "school_id": "...",
    "site_id": "...",
    "storage_bucket": "site-assets",
    "storage_path": "tenant-xxx/school-yyy/site-zzz/1738485129184-123456789.jpg",
    "filename": "1738485129184-123456789.jpg",
    "original_filename": "logo.jpg",
    "mime_type": "image/jpeg",
    "size_bytes": 45678,
    "checksum_sha256": "abc123...",
    "asset_type": "image",
    "created_at": "2026-02-02T10:30:00Z"
  },
  "url": "https://project.supabase.co/storage/v1/object/public/site-assets/tenant-xxx/school-yyy/site-zzz/1738485129184-123456789.jpg"
}
```

#### 2. List Assets

```http
GET /api/site-assets
Authorization: Bearer {jwt-token}

Query Parameters:
  - tenantId: string (required)
  - schoolId: string (optional)
  - siteId: string (optional)
  - assetType: string (optional)
```

#### 3. Delete Asset by ID

```http
DELETE /api/site-assets/{id}
Authorization: Bearer {jwt-token}

Query Parameters:
  - tenantId: string (required)
```

#### 4. Delete Asset by URL (Cleanup)

```http
DELETE /api/site-assets/by-url/cleanup
Authorization: Bearer {jwt-token}

Query Parameters:
  - url: string (required) - URL completa do asset
  - tenantId: string (required)
```

### Service Implementation

```typescript
// site-assets.service.ts

async uploadAsset(dto: UploadAssetDto): Promise<{ asset: SiteAsset; publicUrl: string }> {
  // 1. Validar arquivo
  this.validateFile(file, asset_type);

  // 2. Gerar path com isolamento
  const storagePath = this.generateStoragePath(tenant_id, school_id, site_id, file.originalname);
  // Exemplo: tenant-xxx/school-yyy/site-zzz/1738485129184-123456789.jpg

  // 3. Calcular checksum
  const checksum = createHash('sha256').update(file.buffer).digest('hex');

  // 4. Upload para Supabase Storage
  const { data, error } = await this.supabase
    .storage
    .from('site-assets')
    .upload(storagePath, file.buffer, { contentType: file.mimetype });

  // 5. Obter URL pública
  const { data: urlData } = this.supabase
    .storage
    .from('site-assets')
    .getPublicUrl(storagePath);

  // 6. Criar metadata no banco
  const { data: assetData } = await this.supabase
    .from('site_assets')
    .insert({ tenant_id, storage_path: storagePath, ... })
    .select()
    .single();

  return { asset: assetData, publicUrl: urlData.publicUrl };
}
```

---

## Frontend Integration

### Configuração do Editor

```tsx
import {
  LandingPageEditorV2,
  SiteDocumentV2,
} from '@brunoalz/smartgesti-site-editor';
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css';

function CriarSite() {
  const { school } = useSchool();
  const { session } = useAuth();
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);

  return (
    <LandingPageEditorV2
      initialData={siteData}
      onSave={handleSave}
      onPublish={handlePublish}
      uploadConfig={{
        tenantId: school?.tenant_id,
        schoolId: school?.id,
        siteId: currentSiteId,
        authToken: session?.access_token,
      }}
    />
  );
}
```

### Propagação do uploadConfig

O `uploadConfig` é automaticamente propagado através da hierarquia de componentes:

```
LandingPageEditorV2 (recebe uploadConfig)
  └── RightPanel (passa adiante)
      └── BlockPropertyEditor (passa adiante)
          └── PropertyGroup (passa adiante)
              └── renderPropertyInput (usa uploadConfig)
                  └── ImageInput (recebe e usa)
```

### Adicionando Upload em Novos Blocos

Para adicionar upload em qualquer bloco:

```typescript
// src/engine/registry/blocks/sections/meu-bloco.ts

export const meuBloco: BlockDefinition = {
  type: "meu-bloco",
  name: "Meu Bloco",
  defaultProps: {
    titulo: "Título",
    // NÃO incluir: imagem: "..."
  },
  inspectorMeta: {
    imagem: {
      label: "Imagem",
      inputType: "image-upload",  // 👈 Ativa o sistema de upload
      group: "Mídia",
    },
    titulo: {
      label: "Título",
      inputType: "text",
      group: "Conteúdo",
    },
  },
};
```

**Tipos de Input Disponíveis:**
- `"image"` - Input simples de URL (sem upload)
- `"image-upload"` - Input com botão de upload autenticado ✅

---

## Security

### Camadas de Segurança

1. **JWT Authentication**
   - Token obrigatório em todos os endpoints
   - Validado pelo `JwtAuthGuard`

2. **Tenant Access Guard**
   - Verifica se `user.tenant_id === tenantId` do request
   - Impede acesso cross-tenant

3. **RLS Policies**
   - Supabase valida ownership na camada de banco
   - Usuário só pode fazer upload em `tenant-{seu_tenant_id}/`

4. **Path Structure**
   - Estrutura de pastas garante isolamento físico
   - Mesmo com URL pública, não há como adivinhar paths de outros tenants

5. **File Validation**
   - Tipo MIME validado (apenas imagens/vídeos permitidos)
   - Tamanho máximo: 10MB
   - Checksum SHA256 para integridade

### Fluxo de Validação

```
[Frontend]
  ↓ (envia JWT + tenantId)
[JwtAuthGuard]
  ↓ (valida token e extrai user)
[TenantAccessGuard]
  ↓ (verifica user.tenant_id === tenantId)
[Controller]
  ↓ (valida params)
[Service]
  ↓ (valida arquivo)
[Supabase Storage + RLS]
  ↓ (valida path ownership)
[Success] ✅
```

---

## Asset Cleanup

### Sistema de Limpeza Automática

Quando o usuário salva um site, o sistema automaticamente:

1. **Detecta assets removidos**
   - Compara documento antigo vs novo
   - Identifica URLs que não existem mais

2. **Deleta em background**
   - Não bloqueia o save
   - Faz requisições DELETE assíncronas

3. **Remove do storage**
   - Soft delete na tabela `site_assets`
   - Hard delete no Supabase Storage

### Implementação

```typescript
// CriarSite.tsx

function extractAssetUrls(doc: SiteDocumentV2 | null): Set<string> {
  // Varre recursivamente o documento
  // Retorna Set com todas URLs de assets
}

const handleSave = async (data: SiteDocumentV2) => {
  // 1. Identificar assets removidos
  const oldUrls = extractAssetUrls(initialData);
  const newUrls = extractAssetUrls(data);
  const removed = Array.from(oldUrls).filter(url => !newUrls.has(url));

  // 2. Salvar site
  await saveSite(data);

  // 3. Cleanup em background
  Promise.all(
    removed.map(url => deleteAsset(url, tenantId, token))
  );

  // 4. Atualizar estado
  setInitialData(data);
};
```

### Endpoint de Cleanup

```http
DELETE /api/site-assets/by-url/cleanup?url={url}&tenantId={id}
Authorization: Bearer {jwt-token}
```

**Lógica do Service:**
```typescript
async deleteAssetByUrl(url: string, tenantId: string) {
  // 1. Extrair storage_path da URL
  const match = url.match(/\/site-assets\/(.+)$/);
  const storagePath = match[1];

  // 2. Buscar asset no banco
  const { data: asset } = await this.supabase
    .from('site_assets')
    .select('*')
    .eq('storage_path', storagePath)
    .eq('tenant_id', tenantId)
    .single();

  // 3. Soft delete metadata
  await this.supabase
    .from('site_assets')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', asset.id);

  // 4. Hard delete storage
  await this.supabase
    .storage
    .from('site-assets')
    .remove([storagePath]);
}
```

---

## Troubleshooting

### Assets não aparecem após upload

**Causa**: uploadConfig não está sendo passado corretamente

**Solução**:
1. Verificar se `LandingPageEditorV2` recebe `uploadConfig`
2. Verificar console do navegador para erros
3. Verificar se tenantId, authToken estão definidos

### Erro 401 Unauthorized

**Causa**: Token JWT inválido ou expirado

**Solução**:
- Verificar se `session?.access_token` está correto
- Renovar token se expirado
- Verificar configuração do JwtAuthGuard no backend

### Erro 403 Forbidden

**Causa**: TenantAccessGuard bloqueou o acesso

**Solução**:
- Verificar se `tenantId` passado corresponde ao `user.tenant_id` do token
- Verificar logs do backend para detalhes

### Assets não são deletados

**Causa**: Cleanup em background falhou silenciosamente

**Solução**:
- Verificar console do navegador para logs `[Asset Cleanup]`
- Verificar se endpoint `DELETE /api/site-assets/by-url/cleanup` existe
- Verificar RLS policies no Supabase

### Imagem perdida ao trocar variação

**Causa**: Variação tem `image` nos `defaultProps`

**Solução**:
- Remover campo `image` dos `defaultProps` da variação
- Exemplo: `heroVariations.ts` linhas 51, 67, 84
- Ver seção "Variações de Blocos" no README.md

---

## Melhorias Futuras

### Opcionais

1. **Galeria de Assets**
   - UI para visualizar todos os assets
   - Reusar assets já enviados
   - Marcar assets órfãos

2. **Compressão Automática**
   - Redimensionar imagens grandes
   - Gerar múltiplos tamanhos (thumbnails)
   - Converter para WebP

3. **Garbage Collector Agendado**
   - Job noturno para verificar assets órfãos
   - Deletar assets não referenciados há X dias
   - Relatório de uso de storage

4. **Reference Counting**
   - Atualizar `used_in_blocks` automaticamente
   - Dashboard de uso por site
   - Alertas de storage cheio

5. **CDN Integration**
   - Cache de assets em CDN
   - Serve otimizado por região
   - Faster load times

---

## Changelog

### v0.1.2 (2026-02-02)
- ✅ Sistema completo de assets implementado
- ✅ Backend com Supabase Storage
- ✅ RLS policies e isolamento por tenant
- ✅ Frontend com uploadConfig
- ✅ Limpeza automática de assets

### v0.1.1
- Sistema de blocos e editor base

### v0.1.0
- Versão inicial

---

## Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [React Hook Form](https://react-hook-form.com/)

---

**Documentação mantida por**: Equipe SmartGesti
**Última atualização**: 2026-02-02
