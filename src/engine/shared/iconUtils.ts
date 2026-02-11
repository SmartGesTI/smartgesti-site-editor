/**
 * Icon Utilities - Global Icon System
 * Funções para renderizar ícones SVG inline em HTML export e React
 */

/**
 * Path data para cada ícone disponível
 * Sincronizado com ICON_PATHS em hoverEffects/buttonHover.ts
 */
export const ICON_PATHS: Record<string, { path: string; filled?: boolean }> = {
  // Setas e navegação
  "arrow-right": { path: "M5 12h14M12 5l7 7-7 7" },
  "chevron-right": { path: "M9 18l6-6-6-6" },
  "external-link": { path: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" },
  // Ações
  "plus": { path: "M12 5v14M5 12h14" },
  "check": { path: "M20 6L9 17l-5-5" },
  "download": { path: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" },
  "send": { path: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" },
  "play": { path: "M5 3l14 9-14 9V3z", filled: true },
  // Ícones expressivos
  "star": { path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", filled: true },
  "heart": { path: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z", filled: true },
  "zap": { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", filled: true },
  "sparkles": { path: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z", filled: true },
  "rocket": { path: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" },
  "fire": { path: "M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 4-7.5 1-1 2-2.5 2-4.5 0 3 2.5 5 4 6.5 2 2 3 4 3 5.5 0 4.5-3 7-6 7z", filled: true },
  "gift": { path: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" },
  "trophy": { path: "M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V9M14 22V9M18 2H6v7a6 6 0 1012 0V2z" },
  // Comunicação
  "mail": { path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" },
  "phone": { path: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" },
  // Compras e E-commerce
  "cart": { path: "M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" },
  "tag": { path: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" },
  // Interface
  "eye": { path: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" },
  "lock": { path: "M3 11h18v11H3V11zM7 11V7a5 5 0 0110 0v4" },
  "user": { path: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
};

/**
 * Renderiza um ícone SVG inline para uso em HTML export
 * @param iconName - Nome do ícone (ex: "arrow-right", "check", "star")
 * @param size - Tamanho em em (default: 1em para herdar do texto)
 * @param className - Classes CSS opcionais
 * @returns HTML string com SVG inline
 */
export function renderInlineSvgIcon(
  iconName: string,
  size: string = "1em",
  className: string = ""
): string {
  const iconData = ICON_PATHS[iconName];
  if (!iconData) {
    // Fallback para arrow-right se ícone não encontrado
    return renderInlineSvgIcon("arrow-right", size, className);
  }

  const fill = iconData.filled ? "currentColor" : "none";
  const stroke = iconData.filled ? "none" : "currentColor";
  const strokeWidth = iconData.filled ? "0" : "2";

  return `<svg ${className ? `class="${className}"` : ""} width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><path d="${iconData.path}"></path></svg>`;
}

/**
 * Lista de todos os ícones disponíveis
 */
export const AVAILABLE_ICONS = Object.keys(ICON_PATHS);
