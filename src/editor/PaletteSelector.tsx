/**
 * Palette Selector
 * Seletor de paletas de cores para o editor
 */

import { cn } from '../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface ColorPalette {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface?: string
  text: string
  gradient: string[]
}

// ============================================================================
// Palettes
// ============================================================================

export const colorPalettes: ColorPalette[] = [
  // Azuis
  {
    name: 'Blue Serenity',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    gradient: ['#3b82f6', '#60a5fa', '#93c5fd'],
  },
  {
    name: 'Ocean Deep',
    primary: '#0284c7',
    secondary: '#0369a1',
    accent: '#38bdf8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    gradient: ['#0284c7', '#0369a1', '#38bdf8'],
  },
  // Verdes
  {
    name: 'Emerald',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: '#166534',
    gradient: ['#10b981', '#059669', '#34d399'],
  },
  {
    name: 'Forest',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#4ade80',
    background: '#052e16',
    surface: '#14532d',
    text: '#f0fdf4',
    gradient: ['#22c55e', '#16a34a', '#4ade80'],
  },
  // Roxos
  {
    name: 'Purple Dream',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#ffffff',
    surface: '#faf5ff',
    text: '#4c1d95',
    gradient: ['#8b5cf6', '#7c3aed', '#a78bfa'],
  },
  {
    name: 'Midnight',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c084fc',
    background: '#1e1b4b',
    surface: '#312e81',
    text: '#f5f3ff',
    gradient: ['#a855f7', '#9333ea', '#c084fc'],
  },
  // Laranjas/Amarelos
  {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#ffffff',
    surface: '#fff7ed',
    text: '#7c2d12',
    gradient: ['#f97316', '#ea580c', '#fb923c'],
  },
  {
    name: 'Golden',
    primary: '#eab308',
    secondary: '#ca8a04',
    accent: '#facc15',
    background: '#1a1a1a',
    surface: '#262626',
    text: '#fefce8',
    gradient: ['#eab308', '#ca8a04', '#facc15'],
  },
  // Vermelhos/Rosas
  {
    name: 'Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185',
    background: '#ffffff',
    surface: '#fff1f2',
    text: '#881337',
    gradient: ['#f43f5e', '#e11d48', '#fb7185'],
  },
  {
    name: 'Berry',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f472b6',
    background: '#500724',
    surface: '#831843',
    text: '#fdf2f8',
    gradient: ['#ec4899', '#db2777', '#f472b6'],
  },
  // Neutros
  {
    name: 'Slate Modern',
    primary: '#475569',
    secondary: '#334155',
    accent: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    gradient: ['#475569', '#334155', '#64748b'],
  },
  {
    name: 'Dark Mode',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#818cf8',
    background: '#0f0f0f',
    surface: '#1a1a1a',
    text: '#fafafa',
    gradient: ['#6366f1', '#4f46e5', '#818cf8'],
  },
]

// ============================================================================
// Component
// ============================================================================

interface PaletteSelectorProps {
  selectedPalette?: ColorPalette
  onPaletteChange: (palette: ColorPalette) => void
}

export function PaletteSelector({
  selectedPalette,
  onPaletteChange,
}: PaletteSelectorProps) {
  const isSelected = (palette: ColorPalette) => {
    return selectedPalette?.name === palette.name
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {colorPalettes.map((palette) => (
        <button
          key={palette.name}
          onClick={() => onPaletteChange(palette)}
          className={cn(
            'rounded-lg cursor-pointer transition-all p-2',
            'flex flex-col items-center gap-1.5',
            'border-2',
            isSelected(palette)
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
            'bg-white dark:bg-gray-800',
            'hover:scale-[1.02] active:scale-[0.98]'
          )}
          title={palette.name}
        >
          <div className="w-full h-8 rounded-md flex overflow-hidden mb-1.5">
            {palette.gradient.map((color, i) => (
              <span
                key={i}
                className="flex-1"
                style={{ background: color }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight px-1">
            {palette.name}
          </span>
        </button>
      ))}
    </div>
  )
}
