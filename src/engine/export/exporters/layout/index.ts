/**
 * Layout Exporters Auto-Registration
 */

import { htmlExportRegistry } from "../HtmlExporter";
import { exportContainer } from "./ContainerExporter";
import { exportStack } from "./StackExporter";
import { exportGrid } from "./GridExporter";
import { exportBox } from "./BoxExporter";
import { exportSection } from "./SectionExporter";

// Wrapper para injetar renderChild
import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";

// Referência para a função de renderização será injetada
let renderChildRef: ((block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string) | null = null;

export function setLayoutExportersRenderChild(
  fn: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string
) {
  renderChildRef = fn;
}

// Registrar exporters com wrapper
htmlExportRegistry.register("container", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportContainer(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("stack", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportStack(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("grid", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportGrid(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("box", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportBox(block, depth, basePath, theme, renderChildRef);
});

htmlExportRegistry.register("section", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportSection(block, depth, basePath, theme, renderChildRef);
});
