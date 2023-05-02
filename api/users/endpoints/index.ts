import express, { Request, Response } from 'express'
import { createUser } from '../services'
import { UserPayload } from '../models'

const router  = express.Router()

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const userPayload: UserPayload = req.body
      createUser(userPayload)
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

export default router