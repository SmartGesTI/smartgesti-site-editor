/**
 * useDebounce Hook
 * Hook para debounce de valores
 */

import { useState, useEffect } from 'react'

/**
 * Debounce de um valor
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Criar timer
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpar timer se value mudar antes do delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
