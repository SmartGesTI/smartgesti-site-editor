/**
 * Composition Renderers
 * Auto-registra todos os renderizadores de composição
 */

import { renderRegistry } from "../../registry/renderRegistry";
import { renderCard } from "./CardRenderer";
import { renderSection } from "./SectionRenderer";

// Registrar renderizadores
renderRegistry.register("card", renderCard);
renderRegistry.register("section", renderSection);
