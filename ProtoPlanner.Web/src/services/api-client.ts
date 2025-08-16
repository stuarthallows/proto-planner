import ky from 'ky'

const API_BASE = '/api'

// ProblemDetails interface (RFC 7807)
export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  [key: string]: unknown
}

// Custom error class to preserve HTTP status and ProblemDetails
export class ApiError extends Error {
  status: number
  statusText: string
  problemDetails?: ProblemDetails

  constructor(
    status: number,
    statusText: string,
    problemDetails?: ProblemDetails,
    message?: string
  ) {
    super(
      message || 
      problemDetails?.detail || 
      problemDetails?.title || 
      `API Error ${status}: ${statusText}`
    )
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.problemDetails = problemDetails
  }
}

// Create Ky instance with base configuration
export const api = ky.create({
  prefixUrl: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        // Convert Ky HTTPError to our custom ApiError for consistency
        if (!response.ok) {
          let problemDetails: ProblemDetails | undefined

          try {
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              problemDetails = await response.json()
            }
          } catch {
            // If parsing fails, we'll use default error handling
          }

          throw new ApiError(response.status, response.statusText, problemDetails)
        }
      }
    ]
  },
  // Prepare for future features - timeout, retry can be added here
  timeout: 30000,
})

// Legacy function for backwards compatibility during migration
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let problemDetails: ProblemDetails | undefined

    // Try to parse ProblemDetails from response
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        problemDetails = await response.json()
      }
    } catch {
      // If parsing fails, we'll use default error handling
    }

    throw new ApiError(response.status, response.statusText, problemDetails)
  }

  return response.json()
}