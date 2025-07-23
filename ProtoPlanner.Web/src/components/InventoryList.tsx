import { useEffect, useState } from "react"
import type { InventoryItem } from "../models/InventoryItem"

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
      const response = await fetch("api/inventory/inventory")
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`)
      }
      
      const itemsData = await response.json()
      setItems(itemsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory")
      console.error("Error fetching inventory:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryItems()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", className: "stock-out" }
    if (quantity < 10) return { text: "Low Stock", className: "stock-low" }
    return { text: "In Stock", className: "stock-good" }
  }

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Loading inventory...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchInventoryItems}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <h1>📦 Inventory Management</h1>
        <p>Total Items: {items.length}</p>
      </header>
      
      <div className="inventory-grid">
        {items.map((item) => {
          const stockStatus = getStockStatus(item.quantity)
          return (
            <div key={item.id} className="inventory-card">
              <div className="card-header">
                <h3>{item.name}</h3>
                <span className={`stock-badge ${stockStatus.className}`}>
                  {stockStatus.text}
                </span>
              </div>
              
              <div className="card-content">
                <p className="description">{item.description}</p>
                <div className="item-details">
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span className="value">{item.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Quantity:</span>
                    <span className="value">{item.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Price:</span>
                    <span className="value price">{formatPrice(item.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {items.length === 0 && (
        <div className="empty-state">
          <p>No inventory items found.</p>
        </div>
      )}
    </div>
  )
}

export default InventoryList