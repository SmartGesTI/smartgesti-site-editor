/**
 * Central Exporters Auto-Registration
 * Importa todos os exporters e registra no registry
 */

import { Block } from "../../schema/siteDocument";
import { ThemeTokens } from "../../schema/themeTokens";

// Import all exporter groups (triggers auto-registration)
import "./layout";
import "./content";
import "./sections";
import "./forms";

// Import render child setters
import { setLayoutExportersRenderChild } from "./layout";
import { setContentExportersRenderChild } from "./content";
import { setSectionExportersRenderChild } from "./sections";
import { setFormExportersRenderChild } from "./forms";

// Export registry
export { htmlExportRegistry } from "./HtmlExporter";

/**
 * Inicializa todos os exporters com a função de renderização recursiva
 */
export function initializeExporters(
  renderChild: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string
) {
  setLayoutExportersRenderChild(renderChild);
  setContentExportersRenderChild(renderChild);
  setSectionExportersRenderChild(renderChild);
  setFormExportersRenderChild(renderChild);
}
