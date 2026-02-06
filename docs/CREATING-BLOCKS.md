# Guia: Criando Blocos e Propriedades

Guia prático para criar novos blocos ou adicionar propriedades a blocos existentes no SmartGesti Site Editor.

## Visão Geral da Arquitetura

Cada bloco no editor tem **4 partes** que devem existir:

```
Schema (tipo TS) → Definition (registro + inspectorMeta) → Renderer (React) → Exporter (HTML)
```

1. **Schema** — Interface TypeScript com os tipos das props
2. **Definition** — Registro no `componentRegistry` com `defaultProps` e `inspectorMeta` (o que aparece no painel de edição)
3. **Renderer** — Componente React para preview no editor
4. **Exporter** — Função que gera HTML estático para publicação

## Exemplo Completo: Criando um bloco "Alert"

### Passo 1: Schema (`src/engine/schema/siteDocument.ts`)

Adicione a interface e inclua nos unions `BlockType` e `Block`:

```typescript
// 1. Adicionar ao union BlockType
export type BlockType =
  | "alert"       // ← NOVO
  | "heading"
  | "text"
  // ...existentes

// 2. Definir interface
export interface AlertBlock extends BlockBase {
  type: "alert";
  props: {
    text?: string;
    variant?: "info" | "success" | "warning" | "danger";
    dismissible?: boolean;
  };
}

// 3. Adicionar ao union Block
export type Block =
  | AlertBlock    // ← NOVO
  | HeadingBlock
  | TextBlock
  // ...existentes
```

### Passo 2: Definition (`src/engine/registry/blocks/content/alert.ts`)

```typescript
import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const alertBlock: BlockDefinition = {
  type: "alert",
  name: "Alerta",
  description: "Caixa de alerta com variantes",
  category: "content",
  canHaveChildren: false,
  defaultProps: {
    text: "Esta é uma mensagem de alerta.",
    variant: "info",
    dismissible: false,
  },
  inspectorMeta: {
    text: {
      label: "Mensagem",
      inputType: "textarea",
      group: "Conteúdo",
    },
    variant: {
      label: "Tipo",
      inputType: "select",
      options: [
        { label: "Info", value: "info" },
        { label: "Sucesso", value: "success" },
        { label: "Aviso", value: "warning" },
        { label: "Perigo", value: "danger" },
      ],
      group: "Estilo",
    },
    dismissible: {
      label: "Permite fechar",
      inputType: "checkbox",
      group: "Comportamento",
    },
  },
};

// Auto-registro (side effect)
componentRegistry.register(alertBlock);
```

**Exportar** no barrel `src/engine/registry/blocks/content/index.ts`:
```typescript
export * from "./alert";
```

### Passo 3: Renderer (`src/engine/render/renderers/content/AlertRenderer.tsx`)

```typescript
import React from "react";
import { AlertBlock } from "../../../schema/siteDocument";

const variantStyles: Record<string, { bg: string; border: string; text: string }> = {
  info:    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
  danger:  { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
};

export function renderAlert(block: AlertBlock): React.ReactNode {
  const { text, variant = "info" } = block.props;
  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div
      key={block.id}
      style={{
        padding: "1rem",
        borderLeft: `4px solid ${style.border}`,
        backgroundColor: style.bg,
        color: style.text,
        borderRadius: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      {text}
    </div>
  );
}
```

**Registrar** no `src/engine/render/renderers/content/index.ts`:
```typescript
import { renderRegistry } from "../../registry/renderRegistry";
import { renderAlert } from "./AlertRenderer";

renderRegistry.register("alert", renderAlert);
```

### Passo 4: Exporter (`src/engine/export/exporters/content/AlertExporter.ts`)

```typescript
import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportAlert(
  block: Block,
  _depth: number,
  _basePath?: string,
  _theme?: ThemeTokens,
): string {
  const { text, variant = "info" } = (block as any).props;

  const colors: Record<string, { bg: string; border: string; text: string }> = {
    info:    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    danger:  { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
  };

  const style = colors[variant] || colors.info;

  return `<div ${dataBlockIdAttr(block.id)} style="padding:1rem;border-left:4px solid ${style.border};background:${style.bg};color:${style.text};border-radius:0.5rem;margin:0.5rem 0">${escapeHtml(text || "")}</div>`;
}
```

**Registrar** no `src/engine/export/exporters/content/index.ts`:
```typescript
import { htmlExportRegistry } from "../HtmlExporter";
import { exportAlert } from "./AlertExporter";

htmlExportRegistry.register("alert", exportAlert);
```

### Passo 5: Exportar na API pública (se necessário)

Se o tipo do bloco precisa ser acessível por consumidores, adicionar em `src/index.ts`:
```typescript
export type { AlertBlock } from './engine/schema/siteDocument'
```

---

## Adicionando Propriedades a Blocos Existentes

Para adicionar uma nova prop a um bloco que já existe (ex: adicionar `icon` ao AlertBlock):

### 1. Atualizar a interface no Schema

```typescript
// src/engine/schema/siteDocument.ts
export interface AlertBlock extends BlockBase {
  type: "alert";
  props: {
    text?: string;
    variant?: "info" | "success" | "warning" | "danger";
    dismissible?: boolean;
    icon?: string;  // ← NOVA PROP
  };
}
```

### 2. Adicionar ao inspectorMeta na Definition

```typescript
// No arquivo da definition do bloco
inspectorMeta: {
  // ...props existentes...
  icon: {
    label: "Ícone",
    inputType: "icon-grid",
    group: "Estilo",
  },
},
```

### 3. Atualizar o Renderer (React)

Usar a nova prop na renderização:
```typescript
const { text, variant, icon } = block.props;
// Renderizar icon...
```

### 4. Atualizar o Exporter (HTML)

Mesma lógica, gerando HTML:
```typescript
const { text, variant, icon } = (block as any).props;
// Gerar HTML com icon...
```

---

## Referência: Tipos de Input (`inputType`)

| inputType | Componente | Uso |
|-----------|-----------|-----|
| `text` | TextInput | Texto curto (título, label) |
| `textarea` | TextAreaInput | Texto longo (descrição, parágrafo) |
| `number` | NumberInput | Valor numérico com `min`/`max` |
| `color` | ColorInput | Seletor de cor simples |
| `color-advanced` | ColorInput | Seletor de cor avançado |
| `select` | ButtonGroup (2-3 opções) ou Select (4+) | Lista de opções |
| `slider` | SliderInput | Numérico com slider visual (`min`, `max`, `step`) |
| `checkbox` | ToggleButton | Booleano (on/off) |
| `image` | ImageInput (modo URL) | Input de URL de imagem |
| `image-upload` | ImageInput (modo upload) | Upload autenticado para Supabase |
| `icon-grid` | IconGridInput | Grid visual de ícones |
| `image-grid` | ImageGridInput | Grid de imagens com presets |
| `typography` | TypographyInput | Editor de tipografia (tamanho, peso, cor, efeitos) |

### Opções do InspectorMeta

```typescript
interface InspectorMeta {
  label: string;                    // Nome exibido no painel
  description?: string;             // Tooltip de ajuda
  group?: string;                   // Grupo (seção colapsável) — default: "Geral"
  inputType?: string;               // Tipo do input (ver tabela acima)
  options?: { label; value }[];     // Para "select"
  min?: number;                     // Para "slider" e "number"
  max?: number;                     // Para "slider" e "number"
  step?: number;                    // Para "slider"
  showWhen?: {                      // Visibilidade condicional
    field: string;                  // Nome da prop a observar
    equals?: any;                   // Mostrar quando field === equals
    notEquals?: any;                // Mostrar quando field !== notEquals
  };
}
```

### Visibilidade Condicional (`showWhen`)

Mostrar um campo apenas quando outro campo tem um valor específico:

```typescript
// Mostrar "overlayColor" apenas quando "overlay" é true
overlayColor: {
  label: "Cor do Overlay",
  inputType: "color-advanced",
  group: "Aparência",
  showWhen: { field: "overlay", equals: true },
},

// Mostrar "contentMaxWidth" quando variant NÃO é "split"
contentMaxWidth: {
  label: "Largura do Conteúdo",
  inputType: "select",
  options: [...],
  showWhen: { field: "variant", notEquals: "split" },
},
```

---

## Padrões Importantes

### CSS Variables para Theming

Sempre use CSS variables com fallback para que o bloco respeite o tema:

```typescript
// Renderer
backgroundColor: "var(--sg-primary, #3b82f6)"

// Exporter
`background-color: var(--sg-primary, #3b82f6)`
```

### XSS Prevention no Exporter

**SEMPRE** usar `escapeHtml()` para conteúdo do usuário no HTML export:

```typescript
import { escapeHtml } from "../../shared/htmlHelpers";

// CORRETO
return `<p>${escapeHtml(text)}</p>`;

// ERRADO — vulnerável a XSS
return `<p>${text}</p>`;
```

### Block ID no Exporter

Incluir `dataBlockIdAttr` para o editor identificar o bloco ao clicar:

```typescript
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

return `<div ${dataBlockIdAttr(block.id)}>...</div>`;
```

### Variações (Presets Visuais)

Para blocos com variações visuais (como Hero e Navbar), definir `variations` na Definition:

```typescript
export const myBlock: BlockDefinition = {
  // ...
  variations: {
    "my-variation-1": {
      id: "my-variation-1",
      name: "Layout Centrado",
      defaultProps: {
        variant: "centered",
        align: "center",
        // NÃO incluir props editáveis como image, title, etc.
      },
    },
    "my-variation-2": {
      id: "my-variation-2",
      name: "Layout Dividido",
      defaultProps: {
        variant: "split",
        align: "left",
      },
    },
  },
};
```

### Inputs Multi-Prop (`image-grid`)

Alguns inputs manipulam múltiplas props simultaneamente. Eles recebem `context.allProps` e `context.onMultiUpdate`:

```typescript
// No renderPropertyInput.tsx, o image-grid recebe:
<ImageGridInput
  allProps={context.allProps}
  onMultiUpdate={context.onMultiUpdate}  // Atualiza imageGridPreset, imageGridImages, imageGridGap
/>
```
