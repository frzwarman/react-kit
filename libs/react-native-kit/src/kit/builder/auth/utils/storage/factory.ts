import type { AuthStorage, StorageOptions } from '../../types'
import { createMemoryStorage } from './memory'
import { createNativeStorage } from './native'

/**
 * Creates appropriate storage based on options and environment
 * - React Native: AsyncStorage (via createNativeStorage)
 * - Fallback: Memory storage
 *
 * Note: Browser-specific storage (localStorage, sessionStorage, cookies) is not supported
 * in React Native. Use 'native' or 'memory' storage types.
 */
export function createStorage<T>(options: StorageOptions = {}): AuthStorage<T> {
  const storageType = options.storage ?? 'native'
  const key = options.key ?? 'auth2_session'

  switch (storageType) {
    case 'native':
      try {
        // Try to use native storage (AsyncStorage)
        return createNativeStorage<T>({
          key,
          encrypt: options.encrypt,
          encryptionKey: options.encryptionKey,
        })
      } catch {
        // Fall back to memory if AsyncStorage is not available
        console.warn(
          '[auth2][storage] AsyncStorage not available, falling back to memory storage',
        )
        return createMemoryStorage<T>()
      }

    case 'memory':
    default:
      return createMemoryStorage<T>()
  }
}
