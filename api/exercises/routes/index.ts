import express, { Request, Response } from 'express'
import { ExerciseServices } from '../services'

const router  = express.Router()
const exerciseService = new ExerciseServices()

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.body) {
      if (req.isAuthenticated()) {
      const exercisesPayload = req.body
      const { exerciseName, targetMuscle, video, secondaryMuscles } = exercisesPayload

      await exerciseService.createExercise(exerciseName, targetMuscle, video, secondaryMuscles)

      res.sendStatus(200)
    } else {
        res.sendStatus(500).json({
          message: "Error: Request body is missing",
        })
      }
    }
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong creating a new user.",
      error: e
    })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      const allExercises = await exerciseService.getAllExercises()

      res.status(200).json({
        allExercises
      })
    }

  } catch (e) {
    res.status(500).json({
      message: "Something went wrong getting all exercises.",
      error: e
    })
  }
})

router.get('/:exerciseId', async (req: Request<{ exerciseId: string}>, res: Response) => {
  const { exerciseId } = req.params

  try {
    if (req.isAuthenticated()) {
      if (exerciseId) {
        const exerciseIdInt = parseInt(exerciseId)
        const exercise = await exerciseService.getExerciseById(exerciseIdInt)
  
        res.status(200).json({
          exercise
        })
     
      } else {
        res.sendStatus(500).json({
          message: "Error: Request body is missing",
        })
      }
    }

  } catch(e) {
    res.status(500).json({
      message: "Something went wrong getting exerciseID.",
      error: e
    })
  }
})

export default router