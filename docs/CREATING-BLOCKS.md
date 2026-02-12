# Guia Completo: Criando Blocos e Propriedades

> **Guia definitivo** para criar novos blocos ou adicionar propriedades a blocos existentes no SmartGesti Site Editor.
> Inclui fluxos completos, exemplos práticos, integração com paleta de cores e troubleshooting.

---

## Índice

1. [Arquitetura e Fluxo Completo](#1-arquitetura-e-fluxo-completo)
2. [Dual Rendering System](#2-dual-rendering-system)
3. [Exemplo Passo-a-Passo: Criando um Bloco Alert](#3-exemplo-passo-a-passo-criando-um-bloco-alert)
4. [Integração com Paleta de Cores](#4-integração-com-paleta-de-cores)
5. [Adicionando Propriedades a Blocos Existentes](#5-adicionando-propriedades-a-blocos-existentes)
6. [Sistema de Variações](#6-sistema-de-variações)
7. [Referência de Input Types](#7-referência-de-input-types)
8. [Visibilidade Condicional (showWhen)](#8-visibilidade-condicional-showwhen)
9. [Padrões Importantes](#9-padrões-importantes)
10. [Testando seu Bloco](#10-testando-seu-bloco)
11. [Troubleshooting](#11-troubleshooting)
12. [Checklist de Verificação](#12-checklist-de-verificação)

---

## 1. Arquitetura e Fluxo Completo

### 1.1 Visão Geral

Cada bloco no editor possui **4 componentes obrigatórios** que trabalham juntos:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Schema    │────▶│  Definition  │────▶│   Renderer   │────▶│   Exporter   │
│ (TypeScript)│     │  (Registry)  │     │   (React)    │     │    (HTML)    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      ▲                     │                     │                    │
      │                     ▼                     ▼                    ▼
  Interface        defaultProps +         Preview no           HTML Export
   com tipos       inspectorMeta          Editor              (Site Final)
```

### 1.2 Fluxo de Dados

```
Usuário edita no painel → onChange atualiza props → Renderer re-renderiza preview
                                                              ↓
                                        Usuário clica "Exportar" → Exporter gera HTML
```

### 1.3 Onde cada peça vive

| Componente | Localização | Responsabilidade |
|-----------|-------------|------------------|
| **Schema** | `src/engine/schema/siteDocument.ts` | Define a estrutura de dados (TypeScript) |
| **Definition** | `src/engine/registry/blocks/{category}/{nome}.ts` | Configuração do bloco (defaultProps, inspectorMeta) |
| **Renderer** | `src/engine/render/renderers/{category}/{Nome}Renderer.tsx` | Componente React para preview |
| **Exporter** | `src/engine/export/exporters/{category}/{Nome}Exporter.ts` | Função que gera HTML |

---

## 2. Dual Rendering System

**CRÍTICO:** O editor usa **dois sistemas de renderização independentes**:

### 2.1 React Renderer (Preview no Editor)

- **Onde:** `src/engine/render/renderers/`
- **Quando:** Usado no preview dentro do iframe do editor
- **Tecnologia:** Componentes React com inline styles
- **Dados:** Props do bloco em tempo real

### 2.2 HTML Exporter (Site Final)

- **Onde:** `src/engine/export/exporters/`
- **Quando:** Usado para gerar o HTML final do site
- **Tecnologia:** String de HTML com CSS inline
- **Dados:** Props do bloco congeladas no momento do export

### 2.3 Por que ambos devem estar sincronizados?

**O preview do editor usa o EXPORTER, não o renderer React!**

```typescript
// ⚠️ ERRO COMUM
// Você implementa um efeito no Renderer...
export function renderMyBlock(block: MyBlock) {
  return <div style={{ animation: "fadeIn 0.3s" }}>...</div>;  // ✅ Funciona no preview? NÃO!
}

// ...mas esquece de implementar no Exporter
export function exportMyBlock(block: Block) {
  return `<div>...</div>`;  // ❌ Sem animation = preview quebrado
}
```

**✅ CORRETO:** Sempre implementar a mesma lógica visual em ambos:

```typescript
// Renderer (React)
export function renderMyBlock(block: MyBlock) {
  return (
    <div
      style={{
        animation: "fadeIn 0.3s",
        backgroundColor: "var(--sg-primary)",
      }}
    >
      {block.props.text}
    </div>
  );
}

// Exporter (HTML)
export function exportMyBlock(block: Block) {
  const { text } = (block as any).props;
  return `
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
    <div style="animation: fadeIn 0.3s; background-color: var(--sg-primary);">
      ${escapeHtml(text)}
    </div>
  `;
}
```

---

## 3. Exemplo Passo-a-Passo: Criando um Bloco "Alert"

Vamos criar um bloco de alerta completo, do zero.

### Passo 1: Schema (`src/engine/schema/siteDocument.ts`)

**3 mudanças obrigatórias:**

```typescript
// 1️⃣ Adicionar ao union BlockType (linha ~30)
export type BlockType =
  | "alert"       // ← NOVO
  | "heading"
  | "text"
  | "button"
  // ...existentes

// 2️⃣ Definir a interface do bloco (adicionar no final das interfaces)
export interface AlertBlock extends BlockBase {
  type: "alert";
  props: {
    text?: string;
    variant?: "info" | "success" | "warning" | "danger";
    icon?: string;
    dismissible?: boolean;
    bg?: string;          // Cor de fundo customizável
    textColor?: string;   // Cor do texto customizável
  };
}

// 3️⃣ Adicionar ao union Block (linha ~500+)
export type Block =
  | AlertBlock    // ← NOVO
  | HeadingBlock
  | TextBlock
  | ButtonBlock
  // ...existentes
```

### Passo 2: Definition (`src/engine/registry/blocks/content/alert.ts`)

**Criar arquivo novo:**

```typescript
import { BlockDefinition } from "../../types";
import { componentRegistry } from "../../registry";

export const alertBlock: BlockDefinition<"alert"> = {
  type: "alert",
  name: "Alerta",
  description: "Caixa de alerta com variantes (info, success, warning, danger)",
  category: "content",
  canHaveChildren: false,

  defaultProps: {
    text: "Esta é uma mensagem de alerta.",
    variant: "info",
    icon: "info",
    dismissible: false,
    bg: "",           // Vazio = usa cor do variant
    textColor: "",    // Vazio = usa cor do variant
  },

  inspectorMeta: {
    text: {
      label: "Mensagem",
      inputType: "textarea",
      group: "Conteúdo",
      description: "Texto da mensagem de alerta",
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
      group: "Aparência",
    },
    icon: {
      label: "Ícone",
      inputType: "icon-grid",
      group: "Aparência",
      description: "Ícone exibido ao lado da mensagem",
    },
    dismissible: {
      label: "Pode ser fechado",
      inputType: "checkbox",
      group: "Comportamento",
    },
    // Cores customizáveis (integração com paleta)
    bg: {
      label: "Cor de Fundo (Opcional)",
      inputType: "color-advanced",
      group: "Cores",
      description: "Deixe vazio para usar a cor padrão do tipo",
    },
    textColor: {
      label: "Cor do Texto (Opcional)",
      inputType: "color-advanced",
      group: "Cores",
      description: "Deixe vazio para usar a cor padrão do tipo",
    },
  },
};

// ⚠️ CRÍTICO: Auto-registro (side effect)
// SEM essa linha, o bloco NÃO aparecerá no editor!
componentRegistry.register(alertBlock);
```

**Exportar no barrel `src/engine/registry/blocks/content/index.ts`:**

```typescript
export * from "./alert";
```

### Passo 3: Renderer (`src/engine/render/renderers/content/AlertRenderer.tsx`)

```typescript
import React from "react";
import { AlertBlock } from "../../../schema/siteDocument";

// Mapa de cores padrão por variant
const variantStyles: Record<string, { bg: string; border: string; text: string }> = {
  info:    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
  danger:  { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
};

export function renderAlert(block: AlertBlock): React.ReactNode {
  const {
    text,
    variant = "info",
    dismissible = false,
    bg,
    textColor,
  } = block.props;

  // Usar cores customizadas OU cores do variant
  const style = variantStyles[variant] || variantStyles.info;
  const backgroundColor = bg || style.bg;
  const color = textColor || style.text;

  return (
    <div
      key={block.id}
      role="alert"
      style={{
        padding: "1rem 1.25rem",
        borderLeft: `4px solid ${style.border}`,
        backgroundColor,
        color,
        borderRadius: "0.5rem",
        margin: "0.5rem 0",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        position: "relative",
      }}
    >
      {/* Ícone */}
      <div style={{ flexShrink: 0, fontSize: "1.25rem" }}>
        ℹ️ {/* Aqui você pode usar lucide-react */}
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>{text}</div>

      {/* Botão de fechar (se dismissible) */}
      {dismissible && (
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            opacity: 0.5,
          }}
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

**Registrar no `src/engine/render/renderers/content/index.ts`:**

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
  const {
    text,
    variant = "info",
    dismissible = false,
    bg,
    textColor,
  } = (block as any).props;

  // Cores padrão por variant
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    info:    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    danger:  { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
  };

  const style = colors[variant] || colors.info;
  const backgroundColor = bg || style.bg;
  const color = textColor || style.text;

  // Botão de fechar (se dismissible)
  const closeButton = dismissible
    ? `<button style="background:none;border:none;cursor:pointer;padding:0.25rem;opacity:0.5" aria-label="Fechar">✕</button>`
    : "";

  return `<div ${dataBlockIdAttr(block.id)} role="alert" style="padding:1rem 1.25rem;border-left:4px solid ${style.border};background-color:${backgroundColor};color:${color};border-radius:0.5rem;margin:0.5rem 0;display:flex;align-items:center;gap:0.75rem;position:relative"><div style="flex-shrink:0;font-size:1.25rem">ℹ️</div><div style="flex:1">${escapeHtml(text || "")}</div>${closeButton}</div>`;
}
```

**Registrar no `src/engine/export/exporters/content/index.ts`:**

```typescript
import { htmlExportRegistry } from "../HtmlExporter";
import { exportAlert } from "./AlertExporter";

htmlExportRegistry.register("alert", exportAlert);
```

### Passo 5: Exportar na API Pública (`src/index.ts`)

Se o bloco deve ser acessível por consumidores:

```typescript
// Adicionar ao final do arquivo
export type { AlertBlock } from './engine/schema/siteDocument';
```

---

## 4. Integração com Paleta de Cores

### 4.1 Entendendo o Sistema de Temas

O editor gera **CSS variables** automaticamente a partir do `theme`:

```typescript
// No SiteDocument, o theme define:
theme: {
  colors: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    // ...
  }
}

// Isso gera CSS variables:
:root {
  --sg-primary: #6366f1;
  --sg-primary-hover: #4f46e5;  /* Gerado automaticamente */
  --sg-primary-text: #ffffff;   /* Gerado automaticamente */
  --sg-secondary: #4f46e5;
  /* ...80+ variables */
}
```

### 4.2 Usando CSS Variables (Método Preferido)

**✅ SEMPRE use CSS variables com fallback:**

```typescript
// ✅ CORRETO - Respeita o tema
backgroundColor: "var(--sg-primary, #6366f1)"
color: "var(--sg-primary-text, #ffffff)"
borderColor: "var(--sg-border, #e5e7eb)"

// ❌ ERRADO - Cor hardcoded (não respeita tema)
backgroundColor: "#6366f1"
```

### 4.3 Lista Completa de CSS Variables Disponíveis

```css
/* === Cores === */
--sg-primary              /* Cor principal da marca */
--sg-primary-hover        /* Primary 10% mais escura */
--sg-primary-text         /* Texto sobre primary */
--sg-secondary            /* Cor secundária */
--sg-accent               /* Cor de destaque */
--sg-bg                   /* Fundo da página */
--sg-surface              /* Fundo de cards */
--sg-text                 /* Texto principal */
--sg-muted-text           /* Texto secundário */
--sg-border               /* Bordas */
--sg-link                 /* Links */
--sg-link-hover           /* Links no hover */
--sg-success              /* Verde de sucesso */
--sg-warning              /* Amarelo de aviso */
--sg-error                /* Vermelho de erro */

/* === Tipografia === */
--sg-font-heading         /* Fonte dos títulos */
--sg-font-body            /* Fonte do corpo */
--sg-heading-h1           /* 3rem */
--sg-heading-h2           /* 2.25rem */
--sg-heading-h3           /* 1.875rem */

/* === Componentes === */
--sg-button-radius        /* Raio dos botões */
--sg-card-radius          /* Raio dos cards */
--sg-card-shadow          /* Sombra dos cards */
```

### 4.4 Exemplo Prático: Bloco que Respeita a Paleta

```typescript
// Renderer
export function renderMyBlock(block: MyBlock) {
  const { title, useThemeColors } = block.props;

  return (
    <div
      style={{
        // Usa theme variable OU cor customizada
        backgroundColor: useThemeColors
          ? "var(--sg-primary)"
          : block.props.customBg,
        color: "var(--sg-primary-text)",
        padding: "var(--sg-spacing-md)",
        borderRadius: "var(--sg-card-radius)",
        boxShadow: "var(--sg-card-shadow)",
      }}
    >
      <h2 style={{ color: "var(--sg-text)" }}>{title}</h2>
    </div>
  );
}

// Exporter (mesma lógica)
export function exportMyBlock(block: Block) {
  const { title, useThemeColors, customBg } = (block as any).props;
  const bg = useThemeColors ? "var(--sg-primary)" : customBg;

  return `<div style="background-color:${bg};color:var(--sg-primary-text);padding:var(--sg-spacing-md);border-radius:var(--sg-card-radius);box-shadow:var(--sg-card-shadow)"><h2 style="color:var(--sg-text)">${escapeHtml(title)}</h2></div>`;
}
```

### 4.5 Quando Permitir Cores Customizadas

Adicione props de cor customizável quando:
- O usuário precisa destacar um elemento específico
- A cor default do tema não faz sentido (ex: badge de "novo" sempre verde)

```typescript
inspectorMeta: {
  bgColor: {
    label: "Cor de Fundo",
    inputType: "color-advanced",
    group: "Cores",
    description: "Deixe vazio para usar a cor primária do tema",
  },
}

// No renderer/exporter:
const bgColor = props.bgColor || "var(--sg-primary)";
```

---

## 5. Adicionando Propriedades a Blocos Existentes

### 5.1 Fluxo para Adicionar Props

```
1. Atualizar Schema → 2. Adicionar ao inspectorMeta → 3. Atualizar Renderer → 4. Atualizar Exporter
```

### 5.2 Exemplo: Adicionar `icon` ao AlertBlock

**Passo 1: Schema**

```typescript
export interface AlertBlock extends BlockBase {
  type: "alert";
  props: {
    text?: string;
    variant?: "info" | "success" | "warning" | "danger";
    icon?: string;  // ← NOVA PROP
  };
}
```

**Passo 2: inspectorMeta**

```typescript
inspectorMeta: {
  // ...props existentes...
  icon: {
    label: "Ícone",
    inputType: "icon-grid",
    group: "Aparência",
  },
}
```

**Passo 3: Renderer**

```typescript
const { text, variant, icon } = block.props;

return (
  <div ...>
    {icon && <LucideIcon name={icon} />}  {/* Usar nova prop */}
    <div>{text}</div>
  </div>
);
```

**Passo 4: Exporter**

```typescript
const { text, variant, icon } = (block as any).props;

const iconHtml = icon ? `<span>🔔</span>` : "";  // Renderizar icon

return `<div ...>${iconHtml}<div>${escapeHtml(text)}</div></div>`;
```

---

## 6. Sistema de Variações

### 6.1 O que são Variações?

Variações são **presets visuais** do mesmo bloco com configurações diferentes.

**Exemplo: Hero com 7 variações**
- `hero-split` → Layout 2 colunas
- `hero-parallax` → Imagem de fundo com parallax
- `hero-gradient` → Gradiente vibrante sem imagem
- etc.

### 6.2 Criando Variações

**1. Definir IDs no Schema:**

```typescript
export type MyBlockVariationId =
  | "my-block-simple"
  | "my-block-card"
  | "my-block-gradient";
```

**2. Adicionar ao Block Definition:**

```typescript
export const myBlock: BlockDefinition<"myBlock"> = {
  // ...
  variations: {
    "my-block-simple": {
      id: "my-block-simple",
      name: "Simples",
      defaultProps: {
        variant: "simple",
        bg: "#ffffff",
        // NÃO incluir props editáveis como title, image
      },
    },
    "my-block-card": {
      id: "my-block-card",
      name: "Card",
      defaultProps: {
        variant: "card",
        bg: "#f8fafc",
        shadow: "lg",
      },
    },
  },
};
```

**3. Lógica no Renderer/Exporter:**

```typescript
export function renderMyBlock(block: MyBlock) {
  const { variant } = block.props;

  if (variant === "card") {
    return renderCardVariant(block);
  }

  return renderSimpleVariant(block);
}
```

### 6.3 Preservar Props ao Trocar Variação

**Problema:** Ao trocar de variação, o usuário pode perder conteúdo customizado.

**Solução:** Usar `preserveIfDefined` em `VariationSelector.tsx`:

```typescript
// VariationSelector.tsx
const newProps = {
  ...VISUAL_PROPS_TO_RESET,  // Reseta props visuais
  ...v.defaultProps,          // Aplica defaults da nova variação
  ...preserveIfDefined(props, "title"),      // Preserva título
  ...preserveIfDefined(props, "image"),      // Preserva imagem
  ...preserveIfDefined(props, "description"), // Preserva descrição
};
```

---

## 7. Referência de Input Types

| inputType | Componente | Uso | Props Especiais |
|-----------|-----------|-----|-----------------|
| `text` | TextInput | Texto curto (título, label) | - |
| `textarea` | TextAreaInput | Texto longo (descrição) | - |
| `number` | NumberInput | Numérico | `min`, `max` |
| `color` | ColorInput | Seletor de cor simples | - |
| `color-advanced` | ColorInput | Seletor de cor avançado | - |
| `select` | ButtonGroup/Select | Lista de opções | `options: [{label, value}]` |
| `slider` | SliderInput | Numérico com slider | `min`, `max`, `step` |
| `checkbox` | ToggleButton | Booleano (on/off) | - |
| `image` | ImageInput | URL de imagem | - |
| `image-upload` | ImageInput | Upload autenticado | - |
| `icon-grid` | IconGridInput | Grid visual de ícones | - |
| `image-grid` | ImageGridInput | Grid de imagens com presets | - |
| `carousel-images` | CarouselImagesInput | Array de imagens (2-5) | - |
| `typography` | TypographyInput | Editor de tipografia | - |

---

## 8. Visibilidade Condicional (showWhen)

### 8.1 Tipos de Condições

```typescript
// 1️⃣ Igualdade simples
showWhen: { field: "overlay", equals: true }

// 2️⃣ Diferença
showWhen: { field: "variant", notEquals: "split" }

// 3️⃣ OR de valores
showWhen: { field: "variant", oneOf: ["hero-carousel", "hero-slideshow"] }

// 4️⃣ Truthiness
showWhen: { field: "logo", truthy: true }

// 5️⃣ AND de múltiplas condições
showWhen: {
  and: [
    { field: "variant", equals: "image-bg" },
    { field: "overlay", equals: true },
  ],
}

// 6️⃣ OR de condições
showWhen: {
  or: [
    { field: "variant", equals: "image-bg" },
    { field: "variant", equals: "parallax" },
  ],
}

// 7️⃣ Comparações numéricas
showWhen: { field: "columns", gte: 3 }  // gt, gte, lt, lte

// 8️⃣ Array length
showWhen: { field: "carouselImages", arrayLengthGt: 2 }

// 9️⃣ Cross-block (verificar props de outro bloco)
showWhen: { field: "floating", equals: true, blockType: "navbar" }
```

### 8.2 Exemplo Prático Completo

```typescript
inspectorMeta: {
  overlay: {
    label: "Ativar Overlay",
    inputType: "checkbox",
    group: "Aparência",
  },
  overlayColor: {
    label: "Cor do Overlay",
    inputType: "color-advanced",
    group: "Aparência",
    showWhen: { field: "overlay", equals: true },  // Só aparece se overlay=true
  },
  overlayOpacity: {
    label: "Opacidade",
    inputType: "slider",
    min: 0,
    max: 100,
    group: "Aparência",
    showWhen: { field: "overlay", equals: true },  // Só aparece se overlay=true
  },
}
```

---

## 9. Padrões Importantes

### 9.1 XSS Prevention

**⚠️ SEMPRE usar `escapeHtml()` em conteúdo do usuário:**

```typescript
import { escapeHtml } from "../../shared/htmlHelpers";

// ✅ CORRETO
return `<p>${escapeHtml(text)}</p>`;

// ❌ ERRADO - Vulnerável a XSS
return `<p>${text}</p>`;
```

### 9.2 Block ID no Exporter

Incluir `dataBlockIdAttr` para o editor identificar blocos ao clicar:

```typescript
import { dataBlockIdAttr } from "../../shared/htmlHelpers";

return `<div ${dataBlockIdAttr(block.id)}>...</div>`;
```

### 9.3 Shared Utilities

Quando renderer e exporter precisam da **mesma lógica** (constantes, cálculos, CSS), extraia para `src/engine/shared/`:

```typescript
// src/engine/shared/myBlockConstants.ts
export const MY_SHADOW_MAP = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.1)",
  lg: "0 10px 15px rgba(0,0,0,0.1)",
};

// Renderer e Exporter importam:
import { MY_SHADOW_MAP } from "../../../shared/myBlockConstants";
```

### 9.4 Hooks Antes de Early Returns

```typescript
// ✅ CORRETO
const Component = memo(({ block }) => {
  const data = useMemo(() => ..., [block]);
  const handler = useCallback(...);  // ANTES do return

  if (!block) return null;
});

// ❌ ERRADO
const Component = memo(({ block }) => {
  if (!block) return null;  // early return

  const handler = useCallback(...);  // ERRO: hooks após return
});
```

---

## 10. Testando seu Bloco

### 10.1 Build e Demo

```bash
# 1. Build do projeto
npm run build

# 2. Iniciar demo
npm run demo

# 3. Abrir no navegador
# http://localhost:5173
```

### 10.2 Checklist de Testes

- [ ] **Aparece no BlockSelector?** (categoria correta)
- [ ] **Props editáveis no PropertyEditor?** (todos os campos aparecem)
- [ ] **Preview renderiza corretamente?** (sem console errors)
- [ ] **Cores respeitam o tema?** (trocar paleta altera as cores)
- [ ] **showWhen funciona?** (campos condicionais aparecem/somem)
- [ ] **Export gera HTML correto?** (sem tags quebradas, XSS safe)
- [ ] **Responsivo?** (testar em mobile/tablet/desktop)

### 10.3 Teste de Integração com Paleta

1. No editor, criar seu bloco
2. Mudar a paleta do tema (LeftPanel → Paleta)
3. Verificar se as cores do bloco mudaram automaticamente

**Se não mudaram:** Você está usando cor hardcoded em vez de CSS variable!

---

## 11. Troubleshooting

### 11.1 Bloco Não Aparece no BlockSelector

**Possíveis causas:**

1. **Faltou `componentRegistry.register()`**
   ```typescript
   // ADICIONAR NO FINAL DO ARQUIVO DE DEFINITION:
   componentRegistry.register(myBlock);
   ```

2. **Faltou export no barrel**
   ```typescript
   // src/engine/registry/blocks/{category}/index.ts
   export * from "./myBlock";
   ```

3. **Erro de TypeScript no schema**
   - Verificar se adicionou ao union `BlockType`
   - Verificar se adicionou ao union `Block`

### 11.2 Preview Não Atualiza ao Editar

**Possíveis causas:**

1. **Renderer não está registrado**
   ```typescript
   // src/engine/render/renderers/{category}/index.ts
   import { renderMyBlock } from "./MyBlockRenderer";
   renderRegistry.register("myBlock", renderMyBlock);
   ```

2. **Props não estão sendo lidas corretamente**
   ```typescript
   // Verificar destructuring:
   const { myProp } = block.props;  // ✅
   const { myProp } = props;        // ❌ (se props não existe)
   ```

### 11.3 Export Gera HTML Quebrado

**Possíveis causas:**

1. **Exporter não registrado**
   ```typescript
   // src/engine/export/exporters/{category}/index.ts
   import { exportMyBlock } from "./MyBlockExporter";
   htmlExportRegistry.register("myBlock", exportMyBlock);
   ```

2. **HTML malformado**
   ```typescript
   // ❌ ERRADO - tag não fechada
   return `<div><p>${text}</div>`;

   // ✅ CORRETO
   return `<div><p>${text}</p></div>`;
   ```

3. **Faltou `escapeHtml()`**
   ```typescript
   // ❌ ERRADO - XSS vulnerability
   return `<div>${text}</div>`;

   // ✅ CORRETO
   return `<div>${escapeHtml(text)}</div>`;
   ```

### 11.4 Cores Não Respeitam o Tema

**Causa:** Usando cor hardcoded em vez de CSS variable.

```typescript
// ❌ ERRADO
backgroundColor: "#6366f1"

// ✅ CORRETO
backgroundColor: "var(--sg-primary, #6366f1)"
```

### 11.5 Build Falha com Erro de Type

**Causa:** Schema desatualizado ou tipos incorretos.

**Solução:**
1. Verificar se a interface está no `siteDocument.ts`
2. Verificar se está no union `Block`
3. Rodar `npm run build` e ler a mensagem de erro

---

## 12. Checklist de Verificação

### 12.1 Antes de Commitar

- [ ] Schema atualizado (`siteDocument.ts`)
  - [ ] Interface criada
  - [ ] Adicionada ao union `BlockType`
  - [ ] Adicionada ao union `Block`
- [ ] Definition criada
  - [ ] `componentRegistry.register()` chamado
  - [ ] Exportada no barrel `index.ts`
- [ ] Renderer criado
  - [ ] Registrado no `renderRegistry`
  - [ ] Usa CSS variables
  - [ ] Props lidas corretamente
- [ ] Exporter criado
  - [ ] Registrado no `htmlExportRegistry`
  - [ ] Usa `escapeHtml()` em todo conteúdo do usuário
  - [ ] Usa `dataBlockIdAttr(block.id)`
  - [ ] Mesma lógica visual que o Renderer
- [ ] Build passa sem erros
  - [ ] `npm run build` ✅
  - [ ] `npm run lint` ✅
- [ ] Testado no demo
  - [ ] Bloco aparece no BlockSelector
  - [ ] Props editáveis funcionam
  - [ ] Preview renderiza corretamente
  - [ ] Export gera HTML correto
  - [ ] Cores respeitam o tema

### 12.2 Checklist de Qualidade

- [ ] Código sem `console.log` (usar `logger`)
- [ ] Nomes de variáveis descritivos
- [ ] Comentários em lógica complexa
- [ ] Props com `description` no `inspectorMeta`
- [ ] Grupos lógicos no `inspectorMeta`
- [ ] `showWhen` usado para simplificar UI
- [ ] Responsivo (testar em 3 tamanhos)
- [ ] Performance OK (sem re-renders desnecessários)

---

## Recursos Adicionais

- **[TEMPLATE-MANUAL.md](./TEMPLATE-MANUAL.md)** — Guia para criar templates completos
- **[CLAUDE.md](../CLAUDE.md)** — Instruções do projeto para IA
- **Exemplos de blocos complexos:**
  - Hero: `src/engine/registry/blocks/sections/hero.ts`
  - Navbar: `src/engine/registry/blocks/sections/navbar.ts`
  - BlogPostGrid: `src/engine/registry/blocks/sections/blogPostGrid.ts`

---

**Dúvidas?** Consulte o código de blocos existentes como referência. Todos seguem o mesmo padrão descrito neste guia.
