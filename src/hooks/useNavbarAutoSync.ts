/**
 * useNavbarAutoSync Hook
 * Hook para sincronização automática de links do navbar
 * Detecta mudanças nas páginas e atualiza navbar automaticamente
 */

import { useEffect, useRef } from "react";
import { SiteDocument } from "../engine/schema/siteDocument";
import { syncNavbarLinks } from "../utils/navbarSync";

/**
 * Hook para sincronização automática de links do navbar
 * Detecta mudanças nas páginas e atualiza navbar automaticamente
 */
export function useNavbarAutoSync(
  document: SiteDocument | null,
  applyChange: (patch: any[], description?: string) => void
) {
  const previousPagesRef = useRef<string>("");

  useEffect(() => {
    if (!document) return;

    // Criar hash das páginas (id, name, slug)
    const pagesHash = JSON.stringify(
      document.pages.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))
    );

    // Se mudou, sincronizar navbar
    if (previousPagesRef.current && previousPagesRef.current !== pagesHash) {
      const patches = syncNavbarLinks(document);
      if (patches.length > 0) {
        applyChange(patches, "Auto-sync navbar links");
      }
    }

    previousPagesRef.current = pagesHash;
  }, [document, applyChange]);
}
