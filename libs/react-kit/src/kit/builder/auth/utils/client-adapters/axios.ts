export function createAxiosAuthInterceptor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axiosInstance: any,
  getToken: () => string | null,
  options?: {
    tokenType?: string
    onTokenExpired?: () => void
    refreshToken?: () => Promise<void>
  },
) {
  const tokenType = options?.tokenType ?? 'Bearer'

  // Request interceptor
  axiosInstance.interceptors.request.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (config: any) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `${tokenType} ${token}`
      }
      return config
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => Promise.reject(error),
  )

  // Response interceptor for token refresh
  if (options?.refreshToken) {
    axiosInstance.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: any) => {
        const originalRequest = error.config

        // If token expired and we haven't retried yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          options.refreshToken
        ) {
          originalRequest._retry = true

          try {
            await options.refreshToken()
            const token = getToken()
            if (token) {
              originalRequest.headers.Authorization = `${tokenType} ${token}`
            }
            return axiosInstance(originalRequest)
          } catch (refreshError) {
            options.onTokenExpired?.()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }
}
