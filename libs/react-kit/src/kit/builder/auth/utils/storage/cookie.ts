import type { AuthStorage, StorageOptions } from '../../types'
import { isBrowser } from './env'
import { createMemoryStorage } from './memory'
import { SimpleEncryption } from './encryption'

export const createCookieStorage = <T>(
  options: StorageOptions,
): AuthStorage<T> => {
  const key = options.key ?? 'auth2_session'
  const cookieOpts = options.cookieOptions ?? {}
  const fallback = createMemoryStorage<T>()
  const encryption =
    options.encrypt && options.encryptionKey
      ? new SimpleEncryption(options.encryptionKey)
      : null
  const cookieSetter =
    typeof Document !== 'undefined'
      ? Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')?.set
      : undefined

  const assignCookie = (value: string) => {
    if (!isBrowser || typeof document === 'undefined') return
    if (cookieSetter) {
      cookieSetter.call(document, value)
      return
    }
    Reflect.set(document, 'cookie', value)
  }

  const serialize = async (value: T | null): Promise<string | null> => {
    if (value === null) return null
    const json = JSON.stringify(value)
    return encryption ? await encryption.encrypt(json) : json
  }

  const deserialize = async (value: string | null): Promise<T | null> => {
    if (!value) return null
    try {
      const decrypted = encryption ? await encryption.decrypt(value) : value
      return JSON.parse(decrypted) as T
    } catch {
      return null
    }
  }

  const getCookie = (name: string): string | null => {
    if (!isBrowser) return null
    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1')}=([^;]*)`,
      ),
    )
    return matches ? decodeURIComponent(matches[1]) : null
  }

  const setCookie = (
    name: string,
    value: string,
    opts: typeof cookieOpts = {},
  ) => {
    if (!isBrowser) return

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (opts.maxAge) cookie += `; max-age=${opts.maxAge}`
    if (opts.domain) cookie += `; domain=${opts.domain}`
    if (opts.path !== undefined) cookie += `; path=${opts.path}`
    else cookie += '; path=/'
    if (opts.secure) cookie += '; secure'
    if (opts.sameSite) cookie += `; samesite=${opts.sameSite}`

    assignCookie(cookie)
  }

  const deleteCookie = (name: string) => {
    if (!isBrowser) return
    assignCookie(`${name}=; max-age=0; path=/`)
  }

  return {
    get: async () => {
      try {
        const raw = getCookie(key)
        const value = await deserialize(raw)
        fallback.set(value)
        return value
      } catch (error) {
        console.warn('[auth2][storage] Failed to read from cookie', error)
        return fallback.get()
      }
    },
    set: async (value) => {
      try {
        const serialized = await serialize(value)
        if (serialized === null) {
          deleteCookie(key)
        } else {
          setCookie(key, serialized, cookieOpts)
        }
        fallback.set(value)
      } catch (error) {
        console.warn('[auth2][storage] Failed to write to cookie', error)
        fallback.set(value)
      }
    },
    clear: () => {
      try {
        deleteCookie(key)
      } catch (error) {
        console.warn('[auth2][storage] Failed to clear cookie', error)
      } finally {
        fallback.clear()
      }
    },
  }
}
