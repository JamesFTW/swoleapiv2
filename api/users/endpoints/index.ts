import bcrypt                         from 'bcrypt';
import express, { Request, Response } from 'express'
import { UsersServices }              from '../services'
import { UserPayload }                from '../models'
import passport                       from '../authentication';

const router  = express.Router()

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
    } catch (e) {
      res.status(500).json({
        message: "Something went wrong creating a new user.",
        error: e
      })
    }
  })

})

router.get('/', (req: Request, res: Response) => {
  //figure out how I want to handle succesful login
  res.sendStatus(200)
})

router.get('/login', (req: Request, res: Response) => {
  //figure out how I want to handle failed login
  res.sendStatus(200)
})

router.post('/login/password', passport.authenticate('local', { 
    successReturnToOrRedirect: '/api/users/',
    failureRedirect: '/api/users/login', 
    failureMessage: true 
  })
);


export default router