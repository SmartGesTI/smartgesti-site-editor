/**
 * Hover Effects - Color Utilities
 *
 * Funções para manipulação de cores usadas nos efeitos de hover.
 */

/**
 * Converte cor hex para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
export function hexToRgba(hex: string, alpha: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
}

/**
 * Ajusta cor (escurecer ou clarear)
 *
 * @param color - Cor hex
 * @param amount - Quantidade de ajuste (0-1)
 * @param lighten - true para clarear, false para escurecer
 */
export function adjustColor(color: string, amount: number, lighten: boolean): string {
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
 * Normaliza intensidade de 10-100 para 0.15-1
 * Garante que mesmo com intensidade mínima (10), o efeito seja visível (15%)
 */
export function normalizeIntensity(intensity: number): number {
    return 0.15 + Math.max(0, (intensity - 10) / 90) * 0.85;
}
