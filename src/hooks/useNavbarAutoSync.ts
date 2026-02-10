/**
 * useNavbarAutoSync Hook
 * Hook para sincronização automática de links do navbar
 * Detecta mudanças nas páginas e atualiza navbar automaticamente.
 *
 * Skips sync when plugin pages are added/removed — plugin onActivate/onDeactivate
 * already handles navbar links and auto-sync would destroy custom links.
 */

import { useEffect, useRef } from "react";
import { SiteDocument } from "../engine/schema/siteDocument";
import { syncNavbarLinks } from "../utils/navbarSync";

interface PageSnapshot {
  id: string;
  name: string;
  slug: string;
  pluginId?: string;
}

/**
 * Hook para sincronização automática de links do navbar
 * Detecta mudanças nas páginas e atualiza navbar automaticamente
 */
export function useNavbarAutoSync(
  document: SiteDocument | null,
  applyChange: (patch: any[], description?: string) => void
) {
  const previousPagesRef = useRef<PageSnapshot[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!document) return;

    const currentPages: PageSnapshot[] = document.pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      pluginId: p.pluginId,
    }));

    const prevPages = previousPagesRef.current;

    // Skip first render (no previous state to compare)
    if (!initializedRef.current) {
      initializedRef.current = true;
      previousPagesRef.current = currentPages;
      return;
    }

    // Detect what changed
    const prevIds = new Set(prevPages.map((p) => p.id));
    const currIds = new Set(currentPages.map((p) => p.id));

    const addedPages = currentPages.filter((p) => !prevIds.has(p.id));
    const removedPages = prevPages.filter((p) => !currIds.has(p.id));

    const hasPluginPagesChanged =
      addedPages.some((p) => p.pluginId) ||
      removedPages.some((p) => p.pluginId);

    // Check if non-plugin pages were renamed or re-slugged
    const hasRegularPageChanges = currentPages.some((p) => {
      if (p.pluginId) return false;
      const prev = prevPages.find((pp) => pp.id === p.id);
      return prev && (prev.name !== p.name || prev.slug !== p.slug);
    });

    // Check if non-plugin pages were added or removed
    const hasRegularPageAdded = addedPages.some((p) => !p.pluginId);
    const hasRegularPageRemoved = removedPages.some((p) => !p.pluginId);

    // Only sync if changes are from regular pages (not plugins)
    // Plugin onActivate/onDeactivate manages its own navbar links
    const shouldSync =
      !hasPluginPagesChanged &&
      (hasRegularPageChanges || hasRegularPageAdded || hasRegularPageRemoved);

    if (shouldSync) {
      const patches = syncNavbarLinks(document);
      if (patches.length > 0) {
        applyChange(patches, "Auto-sync navbar links");
      }
    }

    previousPagesRef.current = currentPages;
  }, [document, applyChange]);
}
