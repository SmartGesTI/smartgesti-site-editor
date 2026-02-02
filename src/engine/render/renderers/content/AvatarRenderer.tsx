/**
 * Avatar Renderer
 * Renderiza avatar com imagem ou iniciais
 */

import React from "react";

export function renderAvatar(block: any): React.ReactNode {
  const { src, name, size = "md" } = block.props;

  const sizeMap: Record<string, string> = {
    sm: "var(--sg-avatar-sm, 2rem)",
    md: "var(--sg-avatar-md, 2.5rem)",
    lg: "var(--sg-avatar-lg, 3rem)",
    xl: "var(--sg-avatar-xl, 4rem)",
  };

  const avatarSize = sizeMap[size] || sizeMap.md;
  const initials = name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (src) {
    return (
      <img
        key={block.id}
        src={src}
        alt={name || "Avatar"}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div
      key={block.id}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        backgroundColor: "var(--sg-primary, #3b82f6)",
        color: "var(--sg-primary-text, #fff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: `calc(${avatarSize} / 2.5)`,
      }}
    >
      {initials}
    </div>
  );
}
