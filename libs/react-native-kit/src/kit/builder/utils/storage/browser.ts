import type { AuthStorage } from '../../types'
import { isBrowser } from './env'
import { createMemoryStorage } from './memory'
import { SimpleEncryption } from './encryption'

export type BrowserStorageOptions<T> = {
  key: string
  serialize?: (value: T | null) => Promise<string | null> | string | null
  deserialize?: (value: string | null) => Promise<T | null> | T | null
  storage?: Storage
  encrypt?: boolean
  encryptionKey?: string
}

export const createBrowserStorage = <T>(
  options: BrowserStorageOptions<T>,
): AuthStorage<T> => {
  const fallback = createMemoryStorage<T>()
  const targetStorage =
    options.storage ?? (isBrowser ? window.localStorage : undefined)

  const encryption =
    options.encrypt && options.encryptionKey
      ? new SimpleEncryption(options.encryptionKey)
      : null

  const defaultSerialize = async (value: T | null): Promise<string | null> => {
    if (value === null) return null
    const json = JSON.stringify(value)
    return encryption ? await encryption.encrypt(json) : json
  }

  const defaultDeserialize = async (
    value: string | null,
  ): Promise<T | null> => {
    if (!value) return null
    try {
      const decrypted = encryption ? await encryption.decrypt(value) : value
      return JSON.parse(decrypted) as T
    } catch {
      return null
    }
  }

  const serialize = options.serialize
    ? async (value: T | null) => {
        const result = await options.serialize?.(value)
        return result ?? null
      }
    : defaultSerialize

  const deserialize = options.deserialize
    ? async (value: string | null) => {
        const result = await options.deserialize?.(value)
        return result ?? null
      }
    : defaultDeserialize

  if (!targetStorage) {
    return fallback
  }

  return {
    get: async () => {
      try {
        const raw = targetStorage.getItem(options.key)
        const value = await deserialize(raw)
        fallback.set(value)
        return value
      } catch (error) {
        console.warn('[auth2][storage] Failed to read from storage', error)
        return fallback.get()
      }
    },
    set: async (value) => {
      try {
        const serialized = await serialize(value)
        if (serialized === null) {
          targetStorage.removeItem(options.key)
        } else {
          targetStorage.setItem(options.key, serialized)
        }
        fallback.set(value)
      } catch (error) {
        console.warn('[auth2][storage] Failed to write to storage', error)
        fallback.set(value)
      }
    },
    clear: () => {
      try {
        targetStorage.removeItem(options.key)
      } catch (error) {
        console.warn('[auth2][storage] Failed to clear storage', error)
      } finally {
        fallback.clear()
      }
    },
  }
}
