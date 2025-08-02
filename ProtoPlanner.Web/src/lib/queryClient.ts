import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../services/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times, but not on 4xx errors
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors) from our API
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 3
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once, but not on 4xx errors
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors) from our API
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        // Retry once (failureCount 0 = first failure, allow retry)
        return failureCount === 0
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})