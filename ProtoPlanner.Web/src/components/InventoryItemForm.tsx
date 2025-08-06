import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateInventoryItem } from '../hooks/useInventory'

export default function InventoryItemForm() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const navigate = useNavigate()
  const createItemMutation = useCreateInventoryItem()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Please enter an item name')
      return
    }

    const quantityNum = parseInt(quantity, 10)
    if (isNaN(quantityNum) || quantityNum < 0) {
      alert('Please enter a valid quantity (0 or greater)')
      return
    }

    try {
      await createItemMutation.mutateAsync({
        name: name.trim(),
        quantity: quantityNum
      })
      
      // Navigate back to inventory list on success
      navigate({ to: '/inventory' })
    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create item. Please try again.')
    }
  }

  const handleCancel = () => {
    navigate({ to: '/inventory' })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">📦 Add New Inventory Item</h1>
      </div>

      <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              disabled={createItemMutation.isPending}
              className="text-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              disabled={createItemMutation.isPending}
              className="text-2xl font-bold"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={createItemMutation.isPending}
              >
                {createItemMutation.isPending ? 'Creating...' : 'Create Item'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={createItemMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}