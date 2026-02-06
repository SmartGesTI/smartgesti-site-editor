/**
 * ImageGridInput
 * Componente de edição para grid de imagens com seletor de preset visual
 */

import { useRef } from "react";
import { cn } from "../../../utils/cn";
import {
  type ImageGridItem,
  type ImageGridPreset,
  gridPresetMap,
  imageGridPresetIds,
} from "../../../engine/shared/imageGrid";
import type { UploadConfig } from "../../LandingPageEditor";

interface ImageGridInputProps {
  /** Preset atual */
  preset?: ImageGridPreset;
  /** Array de imagens */
  images?: ImageGridItem[];
  /** Gap em pixels */
  gap?: number;
  /** Callback para atualizar preset */
  onPresetChange: (preset: ImageGridPreset) => void;
  /** Callback para atualizar imagens */
  onImagesChange: (images: ImageGridItem[]) => void;
  /** Callback para atualizar gap */
  onGapChange: (gap: number) => void;
  /** Label do componente */
  label?: string;
  /** Descrição */
  description?: string;
  /** Configuração de upload (tenantId, authToken, etc) */
  uploadConfig?: UploadConfig;
}

/**
 * Ícones visuais dos presets usando divs estilizadas
 */
function PresetIcon({ preset, isActive }: { preset: ImageGridPreset; isActive: boolean }) {
  const config = gridPresetMap[preset];

  // Usar uma mini-grid visual para representar cada preset
  const getPresetVisual = () => {
    switch (preset) {
      case "single":
        return (
          <div className="w-full h-full bg-current rounded-sm" />
        );
      case "two-horizontal":
        return (
          <div className="w-full h-full grid grid-cols-2 gap-0.5">
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      case "two-vertical":
        return (
          <div className="w-full h-full grid grid-rows-2 gap-0.5">
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      case "three-left":
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
            <div className="bg-current rounded-sm row-span-2" />
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      case "three-right":
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm row-span-2" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      case "three-top":
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
            <div className="bg-current rounded-sm col-span-2" />
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      case "four-equal":
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
            <div className="bg-current rounded-sm" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "w-8 h-8 p-1",
        isActive ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
      )}
      title={config.name}
    >
      {getPresetVisual()}
    </div>
  );
}

/**
 * Slot de imagem individual com preview e upload
 */
function ImageSlot({
  index,
  image,
  onChange,
  onRemove,
}: {
  index: number;
  image?: ImageGridItem;
  onChange: (image: ImageGridItem) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica
    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens são permitidas");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo: 10MB");
      return;
    }

    // Usar Data URL para preview (deferUpload mode)
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      onChange({ src: dataUrl, alt: image?.alt || "" });
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset para permitir selecionar o mesmo arquivo
      inputRef.current.click();
    }
  };

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
          "flex items-center justify-center",
          "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
          image?.src
            ? "border-blue-400 dark:border-blue-500"
            : "border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400"
        )}
      >
        {image?.src ? (
          <img
            src={image.src}
            alt={image.alt || `Imagem ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </button>

      {/* Botão de remover */}
      {image?.src && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "absolute -top-1 -right-1 w-5 h-5 rounded-full",
            "bg-red-500 text-white",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "text-xs font-bold"
          )}
        >
          ×
        </button>
      )}

      {/* Número do slot */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
        {index + 1}
      </div>
    </div>
  );
}

export function ImageGridInput({
  preset: presetProp,
  images: imagesProp,
  gap: gapProp,
  onPresetChange,
  onImagesChange,
  onGapChange,
  label,
  description,
}: ImageGridInputProps) {
  const preset = presetProp || "four-equal";
  const images = imagesProp || [];
  const gap = gapProp ?? 8;

  const currentConfig = gridPresetMap[preset];
  const maxImages = currentConfig.maxImages;

  // Atualiza o preset
  const handlePresetChange = (newPreset: ImageGridPreset) => {
    const newConfig = gridPresetMap[newPreset];
    // Truncar imagens se o novo preset suporta menos
    if (images.length > newConfig.maxImages) {
      onImagesChange(images.slice(0, newConfig.maxImages));
    }
    onPresetChange(newPreset);
  };

  // Atualiza uma imagem específica
  const handleImageChange = (index: number, image: ImageGridItem) => {
    const newImages = [...images];
    // Preencher slots vazios até o índice
    while (newImages.length <= index) {
      newImages.push({ src: "", alt: "" });
    }
    newImages[index] = image;
    onImagesChange(newImages);
  };

  // Remove uma imagem
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = { src: "", alt: "" };
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
          {label}
          {description && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
              {description}
            </span>
          )}
        </label>
      )}

      {/* Seletor de Preset */}
      <div className="space-y-1">
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Layout
        </span>
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {imageGridPresetIds.map((presetId) => (
            <button
              key={presetId}
              type="button"
              onClick={() => handlePresetChange(presetId)}
              className={cn(
                "rounded-md transition-all",
                preset === presetId
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <PresetIcon preset={presetId} isActive={preset === presetId} />
            </button>
          ))}
        </div>
      </div>

      {/* Slots de Imagens */}
      <div className="space-y-1">
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Imagens ({images.filter(img => img?.src).length}/{maxImages})
        </span>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: maxImages }).map((_, index) => (
            <ImageSlot
              key={index}
              index={index}
              image={images[index]}
              onChange={(img) => handleImageChange(index, img)}
              onRemove={() => handleImageRemove(index)}
            />
          ))}
        </div>
      </div>

      {/* Slider de Gap */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Espaçamento
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {gap}px
          </span>
        </div>
        <input
          type="range"
          value={gap}
          onChange={(e) => onGapChange(Number(e.target.value))}
          min={0}
          max={24}
          step={2}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
