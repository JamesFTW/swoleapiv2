import express, { Request, Response } from 'express'
import { UserExercisesServices } from '../services'

const router = express.Router()
const userExerciseService = new UserExercisesServices()

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (req.body) {
      if (req.isAuthenticated()) {
        const { exerciseId, userId, weightMoved, reps } = req.body

        await userExerciseService.create(exerciseId, userId, weightMoved, reps)

        res.sendStatus(200)
      } else {
        res.status(500).json({
          message: 'Error: Request is not authenticated',
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong creating a new user exercise.',
      error: error,
    })
  }
})

router.get('/:userid/:exerciseid', async (req: Request, res: Response) => {
  const { userid, exerciseid } = req.params

  try {
    if (req.isAuthenticated()) {
      const userExercise = await userExerciseService.getUserExercises(parseInt(exerciseid), userid)
      res.status(200).json({
        userExercise,
      })
    } else {
      res.status(500).json({
        message: 'Error: Request is not authenticated',
      })
    }
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong we getting userexercise for userid: ${userid} exerciseid: ${exerciseid}`,
      error: error,
    })
  }
})

export default router
