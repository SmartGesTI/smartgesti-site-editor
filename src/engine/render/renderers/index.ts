/**
 * Renderers Barrel File
 * Importa e auto-registra TODOS os renderizadores
 *
 * Este arquivo é importado no renderNodeImpl.tsx para garantir
 * que todos os renderizadores sejam registrados antes do uso.
 */

// Importar todos os index.ts das categorias
// O import por si só já executa o código de registro
import "./layout";
import "./content";
import "./composition";
import "./sections";
import "./forms";

// Export do registry para acesso externo se necessário
export { renderRegistry } from "../registry/renderRegistry";
