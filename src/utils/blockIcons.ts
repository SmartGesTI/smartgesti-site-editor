/**
 * Mapeamento de ícones para cada tipo de bloco
 * Usado no BlockPalette e BlockHeader
 */

import { BlockType } from "../engine";

const BLOCK_ICONS: Record<string, string> = {
  // Layout
  container: "📦",
  stack: "📚",
  grid: "⊞",
  box: "☐",
  section: "▦",
  spacer: "↕",

  // Conteúdo
  heading: "H",
  text: "T",
  image: "🖼️",
  video: "🎥",
  icon: "★",
  badge: "🎟️",
  avatar: "👤",
  socialLinks: "🌐",

  // Interativos
  button: "🔘",
  link: "🔗",
  divider: "─",
  card: "🃏",

  // Seções
  hero: "🏆",
  feature: "✨",
  featureGrid: "⭐",
  pricing: "💰",
  pricingCard: "💳",
  testimonial: "💬",
  testimonialGrid: "🗨️",
  courseCardGrid: "📚",
  categoryCardGrid: "📂",
  faq: "❓",
  faqItem: "📝",
  cta: "📣",
  stats: "📊",
  statItem: "#",
  logoCloud: "🏂",
  navbar: "☰",
  footer: "📋",

  // Formulários
  form: "📋",
  input: "✏️",
  textarea: "📑",
  formSelect: "👇",
};

/**
 * Retorna o ícone emoji para um tipo de bloco
 */
export function getBlockIcon(type: BlockType): string {
  return BLOCK_ICONS[type] || "•";
}

/**
 * Retorna as iniciais do nome do bloco (fallback se não houver ícone)
 */
export function getBlockInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
