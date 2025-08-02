import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useOrders } from "../hooks/useOrders"

/**
 * Orders list component that displays and manages customer orders
 */
function OrdersList() {
  const { data: orders = [], isLoading: loading, error, refetch } = useOrders()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">
          <p>Error: {error.message}</p>
        </div>
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">📋 Orders</h1>
        <p className="text-gray-600 mt-2">Total Orders: {orders.length}</p>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell className="font-medium">{order.description}</TableCell>
                <TableCell>{order.count}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  )
}

export { OrdersList }