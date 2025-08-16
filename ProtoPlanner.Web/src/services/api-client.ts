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
      async (_request, _options, response) => {
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
  }
})
