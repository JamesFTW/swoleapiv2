import bcrypt                         from 'bcrypt'
import express, { Request, Response } from 'express'
import { UsersServices }              from '../services'
import { UserPayload }                from '../models'
import passport                       from '../authentication'
import { validationResult }           from 'express-validator'

const router  = express.Router()
const usersServices = new UsersServices()

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

router.post('/signup',
  usersServices.createEmailChain(),
  usersServices.createUserChain(),
  usersServices.createUserPasswordChain(),
    async (
      req: Request,
      res: Response,
      next
    ) => {

    const userPayload: UserPayload = req.body
    const salt: string = await bcrypt.genSalt(16)

    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) { return next(err) }
      try {
        if (req.body) {
          req.body.password = hashedPassword

          await usersServices.createUser(userPayload, salt)
      
          res.sendStatus(200)
          res.end()
        }
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong creating a new user.",
          errors: error,
          validationResult: validationResult(req)
        })
      }
    })
})

router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/api/users/login/success',
    failureRedirect: '/api/users/login/failed',
    failureMessage: true 
  })
)

router.get('/login/success', (req: Request, res: Response) => {
  const { session, sessionID } = req

  if (req.isAuthenticated()) {
    res.status(200).json({
      session,
      sessionID,
    })
  }
})

router.get('/login/failed', (req: Request, res: Response) => {
  res.status(500).json({
    message: "Username or Password is invalid"
  })
})

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