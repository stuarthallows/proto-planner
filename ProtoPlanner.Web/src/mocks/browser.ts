import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW worker with inventory API handlers
export const worker = setupWorker(...handlers)