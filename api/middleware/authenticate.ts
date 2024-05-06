import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS_CODES } from '../config/http.config'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
    error: 'Unauthorized',
    message: 'You are not authorized to access this resource.',
  })
}
