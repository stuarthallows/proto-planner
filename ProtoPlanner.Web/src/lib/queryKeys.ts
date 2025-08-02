// Centralized query key factory for consistent cache management

export const queryKeys = {
  // Inventory keys
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => 
      [...queryKeys.inventory.lists(), { filters }] as const,
    details: () => [...queryKeys.inventory.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
  },
  
  // Orders keys
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => 
      [...queryKeys.orders.lists(), { filters }] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  
  // Sales keys (future expansion)
  sales: {
    all: ['sales'] as const,
    analytics: () => [...queryKeys.sales.all, 'analytics'] as const,
    reports: () => [...queryKeys.sales.all, 'reports'] as const,
  },
} as const

// Helper function to invalidate all related queries
export const getInvalidationKeys = {
  // Invalidate all inventory-related queries
  allInventory: () => queryKeys.inventory.all,
  
  // Invalidate all orders-related queries
  allOrders: () => queryKeys.orders.all,
  
  // Invalidate specific inventory item and lists
  inventoryItem: (id: string) => [
    queryKeys.inventory.detail(id),
    queryKeys.inventory.lists(),
  ],
  
  // Invalidate specific order and lists
  order: (id: string) => [
    queryKeys.orders.detail(id),
    queryKeys.orders.lists(),
  ],
}