/**
 * Form Exporters Auto-Registration
 */

import { htmlExportRegistry } from "../HtmlExporter";
import {
  exportForm,
  exportInput,
  exportTextarea,
  exportFormSelect,
} from "./FormExporters";

// Referência para renderChild
import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";

let renderChildRef: ((block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string) | null = null;

export function setFormExportersRenderChild(
  fn: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string
) {
  renderChildRef = fn;
}

// Exporters simples
htmlExportRegistry.register("input", exportInput);
htmlExportRegistry.register("textarea", exportTextarea);
htmlExportRegistry.register("formSelect", exportFormSelect);

// Form precisa de renderChild
htmlExportRegistry.register("form", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportForm(block, depth, basePath, theme, renderChildRef);
});
