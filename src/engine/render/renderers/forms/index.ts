/**
 * Form Renderers
 * Auto-registra todos os renderizadores de formulários
 */

import { renderRegistry } from "../../registry/renderRegistry";
import { renderForm } from "./FormRenderer";
import { renderInput } from "./InputRenderer";
import { renderTextarea } from "./TextareaRenderer";
import { renderFormSelect } from "./SelectRenderer";

// Registrar renderizadores
renderRegistry.register("form", renderForm);
renderRegistry.register("input", renderInput);
renderRegistry.register("textarea", renderTextarea);
renderRegistry.register("formSelect", renderFormSelect);
