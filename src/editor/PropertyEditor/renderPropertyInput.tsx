import React from "react";
import { InspectorMeta } from "../../engine";
import {
  TextInput,
  TextAreaInput,
  ColorInput,
  NumberInput,
  SelectInput,
  SliderInput,
  ToggleButton,
  ButtonGroupInput,
  IconGridInput,
  ImageGridInput,
  TypographyInput,
  ImageInput,
  CarouselImagesInput,
} from "./inputs";
import type { UploadConfig } from "../LandingPageEditor";

/**
 * Extended context for special input types that need to update multiple props
 */
export interface RenderInputContext {
  /** All current prop values (for inputs that read multiple props) */
  allProps?: Record<string, any>;
  /** Callback to update multiple props at once */
  onMultiUpdate?: (updates: Record<string, any>) => void;
}

/**
 * Renderiza um input baseado no tipo especificado em inspectorMeta
 */
export function renderPropertyInput(
  propName: string,
  meta: InspectorMeta,
  value: any,
  onChange: (value: any) => void,
  uploadConfig?: UploadConfig,
  context?: RenderInputContext,
): React.ReactNode {
  const { label, description, inputType, options, min, max, step, size } = meta;

  // Campo readOnly: mostrar valor com overlay de bloqueio
  if (meta.readOnly) {
    return (
      <div key={propName} className="relative">
        <div className="flex items-center gap-1 mb-1">
          <svg className="w-3 h-3 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a4 4 0 0 0-4 4v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm2 6H6V5a2 2 0 1 1 4 0v2z"/>
          </svg>
          <span className="text-xs font-medium text-gray-400">{label}</span>
        </div>
        <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 cursor-not-allowed select-none truncate">
          {value !== undefined && value !== null ? String(value) : "—"}
        </div>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5 italic">{description}</p>
        )}
      </div>
    );
  }

  switch (inputType) {
    case "text":
      return (
        <TextInput
          key={propName}
          value={value || ""}
          onChange={onChange}
          label={label}
          description={description}
          placeholder={label}
        />
      );

    case "textarea":
      return (
        <TextAreaInput
          key={propName}
          value={value || ""}
          onChange={onChange}
          label={label}
          description={description}
          placeholder={label}
          rows={3}
        />
      );

    case "number":
      return (
        <NumberInput
          key={propName}
          value={value}
          onChange={onChange}
          label={label}
          description={description}
          placeholder={label}
          min={min}
          max={max}
          step={step}
        />
      );

    case "color":
      return (
        <ColorInput
          key={propName}
          value={value}
          onChange={onChange}
          label={label}
          description={description}
        />
      );

    case "select":
      if (!options || options.length === 0) {
        // Fallback para text input
        return renderPropertyInput(
          propName,
          { ...meta, inputType: "text" },
          value,
          onChange,
          uploadConfig,
        );
      }
      // Usar ButtonGroup para 2-3 opções, Select para 4+
      if (options.length <= 3) {
        return (
          <ButtonGroupInput
            key={propName}
            value={value}
            onChange={onChange}
            label={label}
            description={description}
            options={options}
          />
        );
      }
      return (
        <SelectInput
          key={propName}
          value={value}
          onChange={onChange}
          label={label}
          description={description}
          options={options}
        />
      );

    case "slider":
      return (
        <SliderInput
          key={propName}
          value={value}
          onChange={onChange}
          label={label}
          description={description}
          min={min}
          max={max}
          step={step}
        />
      );

    case "image":
      return (
        <ImageInput
          key={propName}
          value={value || ""}
          onChange={onChange}
          label={label}
        />
      );

    case "color-advanced":
      // Usar o mesmo ColorInput simples - funciona melhor que o picker avançado
      return (
        <ColorInput
          key={propName}
          value={value || ""}
          onChange={onChange}
          label={label}
          description={description}
        />
      );

    case "image-upload":
      return (
        <ImageInput
          key={propName}
          value={value || ""}
          onChange={onChange}
          label={label}
          size={{ width: 160, height: 80 }}
          showUrlInput={false}
          maxSizeMB={10}
          tenantId={uploadConfig?.tenantId}
          schoolId={uploadConfig?.schoolId}
          siteId={uploadConfig?.siteId || undefined}
          authToken={uploadConfig?.authToken}
          assetType="image"
          deferUpload={true}
        />
      );

    case "checkbox":
      return (
        <ToggleButton
          key={propName}
          value={!!value}
          onChange={onChange}
          label={label}
          description={description}
          size={size}
        />
      );

    case "icon-grid":
      return (
        <IconGridInput
          key={propName}
          value={value || "arrow-right"}
          onChange={onChange}
          label={label}
          description={description}
        />
      );

    case "image-grid":
      // Image grid needs to read/write multiple props (preset, images, gap)
      // We use the extended context if available
      if (context?.allProps && context?.onMultiUpdate) {
        const preset = context.allProps.imageGridPreset || "four-equal";
        const images = context.allProps.imageGridImages || [];
        const gap = context.allProps.imageGridGap ?? 8;

        return (
          <ImageGridInput
            key={propName}
            preset={preset}
            images={images}
            gap={gap}
            onPresetChange={(newPreset) => {
              context.onMultiUpdate!({ imageGridPreset: newPreset });
            }}
            onImagesChange={(newImages) => {
              context.onMultiUpdate!({ imageGridImages: newImages });
            }}
            onGapChange={(newGap) => {
              context.onMultiUpdate!({ imageGridGap: newGap });
            }}
            label={label}
            description={description}
            uploadConfig={uploadConfig}
          />
        );
      }
      // Fallback: single-value mode (shouldn't happen in practice)
      return null;

    case "carousel-images":
      // Carousel images needs to read/write carouselImages via multi-prop context
      if (context?.allProps && context?.onMultiUpdate) {
        const images = context.allProps.carouselImages || [];

        return (
          <CarouselImagesInput
            key={propName}
            images={images}
            onImagesChange={(newImages) => {
              context.onMultiUpdate!({ carouselImages: newImages });
            }}
            label={label}
            description={description}
            uploadConfig={uploadConfig}
          />
        );
      }
      return null;

    case "typography":
      // Determina defaults baseado no nome da prop
      let defaultFontSize = 16;
      let defaultFontWeight: "light" | "normal" | "medium" | "semibold" | "bold" = "normal";

      if (propName.includes("title") || propName.includes("Title")) {
        defaultFontSize = 48;
        defaultFontWeight = "bold";
      } else if (propName.includes("subtitle") || propName.includes("Subtitle")) {
        defaultFontSize = 24;
        defaultFontWeight = "medium";
      } else if (propName.includes("description") || propName.includes("Description")) {
        defaultFontSize = 16;
        defaultFontWeight = "normal";
      }

      return (
        <TypographyInput
          key={propName}
          value={value}
          onChange={onChange}
          label={label}
          defaultFontSize={defaultFontSize}
          defaultFontWeight={defaultFontWeight}
        />
      );

    default:
      // Fallback para text input
      return renderPropertyInput(
        propName,
        { ...meta, inputType: "text" },
        value,
        onChange,
        uploadConfig,
      );
  }
}
