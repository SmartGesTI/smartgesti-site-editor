/**
 * Hover Effects - Type Definitions
 *
 * Tipos e interfaces para o sistema de hover effects reutilizável.
 */

// ============================================================================
// EFFECT TYPES
// ============================================================================

/**
 * Efeitos disponíveis para links de texto
 */
export type LinkHoverEffect =
    | "none"
    | "background"       // Fundo colorido que aparece
    | "underline"        // Sublinhado que desliza da esquerda → direita
    | "underline-center" // Sublinhado que cresce do centro ←→
    | "slide-bg"         // Fundo que preenche de baixo ↑ para cima
    | "scale"            // Aumenta de tamanho
    | "glow";            // Brilho neon ao redor do texto

/**
 * Efeitos disponíveis para botões
 */
export type ButtonHoverEffect =
    | "none"
    | "darken"   // Escurece a cor e eleva
    | "lighten"  // Clareia a cor e eleva
    | "scale"    // Aumenta de tamanho
    | "glow"     // Brilho neon ao redor
    | "shadow"   // Sombra elevada dramática
    | "pulse"    // Animação de pulso infinita
    | "shine";   // Luz que desliza sobre o botão

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Configuração para gerar estilos de hover de links
 */
export interface LinkHoverConfig {
    /** Tipo de efeito */
    effect: LinkHoverEffect;
    /** Intensidade do efeito (10-100) */
    intensity: number;
    /** Cor do efeito no hover */
    hoverColor: string;
    /** Duração da transição (default: "0.2s") */
    transitionDuration?: string;
}

/**
 * Configuração para gerar estilos de hover de botões
 */
export interface ButtonHoverConfig {
    /** Tipo de efeito */
    effect: ButtonHoverEffect;
    /** Intensidade do efeito (10-100) */
    intensity: number;
    /** Cor principal do botão */
    buttonColor: string;
    /** Cor do texto do botão */
    buttonTextColor?: string;
    /** Variante do botão */
    variant?: "solid" | "outline" | "ghost";
    /** Duração da transição (default: "0.2s") */
    transitionDuration?: string;
}

// ============================================================================
// RESULT INTERFACES
// ============================================================================

/**
 * Resultado da geração de estilos de hover
 */
export interface HoverStyles {
    /** Estilos CSS para o estado base (preparação para animações) */
    base: string;
    /** Estilos CSS para o estado :hover */
    hover: string;
}

/**
 * CSS completo gerado com seletores
 */
export interface HoverCSS {
    /** CSS para estado base (se necessário) */
    baseRule?: string;
    /** CSS para regra :hover */
    hoverRule: string;
    /** Keyframes para animações (pulse, shine) */
    keyframes?: string;
}

// ============================================================================
// PRESET TYPES
// ============================================================================

/**
 * Presets pré-configurados para facilitar uso
 */
export type HoverPreset =
    | "subtle"       // Efeitos mínimos, baixa intensidade
    | "professional" // Underline/darken clássicos
    | "playful"      // Scale, glow - mais expressivo
    | "modern"       // Slide-bg, shine - tendências atuais
    | "custom";      // Configuração manual

/**
 * Configuração de preset
 */
export interface PresetConfig {
    link: Partial<LinkHoverConfig>;
    button: Partial<ButtonHoverConfig>;
}
