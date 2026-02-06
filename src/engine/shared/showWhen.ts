/**
 * ShowWhen — Sistema de visibilidade condicional avançado
 *
 * Suporta:
 * - Igualdade simples (backward compatible)
 * - OR de valores (oneOf)
 * - AND/OR compostos
 * - Cross-block (verificar props de outros blocos)
 * - Comparações numéricas
 * - Tamanho de array
 * - Truthiness
 */

import type { BlockType, SiteDocument } from "../schema/siteDocument";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Condição atômica — backward compatible com o shape anterior */
export interface ShowWhenFieldCondition {
  field: string;
  /** Cross-block: busca o primeiro bloco desse tipo na página atual */
  blockType?: BlockType;

  // Igualdade (existente)
  equals?: string | boolean | number;
  notEquals?: string | boolean | number;

  // Set de valores
  oneOf?: Array<string | boolean | number>;
  notOneOf?: Array<string | boolean | number>;

  // Truthiness
  truthy?: boolean;

  // Numérico
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;

  // Array
  arrayLengthGt?: number;
  arrayLengthLt?: number;
}

/** Composição AND — todas as condições devem ser verdadeiras */
export interface ShowWhenAndCondition {
  and: ShowWhenCondition[];
}

/** Composição OR — pelo menos uma condição deve ser verdadeira */
export interface ShowWhenOrCondition {
  or: ShowWhenCondition[];
}

/** Union final de condições */
export type ShowWhenCondition =
  | ShowWhenFieldCondition
  | ShowWhenAndCondition
  | ShowWhenOrCondition;

/** Contexto para resolução cross-block */
export interface ShowWhenContext {
  document?: SiteDocument;
  currentPageId?: string;
}

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

function isAndCondition(c: ShowWhenCondition): c is ShowWhenAndCondition {
  return "and" in c;
}

function isOrCondition(c: ShowWhenCondition): c is ShowWhenOrCondition {
  return "or" in c;
}

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

/**
 * Avalia uma condição showWhen contra as props do bloco.
 *
 * @param condition  A condição (atômica, AND ou OR)
 * @param props      Props atuais do bloco
 * @param defaultProps  Props padrão do bloco (fallback)
 * @param context    Contexto opcional para cross-block
 * @returns true se a propriedade deve ser exibida
 */
export function evaluateShowWhen(
  condition: ShowWhenCondition,
  props: Record<string, any>,
  defaultProps: Record<string, any>,
  context?: ShowWhenContext,
): boolean {
  // AND: todas devem ser verdadeiras
  if (isAndCondition(condition)) {
    return condition.and.every((c) =>
      evaluateShowWhen(c, props, defaultProps, context),
    );
  }

  // OR: pelo menos uma deve ser verdadeira
  if (isOrCondition(condition)) {
    return condition.or.some((c) =>
      evaluateShowWhen(c, props, defaultProps, context),
    );
  }

  // Field condition
  return evaluateFieldCondition(condition, props, defaultProps, context);
}

/**
 * Avalia uma condição de campo individual.
 */
function evaluateFieldCondition(
  condition: ShowWhenFieldCondition,
  props: Record<string, any>,
  defaultProps: Record<string, any>,
  context?: ShowWhenContext,
): boolean {
  // Resolver valor — cross-block ou local
  let value: any;

  if (condition.blockType && context?.document && context.currentPageId) {
    value = resolveCrossBlockValue(
      condition.blockType,
      condition.field,
      context.document,
      context.currentPageId,
    );
  } else {
    value = props[condition.field] ?? defaultProps[condition.field];
  }

  // Avaliar cada operador — se qualquer um falha, retorna false
  // (operadores são combinados com AND implícito)

  if (condition.equals !== undefined && value !== condition.equals) {
    return false;
  }

  if (condition.notEquals !== undefined && value === condition.notEquals) {
    return false;
  }

  if (condition.oneOf !== undefined && !condition.oneOf.includes(value)) {
    return false;
  }

  if (condition.notOneOf !== undefined && condition.notOneOf.includes(value)) {
    return false;
  }

  if (condition.truthy !== undefined) {
    if (condition.truthy && !value) return false;
    if (!condition.truthy && !!value) return false;
  }

  if (condition.gt !== undefined && !(typeof value === "number" && value > condition.gt)) {
    return false;
  }

  if (condition.gte !== undefined && !(typeof value === "number" && value >= condition.gte)) {
    return false;
  }

  if (condition.lt !== undefined && !(typeof value === "number" && value < condition.lt)) {
    return false;
  }

  if (condition.lte !== undefined && !(typeof value === "number" && value <= condition.lte)) {
    return false;
  }

  if (
    condition.arrayLengthGt !== undefined &&
    !(Array.isArray(value) && value.length > condition.arrayLengthGt)
  ) {
    return false;
  }

  if (
    condition.arrayLengthLt !== undefined &&
    !(Array.isArray(value) && value.length < condition.arrayLengthLt)
  ) {
    return false;
  }

  return true;
}

/**
 * Resolve o valor de uma prop de outro bloco na página atual.
 * Busca apenas top-level (navbar, footer são sempre top-level).
 */
function resolveCrossBlockValue(
  blockType: BlockType,
  field: string,
  document: SiteDocument,
  currentPageId: string,
): any {
  const page = document.pages.find((p) => p.id === currentPageId);
  if (!page) return undefined;

  const block = page.structure.find((b) => b.type === blockType);
  if (!block) return undefined;

  return (block.props as Record<string, any>)[field];
}
