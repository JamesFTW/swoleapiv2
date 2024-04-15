import { Session } from 'express-session'
import { UUID } from 'uuid'

declare module 'express-session' {
  export interface SessionData {
    passport?: {
      userId: UUID
      userName: string
      [key: string]: string | UUID
    }
  }
}
