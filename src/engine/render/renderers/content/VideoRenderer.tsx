/**
 * Video Renderer
 * Renderiza vídeos (HTML5, YouTube, Vimeo)
 */

import React from "react";

export function renderVideo(block: any): React.ReactNode {
  const { src, poster, controls = true, aspectRatio = "16:9" } = block.props;

  const ratioMap: Record<string, string> = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
    "9:16": "177.78%",
  };

  // Check if it's a YouTube URL
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

    return (
      <div
        key={block.id}
        style={{
          position: "relative",
          paddingBottom: ratioMap[aspectRatio],
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      key={block.id}
      src={src}
      poster={poster}
      controls={controls}
      style={{ width: "100%", borderRadius: "var(--sg-radius, 0.5rem)" }}
    />
  );
}
