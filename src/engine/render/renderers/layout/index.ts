/**
 * Layout Renderers
 * Auto-registra todos os renderizadores de layout
 */

import { renderRegistry } from "../../registry/renderRegistry";
import { renderContainer } from "./ContainerRenderer";
import { renderStack } from "./StackRenderer";
import { renderGrid } from "./GridRenderer";
import { renderBox } from "./BoxRenderer";
import { renderSpacer } from "./SpacerRenderer";

// Registrar renderizadores
renderRegistry.register("container", renderContainer);
renderRegistry.register("stack", renderStack);
renderRegistry.register("grid", renderGrid);
renderRegistry.register("box", renderBox);
renderRegistry.register("spacer", renderSpacer);
