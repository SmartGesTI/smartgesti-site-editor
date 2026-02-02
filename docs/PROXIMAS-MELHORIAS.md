# Próximas Melhorias - SmartGestI Site Editor

Análise completa de melhorias potenciais para continuar evoluindo o editor após a refatoração arquitetural.

**Data**: 2026-02-02
**Status Atual**: ✅ Arquitetura refatorada, bugs críticos resolvidos

---

## 🎯 Prioridade ALTA (Quick Wins)

### 1. Limpar Warnings do TypeScript ⚡
**Esforço**: 30 min | **Impacto**: Alto (qualidade do código)

**Problema**: 50+ warnings de imports não utilizados no build

```typescript
// Exemplos:
// src/editor/PropertyEditor/PropertyGroup.tsx:1
import React from "react";  // ❌ Não utilizado com JSX transform

// src/engine/export/exporters/content/AvatarExporter.ts:11
function exportAvatar(block, depth, basePath, theme) {  // ❌ Parâmetros não usados
```

**Solução**:
```bash
# Opção 1: Remover imports desnecessários
# Com novo JSX transform do React 17+, não precisa importar React

# Opção 2: Prefixar parâmetros não usados com underscore
function exportAvatar(block: Block, _depth: number, _basePath?: string, _theme?: ThemeTokens) {
  // Mantém assinatura consistente mas indica que não são usados
}
```

**Comando para aplicar automaticamente**:
```bash
# Remover imports não usados
npx eslint --fix src/
```

---

### 2. Implementar Lazy Loading de Componentes 🚀
**Esforço**: 1-2h | **Impacto**: Alto (performance inicial)

**Problema**: Bundle de 4.2MB carregado todo de uma vez

**Solução**: Code splitting com React.lazy

```typescript
// src/editor/LandingPageEditorV2.tsx
import { lazy, Suspense } from "react";

// Lazy load painéis pesados
const BlockPropertyEditor = lazy(() => import("./PropertyEditor"));
const PreviewV2 = lazy(() => import("../engine/preview/PreviewV2"));

function LandingPageEditorV2() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlockPropertyEditor {...props} />
      <PreviewV2 {...props} />
    </Suspense>
  );
}
```

**Ganho esperado**: 30-40% redução no initial bundle

---

### 3. Adicionar Testes para Componentes Críticos 🧪
**Esforço**: 2-3h | **Impacto**: Médio-Alto (confiabilidade)

**Prioridade**: Testar funcionalidades críticas primeiro

```typescript
// tests/engine/patch/history.test.ts
describe("HistoryManager", () => {
  test("undo preserves removed values", () => {
    const doc = { pages: [{ id: "1", name: "Home" }] };
    const history = createHistoryManager();

    const removePatch = [{ op: "remove", path: "/pages/0" }];
    history.push(doc, removePatch);

    const newDoc = applyPatch(doc, removePatch).document;
    const undoResult = history.undo(newDoc);

    expect(undoResult.document.pages).toHaveLength(1);
    expect(undoResult.document.pages[0]).toEqual({ id: "1", name: "Home" });
  });
});
```

**Componentes a testar**:
1. HistoryManager (undo/redo) ✅ Crítico
2. PatchBuilder (criação de patches)
3. Renderizadores modulares (alguns samples)
4. useNavbarAutoSync (sincronização)

---

### 4. Memoização de Componentes Pesados 💾
**Esforço**: 1h | **Impacto**: Médio (performance de re-render)

**Problema**: Componentes re-renderizam desnecessariamente

```typescript
// src/editor/PropertyEditor/BlockPropertyEditor.tsx
import { memo, useMemo, useCallback } from "react";

// Memoizar componentes que não mudam frequentemente
export const PropertyGroup = memo(({ title, children }) => {
  return <div>{title}{children}</div>;
});

// Memoizar computações pesadas
const BlockPropertyEditor = ({ block, onUpdate }) => {
  const sortedProperties = useMemo(() => {
    return Object.entries(block.props).sort(([a], [b]) => a.localeCompare(b));
  }, [block.props]);

  const handleUpdate = useCallback((key, value) => {
    onUpdate({ [key]: value });
  }, [onUpdate]);

  return <PropertyGroup properties={sortedProperties} onChange={handleUpdate} />;
};
```

**Alvos**:
- `BlockPropertyEditor` (re-renderiza a cada mudança)
- `PreviewV2` (iframe pesado)
- Input components (ColorInput, SliderInput)

---

## 🔄 Prioridade MÉDIA (Melhorias Incrementais)

### 5. Sistema de Temas do Editor 🎨
**Esforço**: 3-4h | **Impacão**: Médio (UX)

**Objetivo**: Permitir tema claro/escuro no editor

```typescript
// src/editor/theme/EditorTheme.tsx
export type EditorTheme = "light" | "dark" | "auto";

export const editorThemes = {
  light: {
    bg: "#ffffff",
    panelBg: "#f9fafb",
    border: "#e5e7eb",
    text: "#1f2937",
  },
  dark: {
    bg: "#1f2937",
    panelBg: "#111827",
    border: "#374151",
    text: "#f9fafb",
  },
};

// Hook para gerenciar tema
export function useEditorTheme() {
  const [theme, setTheme] = useState<EditorTheme>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-editor-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
```

---

### 6. Histórico com Limite de Memória 📊
**Esforço**: 2h | **Impacto**: Médio (evitar memory leaks)

**Problema**: Histórico pode crescer indefinidamente em sessões longas

```typescript
// src/engine/patch/history.ts
export class HistoryManager {
  private maxHistorySize = 50;
  private maxMemoryMB = 10; // Limite de memória em MB

  push(document: any, patch: Patch, description?: string): void {
    // ... código existente ...

    // Verificar tamanho em memória
    const memorySize = this.estimateMemorySize();
    if (memorySize > this.maxMemoryMB * 1024 * 1024) {
      this.trimOldestEntries();
    }
  }

  private estimateMemorySize(): number {
    return JSON.stringify(this.history).length;
  }

  private trimOldestEntries(): void {
    // Remove 25% das entradas mais antigas
    const toRemove = Math.floor(this.history.length * 0.25);
    this.history.splice(0, toRemove);
    this.currentIndex = Math.max(0, this.currentIndex - toRemove);
  }
}
```

---

### 7. Preview com Hot Reload 🔥
**Esforço**: 2-3h | **Impacto**: Médio-Alto (DX)

**Objetivo**: Preview atualiza sem reload completo do iframe

```typescript
// src/engine/preview/PreviewV2.tsx
const updatePartialPreview = (blockId: string, doc: SiteDocumentV2) => {
  const block = findBlockInPage(page, blockId);
  if (!block) return updateFullPreview(doc);

  // Estratégia de hot reload:
  // 1. Exportar apenas o bloco modificado
  const blockHtml = exportBlockToHtml(block, undefined, doc.theme);

  // 2. Substituir no DOM do iframe sem reload
  const iframe = iframeRef.current;
  const iframeDoc = iframe?.contentDocument;
  const element = iframeDoc?.querySelector(`[data-block-id="${blockId}"]`);

  if (element) {
    // Preservar scroll position
    const scrollY = iframeDoc.documentElement.scrollTop;

    element.outerHTML = blockHtml;

    // Restaurar scroll
    iframeDoc.documentElement.scrollTop = scrollY;
  }
};
```

**Status**: ✅ Já implementado parcialmente, mas pode melhorar

---

### 8. Validação de Schema com Zod 🛡️
**Esforço**: 3-4h | **Impacto**: Médio (confiabilidade)

**Objetivo**: Validação runtime dos documentos

```typescript
// src/engine/schema/validation.ts
import { z } from "zod";

export const BlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    "container",
    "stack",
    "heading",
    "button",
    // ... todos os tipos
  ]),
  props: z.record(z.any()),
});

export const PageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  structure: z.array(BlockSchema),
});

export const DocumentSchema = z.object({
  pages: z.array(PageSchema).min(1),
  theme: ThemeSchema.optional(),
});

// Validar ao carregar documento
export function validateDocument(doc: unknown): SiteDocumentV2 {
  return DocumentSchema.parse(doc);
}
```

**Benefícios**:
- Catch erros de schema em desenvolvimento
- Melhor error messages
- Type inference automático

---

### 9. Keyboard Shortcuts ⌨️
**Esforço**: 2h | **Impacto**: Alto (UX)

**Objetivo**: Atalhos para ações comuns

```typescript
// src/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(handlers: {
  undo?: () => void;
  redo?: () => void;
  save?: () => void;
  delete?: () => void;
  duplicate?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.undo?.();
      }

      // Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        handlers.redo?.();
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handlers.save?.();
      }

      // Delete = Remover bloco
      if (e.key === "Delete" || e.key === "Backspace") {
        handlers.delete?.();
      }

      // Ctrl/Cmd + D = Duplicar
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        handlers.duplicate?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
```

**Atalhos sugeridos**:
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo
- `Ctrl+S` / `Cmd+S`: Salvar
- `Delete` / `Backspace`: Remover bloco selecionado
- `Ctrl+D` / `Cmd+D`: Duplicar bloco
- `Ctrl+C` / `Cmd+C`: Copiar bloco
- `Ctrl+V` / `Cmd+V`: Colar bloco
- `Esc`: Desselecionar bloco

---

## 🔮 Prioridade BAIXA (Features Futuras)

### 10. Sistema de Plugins 🔌
**Esforço**: 8-12h | **Impacto**: Alto (extensibilidade)

**Objetivo**: Permitir extensões de terceiros

```typescript
// src/engine/plugins/PluginSystem.ts
export interface EditorPlugin {
  id: string;
  name: string;
  version: string;

  // Lifecycle hooks
  onInit?: (editor: EditorAPI) => void;
  onDestroy?: () => void;

  // Extensões
  blocks?: BlockDefinition[];
  renderers?: Record<string, BlockRenderer>;
  exporters?: Record<string, HtmlBlockExporter>;

  // UI
  toolbar?: ToolbarItem[];
  panels?: PanelDefinition[];
}

export class PluginManager {
  private plugins = new Map<string, EditorPlugin>();

  register(plugin: EditorPlugin): void {
    this.plugins.set(plugin.id, plugin);

    // Registrar blocos
    plugin.blocks?.forEach(block => componentRegistry.register(block));

    // Registrar renderizadores
    Object.entries(plugin.renderers || {}).forEach(([type, renderer]) => {
      renderRegistry.register(type as BlockType, renderer);
    });

    // Chamar hook de inicialização
    plugin.onInit?.(this.createEditorAPI());
  }
}
```

---

### 11. Versionamento de Documentos 📚
**Esforço**: 6-8h | **Impacto**: Médio (colaboração)

**Objetivo**: Salvar versões do documento

```typescript
// src/engine/versions/DocumentVersions.ts
export interface DocumentVersion {
  id: string;
  timestamp: number;
  author?: string;
  description?: string;
  document: SiteDocumentV2;
  checksum: string;
}

export class VersionManager {
  private versions: DocumentVersion[] = [];

  createVersion(doc: SiteDocumentV2, description?: string): DocumentVersion {
    const version: DocumentVersion = {
      id: `v-${Date.now()}`,
      timestamp: Date.now(),
      description,
      document: structuredClone(doc),
      checksum: hashDocument(doc),
    };

    this.versions.push(version);
    return version;
  }

  restoreVersion(versionId: string): SiteDocumentV2 | null {
    const version = this.versions.find(v => v.id === versionId);
    return version ? structuredClone(version.document) : null;
  }

  compareVersions(v1: string, v2: string): Patch {
    // Gerar diff entre duas versões
    const doc1 = this.restoreVersion(v1);
    const doc2 = this.restoreVersion(v2);
    return generateDiff(doc1, doc2);
  }
}
```

---

### 12. Preview Responsivo 📱
**Esforço**: 4-5h | **Impacto**: Alto (UX)

**Objetivo**: Testar design em diferentes resoluções

```typescript
// src/editor/components/ResponsivePreview.tsx
export type DevicePreset = "desktop" | "tablet" | "mobile";

const deviceSizes = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

export function ResponsivePreview({ document, page }: Props) {
  const [device, setDevice] = useState<DevicePreset>("desktop");
  const size = deviceSizes[device];

  return (
    <div>
      <DeviceSelector value={device} onChange={setDevice} />

      <div
        style={{
          width: size.width,
          height: size.height,
          transform: "scale(0.8)", // Fit na tela
          transformOrigin: "top left",
        }}
      >
        <PreviewV2 document={document} pageId={page.id} />
      </div>
    </div>
  );
}
```

---

### 13. Drag & Drop de Blocos 🎯
**Esforço**: 8-10h | **Impacto**: Alto (UX)

**Objetivo**: Reordenar blocos arrastando

```typescript
// Usar biblioteca @dnd-kit/core
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export function BlockList({ blocks, onReorder }: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over?.id);

      // Gerar patch de reordenação
      const patch = PatchBuilder.moveBlock(document, pageId, oldIndex, newIndex);
      applyChange(patch, "Reorder blocks");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map(block => (
          <SortableBlock key={block.id} block={block} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

### 14. Asset Manager 🖼️
**Esforço**: 10-12h | **Impacto**: Alto (funcionalidade)

**Objetivo**: Gerenciar imagens/vídeos do site

```typescript
// src/engine/assets/AssetManager.ts
export interface Asset {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  size: number;
  uploadedAt: number;
  tags?: string[];
}

export class AssetManager {
  private assets = new Map<string, Asset>();

  async upload(file: File): Promise<Asset> {
    // Upload para CDN/storage
    const url = await this.uploadToStorage(file);

    const asset: Asset = {
      id: generateId(),
      name: file.name,
      type: this.detectType(file),
      url,
      size: file.size,
      uploadedAt: Date.now(),
    };

    this.assets.set(asset.id, asset);
    return asset;
  }

  search(query: string): Asset[] {
    return Array.from(this.assets.values()).filter(asset =>
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.tags?.some(tag => tag.includes(query))
    );
  }
}
```

---

## 📋 Checklist de Implementação

### Quick Wins (1-2 dias)
- [ ] Limpar warnings do TypeScript
- [ ] Implementar lazy loading
- [ ] Adicionar testes para HistoryManager
- [ ] Memoizar componentes pesados

### Melhorias UX (3-5 dias)
- [ ] Sistema de temas (claro/escuro)
- [ ] Keyboard shortcuts
- [ ] Preview responsivo
- [ ] Histórico com limite de memória

### Features Avançadas (2-3 semanas)
- [ ] Sistema de plugins
- [ ] Drag & drop
- [ ] Asset manager
- [ ] Versionamento de documentos
- [ ] Validação com Zod

---

## 🎯 Recomendação de Ordem

Se você tem tempo limitado, sugiro implementar nesta ordem:

1. **Semana 1** (Quick Wins):
   - Limpar warnings ✅
   - Lazy loading ✅
   - Testes básicos ✅
   - Memoização ✅

2. **Semana 2** (UX):
   - Keyboard shortcuts ✅
   - Preview melhorado ✅
   - Tema do editor ✅

3. **Semana 3+** (Features):
   - Asset manager (se precisar upload de imagens)
   - Drag & drop (melhora muito a UX)
   - Preview responsivo

---

## 📊 Análise de ROI

| Melhoria | Esforço | Impacto | ROI |
|----------|---------|---------|-----|
| Limpar warnings | ⭐ | ⭐⭐⭐ | 🟢 Alto |
| Lazy loading | ⭐⭐ | ⭐⭐⭐⭐ | 🟢 Alto |
| Testes | ⭐⭐⭐ | ⭐⭐⭐⭐ | 🟢 Alto |
| Memoização | ⭐⭐ | ⭐⭐⭐ | 🟢 Médio |
| Keyboard shortcuts | ⭐⭐ | ⭐⭐⭐⭐ | 🟢 Alto |
| Preview responsivo | ⭐⭐⭐ | ⭐⭐⭐⭐ | 🟢 Alto |
| Asset manager | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟡 Médio |
| Drag & drop | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟡 Médio |
| Sistema de plugins | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🔴 Baixo |

---

**Conclusão**: Foque nos **Quick Wins** primeiro para melhorar qualidade e performance rapidamente, depois invista em **UX** para tornar o editor mais agradável de usar.
