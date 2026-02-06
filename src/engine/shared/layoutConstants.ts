/**
 * Layout constants compartilhados entre renderers e exporters
 */

/** Maps content position to CSS flexbox justify-content */
export const contentPositionMap: Record<string, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

/** Block gap presets for two-block layouts (hero split, etc.) */
export const blockGapConfig: Record<string, {
  justify: string;
  blockMaxWidth: string;
  containerMaxWidth: string;
  gap: string;
}> = {
  default: { justify: "center", blockMaxWidth: "45%", containerMaxWidth: "1200px", gap: "4rem" },
  wide: { justify: "space-between", blockMaxWidth: "45%", containerMaxWidth: "1400px", gap: "2rem" },
  "x-wide": { justify: "space-between", blockMaxWidth: "43%", containerMaxWidth: "100%", gap: "2rem" },
};
