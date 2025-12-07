export function createApolloAuthLink(
  getToken: () => string | null,
  options?: {
    tokenType?: string
  },
) {
  const tokenType = options?.tokenType ?? 'Bearer'

  // This requires @apollo/client to be installed
  // We'll return a function that creates the link to avoid direct dependency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ApolloLink: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ApolloLink((operation: any, forward: any) => {
      const token = getToken()

      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operation.setContext(({ headers = {} }: any) => ({
          headers: {
            ...headers,
            authorization: `${tokenType} ${token}`,
          },
        }))
      }

      return forward(operation)
    })
  }
}
