import { setupServer } from 'msw/node'
import { handlers } from '../mocks/inventory-handlers'

export const server = setupServer(...handlers)