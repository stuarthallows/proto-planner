import type { Order } from '../models/Order'
import { apiRequest } from './api-client'

export const salesApi = {
  getOrders: () =>
    apiRequest<Order[]>('/sales/orders'),
}