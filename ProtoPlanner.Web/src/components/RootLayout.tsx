import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '../theme/theme-toggle'

/**
 * Root layout component that provides the main navigation and layout structure for the application
 */
export function RootLayout() {
  const matchRoute = useMatchRoute()
  
  const isInventoryActive = matchRoute({ to: '/inventory' })
  const isOrdersActive = matchRoute({ to: '/orders' })

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-foreground">Proto Planner</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  to="/inventory"
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isInventoryActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  📦 Inventory
                </Link>
                <Link
                  to="/orders"
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isOrdersActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  📋 Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
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