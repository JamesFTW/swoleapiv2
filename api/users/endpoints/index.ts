import bcrypt                         from 'bcrypt';
import express, { Request, Response } from 'express'
import { UsersServices }              from '../services'
import { UserPayload }                from '../models'
import passport                       from '../authentication';

const router  = express.Router()

router.get('/', (req: Request, res: Response) => {
  try {
    req.isAuthenticated()
      ? res.sendStatus(200)
      : res.sendStatus(403)
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when getting user profile.",
      error: error
    })
  }
})

router.get('/login/success', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200)
  }
})

router.post('/signup', async (req: Request, res: Response, next) => {
  const userPayload: UserPayload = req.body
  const salt: string = await bcrypt.genSalt(16)

  bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
    if (err) { return next(err) }
    try {
      if (req.body) {
        const usersServices = new UsersServices()
        req.body.password = hashedPassword

        usersServices.createUser(userPayload, salt)

        res.sendStatus(200)
        res.end()
      }
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong creating a new user.",
        error: error
      })
    }
  })
})

router.post('/login/password', passport.authenticate('local', { 
    successReturnToOrRedirect: '/api/users/login/success',
    failureRedirect: '/api/users/login/failed',
    failureMessage: true 
  })
)

router.post('/logout', (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      res.status(500).json({
        message: "Something went wrong when logging out.",
        error: error
      })
    }
    res.sendStatus(204)
  })
})

export default router