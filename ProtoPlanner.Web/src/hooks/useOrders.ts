import { useQuery } from '@tanstack/react-query'
import { salesApi } from '../services/api'
import { queryKeys } from '../lib/queryKeys'

// Queries
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.lists(),
    queryFn: salesApi.getOrders,
  })
}