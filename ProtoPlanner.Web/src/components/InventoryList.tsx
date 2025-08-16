import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useInventoryItems } from "../hooks/useInventory"
import { InventoryEditPanel } from "./InventoryEditPanel"

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return { text: "Out of Stock" }
  if (quantity < 10) return { text: "Low Stock" }
  return { text: "In Stock" }
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

/**
 * Inventory list component that displays and manages inventory items
 */
function InventoryList() {
  const { data: items = [], isLoading: loading, error, refetch } = useInventoryItems()
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined)

  const handleAddItem = () => {
    setSelectedItemId(undefined)
    setPanelOpen(true)
  }

  const handleEditItem = (itemId: string) => {
    setSelectedItemId(itemId)
    setPanelOpen(true)
  }

  const handleItemSaved = () => {
    refetch()
  }

  const handleItemDeleted = () => {
    refetch()
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
          <p className="text-red-600 mb-4">Error: {error.message}</p>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">📦 Inventory</h1>
          <p className="text-gray-600 mt-2">Total Items: {items.length}</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
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
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleEditItem(item.id)}
                  >
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
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <InventoryEditPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        itemId={selectedItemId}
        onItemSaved={handleItemSaved}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  )
}

export { InventoryList }