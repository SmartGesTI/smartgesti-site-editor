/**
 * GalleryImagesInput
 * Modal avançado para gerenciar imagens da galeria:
 * - Upload (FileReader) ou URL externa
 * - Alt text obrigatório (a11y)
 * - Título, descrição, tags opcionais
 * - Reordenação (mover para cima/baixo)
 * - Aviso de performance acima de 50 imagens
 */

import { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../../utils/cn";
import { logger } from "../../../utils/logger";
import type { GalleryImage } from "../../../engine/schema/siteDocument";
import type { UploadConfig } from "../../LandingPageEditor";

interface GalleryImagesInputProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  label?: string;
  description?: string;
  uploadConfig?: UploadConfig;
  /** Aviso de performance a partir de N imagens */
  warningThreshold?: number;
}

type DraftImage = Partial<GalleryImage> & { src: string; alt: string };

/** Gera um ID único simples */
function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─────────────────────────────────────────────────────────
// Modal de add/edit
// ─────────────────────────────────────────────────────────

interface ImageModalProps {
  draft: DraftImage;
  onDraftChange: (d: DraftImage) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

function ImageModal({ draft, onDraftChange, onSave, onCancel, isEditing }: ImageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [altError, setAltError] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) {
        logger.warn("[GalleryImagesInput] Arquivo muito grande (máx 10MB)");
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = (evt) => {
        onDraftChange({ ...draft, src: evt.target?.result as string });
        setUploading(false);
      };
      reader.onerror = () => {
        logger.error("[GalleryImagesInput] Erro ao ler arquivo");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [draft, onDraftChange],
  );

  const handleSave = () => {
    if (!draft.alt.trim()) {
      setAltError(true);
      return;
    }
    setAltError(false);
    onSave();
  };

  const tagsString = draft.tags?.join(", ") ?? "";

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar imagem" : "Adicionar imagem"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Preview */}
          {draft.src && (
            <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img src={draft.src} alt="preview" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Fonte da imagem */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Imagem
            </label>

            {/* Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }}
              disabled={uploading}
              className={cn(
                "w-full h-10 rounded-lg border-2 border-dashed transition-colors",
                "border-gray-300 dark:border-gray-600",
                "hover:border-blue-400 dark:hover:border-blue-500",
                "flex items-center justify-center gap-2",
                "bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400",
                uploading && "opacity-50 cursor-not-allowed",
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {uploading ? "Carregando..." : "Enviar arquivo"}
            </button>

            <div className="text-center text-xs text-gray-400">ou</div>

            {/* URL */}
            <input
              type="text"
              placeholder="https://... (URL externa)"
              value={draft.src.startsWith("data:") ? "" : draft.src}
              onChange={(e) => onDraftChange({ ...draft, src: e.target.value })}
              className={cn(
                "w-full h-9 rounded-lg border-2 bg-white dark:bg-gray-800 px-3 text-sm transition-all",
                "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              )}
            />
          </div>

          {/* Alt text (obrigatório) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Texto alternativo{" "}
              <span className="text-red-500">*</span>
              <span className="font-normal text-gray-400 ml-1">(obrigatório para acessibilidade)</span>
            </label>
            <input
              type="text"
              placeholder="Descrição da imagem para leitores de tela"
              value={draft.alt}
              onChange={(e) => {
                setAltError(false);
                onDraftChange({ ...draft, alt: e.target.value });
              }}
              className={cn(
                "w-full h-9 rounded-lg border-2 bg-white dark:bg-gray-800 px-3 text-sm transition-all",
                "focus:outline-none",
                altError
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-blue-500",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              )}
            />
            {altError && (
              <p className="text-xs text-red-500">O texto alternativo é obrigatório.</p>
            )}
          </div>

          {/* Título (opcional) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Título <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Projeto de design para cliente X"
              value={draft.title ?? ""}
              onChange={(e) =>
                onDraftChange({ ...draft, title: e.target.value || undefined })
              }
              className={cn(
                "w-full h-9 rounded-lg border-2 bg-white dark:bg-gray-800 px-3 text-sm transition-all",
                "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              )}
            />
          </div>

          {/* Descrição (opcional) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Descrição <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              placeholder="Legenda exibida no lightbox"
              value={draft.description ?? ""}
              onChange={(e) =>
                onDraftChange({ ...draft, description: e.target.value || undefined })
              }
              rows={2}
              className={cn(
                "w-full rounded-lg border-2 bg-white dark:bg-gray-800 px-3 py-2 text-sm transition-all resize-none",
                "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              )}
            />
          </div>

          {/* Tags (opcional) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Tags <span className="font-normal text-gray-400">(opcional, separadas por vírgula)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: produto, destaque, azul"
              value={tagsString}
              onChange={(e) => {
                const raw = e.target.value;
                const tags = raw
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                onDraftChange({ ...draft, tags: tags.length > 0 ? tags : undefined });
              }}
              className={cn(
                "w-full h-9 rounded-lg border-2 bg-white dark:bg-gray-800 px-3 text-sm transition-all",
                "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-colors",
              "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!draft.src}
            className={cn(
              "px-4 py-2 text-sm rounded-lg font-medium transition-colors",
              "bg-blue-600 hover:bg-blue-700 text-white",
              !draft.src && "opacity-50 cursor-not-allowed",
            )}
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

// ─────────────────────────────────────────────────────────
// Thumbnail individual
// ─────────────────────────────────────────────────────────

interface ImageThumbProps {
  image: GalleryImage;
  index: number;
  total: number;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ImageThumb({ image, index, total, onEdit, onRemove, onMoveUp, onMoveDown }: ImageThumbProps) {
  return (
    <div className="relative group flex-shrink-0">
      {/* Thumbnail */}
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all block",
          "bg-gray-100 dark:bg-gray-800",
          "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500",
        )}
        title={image.alt || image.title || `Imagem ${index + 1}`}
      >
        {image.src ? (
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Ações no hover */}
      <div className={cn(
        "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
        "flex flex-col items-center justify-between p-0.5",
        "bg-black/20",
      )}>
        {/* Mover para cima */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className={cn(
            "w-5 h-5 rounded bg-white/90 dark:bg-gray-800/90 flex items-center justify-center",
            "text-gray-700 dark:text-gray-200 transition-colors",
            index === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white dark:hover:bg-gray-700",
          )}
          title="Mover para cima"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Remover */}
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "w-5 h-5 rounded bg-red-500/90 hover:bg-red-600 flex items-center justify-center",
            "text-white transition-colors",
          )}
          title="Remover imagem"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mover para baixo */}
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className={cn(
            "w-5 h-5 rounded bg-white/90 dark:bg-gray-800/90 flex items-center justify-center",
            "text-gray-700 dark:text-gray-200 transition-colors",
            index === total - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white dark:hover:bg-gray-700",
          )}
          title="Mover para baixo"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Número */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 rounded-b-lg pointer-events-none">
        {index + 1}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────

const EMPTY_DRAFT: DraftImage = { src: "", alt: "", title: undefined, description: undefined, tags: undefined };

export function GalleryImagesInput({
  images,
  onImagesChange,
  label,
  description,
  warningThreshold = 50,
}: GalleryImagesInputProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftImage>(EMPTY_DRAFT);

  const openAdd = () => {
    setDraft(EMPTY_DRAFT);
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEdit = (index: number) => {
    const img = images[index];
    setDraft({
      src: img.src,
      alt: img.alt,
      title: img.title,
      description: img.description,
      tags: img.tags,
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!draft.src || !draft.alt.trim()) return;

    if (editingIndex !== null) {
      // Editar existente
      const updated = images.map((img, i) =>
        i === editingIndex
          ? {
              ...img,
              src: draft.src,
              alt: draft.alt.trim(),
              title: draft.title,
              description: draft.description,
              tags: draft.tags,
            }
          : img,
      );
      onImagesChange(updated);
    } else {
      // Adicionar novo
      const newImage: GalleryImage = {
        id: generateId(),
        src: draft.src,
        alt: draft.alt.trim(),
        title: draft.title,
        description: draft.description,
        tags: draft.tags,
      };
      onImagesChange([...images, newImage]);
    }

    setShowModal(false);
    setDraft(EMPTY_DRAFT);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setDraft(EMPTY_DRAFT);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...images];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onImagesChange(arr);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const arr = [...images];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onImagesChange(arr);
  };

  const showWarning = images.length >= warningThreshold;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">
            {label}
          </label>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {images.length} {images.length === 1 ? "imagem" : "imagens"}
          </span>
        </div>
      )}
      {description && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {/* Grid de thumbnails */}
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
          {images.map((img, index) => (
            <ImageThumb
              key={img.id}
              image={img}
              index={index}
              total={images.length}
              onEdit={() => openEdit(index)}
              onRemove={() => handleRemove(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
            />
          ))}
        </div>
      ) : (
        <div className={cn(
          "w-full py-6 rounded-lg border-2 border-dashed",
          "border-gray-200 dark:border-gray-700",
          "flex flex-col items-center justify-center gap-1",
          "text-gray-400 dark:text-gray-500",
        )}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">Nenhuma imagem adicionada</span>
        </div>
      )}

      {/* Aviso de performance */}
      {showWarning && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[10px] text-amber-700 dark:text-amber-300">
            <strong>{images.length} imagens</strong> — muitas imagens podem afetar o desempenho da página.
          </p>
        </div>
      )}

      {/* Botão adicionar */}
      <button
        type="button"
        onClick={openAdd}
        className={cn(
          "w-full h-9 rounded-lg border-2 border-dashed transition-colors",
          "border-gray-300 dark:border-gray-600",
          "hover:border-blue-400 dark:hover:border-blue-500",
          "flex items-center justify-center gap-1.5",
          "text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400",
          "bg-gray-50 dark:bg-gray-800/50",
        )}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar imagem
      </button>

      {/* Modal */}
      {showModal && (
        <ImageModal
          draft={draft}
          onDraftChange={setDraft}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editingIndex !== null}
        />
      )}
    </div>
  );
}
