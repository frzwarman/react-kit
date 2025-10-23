export function createUrqlAuthExchange(
  getToken: () => string | null,
  options?: {
    tokenType?: string
    refreshToken?: () => Promise<void>
    onTokenExpired?: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    willAuthError?: (params: { authState: any; operation: any }) => boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    didAuthError?: (params: { error: any; operation: any }) => boolean
  },
) {
  const tokenType = options?.tokenType ?? 'Bearer'

  // Avoid direct dependency on @urql/exchange-auth. Return a factory that accepts it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authExchange: any) =>
    authExchange({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addAuthToOperation: ({ authState, operation }: any) => {
        const token = authState?.token ?? getToken()
        if (!token) return operation

        const fetchOptions =
          typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {}

        return {
          ...operation,
          context: {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: `${tokenType} ${token}`,
              },
            },
          },
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getAuth: async ({ authState }: any) => {
        if (!authState) {
          const token = getToken()
          if (token) return { token }
          return null
        }

        if (options?.refreshToken) {
          try {
            await options.refreshToken()
            const token = getToken()
            if (token) return { token }
          } catch (_e) {
            options.onTokenExpired?.()
            return null
          }
        }
        return null
      },
      willAuthError: options?.willAuthError,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didAuthError: (params: { error: any; operation: any }) => {
        if (options?.didAuthError) return options.didAuthError(params)
        const { error } = params
        return (
          error?.graphQLErrors?.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.extensions?.code === 'UNAUTHENTICATED',
          ) || error?.response?.status === 401
        )
      },
    })
}
