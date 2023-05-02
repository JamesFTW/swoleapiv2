import express, { Request, Response } from 'express'
import { createExercise } from '../services'
import { ExercisesPayload } from '../models'

const router  = express.Router()

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const exercisesPayload: ExercisesPayload = req.body
      createExercise(exercisesPayload)
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