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
} from "./inputs";
import { ImageInput } from "../../components/inputs/ImageInput";
import type { UploadConfig } from "../LandingPageEditorV2";

/**
 * Renderiza um input baseado no tipo especificado em inspectorMeta
 */
export function renderPropertyInput(
  propName: string,
  meta: InspectorMeta,
  value: any,
  onChange: (value: any) => void,
  uploadConfig?: UploadConfig,
): React.ReactNode {
  const { label, description, inputType, options, min, max, step, size } = meta;

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
