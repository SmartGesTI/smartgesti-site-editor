/**
 * Plugin System — barrel export
 */

export { pluginRegistry } from "./pluginRegistry";
export type { PluginRegistry } from "./pluginRegistry";

export { hydratePageWithContent } from "./contentHydration";
export type { ContentProviderMap } from "./contentHydration";

export { matchDynamicPage } from "./dynamicPageResolver";
export type { DynamicPageMatch } from "./dynamicPageResolver";

export type {
  DataSchemaField,
  DataSchema,
  ContentListParams,
  ContentItem,
  ContentListResult,
  ContentProvider,
  PageDataSource,
  PageEditRestrictions,
  PageTemplate,
  EditorRestriction,
  PluginManifest,
  PluginRegistration,
  SitePluginsConfig,
} from "./types";
