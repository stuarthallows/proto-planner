import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { cn } from '@/lib/utils'

/**
 * Root layout component that provides the main navigation and layout structure for the application
 */
export function RootLayout() {
  const matchRoute = useMatchRoute()
  
  const isInventoryActive = matchRoute({ to: '/inventory' })
  const isOrdersActive = matchRoute({ to: '/orders' })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Proto Planner</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  to="/inventory"
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isInventoryActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  📦 Inventory
                </Link>
                <Link
                  to="/orders"
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isOrdersActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  📋 Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
      
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </div>
  )
}