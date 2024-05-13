import express, { Request, Response } from 'express'
import { authenticate } from '@middleware/authenticate'
import { UserExercisesServices } from '../services/userExerciseServices'

const router = express.Router()
const userExerciseService = new UserExercisesServices()

router.post('/create', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.session?.passport?.user
    const userExerciseData = req.body

    await userExerciseService.create(userId, userExerciseData)

    res.sendStatus(200)
  } catch (error: any) {
    res.status(500).json({
      message: 'Something went wrong creating a new user exercise.',
      error: error.message,
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
