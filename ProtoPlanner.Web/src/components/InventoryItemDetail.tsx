import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Edit2, Save, X, Plus, Trash2 } from "lucide-react"
import type { InventoryItem } from "../models/InventoryItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function InventoryItemDetail() {
  const params = useParams({ strict: false })
  const navigate = useNavigate()
  const id = params.id as string | undefined
  const isAddMode = id === "new" || !id
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(!isAddMode)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(isAddMode)
  const [editedName, setEditedName] = useState<string>("")
  const [editedQuantity, setEditedQuantity] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

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
    if (!isAddMode && id) {
      fetchInventoryItem()
    }
  }, [id, isAddMode])

  const handleEdit = () => {
    if (item) {
      setEditedName(item.name)
      setEditedQuantity(item.quantity.toString())
      setIsEditing(true)
      setSaveError(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedName("")
    setEditedQuantity("")
    setSaveError(null)
  }

  const handleDelete = async () => {
    if (!item || isAddMode) return

    try {
      setIsDeleting(true)
      setSaveError(null)

      const response = await fetch(`/api/inventory/inventory/${item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`)
      }

      // Navigate back to inventory list after successful deletion
      navigate({ to: '/inventory' })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to delete item")
    } finally {
      setIsDeleting(false)
    }
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

    try {
      setIsSaving(true)
      setSaveError(null)

      if (isAddMode) {
        // Create new item
        const response = await fetch('/api/inventory/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            name: editedName.trim(),
            quantity: newQuantity
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to create item: ${response.status}`)
        }

        const createdItem = await response.json()
        // Navigate to the detail view of the created item
        navigate({ to: '/inventory/$id', params: { id: createdItem.id } })
      } else {
        // Update existing item
        if (!item) return

        const response = await fetch(`/api/inventory/inventory/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            name: editedName.trim(),
            quantity: newQuantity
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to update item: ${response.status}`)
        }

        const updatedItem = await response.json()
        setItem(updatedItem)
        setIsEditing(false)
        setEditedName("")
        setEditedQuantity("")
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

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

  if (!item && !isAddMode) {
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

  const currentQuantity = isEditing ? parseInt(editedQuantity) || 0 : (item?.quantity || 0)
  const stockStatus = getStockStatus(currentQuantity)

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/inventory">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {isAddMode ? "📦 Add New Inventory Item" : "📦 Inventory Item Details"}
        </h1>
      </div>
      
      <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
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
            {!isEditing ? (
              <div className="text-lg font-medium bg-gray-50 p-3 rounded border">
                {item?.name || ""}
              </div>
            ) : (
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-lg font-medium"
                disabled={isSaving}
                placeholder="Enter item name"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            {!isEditing ? (
              <div className="text-2xl font-bold bg-gray-50 p-3 rounded border">
                {item?.quantity || 0}
              </div>
            ) : (
              <Input
                type="number"
                min="0"
                value={editedQuantity}
                onChange={(e) => setEditedQuantity(e.target.value)}
                className="text-2xl font-bold"
                disabled={isSaving}
                placeholder="Enter quantity"
              />
            )}
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

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-start">
            {/* Left side - Delete button */}
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

            {/* Right side - Edit/Save/Cancel buttons */}
            <div>
              {!isEditing ? (
                <Button onClick={handleEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
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
              )}
            </div>
          </div>
          {saveError && (
            <p className="text-red-600 text-sm mt-2">{saveError}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryItemDetail
