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
| `carousel-images` | CarouselImagesInput | Array de imagens para carrossel (2-5 slots) |
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
  showWhen?: ShowWhenCondition;      // Visibilidade condicional (ver seção abaixo)
}
```

### Visibilidade Condicional (`showWhen`)

O sistema `showWhen` controla quando um campo é exibido no painel de propriedades. Importar tipos: `ShowWhenCondition` de `@brunoalz/smartgesti-site-editor`.

#### 1. Igualdade simples

Mostrar um campo quando outro campo tem um valor específico:

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

#### 2. OR de valores (`oneOf`)

Mostrar quando o campo é um de vários valores:

```typescript
// Mostrar apenas para variações de carrossel
autoplaySpeed: {
  label: "Velocidade",
  inputType: "slider",
  showWhen: { field: "variation", oneOf: ["hero-carousel", "hero-slideshow"] },
},
```

#### 3. Truthiness

Mostrar quando um campo tem valor truthy (não vazio, não undefined, não false):

```typescript
// Mostrar "logoHeight" apenas quando há um logo definido
logoHeight: {
  label: "Tamanho do Logo",
  inputType: "slider",
  showWhen: { field: "logo", truthy: true },
},
```

#### 4. AND — múltiplas condições

Todas as condições devem ser verdadeiras:

```typescript
// Mostrar apenas quando variant é "image-bg" E overlay está ativo
overlayOpacity: {
  label: "Opacidade do Overlay",
  inputType: "slider",
  showWhen: {
    and: [
      { field: "variant", equals: "image-bg" },
      { field: "overlay", equals: true },
    ],
  },
},
```

#### 5. OR — pelo menos uma condição

```typescript
showWhen: {
  or: [
    { field: "variant", equals: "image-bg" },
    { field: "variant", equals: "parallax" },
  ],
},
// Equivalente a: showWhen: { field: "variant", oneOf: ["image-bg", "parallax"] }
```

#### 6. Cross-block

Verificar props de outro bloco na mesma página (busca top-level):

```typescript
// Mostrar apenas quando a navbar tem floating ativo
heroTopPadding: {
  label: "Padding Superior",
  inputType: "slider",
  showWhen: { field: "floating", equals: true, blockType: "navbar" },
},
```

#### 7. Comparações numéricas e array

```typescript
// Mostrar quando array tem mais de 2 itens
carouselNavigation: {
  label: "Navegação",
  inputType: "select",
  showWhen: { field: "carouselImages", arrayLengthGt: 2 },
},

// Comparações: gt, gte, lt, lte
advancedOption: {
  label: "Opção Avançada",
  showWhen: { field: "columns", gte: 3 },
},
```

#### Combinando operadores no mesmo campo

Múltiplos operadores no mesmo objeto são combinados com AND implícito:

```typescript
// Mostrar quando columns >= 2 E columns <= 4
specialLayout: {
  showWhen: { field: "columns", gte: 2, lte: 4 },
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

### Inputs Multi-Prop (`image-grid`, `carousel-images`)

Alguns inputs manipulam múltiplas props simultaneamente. Eles recebem `context.allProps` e `context.onMultiUpdate`:

```typescript
// No renderPropertyInput.tsx, o image-grid recebe:
<ImageGridInput
  allProps={context.allProps}
  onMultiUpdate={context.onMultiUpdate}  // Atualiza imageGridPreset, imageGridImages, imageGridGap
/>
```

### Shared Utilities (`src/engine/shared/`)

Quando renderer e exporter precisam da **mesma lógica** (constantes, cálculos, geração de CSS), extraia para `src/engine/shared/`:

```
src/engine/shared/
├── shadowConstants.ts       # imageShadowMap
├── layoutConstants.ts       # contentPositionMap, blockGapConfig
├── socialIcons.ts           # socialIconPaths
├── carouselAnimation.ts     # generateCarouselCSS (keyframes + dots)
├── hoverEffects/            # Geradores de hover CSS
├── imageGrid/               # Presets e tipos do image grid
└── typography/              # Config e geração de CSS tipográfico
```

**Atenção**: `spacingMap` é intencionalmente diferente entre renderer e exporter — NÃO extrair para shared.

---

## Adicionando Variações a Blocos Existentes

Para adicionar uma nova variação a um bloco que já tem variações (ex: Hero, Navbar):

### 1. Atualizar o union de IDs no Schema

```typescript
// src/engine/schema/siteDocument.ts
export type HeroVariationId =
  | "hero-split"
  | "hero-parallax"
  // ...existentes
  | "hero-nova";  // ← NOVA
```

### 2. Adicionar novas props (se necessário)

Se a variação precisa de props novas no bloco:

```typescript
export interface HeroBlock extends BlockBase {
  type: "hero";
  props: {
    // ...existentes...
    novasProp?: string;  // ← NOVA
  };
}
```

### 3. Adicionar o preset de variação

```typescript
// src/engine/presets/heroVariations.ts

// Adicionar ao objeto heroVariations:
"hero-nova": {
  id: "hero-nova",
  name: "Nova",
  defaultProps: {
    variation: "hero-nova",
    variant: "image-bg",
    title: "Título padrão",
    // ... props visuais (NÃO incluir props editáveis como image)
  },
},

// Adicionar ao array heroVariationIds:
export const heroVariationIds: HeroVariationId[] = [
  // ...existentes
  "hero-nova",
];
```

### 4. Adicionar inspectorMeta (se novas props)

No arquivo de definition do bloco, adicionar grupo com `showWhen`:

```typescript
// src/engine/registry/blocks/sections/hero.ts
novaProp: {
  label: "Nova Prop",
  inputType: "text",
  group: "Novo Grupo",
  showWhen: { field: "variation", equals: "hero-nova" },
},
```

### 5. Render path no Renderer e Exporter

Adicionar branch `if (isNova)` nos dois arquivos:
- `src/engine/render/renderers/sections/HeroRenderer.tsx`
- `src/engine/export/exporters/sections/HeroExporter.ts`

### 6. Preservar props ao trocar variação

Em `src/editor/PropertyEditor/VariationSelector.tsx`, adicionar `preserveIfDefined` para que as props customizadas sobrevivam ao trocar de variação:

```typescript
const newProps = {
  ...HERO_VISUAL_PROPS_TO_RESET,
  ...v.defaultProps,
  ...preserveIfDefined(props, "title"),
  // ...outros conteúdos...

  // Preserva props da nova variação
  ...preserveIfDefined(props, "novaProp"),
};
```

**Regra**: Props de conteúdo do usuário (imagens uploadadas, textos, configurações) devem ser preservadas com `preserveIfDefined`. Props visuais que definem a aparência da variação (cores, alinhamento) devem estar no `HERO_VISUAL_PROPS_TO_RESET` para serem limpas ao trocar.

---

## Criando um Novo `inputType` Customizado

Quando nenhum inputType existente atende, crie um novo:

### 1. Adicionar ao union em `types.ts`

```typescript
// src/engine/registry/types.ts
inputType?:
  | "text"
  | "textarea"
  // ...existentes
  | "meu-input";     // ← NOVO
```

### 2. Criar componente em `inputs/`

```typescript
// src/editor/PropertyEditor/inputs/MeuInput.tsx
export function MeuInput({ value, onChange, label }: MeuInputProps) {
  return (
    <div>
      <label>{label}</label>
      {/* UI do input */}
    </div>
  );
}
```

### 3. Exportar no barrel

```typescript
// src/editor/PropertyEditor/inputs/index.ts
export { MeuInput } from "./MeuInput";
```

### 4. Adicionar case no `renderPropertyInput.tsx`

```typescript
// src/editor/PropertyEditor/renderPropertyInput.tsx
case "meu-input":
  return <MeuInput key={propName} value={value} onChange={onChange} label={label} />;
```

**Se o input manipula múltiplas props** (como `image-grid` e `carousel-images`), use o pattern multi-prop:

```typescript
case "meu-input":
  if (context?.allProps && context?.onMultiUpdate) {
    const myData = context.allProps.myData || [];
    return (
      <MeuInput
        key={propName}
        data={myData}
        onDataChange={(newData) => {
          context.onMultiUpdate!({ myData: newData });
        }}
      />
    );
  }
  return null;
```

---

## Sistema de Hover Effects

O editor possui um sistema completo de efeitos de hover para **botões** e **links**, implementado em `src/engine/shared/hoverEffects/`. Os efeitos funcionam tanto no React preview quanto no HTML export.

### Blocos que Suportam Hover Effects

| Bloco | Button Hover | Link Hover | Observação |
|-------|:----------:|:----------:|------------|
| **Button** | Props diretas | - | Efeito principal + overlay |
| **Link** | - | Props diretas | Efeito + cor de hover |
| **Hero** | `buttonHover*` | - | Controla primary + secondary |
| **CTA** | `buttonHover*` | - | Controla primary + secondary |
| **Navbar** | `buttonHover*` (CTA) | `linkHover*` (nav links) | Controles separados |
| **Footer** | - | `linkHover*` | Links do footer |

### Props de Button Hover

Usadas em blocos de seção (Hero, CTA, Navbar):

```typescript
{
  // Efeito principal ao passar o mouse
  buttonHoverEffect: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse",

  // Intensidade do efeito (10 a 100)
  buttonHoverIntensity: number,

  // Efeito extra (overlay animado)
  buttonHoverOverlay: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow",

  // Ícone (só quando overlay = "icon")
  buttonHoverIconName: string,  // ex: "arrow-right", "rocket", "sparkles"

  // Tamanho do botão
  buttonSize: "sm" | "md" | "lg",
}
```

No bloco **Button** standalone, as props são sem prefixo `button`:

```typescript
{
  hoverEffect: "none" | "darken" | "lighten" | "scale" | "glow" | "shadow" | "pulse",
  hoverIntensity: number,
  hoverOverlay: "none" | "shine" | "fill" | "bounce" | "icon" | "border-glow",
  hoverIconName: string,
}
```

### Props de Link Hover

Usadas em Navbar, Footer e bloco Link:

```typescript
{
  // Efeito ao passar o mouse nos links
  linkHoverEffect: "none" | "background" | "underline" | "underline-center" | "slide-bg" | "scale" | "glow",

  // Intensidade do efeito (10 a 100)
  linkHoverIntensity: number,

  // Cor aplicada no hover
  linkHoverColor: string,  // ex: "#6366f1"
}
```

No bloco **Link** standalone, as props são sem prefixo `link`:

```typescript
{
  hoverEffect: "none" | "background" | "underline" | "underline-center" | "scale" | "glow",
  hoverIntensity: number,
  hoverColor: string,
}
```

### Referência Visual dos Efeitos

**Button Hover Effects:**

| Valor | Descrição |
|-------|-----------|
| `none` | Sem efeito |
| `darken` | Escurece o botão + leve elevação |
| `lighten` | Clareia o botão + leve elevação |
| `scale` | Aumenta levemente o tamanho |
| `glow` | Brilho neon colorido ao redor |
| `shadow` | Sombra elevada dramática |
| `pulse` | Animação de pulso infinita |

**Button Overlay Effects (extras):**

| Valor | Descrição |
|-------|-----------|
| `none` | Sem overlay |
| `shine` | Faixa de luz deslizando sobre o botão |
| `fill` | Preenchimento de cor da esquerda para direita |
| `bounce` | Pequeno salto animado |
| `icon` | Ícone que aparece ao passar o mouse |
| `border-glow` | Borda com brilho pulsante |

**Link Hover Effects:**

| Valor | Descrição |
|-------|-----------|
| `none` | Apenas mudança de cor |
| `background` | Fundo colorido aparece |
| `underline` | Sublinhado desliza da esquerda para direita |
| `underline-center` | Sublinhado cresce do centro para as pontas |
| `slide-bg` | Fundo desliza de baixo para cima |
| `scale` | Texto aumenta levemente |
| `glow` | Brilho neon ao redor do texto |

### Ícones Disponíveis (para `buttonHoverIconName`)

Quando `buttonHoverOverlay: "icon"`, escolha entre 28 ícones:

- **Navegação**: `arrow-right` (default), `chevron-right`, `external-link`
- **Ações**: `plus`, `check`, `download`, `send`, `play`
- **Expressivos**: `star`, `heart`, `zap`, `sparkles`, `rocket`, `fire`, `gift`, `trophy`
- **Comunicação**: `mail`, `phone`
- **E-commerce**: `cart`, `tag`
- **Interface**: `eye`, `lock`, `user`, `settings`

### Arquivos-Chave do Sistema

| Arquivo | Conteúdo |
|---------|----------|
| `src/engine/shared/hoverEffects/types.ts` | Tipos e interfaces |
| `src/engine/shared/hoverEffects/buttonHover.ts` | Gerador de CSS para button hover |
| `src/engine/shared/hoverEffects/linkHover.ts` | Gerador de CSS para link hover |
| `src/engine/shared/hoverEffects/index.ts` | Barrel exports |

---

## Criando Templates

Templates são `SiteDocument` estáticos com blocos pré-configurados, usados como ponto de partida no editor.

### Estrutura de um Template

```typescript
// src/shared/templates/meu-template.ts
import type { SiteDocument } from "../schema";
import { NAVBAR_DEFAULT_PROPS } from "../../engine/registry/blocks/sections/navbar";

export const meuTemplate: SiteDocument = {
  meta: {
    title: "Meu Template",
    description: "Descrição curta do template",
    language: "pt-BR",
  },
  theme: {
    colors: { primary: "#3b82f6", secondary: "#64748b", /* ... */ },
    typography: { fontFamily: "Inter, system-ui, sans-serif", /* ... */ },
    spacing: { unit: "0.25rem", scale: [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64] },
    effects: { borderRadius: "0.75rem", shadow: "...", shadowLg: "...", transition: "all 0.3s ease" },
  },
  structure: [
    // Blocos aqui...
  ],
};
```

### Checklist para Novo Template

1. Criar arquivo em `src/shared/templates/meu-template.ts`
2. Registrar em `src/shared/templates/index.ts`:
   - Import + re-export
   - Adicionar à `templateList[]` (com `id`, `name`, `description`, `category`, `tags`, `preview`)
   - Adicionar ao mapa `templates`
3. Atualizar `src/shared/schema.ts` se criou novos tipos de bloco

### Hover Effects em Templates

Sempre adicionar hover effects aos blocos que suportam para que o template fique interativo e profissional. Use efeitos coerentes entre si (mesma "família" de efeitos).

**Exemplo completo — Navbar com hover effects:**

```typescript
{
  id: "meu-navbar",
  type: "navbar",
  props: {
    ...NAVBAR_DEFAULT_PROPS,
    links: [
      { text: "Home", href: "/site/p/home" },
      { text: "Sobre", href: "#sobre" },
    ],
    ctaButton: { text: "Contato", href: "#contato" },
    bg: "#ffffff",
    // Link hover: sublinhado deslizante na cor primária
    linkHoverEffect: "underline",
    linkHoverIntensity: 60,
    linkHoverColor: "#6366f1",
    // CTA button hover: scale + brilho
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
  },
},
```

**Exemplo — Hero com hover effects nos botões:**

```typescript
{
  id: "meu-hero",
  type: "hero",
  props: {
    variation: "hero-split",
    variant: "split",
    title: "Título Impactante",
    description: "Descrição do produto ou serviço.",
    primaryButton: { text: "Começar", href: "#cta" },
    secondaryButton: { text: "Saiba Mais", href: "#sobre" },
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    // Button hover: glow neon + shine overlay
    buttonHoverEffect: "glow",
    buttonHoverIntensity: 60,
    buttonHoverOverlay: "shine",
  },
},
```

**Exemplo — CTA com hover effects:**

```typescript
{
  id: "meu-cta",
  type: "cta",
  props: {
    title: "Pronto para começar?",
    primaryButton: { text: "Começar Agora", href: "#contato" },
    secondaryButton: { text: "Ver Planos" },
    variant: "gradient",
    // Button hover: scale + shine
    buttonHoverEffect: "scale",
    buttonHoverIntensity: 50,
    buttonHoverOverlay: "shine",
  },
},
```

**Exemplo — Footer com hover effects nos links:**

```typescript
{
  id: "meu-footer",
  type: "footer",
  props: {
    logoText: "Minha Marca",
    variant: "multi-column",
    columns: [ /* ... */ ],
    // Link hover: sublinhado do centro, cor mais suave
    linkHoverEffect: "underline-center",
    linkHoverIntensity: 50,
    linkHoverColor: "#818cf8",
  },
},
```

### Combinações Recomendadas por Estilo

| Estilo | Button Effect | Button Overlay | Link Effect | Notas |
|--------|:----------:|:----------:|:----------:|-------|
| **Corporativo** | `scale` | `shine` | `underline` | Elegante e discreto |
| **Tech/SaaS** | `glow` | `shine` | `underline-center` | Moderno, efeito neon |
| **Criativo** | `shadow` | `fill` | `slide-bg` | Dramático e visual |
| **Minimalista** | `lighten` | `none` | `underline` | Limpo, quase sem overlay |
| **E-commerce** | `scale` | `icon` (cart) | `background` | Ícone incentiva ação |
| **Educação** | `darken` | `bounce` | `underline-center` | Amigável e convidativo |
