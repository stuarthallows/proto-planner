import { setupWorker } from 'msw/browser'
import { handlers as inventoryHandlers } from './inventory-handlers'

export const worker = setupWorker(...inventoryHandlers)
export { inventoryHandlers as handlers }