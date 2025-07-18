import { http, HttpResponse } from 'msw'
import type { InventoryItem } from '../models/InventoryItem'

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Office Chair Pro',
    quantity: 25,
    price: 299.99,
    category: 'Furniture',
    description: 'Ergonomic office chair with lumbar support'
  },
  {
    id: '2',
    name: 'Standing Desk',
    quantity: 12,
    price: 599.99,
    category: 'Furniture',
    description: 'Height-adjustable standing desk'
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    quantity: 150,
    price: 49.99,
    category: 'Electronics',
    description: 'Bluetooth wireless mouse with precision tracking'
  },
  {
    id: '4',
    name: 'Monitor 27"',
    quantity: 30,
    price: 349.99,
    category: 'Electronics',
    description: '4K LED monitor with USB-C connectivity'
  },
  {
    id: '5',
    name: 'Notebook Set',
    quantity: 200,
    price: 15.99,
    category: 'Stationery',
    description: 'Pack of 3 premium notebooks'
  },
  {
    id: '6',
    name: 'Coffee Mug',
    quantity: 75,
    price: 12.99,
    category: 'Office Supplies',
    description: 'Ceramic coffee mug with company logo'
  }
]

export const handlers = [
  // Get all inventory items
  http.get('/api/inventory/items', () => {
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
  http.post('/api/inventory/items', async ({ request }) => {
    const newItem = await request.json() as Omit<InventoryItem, 'id'>
    const item: InventoryItem = {
      id: String(mockInventoryItems.length + 1),
      ...newItem
    }
    mockInventoryItems.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // Update inventory item
  http.put('/api/inventory/items/:id', async ({ params, request }) => {
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
  http.delete('/api/inventory/items/:id', ({ params }) => {
    const { id } = params
    const itemIndex = mockInventoryItems.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockInventoryItems.splice(itemIndex, 1)
    return new HttpResponse(null, { status: 204 })
  })
]