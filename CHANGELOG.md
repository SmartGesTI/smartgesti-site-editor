# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.1.2] - 2026-02-02

### ✨ Adicionado

#### Sistema de Assets Completo
- **Upload Seguro de Imagens** - Sistema integrado com Supabase Storage
  - Autenticação JWT obrigatória
  - Isolamento multi-tenant (tenant/school/site)
  - Suporte a imagens (JPG, PNG, WebP, GIF, SVG) e vídeos (MP4, WebM, MOV)
  - Limite de 10MB por arquivo
  - Validação de tipo MIME e tamanho

- **Backend API**
  - `POST /api/site-assets/upload` - Upload com autenticação
  - `GET /api/site-assets` - Listar assets com filtros
  - `DELETE /api/site-assets/:id` - Deletar por ID
  - `DELETE /api/site-assets/by-url/cleanup` - Deletar por URL (cleanup automático)
  - Guards: JwtAuthGuard + TenantAccessGuard
  - Service com validação e rollback

- **Database**
  - Bucket `site-assets` no Supabase Storage com RLS policies
  - Tabela `site_assets` para metadata tracking
  - Políticas RLS em português para tenant isolation
  - Soft delete pattern com audit trail
  - Checksum SHA256 para integridade

- **Frontend**
  - Input `image-upload` com botão de upload autenticado
  - Propagação automática de `uploadConfig` por toda hierarquia
  - Sistema de limpeza automática de assets não utilizados
  - Detecção de assets removidos ao salvar
  - Logs de debug para troubleshooting

- **Blocos com Upload**
  - Navbar: Campo `logo` (imagem)
  - Footer: Campo `logo` (imagem)
  - Hero: Campo `image` (imagem de fundo)
  - Extensível para qualquer bloco com `inputType: "image-upload"`

### 🔧 Corrigido

- **Variações de Blocos** - Imagens agora persistem ao trocar variação
  - Removido campo `image` dos `defaultProps` de todas variações do Hero
  - Hero Dividido, Parallax e Overlay não sobrescrevem mais a imagem do usuário
  - Comportamento consistente com Navbar (logo persiste)

- **TypeScript Errors**
  - Corrigido tipo `Express.Multer.File` para `any` no backend
  - Resolvido erro de compilação em site-assets.service.ts
  - Build do backend agora compila sem erros

- **Foreign Key Constraint**
  - Removido `created_by` do insert (conflito auth0_id vs user.id)
  - Assets agora são criados sem restrição de foreign key
  - Soft delete funciona corretamente

### 📚 Documentação

- **README.md** - Atualizado com:
  - Seção completa sobre Sistema de Upload de Assets
  - Instruções de configuração do uploadConfig
  - Exemplos de código atualizados
  - Seção de Segurança expandida
  - Regras importantes sobre Variações de Blocos

- **docs/ASSETS.md** - Novo arquivo com documentação detalhada:
  - Arquitetura do sistema de assets
  - Database schema e RLS policies
  - Backend implementation completa
  - Frontend integration guide
  - Security layers explicadas
  - Asset cleanup system
  - Troubleshooting guide

### 🏗️ Arquitetura

- **Isolamento por Tenant**
  ```
  tenant-{uuid}/
    └── school-{uuid}/
        └── site-{uuid}/
            └── filename.jpg
  ```

- **Fluxo de Upload**
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

- **Limpeza Automática**
  - Compara documento antigo vs novo ao salvar
  - Identifica assets removidos
  - Deleta em background (não bloqueante)
  - Libera espaço no storage automaticamente

### 🔐 Segurança

- **5 Camadas de Proteção**
  1. JWT Authentication (token obrigatório)
  2. Tenant Access Guard (valida ownership)
  3. RLS Policies (Supabase)
  4. Path Structure (isolamento físico)
  5. File Validation (tipo e tamanho)

---

## [0.1.1] - 2026-01-XX

### Adicionado
- Sistema de blocos e componentes
- Editor visual drag-and-drop
- Preview responsivo (desktop, tablet, mobile)
- Variações de blocos (Hero, Navbar)
- Temas customizáveis

### Corrigido
- Melhorias de performance no editor
- Bugs de renderização

---

## [0.1.0] - 2026-01-XX

### Adicionado
- Versão inicial do SmartGesti Site Editor
- Editor de sites compartilhado
- Suporte para múltiplos projetos (Ensino, Portfólios)
- Blocos básicos: Hero, Text, Button, Image
- Sistema de templates
- Exportação para HTML

---

## Tipos de Mudanças

- `Adicionado` - para novas funcionalidades
- `Corrigido` - para correções de bugs
- `Alterado` - para mudanças em funcionalidades existentes
- `Depreciado` - para funcionalidades que serão removidas
- `Removido` - para funcionalidades removidas
- `Segurança` - para correções de vulnerabilidades

---

**Links de Versões:**
- [0.1.2]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.2
- [0.1.1]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.1
- [0.1.0]: https://github.com/smartgesti/site-editor/releases/tag/v0.1.0
