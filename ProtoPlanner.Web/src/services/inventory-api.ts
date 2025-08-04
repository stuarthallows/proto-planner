import type { InventoryItem } from '../models/InventoryItem'
import { apiRequest } from './api-client'

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