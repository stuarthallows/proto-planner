// Barrel export file for all API services
// Re-exports from individual API modules for backward compatibility

// Shared API utilities
export { type ProblemDetails, ApiError } from './api-client'

// Domain-specific APIs
export { inventoryApi } from './inventory-api'
export { salesApi } from './sales-api'