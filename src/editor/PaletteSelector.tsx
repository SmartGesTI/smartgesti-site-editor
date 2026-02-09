/**
 * Palette Selector
 * Seletor de paletas de cores para o editor
 */

import { cn } from "../utils/cn";

// ============================================================================
// Types
// ============================================================================

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface?: string;
  text: string;
  linkColor?: string; // Cor específica para links em geral (dropdowns, etc)
  menuLinkColor?: string; // Cor específica para links do menu navbar (derivada do primary)
  gradient: string[];

  // Hero gradient overrides (derivados automaticamente se ausentes)
  heroGradientStart?: string;
  heroGradientEnd?: string;
}

// ============================================================================
// Palettes (text e background devem ter contraste adequado; evitar text === background)
// ============================================================================

export const colorPalettes: ColorPalette[] = [
  // Azuis
  {
    name: "Blue Serenity",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#93c5fd",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    linkColor: "#1e40af", // Links gerais - azul escuro
    menuLinkColor: "#2563eb", // Links do menu - tom do primary mais escuro
    gradient: ["#3b82f6", "#60a5fa", "#93c5fd"],
    heroGradientStart: "#1e3a5f",
    heroGradientEnd: "#2d5a8e",
  },
  {
    name: "Ocean Deep",
    primary: "#0284c7",
    secondary: "#0369a1",
    accent: "#38bdf8",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    linkColor: "#7dd3fc", // Links gerais - azul claro
    menuLinkColor: "#38bdf8", // Links do menu - tom do primary mais claro
    gradient: ["#0284c7", "#0369a1", "#38bdf8"],
    heroGradientStart: "#0a1628",
    heroGradientEnd: "#0c2d4d",
  },
  // Verdes
  {
    name: "Emerald",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
    background: "#ffffff",
    surface: "#f0fdf4",
    text: "#166534",
    linkColor: "#047857", // Links gerais - verde escuro
    menuLinkColor: "#059669", // Links do menu - tom do primary mais escuro
    gradient: ["#10b981", "#059669", "#34d399"],
    heroGradientStart: "#0d3320",
    heroGradientEnd: "#1a5c3a",
  },
  {
    name: "Forest",
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#4ade80",
    background: "#052e16",
    surface: "#14532d",
    text: "#f0fdf4",
    linkColor: "#86efac", // Links gerais - verde claro
    menuLinkColor: "#4ade80", // Links do menu - tom do primary mais claro
    gradient: ["#22c55e", "#16a34a", "#4ade80"],
    heroGradientStart: "#0a1f12",
    heroGradientEnd: "#153d25",
  },
  // Roxos
  {
    name: "Purple Dream",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#a78bfa",
    background: "#ffffff",
    surface: "#faf5ff",
    text: "#4c1d95",
    linkColor: "#6d28d9", // Links gerais - roxo escuro
    menuLinkColor: "#7c3aed", // Links do menu - tom do primary mais escuro
    gradient: ["#8b5cf6", "#7c3aed", "#a78bfa"],
    heroGradientStart: "#2d1b69",
    heroGradientEnd: "#4c2889",
  },
  {
    name: "Midnight",
    primary: "#a855f7",
    secondary: "#9333ea",
    accent: "#c084fc",
    background: "#1e1b4b",
    surface: "#312e81",
    text: "#f5f3ff",
    linkColor: "#d8b4fe", // Links gerais - roxo claro
    menuLinkColor: "#c084fc", // Links do menu - tom do primary mais claro
    gradient: ["#a855f7", "#9333ea", "#c084fc"],
    heroGradientStart: "#1e1b4b",
    heroGradientEnd: "#312e81",
  },
  // Laranjas/Amarelos
  {
    name: "Sunset",
    primary: "#f97316",
    secondary: "#ea580c",
    accent: "#fb923c",
    background: "#ffffff",
    surface: "#fff7ed",
    text: "#7c2d12",
    linkColor: "#c2410c", // Links gerais - laranja escuro
    menuLinkColor: "#ea580c", // Links do menu - tom do primary mais escuro
    gradient: ["#f97316", "#ea580c", "#fb923c"],
    heroGradientStart: "#4a1d0a",
    heroGradientEnd: "#7a3012",
  },
  {
    name: "Golden",
    primary: "#eab308",
    secondary: "#ca8a04",
    accent: "#facc15",
    background: "#1a1a1a",
    surface: "#262626",
    text: "#fefce8",
    linkColor: "#fde047", // Links gerais - amarelo claro
    menuLinkColor: "#fde047", // Links do menu - amarelo bem claro para contraste
    gradient: ["#eab308", "#ca8a04", "#facc15"],
    heroGradientStart: "#1a1500",
    heroGradientEnd: "#3d3005",
  },
  // Vermelhos/Rosas
  {
    name: "Rose",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    background: "#ffffff",
    surface: "#fff1f2",
    text: "#881337",
    linkColor: "#be123c", // Links gerais - rosa escuro
    menuLinkColor: "#e11d48", // Links do menu - tom do primary mais escuro
    gradient: ["#f43f5e", "#e11d48", "#fb7185"],
    heroGradientStart: "#4a0a1a",
    heroGradientEnd: "#7a1230",
  },
  {
    name: "Berry",
    primary: "#ec4899",
    secondary: "#db2777",
    accent: "#f472b6",
    background: "#500724",
    surface: "#831843",
    text: "#fdf2f8",
    linkColor: "#fbbf24", // Links gerais - amarelo para contraste
    menuLinkColor: "#fda4d0", // Links do menu - rosa bem claro para contraste
    gradient: ["#ec4899", "#db2777", "#f472b6"],
    heroGradientStart: "#3d0724",
    heroGradientEnd: "#6b1040",
  },
  // Neutros
  {
    name: "Slate Modern",
    primary: "#475569",
    secondary: "#334155",
    accent: "#64748b",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    linkColor: "#1e293b", // Links gerais - cinza escuro
    menuLinkColor: "#334155", // Links do menu - tom do primary mais escuro
    gradient: ["#475569", "#334155", "#64748b"],
    heroGradientStart: "#1a1a2e",
    heroGradientEnd: "#2d2d4a",
  },
  {
    name: "Dark Mode",
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#818cf8",
    background: "#0f0f0f",
    surface: "#1a1a1a",
    text: "#fafafa",
    linkColor: "#a5b4fc", // Links gerais - índigo claro
    menuLinkColor: "#818cf8", // Links do menu - tom do primary mais claro
    gradient: ["#6366f1", "#4f46e5", "#818cf8"],
    heroGradientStart: "#0f0a2e",
    heroGradientEnd: "#1a1552",
  },
  // Template-specific palettes
  {
    name: "Indigo & Cyan",
    primary: "#6366f1",
    secondary: "#0ea5e9",
    accent: "#f97316",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    linkColor: "#4338ca",
    menuLinkColor: "#6366f1",
    gradient: ["#6366f1", "#0ea5e9", "#f97316"],
    heroGradientStart: "#3730a3",
    heroGradientEnd: "#0369a1",
  },
  {
    name: "Blue Academy",
    primary: "#2563eb",
    secondary: "#1d4ed8",
    accent: "#3b82f6",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    linkColor: "#1e40af",
    menuLinkColor: "#2563eb",
    gradient: ["#2563eb", "#1d4ed8", "#3b82f6"],
    heroGradientStart: "#1e3a8a",
    heroGradientEnd: "#1e40af",
  },
  {
    name: "Indigo Amber",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    linkColor: "#4338ca",
    menuLinkColor: "#4f46e5",
    gradient: ["#4f46e5", "#6366f1", "#f59e0b"],
    heroGradientStart: "#312e81",
    heroGradientEnd: "#3730a3",
  },
  {
    name: "Indigo Pro",
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#8b5cf6",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    linkColor: "#4338ca",
    menuLinkColor: "#6366f1",
    gradient: ["#6366f1", "#4f46e5", "#8b5cf6"],
    heroGradientStart: "#1e1b4b",
    heroGradientEnd: "#312e81",
  },
];

// ============================================================================
// Utilities
// ============================================================================

export function findPaletteByName(name: string): ColorPalette | undefined {
  return colorPalettes.find(p => p.name === name);
}

// ============================================================================
// Component
// ============================================================================

interface PaletteSelectorProps {
  selectedPalette?: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
}

export function PaletteSelector({
  selectedPalette,
  onPaletteChange,
}: PaletteSelectorProps) {
  const isSelected = (palette: ColorPalette) => {
    return selectedPalette?.name === palette.name;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {colorPalettes.map((palette) => (
        <button
          key={palette.name}
          onClick={() => onPaletteChange(palette)}
          className={cn(
            "rounded-lg cursor-pointer transition-all p-2",
            "flex flex-col items-center gap-1.5",
            "border-2",
            isSelected(palette)
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
            "bg-white dark:bg-gray-800",
            "hover:scale-[1.02] active:scale-[0.98]",
          )}
          title={palette.name}
        >
          <div className="w-full h-8 rounded-md flex overflow-hidden mb-1.5">
            {palette.gradient.map((color, i) => (
              <span key={i} className="flex-1" style={{ background: color }} />
            ))}
            {palette.heroGradientStart && (
              <span className="flex-1" style={{ background: palette.heroGradientStart }} />
            )}
            {palette.heroGradientEnd && (
              <span className="flex-1" style={{ background: palette.heroGradientEnd }} />
            )}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight px-1">
            {palette.name}
          </span>
        </button>
      ))}
    </div>
  );
}
