import type { AuthStorage, StorageOptions } from '../../types'
import { isBrowser } from './env'
import { createMemoryStorage } from './memory'
import { createCookieStorage } from './cookie'
import { createBrowserStorage } from './browser'

/**
 * Creates appropriate storage based on options
 */
export function createStorage<T>(options: StorageOptions = {}): AuthStorage<T> {
  const storageType = options.storage ?? 'local'
  const key = options.key ?? 'auth2_session'

  switch (storageType) {
    case 'cookie':
      return createCookieStorage<T>(options)

    case 'session':
      return createBrowserStorage<T>({
        key,
        storage: isBrowser ? window.sessionStorage : undefined,
        encrypt: options.encrypt,
        encryptionKey: options.encryptionKey,
      })

    case 'local':
      return createBrowserStorage<T>({
        key,
        storage: isBrowser ? window.localStorage : undefined,
        encrypt: options.encrypt,
        encryptionKey: options.encryptionKey,
      })

    default:
      return createMemoryStorage<T>()
  }
}
