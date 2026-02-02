/**
 * Content Exporters Auto-Registration
 */

import { htmlExportRegistry } from "../HtmlExporter";
import { exportHeading } from "./HeadingExporter";
import { exportText } from "./TextExporter";
import { exportImage } from "./ImageExporter";
import { exportButton } from "./ButtonExporter";
import { exportLink } from "./LinkExporter";
import { exportDivider } from "./DividerExporter";
import { exportSpacer } from "./SpacerExporter";
import { exportBadge } from "./BadgeExporter";
import { exportIcon } from "./IconExporter";
import { exportAvatar } from "./AvatarExporter";
import { exportVideo } from "./VideoExporter";
import { exportCard } from "./CardExporter";

// Referência para renderChild
import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";

let renderChildRef: ((block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string) | null = null;

export function setContentExportersRenderChild(
  fn: (block: Block, depth: number, basePath?: string, theme?: ThemeTokens) => string
) {
  renderChildRef = fn;
}

// Exporters simples (sem children)
htmlExportRegistry.register("heading", exportHeading);
htmlExportRegistry.register("text", exportText);
htmlExportRegistry.register("image", exportImage);
htmlExportRegistry.register("button", exportButton);
htmlExportRegistry.register("link", exportLink);
htmlExportRegistry.register("divider", exportDivider);
htmlExportRegistry.register("spacer", exportSpacer);
htmlExportRegistry.register("badge", exportBadge);
htmlExportRegistry.register("icon", exportIcon);
htmlExportRegistry.register("avatar", exportAvatar);
htmlExportRegistry.register("video", exportVideo);

// Card precisa de renderChild
htmlExportRegistry.register("card", (block, depth, basePath, theme) => {
  if (!renderChildRef) throw new Error("renderChild not initialized");
  return exportCard(block, depth, basePath, theme, renderChildRef);
});
