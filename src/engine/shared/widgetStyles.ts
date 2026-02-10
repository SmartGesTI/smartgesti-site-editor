/**
 * Widget Styles — Shared constants for blog sidebar widgets
 * Used by renderers and exporters to maintain consistency
 */

/** Shadow presets for widget cards */
export const widgetShadowMap: Record<string, string> = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
};

/** Resolve shadow prop to CSS value */
export function resolveWidgetShadow(shadow?: string): string {
  return widgetShadowMap[shadow || "none"] || "none";
}
