import { useState, useEffect } from "react"
import { Plus, Save, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { 
  useInventoryItem, 
  useCreateInventoryItem, 
  useUpdateInventoryItem, 
  useDeleteInventoryItem 
} from "../hooks/useInventory"

interface InventoryEditPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId?: string
  onItemSaved?: () => void
  onItemDeleted?: () => void
}

function InventoryEditPanel({ 
  open, 
  onOpenChange, 
  itemId, 
  onItemSaved, 
  onItemDeleted 
}: InventoryEditPanelProps) {
  const isAddMode = !itemId
  
  // Query and mutations
  const { data: item, isLoading: loading, error } = useInventoryItem(itemId || "")
  const createMutation = useCreateInventoryItem()
  const updateMutation = useUpdateInventoryItem()
  const deleteMutation = useDeleteInventoryItem()
  
  // Component state
  const [editedName, setEditedName] = useState<string>("")
  const [editedQuantity, setEditedQuantity] = useState<string>("")
  const [saveError, setSaveError] = useState<string | null>(null)
  
  // Computed states
  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  // Reset form when opening/closing or changing items
  useEffect(() => {
    if (open) {
      if (isAddMode) {
        setEditedName("")
        setEditedQuantity("")
      } else if (item) {
        setEditedName(item.name)
        setEditedQuantity(item.quantity.toString())
      }
      setSaveError(null)
    }
  }, [open, item, isAddMode])

  const handleCancel = () => {
    onOpenChange(false)
    setEditedName("")
    setEditedQuantity("")
    setSaveError(null)
  }

  const handleDelete = async () => {
    if (!item || isAddMode) return

    setSaveError(null)
    
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        onOpenChange(false)
        onItemDeleted?.()
      },
      onError: (err) => {
        setSaveError(err instanceof Error ? err.message : "Failed to delete item")
      },
    })
  }

  const handleSave = async () => {
    // Validation
    if (!editedName.trim()) {
      setSaveError("Name is required")
      return
    }

    const newQuantity = parseInt(editedQuantity)
    if (isNaN(newQuantity) || newQuantity < 0) {
      setSaveError("Quantity must be a number greater than or equal to 0")
      return
    }

    setSaveError(null)

    if (isAddMode) {
      // Create new item
      createMutation.mutate(
        {
          name: editedName.trim(),
          quantity: newQuantity,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            onItemSaved?.()
          },
          onError: (err) => {
            setSaveError(err instanceof Error ? err.message : "Failed to create item")
          },
        }
      )
    } else {
      // Update existing item
      if (!item) return

      updateMutation.mutate(
        {
          id: item.id,
          name: editedName.trim(),
          quantity: newQuantity,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            onItemSaved?.()
          },
          onError: (err) => {
            setSaveError(err instanceof Error ? err.message : "Failed to update item")
          },
        }
      )
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", className: "bg-red-100 text-red-800" }
    if (quantity < 10) return { text: "Low Stock", className: "bg-yellow-100 text-yellow-800" }
    return { text: "In Stock", className: "bg-green-100 text-green-800" }
  }

  const currentQuantity = parseInt(editedQuantity) || 0
  const stockStatus = getStockStatus(currentQuantity)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {isAddMode ? "📦 Add New Inventory Item" : "📦 Edit Inventory Item"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && !isAddMode ? (
            <div className="flex items-center justify-center p-8">
              <div>Loading inventory item...</div>
            </div>
          ) : error && !isAddMode ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {error.message}</p>
            </div>
          ) : (
            <div className="space-y-6 px-4">
              {!isAddMode && item && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item ID
                  </label>
                  <div className="font-mono text-sm bg-gray-50 p-3 rounded border">
                    {item.id}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-lg font-medium"
                  disabled={isSaving || isDeleting}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="0"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  className="text-2xl font-bold"
                  disabled={isSaving || isDeleting}
                  placeholder="Enter quantity"
                />
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

              {saveError && (
                <p className="text-red-600 text-sm">{saveError}</p>
              )}
            </div>
          )}
        </div>

        <SheetFooter className="flex-col gap-2">
          <div className="flex justify-between w-full">
            {/* Delete button */}
            <div>
              {!isAddMode && item && (
                <Button 
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isSaving || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>Deleting...</>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Save/Cancel buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isDeleting}
              >
                {isSaving ? (
                  <>{isAddMode ? "Creating..." : "Saving..."}</>
                ) : (
                  <>
                    {isAddMode ? (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Item
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline" 
                disabled={isSaving || isDeleting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { InventoryEditPanel }