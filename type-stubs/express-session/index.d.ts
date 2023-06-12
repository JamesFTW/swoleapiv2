import { Session } from 'express-session'

declare module 'express-session' {
  export interface SessionData {
    passport?: {
      userId: string;
      userName: string;
      [key: string]: string;
    }
  }
}
