export function createAuthFetch(
  getToken: () => string | null,
  options?: {
    tokenType?: string
    onTokenExpired?: () => void
    refreshToken?: () => Promise<void>
  },
): typeof fetch {
  const tokenType = options?.tokenType ?? 'Bearer'

  return async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const token = getToken()
    const headers = new Headers(init?.headers)

    if (token) {
      headers.set('Authorization', `${tokenType} ${token}`)
    }

    const response = await fetch(input, {
      ...init,
      headers,
    })

    // Handle token expiration
    if (response.status === 401 && options?.refreshToken) {
      try {
        await options.refreshToken()
        const newToken = getToken()

        if (newToken) {
          headers.set('Authorization', `${tokenType} ${newToken}`)
          return await fetch(input, {
            ...init,
            headers,
          })
        }
      } catch (error) {
        options.onTokenExpired?.()
        throw error
      }
    }

    return response
  }
}
