import express, { Request, Response } from 'express'
import { createUser } from '../services'
import { UserPayload } from '../models'
import bcrypt from 'bcrypt';
// import passport from '../authentication';


const router  = express.Router()

// router.post('/create', async (req: Request, res: Response) => {
//   try {
//     if (req.body) {
//       const userPayload: UserPayload = req.body
//       // createUser(userPayload)
//       res.sendStatus(200)
//       res.end()
//     }
//   } catch (e) {
//     res.status(500).json({
//       message: "Something went wrong creating a new user.",
//       error: e
//     })
//   }
// })

router.post('/signup', async (req: Request, res: Response, next) => {
  const userPayload: UserPayload = req.body
  const salt = await bcrypt.genSalt(16)

  bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
    if (err) { return next(err) }
    try {
      if (req.body) {
        req.body.password = hashedPassword

        createUser(userPayload, salt)

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

// router.get('/', (req: Request, res: Response) => {
//   res.sendStatus(200)
// })

// router.post('/login/password', passport.authenticate('local', {
//   successReturnToOrRedirect: '/',
//   failureRedirect: '/login',
//   failureMessage: true
// })

// );

export default router