/**
 * Video Block Exporter
 */

import { Block } from "../../../schema/siteDocument";
import { ThemeTokens } from "../../../schema/themeTokens";
import { dataBlockIdAttr, escapeHtml } from "../../shared/htmlHelpers";

export function exportVideo(
  block: Block,
  depth: number,
  basePath?: string,
  theme?: ThemeTokens,
): string {
  const {
    src,
    poster,
    controls = true,
    aspectRatio = "16:9",
  } = (block as any).props;

  const ratioMap: Record<string, string> = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
    "9:16": "177.78%",
  };

  const isYouTube = src?.includes("youtube.com") || src?.includes("youtu.be");
  const isVimeo = src?.includes("vimeo.com");

  if (isYouTube || isVimeo) {
    let embedUrl = src;
    if (isYouTube) {
      const videoId = src.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/,
      )?.[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (isVimeo) {
      const videoId = src.match(/vimeo\.com\/([\d]+)/)?.[1];
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    return `<div ${dataBlockIdAttr(block.id)} style="position: relative; padding-bottom: ${ratioMap[aspectRatio]}; height: 0; overflow: hidden;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>`;
  }

  return `<video ${dataBlockIdAttr(block.id)} src="${escapeHtml(src)}" ${poster ? `poster="${escapeHtml(poster)}"` : ""} ${controls ? "controls" : ""} style="width: 100%; border-radius: var(--sg-radius, 0.5rem);"></video>`;
}
