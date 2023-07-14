import express, { Request, Response } from 'express'
import { ExerciseServices } from '../services'

const router  = express.Router()
const exerciseService = new ExerciseServices()

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const exercisesPayload = req.body
      const { exerciseName, targetMuscle, video, secondaryMuscles } = exercisesPayload

      await exerciseService.createExercise(exerciseName, targetMuscle, video, secondaryMuscles)

      res.sendStatus(200)
    }
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong creating a new user.",
      error: e
    })
  }
})

export default router