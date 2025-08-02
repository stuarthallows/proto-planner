import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../services/api'
import { queryKeys } from '../lib/queryKeys'
import type { InventoryItem } from '../models/InventoryItem'

// Queries
export function useInventoryItems() {
  return useQuery({
    queryKey: queryKeys.inventory.lists(),
    queryFn: inventoryApi.getItems,
  })
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => inventoryApi.getItem(id),
    enabled: Boolean(id),
  })
}

// Mutations
export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inventoryApi.createItem,
    onSuccess: (newItem) => {
      // Update the list cache with the new item
      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.lists(),
        (oldData) => oldData ? [...oldData, newItem] : [newItem]
      )
      
      // Set the individual item cache
      queryClient.setQueryData(queryKeys.inventory.detail(newItem.id), newItem)
    },
    onError: (error) => {
      console.error('Failed to create inventory item:', error)
    },
  })
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<InventoryItem>) =>
      inventoryApi.updateItem(id, data),
    onSuccess: (updatedItem) => {
      // Update the list cache
      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.lists(),
        (oldData) =>
          oldData?.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || []
      )
      
      // Update the individual item cache
      queryClient.setQueryData(queryKeys.inventory.detail(updatedItem.id), updatedItem)
    },
    onError: (error) => {
      console.error('Failed to update inventory item:', error)
    },
  })
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inventoryApi.deleteItem,
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.lists(),
        (oldData) => oldData?.filter((item) => item.id !== deletedId) || []
      )
      
      // Remove from individual item cache
      queryClient.removeQueries({ queryKey: queryKeys.inventory.detail(deletedId) })
    },
    onError: (error) => {
      console.error('Failed to delete inventory item:', error)
    },
  })
}