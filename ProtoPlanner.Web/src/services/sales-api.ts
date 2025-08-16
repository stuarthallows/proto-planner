import type { Order } from '../models/Order'
import { api } from './api-client'

export const salesApi = {
  getOrders: () =>
    api.get('sales/orders').json<Order[]>(),
}