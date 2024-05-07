import express, { Request, Response } from 'express'
import { UserExercisesServices } from '../services/userExerciseServices'
import { authenticate } from '@middleware/authenticate'

const router = express.Router()
const userExerciseService = new UserExercisesServices()

router.post('/create', authenticate, async (req: Request, res: Response) => {
  try {
    const { exerciseId, userId, workoutId, userExerciseSetData } = req.body

    //workoutId will be generated by the frontend

    await userExerciseService.create(exerciseId, userId, workoutId, userExerciseSetData)

    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong creating a new user exercise.',
      error: error,
    })
  }
})

router.get('/:userid/:exerciseid', authenticate, async (req: Request, res: Response) => {
  const { userid, exerciseid } = req.params

  try {
    const userExercise = await userExerciseService.getUserExercises(parseInt(exerciseid), userid)
    res.status(200).json({
      userExercise,
    })
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong we getting userexercise for userid: ${userid} exerciseid: ${exerciseid}`,
      error: error,
    })
  }
})

export default router
