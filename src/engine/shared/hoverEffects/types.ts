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
 * Efeitos disponíveis para botões (principal)
 */
export type ButtonHoverEffect =
    | "none"
    | "darken"   // Escurece a cor e eleva
    | "lighten"  // Clareia a cor e eleva
    | "scale"    // Aumenta de tamanho
    | "glow"     // Brilho neon ao redor
    | "shadow"   // Sombra elevada dramática
    | "pulse";   // Animação de pulso infinita

/**
 * Efeitos de overlay para botões (combina com o principal)
 * Esses efeitos são animações visuais que ocorrem sobre o botão
 */
export type ButtonHoverOverlay =
    | "none"
    | "shine"        // ✨ Luz branca que desliza sobre o botão
    | "ripple"       // 🌊 Ondas/círculos se expandindo do centro
    | "gradient"     // 🌈 Gradiente colorido passando pelo botão
    | "sparkle"      // ⭐ Pequenas faíscas/partículas brilhantes
    | "border-glow"; // 💫 Borda que brilha e pulsa

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
    /** Tipo de efeito principal */
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

/**
 * Configuração para gerar estilos de overlay de botões
 */
export interface ButtonOverlayConfig {
    /** Tipo de overlay */
    overlay: ButtonHoverOverlay;
    /** Cor do overlay (se aplicável) */
    overlayColor?: string;
    /** Cor primária do tema (para gradientes) */
    primaryColor?: string;
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
