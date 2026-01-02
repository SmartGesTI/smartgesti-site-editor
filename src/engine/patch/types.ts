/**
 * JSON Patch Types (RFC 6902)
 */

export type PatchOperation = AddOperation | RemoveOperation | ReplaceOperation | MoveOperation | CopyOperation | TestOperation

export interface AddOperation {
  op: 'add'
  path: string
  value: any
}

export interface RemoveOperation {
  op: 'remove'
  path: string
}

export interface ReplaceOperation {
  op: 'replace'
  path: string
  value: any
}

export interface MoveOperation {
  op: 'move'
  from: string
  path: string
}

export interface CopyOperation {
  op: 'copy'
  from: string
  path: string
}

export interface TestOperation {
  op: 'test'
  path: string
  value: any
}

export type Patch = PatchOperation[]

/**
 * Resultado da aplicação de um patch
 */
export interface PatchResult {
  success: boolean
  document?: any
  errors?: string[]
}
