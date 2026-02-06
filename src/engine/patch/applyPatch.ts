/**
 * JSON Patch Implementation (RFC 6902)
 * Aplica patches em documentos
 */

import { Patch, PatchResult } from './types'

/**
 * Obtém valor de um caminho JSON
 */
function getValue(obj: any, path: string): any {
  const parts = path.split('/').filter((p) => p !== '')
  let current = obj

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined
    }
    current = current[part]
  }

  return current
}

/**
 * Define valor em um caminho JSON
 */
function setValue(obj: any, path: string, value: any): void {
  const parts = path.split('/').filter((p) => p !== '')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || current[part] === null) {
      current[part] = {}
    }
    current = current[part]
  }

  const lastPart = parts[parts.length - 1]
  current[lastPart] = value
}

/**
 * Remove valor de um caminho JSON
 */
function removeValue(obj: any, path: string): void {
  const parts = path.split('/').filter((p) => p !== '')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || current[part] === null) {
      return
    }
    current = current[part]
  }

  const lastPart = parts[parts.length - 1]
  
  // Se estamos removendo de um array, usar splice para remover completamente
  if (Array.isArray(current)) {
    const index = parseInt(lastPart, 10)
    if (!isNaN(index) && index >= 0 && index < current.length) {
      current.splice(index, 1)
    }
  } else {
    // Para objetos, usar delete
    delete current[lastPart]
  }
}

/**
 * Aplica operação add
 */
function applyAdd(obj: any, operation: { path: string; value: any }): { success: boolean; error?: string } {
  try {
    const parts = operation.path.split('/').filter((p) => p !== '')
    if (parts.length === 0) {
      // Adicionar na raiz - substituir objeto inteiro
      Object.assign(obj, operation.value)
      return { success: true }
    }

    const lastPart = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('/')
    let parent = parentPath ? getValue(obj, parentPath) : obj

    // Se o parent não existe, criar o caminho
    if (parent === undefined || parent === null) {
      if (parentPath) {
        // Criar caminho pai usando setValue
        const parentParts = parentPath.split('/').filter((p) => p !== '')
        let current = obj
        for (let i = 0; i < parentParts.length; i++) {
          const part = parentParts[i]
          if (current[part] === undefined || current[part] === null) {
            // Verificar se próximo é número (array index)
            const nextPart = parentParts[i + 1]
            if (nextPart && !isNaN(parseInt(nextPart, 10))) {
              current[part] = []
            } else {
              current[part] = {}
            }
          }
          current = current[part]
        }
        parent = current
      } else {
        parent = obj
      }
    }

    if (Array.isArray(parent)) {
      const index = parseInt(lastPart, 10)
      if (isNaN(index)) {
        return { success: false, error: `Invalid array index: ${lastPart}` }
      }
      if (index === parent.length) {
        parent.push(operation.value)
      } else if (index >= 0 && index < parent.length) {
        parent.splice(index, 0, operation.value)
      } else {
        return { success: false, error: `Array index out of bounds: ${index}` }
      }
    } else {
      parent[lastPart] = operation.value
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica operação remove
 */
function applyRemove(obj: any, operation: { path: string }): { success: boolean; error?: string } {
  try {
    const value = getValue(obj, operation.path)
    if (value === undefined) {
      return { success: false, error: `Path ${operation.path} does not exist` }
    }

    removeValue(obj, operation.path)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica operação replace
 */
function applyReplace(obj: any, operation: { path: string; value: any }): { success: boolean; error?: string } {
  try {
    const value = getValue(obj, operation.path)
    if (value === undefined) {
      // Se o caminho não existe, usar add em vez de replace
      return applyAdd(obj, operation)
    }

    setValue(obj, operation.path, operation.value)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica operação move
 */
function applyMove(obj: any, operation: { from: string; path: string }): { success: boolean; error?: string } {
  try {
    const value = getValue(obj, operation.from)
    if (value === undefined) {
      return { success: false, error: `Source path ${operation.from} does not exist` }
    }

    // Remover do source
    const removeResult = applyRemove(obj, { path: operation.from })
    if (!removeResult.success) {
      return removeResult
    }

    // Adicionar no destino
    const addResult = applyAdd(obj, { path: operation.path, value })
    if (!addResult.success) {
      // Tentar restaurar
      applyAdd(obj, { path: operation.from, value })
      return addResult
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica operação copy
 */
function applyCopy(obj: any, operation: { from: string; path: string }): { success: boolean; error?: string } {
  try {
    const value = getValue(obj, operation.from)
    if (value === undefined) {
      return { success: false, error: `Source path ${operation.from} does not exist` }
    }

    // Deep clone
    const clonedValue = JSON.parse(JSON.stringify(value))

    // Adicionar no destino
    return applyAdd(obj, { path: operation.path, value: clonedValue })
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica operação test
 */
function applyTest(obj: any, operation: { path: string; value: any }): { success: boolean; error?: string } {
  try {
    const actualValue = getValue(obj, operation.path)
    const expectedValue = operation.value

    // Comparação profunda
    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      return { success: false, error: `Test failed: value at ${operation.path} does not match` }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Aplica um patch em um documento
 */
export function applyPatch(document: any, patch: Patch): PatchResult {
  // Deep clone do documento
  const clonedDoc = JSON.parse(JSON.stringify(document))
  const errors: string[] = []

  for (const operation of patch) {
    let result: { success: boolean; error?: string }

    switch (operation.op) {
      case 'add':
        result = applyAdd(clonedDoc, operation)
        break
      case 'remove':
        result = applyRemove(clonedDoc, operation)
        break
      case 'replace':
        result = applyReplace(clonedDoc, operation)
        break
      case 'move':
        result = applyMove(clonedDoc, operation)
        break
      case 'copy':
        result = applyCopy(clonedDoc, operation)
        break
      case 'test':
        result = applyTest(clonedDoc, operation)
        break
      default:
        result = { success: false, error: `Unknown operation: ${(operation as Record<string, any>).op}` }
    }

    if (!result.success) {
      errors.push(result.error || 'Unknown error')
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    }
  }

  return {
    success: true,
    document: clonedDoc,
  }
}

/**
 * Cria um patch para adicionar um valor
 */
export function createAddPatch(path: string, value: any): Patch {
  return [{ op: 'add', path, value }]
}

/**
 * Cria um patch para remover um valor
 */
export function createRemovePatch(path: string): Patch {
  return [{ op: 'remove', path }]
}

/**
 * Cria um patch para substituir um valor
 */
export function createReplacePatch(path: string, value: any): Patch {
  return [{ op: 'replace', path, value }]
}

/**
 * Cria um patch para mover um valor
 */
export function createMovePatch(from: string, path: string): Patch {
  return [{ op: 'move', from, path }]
}

/**
 * Cria um patch para copiar um valor
 */
export function createCopyPatch(from: string, path: string): Patch {
  return [{ op: 'copy', from, path }]
}
