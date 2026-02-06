/**
 * TypographyInput - Editor de tipografia composto
 * Permite customizar: tamanho, peso, cor e efeitos de texto
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';
import {
  TypographyConfig,
  FontWeight,
  TextEffect,
  fontWeightLabels,
  textEffectLabels,
  generateTypographySummary,
} from '../../../engine/shared/typography';

interface TypographyInputProps {
  value: TypographyConfig | undefined;
  onChange: (value: TypographyConfig) => void;
  label: string;
  defaultFontSize?: number;
  defaultFontWeight?: FontWeight;
}

const fontWeights: FontWeight[] = ['light', 'normal', 'medium', 'semibold', 'bold'];
const textEffects: TextEffect[] = ['none', 'shadow', 'glow', 'outline', 'gradient'];

export function TypographyInput({
  value,
  onChange,
  label,
  defaultFontSize = 16,
  defaultFontWeight = 'normal',
}: TypographyInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEffectColorPicker, setShowEffectColorPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const config: TypographyConfig = {
    fontSize: value?.fontSize ?? defaultFontSize,
    fontWeight: value?.fontWeight ?? defaultFontWeight,
    color: value?.color ?? '',
    effect: value?.effect ?? 'none',
    effectColor: value?.effectColor ?? '#000000',
    effectIntensity: value?.effectIntensity ?? 50,
  };

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowColorPicker(false);
        setShowEffectColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateConfig = useCallback((updates: Partial<TypographyConfig>) => {
    onChange({ ...config, ...updates });
  }, [config, onChange]);

  const handleFontSizeChange = useCallback((delta: number) => {
    const newSize = Math.max(8, Math.min(200, (config.fontSize || defaultFontSize) + delta));
    updateConfig({ fontSize: newSize });
  }, [config.fontSize, defaultFontSize, updateConfig]);

  const handleFontSizeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 8 && val <= 200) {
      updateConfig({ fontSize: val });
    }
  }, [updateConfig]);

  const summary = generateTypographySummary(config);

  return (
    <div ref={containerRef} className="relative">
      {/* Label e botão de toggle */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer",
          "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
          "hover:border-blue-400 dark:hover:border-blue-500",
          isOpen && "border-blue-500 ring-1 ring-blue-500"
        )}
      >
        <span
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
          style={{
            fontSize: `${Math.min(config.fontSize || 16, 18)}px`,
            fontWeight: config.fontWeight === 'bold' ? 700 : config.fontWeight === 'semibold' ? 600 : 400,
          }}
        >
          {summary}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {/* Tamanho da fonte - estilo RichText */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tamanho
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFontSizeChange(-2)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={config.fontSize}
                onChange={handleFontSizeInput}
                min={8}
                max={200}
                className={cn(
                  "w-20 text-center py-2 rounded-lg border",
                  "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                  "text-lg font-semibold text-gray-800 dark:text-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                style={{ fontSize: `${Math.min(config.fontSize || 16, 24)}px` }}
              />
              <button
                type="button"
                onClick={() => handleFontSizeChange(2)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400 ml-1">px</span>
            </div>
          </div>

          {/* Peso da fonte */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Peso
            </label>
            <div className="flex flex-wrap gap-1">
              {fontWeights.map((weight) => (
                <button
                  key={weight}
                  type="button"
                  onClick={() => updateConfig({ fontWeight: weight })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer",
                    config.fontWeight === weight
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  {fontWeightLabels[weight]}
                </button>
              ))}
            </div>
          </div>

          {/* Cor do texto */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Cor
            </label>
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowEffectColorPicker(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer",
                "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                "hover:border-blue-400 transition-colors"
              )}
            >
              <div
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-500"
                style={{ backgroundColor: config.color || 'transparent' }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {config.color || 'Padrão do tema'}
              </span>
            </button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                <HexColorPicker
                  color={config.color || '#000000'}
                  onChange={(color) => updateConfig({ color })}
                />
                <button
                  type="button"
                  onClick={() => updateConfig({ color: undefined })}
                  className="w-full mt-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                >
                  Usar cor do tema
                </button>
              </div>
            )}
          </div>

          {/* Efeito */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Efeito
            </label>
            <div className="flex flex-wrap gap-1">
              {textEffects.map((effect) => (
                <button
                  key={effect}
                  type="button"
                  onClick={() => updateConfig({ effect })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer",
                    config.effect === effect
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  {textEffectLabels[effect]}
                </button>
              ))}
            </div>
          </div>

          {/* Configurações do efeito (se não for 'none') */}
          {config.effect && config.effect !== 'none' && (
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
              {/* Cor do efeito */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {config.effect === 'gradient' ? 'Segunda Cor' : 'Cor do Efeito'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowEffectColorPicker(!showEffectColorPicker);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer",
                    "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                    "hover:border-blue-400 transition-colors"
                  )}
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-500"
                    style={{ backgroundColor: config.effectColor || '#000000' }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {config.effectColor || '#000000'}
                  </span>
                </button>
                {showEffectColorPicker && (
                  <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                    <HexColorPicker
                      color={config.effectColor || '#000000'}
                      onChange={(color) => updateConfig({ effectColor: color })}
                    />
                  </div>
                )}
              </div>

              {/* Intensidade do efeito */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Intensidade: {config.effectIntensity}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={10}
                  value={config.effectIntensity}
                  onChange={(e) => updateConfig({ effectIntensity: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
