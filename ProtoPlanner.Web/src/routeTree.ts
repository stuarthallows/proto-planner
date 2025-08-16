import { createRootRoute, createRoute } from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './components/HomePage'
import { InventoryList } from './components/InventoryList'
import { OrdersList } from './components/OrdersList'

export const rootRoute = createRootRoute({
  component: RootLayout,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

export const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryList,
})


export const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersList,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  inventoryRoute,
  ordersRoute,
])