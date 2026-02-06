/**
 * Document Hash
 * Funções para gerar hash de documentos para cache
 */

import { SiteDocumentV2 } from '../engine/schema/siteDocument'
import { logger } from './logger'

/**
 * Gera hash simples de uma string
 * Usa algoritmo djb2 (simples e rápido)
 */
function simpleHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Gera hash do documento baseado em seu conteúdo
 * Usa JSON.stringify para serializar e depois hash
 */
export function hashDocument(document: SiteDocumentV2): string {
  try {
    // Serializar documento (sem espaços para consistência)
    const serialized = JSON.stringify(document, null, 0)
    return simpleHash(serialized)
  } catch (error) {
    logger.error('Error hashing document:', error)
    // Fallback: usar timestamp se houver erro
    return Date.now().toString(36)
  }
}

/**
 * Gera hash de um bloco específico
 * Útil para cache de blocos individuais
 */
export function hashBlock(block: any): string {
  try {
    const serialized = JSON.stringify(block, null, 0)
    return simpleHash(serialized)
  } catch (error) {
    logger.error('Error hashing block:', error)
    return Date.now().toString(36)
  }
}
