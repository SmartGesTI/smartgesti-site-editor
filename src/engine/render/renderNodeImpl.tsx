/**
 * Render Node Implementation
 * Implementação da renderização de blocos usando Registry Pattern
 *
 * REFATORAÇÃO FASE 3:
 * - Switch gigante substituído por lookup no registry
 * - Renderizadores extraídos para arquivos separados
 * - Auto-registro via barrel imports
 */

import React from "react";
import { Block } from "../schema/siteDocument";
import { renderRegistry } from "./registry/renderRegistry";
import { logger } from "../../utils/logger";

// Auto-importa e registra TODOS os renderizadores
// O import por si só executa o código de registro em cada index.ts
import "./renderers";

/**
 * Renderiza um bloco recursivamente
 * Factory pattern com lookup O(1) no registry
 */
export function renderBlockNode(
  block: Block,
  depth: number = 0,
): React.ReactNode {
  const renderer = renderRegistry.get(block.type);

  if (renderer) {
    return renderer(block, depth);
  }

  logger.warn(`Unknown block type: ${block.type}`);
  return (
    <div
      key={block.id}
      style={{
        padding: "1rem",
        backgroundColor: "#fee",
        color: "#c00",
        borderRadius: "0.25rem",
      }}
    >
      Bloco desconhecido: {block.type}
    </div>
  );
}
