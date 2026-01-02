/**
 * PaletteSelector - Seletor de paleta de cores para o site
 * Adaptado do EditorPalette do editor antigo
 */

import { ColorPalette } from '../../types'
import { cn } from '../../utils/cn'

interface PaletteSelectorProps {
  selectedPalette: ColorPalette
  onPaletteChange: (palette: ColorPalette) => void
  palettes: Record<string, ColorPalette>
}

export function PaletteSelector({
  selectedPalette,
  onPaletteChange,
  palettes,
}: PaletteSelectorProps) {
  return (
    <div className="p-2">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
        Escolha uma Paleta de Cores
      </h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 mb-3">
        {Object.entries(palettes).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => onPaletteChange(palette)}
            className={cn(
              'rounded-xl cursor-pointer transition-all',
              'flex flex-col items-center p-3',
              'border-2',
              selectedPalette?.name === palette.name
                ? 'border-emerald-500 shadow-[0_0_0_2px_rgb(16,185,129)]'
                : 'border-gray-200 dark:border-gray-700 shadow-sm',
              'bg-white dark:bg-gray-800',
              'hover:shadow-md'
            )}
          >
            <div
              className="w-15 h-8 rounded-lg flex overflow-hidden mb-2"
              style={{
                width: '60px',
                height: '32px',
              }}
            >
              {palette.gradient.map((color, i) => (
                <span
                  key={i}
                  className="flex-1"
                  style={{ background: color }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
              {palette.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Paletas de cores padrão
 * Migradas do editor antigo
 */
export const defaultColorPalettes: Record<string, ColorPalette> = {
  sunnyBeach: {
    name: 'Sunny Beach Day',
    primary: '#264653',
    secondary: '#2a9d8f',
    accent: '#e9c46a',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#e9c46a',
    gradient: ['#264653', '#2a9d8f', '#e9c46a'],
  },
  refreshingSummer: {
    name: 'Refreshing Summer Fun',
    primary: '#023047',
    secondary: '#219ebc',
    accent: '#ffb703',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#8ecae6',
    gradient: ['#023047', '#219ebc', '#ffb703'],
  },
  summerOcean: {
    name: 'Summer Ocean Breeze',
    primary: '#1d3557',
    secondary: '#457b9d',
    accent: '#e63946',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#a8dadc',
    gradient: ['#1d3557', '#457b9d', '#e63946'],
  },
  oliveGarden: {
    name: 'Olive Garden Feast',
    primary: '#283618',
    secondary: '#606c38',
    accent: '#dda15e',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#bc6c25',
    gradient: ['#283618', '#606c38', '#dda15e'],
  },
  blueSerenity: {
    name: 'Blue Serenity',
    primary: '#03045e',
    secondary: '#023e8a',
    accent: '#0077b6',
    background: '#000814',
    surface: '#001d3d',
    text: '#ffffff',
    textSecondary: '#48cae4',
    gradient: ['#03045e', '#023e8a', '#0077b6'],
  },
  pastelDreams: {
    name: 'Pastel Dreams',
    primary: '#a2d2ff',
    secondary: '#bde0fe',
    accent: '#ffafcc',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#ffc8dd',
    gradient: ['#a2d2ff', '#bde0fe', '#ffafcc'],
  },
  fieryOcean: {
    name: 'Fiery Ocean',
    primary: '#003049',
    secondary: '#669bbc',
    accent: '#c1121f',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#780000',
    gradient: ['#003049', '#669bbc', '#c1121f'],
  },
  earthy: {
    name: 'Earthy Green',
    primary: '#40916c',
    secondary: '#52b788',
    accent: '#74c69d',
    background: '#081c15',
    surface: '#1b4332',
    text: '#ffffff',
    textSecondary: '#74c69d',
    gradient: ['#40916c', '#52b788', '#74c69d'],
  },
  boldBerry: {
    name: 'Bold Berry',
    primary: '#da627d',
    secondary: '#a53860',
    accent: '#ffa5ab',
    background: '#450920',
    surface: '#1a0308',
    text: '#ffffff',
    textSecondary: '#ffa5ab',
    gradient: ['#da627d', '#a53860', '#ffa5ab'],
  },
  deepOcean: {
    name: 'Deep Ocean Mystique',
    primary: '#006466',
    secondary: '#065a60',
    accent: '#144552',
    background: '#081c15',
    surface: '#1b3a4b',
    text: '#ffffff',
    textSecondary: '#006466',
    gradient: ['#006466', '#065a60', '#144552'],
  },
  midnightMagic: {
    name: 'Midnight Magic',
    primary: '#3a015c',
    secondary: '#4f0147',
    accent: '#35012c',
    background: '#11001c',
    surface: '#290025',
    text: '#ffffff',
    textSecondary: '#3a015c',
    gradient: ['#3a015c', '#4f0147', '#35012c'],
  },
}
