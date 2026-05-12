import type { AuthStorage } from '../../types'

export const createMemoryStorage = <T>(): AuthStorage<T> => {
  let value: T | null = null

  return {
    get: () => value,
    set: (next) => {
      value = next
    },
    clear: () => {
      value = null
    },
  }
}
