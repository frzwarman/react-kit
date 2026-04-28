export class SimpleEncryption {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  async encrypt(text: string): Promise<string> {
    if (!crypto?.subtle) {
      console.warn('[auth2][storage] Crypto API not available, storing unencrypted')
      return text
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const keyData = encoder.encode(this.key.padEnd(32, '0').slice(0, 32))

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt'],
      )

      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data,
      )

      const result = new Uint8Array(iv.length + encrypted.byteLength)
      result.set(iv, 0)
      result.set(new Uint8Array(encrypted), iv.length)

      return btoa(String.fromCharCode(...result))
    } catch (error) {
      console.error('[auth2][storage] Encryption failed:', error)
      return text
    }
  }

  async decrypt(encrypted: string): Promise<string> {
    if (!crypto?.subtle) {
      console.warn('[auth2][storage] Crypto API not available, reading unencrypted')
      return encrypted
    }

    try {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      const keyData = encoder.encode(this.key.padEnd(32, '0').slice(0, 32))

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt'],
      )

      const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
      const iv = data.slice(0, 12)
      const encryptedData = data.slice(12)

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedData,
      )

      return decoder.decode(decrypted)
    } catch (error) {
      console.error('[auth2][storage] Decryption failed:', error)
      return encrypted
    }
  }
}
