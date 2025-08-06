import { createRootRoute, createRoute } from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './components/HomePage'
import InventoryList from './components/InventoryList'
import InventoryItemDetail from './components/InventoryItemDetail'
import InventoryItemForm from './components/InventoryItemForm'
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

export const inventoryNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory/new',
  component: InventoryItemForm,
})

export const inventoryItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory/$id',
  component: InventoryItemDetail,
})

export const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersList,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  inventoryRoute,
  inventoryNewRoute,
  inventoryItemRoute,
  ordersRoute,
])