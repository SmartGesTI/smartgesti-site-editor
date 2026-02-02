/**
 * Converte objeto de estilos para string CSS inline
 */
export function stylesToString(styles: Record<string, string | number>): string {
  return Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      // Converter camelCase para kebab-case
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebabKey}: ${value}`;
    })
    .join("; ");
}

/**
 * Mescla múltiplas strings de estilo CSS inline
 */
export function mergeStyleStrings(...styles: (string | undefined)[]): string {
  return styles
    .filter(Boolean)
    .join("; ")
    .replace(/;\s*;/g, ";") // Remove ponto e vírgula duplicado
    .replace(/;\s*$/, ""); // Remove ponto e vírgula final
}
