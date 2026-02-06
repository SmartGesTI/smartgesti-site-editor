/**
 * Logger utility — silenciável em produção
 *
 * Em dev: exibe tudo.
 * Em produção: só warn/error (e somente se explicitamente habilitado).
 */

const isDev =
  typeof process !== "undefined"
    ? process.env.NODE_ENV !== "production"
    : typeof import.meta !== "undefined" &&
      (import.meta as any).env?.DEV === true;

function noop() {}

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: isDev ? console.log.bind(console) : noop,
} as const;
