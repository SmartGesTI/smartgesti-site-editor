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
        "cursor: pointer", // Ensure pointer cursor
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
        buttonColor = themePrimaryColor,
        buttonTextColor = themePrimaryText,
        buttonBorderRadius = navbarDefaults.buttonBorderRadius,
        buttonVariant = navbarDefaults.buttonVariant,
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

    // Apply blur intensity as CSS variable for glass effect
    // Convert 0-100 to 0px-30px blur amount
    if (sticky && !floating) {
        const blurAmount = Math.round((blurOpacity / 100) * 30); // 0-30px
        const blurBgOpacity = (blurOpacity / 100) * 0.3; // 0-0.3 additional opacity for frosted glass effect
        navStyles.push(`--navbar-blur-amount: ${blurAmount}px`);
        navStyles.push(`--navbar-blur-opacity: ${blurBgOpacity}`);
    }

    // Layout specific logic
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
    const linkStyles = [
        `color: ${linkColor}`,
        `font-size: ${isMinimal ? fontSizes.sm : (fontSizes[linkFontSize] || fontSizes.md)}`,
        "text-decoration: none",
        "font-weight: 500",
        "transition: all 0.2s ease",
        "padding: 0.5rem 0.75rem", // Add padding for hover effect
        "border-radius: 6px",         // Rounded for hover effect
        "display: inline-block",      // Needed for padding/transform
    ];

    // Hover Effects CSS
    // Generate a unique selector based on blockId
    const scope = `[data-block-id="${blockId}"]`;

    // Link Hover - usar cor primária com opacity baixa para seguir a paleta
    const primaryWithOpacity = buttonColor.startsWith('#')
        ? `${buttonColor}15` // Adiciona 15 no final (opacity ~8%)
        : buttonColor.replace('rgb(', 'rgba(').replace(')', ', 0.08)');

    cssRules.push(`
    ${scope} .sg-navbar__link:hover {
      background-color: ${primaryWithOpacity};
      color: ${buttonColor};
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }
  `);

    // Button Hover - usar versão mais escura da cor primária
    // Converter hex para RGB e escurecer em 15%
    let buttonHoverColor = buttonColor;
    if (buttonColor.startsWith('#')) {
        // Extrair RGB do hex
        const hex = buttonColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Escurecer 15%
        const darker = (val: number) => Math.max(0, Math.floor(val * 0.85));
        buttonHoverColor = `rgb(${darker(r)}, ${darker(g)}, ${darker(b)})`;
    }

    cssRules.push(`
    ${scope} .sg-navbar__btn:hover {
      background-color: ${buttonHoverColor};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px -2px ${buttonColor}40;
      transition: all 0.2s ease;
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

    return {
        nav: navStyles.join("; "),
        link: linkStyles.join("; "),
        button: buttonStyle,
        brandText: brandTextStyles.join("; "),
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
            const [key, value] = rule.split(":").map(s => s.trim());
            if (key && value) {
                // Convert kebab-case to camelCase
                const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                acc[camelKey] = value;
            }
            return acc;
        }, {} as any);
}
