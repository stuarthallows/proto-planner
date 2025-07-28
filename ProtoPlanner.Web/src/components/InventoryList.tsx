import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import type { InventoryItem } from "../models/InventoryItem"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/**
 * Inventory list component that displays and manages inventory items
 */
function InventoryList() {
  const [items, setItems] = useState<Array<InventoryItem>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventoryItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/inventory/inventory")
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`)
      }
      
      const itemsData = await response.json()
      setItems(itemsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryItems()
  }, [])

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", className: "stock-out" }
    if (quantity < 10) return { text: "Low Stock", className: "stock-low" }
    return { text: "In Stock", className: "stock-good" }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center p-8">
          <div>Loading inventory...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchInventoryItems}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const getStockStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return "bg-red-100 text-red-800"
    }
    if (quantity < 10) {
      return "bg-yellow-100 text-yellow-800"
    }
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">📦 Inventory</h1>
        <p className="text-gray-600 mt-2">Total Items: {items.length}</p>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No inventory items found.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const stockStatus = getStockStatus(item.quantity)
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                    <Link to="/inventory/$id" params={{ id: item.id }} className="contents">
                      <TableCell className="font-mono text-sm">
                        {item.id.length > 8 ? `${item.id.substring(0, 8)}...` : item.id}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusBadge(item.quantity)}`}>
                          {stockStatus.text}
                        </span>
                      </TableCell>
                    </Link>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default InventoryList