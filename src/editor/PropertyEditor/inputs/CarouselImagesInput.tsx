/**
 * CarouselImagesInput
 * Componente para editar array de imagens do carrossel hero (2-5 imagens)
 */

import { useRef } from "react";
import { cn } from "../../../utils/cn";
import type { UploadConfig } from "../../LandingPageEditor";

interface CarouselImagesInputProps {
  /** Array de URLs de imagens */
  images: string[];
  /** Callback ao atualizar imagens */
  onImagesChange: (images: string[]) => void;
  /** Label do componente */
  label?: string;
  /** Descrição */
  description?: string;
  /** Configuração de upload */
  uploadConfig?: UploadConfig;
}

const MIN_IMAGES = 2;
const MAX_IMAGES = 5;

/**
 * Slot individual de imagem do carrossel
 */
function CarouselSlot({
  index,
  src,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  src: string;
  onChange: (src: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const hasImage = !!src && !src.includes("placehold.co");

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
          "w-20 h-12 rounded-lg overflow-hidden border-2 transition-all",
          "flex items-center justify-center",
          "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
          hasImage
            ? "border-blue-400 dark:border-blue-500"
            : "border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400"
        )}
      >
        {src ? (
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>

      {/* Botão de remover */}
      {canRemove && (
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

      {/* Número do slide */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
        {index + 1}
      </div>
    </div>
  );
}

export function CarouselImagesInput({
  images,
  onImagesChange,
  label,
  description,
}: CarouselImagesInputProps) {
  const canAdd = images.length < MAX_IMAGES;
  const canRemove = images.length > MIN_IMAGES;

  const handleImageChange = (index: number, src: string) => {
    const newImages = [...images];
    newImages[index] = src;
    onImagesChange(newImages);
  };

  const handleImageRemove = (index: number) => {
    if (!canRemove) return;
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleAddImage = () => {
    if (!canAdd) return;
    onImagesChange([...images, ""]);
  };

  return (
    <div className="space-y-2">
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

      <div className="space-y-1">
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Slides ({images.length}/{MAX_IMAGES})
        </span>
        <div className="flex flex-wrap gap-2 items-center">
          {images.map((src, index) => (
            <CarouselSlot
              key={index}
              index={index}
              src={src}
              onChange={(newSrc) => handleImageChange(index, newSrc)}
              onRemove={() => handleImageRemove(index)}
              canRemove={canRemove}
            />
          ))}
          {canAdd && (
            <button
              type="button"
              onClick={handleAddImage}
              className={cn(
                "w-20 h-12 rounded-lg border-2 border-dashed",
                "border-gray-300 dark:border-gray-600",
                "hover:border-blue-400 dark:hover:border-blue-500",
                "flex items-center justify-center transition-colors",
                "bg-gray-50 dark:bg-gray-800"
              )}
            >
              <svg
                className="w-5 h-5 text-gray-400"
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
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
