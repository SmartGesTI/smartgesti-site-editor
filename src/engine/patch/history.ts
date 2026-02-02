/**
 * History Manager
 * Gerencia histórico de mudanças para undo/redo
 */

import { Patch } from './types'
import { applyPatch } from './applyPatch'

export interface HistoryEntry {
  id: string
  patch: Patch
  inversePatch: Patch
  timestamp: number
  description?: string
}

/**
 * Gerenciador de histórico
 */
export class HistoryManager {
  private history: HistoryEntry[] = []
  private currentIndex: number = -1
  private maxHistorySize: number = 50

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize
  }

  /**
   * Adiciona uma entrada ao histórico
   * IMPORTANTE: Deve ser chamado ANTES de aplicar o patch ao documento
   */
  push(document: any, patch: Patch, description?: string): void {
    // Remove entradas futuras se estivermos no meio do histórico
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    // Capturar inverse patch ANTES de aplicar mudanças
    const inversePatch = this.captureInversePatch(document, patch)

    const entry: HistoryEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      patch,
      inversePatch,
      timestamp: Date.now(),
      description,
    }

    this.history.push(entry)

    // Limitar tamanho do histórico
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    } else {
      this.currentIndex++
    }
  }

  /**
   * Desfaz última mudança
   */
  undo(document: any): { success: boolean; document?: any; error?: string } {
    if (!this.canUndo()) {
      return { success: false, error: 'Nothing to undo' }
    }

    const entry = this.history[this.currentIndex]
    this.currentIndex--

    // Usar inverse patch armazenado
    const result = applyPatch(document, entry.inversePatch)

    if (!result.success) {
      // Restaurar índice se falhar
      this.currentIndex++
      return { success: false, error: result.errors?.join(', ') }
    }

    return {
      success: true,
      document: result.document,
    }
  }

  /**
   * Refaz última mudança desfeita
   */
  redo(document: any): { success: boolean; document?: any; error?: string } {
    if (!this.canRedo()) {
      return { success: false, error: 'Nothing to redo' }
    }

    this.currentIndex++
    const entry = this.history[this.currentIndex]

    const result = applyPatch(document, entry.patch)

    if (!result.success) {
      // Restaurar índice se falhar
      this.currentIndex--
      return { success: false, error: result.errors?.join(', ') }
    }

    return {
      success: true,
      document: result.document,
    }
  }

  /**
   * Verifica se pode desfazer
   */
  canUndo(): boolean {
    return this.currentIndex >= 0
  }

  /**
   * Verifica se pode refazer
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * Limpa histórico
   */
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }

  /**
   * Obtém histórico
   */
  getHistory(): readonly HistoryEntry[] {
    return this.history
  }

  /**
   * Obtém índice atual
   */
  getCurrentIndex(): number {
    return this.currentIndex
  }

  /**
   * Obtém valor de um caminho no documento
   */
  private getValue(obj: any, path: string): any {
    const parts = path.split('/').filter(p => p !== '')
    let current = obj
    for (const part of parts) {
      if (current === undefined || current === null) return undefined
      current = current[part]
    }
    return current
  }

  /**
   * Captura patch inverso ANTES de aplicar mudanças (armazena valores anteriores)
   */
  private captureInversePatch(document: any, patch: Patch): Patch {
    const inverse: Patch = []

    // Reverter operações na ordem inversa
    for (let i = patch.length - 1; i >= 0; i--) {
      const op = patch[i]

      switch (op.op) {
        case 'add':
          // Inverso: remove
          inverse.push({ op: 'remove', path: op.path })
          break
        case 'remove':
          // Inverso: add com valor capturado
          const removedValue = this.getValue(document, op.path)
          if (removedValue !== undefined) {
            inverse.push({ op: 'add', path: op.path, value: removedValue })
          }
          break
        case 'replace':
          // Inverso: replace com valor anterior capturado
          const previousValue = this.getValue(document, op.path)
          if (previousValue !== undefined) {
            inverse.push({ op: 'replace', path: op.path, value: previousValue })
          }
          break
        case 'move':
          // Inverso: move de volta
          inverse.push({ op: 'move', from: op.path, path: op.from })
          break
        case 'copy':
          // Inverso: remove
          inverse.push({ op: 'remove', path: op.path })
          break
        case 'test':
          // Test não precisa de inverso
          break
      }
    }

    return inverse
  }

  /**
   * Cria patch inverso (para undo) - DEPRECADO: use captureInversePatch
   * @deprecated Use captureInversePatch que captura valores do documento
   */
  private createInversePatch(patch: Patch): Patch {
    const inverse: Patch = []

    // Reverter operações na ordem inversa
    for (let i = patch.length - 1; i >= 0; i--) {
      const op = patch[i]

      switch (op.op) {
        case 'add':
          // Inverso: remove
          inverse.push({ op: 'remove', path: op.path })
          break
        case 'remove':
          // Inverso: add (precisa do valor original - não temos, então não podemos reverter perfeitamente)
          // Por enquanto, vamos apenas marcar como erro
          break
        case 'replace':
          // Inverso: replace com valor anterior (não temos, então não podemos reverter perfeitamente)
          break
        case 'move':
          // Inverso: move de volta
          inverse.push({ op: 'move', from: op.path, path: op.from })
          break
        case 'copy':
          // Inverso: remove
          inverse.push({ op: 'remove', path: op.path })
          break
        case 'test':
          // Test não precisa de inverso
          break
      }
    }

    return inverse
  }
}

/**
 * Cria um novo gerenciador de histórico
 */
export function createHistoryManager(maxHistorySize: number = 50): HistoryManager {
  return new HistoryManager(maxHistorySize)
}
