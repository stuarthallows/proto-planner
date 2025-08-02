import type { InventoryItem } from '../models/InventoryItem'
import type { Order } from '../models/Order'

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

// Generic API request handler
async function apiRequest<T>(
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

export const inventoryApi = {
  getItems: () =>
    apiRequest<InventoryItem[]>('/inventory/inventory'),

  getItem: (id: string) =>
    apiRequest<InventoryItem>(`/inventory/inventory/${id}`),

  createItem: (item: Omit<InventoryItem, 'id'>) =>
    apiRequest<InventoryItem>('/inventory/inventory', {
      method: 'POST',
      body: JSON.stringify({
        id: crypto.randomUUID(),
        ...item,
      }),
    }),

  updateItem: (id: string, item: Partial<InventoryItem>) =>
    apiRequest<InventoryItem>(`/inventory/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...item }),
    }),

  deleteItem: (id: string) =>
    apiRequest<void>(`/inventory/inventory/${id}`, {
      method: 'DELETE',
    }),
}

export const salesApi = {
  getOrders: () =>
    apiRequest<Order[]>('/sales/orders'),
}