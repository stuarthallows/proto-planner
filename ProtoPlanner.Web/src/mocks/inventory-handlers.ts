import { http, HttpResponse } from 'msw'
import type { InventoryItem } from '../models/InventoryItem'

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Office Chair Pro',
    quantity: 25
  },
  {
    id: '2',
    name: 'Standing Desk',
    quantity: 12
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    quantity: 150
  },
  {
    id: '4',
    name: 'Monitor 27"',
    quantity: 30
  },
  {
    id: '5',
    name: 'Notebook Set',
    quantity: 200
  },
  {
    id: '6',
    name: 'Coffee Mug',
    quantity: 75
  }
]

export const handlers = [
  // Get all inventory items
  http.get('/api/inventory/inventory', () => {
    return HttpResponse.json(mockInventoryItems)
  }),

  // Get single inventory item
  http.get('/api/inventory/items/:id', ({ params }) => {
    const { id } = params
    const item = mockInventoryItems.find(item => item.id === id)
    
    if (!item) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(item)
  }),

  // Add new inventory item
  http.post('/api/inventory/inventory/items', async ({ request }) => {
    const newItem = await request.json() as Omit<InventoryItem, 'id'>
    const item: InventoryItem = {
      id: String(mockInventoryItems.length + 1),
      ...newItem
    }
    mockInventoryItems.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Update inventory item
  http.put('/api/inventory/inventory/items/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json() as Partial<InventoryItem>
    const itemIndex = mockInventoryItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockInventoryItems[itemIndex] = { ...mockInventoryItems[itemIndex], ...updates }
    return HttpResponse.json(mockInventoryItems[itemIndex])
  }),

  // Delete inventory item
  http.delete('/api/inventory/inventory/items/:id', ({ params }) => {
    const { id } = params
    const itemIndex = mockInventoryItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockInventoryItems.splice(itemIndex, 1)
    return new HttpResponse(null, { status: 204 })
  })
]