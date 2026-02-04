/**
 * Style Resolver
 * 
 * Sistema centralizado de resolução de estilos que combina
 * valores default com customizações do usuário, gerando
 * estilos inline completos para HTML export.
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Shadow values mapping
 */
export const shadowValues: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
};

/**
 * Font size values mapping
 */
export const fontSizes: Record<string, string> = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
};

// ============================================================================
// HOVER EFFECT GENERATORS
// ============================================================================

/**
 * Converte cor hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!hex.startsWith('#')) return null;
    let cleanHex = hex.replace('#', '');

    // Handle 3-char hex
    if (cleanHex.length === 3) {
        cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
}

/**
 * Cria cor rgba a partir de hex e opacidade
 */
function hexToRgba(hex: string, alpha: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
}

/**
 * Ajusta cor (escurecer ou clarear)
 */
function adjustColor(color: string, amount: number, lighten: boolean): string {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const adjust = (val: number) => {
        if (lighten) {
            return Math.min(255, Math.round(val + (255 - val) * amount));
        } else {
            return Math.max(0, Math.round(val * (1 - amount)));
        }
    };

    const newR = adjust(rgb.r).toString(16).padStart(2, '0');
    const newG = adjust(rgb.g).toString(16).padStart(2, '0');
    const newB = adjust(rgb.b).toString(16).padStart(2, '0');
    return `#${newR}${newG}${newB}`;
}

/**
 * Interface para estilos de hover que precisam de base + hover
 */
interface HoverStyleResult {
    /** Estilos CSS adicionais para o estado base (normal) */
    base: string;
    /** Estilos CSS para o estado hover */
    hover: string;
}

/**
 * Gera estilos CSS para hover de links baseado no efeito selecionado
 * intensity: 0.15-1 (mapeado de 10-100 do slider)
 *
 * Efeitos disponíveis:
 * - background: Fundo colorido que aparece
 * - underline: Sublinhado que desliza da esquerda para direita
 * - underline-center: Sublinhado que cresce do centro
 * - scale: Aumenta de tamanho
 * - glow: Brilho neon ao redor do texto
 * - slide-bg: Fundo que desliza de baixo para cima
 */
function generateLinkHoverStyles(
    effect: string,
    hoverColor: string,
    intensity: number
): HoverStyleResult {
    const baseStyles: string[] = [];
    const hoverStyles: string[] = [];

    // Cor do texto sempre muda no hover
    hoverStyles.push(`color: ${hoverColor} !important`);

    switch (effect) {
        case "background": {
            // Fundo com opacidade que aparece suavemente
            const bgOpacity = 0.10 + (intensity * 0.25);
            hoverStyles.push(`background-color: ${hexToRgba(hoverColor, bgOpacity)} !important`);
            // Leve elevação baseada na intensidade
            const translateY = Math.round(intensity * 3);
            if (translateY > 0) {
                hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            }
            break;
        }
        case "underline": {
            // Sublinhado animado que desliza da esquerda para direita
            const thickness = Math.max(2, Math.round(2 + intensity * 2));
            // Estilos base para preparar a animação
            baseStyles.push(`background-image: linear-gradient(${hoverColor}, ${hoverColor}) !important`);
            baseStyles.push(`background-size: 0% ${thickness}px !important`);
            baseStyles.push(`background-position: 0% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            baseStyles.push(`text-decoration: none !important`);
            // Hover expande o background
            hoverStyles.push(`background-size: 100% ${thickness}px !important`);
            break;
        }
        case "underline-center": {
            // Sublinhado que cresce do centro para as bordas
            const thickness = Math.max(2, Math.round(2 + intensity * 2));
            baseStyles.push(`background-image: linear-gradient(${hoverColor}, ${hoverColor}) !important`);
            baseStyles.push(`background-size: 0% ${thickness}px !important`);
            baseStyles.push(`background-position: 50% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            baseStyles.push(`text-decoration: none !important`);
            hoverStyles.push(`background-size: 100% ${thickness}px !important`);
            break;
        }
        case "scale": {
            // Escala suave
            const scale = 1.05 + (intensity * 0.10);
            hoverStyles.push(`transform: scale(${scale.toFixed(2)}) !important`);
            hoverStyles.push(`position: relative !important`);
            hoverStyles.push(`z-index: 10 !important`);
            break;
        }
        case "glow": {
            // Brilho neon com múltiplas camadas para efeito mais intenso
            const glowSize1 = Math.round(4 + (intensity * 8));
            const glowSize2 = Math.round(8 + (intensity * 16));
            const glowSize3 = Math.round(16 + (intensity * 24));
            const glowOpacity1 = 0.9;
            const glowOpacity2 = 0.6;
            const glowOpacity3 = 0.3;
            const shadow1 = `0 0 ${glowSize1}px ${hexToRgba(hoverColor, glowOpacity1)}`;
            const shadow2 = `0 0 ${glowSize2}px ${hexToRgba(hoverColor, glowOpacity2)}`;
            const shadow3 = `0 0 ${glowSize3}px ${hexToRgba(hoverColor, glowOpacity3)}`;
            hoverStyles.push(`text-shadow: ${shadow1}, ${shadow2}, ${shadow3} !important`);
            break;
        }
        case "slide-bg": {
            // Fundo que desliza de baixo para cima
            const bgOpacity = 0.15 + (intensity * 0.20);
            baseStyles.push(`background-image: linear-gradient(${hexToRgba(hoverColor, bgOpacity)}, ${hexToRgba(hoverColor, bgOpacity)}) !important`);
            baseStyles.push(`background-size: 100% 0% !important`);
            baseStyles.push(`background-position: 0% 100% !important`);
            baseStyles.push(`background-repeat: no-repeat !important`);
            hoverStyles.push(`background-size: 100% 100% !important`);
            break;
        }
        default:
            // Fallback para background
            hoverStyles.push(`background-color: ${hexToRgba(hoverColor, 0.15)} !important`);
    }

    return {
        base: baseStyles.join("; "),
        hover: hoverStyles.join("; "),
    };
}

/**
 * Gera estilos CSS para hover do botão CTA baseado no efeito selecionado
 * intensity: 0.15-1 (mapeado de 10-100 do slider)
 *
 * Efeitos disponíveis:
 * - darken: Escurece o botão e eleva
 * - lighten: Clareia o botão e eleva
 * - scale: Aumenta de tamanho
 * - glow: Brilho neon ao redor
 * - shadow: Sombra elevada
 * - pulse: Animação de pulso
 * - shine: Brilho que passa por cima
 */
function generateButtonHoverStyles(
    effect: string,
    buttonColor: string,
    buttonTextColor: string,
    buttonVariant: string,
    intensity: number
): HoverStyleResult {
    const baseStyles: string[] = [];
    const hoverStyles: string[] = [];

    switch (effect) {
        case "darken": {
            // Escurecer com elevação suave
            const darkenAmount = 0.10 + (intensity * 0.25);
            const darkerColor = adjustColor(buttonColor, darkenAmount, false);
            if (buttonVariant === "solid") {
                hoverStyles.push(`background-color: ${darkerColor} !important`);
            } else {
                hoverStyles.push(`border-color: ${darkerColor} !important`);
                hoverStyles.push(`color: ${darkerColor} !important`);
            }
            const translateY = Math.round(1 + intensity * 3);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }
        case "lighten": {
            // Clarear com elevação
            const lightenAmount = 0.10 + (intensity * 0.25);
            const lighterColor = adjustColor(buttonColor, lightenAmount, true);
            if (buttonVariant === "solid") {
                hoverStyles.push(`background-color: ${lighterColor} !important`);
            } else {
                hoverStyles.push(`border-color: ${lighterColor} !important`);
                hoverStyles.push(`color: ${lighterColor} !important`);
            }
            const translateY = Math.round(1 + intensity * 2);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }
        case "scale": {
            // Escala suave
            const scale = 1.05 + (intensity * 0.07);
            hoverStyles.push(`transform: scale(${scale.toFixed(2)}) !important`);
            hoverStyles.push(`position: relative !important`);
            hoverStyles.push(`z-index: 10 !important`);
            break;
        }
        case "glow": {
            // Brilho neon com múltiplas camadas
            const glowSize1 = Math.round(6 + (intensity * 10));
            const glowSize2 = Math.round(12 + (intensity * 20));
            const glowSize3 = Math.round(24 + (intensity * 30));
            const shadow1 = `0 0 ${glowSize1}px ${hexToRgba(buttonColor, 0.8)}`;
            const shadow2 = `0 0 ${glowSize2}px ${hexToRgba(buttonColor, 0.5)}`;
            const shadow3 = `0 0 ${glowSize3}px ${hexToRgba(buttonColor, 0.3)}`;
            hoverStyles.push(`box-shadow: ${shadow1}, ${shadow2}, ${shadow3} !important`);
            break;
        }
        case "shadow": {
            // Sombra elevada dramática
            const shadowY = Math.round(4 + (intensity * 8));
            const shadowBlur = Math.round(12 + (intensity * 16));
            const shadowOpacity = 0.25 + (intensity * 0.30);
            hoverStyles.push(`box-shadow: 0 ${shadowY}px ${shadowBlur}px -2px ${hexToRgba(buttonColor, shadowOpacity)} !important`);
            const translateY = Math.round(2 + intensity * 3);
            hoverStyles.push(`transform: translateY(-${translateY}px) !important`);
            break;
        }
        case "pulse": {
            // Efeito de pulso com sombra animada
            const pulseSize = Math.round(8 + (intensity * 12));
            baseStyles.push(`animation: none !important`);
            hoverStyles.push(`animation: sg-btn-pulse 1s ease-in-out infinite !important`);
            hoverStyles.push(`--pulse-color: ${hexToRgba(buttonColor, 0.5)} !important`);
            hoverStyles.push(`--pulse-size: ${pulseSize}px !important`);
            break;
        }
        case "shine": {
            // Brilho que passa por cima do botão
            baseStyles.push(`position: relative !important`);
            baseStyles.push(`overflow: hidden !important`);
            // O pseudo-elemento ::before será adicionado via CSS global
            hoverStyles.push(`--shine-active: 1 !important`);
            break;
        }
        default: {
            // Fallback para darken
            const darkerColor = adjustColor(buttonColor, 0.15, false);
            hoverStyles.push(`background-color: ${darkerColor} !important`);
            hoverStyles.push(`transform: translateY(-2px) !important`);
        }
    }

    return {
        base: baseStyles.join("; "),
        hover: hoverStyles.join("; "),
    };
}

// ============================================================================
// NAVBAR STYLE RESOLVER
// ============================================================================

/**
 * Resolved styles for navbar components
 */
export interface NavbarResolvedStyles {
    /** Styles for the nav element */
    nav: string;
    /** Styles for navigation links */
    link: string;
    /** Styles for the CTA button */
    button: string;
    /** Styles for the brand text */
    brandText: string;
    /** Styles for dropdown container */
    dropdown: string;
    /** Styles for dropdown items */
    dropdownItem: string;
    /** Dynamic CSS block for hover states and media queries */
    css: string;
}

/**
 * Default navbar styles (garantem aparência mesmo sem CSS externo)
 */
const navbarDefaults = {
    bg: "#ffffff",
    opacity: 100,
    borderRadius: 0,
    shadow: "sm" as const,
    linkColor: "#1f2937",
    linkFontSize: "md" as const,
    buttonColor: "#3b82f6",
    buttonTextColor: "#ffffff",
    buttonBorderRadius: 8,
    buttonVariant: "solid" as const,
};

/**
 * Resolve button styles based on variant
 */
function resolveButtonStyle(
    variant: string,
    bgColor: string,
    textColor: string,
    borderRadius: number,
    padding: string = "0.5rem 1rem",
    fontSize: string = "1rem",
): string {
    const baseStyles = [
        `padding: ${padding}`,
        `font-size: ${fontSize}`,
        `border-radius: ${borderRadius}px`,
        "text-decoration: none",
        "font-weight: 500",
        "display: inline-block",
        "transition: all 0.2s ease",
        "cursor: pointer",
        "position: relative", // Needed for shine effect
        "overflow: hidden",   // Needed for shine effect
    ];

    switch (variant) {
        case "outline":
            return [
                ...baseStyles,
                "background-color: transparent",
                `color: ${bgColor}`,
                `border: 2px solid ${bgColor}`,
            ].join("; ");

        case "ghost":
            return [
                ...baseStyles,
                "background-color: transparent",
                `color: ${bgColor}`,
                "border: none",
            ].join("; ");

        case "solid":
        default:
            return [
                ...baseStyles,
                `background-color: ${bgColor}`,
                `color: ${textColor}`,
                "border: none",
            ].join("; ");
    }
}

/**
 * Resolve all navbar styles from block props
 *
 * @param props - Block props from navbar
 * @param blockId - Unique block ID for scoping CSS
 * @param theme - Theme tokens for palette colors
 * @returns Resolved inline style strings and dynamic CSS
 */
export function resolveNavbarStyles(props: Record<string, any>, blockId: string, theme?: any): NavbarResolvedStyles {
    // Use theme colors if available, otherwise use defaults
    const themePrimaryColor = theme?.colors?.primary || navbarDefaults.buttonColor;
    const themePrimaryText = theme?.colors?.primaryText || navbarDefaults.buttonTextColor;

    // Priorizar menuLinkColor da paleta (cor específica para links do menu)
    // menuLinkColor já vem otimizado para contraste, então não precisa verificação adicional
    const themeLinkColor = theme?.colors?.menuLinkColor || theme?.colors?.primary || navbarDefaults.linkColor;

    // Usar a cor do tema diretamente (menuLinkColor já foi calculado para ter contraste adequado)
    const safeLinkColor = themeLinkColor;

    // Merge props with defaults (theme-aware)
    const {
        opacity = navbarDefaults.opacity,
        blurOpacity = 15,
        borderRadius = navbarDefaults.borderRadius,
        shadow = navbarDefaults.shadow,
        linkColor = safeLinkColor,
        linkFontSize = navbarDefaults.linkFontSize,
        linkHoverEffect = "background",
        linkHoverIntensity = 50,
        buttonColor = themePrimaryColor,
        buttonTextColor = themePrimaryText,
        buttonBorderRadius = navbarDefaults.buttonBorderRadius,
        buttonVariant = navbarDefaults.buttonVariant,
        buttonHoverEffect = "darken",
        buttonHoverIntensity = 50,
        floating = false,
        sticky = true,
        transparent = false,
        variation = "navbar-classic",
    } = props;

    const isMinimal = variation === "navbar-minimal";

    // Resolve nav styles
    const navStyles: string[] = [];
    const cssRules: string[] = [];

    // Fixed navbar height - all navbars should have the same height
    navStyles.push("height: 4.5rem");

    // Determine effective background
    const rawBg = props.bg;
    const effectiveBg = rawBg !== undefined ? rawBg : (transparent ? "transparent" : navbarDefaults.bg);

    // Apply background
    if (effectiveBg === "transparent") {
        navStyles.push("background-color: transparent");
    } else {
        const isGradient = effectiveBg.includes("gradient") ||
            effectiveBg.includes("linear") ||
            effectiveBg.includes("radial");

        if (isGradient) {
            navStyles.push(`background: ${effectiveBg}`);
            if (opacity < 100) {
                navStyles.push(`opacity: ${opacity / 100}`);
            }
        } else {
            // Apply background with user-chosen opacity
            const bgWithOpacity = applyOpacityToColor(effectiveBg, opacity);
            navStyles.push(`background-color: ${bgWithOpacity}`);
        }
    }

    // Apply blur intensity as CSS variable for glass effect (ALWAYS, independent of positioning)
    // Convert 0-100 to 0px-30px blur amount
    const blurAmount = Math.round((blurOpacity / 100) * 30); // 0-30px
    const blurBgOpacity = blurOpacity / 100; // 0-1 opacity for frosted glass effect (0% to 100%)
    navStyles.push(`--navbar-blur-amount: ${blurAmount}px`);
    navStyles.push(`--navbar-blur-opacity: ${blurBgOpacity}`);

    // Layout specific logic (positioning, not styles)
    if (floating) {
        // Floating navbar - fixed with margins
        navStyles.push("position: fixed");
        navStyles.push("top: 20px");
        navStyles.push("left: 20px");
        navStyles.push("right: 20px");
        navStyles.push("width: calc(100% - 40px)");
        navStyles.push("z-index: 1000");

        const effectiveRadius = Math.max(borderRadius, 12);
        if (effectiveRadius > 0) {
            navStyles.push(`border-radius: ${effectiveRadius}px`);
        }
    } else if (sticky) {
        // Sticky navbar - fixed at top, scrolls content only
        console.log('[NavbarStyles] Applying fixed position: sticky=true, floating=false');
        navStyles.push("position: fixed");
        navStyles.push("top: 0");
        navStyles.push("left: 0");
        navStyles.push("right: 0");
        navStyles.push("width: 100%");
        navStyles.push("z-index: 1000");

        if (borderRadius > 0) {
            navStyles.push(`border-bottom-left-radius: ${borderRadius}px`);
            navStyles.push(`border-bottom-right-radius: ${borderRadius}px`);
        }
    } else {
        // Non-sticky navbar - absolute position, scrolls with page but stays on top of hero
        console.log('[NavbarStyles] Applying absolute position: sticky=false, floating=false');
        navStyles.push("position: absolute");
        navStyles.push("top: 0");
        navStyles.push("left: 0");
        navStyles.push("right: 0");
        navStyles.push("width: 100%");
        navStyles.push("z-index: 1000");

        if (borderRadius > 0) {
            navStyles.push(`border-bottom-left-radius: ${borderRadius}px`);
            navStyles.push(`border-bottom-right-radius: ${borderRadius}px`);
        }
    }

    // Shadow
    // For classic/minimal, shadow behaves normally
    const shadowValue = shadowValues[shadow] || shadowValues.sm;
    if (shadow !== "none") {
        navStyles.push(`box-shadow: ${shadowValue}`);
    }

    // Padding adjustments
    if (isMinimal) {
        navStyles.push("padding: 0.5rem 1rem"); // Smaller padding
    } else {
        // handled by exportHtml defaults usually, but we can enforce
    }

    // Resolve link styles
    // Transição mais longa para efeitos animados de underline
    const transitionDuration = (linkHoverEffect === "underline" || linkHoverEffect === "underline-center" || linkHoverEffect === "slide-bg")
        ? "0.3s"
        : "0.2s";
    const linkStyles = [
        `color: ${linkColor}`,
        `font-size: ${isMinimal ? fontSizes.sm : (fontSizes[linkFontSize] || fontSizes.md)}`,
        "text-decoration: none",
        "font-weight: 500",
        `transition: all ${transitionDuration} ease`,
        "padding: 0.5rem 0.75rem", // Add padding for hover effect
        "border-radius: 6px",         // Rounded for hover effect
        "display: inline-block",      // Needed for padding/transform
    ];

    // Hover Effects CSS
    // Generate a unique selector based on blockId
    const scope = `[data-block-id="${blockId}"]`;

    // Get linkHoverColor from props (default to buttonColor for backwards compatibility)
    const linkHoverColor = props.linkHoverColor || buttonColor;

    // Calcular intensidade normalizada (0.15-1)
    // Mapeia 10-100 para 0.15-1 (sempre ter pelo menos 15% de intensidade para efeito visível)
    // Fórmula: 0.15 + ((value - 10) / 90) * 0.85
    const linkIntensity = 0.15 + Math.max(0, (linkHoverIntensity - 10) / 90) * 0.85;
    const btnIntensity = 0.15 + Math.max(0, (buttonHoverIntensity - 10) / 90) * 0.85;

    // Link Hover - gerar CSS baseado no efeito selecionado
    const linkHoverResult = generateLinkHoverStyles(
        linkHoverEffect,
        linkHoverColor,
        linkIntensity
    );

    // Adicionar estilos base se necessário (para animações como underline)
    if (linkHoverResult.base) {
        cssRules.push(`
    ${scope} .sg-navbar__link {
      ${linkHoverResult.base}
    }
  `);
    }

    cssRules.push(`
    ${scope} .sg-navbar__link:hover {
      ${linkHoverResult.hover}
    }
  `);

    // Button Hover - gerar CSS baseado no efeito selecionado
    const buttonHoverResult = generateButtonHoverStyles(
        buttonHoverEffect,
        buttonColor,
        buttonTextColor,
        buttonVariant,
        btnIntensity
    );

    // Adicionar estilos base se necessário (para animações como pulse, shine)
    if (buttonHoverResult.base) {
        cssRules.push(`
    ${scope} .sg-navbar__btn {
      ${buttonHoverResult.base}
    }
  `);
    }

    cssRules.push(`
    ${scope} .sg-navbar__btn:hover {
      ${buttonHoverResult.hover}
    }
  `);

    // Adicionar keyframes para animações (pulse, shine)
    cssRules.push(`
    @keyframes sg-btn-pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 var(--pulse-color, rgba(59, 130, 246, 0.5));
      }
      50% {
        box-shadow: 0 0 0 var(--pulse-size, 10px) transparent;
      }
    }

    /* Shine effect pseudo-element */
    ${scope} .sg-navbar__btn::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.5s ease;
      pointer-events: none;
    }

    ${scope} .sg-navbar__btn:hover::before {
      left: 100%;
    }
  `);

    // Resolve button styles
    // Minimal forces small button look if not customized? 
    // User asked "Minimal ... botões SM". 
    // We can't easily change the 'variant' here if it's passed as prop, but we can adjust padding in style
    let btnPadding = "0.5rem 1rem";
    let btnSize = "1rem";

    if (isMinimal) {
        btnPadding = "0.25rem 0.75rem";
        btnSize = "0.875rem";
    }

    const buttonStyle = resolveButtonStyle(
        buttonVariant,
        buttonColor,
        buttonTextColor,
        buttonBorderRadius,
        btnPadding,
        btnSize
    );

    // Resolve brand text styles
    const brandTextStyles = [
        `color: ${buttonColor}`,
        "font-weight: 700",
        "font-size: 1.25rem",
    ];

    // Resolve dropdown styles - herda EXATAMENTE a mesma opacidade/blur da navbar
    // NOTA: backdrop-filter é aplicado via CSS: .sg-navbar--sticky .sg-navbar-dropdown
    const dropdownBg = applyOpacityToColor(effectiveBg === "transparent" ? navbarDefaults.bg : effectiveBg, opacity);

    const dropdownStyles = [
        // Background via CSS variable - o ::before usa essa variável e começa após o hover bridge
        `--dropdown-bg: ${dropdownBg}`,
        `--dropdown-radius: ${borderRadius}px`,
        `border-radius: ${borderRadius}px`,
        "min-width: 220px",
        "padding: 0.5rem 0",
    ];

    // Resolve dropdown item styles - herda linkColor
    const linkFontSizeValue = fontSizes[linkFontSize] || fontSizes.md;
    const dropdownItemStyles = [
        `color: ${linkColor}`,
        `font-size: ${linkFontSizeValue}`,
        "text-decoration: none",
        "font-weight: 500",
        "padding: 0.75rem 1.25rem",
        "display: block",
        "white-space: nowrap",
        "transition: background-color 0.2s ease, color 0.2s ease",
    ];

    // Dropdown item hover CSS - usa mesma lógica dos links com fundo sutil
    const dropdownHoverBg = linkHoverColor.startsWith('#')
        ? `${linkHoverColor}15` // Adiciona 15 no final (opacity ~8%)
        : linkHoverColor.replace('rgb(', 'rgba(').replace(')', ', 0.08)');

    cssRules.push(`
    ${scope} .sg-navbar-dropdown__item:hover {
      background-color: ${dropdownHoverBg} !important;
      color: ${linkHoverColor} !important;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
  `);

    return {
        nav: navStyles.join("; "),
        link: linkStyles.join("; "),
        button: buttonStyle,
        brandText: brandTextStyles.join("; "),
        dropdown: dropdownStyles.join("; "),
        dropdownItem: dropdownItemStyles.join("; "),
        css: cssRules.join("\n"),
    };
}

/**
 * Resolve hero button styles based on theme
 */
export function resolveHeroButtonStyles(theme?: any, blockId?: string): { primary: string; secondary: string; css: string } {
    const primaryColor = theme?.colors?.primary || "#3b82f6";
    const primaryText = theme?.colors?.primaryText || "#ffffff";

    // Calcular versão mais escura para hover (15% mais escuro)
    let primaryHover = primaryColor;
    if (primaryColor.startsWith('#')) {
        const hex = primaryColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const darker = (val: number) => Math.max(0, Math.floor(val * 0.85));
        primaryHover = `rgb(${darker(r)}, ${darker(g)}, ${darker(b)})`;
    }

    const primaryStyles = [
        `background-color: ${primaryColor}`,
        `color: ${primaryText}`,
        "padding: 0.875rem 2rem",
        "border-radius: 0.5rem",
        "font-weight: 600",
        "font-size: 1rem",
        "text-decoration: none",
        "display: inline-block",
        "transition: all 0.2s ease",
        "border: none",
    ].join("; ");

    const secondaryStyles = [
        "background-color: transparent",
        `color: ${primaryColor}`,
        "padding: 0.875rem 2rem",
        "border-radius: 0.5rem",
        "font-weight: 600",
        "font-size: 1rem",
        "text-decoration: none",
        "display: inline-block",
        "transition: all 0.2s ease",
        `border: 2px solid ${primaryColor}`,
    ].join("; ");

    const scope = blockId ? `[data-block-id="${blockId}"]` : "";
    const css = `
        ${scope} .sg-hero__btn--primary:hover {
            background-color: ${primaryHover};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px -4px ${primaryColor}40;
        }
        ${scope} .sg-hero__btn--secondary:hover {
            background-color: ${primaryColor}10;
            transform: translateY(-2px);
            border-color: ${primaryHover};
        }
    `;

    return {
        primary: primaryStyles,
        secondary: secondaryStyles,
        css,
    };
}

/**
 * Convert a color to rgba with opacity
 * Supports hex (#fff, #ffffff) and rgb() formats
 */
export function applyOpacityToColor(color: string, opacity: number): string {
    if (opacity >= 100) return color;

    const alpha = opacity / 100;

    // Handle hex colors
    if (color.startsWith("#")) {
        let hex = color.slice(1);

        // Convert 3-char hex to 6-char
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Handle rgb() colors
    if (color.startsWith("rgb(")) {
        const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
        if (match) {
            return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
        }
    }

    // Handle rgba() - just update alpha
    if (color.startsWith("rgba(")) {
        return color.replace(/,\s*[\d.]+\s*\)$/, `, ${alpha})`);
    }

    // Fallback: use CSS opacity (not ideal for backgrounds)
    return color;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert style object to inline style string
 */
export function styleObjectToString(styles: Record<string, string | number | undefined>): string {
    return Object.entries(styles)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => {
            // Convert camelCase to kebab-case
            const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
            return `${cssKey}: ${value}`;
        })
        .join("; ");
}

/**
 * Merge multiple style strings
 */
export function mergeStyles(...styles: (string | undefined)[]): string {
    return styles
        .filter(Boolean)
        .join("; ")
        .replace(/;+/g, ";")
        .replace(/;\s*$/, "");
}

/**
 * Convert inline style string to React CSSProperties object
 */
export function styleStringToReactStyle(styleString: string): any {
    if (!styleString) return {};

    return styleString
        .split(";")
        .reduce((acc, rule) => {
            const [rawKey, rawValue] = rule.split(":");
            const key = rawKey?.trim();
            const value = rawValue?.trim();

            if (key && value) {
                // ✅ Não camelCase CSS variables (React precisa da chave EXATA)
                if (key.startsWith("--")) {
                    acc[key] = value;
                } else {
                    // Convert kebab-case to camelCase
                    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    acc[camelKey] = value;
                }
            }
            return acc;
        }, {} as any);
}
