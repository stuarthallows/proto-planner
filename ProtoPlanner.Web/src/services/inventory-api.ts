import type { InventoryItem } from '../models/InventoryItem'
import { api } from './api-client'

export const inventoryApi = {
  getItems: () =>
    api.get('inventory/inventory').json<InventoryItem[]>(),

  getItem: (id: string) =>
    api.get(`inventory/inventory/${id}`).json<InventoryItem>(),

  createItem: (item: Omit<InventoryItem, 'id'>) =>
    api.post('inventory/inventory', {
      json: {
        id: crypto.randomUUID(),
        ...item,
      },
    }).json<InventoryItem>(),

  updateItem: (id: string, item: Partial<InventoryItem>) =>
    api.put(`inventory/inventory/${id}`, {
      json: { id, ...item },
    }).json<InventoryItem>(),

  deleteItem: (id: string) =>
    api.delete(`inventory/inventory/${id}`).json<void>(),
}