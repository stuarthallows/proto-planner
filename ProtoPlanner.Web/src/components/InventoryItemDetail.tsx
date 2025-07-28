import { useEffect, useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { InventoryItem } from "../models/InventoryItem"
import { Button } from "@/components/ui/button"

function InventoryItemDetail() {
  const { id } = useParams({ from: "/inventory/$id" })
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventoryItem = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/inventory/inventory/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory item: ${response.status}`)
      }
      
      const itemData = await response.json()
      setItem(itemData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory item")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryItem()
  }, [id])

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", className: "bg-red-100 text-red-800" }
    if (quantity < 10) return { text: "Low Stock", className: "bg-yellow-100 text-yellow-800" }
    return { text: "In Stock", className: "bg-green-100 text-green-800" }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center p-8">
          <div>Loading inventory item...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link to="/inventory">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchInventoryItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link to="/inventory">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Inventory item not found.</p>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus(item.quantity)

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/inventory">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">📦 Inventory Item Details</h1>
      </div>
      
      <div className="bg-white border rounded-lg p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item ID
            </label>
            <div className="font-mono text-sm bg-gray-50 p-3 rounded border">
              {item.id}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="text-lg font-medium bg-gray-50 p-3 rounded border">
              {item.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="text-2xl font-bold bg-gray-50 p-3 rounded border">
              {item.quantity}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <div>
              <span className={`px-3 py-2 rounded-full text-sm font-medium ${stockStatus.className}`}>
                {stockStatus.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryItemDetail